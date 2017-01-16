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
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FileIcon from 'material-ui/svg-icons/action/description';
import { uniq, isEqual } from 'lodash';

import { Actionbar, ActionbarSearch, ActionbarSort, Button, Page } from '~/ui';
import { AddContract, DeployContract } from '~/modals';
import { setVisibleAccounts } from '~/redux/providers/personalActions';

import List from '../Accounts/List';

class Contracts extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    setVisibleAccounts: PropTypes.func.isRequired,

    balances: PropTypes.object,
    accounts: PropTypes.object,
    contracts: PropTypes.object,
    hasContracts: PropTypes.bool
  }

  state = {
    addContract: false,
    deployContract: false,
    sortOrder: 'blockNumber',
    searchValues: [],
    searchTokens: []
  }

  componentWillMount () {
    this.setVisibleAccounts();
  }

  componentWillReceiveProps (nextProps) {
    const prevAddresses = Object.keys(this.props.contracts);
    const nextAddresses = Object.keys(nextProps.contracts);

    if (prevAddresses.length !== nextAddresses.length || !isEqual(prevAddresses.sort(), nextAddresses.sort())) {
      this.setVisibleAccounts(nextProps);
    }
  }

  componentWillUnmount () {
    this.props.setVisibleAccounts([]);
  }

  setVisibleAccounts (props = this.props) {
    const { contracts, setVisibleAccounts } = props;
    const addresses = Object.keys(contracts);
    setVisibleAccounts(addresses);
  }

  render () {
    const { contracts, hasContracts, balances } = this.props;
    const { searchValues, sortOrder } = this.state;

    return (
      <div>
        { this.renderActionbar() }
        { this.renderAddContract() }
        { this.renderAddContract() }
        { this.renderDeployContract() }
        <Page>
          <List
            link='contracts'
            search={ searchValues }
            accounts={ contracts }
            balances={ balances }
            empty={ !hasContracts }
            order={ sortOrder }
            orderFallback='name'
            handleAddSearchToken={ this.onAddSearchToken }
          />
        </Page>
      </div>
    );
  }

  renderSortButton () {
    const onChange = (sortOrder) => {
      this.setState({ sortOrder });
    };

    return (
      <ActionbarSort
        key='sortAccounts'
        id='sortContracts'
        order={ this.state.sortOrder }
        metas={ [
          { key: 'timestamp', label: 'date' },
          { key: 'blockNumber:-1', label: 'mined block' }
        ] }
        showDefault={ false }
        onChange={ onChange } />
    );
  }

  renderSearchButton () {
    const onChange = (searchTokens, searchValues) => {
      this.setState({ searchTokens, searchValues });
    };

    return (
      <ActionbarSearch
        key='searchContract'
        tokens={ this.state.searchTokens }
        onChange={ onChange } />
    );
  }

  renderActionbar () {
    const buttons = [
      <Button
        key='addContract'
        icon={ <ContentAdd /> }
        label='watch contract'
        onClick={ this.onAddContract } />,
      <Button
        key='deployContract'
        icon={ <ContentAdd /> }
        label='deploy contract'
        onClick={ this.onDeployContract } />,
      <Link
        to='/contracts/develop'
        key='writeContract'
      >
        <Button
          icon={ <FileIcon /> }
          label='develop contract'
        />
      </Link>,

      this.renderSearchButton(),
      this.renderSortButton()
    ];

    return (
      <Actionbar
        title='Contracts'
        buttons={ buttons } />
    );
  }

  renderAddContract () {
    const { contracts } = this.props;
    const { addContract } = this.state;

    if (!addContract) {
      return null;
    }

    return (
      <AddContract
        contracts={ contracts }
        onClose={ this.onAddContractClose } />
    );
  }

  renderDeployContract () {
    const { accounts } = this.props;
    const { deployContract } = this.state;

    if (!deployContract) {
      return null;
    }

    return (
      <DeployContract
        accounts={ accounts }
        onClose={ this.onDeployContractClose } />
    );
  }

  onAddSearchToken = (token) => {
    const { searchTokens } = this.state;
    const newSearchTokens = uniq([].concat(searchTokens, token));
    this.setState({ searchTokens: newSearchTokens });
  }

  onDeployContractClose = () => {
    this.setState({ deployContract: false });
  }

  onDeployContract = () => {
    this.setState({ deployContract: true });
  }

  onAddContractClose = () => {
    this.setState({ addContract: false });
  }

  onAddContract = () => {
    this.setState({ addContract: true });
  }
}

function mapStateToProps (state) {
  const { accounts, contracts, hasContracts } = state.personal;
  const { balances } = state.balances;

  return {
    accounts,
    contracts,
    hasContracts,
    balances
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setVisibleAccounts
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contracts);
