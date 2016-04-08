/**
 * This file is part of storux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/storux
 */
'use strict';

const Scope = require('./Scope');

/**
 * Base class for each store.
 *
 * Naming convention:
 *  * private: `_`
 *  * magic: `__`
 *  * handler of a local action: `onActionName`
 *  * handler of a external action: `handleActionName`
 */
class Store {
  constructor(opt = {}) {
    let scope = new Scope({
      store: this,
      opt
    });

    Object.defineProperty(this, 'scope', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: scope
    });

    Object.defineProperty(this, 'getState', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: scope.getState.bind(scope)
    });

    Object.defineProperty(this, 'replaceState', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: scope.replaceState.bind(scope)
    });

    Object.defineProperty(this, 'setState', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: scope.setState.bind(scope)
    });

    Object.defineProperty(this, 'getPrevState', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: scope.getPrevState.bind(scope)
    });
  }
}

module.exports = Store;
