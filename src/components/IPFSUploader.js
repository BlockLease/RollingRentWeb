'use strict';

// @flow

import React from 'react';
import FileReaderInput from 'react-file-reader-input';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';

type Props = {};
type State = {};

type File = {
  name: string,
  size: number,
  type: string
};

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
          onChange={(even, files) => {
            const data = files[0][0].target.result;
            const file: File = files[0][1];
            Dispatcher.dispatch({
              type: Action.ipfs.upload,
              data: {
                name: file.name,
                buffer: new Buffer(data)
              }
            })
          }}
        >
          <button>Select a file!</button>
        </FileReaderInput>
      </form>
    );
  }
}
