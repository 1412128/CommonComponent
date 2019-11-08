import React, { Component } from 'react';

import { Input } from 'semantic-ui-react';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class InputComponent extends Component {
  constructor(props) {
    super();

    this.state = {
      key: props.name,
      value: props.value
    };
    this.timer = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
  }

  handleChange(e) {
    clearTimeout(this.timer);

    this.setState({ value: e.target.value });
    const { onChange } = this.props;

    onChange(e.target.value);
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange();
    }
  }

  triggerChange() {
    const { key, value } = this.state;
    const { onChange } = this.props;

    onChange(key, value);
  }

  render() {
    const { value } = this.state;
    const { className, name } = this.props;

    return (
      <Input
        className={className}
        name={name}
        value={value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
