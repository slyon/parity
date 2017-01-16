// Copyright 2015, 2016 Ethcore (UK) Ltd.
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

//! Tendermint message handling.

use util::*;
use super::{Height, Round, BlockHash, Step};
use error::Error;
use header::Header;
use rlp::*;
use ethkey::{recover, public_to_address};

/// Message transmitted between consensus participants.
#[derive(Debug, PartialEq, Eq, Clone, Hash)]
pub struct ConsensusMessage {
	pub vote_step: VoteStep,
	pub block_hash: Option<BlockHash>,
	pub signature: H520,
}

/// Complete step of the consensus process.
#[derive(Debug, PartialEq, Eq, Clone, Hash)]
pub struct VoteStep {
	pub height: Height,
	pub round: Round,
	pub step: Step,
}

impl VoteStep {
	pub fn new(height: Height, round: Round, step: Step) -> Self {
		VoteStep { height: height, round: round, step: step }
	}

	pub fn is_height(&self, height: Height) -> bool {
		self.height == height
	}

	pub fn is_round(&self, height: Height, round: Round) -> bool {
		self.height == height && self.round == round
	}
}

fn consensus_round(header: &Header) -> Result<Round, ::rlp::DecoderError> {
	let round_rlp = header.seal().get(0).expect("seal passed basic verification; seal has 3 fields; qed");
	UntrustedRlp::new(round_rlp.as_slice()).as_val()
}

impl ConsensusMessage {
	pub fn new(signature: H520, height: Height, round: Round, step: Step, block_hash: Option<BlockHash>) -> Self {
		ConsensusMessage {
			signature: signature,
			block_hash: block_hash,
			vote_step: VoteStep::new(height, round, step),
		}
	}

	pub fn new_proposal(header: &Header) -> Result<Self, ::rlp::DecoderError> {
		Ok(ConsensusMessage {
			vote_step: VoteStep::new(header.number() as Height, consensus_round(header)?, Step::Propose),
			signature: UntrustedRlp::new(header.seal().get(1).expect("seal passed basic verification; seal has 3 fields; qed").as_slice()).as_val()?,
			block_hash: Some(header.bare_hash()),
		})
	}

	pub fn new_commit(proposal: &ConsensusMessage, signature: H520) -> Self {
		let mut vote_step = proposal.vote_step.clone();
		vote_step.step = Step::Precommit;
		ConsensusMessage {
			vote_step: vote_step,
			block_hash: proposal.block_hash,
			signature: signature,
		}
	}

	pub fn verify(&self) -> Result<Address, Error> {
		let full_rlp = ::rlp::encode(self);
		let block_info = Rlp::new(&full_rlp).at(1);
		let public_key = recover(&self.signature.into(), &block_info.as_raw().sha3())?;
		Ok(public_to_address(&public_key))
	}

	pub fn precommit_hash(&self) -> H256 {
		let mut vote_step = self.vote_step.clone();
		vote_step.step = Step::Precommit;
		message_info_rlp(&vote_step, self.block_hash).sha3()
	}
}

impl PartialOrd for VoteStep {
	fn partial_cmp(&self, m: &VoteStep) -> Option<Ordering> {
		Some(self.cmp(m))
	}
}

impl Ord for VoteStep {
	fn cmp(&self, m: &VoteStep) -> Ordering {
		if self.height != m.height {
			self.height.cmp(&m.height)
		} else if self.round != m.round {
			self.round.cmp(&m.round)
		} else {
			self.step.number().cmp(&m.step.number())
		}
	}
}

impl Step {
	fn number(&self) -> u8 {
		match *self {
			Step::Propose => 0,
			Step::Prevote => 1,
			Step::Precommit => 2,
			Step::Commit => 3,
		}
	}
}

impl Decodable for Step {
	fn decode<D>(decoder: &D) -> Result<Self, DecoderError> where D: Decoder {
		match decoder.as_rlp().as_val()? {
			0u8 => Ok(Step::Propose),
			1 => Ok(Step::Prevote),
			2 => Ok(Step::Precommit),
			_ => Err(DecoderError::Custom("Invalid step.")),
		}
	}
}

impl Encodable for Step {
	fn rlp_append(&self, s: &mut RlpStream) {
		s.append(&self.number());
	}
}

/// (signature, (height, round, step, block_hash))
impl Decodable for ConsensusMessage {
	fn decode<D>(decoder: &D) -> Result<Self, DecoderError> where D: Decoder {
		let rlp = decoder.as_rlp();
		let m = rlp.at(1)?;
		let block_message: H256 = m.val_at(3)?;
		Ok(ConsensusMessage {
			vote_step: VoteStep::new(m.val_at(0)?, m.val_at(1)?, m.val_at(2)?),
			block_hash: match block_message.is_zero() {
				true => None,
				false => Some(block_message),
			},
			signature: rlp.val_at(0)?,
		})
  }
}

impl Encodable for ConsensusMessage {
	fn rlp_append(&self, s: &mut RlpStream) {
		let info = message_info_rlp(&self.vote_step, self.block_hash);
		s.begin_list(2)
			.append(&self.signature)
			.append_raw(&info, 1);
	}
}

pub fn message_info_rlp(vote_step: &VoteStep, block_hash: Option<BlockHash>) -> Bytes {
	// TODO: figure out whats wrong with nested list encoding
	let mut s = RlpStream::new_list(5);
	s.append(&vote_step.height).append(&vote_step.round).append(&vote_step.step).append(&block_hash.unwrap_or_else(H256::zero));
	s.out()
}

pub fn message_full_rlp(signature: &H520, vote_info: &Bytes) -> Bytes {
	let mut s = RlpStream::new_list(2);
	s.append(signature).append_raw(vote_info, 1);
	s.out()
}

#[cfg(test)]
mod tests {
	use util::*;
	use rlp::*;
	use super::super::Step;
	use super::*;
	use account_provider::AccountProvider;
	use header::Header;
	use ethkey::Secret;

	#[test]
	fn encode_decode() {
		let message = ConsensusMessage {
			signature: H520::default(),	
			vote_step: VoteStep {
				height: 10,
				round: 123,
				step: Step::Precommit,
			},
			block_hash: Some("1".sha3())
		};
		let raw_rlp = ::rlp::encode(&message).to_vec();
		let rlp = Rlp::new(&raw_rlp);
		assert_eq!(message, rlp.as_val());

		let message = ConsensusMessage {
			signature: H520::default(),	
			vote_step: VoteStep {
				height: 1314,
				round: 0,
				step: Step::Prevote,
			},
			block_hash: None
		};
		let raw_rlp = ::rlp::encode(&message);
		let rlp = Rlp::new(&raw_rlp);
		assert_eq!(message, rlp.as_val());
	}

	#[test]
	fn generate_and_verify() {
		let tap = Arc::new(AccountProvider::transient_provider());
		let addr = tap.insert_account(Secret::from_slice(&"0".sha3()).unwrap(), "0").unwrap();
		tap.unlock_account_permanently(addr, "0".into()).unwrap();

		let mi = message_info_rlp(&VoteStep::new(123, 2, Step::Precommit), Some(H256::default()));

		let raw_rlp = message_full_rlp(&tap.sign(addr, None, mi.sha3()).unwrap().into(), &mi);

		let rlp = UntrustedRlp::new(&raw_rlp);
		let message: ConsensusMessage = rlp.as_val().unwrap();
		match message.verify() { Ok(a) if a == addr => {}, _ => panic!(), };
	}

	#[test]
	fn proposal_message() {
		let mut header = Header::default();
		let seal = vec![
			::rlp::encode(&0u8).to_vec(),
			::rlp::encode(&H520::default()).to_vec(),
			Vec::new()
		];
		header.set_seal(seal);
		let message = ConsensusMessage::new_proposal(&header).unwrap();
		assert_eq!(
			message,
			ConsensusMessage {
				signature: Default::default(),
				vote_step: VoteStep {
					height: 0,
					round: 0,
					step: Step::Propose,
				},
				block_hash: Some(header.bare_hash())
			}
		);
	}

	#[test]
	fn message_info_from_header() {
		let header = Header::default();
		let pro = ConsensusMessage {
			signature: Default::default(),
			vote_step: VoteStep::new(0, 0, Step::Propose),
			block_hash: Some(header.bare_hash())
		};
		let pre = message_info_rlp(&VoteStep::new(0, 0, Step::Precommit), Some(header.bare_hash()));

		assert_eq!(pro.precommit_hash(), pre.sha3());
	}
}
