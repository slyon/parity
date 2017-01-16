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

export default {
  acceptNonReservedPeers: {
    desc: '?',
    params: [],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  accountsInfo: {
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

  allAccountsInfo: {
    desc: 'returns a map of accounts as an object',
    params: [],
    returns: {
      type: Array,
      desc: 'Account metadata',
      details: {
        name: {
          type: String,
          desc: 'Account name'
        },
        meta: {
          type: String,
          desc: 'Encoded JSON string the defines additional account metadata'
        },
        uuid: {
          type: String,
          desc: 'The account Uuid, or `null` if not available/unknown/not applicable.'
        }
      }
    }
  },

  addReservedPeer: {
    desc: '?',
    params: [
      {
        type: String,
        desc: 'Enode'
      }
    ],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  chainStatus: {
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

  checkRequest: {
    desc: 'Returns the transactionhash of the requestId (received from parity_postTransaction) if the request was confirmed',
    params: [
      {
        type: Quantity,
        desc: 'The requestId to check for'
      }
    ],
    returns: {
      type: Hash,
      desc: '32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available'
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
    desc: 'Returns the port the dapps are running on, error if not enabled',
    params: [],
    returns: {
      type: Quantity,
      desc: 'The port number'
    }
  },

  dappsInterface: {
    desc: 'Returns the interface the dapps are running on, error if not enabled',
    params: [],
    returns: {
      type: String,
      desc: 'The interface'
    }
  },

  defaultExtraData: {
    desc: 'Returns the default extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data'
    }
  },

  devLogs: {
    desc: 'Returns latest logs of your node',
    params: [],
    returns: {
      type: Array,
      desc: 'Development logs'
    }
  },

  devLogsLevels: {
    desc: 'Returns current log level settings',
    params: [],
    returns: {
      type: String,
      decs: 'Current log level'
    }
  },

  dropNonReservedPeers: {
    desc: '?',
    params: [],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  enode: {
    desc: 'Returns the node enode URI',
    params: [],
    returns: {
      type: String,
      desc: 'Enode URI'
    }
  },

  executeUpgrade: {
    desc: 'Performs an upgrade',
    params: [],
    returns: {
      type: Boolean,
      desc: 'returns true if the upgrade to the release specified in parity_upgradeReady was successfully executed, false if not'
    }
  },

  extraData: {
    desc: 'Returns currently set extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data'
    }
  },

  gasFloorTarget: {
    desc: 'Returns current target for gas floor',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Gas Floor Target',
      format: 'outputBigNumberFormatter'
    }
  },

  gasPriceHistogram: {
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
    desc: 'Creates a secret phrase that can be associated with an account',
    params: [],
    returns: {
      type: String,
      desc: 'The secret phrase'
    }
  },

  getDappsAddresses: {
    desc: 'Returns the list of accounts available to a specific dapp',
    params: [
      {
        type: String,
        desc: 'Dapp Id'
      }
    ],
    returns: {
      type: Array,
      desc: 'The list of available accounts'
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

  hashContent: {
    desc: 'Creates a hash of the file as retrieved',
    params: [
      {
        type: String,
        desc: 'The url of the content'
      }
    ],
    returns: {
      type: Hash,
      desc: 'The hash of the content'
    }
  },

  importGethAccounts: {
    desc: 'Imports a list of accounts from geth',
    params: [
      {
        type: Array,
        desc: 'List of the geth addresses to import'
      }
    ],
    returns: {
      type: Array,
      desc: 'Array of the imported addresses'
    }
  },

  killAccount: {
    desc: 'Deletes an account',
    params: [
      {
        type: Address,
        desc: 'The account to remove'
      },
      {
        type: String,
        desc: 'Account password'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'true on success'
    }
  },

  listRecentDapps: {
    desc: 'Returns a list of the most recent active dapps',
    params: [],
    returns: {
      type: Array,
      desc: 'Array of Dapp Ids'
    }
  },

  removeAddress: {
    desc: 'Removes an address from the addressbook',
    params: [
      {
        type: Address,
        desc: 'The address to remove'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'true on success'
    }
  },

  listGethAccounts: {
    desc: 'Returns a list of the accounts available from Geth',
    params: [],
    returns: {
      type: Array,
      desc: '20 Bytes addresses owned by the client.'
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
    desc: 'Returns currently set minimal gas price',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Minimal Gas Price',
      format: 'outputBigNumberFormatter'
    }
  },

  mode: {
    desc: 'Get the mode. Results one of: "active", "passive", "dark", "offline".',
    params: [],
    returns: {
      type: String,
      desc: 'The mode'
    }
  },

  netChain: {
    desc: 'Returns the name of the connected chain.',
    params: [],
    returns: {
      type: String,
      desc: 'chain name'
    }
  },

  netPeers: {
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
    desc: 'Returns network port the node is listening on.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Port Number'
    }
  },

  newAccountFromPhrase: {
    desc: 'Creates a new account from a recovery passphrase',
    params: [
      {
        type: String,
        desc: 'Phrase'
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

  newAccountFromSecret: {
    desc: 'Creates a new account from a private ethstore secret key',
    params: [
      {
        type: Data,
        desc: 'Secret, 32-byte hex'
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

  newAccountFromWallet: {
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

  nextNonce: {
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
    desc: 'Returns node name (identity)',
    params: [],
    returns: {
      type: String,
      desc: 'Node name'
    }
  },

  pendingTransactions: {
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
    desc: 'Converts a secret phrase into the corresponting address',
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

  postTransaction: {
    desc: 'Posts a transaction to the Signer.',
    params: [
      {
        type: Object,
        desc: 'see [eth_sendTransaction](#eth_sendTransaction)',
        format: 'inputCallFormatter'
      }
    ],
    returns: {
      type: Quantity,
      desc: 'The id of the actual transaction',
      format: 'utils.toDecimal'
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

  removeReservedPeer: {
    desc: '?',
    params: [
      {
        type: String,
        desc: 'Encode'
      }
    ],
    returns: {
      type: Boolean,
      desc: '?'
    }
  },

  registryAddress: {
    desc: 'The address for the global registry',
    params: [],
    returns: {
      type: Address,
      desc: 'The registry address'
    }
  },

  rpcSettings: {
    desc: 'Returns basic settings of rpc (enabled, port, interface).',
    params: [],
    returns: {
      type: Object,
      desc: 'JSON object containing rpc settings'
    }
  },

  setAccountName: {
    desc: 'Sets a name for the account',
    params: [
      {
        type: Address,
        desc: 'Address'
      },
      {
        type: String,
        desc: 'Name'
      }
    ],
    returns: {
      type: Object,
      desc: 'Returns null in all cases'
    }
  },

  setAccountMeta: {
    desc: 'Sets metadata for the account',
    params: [
      {
        type: Address,
        desc: 'Address'
      },
      {
        type: String,
        desc: 'Metadata (JSON encoded)'
      }
    ],
    returns: {
      type: Object,
      desc: 'Returns null in all cases'
    }
  },

  setAuthor: {
    desc: 'Changes author (coinbase) for mined blocks.',
    params: [
      {
        type: Address,
        desc: '20 Bytes - Address',
        format: 'inputAddressFormatter'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setDappsAddresses: {
    desc: 'Sets the available addresses for a dapp',
    params: [
      {
        type: String,
        desc: 'Dapp Id'
      },
      {
        type: Array,
        desc: 'Array of available accounts available to the dapp'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'True if the call succeeded'
    }
  },

  setExtraData: {
    desc: 'Changes extra data for newly mined blocks',
    params: [
      {
        type: Data,
        desc: 'Extra Data',
        format: 'utils.toHex'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setGasFloorTarget: {
    desc: 'Changes current gas floor target.',
    params: [
      {
        type: Quantity,
        desc: 'Gas Floor Target',
        format: 'utils.toHex'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setMinGasPrice: {
    desc: 'Changes minimal gas price for transaction to be accepted to the queue.',
    params: [
      {
        type: Quantity,
        desc: 'Minimal gas price',
        format: 'utils.toHex'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  setMode: {
    desc: 'Changes the mode',
    params: [
      {
        type: String,
        desc: 'The mode to set, one of "active", "passive", "dark", "offline"'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'True if the call succeeded'
    }
  },

  setNewDappsWhitelist: {
    desc: 'Sets the list of accounts available to new dapps',
    params: [
      {
        type: Array,
        desc: 'List of accounts available by default'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'True if the call succeeded'
    }
  },

  setTransactionsLimit: {
    desc: 'Changes limit for transactions in queue.',
    params: [
      {
        type: Quantity,
        desc: 'New Limit',
        format: 'utils.toHex'
      }
    ],
    returns: {
      type: Boolean,
      desc: 'whether the call was successful'
    }
  },

  signerPort: {
    desc: 'Returns the port the signer is running on, error if not enabled',
    params: [],
    returns: {
      type: Quantity,
      desc: 'The port number'
    }
  },

  transactionsLimit: {
    desc: 'Changes limit for transactions in queue.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Current max number of transactions in queue',
      format: 'outputBigNumberFormatter'
    }
  },

  unsignedTransactionsCount: {
    desc: 'Returns number of unsigned transactions when running with Trusted Signer. Error otherwise',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Number of unsigned transactions'
    }
  },

  upgradeReady: {
    desc: 'returns a ReleaseInfo object describing the release which is available for upgrade or null if none is available',
    params: [],
    returns: {
      type: Object,
      desc: '{"binary":H,"fork":15100,"is_critical":true,"version":V} where H is the Keccak-256 checksum of the release parity binary and V is a VersionInfo object describing the release'
    }
  },

  versionInfo: {
    desc: 'returns a VersionInfo object describing our current version',
    params: [],
    returns: {
      type: Object,
      desc: '{"hash":H,"track":T,"version":{"major":N,"minor":N,"patch":N}} (H is a 160-bit Git commit hash, T is a ReleaseTrack, either "stable", "beta", "nightly" or "unknown" and N is a version number)'
    }
  }
};
