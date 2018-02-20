'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';
import LeaseCell from 'components/LeaseCell';
import Footer from 'components/Footer';
import { setSafeTimeout } from 'utils/SafeTime';
import USDOracleCell from 'components/USDOracleCell';
import USDOracleStore from 'stores/USDOracle';

type Props = {
  leaseAddress: string
};
type State = { };

export default class Lease extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div style={styles.container}>
        <Header />
        <div>
          <LeaseCell leaseAddress={this.props.leaseAddress} />
        </div>
        <div>
          <USDOracleCell oracleAddress={USDOracleStore.oracleAddress} />
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
  }
};
