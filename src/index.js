'use strict';

// @flow

import React from 'react';
import ReactDOM from 'react-dom';
// import App from 'src/App';
import Web3 from 'web3';
import Home from 'components/Home';
import DownloadMM from 'components/DownloadMM';
import RippleLoader from 'components/RippleLoader';
import CreateLease from 'components/CreateLease';

import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Lease from 'components/Lease';
import UserStore from 'stores/User';

// Injected web3
declare var web3: Web3;

window.addEventListener('load', () => {
  if (typeof web3 === 'undefined') {
    // Metamask not injected
    setTimeout(() => Dispatcher.dispatch({
      type: Action.router.redirect,
      data: {
        path: 'downloadmm'
      }
    }), 800);
  } else {
    setTimeout(() => Dispatcher.dispatch({
      type: Action.router.redirect,
      data: {
        path: window.location.hash
      }
    }), 800);
    Dispatcher.dispatch({
      type: Action.user.update
    });
  }
});

Dispatcher.register((payload: Action<any>) => {
  if (payload.type !== Action.router.redirect) return;
  setTimeout(() => {
    const path = payload.data.path.replace('#', '');
    window.location.hash = path;
    const pathComponents = path.split('/');
    switch (pathComponents[0]) {
      case 'home':
        ReactDOM.render(<Home />, document.getElementById('root'));
        break;
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
        console.log('lease address', pathComponents[1]);
        break;
      case 'loading':
        ReactDOM.render(<RippleLoader />, document.getElementById('root'));
        break;
      default:
        ReactDOM.render(<Home />, document.getElementById('root'));
        break;
    }
  }, 1);
});

ReactDOM.render(<RippleLoader />, document.getElementById('root'));
