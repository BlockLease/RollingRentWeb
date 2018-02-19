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

type Props = {
  leaseAddress: string
};
type State = {
  leaseContract: Web3.Contract
};

export default class LeaseCell extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      if (UserStore.web3) {
        this.setState({
          leaseContract: new UserStore.web3.eth.Contract(LeaseABI, this.props.leaseAddress)
        });
      } else {
        setTimeout(() => this.forceUpdate(), 1);
      }
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

    const usdEthPrice = USDOracleStore.price / 100;
    const contractBalanceEth = UserStore.web3.utils.fromWei(LeaseStore.contractBalanceWei || '0');
    const landlordBalanceEth = UserStore.web3.utils.fromWei(LeaseStore.landlordBalanceWei || '0');
    const rentOwedEth = UserStore.web3.utils.fromWei(LeaseStore.rentOwedWei || '0');
    const rentPriceUsd = LeaseStore.rentPrice || '0';

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
          landlord: {LeaseStore.landlordAddress}
        </div>
        <div>
          tenant: {LeaseStore.tenantAddress}
        </div>
        <div>
          lease start date: {moment.unix(LeaseStore.leaseStartTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </div>
        <div>
          lease cycle length: {LeaseStore.leaseCycleTime}
        </div>
        <div>
          rent price: ${rentPriceUsd} = {+rentPriceUsd / usdEthPrice} eth
        </div>
        <br />
        <div>
          contract balance: {contractBalanceEth} = ${contractBalanceEth * usdEthPrice}
        </div>
        <div>
          rent owed: {rentOwedEth} = ${rentOwedEth * usdEthPrice}
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
              Promisify(this.state.leaseContract.methods.sign(), 'send', {
                from: UserStore.activeAccount
              })
                .then(() => Dispatcher.dispatch({
                  type: Action.lease.update,
                  data: {
                    leaseAddress: this.props.leaseAddress
                  }
                }));
            }}
            style={{
              display: LeaseStore.signed ? 'none' : undefined
            }}
          >
            Sign
          </button>
          <button
            onClick={() => Dispatcher.dispatch({
              type: Action.lease.payRent,
              data: {}
            })}
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
  }
};
