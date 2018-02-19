'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import UserStore from 'stores/User';
import _ from 'lodash';

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
        throw new Error('No mainnet usd oracle available');
      } else if (networkId === 4) {
        setTimeout(() => Dispatcher.dispatch({
          type: Action.usdOracle.update,
          data: {
            oracleAddress: '0x4159466da2e1caa9a4151fd9cf232c6Dd940372A'
          }
        }), 1);
      }
    }
    if (payload.type === Action.usdOracle.loaded) {
      console.log(payload.data);
      _.assign(this, payload.data);
    } else if (payload.type === Action.usdOracle.update) {
      const _web3 = new Web3(UserStore.web3.currentProvider);
      const oracleContract = new _web3.eth.Contract(USDOracleStore.abi, payload.data.oracleAddress);
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
              price: results[0],
              priceNeedsUpdate: results[1],
              updateCost: results[2],
              lastUpdated: results[3],
              priceExpirationInterval: results[4]
            }
          });
        });
    }
  }
}

USDOracleStore.abi = JSON.parse( '[{"constant":false,"inputs":[{"name":"_myid","type":"bytes32"},{"name":"_result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"datasource","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"priceNeedsUpdate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferERC20","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"update","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_usd","type":"uint256"}],"name":"usdToWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"priceExpirationInterval","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"updateCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdated","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');

export default new USDOracleStore(Dispatcher);
