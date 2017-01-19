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

import Actionbar from '../Actionbar';
import { nodeOrStringProptype } from '~/util/proptypes';

import styles from './page.css';

export default class Page extends Component {
  static propTypes = {
    buttons: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.node,
    title: nodeOrStringProptype()
  };

  render () {
    const { buttons, className, children, title } = this.props;
    const classes = `${styles.layout} ${className}`;
    let actionbar = null;

    if (title || buttons) {
      actionbar = (
        <Actionbar
          buttons={ buttons }
          title={ title }
        />
      );
    }

    return (
      <div>
        { actionbar }
        <div className={ classes }>
          { children }
        </div>
      </div>
    );
  }
}
