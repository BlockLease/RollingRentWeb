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
import LeaseBytecode from 'utils/LeaseBytecode';
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

  sampleContractAddress(): string {
    if (UserStore.networkId === 1) {
      return '0x762b57e6a4ed578f3d79ce1fbd48da62ae357fe1';
    } else if (UserStore.networkId === 4) {
      return '0x7E703A76319ac4ac8CbcbFe7E19c7b2307bD37f0';
    } else {
      throw new Error('Unknown network');
    }
  }

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
      const _web3 = new Web3(UserStore.web3.currentProvider);
      const lease = new _web3.eth.Contract(LeaseABI);
      const transaction = lease.deploy({
        data: LeaseBytecode,
        arguments: [
          USDOracleStore.oracleAddress,
          payload.data.landlordAddress,
          payload.data.tenantAddress,
          payload.data.leaseStartTime,
          payload.data.leaseCycleTime,
          payload.data.leaseCyclePriceUsd,
          payload.data.minCycleCount
        ]
      });
      transaction.estimateGas()
        .then((gas: number) => transaction.send({
          from: UserStore.activeAccount,
          gas
        }))
        .then(contract => {
          Dispatcher.dispatch({
            type: Action.lease.created,
            data: contract
          });
        })
        .catch(err => {
          Dispatcher.dispatch({
            type: Action.lease.error,
            data: err
          });
        });
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
