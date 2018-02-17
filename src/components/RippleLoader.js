'use strict';

// @flow

import React, { Component } from 'react';

type Props = { };
type State = { };

export default class RippleLoader extends Component<Props, State> {
  render() {
    return (
      <div
        className="loader"
        style={styles.container}
      >
        <div className="loader-inner ball-scale-ripple-multiple">
          <div style={styles.ringStyle}></div>
          <div style={styles.ringStyle}></div>
          <div style={styles.ringStyle}></div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    paddingLeft: '50%',
    paddingTop: '50%',
    width: 80,
    height: 80
  },
  ringStyle: {
    border: '2px solid #000'
  }
};
