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
import { shallow } from 'enzyme';
import React from 'react';

import Header from './';

const ACCOUNT = {
  address: '0x0123456789012345678901234567890123456789',
  meta: {
    description: 'the description',
    tags: ['taga', 'tagb']
  },
  uuid: '0xabcdef'
};

let component;
let instance;

function render (props = {}) {
  if (props && !props.account) {
    props.account = ACCOUNT;
  }

  component = shallow(
    <Header { ...props } />
  );
  instance = component.instance();

  return component;
}

describe('views/Account/Header', () => {
  describe('rendering', () => {
    it('renders defaults', () => {
      expect(render()).to.be.ok;
    });

    it('renders null with no account', () => {
      expect(render(null).find('div')).to.have.length(0);
    });

    it('renders when no account meta', () => {
      expect(render({ account: { address: ACCOUNT.address } })).to.be.ok;
    });

    it('renders when no account description', () => {
      expect(render({ account: { address: ACCOUNT.address, meta: { tags: [] } } })).to.be.ok;
    });

    it('renders when no account tags', () => {
      expect(render({ account: { address: ACCOUNT.address, meta: { description: 'something' } } })).to.be.ok;
    });

    describe('sections', () => {
      it('renders the Balance', () => {
        render({ balance: { balance: 'testing' } });
        const balance = component.find('Connect(Balance)');

        expect(balance).to.have.length(1);
        expect(balance.props().account).to.deep.equal(ACCOUNT);
        expect(balance.props().balance).to.deep.equal({ balance: 'testing' });
      });

      it('renders the Certifications', () => {
        render();
        const certs = component.find('Connect(Certifications)');

        expect(certs).to.have.length(1);
        expect(certs.props().address).to.deep.equal(ACCOUNT.address);
      });

      it('renders the IdentityIcon', () => {
        render();
        const icon = component.find('Connect(IdentityIcon)');

        expect(icon).to.have.length(1);
        expect(icon.props().address).to.equal(ACCOUNT.address);
      });

      it('renders the Tags', () => {
        render();
        const tags = component.find('Tags');

        expect(tags).to.have.length(1);
        expect(tags.props().tags).to.deep.equal(ACCOUNT.meta.tags);
      });
    });
  });

  describe('renderName', () => {
    it('renders null with hideName', () => {
      render({ hideName: true });
      expect(instance.renderName()).to.be.null;
    });

    it('renders the name', () => {
      render();
      expect(instance.renderName()).not.to.be.null;
    });

    it('renders when no address specified', () => {
      render({ account: {} });
      expect(instance.renderName()).to.be.ok;
    });
  });

  describe('renderTxCount', () => {
    it('renders null when contract', () => {
      render({ balance: { txCount: new BigNumber(1) }, isContract: true });
      expect(instance.renderTxCount()).to.be.null;
    });

    it('renders null when no balance', () => {
      render({ balance: null, isContract: false });
      expect(instance.renderTxCount()).to.be.null;
    });

    it('renders null when txCount is null', () => {
      render({ balance: { txCount: null }, isContract: false });
      expect(instance.renderTxCount()).to.be.null;
    });

    it('renders the tx count', () => {
      render({ balance: { txCount: new BigNumber(1) }, isContract: false });
      expect(instance.renderTxCount()).not.to.be.null;
    });
  });

  describe('renderUuid', () => {
    it('renders null with no uuid', () => {
      render({ account: Object.assign({}, ACCOUNT, { uuid: null }) });
      expect(instance.renderUuid()).to.be.null;
    });

    it('renders the uuid', () => {
      render();
      expect(instance.renderUuid()).not.to.be.null;
    });
  });
});
