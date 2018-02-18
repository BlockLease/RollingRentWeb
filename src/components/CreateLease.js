'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import UserStore from 'stores/User';
import LeaseStore from 'stores/Lease';

type Props = { };
type State = { };

export default class Lease extends Component<Props, State> {

  dispatchToken: string;

  componentDidMount() {
    this.dispatchToken = Dispatcher.register(action => {
      if (action.type === Action.lease.loaded) this.forceUpdate();
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
          <button>
            Deploy Lease
          </button>
          {LeaseStore.landlordAddress}
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
