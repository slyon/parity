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

import { Address, Data, Hash, Quantity, BlockNumber } from '../types';
import { fromDecimal, withComment, DUMMY } from '../helpers';

const SECTION_MINING = 'Block Authoring (aka "mining")';
const SECTION_DEV = 'Development';
const SECTION_NODE = 'Node Settings';
const SECTION_NET = 'Network Information';
const SECTION_ACCOUNTS = 'Accounts (read-only) and Signatures';

const transactionDetails = {
  hash: {
    type: Hash,
    desc: '32 Bytes - hash of the transaction.'
  },
  nonce: {
    type: Quantity,
    desc: 'The number of transactions made by the sender prior to this one.'
  },
  blockHash: {
    type: Hash,
    desc: '32 Bytes - hash of the block where this transaction was in. `null` when its pending.'
  },
  blockNumber: {
    type: BlockNumber,
    desc: 'Block number where this transaction was in. `null` when its pending.'
  },
  transactionIndex: {
    type: Quantity,
    desc: 'Integer of the transactions index position in the block. `null` when its pending.'
  },
  from: {
    type: Address,
    desc: '20 Bytes - address of the sender.'
  },
  to: {
    type: Address,
    desc: '20 Bytes - address of the receiver. `null` when its a contract creation transaction.'
  },
  value: {
    type: Quantity,
    desc: 'Value transferred in Wei.'
  },
  gasPrice: {
    type: Quantity,
    desc: 'Gas price provided by the sender in Wei.'
  },
  gas: {
    type: Quantity,
    desc: 'Gas provided by the sender.'
  },
  input: {
    type: Data,
    desc: 'The data send along with the transaction.'
  },
  raw: {
    type: Data,
    desc: 'Raw transaction data.'
  },
  publicKey: {
    type: Data,
    desc: 'Public key of the signer.'
  },
  networkId: {
    type: Quantity,
    desc: 'The network id of the transaction, if any.'
  },
  standardV: {
    type: Quantity,
    desc: 'The standardized V field of the signature (0 or 1).'
  },
  v: {
    type: Quantity,
    desc: 'The V field of the signature.'
  },
  r: {
    type: Quantity,
    desc: 'The R field of the signature.'
  },
  s: {
    type: Quantity,
    desc: 'The S field of the signature.'
  },
  minBlock: {
    type: BlockNumber,
    optional: true,
    desc: 'Block number, tag or `null`.'
  }
};

export default {
  accountsInfo: {
    section: SECTION_ACCOUNTS,
    desc: 'Provides metadata for accounts.',
    params: [],
    returns: {
      type: Object,
      desc: 'Maps account address to metadata.',
      details: {
        name: {
          type: String,
          desc: 'Account name'
        }
      },
      example: {
        '0x0024d0c7ab4c52f723f3aaf0872b9ea4406846a4': {
          name: 'Foo'
        },
        '0x004385d8be6140e6f889833f68b51e17b6eacb29': {
          name: 'Bar'
        },
        '0x009047ed78fa2be48b62aaf095b64094c934dab0': {
          name: 'Baz'
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
    desc: 'Returns the port the dapps are running on, error if not enabled.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'The port number',
      example: 8080
    }
  },

  dappsInterface: {
    section: SECTION_NODE,
    desc: 'Returns the interface the dapps are running on, error if not enabled.',
    params: [],
    returns: {
      type: String,
      desc: 'The interface',
      example: '127.0.0.1'
    }
  },

  defaultExtraData: {
    section: SECTION_MINING,
    desc: 'Returns the default extra data',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data',
      example: '0xd5830106008650617269747986312e31342e30826c69'
    }
  },

  devLogs: {
    section: SECTION_DEV,
    desc: 'Returns latest stdout logs of your node.',
    params: [],
    returns: {
      type: Array,
      desc: 'Development logs',
      example: [
        '2017-01-20 18:14:19  Updated conversion rate to Ξ1 = US$10.63 (11199212000 wei/gas)',
        '2017-01-20 18:14:19  Configured for DevelopmentChain using InstantSeal engine',
        '2017-01-20 18:14:19  Operating mode: active',
        '2017-01-20 18:14:19  State DB configuration: fast',
        '2017-01-20 18:14:19  Starting Parity/v1.6.0-unstable-2ae8b4c-20170120/x86_64-linux-gnu/rustc1.14.0'
      ]
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
    desc: 'Returns the node enode URI.',
    params: [],
    returns: {
      type: String,
      desc: 'Enode URI',
      example: 'enode://050929adcfe47dbe0b002cb7ef2bf91ca74f77c4e0f68730e39e717f1ce38908542369ae017148bee4e0d968340885e2ad5adea4acd19c95055080a4b625df6a@172.17.0.1:30303'
    }
  },

  extraData: {
    section: SECTION_MINING,
    desc: 'Returns currently set extra data.',
    params: [],
    returns: {
      type: Data,
      desc: 'Extra data.',
      example: '0xd5830106008650617269747986312e31342e30826c69'
    }
  },

  gasFloorTarget: {
    section: SECTION_MINING,
    desc: 'Returns current target for gas floor.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Gas floor target.',
      format: 'outputBigNumberFormatter',
      example: fromDecimal(4700000)
    }
  },

  gasCeilTarget: {
    section: SECTION_MINING,
    desc: 'Returns current target for gas ceiling.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Gas ceiling target.',
      format: 'outputBigNumberFormatter',
      example: fromDecimal(6283184)
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
      format: 'outputBigNumberFormatter',
      example: fromDecimal(11262783488)
    }
  },

  mode: {
    section: SECTION_NODE,
    desc: 'Get the mode. Results one of: `"active"`, `"passive"`, `"dark"`, `"offline"`.',
    params: [],
    returns: {
      type: String,
      desc: 'The mode.',
      example: 'active'
    }
  },

  netChain: {
    section: SECTION_NET,
    desc: 'Returns the name of the connected chain.',
    params: [],
    returns: {
      type: String,
      desc: 'chain name.',
      example: 'homestead'
    }
  },

  netPeers: {
    section: SECTION_NET,
    desc: 'Returns number of peers.',
    params: [],
    returns: {
      type: Object,
      desc: 'Number of peers',
      details: {
        active: {
          type: Quantity,
          desc: 'Number of active peers.'
        },
        connected: {
          type: Quantity,
          desc: 'Number of connected peers.'
        },
        max: {
          type: Quantity,
          desc: 'Maximum number of connected peers.'
        },
        peers: {
          type: Array,
          desc: 'List of all peers with details.'
        }
      },
      example: {
        active: 0,
        connected: 25,
        max: 25,
        peers: [DUMMY, DUMMY, DUMMY, DUMMY]
      }
    }
  },

  netPort: {
    section: SECTION_NET,
    desc: 'Returns network port the node is listening on.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Port number',
      example: 30303
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
    desc: 'Returns node name, set when starting parity with `--identity NAME`.',
    params: [],
    returns: {
      type: String,
      desc: 'Node name.',
      example: 'Doge'
    }
  },

  pendingTransactions: {
    section: SECTION_NET,
    desc: 'Returns a list of transactions currently in the queue.',
    params: [],
    returns: {
      type: Array,
      desc: 'Transactions ordered by priority',
      details: transactionDetails,
      example: [
        {
          blockHash: null,
          blockNumber: null,
          creates: null,
          from: '0xee3ea02840129123d5397f91be0391283a25bc7d',
          gas: '0x23b58',
          gasPrice: '0xba43b7400',
          hash: '0x160b3c30ab1cf5871083f97ee1cee3901cfba3b0a2258eb337dd20a7e816b36e',
          input: '0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d5555555555',
          minBlock: null,
          networkId: 1,
          nonce: '0x5',
          publicKey: '0x96157302dade55a1178581333e57d60ffe6fdf5a99607890456a578b4e6b60e335037d61ed58aa4180f9fd747dc50d44a7924aa026acbfb988b5062b629d6c36',
          r: '0x92e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1',
          raw: '0xf8aa05850ba43b740083023b5894bb9bc244d798123fde783fcc1c72d3bb8c18941380b844095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca75400000000000000000000000000002643c948210b4bd99244ccd64d555555555526a092e8beb19af2bad0511d516a86e77fa73004c0811b2173657a55797bdf8558e1a062b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8',
          s: '0x62b4d4d125bbcb9c162453bc36ca156537543bb4414d59d1805d37fb63b351b8',
          standardV: '0x1',
          to: '0xbb9bc244d798123fde783fcc1c72d3bb8c189413',
          transactionIndex: null,
          v: '0x26',
          value: '0x0'
        },
        DUMMY,
        DUMMY
      ]
    }
  },

  pendingTransactionsStats: {
    desc: 'Returns propagation stats for transactions in the queue.',
    params: [],
    returns: {
      type: Object,
      desc: 'mapping of transaction hashes to stats.',
      example: {
        '0xdff37270050bcfba242116c745885ce2656094b2d3a0f855649b4a0ee9b5d15a': {
          firstSeen: 3032066,
          propagatedTo: {
            '0x605e04a43b1156966b3a3b66b980c87b7f18522f7f712035f84576016be909a2798a438b2b17b1a8c58db314d88539a77419ca4be36148c086900fba487c9d39': 1,
            '0xbab827781c852ecf52e7c8bf89b806756329f8cbf8d3d011e744a0bc5e3a0b0e1095257af854f3a8415ebe71af11b0c537f8ba797b25972f519e75339d6d1864': 1
          }
        }
      }
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
    desc: 'Provides current JSON-RPC API settings.',
    params: [],
    returns: {
      type: Object,
      desc: 'JSON-RPC settings.',
      details: {
        enabled: {
          type: Boolean,
          desc: '`true` if JSON-RPC is enabled (default).'
        },
        interface: {
          type: String,
          desc: 'Interface on which JSON-RPC is running.'
        },
        port: {
          type: Quantity,
          desc: 'Port on which JSON-RPC is running.'
        }
      },
      example: {
        enabled: true,
        interface: 'local',
        port: 8545
      }
    }
  },

  signerPort: {
    section: SECTION_NODE,
    desc: 'Returns the port the signer is running on, error if not enabled',
    params: [],
    returns: {
      type: Quantity,
      desc: 'The port number',
      example: 8180
    }
  },

  transactionsLimit: {
    section: SECTION_MINING,
    desc: 'Changes limit for transactions in queue.',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Current max number of transactions in queue.',
      format: 'outputBigNumberFormatter',
      example: 1024
    }
  },

  unsignedTransactionsCount: {
    section: SECTION_NET,
    desc: 'Returns number of unsigned transactions when running with Trusted Signer. Error otherwise',
    params: [],
    returns: {
      type: Quantity,
      desc: 'Number of unsigned transactions',
      example: 0
    }
  },

  versionInfo: {
    desc: 'Provides information about running version of Parity.',
    params: [],
    returns: {
      type: Object,
      desc: 'Information on current version.',
      details: {
        hash: {
          type: Hash,
          desc: '20 Byte hash of the current build.'
        },
        track: {
          type: String,
          desc: 'Track on which it was released, one of: `"stable"`, `"beta"`, `"nightly"`, `"testing"`, `"null"` (unknown or self-built).'
        },
        version: {
          type: Object,
          desc: 'Version number composed of `major`, `minor` and `patch` integers.'
        }
      },
      example: {
        hash: '0x2ae8b4ca278dd7b896090366615fef81cbbbc0e0',
        track: 'null',
        version: {
          major: 1,
          minor: 6,
          patch: 0
        }
      }
    }
  },

  listAccounts: {
    desc: 'Returns all addresses if Fat DB is enabled (`--fat-db`), `null` otherwise.',
    params: [
      {
        type: Quantity,
        desc: 'Integer number of addresses to display in a batch.',
        example: 5
      },
      {
        type: Address,
        desc: '20 Bytes - Offset address from which the batch should start in order, or `null`.',
        example: null
      },
      {
        type: BlockNumber,
        desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`.',
        format: 'inputDefaultBlockNumberFormatter',
        optional: true
      }
    ],
    returns: {
      type: Array,
      desc: 'Requested number of `Address`es or `null` if Fat DB is not enabled.',
      example: [
        '0x7205b1bb42edce6e0ced37d1fd0a9d684f5a860f',
        '0x98a2559a814c300b274325c92df1682ae0d344e3',
        '0x2d7a7d0adf9c5f9073fefbdc18188bd23c68b633',
        '0xd4bb3284201db8b03c06d8a3057dd32538e3dfda',
        '0xa6396904b08aa31300ca54278b8e066ecc38e4a0'
      ]
    }
  },

  listStorageKeys: {
    desc: 'Returns all storage keys of the given address (first parameter) if Fat DB is enabled (`--fat-db`), `null` otherwise.',
    params: [
      {
        type: Address,
        desc: '20 Bytes - Account for which to retrieve the storage keys.',
        example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
      },
      {
        type: Quantity,
        desc: 'Integer number of addresses to display in a batch.',
        example: 5
      },
      {
        type: Hash,
        desc: '32 Bytes - Offset storage key from which the batch should start in order, or `null`.',
        example: null
      },
      {
        type: BlockNumber,
        desc: 'integer block number, or the string `\'latest\'`, `\'earliest\'` or `\'pending\'`.',
        format: 'inputDefaultBlockNumberFormatter',
        optional: true
      }
    ],
    returns: {
      type: Array,
      desc: 'Requested number of 32 byte long storage keys for the given account or `null` if Fat DB is not enabled.',
      example: [
        '0xaab1a2940583e213f1d57a3ed358d5f5406177c8ff3c94516bfef3ea62d00c22',
        '0xba8469eca5641b186e86cbc5343dfa5352df04feb4564cd3cf784f213aaa0319',
        '0x769d107ba778d90205d7a159e820c41c20bf0783927b426c602561e74b7060e5',
        '0x0289865bcaa58f7f5bf875495ac7af81e3630eb88a3a0358407c7051a850624a',
        '0x32e0536502b9163b0a1ce6e3aabd95fa4a2bf602bbde1b9118015648a7a51178'
      ]
    }
  },

  encryptMessage: {
    desc: 'Encrypt some data with a public key under ECIES.',
    params: [
      {
        type: Hash,
        desc: 'Public EC key generated with `secp256k1` curve, truncated to the last 64 bytes.',
        example: '0xD219959D466D666060284733A80DDF025529FEAA8337169540B3267B8763652A13D878C40830DD0952639A65986DBEC611CF2171A03CFDC37F5A40537068AA4F'
      },
      {
        type: Data,
        desc: 'The message to encrypt.',
        example: withComment('0x68656c6c6f20776f726c64', '"hello world"')
      }
    ],
    returns: {
      type: Data,
      desc: 'Encrypted message.',
      example: '0x0491debeec5e874a453f84114c084c810708ebcb553b02f1b8c05511fa4d1a25fa38eb49a32c815e2b39b7bcd56d66648bf401067f15413dae683084ca7b01e21df89be9ec4bc6c762a657dbd3ba1540f557e366681b53629bb2c02e1443b5c0adc6b68f3442c879456d6a21ec9ed07847fa3c3ecb73ec7ee9f8e32d'
    }
  },

  futureTransactions: {
    desc: 'Returns all future transactions from transaction queue.',
    params: [],
    returns: {
      type: Array,
      desc: 'Transaction list.',
      details: transactionDetails,
      example: [
        {
          hash: '0x80de421cd2e7e46824a91c343ca42b2ff339409eef09e2d9d73882462f8fce31',
          nonce: '0x1',
          blockHash: null,
          blockNumber: null,
          transactionIndex: null,
          from: '0xe53e478c072265e2d9a99a4301346700c5fbb406',
          to: '0xf5d405530dabfbd0c1cab7a5812f008aa5559adf',
          value: '0x2efc004ac03a4996',
          gasPrice: '0x4a817c800',
          gas: '0x5208',
          input: '0x',
          creates: null,
          raw: '0xf86c018504a817c80082520894f5d405530dabfbd0c1cab7a5812f008aa5559adf882efc004ac03a49968025a0b40c6967a7e8bbdfd99a25fd306b9ef23b80e719514aeb7ddd19e2303d6fc139a06bf770ab08119e67dc29817e1412a0e3086f43da308c314db1b3bca9fb6d32bd',
          publicKey: '0xeba33fd74f06236e17475bc5b6d1bac718eac048350d77d3fc8fbcbd85782a57c821255623c4fd1ebc9d555d07df453b2579ee557b7203fc256ca3b3401e4027',
          networkId: 1,
          standardV: '0x0',
          v: '0x25',
          r: '0xb40c6967a7e8bbdfd99a25fd306b9ef23b80e719514aeb7ddd19e2303d6fc139',
          s: '0x6bf770ab08119e67dc29817e1412a0e3086f43da308c314db1b3bca9fb6d32bd',
          minBlock: null
        },
        DUMMY,
        DUMMY
      ]
    }
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
