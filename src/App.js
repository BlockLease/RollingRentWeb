'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';

type Props = { };
type State = { };

// Injected web3
declare var web3: {};

window.addEventListener('load', () => {
  if (typeof web3 === 'undefined') {
    // Metamask not injected
    console.log('metamask not injected');
  } else {
    console.log('metamask injected');
  }
});

export default class App extends Component<Props, State> {
  render() {
    return (
      <div style={styles.app}>
        {(() => {
          if (typeof web3 === 'undefined') {
            // No metamask
          }
        })()}
        <button style={styles.topButton}>top</button>
        <button style={styles.bottomButton}>test</button>
      </div>
    );
  }
}

const styles = {
  app: {
    margin: 0,
    padding: 0,
    flex: 1
  },
  topButton: {
    // backgroundColor: 'blue',
    flex: 1
  },
  bottomButton: {
    // backgroundColor: 'red',
    flex: 1
  }
};
