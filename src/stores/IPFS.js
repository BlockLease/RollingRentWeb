'use strict';

// @flow

import IPFS from 'ipfs';
import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import { nextTick } from 'utils/SafeTime';
import Promisify from 'utils/Promisify';

class IPFSStore extends Store {

  static node;
  ipfsStore: { key: string };

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.ipfs.upload) {
      console.log('beginning upload');
      IPFSStore.node.files.add(payload.data.buffer, (err, hash) => {
        console.log(err, hash);
        if (err) return nextTick(() => Dispatcher.dispatch({
          type: Action.log.error,
          data: err
        }));
        nextTick(() => Dispatcher.dispatch({
          type: Action.ipfs.uploaded,
          data: {
            name: payload.data.name,
            hash
          }
        }));
      });
    }
  }

}

IPFSStore.node = new IPFS();
IPFSStore.node.on('ready', () => {
  Dispatcher.dispatch({
    type: Action.log.message,
    data: 'IPFS node initialized'
  });
});
export default new IPFSStore(Dispatcher);
