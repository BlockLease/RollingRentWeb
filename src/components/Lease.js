'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';

type Props = {
  leaseAddress: string
};
type State = { };

export default class Lease extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      setTimeout(() => this.forceUpdate(), 1);
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
        <Header />
        <div>
          landlord: {LeaseStore.landlordAddress}
        </div>
        <div>
          tenant: {LeaseStore.tenantAddress}
        </div>
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
