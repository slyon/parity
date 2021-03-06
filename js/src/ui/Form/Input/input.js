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
import { TextField } from 'material-ui';
import { noop } from 'lodash';

import { nodeOrStringProptype } from '~/util/proptypes';

import CopyToClipboard from '../../CopyToClipboard';

import styles from './input.css';

// TODO: duplicated in Select
const UNDERLINE_DISABLED = {
  borderBottom: 'dotted 2px',
  borderColor: 'rgba(255, 255, 255, 0.125)' // 'transparent' // 'rgba(255, 255, 255, 0.298039)'
};

const UNDERLINE_READONLY = {
  ...UNDERLINE_DISABLED,
  cursor: 'text'
};

const UNDERLINE_NORMAL = {
  borderBottom: 'solid 2px'
};

const UNDERLINE_FOCUSED = {
  transform: 'scaleX(1.0)'
};

const NAME_ID = ' ';

export default class Input extends Component {
  static propTypes = {
    allowCopy: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    autoFocus: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: nodeOrStringProptype(),
    focused: PropTypes.bool,
    readOnly: PropTypes.bool,
    floatCopy: PropTypes.bool,
    hint: nodeOrStringProptype(),
    hideUnderline: PropTypes.bool,
    label: nodeOrStringProptype(),
    max: PropTypes.any,
    min: PropTypes.any,
    multiLine: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onSubmit: PropTypes.func,
    rows: PropTypes.number,
    tabIndex: PropTypes.number,
    type: PropTypes.string,
    submitOnBlur: PropTypes.bool,
    style: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  };

  static defaultProps = {
    allowCopy: false,
    hideUnderline: false,
    floatCopy: false,
    readOnly: false,
    submitOnBlur: true,
    style: {}
  }

  state = {
    value: typeof this.props.value === 'undefined'
      ? ''
      : this.props.value
  }

  componentWillReceiveProps (newProps) {
    if ((newProps.value !== this.props.value) && (newProps.value !== this.state.value)) {
      this.setValue(newProps.value);
    }

    if (newProps.focused && !this.props.focused) {
      this.refs.input.setState({ isFocused: true });
    }

    if (!newProps.focused && this.props.focused) {
      this.refs.input.setState({ isFocused: false });
    }
  }

  render () {
    const { value } = this.state;
    const { autoFocus, children, className, hideUnderline, disabled, error, focused, label } = this.props;
    const { hint, onClick, onFocus, multiLine, rows, type, min, max, style, tabIndex } = this.props;

    const readOnly = this.props.readOnly || disabled;

    const inputStyle = { overflow: 'hidden' };
    const textFieldStyle = {};

    if (readOnly) {
      inputStyle.cursor = 'text';
    }

    if (hideUnderline && !hint) {
      textFieldStyle.height = 'initial';
    }

    const underlineStyle = readOnly ? UNDERLINE_READONLY : UNDERLINE_NORMAL;
    const underlineFocusStyle = focused
      ? UNDERLINE_FOCUSED
      : readOnly && typeof focused !== 'boolean' ? { display: 'none' } : null;

    return (
      <div className={ styles.container } style={ style }>
        { this.renderCopyButton() }
        <TextField
          autoComplete='off'
          autoFocus={ autoFocus }
          className={ className }
          errorText={ error }
          floatingLabelFixed
          floatingLabelText={ label }
          fullWidth
          hintText={ hint }
          id={ NAME_ID }
          inputStyle={ inputStyle }
          max={ max }
          min={ min }
          multiLine={ multiLine }
          name={ NAME_ID }
          onBlur={ this.onBlur }
          onChange={ this.onChange }
          onClick={ onClick }
          onKeyDown={ this.onKeyDown }
          onFocus={ onFocus }
          onPaste={ this.onPaste }
          readOnly={ readOnly }
          ref='input'
          rows={ rows }
          style={ textFieldStyle }
          tabIndex={ tabIndex }
          type={ type || 'text' }
          underlineDisabledStyle={ UNDERLINE_DISABLED }
          underlineStyle={ underlineStyle }
          underlineFocusStyle={ underlineFocusStyle }
          underlineShow={ !hideUnderline }
          value={ value }
        >
          { children }
        </TextField>
      </div>
    );
  }

  renderCopyButton () {
    const { allowCopy, hideUnderline } = this.props;
    const { value } = this.state;

    if (!allowCopy) {
      return null;
    }

    const text = typeof allowCopy === 'string'
      ? allowCopy
      : value.toString();

    const style = hideUnderline
      ? {}
      : { position: 'relative', top: '2px' };

    return (
      <div className={ styles.copy } style={ style }>
        <CopyToClipboard data={ text } />
      </div>
    );
  }

  onChange = (event, value) => {
    event.persist();
    this.setValue(value, () => {
      this.props.onChange && this.props.onChange(event, value);
    });
  }

  onBlur = (event) => {
    const { value } = event.target;
    const { submitOnBlur } = this.props;

    if (submitOnBlur) {
      this.onSubmit(value);
    }

    this.props.onBlur && this.props.onBlur(event);
  }

  onPaste = (event) => {
    const value = event.clipboardData.getData('Text');

    window.setTimeout(() => {
      this.onSubmit(value);
    }, 0);
  }

  onKeyDown = (event) => {
    const { value } = event.target;

    if (event.which === 13) {
      this.onSubmit(value);
    } else if (event.which === 27) {
      // TODO ESC, revert to original
    }

    this.props.onKeyDown && this.props.onKeyDown(event);
  }

  onSubmit = (value) => {
    this.setValue(value, () => {
      this.props.onSubmit && this.props.onSubmit(value);
    });
  }

  setValue (value, cb = noop) {
    this.setState({ value }, cb);
  }
}
