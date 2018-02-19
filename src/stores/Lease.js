'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import UserStore from 'stores/User';
import _ from 'lodash';
import LeaseABI from 'utils/LeaseABI';
import USDOracleStore from 'stores/USDOracle';

// Injected web3
declare var web3: Web3;

class LeaseStore extends Store {

  leaseAddress: string;
  leaseStartTime: string;
  leaseCycleTime: string;
  landlordBalanceWei: string;
  contractBalanceWei: string;
  usdOracleAddress: string;
  rentPrice: string;
  currentCycle: string;
  signed: boolean;
  rentOwedWei: string;

  tenantAddress: string;
  landlordAddress: string;

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.lease.loaded) {
      _.assign(this, payload.data);
    } else if (payload.type === Action.lease.update) {
      console.assert(payload.data.leaseAddress, 'No lease address supplied to load');
      console.assert(web3, 'No web3 found');
      const _web3 = new Web3(web3.currentProvider);
      const leaseContract = new _web3.eth.Contract(LeaseABI, payload.data.leaseAddress);
      Promise.all([
        Promisify(leaseContract.methods.startTime(), 'call'),
        Promisify(leaseContract.methods.cycleTime(), 'call'),
        Promisify(leaseContract.methods.landlordBalance(), 'call'),
        _web3.eth.getBalance(payload.data.leaseAddress),
        Promisify(leaseContract.methods.cyclePriceUsd(), 'call'),
        Promisify(leaseContract.methods.usdOracle(), 'call'),
        Promisify(leaseContract.methods.landlord(), 'call'),
        Promisify(leaseContract.methods.tenant(), 'call'),
        Promisify(leaseContract.methods.leaseCycle(), 'call'),
        Promisify(leaseContract.methods.signed(), 'call'),
        Promisify(leaseContract.methods.rentOwed(), 'call')
      ])
        .then((results: any[]) => {
          Dispatcher.dispatch({
            type: Action.lease.loaded,
            data: {
              leaseAddress: payload.data.leaseAddress,
              leaseStartTime: results[0],
              leaseCycleTime: results[1],
              landlordBalanceWei: results[2],
              contractBalanceWei: results[3],
              rentPrice: results[4],
              usdOracleAddress: results[5],
              landlordAddress: results[6],
              tenantAddress: results[7],
              currentCycle: results[8],
              signed: results[9],
              rentOwedWei: results[10]
            }
          });
        });
    } else if (payload.type === Action.lease.create) {
      console.assert(payload.data.landlordAddress, 'No landlordAddress supplied');
      console.assert(payload.data.tenantAddress, 'No tenantAddress supplied');
      console.assert(payload.data.leaseCyclePriceUsd, 'No leaseCyclePriceUsd supplied');
      console.assert(payload.data.leaseStartTime, 'No leaseStartTime supplied');
      console.assert(payload.data.leaseCycleTime, 'No leaseCycleTime supplied');
      const _web3 = new Web3(web3.currentProvider);
      const lease = new _web3.eth.Contract(LeaseABI, {
        from: UserStore.activeAccount,
        data: LeaseStore.leaseBytecode
      });
      //
      // lease.deploy([
      //
      // ])
    } else if (payload.type === Action.lease.payRent) {
      const _web3 = new Web3(web3.currentProvider);
      const leaseContract = new _web3.eth.Contract(LeaseABI, this.leaseAddress);
      Promisify(leaseContract.methods.payRent(), 'send', {
        from: UserStore.activeAccount,
        value: this.rentOwedWei
      })
        .then(() => Dispatcher.dispatch({
          type: Action.lease.update,
          data: {
            leaseAddress: this.leaseAddress
          }
        }));
    }
  }
}

export default new LeaseStore(Dispatcher);
