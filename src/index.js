'use strict';

// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import DownloadMM from 'components/DownloadMM';
import RippleLoader from 'components/RippleLoader';
import CreateLease from 'components/CreateLease';

import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Lease from 'components/Lease';
import UserStore from 'stores/User';

// Injected web3
declare var web3: Web3;

Dispatcher.register((payload: Action<any>) => {
  if (payload.type !== Action.router.redirect) return;
  Promise.resolve().then(() => {
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
      default:
        ReactDOM.render(<CreateLease />, document.getElementById('root'));
        break;
    }
  });
});

const loadingToken = setInterval(() => {
  if (document.readyState !== 'complete') return;
  clearInterval(loadingToken);

  Promise.resolve()
    .then(() => {
      const loadingOverlay = document.getElementById('loading-overlay');
      // $FlowFixMe
      loadingOverlay.style.opacity = 0;
      setTimeout(() => Promise.resolve().then(() => {
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
