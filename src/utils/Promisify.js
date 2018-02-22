'use strict';

// @flow

export default async function Promisify(binding: any, fn: string, ...args: any[]): Promise<any> {
  return new Promise((rs, rj) => {
    if (typeof binding[fn] !== 'function') return rj(new Error('Invalid function name supplied'));
    args.push((err, res) => {
      if (err) rj(err);
      else rs(res);
    });
    binding[fn](...args);
  });
}
