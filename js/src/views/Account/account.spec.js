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

import { ADDRESS, createRedux } from './account.test.js';

import Account from './';

let component;
let instance;
let store;

function render (props) {
  component = shallow(
    <Account
      params={ { address: ADDRESS } }
      { ...props } />,
    { context: { store: createRedux() } }
  ).find('Account').shallow();
  instance = component.instance();
  store = instance.store;

  return component;
}

describe('views/Account', () => {
  describe('rendering', () => {
    beforeEach(() => {
      render();
    });

    it('renders defaults', () => {
      expect(component).to.be.ok;
    });

    describe('sections', () => {
      it('renders the Actionbar', () => {
        expect(component.find('Actionbar')).to.have.length(1);
      });

      it('renders the Page', () => {
        expect(component.find('Page')).to.have.length(1);
      });

      it('renders the Header', () => {
        expect(component.find('Header')).to.have.length(1);
      });

      it('renders the Transactions', () => {
        expect(component.find('Connect(Transactions)')).to.have.length(1);
      });

      it('renders no other sections', () => {
        expect(component.find('div').children()).to.have.length(2);
      });
    });
  });

  describe('sub-renderers', () => {
    describe('renderActionBar', () => {
      let bar;
      let barShallow;

      beforeEach(() => {
        render();

        bar = instance.renderActionbar({ tokens: {} });
        barShallow = shallow(bar);
      });

      it('renders the bar', () => {
        expect(bar.type).to.match(/Actionbar/);
      });

      // TODO: Finding by index is not optimal, however couldn't find a better method atm
      // since we cannot find by key (prop not visible in shallow debug())
      describe('clicks', () => {
        it('toggles transfer on click', () => {
          barShallow.find('Button').at(0).simulate('click');
          expect(store.isTransferVisible).to.be.true;
        });

        it('toggles fund on click', () => {
          barShallow.find('Button').at(1).simulate('click');
          expect(store.isFundVisible).to.be.true;
        });

        it('toggles fund on click', () => {
          barShallow.find('Button').at(1).simulate('click');
          expect(store.isFundVisible).to.be.true;
        });

        it('toggles verify on click', () => {
          barShallow.find('Button').at(2).simulate('click');
          expect(store.isVerificationVisible).to.be.true;
        });

        it('toggles edit on click', () => {
          barShallow.find('Button').at(3).simulate('click');
          expect(store.isEditVisible).to.be.true;
        });

        it('toggles password on click', () => {
          barShallow.find('Button').at(4).simulate('click');
          expect(store.isPasswordVisible).to.be.true;
        });

        it('toggles delete on click', () => {
          barShallow.find('Button').at(5).simulate('click');
          expect(store.isDeleteVisible).to.be.true;
        });
      });
    });

    describe('renderDeleteDialog', () => {
      it('renders null when not visible', () => {
        render();

        expect(store.isDeleteVisible).to.be.false;
        expect(instance.renderDeleteDialog()).to.be.null;
      });

      it('renders the modal when visible', () => {
        render();

        store.toggleDeleteDialog();
        expect(instance.renderDeleteDialog().type).to.match(/Connect/);
      });
    });

    describe('renderEditDialog', () => {
      it('renders null when not visible', () => {
        render();

        expect(store.isEditVisible).to.be.false;
        expect(instance.renderEditDialog()).to.be.null;
      });

      it('renders the modal when visible', () => {
        render();

        store.toggleEditDialog();
        expect(instance.renderEditDialog({ address: ADDRESS }).type).to.match(/Connect/);
      });
    });

    describe('renderFundDialog', () => {
      it('renders null when not visible', () => {
        render();

        expect(store.isFundVisible).to.be.false;
        expect(instance.renderFundDialog()).to.be.null;
      });

      it('renders the modal when visible', () => {
        render();

        store.toggleFundDialog();
        expect(instance.renderFundDialog().type).to.match(/Shapeshift/);
      });
    });

    describe('renderPasswordDialog', () => {
      it('renders null when not visible', () => {
        render();

        expect(store.isPasswordVisible).to.be.false;
        expect(instance.renderPasswordDialog()).to.be.null;
      });

      it('renders the modal when visible', () => {
        render();

        store.togglePasswordDialog();
        expect(instance.renderPasswordDialog({ address: ADDRESS }).type).to.match(/Connect/);
      });
    });

    describe('renderTransferDialog', () => {
      it('renders null when not visible', () => {
        render();

        expect(store.isTransferVisible).to.be.false;
        expect(instance.renderTransferDialog()).to.be.null;
      });

      it('renders the modal when visible', () => {
        render();

        store.toggleTransferDialog();
        expect(instance.renderTransferDialog().type).to.match(/Connect/);
      });
    });

    describe('renderVerificationDialog', () => {
      it('renders null when not visible', () => {
        render();

        expect(store.isVerificationVisible).to.be.false;
        expect(instance.renderVerificationDialog()).to.be.null;
      });

      it('renders the modal when visible', () => {
        render();

        store.toggleVerificationDialog();
        expect(instance.renderVerificationDialog().type).to.match(/Connect/);
      });
    });
  });
});
