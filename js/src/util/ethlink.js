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

import { decode as decodeBase58, encode as encodeBase58 } from 'bs58';

const BASE_URL = 'web.ethlink.io';

export function encode (token, url) {
  const chars = new Buffer(`${token}+${url}`);

  return `${encodeBase58(chars)}.${BASE_URL}`;
}

export function decode (encoded) {
  return decodeBase58(encoded.replace('.web.ethlink.io', '')).toString();
}

export {
  BASE_URL
};
