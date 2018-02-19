'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import _ from 'lodash';

// Injected web3
declare var web3: Web3;

class UserStore extends Store {

  activeAccount: string;
  networkId: string;
  web3: Web3;

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.user.loaded) {
      _.assign(this, payload.data);
    } else if (payload.type === Action.user.update) {
      const _web3 = new Web3(web3.currentProvider);
      this.web3 = _web3;
      Promise.all([
        Promisify(_web3.eth, 'getAccounts'),
        Promisify(_web3.eth.net, 'getId')
      ])
        .then((results: any[]) => {
          const accounts = results[0];
          const networkId = results[1];
          const activeAccount = accounts[0];
          Dispatcher.dispatch({
            type: Action.user.loaded,
            data: { networkId, activeAccount, web3: _web3}
          });
        });
    }
  }
}

export default new UserStore(Dispatcher);
