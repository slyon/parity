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

import BigNumber from 'bignumber.js';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Api from '~/api';

import TxRow from './txRow';

const api = new Api({ execute: sinon.stub() });

function render (props) {
  return shallow(
    <TxRow
      { ...props }
    />,
    { context: { api } }
  );
}

describe('ui/TxList/TxRow', () => {
  describe('rendering', () => {
    it('renders defaults', () => {
      const block = {
        timestamp: new Date()
      };
      const tx = {
        blockNumber: new BigNumber(123),
        hash: '0x123456789abcdef0123456789abcdef0123456789abcdef',
        value: new BigNumber(1)
      };

      expect(render({ address: '0x123', block, isTest: true, tx })).to.be.ok;
    });
  });
});
