'use strict';

// @flow

import React from 'react';

type Props = { };

type State = { };

export default class InstallMM extends React.Component <Props, State> {

  state: State;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'blue',
    width: '100%',
    height: '100%'
  }
};
