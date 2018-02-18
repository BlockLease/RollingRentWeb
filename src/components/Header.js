'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import UserStore from 'stores/User';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';

type Props = {};
type State = {};

export default class Header extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register((payload: Action<any>) => {
      if (payload.type === Action.user.loaded) this.forceUpdate();
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.headerItem}>
          blocklease
        </div>
        <div style={styles.headerItem}>
          <div>
            {(() => {
              if (UserStore.networkId === 1) {
                return 'Mainnet';
              } else if (UserStore.networkId === 4) {
                return 'Rinkeby';
              } else {
                return 'Unknown Network';
              }
            })()}
          </div>
          <div>{UserStore.activeAccount}</div>
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
