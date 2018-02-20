'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import UserStore from 'stores/User';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import EtherscanURL from 'utils/EtherscanURL';
import USDOracleStore from 'stores/USDOracle';
import LeaseStore from 'stores/Lease';

type Props = {};
type State = {
  networkName: string
};

export default class Header extends Component<Props, State> {

  dispatchToken: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      networkName: 'unknown network'
    };
  }

  componentDidMount() {
    this.dispatchToken = Dispatcher.register((payload: Action<any>) => {
      this.forceUpdate();
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
        <div>
          blocklease - {this.networkName()}
        </div>
        <div>
          <a href={etherscanUrl} target='_blank' style={styles.link}>
            {UserStore.activeAccount || 'unknown account'}
          </a>
          <a href={gdaxUrl} target='_blank' style={styles.link}>
            ${USDOracleStore.price / 100 || '0'} / ETH
          </a>
          <button onClick={() => {
            Dispatcher.dispatch({
              type: Action.usdOracle.beginUpdate,
              data: {}
            });
          }}>
            Update Price
          </button>
        </div>
        <div>
          <button
            style={styles.headerButton}
            onClick={() => Dispatcher.dispatch({
              type: Action.router.redirect,
              data: {
                path: 'lease'
              }
            })}
          >
            Deploy Contract
          </button>
          <button
            style={styles.headerButton}
            onClick={() => Dispatcher.dispatch({
              type: Action.router.redirect,
              data: {
                path: `lease/${LeaseStore.sampleContractAddress()}`
              }
            })}
          >
            Sample Lease
          </button>
          <button
            style={styles.headerButton}
            onClick={() => Dispatcher.dispatch({
              type: Action.router.redirect,
              data: {
                path: `oracle`
              }
            })}
          >
            USD Oracle
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    // position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: 4,
    margin: 0,
    height: 70,
    backgroundColor: 'black',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center'
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
