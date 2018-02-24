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
    if (payload.type === Action.initialize) {

    } else if (payload.type === Action.ipfs.upload) {
      IPFSStore.node.files.add(payload.data, (err, hash) => {

      });
    }
  }
  
}

IPFSStore.node = new IPFS();
IPFSStore.node.on('ready', () => {
  IPFSStore.node.files.add(new Buffer('Chance Hudson'), (err, hash) =>
    console.log(err, hash));
});
export default new IPFSStore(Dispatcher);
