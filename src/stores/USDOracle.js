'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import UserStore from 'stores/User';
import _ from 'lodash';
import USDOracleABI from 'utils/USDOracleABI';

class USDOracleStore extends Store {

  static abi;

  price: string;
  priceNeedsUpdate: boolean;
  updateCost: string;
  lastUpdated: string;
  priceExpirationInterval: string;
  oracleAddress: string;

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.user.loaded) {
      const networkId = payload.data.networkId;
      if (networkId === 1) {
        Promise.resolve().then(() => {
          Dispatcher.dispatch({
            type: Action.usdOracle.update,
            data: {
              oracleAddress: '0x632ad54cdf22cf06e2161ea96a04858e97258496'
            }
          });
        });
      } else if (networkId === 4) {
        Promise.resolve().then(() => {
          Dispatcher.dispatch({
            type: Action.usdOracle.update,
            data: {
              oracleAddress: '0xd15c88e2c2ca6756e4fdb73b75a1d5443f6c096d'
            }
          });
        });
      } else {
        throw new Error(`Unknown networkId specified: ${networkId}`);
      }
    }
    if (payload.type === Action.usdOracle.loaded) {
      _.assign(this, payload.data);
    } else if (payload.type === Action.usdOracle.update) {
      const _web3 = new Web3(UserStore.web3.currentProvider);
      const oracleContract = new _web3.eth.Contract(USDOracleABI, payload.data.oracleAddress);
      Promise.all([
        Promisify(oracleContract.methods.price(), 'call'),
        Promisify(oracleContract.methods.priceNeedsUpdate(), 'call'),
        Promisify(oracleContract.methods.updateCost(), 'call'),
        Promisify(oracleContract.methods.lastUpdated(), 'call'),
        Promisify(oracleContract.methods.priceExpirationInterval(), 'call')
      ])
        .then((results: any[]) => {
          Dispatcher.dispatch({
            type: Action.usdOracle.loaded,
            data: {
              oracleAddress: payload.data.oracleAddress,
              price: results[0],
              priceNeedsUpdate: results[1],
              updateCost: results[2],
              lastUpdated: results[3],
              priceExpirationInterval: results[4]
            }
          });
        });
    } else if (payload.type === Action.usdOracle.beginUpdate) {
      const _web3 = new Web3(UserStore.web3.currentProvider);
      const oracleContract = new _web3.eth.Contract(USDOracleABI, this.oracleAddress);
      Promisify(oracleContract.methods.update(), 'send', {
        from: UserStore.activeAccount,
        value: this.updateCost
      })
        .then(() => {
          Dispatcher.dispatch({
            type: Action.usdOracle.update,
            data: {
              oracleAddress: this.oracleAddress
            }
          });
        });
    }
  }
}

export default new USDOracleStore(Dispatcher);
