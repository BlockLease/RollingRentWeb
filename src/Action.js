'use strict';

// @flow

export default class Action<T> {
  type: string;
  data: T;

  static initialize;
  static router;
  static user;
  static lease;
  static usdOracle;
  static ipfs;
  static log;
}

Action.router = {
  redirect: 'router.redirect'
};

Action.user = {
  update: 'user.update',
  loaded: 'user.loaded'
};

Action.lease = {
  loaded: 'lease.loaded',
  update: 'lease.update',
  create: 'lease.create',
  payRent: 'lease.payRent',
  created: 'lease.created',
  error: 'lease.error',
  sign: 'lease.sign'
};

Action.usdOracle = {
  loaded: 'usdOracle.loaded',
  update: 'usdOracle.update',
  beginUpdate: 'usdOracle.beginUpdate'
};

Action.ipfs = {
  loaded: 'ipfs.loaded',
  download: 'ipfs.download',
  upload: 'ipfs.upload',
  uploaded: 'ipfs.uploaded'
};

Action.log = {
  message: 'log.message',
  warning: 'log.warning',
  error: 'log.error'
};
