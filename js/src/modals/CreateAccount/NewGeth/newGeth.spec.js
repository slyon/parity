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

import { shallow } from 'enzyme';
import React from 'react';

import { createStore } from '../createAccount.test.js';

import NewGeth from './';

let component;
let store;

function render () {
  store = createStore();
  component = shallow(
    <NewGeth
      store={ store }
    />
  );

  return component;
}

describe('modals/CreateAccount/NewGeth', () => {
  describe('rendering', () => {
    it('renders with defaults', () => {
      expect(render()).to.be.ok;
    });
  });
});