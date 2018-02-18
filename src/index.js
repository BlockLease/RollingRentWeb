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
});

ReactDOM.render(<RippleLoader />, document.getElementById('root'));

const contractAddress = '0xad30db44bb3fbc5157425c7f137ce6b1730e6e11';
const contractAbiString = '[{"constant":false,"inputs":[],"name":"collectRent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bailout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rentPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"assertContractEnabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tenant","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentWeiValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"usdOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlordBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlord","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_usdOracle","type":"address"},{"name":"_landlord","type":"address"},{"name":"_tenant","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]';
const contractAbi = JSON.parse(contractAbiString);

Dispatcher.dispatch({
  type: Action.lease.update,
  data: {
    leaseAddress: contractAddress,
    leaseAbi: contractAbi
  }
});
