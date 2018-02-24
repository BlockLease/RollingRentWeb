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
import InactiveLeaseCell from 'components/InactiveLeaseCell';
import SharedStyles from 'src/SharedStyles';
import IPFSUploader from 'components/IPFSUploader';

type Props = {
  leaseAddress: string
};
type State = { };

export default class Lease extends Component<Props, State> {

  dispatchToken: string;

  render() {
    return (
      <div style={SharedStyles.container}>
        <Header />
        <div>
          <LeaseCell leaseAddress={this.props.leaseAddress} />
          <IPFSUploader />
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
};
