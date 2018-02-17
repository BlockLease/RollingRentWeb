'use strict';

// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/App';
import Web3 from 'web3';
import DownloadMM from 'components/DownloadMM';

// Injected web3
declare var web3: Web3;

window.addEventListener('load', () => {
  if (typeof web3 === 'undefined') {
    // Metamask not injected
    ReactDOM.render(<DownloadMM />, document.getElementById('root'));
  } else {
    ReactDOM.render(<App />, document.getElementById('root'));
  }
});
