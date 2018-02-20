'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import UserStore from 'stores/User';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import EtherscanURL from 'utils/EtherscanURL';
import USDOracleStore from 'stores/USDOracle';
import { nextTick } from 'utils/SafeTime';

type Props = {};
type State = {
  networkName: string
};

export default class Footer extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register((payload: Action<any>) => {
      nextTick(() => this.forceUpdate());
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  networkName(): string {
    if (UserStore.networkId === 1) {
      return 'mainnet';
    } else if (UserStore.networkId === 4) {
      return 'rinkeby';
    } else {
      return 'unknown network';
    }
  }

  render() {
    const etherscanUrl = EtherscanURL(UserStore.activeAccount);
    const gdaxUrl = 'https://www.gdax.com/trade/ETH-USD';
    return (
      <div style={styles.container}>
        <a href='https://github.com/BlockLease' target='_blank'>
          <img
            src='/GitHub-Mark-Light-64px.png'
            width={32}
            height={32}
          />
        </a>
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    display: 'flex'
  },
  headerItem: {
    padding: 8,
    display: 'inline-block'
  },
  link: {
    color: 'white',
    padding: 4
  }
};
