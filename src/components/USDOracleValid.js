'use strict';

// @flow

import React, { Component } from 'react';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import USDOracleStore from 'stores/USDOracle';
import _ from 'lodash';
import moment from 'moment';

type Props = { };
type State = { };

export default class USDOracleValid extends Component<Props, State> {

  dispatchToken: string;

  isPriceValid(): boolean {
    return !USDOracleStore.priceNeedsUpdate;
  }

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  render() {
    return (
      <div style={styles.container}>
        <div
          style={this.isPriceValid() ? {
            display: 'none'
          } : {}}
          onClick={() => {
            Dispatcher.dispatch({
              type: Action.usdOracle.beginUpdate
            });
          }}
        >
          <span style={styles.invalid}>Price expired, click to update</span>
        </div>
        <div
          style={this.isPriceValid() ? {} : {
            display: 'none'
          }}
        >
          <span style={styles.valid}>
            Price expires in {USDOracleStore.expirationMoment().fromNow(true)}
          </span>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    maxWidth: 300,
    margin: 'auto'
  },
  ringStyle: {
    border: '2px solid #000'
  },
  valid: {
    backgroundColor: 'green',
    borderRadius: 20,
    border: '2px solid #000',
    color: 'white',
    padding: 4
  },
  invalid: {
    backgroundColor: 'red',
    border: '2px solid #000',
    borderRadius: 20,
    color: 'white',
    cursor: 'pointer',
    padding: 4
  }
};
