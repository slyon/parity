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
import { FormattedMessage } from 'react-intl';

import { GasPriceEditor, Form, Input } from '~/ui';

import styles from '../transfer.css';

export default class Extras extends Component {
  static propTypes = {
    data: PropTypes.string,
    dataError: PropTypes.string,
    gasStore: PropTypes.object.isRequired,
    isEth: PropTypes.bool,
    minBlock: PropTypes.string,
    minBlockError: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    total: PropTypes.string,
    totalError: PropTypes.string
  }

  render () {
    const { gasStore, minBlock, minBlockError, onChange } = this.props;

    return (
      <Form>
        { this.renderData() }
        <Input
          error={ minBlockError }
          hint={
            <FormattedMessage
              id='transferModal.minBlock.hint'
              defaultMessage='Only post the transaction after this block'
            />
          }
          label={
            <FormattedMessage
              id='transferModal.minBlock.label'
              defaultMessage='BlockNumber to send from'
            />
          }
          value={ minBlock }
          onChange={ this.onEditMinBlock }
        />
        <div className={ styles.gaseditor }>
          <GasPriceEditor
            store={ gasStore }
            onChange={ onChange }
          />
        </div>
      </Form>
    );
  }

  renderData () {
    const { isEth, data, dataError } = this.props;

    if (!isEth) {
      return null;
    }

    return (
      <Input
        error={ dataError }
        hint={
          <FormattedMessage
            id='transfer.advanced.data.hint'
            defaultMessage='the data to pass through with the transaction'
          />
        }
        label={
          <FormattedMessage
            id='transfer.advanced.data.label'
            defaultMessage='transaction data'
          />
        }
        onChange={ this.onEditData }
        value={ data }
      />
    );
  }

  onEditData = (event) => {
    this.props.onChange('data', event.target.value);
  }

  onEditMinBlock = (event) => {
    this.props.onChange('minBlock', event.target.value);
  }
}
