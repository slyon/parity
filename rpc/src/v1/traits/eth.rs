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

//! Eth rpc interface.
use jsonrpc_core::Error;
use jsonrpc_macros::Trailing;

use futures::BoxFuture;

use v1::types::{RichBlock, BlockNumber, Bytes, CallRequest, Filter, FilterChanges, Index};
use v1::types::{Log, Receipt, SyncStatus, Transaction, Work};
use v1::types::{H64, H160, H256, U256};

build_rpc_trait! {
	/// Eth rpc interface.
	pub trait Eth {
		type Metadata;

		/// Returns protocol version encoded as a string (quotes are necessary).
		#[rpc(name = "eth_protocolVersion")]
		fn protocol_version(&self) -> Result<String, Error>;

		/// Returns an object with data about the sync status or false. (wtf?)
		#[rpc(name = "eth_syncing")]
		fn syncing(&self) -> Result<SyncStatus, Error>;

		/// Returns the number of hashes per second that the node is mining with.
		#[rpc(name = "eth_hashrate")]
		fn hashrate(&self) -> Result<U256, Error>;

		/// Returns block author.
		#[rpc(name = "eth_coinbase")]
		fn author(&self) -> Result<H160, Error>;

		/// Returns true if client is actively mining new blocks.
		#[rpc(name = "eth_mining")]
		fn is_mining(&self) -> Result<bool, Error>;

		/// Returns current gas_price.
		#[rpc(name = "eth_gasPrice")]
		fn gas_price(&self) -> Result<U256, Error>;

		/// Returns accounts list.
		#[rpc(meta, name = "eth_accounts")]
		fn accounts(&self, Self::Metadata) -> BoxFuture<Vec<H160>, Error>;

		/// Returns highest block number.
		#[rpc(name = "eth_blockNumber")]
		fn block_number(&self) -> Result<U256, Error>;

		/// Returns balance of the given account.
		#[rpc(name = "eth_getBalance")]
		fn balance(&self, H160, Trailing<BlockNumber>) -> Result<U256, Error>;

		/// Returns content of the storage at given address.
		#[rpc(name = "eth_getStorageAt")]
		fn storage_at(&self, H160, U256, Trailing<BlockNumber>) -> Result<H256, Error>;

		/// Returns block with given hash.
		#[rpc(name = "eth_getBlockByHash")]
		fn block_by_hash(&self, H256, bool) -> Result<Option<RichBlock>, Error>;

		/// Returns block with given number.
		#[rpc(name = "eth_getBlockByNumber")]
		fn block_by_number(&self, BlockNumber, bool) -> Result<Option<RichBlock>, Error>;

		/// Returns the number of transactions sent from given address at given time (block number).
		#[rpc(name = "eth_getTransactionCount")]
		fn transaction_count(&self, H160, Trailing<BlockNumber>) -> Result<U256, Error>;

		/// Returns the number of transactions in a block with given hash.
		#[rpc(name = "eth_getBlockTransactionCountByHash")]
		fn block_transaction_count_by_hash(&self, H256) -> Result<Option<U256>, Error>;

		/// Returns the number of transactions in a block with given block number.
		#[rpc(name = "eth_getBlockTransactionCountByNumber")]
		fn block_transaction_count_by_number(&self, BlockNumber) -> Result<Option<U256>, Error>;

		/// Returns the number of uncles in a block with given hash.
		#[rpc(name = "eth_getUncleCountByBlockHash")]
		fn block_uncles_count_by_hash(&self, H256) -> Result<Option<U256>, Error>;

		/// Returns the number of uncles in a block with given block number.
		#[rpc(name = "eth_getUncleCountByBlockNumber")]
		fn block_uncles_count_by_number(&self, BlockNumber) -> Result<Option<U256>, Error>;

		/// Returns the code at given address at given time (block number).
		#[rpc(name = "eth_getCode")]
		fn code_at(&self, H160, Trailing<BlockNumber>) -> Result<Bytes, Error>;

		/// Sends signed transaction, returning its hash.
		#[rpc(name = "eth_sendRawTransaction")]
		fn send_raw_transaction(&self, Bytes) -> Result<H256, Error>;

		/// Alias of `eth_sendRawTransaction`.
		#[rpc(name = "eth_submitTransaction")]
		fn submit_transaction(&self, Bytes) -> Result<H256, Error>;

		/// Call contract, returning the output data.
		#[rpc(name = "eth_call")]
		fn call(&self, CallRequest, Trailing<BlockNumber>) -> Result<Bytes, Error>;

		/// Estimate gas needed for execution of given contract.
		#[rpc(name = "eth_estimateGas")]
		fn estimate_gas(&self, CallRequest, Trailing<BlockNumber>) -> Result<U256, Error>;

		/// Get transaction by its hash.
		#[rpc(name = "eth_getTransactionByHash")]
		fn transaction_by_hash(&self, H256) -> Result<Option<Transaction>, Error>;

		/// Returns transaction at given block hash and index.
		#[rpc(name = "eth_getTransactionByBlockHashAndIndex")]
		fn transaction_by_block_hash_and_index(&self, H256, Index) -> Result<Option<Transaction>, Error>;

		/// Returns transaction by given block number and index.
		#[rpc(name = "eth_getTransactionByBlockNumberAndIndex")]
		fn transaction_by_block_number_and_index(&self, BlockNumber, Index) -> Result<Option<Transaction>, Error>;

		/// Returns transaction receipt.
		#[rpc(name = "eth_getTransactionReceipt")]
		fn transaction_receipt(&self, H256) -> Result<Option<Receipt>, Error>;

		/// Returns an uncles at given block and index.
		#[rpc(name = "eth_getUncleByBlockHashAndIndex")]
		fn uncle_by_block_hash_and_index(&self, H256, Index) -> Result<Option<RichBlock>, Error>;

		/// Returns an uncles at given block and index.
		#[rpc(name = "eth_getUncleByBlockNumberAndIndex")]
		fn uncle_by_block_number_and_index(&self, BlockNumber, Index) -> Result<Option<RichBlock>, Error>;

		/// Returns available compilers.
		#[rpc(name = "eth_getCompilers")]
		fn compilers(&self) -> Result<Vec<String>, Error>;

		/// Compiles lll code.
		#[rpc(name = "eth_compileLLL")]
		fn compile_lll(&self, String) -> Result<Bytes, Error>;

		/// Compiles solidity.
		#[rpc(name = "eth_compileSolidity")]
		fn compile_solidity(&self, String) -> Result<Bytes, Error>;

		/// Compiles serpent.
		#[rpc(name = "eth_compileSerpent")]
		fn compile_serpent(&self, String) -> Result<Bytes, Error>;

		/// Returns logs matching given filter object.
		#[rpc(name = "eth_getLogs")]
		fn logs(&self, Filter) -> Result<Vec<Log>, Error>;

		/// Returns the hash of the current block, the seedHash, and the boundary condition to be met.
		#[rpc(name = "eth_getWork")]
		fn work(&self, Trailing<u64>) -> Result<Work, Error>;

		/// Used for submitting a proof-of-work solution.
		#[rpc(name = "eth_submitWork")]
		fn submit_work(&self, H64, H256, H256) -> Result<bool, Error>;

		/// Used for submitting mining hashrate.
		#[rpc(name = "eth_submitHashrate")]
		fn submit_hashrate(&self, U256, H256) -> Result<bool, Error>;
	}
}

build_rpc_trait! {
	/// Eth filters rpc api (polling).
	// TODO: do filters api properly
	pub trait EthFilter {
		/// Returns id of new filter.
		#[rpc(name = "eth_newFilter")]
		fn new_filter(&self, Filter) -> Result<U256, Error>;

		/// Returns id of new block filter.
		#[rpc(name = "eth_newBlockFilter")]
		fn new_block_filter(&self) -> Result<U256, Error>;

		/// Returns id of new block filter.
		#[rpc(name = "eth_newPendingTransactionFilter")]
		fn new_pending_transaction_filter(&self) -> Result<U256, Error>;

		/// Returns filter changes since last poll.
		#[rpc(name = "eth_getFilterChanges")]
		fn filter_changes(&self, Index) -> Result<FilterChanges, Error>;

		/// Returns all logs matching given filter (in a range 'from' - 'to').
		#[rpc(name = "eth_getFilterLogs")]
		fn filter_logs(&self, Index) -> Result<Vec<Log>, Error>;

		/// Uninstalls filter.
		#[rpc(name = "eth_uninstallFilter")]
		fn uninstall_filter(&self, Index) -> Result<bool, Error>;
	}
}
