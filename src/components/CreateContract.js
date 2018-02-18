'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';

type Props = {
  web3: Web3,
  networkId: number,
  activeAccount: string
};
type State = { };

export default class CreateContract extends Component<Props, State> {
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          Deploy a lease contract.
        </div>
        <button>Deploy</button>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: 4,
    margin: 0,
    alignItems: 'center'
  },
  header: {
    padding: 8,
    display: 'inline-block',
    fontSize: 18
  }
};
