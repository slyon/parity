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

import { observer } from 'mobx-react';
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Value from '../Value';
import styles from '../shapeshift.css';

@observer
export default class AwaitingDepositStep extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const { coinSymbol, depositAddress, price } = this.props.store;
    const typeSymbol = (
      <div className={ styles.symbol }>
        { coinSymbol }
      </div>
    );

    if (!depositAddress) {
      return (
        <div className={ styles.center }>
          <div className={ styles.busy }>
            <FormattedMessage
              id='shapeshift.awaitingDepositStep.awaitingConfirmation'
              defaultMessage='Awaiting confirmation of the deposit address for your {typeSymbol} funds exchange'
              values={ { typeSymbol } } />
          </div>
        </div>
      );
    }

    return (
      <div className={ styles.center }>
        <div className={ styles.info }>
          <FormattedMessage
            id='shapeshift.awaitingDepositStep.awaitingDeposit'
            defaultMessage='{shapeshiftLink} is awaiting a {typeSymbol} deposit. Send the funds from your {typeSymbol} network client to -'
            values={ {
              shapeshiftLink: <a href='https://shapeshift.io' target='_blank'>ShapeShift.io</a>,
              typeSymbol
            } } />
        </div>
        <div className={ styles.hero }>
          { depositAddress }
        </div>
        <div className={ styles.price }>
          <div>
            <FormattedMessage
              id='shapeshift.awaitingDepositStep.minimumMaximum'
              defaultMessage='{minimum} minimum, {maximum} maximum'
              values={ {
                maximum: <Value amount={ price.limit } symbol={ coinSymbol } />,
                minimum: <Value amount={ price.minimum } symbol={ coinSymbol } />
              } } />
          </div>
        </div>
      </div>
    );
  }
}
