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

export default class Header extends Component<Props, State> {
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.headerItem}>
          blocklease.io - Lease properties securely
        </div>
        <div style={styles.headerItem}>
          <div>
            {(() => {
              if (this.props.networkId === 1) {
                return 'Mainnet';
              } else if (this.props.networkId === 4) {
                return 'Rinkeby';
              } else {
                return 'Unkown Network';
              }
            })()}
          </div>
          <div>{this.props.activeAccount}</div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: 4,
    margin: 0,
    height: 50,
    width: '100%',
    backgroundColor: 'black',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerItem: {
    padding: 8,
    display: 'inline-block'
  }
};
