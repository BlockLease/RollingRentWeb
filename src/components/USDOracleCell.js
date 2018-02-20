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
import { setSafeInterval, nextTick } from 'utils/SafeTime';
import CellButton from 'components/CellButton';

type Props = {
  oracleAddress: string
};
type State = {
};

export default class USDOracleCell extends Component<Props, State> {

  dispatchToken: string;
  intervalToken: number;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      nextTick(() => this.forceUpdate());
    });

    const updateIfLoaded = () => {
      if (this.props.oracleAddress) {
        Dispatcher.dispatch({
          type: Action.usdOracle.update,
          data: {
            oracleAddress: this.props.oracleAddress
          }
        });
      }
    };

    this.intervalToken = setSafeInterval(updateIfLoaded, 10000);
    updateIfLoaded();
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
    clearInterval(this.intervalToken);
  }

  isPriceValid(): boolean {
    console.log(USDOracleStore.priceNeedsUpdate);
    return !USDOracleStore.priceNeedsUpdate;
  }

  render() {
    const contractUrl = EtherscanURL(this.props.oracleAddress);
    const cellButtonStyle = {
      backgroundColor: this.isPriceValid() ? 'green' : 'red'
    };
    const cellButtonText = this.isPriceValid()
      ? 'Price expired, click to update'
      : `Price expires in ${USDOracleStore.expirationMoment().fromNow(true)}`;
    return (
      <div style={styles.container}>
        <h2>
          Oracle Contract:&nbsp;
          <a href={contractUrl} target='_blank' style={styles.link}>
            {this.props.oracleAddress}
          </a>
        </h2>
        <h3>
          Last Updated: {USDOracleStore.lastUpdatedMoment().format('MMM D, YYYY - hh:mm a')}
        </h3>
        <div style={styles.buttonContainer}>
          <CellButton
            style={cellButtonStyle}
            onClick={() => {
              Dispatcher.dispatch({
                type: Action.usdOracle.beginUpdate
              });
            }}
            title={cellButtonText}
          />
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
  buttonContainer: {
    margin: 'auto'
  },
  link: {
    color: 'black'
  }
};
