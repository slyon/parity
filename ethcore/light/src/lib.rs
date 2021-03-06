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

//! Light client logic and implementation.
//!
//! A "light" client stores very little chain-related data locally
//! unlike a full node, which stores all blocks, headers, receipts, and more.
//!
//! This enables the client to have a much lower resource footprint in
//! exchange for the cost of having to ask the network for state data
//! while responding to queries. This makes a light client unsuitable for
//! low-latency applications, but perfectly suitable for simple everyday
//! use-cases like sending transactions from a personal account.
//!
//! The light client performs a header-only sync, doing verification and pruning
//! historical blocks. Upon pruning, batches of 2048 blocks have a number => hash
//! mapping sealed into "canonical hash tries" which can later be used to verify
//! historical block queries from peers.

#![deny(missing_docs)]

pub mod client;
pub mod cht;
pub mod net;
pub mod on_demand;

#[cfg(not(feature = "ipc"))]
pub mod provider;

#[cfg(feature = "ipc")]
pub mod provider {
    #![allow(dead_code, unused_assignments, unused_variables, missing_docs)] // codegen issues
	include!(concat!(env!("OUT_DIR"), "/provider.rs"));
}

#[cfg(feature = "ipc")]
pub mod remote {
    pub use provider::LightProviderClient;
}

mod types;

pub use self::provider::Provider;
pub use types::les_request as request;

#[macro_use]
extern crate log;

extern crate ethcore;
extern crate ethcore_util as util;
extern crate ethcore_network as network;
extern crate ethcore_io as io;
extern crate rlp;
extern crate smallvec;
extern crate time;
extern crate futures;
extern crate rand;

#[cfg(feature = "ipc")]
extern crate ethcore_ipc as ipc;
