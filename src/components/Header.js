'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import UserStore from 'stores/User';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import EtherscanURL from 'utils/EtherscanURL';

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
      if (payload.type === Action.user.loaded) {
        const networkId = payload.data.networkId;
        let networkName = 'unknown network';
        if (networkId === 1) {
          networkName = 'mainnet';
        } else if (networkId === 4) {
          networkName = 'rinkeby';
        }
        this.setState({ networkName });
      }
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  render() {
    const etherscanUrl = EtherscanURL(UserStore.activeAccount);
    return (
      <div style={styles.container}>
        <div>
          blocklease - {this.state.networkName}
        </div>
        <div>
          <a href={etherscanUrl} target='_blank'>
            your address - {UserStore.activeAccount}
          </a>
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
