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

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Container } from '~/ui';
import { fetchCertifiers, fetchCertifications } from '~/redux/providers/certifications/actions';

import Summary from '../Summary';
import styles from './list.css';

class List extends Component {
  static propTypes = {
    accounts: PropTypes.object,
    balances: PropTypes.object,
    certifications: PropTypes.object.isRequired,
    empty: PropTypes.bool,
    link: PropTypes.string,
    order: PropTypes.string,
    orderFallback: PropTypes.string,
    search: PropTypes.array,

    fetchCertifiers: PropTypes.func.isRequired,
    fetchCertifications: PropTypes.func.isRequired,
    handleAddSearchToken: PropTypes.func
  };

  render () {
    return (
      <div className={ styles.list }>
        { this.renderAccounts() }
      </div>
    );
  }

  componentWillMount () {
    const { accounts, fetchCertifiers, fetchCertifications } = this.props;
    fetchCertifiers();
    for (let address in accounts) {
      fetchCertifications(address);
    }
  }

  renderAccounts () {
    const { accounts, balances, empty } = this.props;

    if (empty) {
      return (
        <Container className={ styles.empty }>
          <div>
            There are currently no accounts or addresses to display.
          </div>
        </Container>
      );
    }

    const addresses = this.getAddresses();

    return addresses.map((address, idx) => {
      const account = accounts[address] || {};
      const balance = balances[address] || {};

      const owners = account.owners || null;

      return (
        <div
          className={ styles.item }
          key={ address }
        >
          { this.renderSummary(account, balance, owners) }
        </div>
      );
    });
  }

  renderSummary (account, balance, owners) {
    const { handleAddSearchToken, link } = this.props;

    return (
      <Summary
        account={ account }
        balance={ balance }
        handleAddSearchToken={ handleAddSearchToken }
        link={ link }
        owners={ owners }
        showCertifications
      />
    );
  }

  getAddresses () {
    const filteredAddresses = this.getFilteredAddresses();
    return this.sortAddresses(filteredAddresses);
  }

  sortAddresses (addresses) {
    const { order, orderFallback } = this.props;

    if (!order) {
      return addresses;
    }

    const { accounts } = this.props;

    return addresses.sort((addressA, addressB) => {
      const accountA = accounts[addressA];
      const accountB = accounts[addressB];

      const sort = this.compareAccounts(accountA, accountB, order);

      if (sort === 0 && orderFallback) {
        return this.compareAccounts(accountA, accountB, orderFallback);
      }

      return sort;
    });
  }

  compareAccounts (accountA, accountB, key, _reverse = null) {
    if (key && key.split(':')[1] === '-1') {
      return this.compareAccounts(accountA, accountB, key.split(':')[0], true);
    }

    if (key === 'timestamp' && _reverse === null) {
      return this.compareAccounts(accountA, accountB, key, true);
    }

    if (key === 'name') {
      return accountA.name.localeCompare(accountB.name);
    }

    if (key === 'eth') {
      const { balances } = this.props;

      const balanceA = balances[accountA.address];
      const balanceB = balances[accountB.address];

      if (!balanceA && !balanceB) {
        return 0;
      } else if (balanceA && !balanceB) {
        return -1;
      } else if (!balanceA && balanceB) {
        return 1;
      }

      const ethA = balanceA.tokens.find(token => token.token.tag.toLowerCase() === 'eth');
      const ethB = balanceB.tokens.find(token => token.token.tag.toLowerCase() === 'eth');

      if (!ethA && !ethB) {
        return 0;
      } else if (ethA && !ethB) {
        return -1;
      } else if (!ethA && ethB) {
        return 1;
      }

      return -1 * ethA.value.comparedTo(ethB.value);
    }

    if (key === 'tags') {
      const tagsA = [].concat(accountA.meta.tags)
        .filter(t => t)
        .sort()
        .join('');

      const tagsB = [].concat(accountB.meta.tags)
        .filter(t => t)
        .sort()
        .join('');

      if (!tagsA && !tagsB) {
        return 0;
      } else if (tagsA && !tagsB) {
        return -1;
      } else if (!tagsA && tagsB) {
        return 1;
      }

      return tagsA.localeCompare(tagsB);
    }

    const reverse = _reverse
      ? -1
      : 1;

    const metaA = accountA.meta[key];
    const metaB = accountB.meta[key];

    if (!metaA && !metaB) {
      return 0;
    }

    if (metaA && !metaB) {
      return -1;
    }

    if (metaA < metaB) {
      return -1 * reverse;
    }

    if (!metaA && metaB) {
      return 1;
    }

    if (metaA > metaB) {
      return 1 * reverse;
    }

    return 0;
  }

  getFilteredAddresses () {
    const { accounts, search } = this.props;
    const searchValues = (search || []).map(v => v.toLowerCase());

    if (searchValues.length === 0) {
      return Object.keys(accounts);
    }

    return Object.keys(accounts)
      .filter((address) => {
        const account = accounts[address];

        const tags = account.meta.tags || [];
        const name = account.name || '';

        const values = tags
          .concat(name)
          .map(v => v.toLowerCase());

        return searchValues
          .map(searchValue => {
            return values
              .some(value => value.indexOf(searchValue) >= 0);
          })
          // `current && truth, true` => use tokens as AND
          // `current || truth, false` => use tokens as OR
          .reduce((current, truth) => current && truth, true);
      });
  }
}

function mapStateToProps (state) {
  const { certifications } = state;
  return { certifications };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchCertifiers,
    fetchCertifications
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
