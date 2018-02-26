'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import { nextTick } from 'utils/SafeTime';
import Promisify from 'utils/Promisify';

class LogStore extends Store {

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.log.message) {
      console.log(payload.data);
    } else if (payload.type === Action.log.warning) {
      console.log(`Warning: ${payload.data}`);
    } else if (payload.type === Action.log.error) {
      console.log(`Error: ${payload.data}`)
    }
  }
}

export default new LogStore(Dispatcher);
