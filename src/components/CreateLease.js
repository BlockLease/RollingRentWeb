'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';
import LeaseBytecode from 'utils/LeaseBytecode';
import LeaseABI from 'utils/LeaseABI';
import Web3 from 'web3';
import USDOracleStore from 'stores/USDOracle';
import _ from 'lodash';
import RippleLoader from 'components/RippleLoader';
import Footer from 'components/Footer';

type Props = { };
type State = {
  landlordAddress: string,
  tenantAddress: string,
  rentPriceUsd: string,
  minCycleCount: number,
  deploying: boolean
};

export default class Lease extends Component<Props, State> {

  dispatchToken: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      landlordAddress: '',
      tenantAddress: '',
      rentPriceUsd: '',
      minCycleCount: 0,
      deploying: false
    };
  }

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      if (action.type === Action.lease.loaded) this.forceUpdate();
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  handleSubmit(event: any) {
    event.preventDefault();
    const _web3 = new Web3(UserStore.web3.currentProvider);
    const lease = new _web3.eth.Contract(LeaseABI);
    const transaction = lease.deploy({
      data: LeaseBytecode,
      arguments: [
        USDOracleStore.oracleAddress,
        this.state.landlordAddress,
        this.state.tenantAddress,
        (Date.now() / 1000) + (60 * 30),
        60 * 60 * 4,
        this.state.rentPriceUsd,
        this.state.minCycleCount
      ]
    });
    this.setState({
      deploying: true
    });
    transaction.estimateGas()
      .then(gas => transaction.send({
        from: UserStore.activeAccount,
        gas
      }))
      .then(contract => {
        console.log('done', contract);
        Dispatcher.dispatch({
          type: Action.router.redirect,
          data: {
            path: `lease/${contract._address}`
          }
        });
      })
      .catch(err => {
        console.log('err', err);
        this.setState({
          deploying: false
        });
      });
  }

  render() {
    return (
      <div style={styles.container}>
        <Header />
        <div>
          <form
            onSubmit={_.bind(this.handleSubmit, this)}
            style={{ display: this.state.deploying ? 'none' : undefined }}
          >
            <label>Landlord Ethereum Address:</label>
            <input
              type='text'
              value={this.state.landlordAddress}
              onChange={e => this.setState({ landlordAddress: e.target.value })}
              style={styles.textInput}
            />
            <br />
            <label>Tenant Ethereum Address:</label>
            <input
              type='text'
              value={this.state.tenantAddress}
              onChange={e => this.setState({ tenantAddress: e.target.value })}
              style={styles.textInput}
            />
            <br />
            <label>Monthly rent (USD):</label>
            <input
              type='text'
              value={this.state.rentPriceUsd}
              onChange={e => this.setState({ rentPriceUsd: e.target.value })}
              style={styles.textInput}
            />
            <br />
            <label>Minimum lease term:</label>
            <input
              type='text'
              value={this.state.minCycleCount}
              onChange={e => this.setState({ minCycleCount: e.target.value })}
              style={styles.textInput}
            />
            <br />
            <input type='submit' />
          </form>
          <h3 style={{ display: this.state.deploying ? undefined : 'none' }}>
            Your contract is being deployed, you will be automatically redirected in a moment
          </h3>
        </div>
        <Footer />
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 'auto',
    width: '100%',
    textAlign: 'center'
  },
  textInput: {
    margin: 4,
    width: '30%'
  }
};
