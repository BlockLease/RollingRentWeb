'use strict';

// @flow

import React, { Component } from 'react';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import _ from 'lodash';
import { nextTick } from 'utils/SafeTime';

type Props = {
  title: string,
  onClick: Function,
  style: any
};

type State = {};

export default class CellButton extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        style={_.assign(styles.container, this.props.style || {})}
        onClick={this.props.onClick}
      >
        <div style={styles.buttonText}>
          {this.props.title}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    border: '2px solid #000',
    borderRadius: 10,
    color: 'white',
    cursor: 'pointer'
  },
  buttonText: {
    padding: 4,
    margin: 'auto'
  },
  headerItem: {
    padding: 8,
    display: 'inline-block'
  },
  link: {
    color: 'white',
    padding: 4
  },
  headerButton: {
    margin: 4
  }
};
