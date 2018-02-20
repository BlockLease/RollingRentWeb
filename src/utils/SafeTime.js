'use strict';

// @flow

function setSafeInterval(callback: (any) => any, ms: number, ...args: any[]): number {
  return setInterval(() => Promise.resolve().then(callback), ms, ...args);
}

function setSafeTimeout(callback: (any) => any, ms: number, ...args: any[]): number {
  return setTimeout(() => Promise.resolve().then(callback), ms, ...args);
}

function nextTick(callback: (any) => any, ...args: any[]): Promise<any> {
  return Promise.resolve().then(() => callback.apply(undefined, args));
}

export { setSafeInterval, setSafeTimeout, nextTick }
