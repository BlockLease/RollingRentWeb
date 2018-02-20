'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';
import LeaseABI from 'utils/LeaseABI';
import USDOracleABI from 'utils/USDOracleABI';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import moment from 'moment';
import USDOracleStore from 'stores/USDOracle';
import EtherscanURL from 'utils/EtherscanURL';

type Props = {
  oracleAddress: string
};
type State = {
  oracleContract: Web3.Contract
};

export default class USDOracleCell extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      if (UserStore.web3 && this.props.oracleAddress) {
        this.setState({
          oracleContract: new UserStore.web3.eth.Contract(USDOracleABI, this.props.oracleAddress)
        });
      } else {
        this.forceUpdate();
      }
    });

    if (this.props.oracleAddress) {
      Dispatcher.dispatch({
        type: Action.usdOracle.update,
        data: {
          oracleAddress: this.props.oracleAddress
        }
      });
    }
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  render() {
    const contractUrl = EtherscanURL(this.props.oracleAddress);
    const lastUpdated = USDOracleStore.lastUpdated || 0;
    return (
      <div style={styles.container}>
        <h2>
          Oracle Contract:&nbsp;
          <a href={contractUrl} target='_blank' style={styles.link}>
            {this.props.oracleAddress}
          </a>
        </h2>
        <h3>
          Last Updated: {moment.unix(+lastUpdated).format('MMM D, YYYY - hh:mm a')}
        </h3>
        <div>
          Needs Update: {USDOracleStore.priceNeedsUpdate ? 'Yes' : 'No'}
        </div>
        <div style={{padding: 4}}>
          <button
            onClick={() => {
              Dispatcher.dispatch({
                type: Action.usdOracle.beginUpdate,
                data: {}
              });
            }}
          >
            Update Oracle
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
