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

    const cycleDays = LeaseStore.leaseCycleTime / 60 / 60 / 24;
    const minCycleCountDays = cycleDays * LeaseStore.minCycleCount;

    return (
      <div style={styles.container}>
        <div>
          The lease between "Landlord" and "Tenant" as defined above is agreed to begin upon {LeaseStore.leaseStartMoment().toISOString()}.
          <br /><br />
          If both parties have not signed the lease before the start date above any funds will be automatically transferred back to the tenant address during contract self destruction.
          <br /><br />
          The payment schedule is ${rentPriceUsd} every {cycleDays} days, for a minimum of {minCycleCountDays} days ({minCycleCountDays / 30} months).
          <br /><br />
          <h3>Tenant Rights</h3>
          After the minimum cycle time has passed the contract may be terminated by the tenant by supplying the current cycle of rent plus an additional cycle of rent. Tenant must call terminate at least 1 cycle before termination of payment.
          <br /><br />
          <h3>Landlord Termination</h3>
          After the minimum cycle time has passed
          There is currently a balance of {contractBalanceEth} Eth (${contractBalanceEth * usdEthPrice}) in the contract.
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
        </div>
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
