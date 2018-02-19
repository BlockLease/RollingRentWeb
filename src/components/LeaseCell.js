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
    return (
      <div style={styles.container}>
        <h2>
          Lease Contract: {this.props.leaseAddress}
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
          lease cycle length: {LeaseStore.leaseCycleTime}
        </div>
        <div>
          lease start date: {moment.unix(LeaseStore.leaseStartTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </div>
        <div>
          <span>Tenant</span>
          <button onClick={() => {
            Promisify(this.state.leaseContract.methods.sign(), 'send', {
              from: UserStore.activeAccount
            })
              .then(() => Dispatcher.dispatch({
                type: Action.lease.update,
                data: {
                  leaseAddress: this.props.leaseAddress
                }
              }));
            // contract.
          }}>Sign</button>
          <button onClick={() => {
            Promisify(this.state.leaseContract.methods.payRent(), 'send', {
              from: UserStore.activeAccount,
              value: USDOracleStore.price
            })
              .then(() => Dispatcher.dispatch({
                type: Action.lease.update,
                data: {
                  leaseAddress: this.props.leaseAddress
                }
              }));
            // contract.
          }}>Pay Rent</button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 'auto',
    padding: 8,
    textAlign: 'center'
  }
};
