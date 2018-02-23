'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import _ from 'lodash';
import { nextTick } from 'utils/SafeTime';

// Injected web3
declare var web3: Web3;

class UserStore extends Store {

  activeAccount: string;
  networkId: string;
  web3: Web3;

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.user.loaded) {
      _.assign(this, payload.data);
      console.assert(this.web3, 'No web3 present on UserStore');
    } else if (payload.type === Action.user.update) {
      Promise.all([
        Promisify(this.web3.eth, 'getAccounts'),
        Promisify(this.web3.eth.net, 'getId')
      ])
        .then((results: any[]) => {
          const activeAccount = results[0][0];
          const networkId = results[1];
          Dispatcher.dispatch({
            type: Action.user.loaded,
            data: { networkId, activeAccount, web3: this.web3}
          });
        });
    } else if (payload.type === Action.initialize) {
      this.web3 = new Web3(web3.currentProvider);
    }
  }
}

export default new UserStore(Dispatcher);
