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
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CreateLeaseCell from 'components/CreateLeaseCell';

type Props = { };
type State = { };

export default class CreateLease extends Component<Props, State> {

  dispatchToken: string;

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div style={styles.container}>
        <Header />
        <CreateLeaseCell />
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
  },
  dateInput: {
    margin: 4,
    display: 'inline-block'
  }
};
