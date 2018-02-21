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
import InactiveLeaseCell from 'components/InactiveLeaseCell';
import ActiveLeaseCell from 'components/ActiveLeaseCell';
import SharedStyles from 'src/SharedStyles';

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
    const leaseBeginString = LeaseStore.leaseStartMoment().fromNow(true);

    return (
      <div style={SharedStyles.cellContainer}>
        <h2>
          Lease Contract:&nbsp;
          <a href={contractUrl} target='_blank' style={styles.link}>
            {this.props.leaseAddress}
          </a>
        </h2>
        <h3>
          Landlord:&nbsp;
          <a href={landlordUrl} target='_blank' style={styles.link}>
            {LeaseStore.landlordAddress}
          </a>
        </h3>
        <h3>
          Tenant:&nbsp;
          <a href={tenantUrl} target='_blank' style={styles.link}>
            {LeaseStore.tenantAddress}
          </a>
        </h3>
        <h3>
          Status: {LeaseStore.signed ? 'Active' : 'Awaiting signatures'}
        </h3>
        {(() => {
          if (LeaseStore.signed) {
            return <ActiveLeaseCell leaseAddress={this.props.leaseAddress} />
          } else {
            return <InactiveLeaseCell leaseAddress={this.props.leaseAddress} />
          }
        })()}
      </div>
    );
  }
}

const styles = {
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
