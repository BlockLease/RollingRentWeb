'use strict';

// @flow

import React from 'react';
import FileReaderInput from 'react-file-reader-input';

type Props = {};
type State = {};

export default class IPFSUploader extends React.Component<Props, State> {

  state: State;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <form>
        <label>Upload a File:</label>
        <FileReaderInput
          as="buffer"
          onChange={(e, results) => {
            console.log(e, results);
          }}
        >
          <button>Select a file!</button>
        </FileReaderInput>
      </form>
    );
  }
}
