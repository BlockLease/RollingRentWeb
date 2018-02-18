'use strict';

// @flow

import React, { Component } from 'react';

type Props = { };
type State = { };

export default class RippleLoader extends Component<Props, State> {
  render() {
    return (
      <div style={styles.container}>
        <div className="loader">
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
    width: '100%',
    textAlign: 'center'
  },
  ringStyle: {
    border: '2px solid #000'
  }
};
