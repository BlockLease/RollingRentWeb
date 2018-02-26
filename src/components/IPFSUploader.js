'use strict';

// @flow

import React from 'react';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

type Props = {};
type State = {
  files: any[]
};

type File = {
  name: string,
  size: number,
  type: string
};

export default class IPFSUploader extends React.Component<Props, State> {

  state: State;
  dispatchToken: string;

  constructor(props: Props) {
    super(props);
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    this.dispatchToken = Dispatcher.register((payload) => {
      if (!this.state.uploadingFilename) return;
      if (payload.type === Action.ipfs.uploaded) {
        console.log('file uploaded', payload.data.hash);
        this.setState({
          files: []
        });
      }
    });
  }

  componentWillUnmount() {
    Dispatcher.unregister(this.dispatchToken);
  }

  onDrop(files: File[]) {
    this.setState({ files });
    _.forEach(files, file => {
      console.log(file);
      const reader = new FileReader();
      reader.onload = () => {
        Dispatcher.dispatch({
          type: Action.ipfs.upload,
          data: {
            buffer: new Buffer(reader.result),
            name: file.name
          }
        });
      };
      reader.onerror = err => {
        Dispatcher.dispatch({
          type: Action.log.error,
          data: err
        })
      };
      reader.readAsText(file);
    });
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={_.bind(this.onDrop, this)}>
          Drop some files here
        </Dropzone>
      </div>
    );
  }
}
