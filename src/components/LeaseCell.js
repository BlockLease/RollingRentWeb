'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';
import LeaseABI from 'utils/LeaseABI';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import moment from 'moment';
import USDOracleStore from 'stores/USDOracle';
import EtherscanURL from 'utils/EtherscanURL';
import { nextTick } from 'utils/SafeTime';
import CellButton from 'components/CellButton';

type Props = {
  leaseAddress: string
};
type State = {};

export default class LeaseCell extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      nextTick(() => this.forceUpdate());
    });

    Dispatcher.dispatch({
      type: Action.lease.update,
      data: {
        leaseAddress: this.props.leaseAddress
      }
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  render() {
    const contractUrl = EtherscanURL(this.props.leaseAddress);
    const landlordUrl = EtherscanURL(LeaseStore.landlordAddress);
    const tenantUrl = EtherscanURL(LeaseStore.tenantAddress);

    const usdEthPrice = +USDOracleStore.price / 100;
    const contractBalanceEth = UserStore.web3.utils.fromWei(LeaseStore.contractBalanceWei || '0');
    const landlordBalanceEth = UserStore.web3.utils.fromWei(LeaseStore.landlordBalanceWei || '0');
    const rentOwedEth = UserStore.web3.utils.fromWei(LeaseStore.rentOwedWei || '0');
    const rentPriceUsd = LeaseStore.rentPrice || '0';
    console.log(LeaseStore);
    const leaseBeginString = LeaseStore.leaseStartMoment().fromNow(true);

    return (
      <div style={styles.container}>
        <h2>
          Lease Contract:&nbsp;
          <a href={contractUrl} target='_blank' style={styles.link}>
            {this.props.leaseAddress}
          </a>
        </h2>
        <h3>
          Status: {LeaseStore.signed ? 'Active' : 'Awaiting signatures'}
        </h3>
        <div>
          Landlord:&nbsp;
          <a href={landlordUrl} target='_blank' style={styles.link}>
            {LeaseStore.landlordAddress}
          </a>
        </div>
        <div>
          Tenant:&nbsp;
          <a href={tenantUrl} target='_blank' style={styles.link}>
            {LeaseStore.tenantAddress}
          </a>
        </div>
        <div>
          Lease begins in {leaseBeginString}
        </div>
        <div>
          Lease cycle length: {LeaseStore.leaseCycleTime} seconds
        </div>
        <div>
          Rent price: ${rentPriceUsd} = {+rentPriceUsd / usdEthPrice} eth
        </div>
        <br />
        <div>
          Contract balance: {contractBalanceEth} = ${contractBalanceEth * usdEthPrice}
        </div>
        <br />
        <div>
          <h3>
            {(() => {
              if (UserStore.activeAccount === LeaseStore.tenantAddress) {
                return 'You are the tenant on this lease';
              } else if (UserStore.activeAccount === LeaseStore.landlordAddress) {
                return 'You are the landlord on this lease';
              }
            })()}
          </h3>
        </div>
        <div style={{padding: 4}}>
          <button
            onClick={() => {
              Dispatcher.dispatch({
                type: Action.lease.sign,
                data: {}
              });
            }}
            style={{
              display: LeaseStore.signed ? 'none' : undefined
            }}
          >
            Sign
          </button>
          <button
            onClick={() => {
              Dispatcher.dispatch({
                type: Action.lease.payRent,
                data: {}
              })
            }}
            style={{
              display: LeaseStore.signed ? undefined : 'none'
            }}
          >
            Pay Rent
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 'auto',
    padding: 8,
    textAlign: 'center',
    border: '2px solid #000',
    margin: 8,
    borderRadius: 20
  },
  link: {
    color: 'black'
  },
  address: {
    width: 20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
