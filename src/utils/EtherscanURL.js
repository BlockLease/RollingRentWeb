'use strict';

// @flow

import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';

const rinkebyPrefix = 'https://rinkeby.etherscan.io/address/';
const mainnetPrefix = 'https://etherscan.io/address/';

let activePrefix = rinkebyPrefix;

Dispatcher.register((payload: any) => {
  if (payload.type === Action.user.loaded) {
    const networkId = payload.data.networkId;
    if (networkId === 1) {
      activePrefix = mainnetPrefix;
    } else if (networkId === 4) {
      activePrefix = rinkebyPrefix;
    } else {
      activePrefix = rinkebyPrefix;
    }
  }
});

export default function EtherscanURL(address: string): string {
  return `${activePrefix}${address}`;
}
