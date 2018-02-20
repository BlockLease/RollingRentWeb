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
import USDOracleCell from 'components/USDOracleCell';

type Props = {
  oracleAddress: string
};
type State = { };

export default class USDOracle extends Component<Props, State> {

  render() {
    return (
      <div style={styles.container}>
        <Header />
        <div>
          <USDOracleCell oracleAddress={this.props.oracleAddress} />
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
