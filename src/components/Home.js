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
                path: 'lease/0xad30db44bb3fbc5157425c7f137ce6b1730e6e11'
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
