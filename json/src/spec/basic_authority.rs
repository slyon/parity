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

//! Authority params deserialization.

use uint::Uint;
use super::ValidatorSet;

/// Authority params deserialization.
#[derive(Debug, PartialEq, Deserialize)]
pub struct BasicAuthorityParams {
	/// Gas limit divisor.
	#[serde(rename="gasLimitBoundDivisor")]
	pub gas_limit_bound_divisor: Uint,
	/// Block duration.
	#[serde(rename="durationLimit")]
	pub duration_limit: Uint,
	/// Valid authorities
	pub validators: ValidatorSet,
}

/// Authority engine deserialization.
#[derive(Debug, PartialEq, Deserialize)]
pub struct BasicAuthority {
	/// Ethash params.
	pub params: BasicAuthorityParams,
}

#[cfg(test)]
mod tests {
	use serde_json;
	use spec::basic_authority::BasicAuthority;

	#[test]
	fn basic_authority_deserialization() {
		let s = r#"{
			"params": {
				"gasLimitBoundDivisor": "0x0400",
				"durationLimit": "0x0d",
				"validators" : {
					"list": ["0xc6d9d2cd449a754c494264e1809c50e34d64562b"]
				}
			}
		}"#;

		let _deserialized: BasicAuthority = serde_json::from_str(s).unwrap();
	}
}
