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

import { Address, Data, Hash, Quantity } from '../types';
import { fromDecimal } from '../helpers';

const SECTION_MINING = 'Block Authoring (aka "mining")';
const SECTION_DEV = 'Development';
const SECTION_NODE = 'Node Settings';
const SECTION_NET = 'Network Information';
const SECTION_ACCOUNTS = 'Accounts (read-only) and Signatures';

export default {
  accountsInfo: {
    section: SECTION_ACCOUNTS,
    desc: 'returns a map of accounts as an object',
    params: [],
    returns: {
      type: Array,
      desc: 'Account metadata',
      details: {
        name: {
          type: String,
          desc: 'Account name'
        }
      }
    }
  },

  chainStatus: {
    section: SECTION_NET,
    desc: 'Returns the information on warp sync blocks',
    params: [],
    returns: {
      type: Object,
      desc: 'The status object',
      details: {
        blockGap: {
          type: Array,
          desc: 'Describes the gap in the blockchain, if there is one: (first, last)',
          optional: true
        }
      }
    }
  },

  consensusCapability: {
    desc: 'Returns an object or string detailing the state of parity capability of maintaining consensus',
    params: [],
    returns: {
      type: Object,
      desc: 'Either "capable", {"capableUntil":N}, {"incapableSince":N} or "unknown" (N is a block number)'
    }
  },

  dappsPort: {
    section: SECTION_NODE,
    desc: 'Returns the port the dapps are running on, error if not enabled',
    params: [],
    returns: {
      type: Quantity,
      desc: 'The port number'
    }
  },

  dappsInterface: {
    section: SECTION_NODE,
    desc: 'Returns the interface the dapps are running on, error if not enabled',
    params: [],
    returns: {
      type: String,
      desc: 'The interface'
    }
  },

  defaultExtraData: {
    section: SECTION_MINING,
    desc: 'Returns the default extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data'
    }
  },

  devLogs: {
    section: SECTION_DEV,
    desc: 'Returns latest logs of your node',
    params: [],
    returns: {
      type: Array,
      desc: 'Development logs'
    }
  },

  devLogsLevels: {
    section: SECTION_DEV,
    desc: 'Returns current log level settings',
    params: [],
    returns: {
      type: String,
      decs: 'Current log level'
    }
  },

  enode: {
    section: SECTION_NODE,
    desc: 'Returns the node enode URI',
    params: [],
    returns: {
      type: String,
      desc: 'Enode URI'
    }
  },

  extraData: {
    section: SECTION_MINING,
    desc: 'Returns currently set extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data'
    }
  },

  gasFloorTarget: {
    section: SECTION_MINING,
    desc: 'Returns current target for gas floor.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Gas floor target.',
      format: 'outputBigNumberFormatter'
    }
  },

  gasCeilTarget: {
    section: SECTION_MINING,
    desc: 'Returns current target for gas ceiling.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Gas ceiling target.',
      format: 'outputBigNumberFormatter'
    }
  },

  gasPriceHistogram: {
    section: SECTION_NET,
    desc: 'Returns a snapshot of the historic gas prices',
    params: [],
    returns: {
      type: Object,
      desc: 'Historic values',
      details: {
        bucketBounds: {
          type: Array,
          desc: 'Array of U256 bound values'
        },
        count: {
          type: Array,
          desc: 'Array of U64 counts'
        }
      }
    }
  },

  generateSecretPhrase: {
    section: SECTION_ACCOUNTS,
    desc: 'Creates a secret phrase that can be associated with an account',
    params: [],
    returns: {
      type: String,
      desc: 'The secret phrase'
    }
  },

  getNewDappsWhitelist: {
    desc: 'Returns the list of accounts available to a new dapps',
    params: [],
    returns: {
      type: Array,
      desc: 'The list of available accounts'
    }
  },

  localTransactions: {
    desc: 'Returns an object of current and past local transactions.',
    params: [],
    returns: {
      type: Object,
      desc: 'Mapping of `tx hash` into status object.'
    }
  },

  minGasPrice: {
    section: SECTION_MINING,
    desc: 'Returns currently set minimal gas price',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Minimal Gas Price',
      format: 'outputBigNumberFormatter'
    }
  },

  mode: {
    section: SECTION_NODE,
    desc: 'Get the mode. Results one of: "active", "passive", "dark", "offline".',
    params: [],
    returns: {
      type: String,
      desc: 'The mode'
    }
  },

  netChain: {
    section: SECTION_NET,
    desc: 'Returns the name of the connected chain.',
    params: [],
    returns: {
      type: String,
      desc: 'chain name'
    }
  },

  netPeers: {
    section: SECTION_NET,
    desc: 'Returns number of peers.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Number of peers'
    }
  },

  netMaxPeers: {
    desc: 'Returns maximal number of peers.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Maximal number of peers'
    }
  },

  netPort: {
    section: SECTION_NET,
    desc: 'Returns network port the node is listening on.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Port Number'
    }
  },

  nextNonce: {
    section: SECTION_NET,
    desc: 'Returns next available nonce for transaction from given account. Includes pending block and transaction queue.',
    params: [
      {
        type: Address,
        desc: 'Account'
      }
    ],
    returns: {
      type: Quantity,
      desc: 'Next valid nonce'
    }
  },

  nodeName: {
    section: SECTION_NODE,
    desc: 'Returns node name (identity)',
    params: [],
    returns: {
      type: String,
      desc: 'Node name'
    }
  },

  pendingTransactions: {
    section: SECTION_NET,
    desc: 'Returns a list of transactions currently in the queue.',
    params: [],
    returns: {
      type: Array,
      desc: 'Transactions ordered by priority'
    }
  },

  pendingTransactionsStats: {
    desc: 'Returns propagation stats for transactions in the queue',
    params: [],
    returns: {
      type: Object,
      desc: 'mapping of `tx hash` into `stats`'
    }
  },

  phraseToAddress: {
    section: SECTION_ACCOUNTS,
    desc: 'Converts a secret phrase into the corresponding address',
    params: [
      {
        type: String,
        desc: 'The secret'
      }
    ],
    returns: {
      type: Address,
      desc: 'Corresponding address'
    }
  },

  releasesInfo: {
    desc: 'returns a ReleasesInfo object describing the current status of releases',
    params: [],
    returns: {
      type: Object,
      desc: '"fork":N,"minor":null,"this_fork":MN,"track":R} (N is a block number representing the latest known fork of this chain which may be in the future, MN is a block number representing the latest known fork that the currently running binary can sync past or null if not known, R is a ReleaseInfo object describing the latest release in this release track)'
    }
  },

  registryAddress: {
    section: SECTION_NET,
    desc: 'The address for the global registry',
    params: [],
    returns: {
      type: Address,
      desc: 'The registry address'
    }
  },

  rpcSettings: {
    section: SECTION_NET,
    desc: 'Returns basic settings of rpc (enabled, port, interface).',
    params: [],
    returns: {
      type: Object,
      desc: 'JSON object containing rpc settings'
    }
  },

  signerPort: {
    section: SECTION_NODE,
    desc: 'Returns the port the signer is running on, error if not enabled',
    params: [],
    returns: {
      type: Quantity,
      desc: 'The port number'
    }
  },

  transactionsLimit: {
    section: SECTION_MINING,
    desc: 'Changes limit for transactions in queue.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Current max number of transactions in queue',
      format: 'outputBigNumberFormatter'
    }
  },

  unsignedTransactionsCount: {
    section: SECTION_NET,
    desc: 'Returns number of unsigned transactions when running with Trusted Signer. Error otherwise',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Number of unsigned transactions'
    }
  },

  versionInfo: {
    desc: 'returns a VersionInfo object describing our current version',
    params: [],
    returns: {
      type: Object,
      desc: '{"hash":H,"track":T,"version":{"major":N,"minor":N,"patch":N}} (H is a 160-bit Git commit hash, T is a ReleaseTrack, either "stable", "beta", "nightly" or "unknown" and N is a version number)'
    }
  },

  listAccounts: {
    desc: 'TODO'
  },

  listStorageKeys: {
    desc: 'TODO'
  },

  encryptMessage: {
    desc: 'TODO'
  },

  futureTransactions: {
    desc: 'TODO'
  },

  /*
   * `parity_accounts` module methods
   * ================================
   */
  allAccountsInfo: {
    subdoc: 'accounts',
    desc: 'returns a map of accounts as an object.',
    params: [],
    returns: {
      type: Array,
      desc: 'Account metadata.',
      details: {
        name: {
          type: String,
          desc: 'Account name.'
        },
        meta: {
          type: String,
          desc: 'Encoded JSON string the defines additional account metadata.'
        },
        uuid: {
          type: String,
          desc: 'The account Uuid, or `null` if not available/unknown/not applicable.'
        }
      },
      example: {
        '0x00a289b43e1e4825dbedf2a78ba60a640634dc40': {
          meta: '{}',
          name: 'Foobar',
          uuid: '0b9e70e6-235b-682d-a15c-2a98c71b3945'
        }
      }
    }
  },

  newAccountFromPhrase: {
    subdoc: 'accounts',
    desc: 'Creates a new account from a recovery phrase.',
    params: [
      {
        type: String,
        desc: 'Recovery phrase.',
        example: 'stylus outing overhand dime radial seducing harmless uselessly evasive tastiness eradicate imperfect'
      },
      {
        type: String,
        desc: 'Password.',
        example: 'hunter2'
      }
    ],
    returns: {
      type: Address,
      desc: 'The created address.',
      example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
    }
  },

  newAccountFromSecret: {
    subdoc: 'accounts',
    desc: 'Creates a new account from a private ethstore secret key.',
    params: [
      {
        type: Data,
        desc: 'Secret, 32-byte hex',
        example: '0x1db2c0cf57505d0f4a3d589414f0a0025ca97421d2cd596a9486bc7e2cd2bf8b'
      },
      {
        type: String,
        desc: 'Password',
        example: 'hunter2'
      }
    ],
    returns: {
      type: Address,
      desc: 'The created address.',
      example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
    }
  },

  newAccountFromWallet: {
    subdoc: 'accounts',
    desc: 'Creates a new account from a JSON import',
    params: [
      {
        type: String,
        desc: 'JSON'
      },
      {
        type: String,
        desc: 'Password'
      }
    ],
    returns: {
      type: Address,
      desc: 'The created address'
    }
  },

  setAccountName: {
    subdoc: 'accounts',
    desc: 'Sets a name for the account',
    params: [
      {
        type: Address,
        desc: 'Address',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: String,
        desc: 'Name',
        example: 'Foobar'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  setAccountMeta: {
    subdoc: 'accounts',
    desc: 'Sets metadata for the account',
    params: [
      {
        type: Address,
        desc: 'Address',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: String,
        desc: 'Metadata (JSON encoded)',
        example: '{"foo":"bar"}'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  testPassword: {
    subdoc: 'accounts',
    desc: 'Checks if a given password can unlock a given account, without actually unlocking it.',
    params: [
      {
        type: Address,
        desc: 'Account to test.',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: String,
        desc: 'Password to test.',
        example: 'hunter2'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the account and password are valid.',
      example: true
    }
  },

  changePassword: {
    subdoc: 'accounts',
    desc: 'Change the password for a given account.',
    params: [
      {
        type: Address,
        desc: 'Address of the account.',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: String,
        desc: 'Old password',
        example: 'hunter2'
      },
      {
        type: String,
        desc: 'New password',
        example: 'bazqux5'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  killAccount: {
    subdoc: 'accounts',
    desc: 'Deletes an account.',
    params: [
      {
        type: Address,
        desc: 'The account to remove.',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: String,
        desc: 'Account password.',
        example: 'hunter2'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  removeAddress: {
    subdoc: 'accounts',
    desc: 'Removes an address from the addressbook.',
    params: [
      {
        type: Address,
        desc: 'The address to remove.',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true`if the call was successful.',
      example: true
    }
  },

  setDappsAddresses: {
    subdoc: 'accounts',
    desc: 'Sets the available addresses for a dapp.',
    params: [
      {
        type: String,
        desc: 'Dapp Id.'
      },
      {
        type: Array,
        desc: 'Array of available accounts available to the dapp.'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.'
    }
  },

  getDappsAddresses: {
    subdoc: 'accounts',
    desc: 'Returns the list of accounts available to a specific dapp.',
    params: [
      {
        type: String,
        desc: 'Dapp Id.'
      }
    ],
    returns: {
      type: Array,
      desc: 'The list of available accounts.'
    }
  },

  setNewDappsWhitelist: {
    subdoc: 'accounts',
    desc: 'Sets the list of accounts available to new dapps.',
    params: [
      {
        type: Array,
        desc: 'List of accounts available by default.'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful'
    }
  },

  listRecentDapps: {
    subdoc: 'accounts',
    desc: 'Returns a list of the most recent active dapps.',
    params: [],
    returns: {
      type: Array,
      desc: 'Array of Dapp Ids.'
    }
  },

  importGethAccounts: {
    subdoc: 'accounts',
    desc: 'Imports a list of accounts from Geth.',
    params: [
      {
        type: Array,
        desc: 'List of the Geth addresses to import.'
      }
    ],
    returns: {
      type: Array,
      desc: 'Array of the imported addresses.'
    }
  },

  listGethAccounts: {
    subdoc: 'accounts',
    desc: 'Returns a list of the accounts available from Geth.',
    params: [],
    returns: {
      type: Array,
      desc: '20 Bytes addresses owned by the client.'
    }
  },

  /*
   * `parity_set` module methods
   * ===========================
   */
  setMinGasPrice: {
    subdoc: 'set',
    desc: 'Changes minimal gas price for transaction to be accepted to the queue.',
    params: [
      {
        type: Quantity,
        desc: 'Minimal gas price',
        format: 'utils.toHex',
        example: fromDecimal(1000)
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful',
      example: true
    }
  },

  setGasFloorTarget: {
    subdoc: 'set',
    desc: 'Sets a new gas floor target for mined blocks..',
    params: [
      {
        type: Quantity,
        desc: '(default: `0x0`) Gas floor target.',
        format: 'utils.toHex',
        example: fromDecimal(1000)
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  setGasCeilTarget: {
    subdoc: 'set',
    desc: 'Sets new gas ceiling target for mined blocks.',
    params: [
      {
        type: Quantity,
        desc: '(default: `0x0`) Gas ceiling target.',
        format: 'utils.toHex',
        example: fromDecimal(10000000000)
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  setExtraData: {
    subdoc: 'set',
    desc: 'Changes extra data for newly mined blocks',
    params: [
      {
        type: Data,
        desc: 'Extra Data',
        format: 'utils.toHex',
        example: '0x'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful',
      example: true
    }
  },

  setAuthor: {
    subdoc: 'set',
    desc: 'Changes author (coinbase) for mined blocks.',
    params: [
      {
        type: Address,
        desc: '20 Bytes - Address',
        format: 'inputAddressFormatter',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  setMaxTransactionGas: {
    subdoc: 'set',
    desc: 'Sets the maximum amount of gas a single transaction may consume.',
    params: [
      {
        type: Quantity,
        desc: 'Gas amount',
        format: 'utils.toHex',
        example: fromDecimal(100000)
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call was successful.',
      example: true
    }
  },

  setTransactionsLimit: {
    subdoc: 'set',
    desc: 'Changes limit for transactions in queue.',
    params: [
      {
        type: Quantity,
        desc: 'New Limit',
        format: 'utils.toHex',
        example: fromDecimal(1000)
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful',
      example: true
    }
  },

  addReservedPeer: {
    subdoc: 'set',
    desc: 'Add a reserved peer.',
    params: [
      {
        type: String,
        desc: 'Enode address',
        example: 'enode://a979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c@22.99.55.44:7770'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if successful.',
      example: true
    }
  },

  removeReservedPeer: {
    subdoc: 'set',
    desc: 'Remove a reserved peer.',
    params: [
      {
        type: String,
        desc: 'Encode address',
        example: 'enode://a979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c@22.99.55.44:7770'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if successful.',
      example: true
    }
  },

  dropNonReservedPeers: {
    subdoc: 'set',
    desc: 'Set Parity to drop all non-reserved peers. To restore default behavior call [parity_acceptNonReservedPeers](#parity_acceptnonreservedpeers).',
    params: [],
    returns: {
      type: Boolean,
      desc: '`true` if successful.',
      example: true
    }
  },

  acceptNonReservedPeers: {
    subdoc: 'set',
    desc: 'Set Parity to accept non-reserved peers (default behavior).',
    params: [],
    returns: {
      type: Boolean,
      desc: '`true` if successful.',
      example: true
    }
  },

  hashContent: {
    subdoc: 'set',
    desc: 'Creates a hash of a file at a given URL.',
    params: [
      {
        type: String,
        desc: 'The url of the content.',
        example: 'https://raw.githubusercontent.com/ethcore/parity/master/README.md'
      }
    ],
    returns: {
      type: Hash,
      desc: 'The SHA-3 hash of the content.',
      example: '0x2547ea3382099c7c76d33dd468063b32d41016aacb02cbd51ebc14ff5d2b6a43'
    }
  },

  setMode: {
    subdoc: 'set',
    desc: 'Changes the operating mode of Parity.',
    params: [
      {
        type: String,
        desc: 'The mode to set, one of:\n  * `"active"` - Parity continuously syncs the chain.\n  * `"passive"` - Parity syncs initially, then sleeps and wakes regularly to resync.\n  * `"dark"` - Parity syncs only when the RPC is active.\n  * `"offline"` - Parity doesn\'t sync.\n',
        example: 'passive'
      }
    ],
    returns: {
      type: Boolean,
      desc: '`true` if the call succeeded.',
      example: true
    }
  },

  setEngineSigner: {
    subdoc: 'set',
    desc: 'Sets an authority account for signing consensus messages. For more information check the [[Proof of Authority Chains]] page.',
    params: [
      {
        type: Address,
        desc: 'Identifier of a valid authority account.',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: String,
        desc: 'Passphrase to unlock the account.',
        example: 'hunter2'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'True if the call succeeded',
      example: true
    }
  },

  upgradeReady: {
    subdoc: 'set',
    desc: 'Returns a ReleaseInfo object describing the release which is available for upgrade or `null` if none is available.',
    params: [],
    returns: {
      type: Object,
      desc: 'Details or `null` if no new release is available.',
      details: {
        version: {
          type: Object,
          desc: 'Information on the version.'
        },
        is_critical: {
          type: Boolean,
          desc: 'Does this release contain critical security updates?'
        },
        fork: {
          type: Quantity,
          desc: 'The latest fork that this release can handle.'
        },
        binary: {
          type: Data,
          desc: 'Keccak-256 checksum of the release parity binary, if known.',
          optional: true
        }
      },
      example: null
    }
  },

  executeUpgrade: {
    subdoc: 'set',
    desc: 'Attempts to upgrade Parity to the version specified in [parity_upgradeReady](#parity_upgradeready).',
    params: [],
    returns: {
      type: Boolean,
      desc: 'returns `true` if the upgrade to the new release was successfully executed, `false` if not.',
      example: true
    }
  }
};
