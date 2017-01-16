// Copyright 2015, 2016 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

//! Fetching

use std::{io, fmt};
use std::sync::Arc;
use std::sync::atomic::{self, AtomicBool};

use futures::{self, BoxFuture, Future};
use futures_cpupool::{CpuPool, CpuFuture};
use mime::{self, Mime};
use reqwest;

#[derive(Default, Debug, Clone)]
pub struct Abort(Arc<AtomicBool>);

impl Abort {
	pub fn is_aborted(&self) -> bool {
		self.0.load(atomic::Ordering::SeqCst)
	}
}

impl From<Arc<AtomicBool>> for Abort {
	fn from(a: Arc<AtomicBool>) -> Self {
		Abort(a)
	}
}

pub trait Fetch: Clone + Send + Sync + 'static {
	type Result: Future<Item=Response, Error=Error> + Send + 'static;

	fn new() -> Result<Self, Error> where Self: Sized;

	/// Spawn the future in context of this `Fetch` thread pool.
	/// Implementation is optional.
	fn process<F, I, E>(&self, f: F) -> BoxFuture<I, E> where
		F: Future<Item=I, Error=E> + Send + 'static,
		I: Send + 'static,
		E: Send + 'static,
	{
		f.boxed()
	}

	/// Fetch URL and get a future for the result.
	/// Supports aborting the request in the middle of execution.
	fn fetch_with_abort(&self, url: &str, abort: Abort) -> Self::Result;

	/// Fetch URL and get a future for the result.
	fn fetch(&self, url: &str) -> Self::Result {
		self.fetch_with_abort(url, Default::default())
	}

	/// Fetch URL and get the result synchronously.
	fn fetch_sync(&self, url: &str) -> Result<Response, Error> {
		self.fetch(url).wait()
	}

	/// Closes this client
	fn close(self) where Self: Sized {}
}

#[derive(Clone)]
pub struct Client {
	client: Arc<reqwest::Client>,
	pool: CpuPool,
	limit: Option<usize>,
}

impl Client {
	fn with_limit(limit: Option<usize>) -> Result<Self, Error> {
		let mut client = reqwest::Client::new()?;
		client.redirect(reqwest::RedirectPolicy::limited(5));

		Ok(Client {
			client: Arc::new(client),
			pool: CpuPool::new(4),
			limit: limit,
		})
	}
}

impl Fetch for Client {
	type Result = CpuFuture<Response, Error>;

	fn new() -> Result<Self, Error> {
		// Max 50MB will be downloaded.
		Self::with_limit(Some(50*1024*1024))
	}

	fn process<F, I, E>(&self, f: F) -> BoxFuture<I, E> where
		F: Future<Item=I, Error=E> + Send + 'static,
		I: Send + 'static,
		E: Send + 'static,
	{
		self.pool.spawn(f).boxed()
	}

	fn fetch_with_abort(&self, url: &str, abort: Abort) -> Self::Result {
		debug!(target: "fetch", "Fetching from: {:?}", url);

		self.pool.spawn(FetchTask {
			url: url.into(),
			client: self.client.clone(),
			limit: self.limit,
			abort: abort,
		})
	}
}

struct FetchTask {
	url: String,
	client: Arc<reqwest::Client>,
	limit: Option<usize>,
	abort: Abort,
}

impl Future for FetchTask {
	// TODO [ToDr] timeouts handling?
	type Item = Response;
	type Error = Error;

	fn poll(&mut self) -> futures::Poll<Self::Item, Self::Error> {
		if self.abort.is_aborted() {
			trace!(target: "fetch", "Fetch of {:?} aborted.", self.url);
			return Err(Error::Aborted);
		}

		trace!(target: "fetch", "Starting fetch task: {:?}", self.url);
		let result = self.client.get(&self.url)
						  .header(reqwest::header::UserAgent("Parity Fetch".into()))
						  .send()?;

		Ok(futures::Async::Ready(Response {
			inner: ResponseInner::Response(result),
			abort: self.abort.clone(),
			limit: self.limit,
			read: 0,
		}))
	}
}

#[derive(Debug)]
pub enum Error {
	Fetch(reqwest::Error),
	Aborted,
}

impl From<reqwest::Error> for Error {
	fn from(error: reqwest::Error) -> Self {
		Error::Fetch(error)
	}
}

enum ResponseInner {
	Response(reqwest::Response),
	Reader(Box<io::Read + Send>),
}

impl fmt::Debug for ResponseInner {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		match *self {
			ResponseInner::Response(ref response) => response.fmt(f),
			ResponseInner::Reader(_) => write!(f, "io Reader"),
		}
	}
}

#[derive(Debug)]
pub struct Response {
	inner: ResponseInner,
	abort: Abort,
	limit: Option<usize>,
	read: usize,
}

impl Response {
	pub fn from_reader<R: io::Read + Send + 'static>(reader: R) -> Self {
		Response {
			inner: ResponseInner::Reader(Box::new(reader)),
			abort: Abort::default(),
			limit: None,
			read: 0,
		}
	}

	pub fn status(&self) -> reqwest::StatusCode {
		match self.inner {
			ResponseInner::Response(ref r) => *r.status(),
			_ => reqwest::StatusCode::Ok,
		}
	}

	pub fn is_html(&self) -> bool {
		match self.content_type() {
			Some(Mime(mime::TopLevel::Text, mime::SubLevel::Html, _)) => true,
			_ => false,
		}
	}

	pub fn content_type(&self) -> Option<Mime> {
		match self.inner {
			ResponseInner::Response(ref r) => {
				let content_type = r.headers().get::<reqwest::header::ContentType>();
				content_type.map(|mime| mime.0.clone())
			},
			_ => None,
		}
	}
}

impl io::Read for Response {
	fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
		if self.abort.is_aborted() {
			return Err(io::Error::new(io::ErrorKind::ConnectionAborted, "Fetch aborted."));
		}

		let res = match self.inner {
			ResponseInner::Response(ref mut response) => response.read(buf),
			ResponseInner::Reader(ref mut reader) => reader.read(buf),
		};

		// increase bytes read
		if let Ok(read) = res {
			self.read += read;
		}

		// check limit
		match self.limit {
			Some(limit) if limit < self.read => {
				return Err(io::Error::new(io::ErrorKind::PermissionDenied, "Size limit reached."));
			},
			_ => {},
		}

		res
	}
}
