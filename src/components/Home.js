'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';

type Props = { };
type State = { };

export default class Home extends Component<Props, State> {
  render() {
    return (
      <div style={styles.container}>
        <Header />
        <div>
          <button onClick={() => {
            Dispatcher.dispatch({
              type: Action.router.redirect,
              data: {
                path: 'lease/0xaCBcf7a915CadcfFA9d60426947EEf80cC8D8cab'
              }
            })
          }}>Lease</button>
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
