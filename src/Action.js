'use strict';

// @flow

export default class Action<T> {
  type: string;
  data: T;

  static router;
  static user;
  static lease;
  static usdOracle;
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
  create: 'lease.create'
};

Action.usdOracle = {
  loaded: 'usdOracle.loaded',
  update: 'usdOracle.update'
};
