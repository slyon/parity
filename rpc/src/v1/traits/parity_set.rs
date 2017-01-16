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

//! Parity-specific rpc interface for operations altering the settings.

use jsonrpc_core::Error;
use futures::BoxFuture;

use v1::types::{Bytes, H160, H256, U256, ReleaseInfo};

build_rpc_trait! {
	/// Parity-specific rpc interface for operations altering the settings.
	pub trait ParitySet {
		/// Sets new minimal gas price for mined blocks.
		#[rpc(name = "parity_setMinGasPrice")]
		fn set_min_gas_price(&self, U256) -> Result<bool, Error>;

		/// Sets new gas floor target for mined blocks.
		#[rpc(name = "parity_setGasFloorTarget")]
		fn set_gas_floor_target(&self, U256) -> Result<bool, Error>;

		/// Sets new gas ceiling target for mined blocks.
		#[rpc(name = "parity_setGasCeilTarget")]
		fn set_gas_ceil_target(&self, U256) -> Result<bool, Error>;

		/// Sets new extra data for mined blocks.
		#[rpc(name = "parity_setExtraData")]
		fn set_extra_data(&self, Bytes) -> Result<bool, Error>;

		/// Sets new author for mined block.
		#[rpc(name = "parity_setAuthor")]
		fn set_author(&self, H160) -> Result<bool, Error>;

		/// Sets account for signing consensus messages.
		#[rpc(name = "parity_setEngineSigner")]
		fn set_engine_signer(&self, H160, String) -> Result<bool, Error>;

		/// Sets the limits for transaction queue.
		#[rpc(name = "parity_setTransactionsLimit")]
		fn set_transactions_limit(&self, usize) -> Result<bool, Error>;

		/// Sets the maximum amount of gas a single transaction may consume.
		#[rpc(name = "parity_setMaxTransactionGas")]
		fn set_tx_gas_limit(&self, U256) -> Result<bool, Error>;

		/// Add a reserved peer.
		#[rpc(name = "parity_addReservedPeer")]
		fn add_reserved_peer(&self, String) -> Result<bool, Error>;

		/// Remove a reserved peer.
		#[rpc(name = "parity_removeReservedPeer")]
		fn remove_reserved_peer(&self, String) -> Result<bool, Error>;

		/// Drop all non-reserved peers.
		#[rpc(name = "parity_dropNonReservedPeers")]
		fn drop_non_reserved_peers(&self) -> Result<bool, Error>;

		/// Accept non-reserved peers (default behavior)
		#[rpc(name = "parity_acceptNonReservedPeers")]
		fn accept_non_reserved_peers(&self) -> Result<bool, Error>;

		/// Start the network.
		///
		/// Deprecated. Use `set_mode("active")` instead.
		#[rpc(name = "parity_startNetwork")]
		fn start_network(&self) -> Result<bool, Error>;

		/// Stop the network.
		///
		/// Deprecated. Use `set_mode("offline")` instead.
		#[rpc(name = "parity_stopNetwork")]
		fn stop_network(&self) -> Result<bool, Error>;

		/// Set the mode. Argument must be one of: "active", "passive", "dark", "offline".
		#[rpc(name = "parity_setMode")]
		fn set_mode(&self, String) -> Result<bool, Error>;

		/// Hash a file content under given URL.
		#[rpc(async, name = "parity_hashContent")]
		fn hash_content(&self, String) -> BoxFuture<H256, Error>;

		/// Is there a release ready for install?
		#[rpc(name = "parity_upgradeReady")]
		fn upgrade_ready(&self) -> Result<Option<ReleaseInfo>, Error>;

		/// Execute a release which is ready according to upgrade_ready().
		#[rpc(name = "parity_executeUpgrade")]
		fn execute_upgrade(&self) -> Result<bool, Error>;
	}
}
