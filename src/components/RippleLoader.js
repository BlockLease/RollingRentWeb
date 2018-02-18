'use strict';

// @flow

import React, { Component } from 'react';

type Props = { };
type State = { };

export default class RippleLoader extends Component<Props, State> {
  render() {
    return (
      <div style={styles.container}>
        <div
          className="loader"
          style={styles.centered}>
          <div className="loader-inner ball-scale-ripple-multiple">
            <div style={styles.ringStyle}></div>
            <div style={styles.ringStyle}></div>
            <div style={styles.ringStyle}></div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  ringStyle: {
    border: '2px solid #000'
  },
  centered: {
    position: 'fixed',
    left: '50%',
    top: '50%'
  }
};
