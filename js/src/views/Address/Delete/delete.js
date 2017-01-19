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

import { ConfirmDialog, IdentityIcon, IdentityName } from '~/ui';
import { newError } from '~/redux/actions';

import styles from '../address.css';

class Delete extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired,
    router: PropTypes.object
  };

  static propTypes = {
    route: PropTypes.string.isRequired,

    address: PropTypes.string,
    account: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    newError: PropTypes.func
  };

  render () {
    const { account, visible } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <ConfirmDialog
        className={ styles.delete }
        title='confirm removal'
        visible
        onDeny={ this.closeDeleteDialog }
        onConfirm={ this.onDeleteConfirmed }
      >
        <div className={ styles.hero }>
          Are you sure you want to remove the following address from your addressbook?
        </div>
        <div className={ styles.info }>
          <IdentityIcon
            className={ styles.icon }
            address={ account.address }
          />
          <div className={ styles.nameinfo }>
            <div className={ styles.header }>
              <IdentityName address={ account.address } unknown />
            </div>
            <div className={ styles.address }>
              { account.address }
            </div>
          </div>
        </div>
        <div className={ styles.description }>
          { account.meta.description }
        </div>
      </ConfirmDialog>
    );
  }

  onDeleteConfirmed = () => {
    const { api, router } = this.context;
    const { account, route, newError } = this.props;

    api.parity
      .removeAddress(account.address)
      .then(() => {
        router.push(route);
        this.closeDeleteDialog();
      })
      .catch((error) => {
        console.error('onDeleteConfirmed', error);
        newError(new Error(`Deletion failed: ${error.message}`));
        this.closeDeleteDialog();
      });
  }

  closeDeleteDialog = () => {
    this.props.onClose();
  }
}

function mapStateToProps (state) {
  return {};
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ newError }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Delete);
