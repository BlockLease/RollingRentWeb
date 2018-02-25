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
import moment from 'moment'
import { nextTick } from 'utils/SafeTime';

const MAINNET_ID = 1;
const RINKEBY_ID = 4;

class USDOracleStore extends Store {

  static abi;

  price: string;
  lastUpdated: string;
  oracleAddress: string;

  lastUpdatedMoment(): moment {
    return moment.unix(+this.lastUpdated || 0);
  }

  expirationMoment(): moment {
    return moment.unix(
      (+this.lastUpdated || 0) + 3600
    );
  }

  priceNeedsUpdate(): boolean {
    return this.lastUpdatedMoment().seconds(60 * 60).valueOf() < moment().seconds(0).valueOf();
  }

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.user.loaded) {
      const networkId = payload.data.networkId;
      if (networkId === MAINNET_ID) {
        nextTick(() => {
          Dispatcher.dispatch({
            type: Action.usdOracle.update,
            data: {
              oracleAddress: '0x632ad54cdf22cf06e2161ea96a04858e97258496'
            }
          });
        });
      } else if (networkId === RINKEBY_ID) {
        nextTick(() => {
          Dispatcher.dispatch({
            type: Action.usdOracle.update,
            data: {
              oracleAddress: '0x35bda36ab2d658abe60092b5792daad00ab00206'
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
        Promisify(oracleContract.methods.lastUpdated(), 'call'),
      ])
        .then((results: any[]) => {
          Dispatcher.dispatch({
            type: Action.usdOracle.loaded,
            data: {
              oracleAddress: payload.data.oracleAddress,
              price: results[0],
              lastUpdated: results[1]
            }
          });
        });
    } else if (payload.type === Action.usdOracle.beginUpdate) {
      const oracleContract = new UserStore.web3.eth.Contract(USDOracleABI, this.oracleAddress);
      Promisify(oracleContract.methods.update(0), 'send', {
        from: UserStore.activeAccount
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
