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

export default class InactiveLeaseCell extends Component<Props, State> {

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
    const leaseBeginString = LeaseStore.leaseStartMoment().fromNow(true);

    return (
      <div style={styles.container}>
        <div>
          Lease is active.
        </div>
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
    );
  }
}

const styles = {
  container: {
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
