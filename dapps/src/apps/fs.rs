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

use std::io;
use std::io::Read;
use std::fs;
use std::path::{Path, PathBuf};
use page::{LocalPageEndpoint, PageCache};
use endpoint::{Endpoints, EndpointInfo};
use apps::manifest::{MANIFEST_FILENAME, deserialize_manifest};

struct LocalDapp {
	id: String,
	path: PathBuf,
	info: EndpointInfo,
}

/// Tries to find and read manifest file in given `path` to extract `EndpointInfo`
/// If manifest is not found sensible default `EndpointInfo` is returned based on given `name`.
fn read_manifest(name: &str, mut path: PathBuf) -> EndpointInfo {
	path.push(MANIFEST_FILENAME);

	fs::File::open(path.clone())
		.map_err(|e| format!("{:?}", e))
		.and_then(|mut f| {
			// Reat file
			let mut s = String::new();
			f.read_to_string(&mut s).map_err(|e| format!("{:?}", e))?;
			// Try to deserialize manifest
			deserialize_manifest(s)
		})
		.map(Into::into)
		.unwrap_or_else(|e| {
			warn!(target: "dapps", "Cannot read manifest file at: {:?}. Error: {:?}", path, e);

			EndpointInfo {
				name: name.into(),
				description: name.into(),
				version: "0.0.0".into(),
				author: "?".into(),
				icon_url: "icon.png".into(),
			}
		})
}

/// Returns Dapp Id and Local Dapp Endpoint for given filesystem path.
/// Parses the path to extract last component (for name).
/// `None` is returned when path is invalid or non-existent.
pub fn local_endpoint<P: AsRef<Path>>(path: P, signer_address: Option<(String, u16)>) -> Option<(String, Box<LocalPageEndpoint>)> {
	let path = path.as_ref().to_owned();
	path.canonicalize().ok().and_then(|path| {
		let name = path.file_name().and_then(|name| name.to_str());
		name.map(|name| {
			let dapp = local_dapp(name.into(), path.clone());
			(dapp.id, Box::new(LocalPageEndpoint::new(
				dapp.path, dapp.info, PageCache::Disabled, signer_address.clone())
			))
		})
	})
}


fn local_dapp(name: String, path: PathBuf) -> LocalDapp {
	// try to get manifest file
	let info = read_manifest(&name, path.clone());
	LocalDapp {
		id: name,
		path: path,
		info: info,
	}
}

/// Returns endpoints for Local Dapps found for given filesystem path.
/// Scans the directory and collects `LocalPageEndpoints`.
pub fn local_endpoints<P: AsRef<Path>>(dapps_path: P, signer_address: Option<(String, u16)>) -> Endpoints {
	let mut pages = Endpoints::new();
	for dapp in local_dapps(dapps_path.as_ref()) {
		pages.insert(
			dapp.id,
			Box::new(LocalPageEndpoint::new(dapp.path, dapp.info, PageCache::Disabled, signer_address.clone()))
		);
	}
	pages
}


fn local_dapps(dapps_path: &Path) -> Vec<LocalDapp> {
	let files = fs::read_dir(dapps_path);
	if let Err(e) = files {
		warn!(target: "dapps", "Unable to load local dapps from: {}. Reason: {:?}", dapps_path.display(), e);
		return vec![];
	}

	let files = files.expect("Check is done earlier");
	files.map(|dir| {
			let entry = dir?;
			let file_type = entry.file_type()?;

			// skip files
			if file_type.is_file() {
				return Err(io::Error::new(io::ErrorKind::NotFound, "Not a file"));
			}

			// take directory name and path
			entry.file_name().into_string()
				.map(|name| (name, entry.path()))
				.map_err(|e| {
					info!(target: "dapps", "Unable to load dapp: {:?}. Reason: {:?}", entry.path(), e);
					io::Error::new(io::ErrorKind::NotFound, "Invalid name")
				})
		})
		.filter_map(|m| {
			if let Err(ref e) = m {
				debug!(target: "dapps", "Ignoring local dapp: {:?}", e);
			}
			m.ok()
		})
		.map(|(name, path)| local_dapp(name, path))
		.collect()
}
