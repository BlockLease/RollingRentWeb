'use strict';

// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import DownloadMM from 'components/DownloadMM';
import RippleLoader from 'components/RippleLoader';
import CreateLease from 'components/CreateLease';
import USDOracle from 'components/USDOracle';

import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Lease from 'components/Lease';
import UserStore from 'stores/User';
import USDOracleStore from 'stores/USDOracle';
import { nextTick } from 'utils/SafeTime';

import IPFSStore from 'stores/IPFS';

// Injected web3
declare var web3: Web3;

Dispatcher.register((payload: Action<any>) => {
  if (payload.type !== Action.router.redirect) return;
  nextTick(() => {
    const path = payload.data.path.replace('#', '');
    window.location.hash = path;
    const pathComponents = path.split('/');
    switch (pathComponents[0]) {
      case 'downloadmm':
        ReactDOM.render(<DownloadMM />, document.getElementById('root'));
        break;
      case 'lease':
        if (pathComponents[1]) {
          // Lease info
          ReactDOM.render(<Lease
            leaseAddress={pathComponents[1]}
          />, document.getElementById('root'));
        } else {
          // create a lease
          ReactDOM.render(<CreateLease />, document.getElementById('root'));
        }
        break;
      case 'oracle':
        ReactDOM.render(<USDOracle
          oracleAddress={pathComponents[1] || USDOracleStore.oracleAddress}
        />, document.getElementById('root'));
        break;
      default:
        ReactDOM.render(<CreateLease />, document.getElementById('root'));
        break;
    }
  });
});

/**
 * TODO: Clean up this recursive mess of a loading cycle
 **/
const loadingToken = setInterval(() => {
  if (document.readyState !== 'complete') return;
  clearInterval(loadingToken);
  /**
   * Defer execution to avoid warnings about long setInterval callback times
   **/
  nextTick(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
      console.log('Loading overlay element not found in document');
    }
    // $FlowFixMe
    loadingOverlay.style.opacity = 0;

    /**
     * Remove the loading element after the appropriate animation time
     * It's currently set to 1 second (1000 ms)
     *
     * Also using nextTick to avoid the timer callback warning
     **/
    setTimeout(() => nextTick(() => {
      // $FlowFixMe
      document.body.removeChild(loadingOverlay);
      Dispatcher.dispatch({
        type: Action.router.redirect,
        data: {
          path: window.location.hash
        }
      });
    }), 1000);

    if (typeof web3 === 'undefined') {
      // Metamask not injected
      Dispatcher.dispatch({
        type: Action.router.redirect,
        data: {
          path: 'downloadmm'
        }
      });
    } else {
      Dispatcher.dispatch({
        type: Action.initialize
      });
      Dispatcher.dispatch({
        type: Action.user.update
      });
      Dispatcher.dispatch({
        type: Action.router.redirect,
        data: {
          path: window.location.hash
        }
      });
    }
  });
}, 500);
