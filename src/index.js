'use strict';

// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DownloadMM from './components/DownloadMM';

// Injected web3
declare var web3: {};

window.addEventListener('load', () => {
  if (typeof web3 === 'undefined') {
    // Metamask not injected
    console.log('metamask not injected');
    ReactDOM.render(<DownloadMM />, document.getElementById('root'));
  } else {
    console.log('metamask injected');
    ReactDOM.render(<App />, document.getElementById('root'));
  }
});
