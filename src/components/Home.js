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
                path: 'lease/0xa74E58A59A77F59570f00A446744df61a7ACF732'
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
