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

use std::sync::Arc;
use std::str::FromStr;
use util::{U256, Uint, Address, ToPretty};

use ethcore::account_provider::AccountProvider;
use ethcore::client::TestBlockChainClient;
use ethcore::transaction::{Transaction, Action};
use rlp::encode;

use serde_json;
use jsonrpc_core::IoHandler;
use v1::{SignerClient, Signer};
use v1::tests::helpers::TestMinerService;
use v1::helpers::{SigningQueue, SignerService, FilledTransactionRequest, ConfirmationPayload};

struct SignerTester {
	signer: Arc<SignerService>,
	accounts: Arc<AccountProvider>,
	io: IoHandler,
	miner: Arc<TestMinerService>,
	// these unused fields are necessary to keep the data alive
	// as the handler has only weak pointers.
	_client: Arc<TestBlockChainClient>,
}

fn blockchain_client() -> Arc<TestBlockChainClient> {
	let client = TestBlockChainClient::new();
	Arc::new(client)
}

fn accounts_provider() -> Arc<AccountProvider> {
	Arc::new(AccountProvider::transient_provider())
}

fn miner_service() -> Arc<TestMinerService> {
	Arc::new(TestMinerService::default())
}

fn signer_tester() -> SignerTester {
	let signer = Arc::new(SignerService::new_test(None));
	let accounts = accounts_provider();
	let client = blockchain_client();
	let miner = miner_service();

	let mut io = IoHandler::default();
	io.extend_with(SignerClient::new(&accounts, &client, &miner, &signer).to_delegate());

	SignerTester {
		signer: signer,
		accounts: accounts,
		io: io,
		miner: miner,
		_client: client,
	}
}


#[test]
fn should_return_list_of_items_to_confirm() {
	// given
	let tester = signer_tester();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: Address::from(1),
		to: Some(Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap()),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();
	tester.signer.add_request(ConfirmationPayload::Signature(1.into(), 5.into())).unwrap();

	// when
	let request = r#"{"jsonrpc":"2.0","method":"signer_requestsToConfirm","params":[],"id":1}"#;
	let response = concat!(
		r#"{"jsonrpc":"2.0","result":["#,
		r#"{"id":"0x1","payload":{"sendTransaction":{"data":"0x","from":"0x0000000000000000000000000000000000000001","gas":"0x989680","gasPrice":"0x2710","minBlock":null,"nonce":null,"to":"0xd46e8dd67c5d32be8058bb8eb970870f07244567","value":"0x1"}}},"#,
		r#"{"id":"0x2","payload":{"sign":{"address":"0x0000000000000000000000000000000000000001","hash":"0x0000000000000000000000000000000000000000000000000000000000000005"}}}"#,
		r#"],"id":1}"#
	);

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
}


#[test]
fn should_reject_transaction_from_queue_without_dispatching() {
	// given
	let tester = signer_tester();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: Address::from(1),
		to: Some(Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap()),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();
	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{"jsonrpc":"2.0","method":"signer_rejectRequest","params":["0x1"],"id":1}"#;
	let response = r#"{"jsonrpc":"2.0","result":true,"id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
	assert_eq!(tester.signer.requests().len(), 0);
	assert_eq!(tester.miner.imported_transactions.lock().len(), 0);
}

#[test]
fn should_not_remove_transaction_if_password_is_invalid() {
	// given
	let tester = signer_tester();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: Address::from(1),
		to: Some(Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap()),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();
	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{"jsonrpc":"2.0","method":"signer_confirmRequest","params":["0x1",{},"xxx"],"id":1}"#;
	let response = r#"{"jsonrpc":"2.0","error":{"code":-32021,"message":"Account password is invalid or account does not exist.","data":"SStore(InvalidAccount)"},"id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
	assert_eq!(tester.signer.requests().len(), 1);
}

#[test]
fn should_not_remove_sign_if_password_is_invalid() {
	// given
	let tester = signer_tester();
	tester.signer.add_request(ConfirmationPayload::Signature(0.into(), 5.into())).unwrap();
	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{"jsonrpc":"2.0","method":"signer_confirmRequest","params":["0x1",{},"xxx"],"id":1}"#;
	let response = r#"{"jsonrpc":"2.0","error":{"code":-32021,"message":"Account password is invalid or account does not exist.","data":"SStore(InvalidAccount)"},"id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
	assert_eq!(tester.signer.requests().len(), 1);
}

#[test]
fn should_confirm_transaction_and_dispatch() {
	//// given
	let tester = signer_tester();
	let address = tester.accounts.new_account("test").unwrap();
	let recipient = Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: address,
		to: Some(recipient),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();

	let t = Transaction {
		nonce: U256::zero(),
		gas_price: U256::from(0x1000),
		gas: U256::from(0x50505),
		action: Action::Call(recipient),
		value: U256::from(0x1),
		data: vec![]
	};
	tester.accounts.unlock_account_temporarily(address, "test".into()).unwrap();
	let signature = tester.accounts.sign(address, None, t.hash(None)).unwrap();
	let t = t.with_signature(signature, None);

	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{
		"jsonrpc":"2.0",
		"method":"signer_confirmRequest",
		"params":["0x1", {"gasPrice":"0x1000","gas":"0x50505"}, "test"],
		"id":1
	}"#;
	let response = r#"{"jsonrpc":"2.0","result":""#.to_owned() + format!("0x{:?}", t.hash()).as_ref() + r#"","id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
	assert_eq!(tester.signer.requests().len(), 0);
	assert_eq!(tester.miner.imported_transactions.lock().len(), 1);
}

#[test]
fn should_confirm_transaction_with_token() {
	// given
	let tester = signer_tester();
	let address = tester.accounts.new_account("test").unwrap();
	let recipient = Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: address,
		to: Some(recipient),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();

	let t = Transaction {
		nonce: U256::zero(),
		gas_price: U256::from(0x1000),
		gas: U256::from(10_000_000),
		action: Action::Call(recipient),
		value: U256::from(0x1),
		data: vec![]
	};
	let (signature, token) = tester.accounts.sign_with_token(address, "test".into(), t.hash(None)).unwrap();
	let t = t.with_signature(signature, None);

	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{
		"jsonrpc":"2.0",
		"method":"signer_confirmRequestWithToken",
		"params":["0x1", {"gasPrice":"0x1000"}, ""#.to_owned() + &token + r#""],
		"id":1
	}"#;
	let response = r#"{"jsonrpc":"2.0","result":{"result":""#.to_owned() +
		format!("0x{:?}", t.hash()).as_ref() +
		r#"","token":""#;

	// then
	let result = tester.io.handle_request_sync(&request).unwrap();
	assert!(result.starts_with(&response), "Should return correct result. Expected: {:?}, Got: {:?}", response, result);
	assert_eq!(tester.signer.requests().len(), 0);
	assert_eq!(tester.miner.imported_transactions.lock().len(), 1);
}

#[test]
fn should_confirm_transaction_with_rlp() {
	// given
	let tester = signer_tester();
	let address = tester.accounts.new_account("test").unwrap();
	let recipient = Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: address,
		to: Some(recipient),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();

	let t = Transaction {
		nonce: U256::zero(),
		gas_price: U256::from(0x1000),
		gas: U256::from(10_000_000),
		action: Action::Call(recipient),
		value: U256::from(0x1),
		data: vec![]
	};
	tester.accounts.unlock_account_temporarily(address, "test".into()).unwrap();
	let signature = tester.accounts.sign(address, None, t.hash(None)).unwrap();
	let t = t.with_signature(signature, None);
	let rlp = encode(&t);

	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{
		"jsonrpc":"2.0",
		"method":"signer_confirmRequestRaw",
		"params":["0x1", "0x"#.to_owned() + &rlp.to_hex() + r#""],
		"id":1
	}"#;
println!("{:?}", request);
	let response = r#"{"jsonrpc":"2.0","result":""#.to_owned() + format!("0x{:?}", t.hash()).as_ref() + r#"","id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
	assert_eq!(tester.signer.requests().len(), 0);
	assert_eq!(tester.miner.imported_transactions.lock().len(), 1);
}

#[test]
fn should_return_error_when_sender_does_not_match() {
	// given
	let tester = signer_tester();
	let address = tester.accounts.new_account("test").unwrap();
	let recipient = Address::from_str("d46e8dd67c5d32be8058bb8eb970870f07244567").unwrap();
	tester.signer.add_request(ConfirmationPayload::SendTransaction(FilledTransactionRequest {
		from: Address::default(),
		to: Some(recipient),
		gas_price: U256::from(10_000),
		gas: U256::from(10_000_000),
		value: U256::from(1),
		data: vec![],
		nonce: None,
		min_block: None,
	})).unwrap();

	let t = Transaction {
		nonce: U256::zero(),
		gas_price: U256::from(0x1000),
		gas: U256::from(10_000_000),
		action: Action::Call(recipient),
		value: U256::from(0x1),
		data: vec![]
	};
	tester.accounts.unlock_account_temporarily(address, "test".into()).unwrap();
	let signature = tester.accounts.sign(address, None, t.hash(None)).unwrap();
	let t = t.with_signature(signature, None);
	let rlp = encode(&t);

	assert_eq!(tester.signer.requests().len(), 1);

	// when
	let request = r#"{
		"jsonrpc":"2.0",
		"method":"signer_confirmRequestRaw",
		"params":["0x1", "0x"#.to_owned() + &rlp.to_hex() + r#""],
		"id":1
	}"#;
	let response = r#"{"jsonrpc":"2.0","error":{"code":-32602,"message":"Couldn't parse parameters: Sent transaction does not match the request.","data":"[\"from\"]"},"id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
	assert_eq!(tester.signer.requests().len(), 1);
}

#[test]
fn should_generate_new_token() {
	// given
	let tester = signer_tester();

	// when
	let request = r#"{
		"jsonrpc":"2.0",
		"method":"signer_generateAuthorizationToken",
		"params":[],
		"id":1
	}"#;
	let response = r#"{"jsonrpc":"2.0","result":"new_token","id":1}"#;

	// then
	assert_eq!(tester.io.handle_request_sync(&request), Some(response.to_owned()));
}

#[test]
fn should_generate_new_web_proxy_token() {
	use jsonrpc_core::{Response, Output, Value};
	// given
	let tester = signer_tester();

	// when
	let request = r#"{
		"jsonrpc":"2.0",
		"method":"signer_generateWebProxyAccessToken",
		"params":[],
		"id":1
	}"#;
	let response = tester.io.handle_request_sync(&request).unwrap();
	let result = serde_json::from_str(&response).unwrap();

	if let Response::Single(Output::Success(ref success)) = result {
		if let Value::String(ref token) = success.result {
			assert!(tester.signer.is_valid_web_proxy_access_token(&token), "It should return valid web proxy token.");
			return;
		}
	}

	assert!(false, "Expected successful response, got: {:?}", result);
}
