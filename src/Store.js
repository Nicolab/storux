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

// scope shortcut, define protected property in the store
const dpsp = function(s, o, p) {
  Object.defineProperty(o, p, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: s[p].bind(s)
  });
}

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

    dpsp(scope, this, 'getState');
    dpsp(scope, this, 'getPrevState');
    dpsp(scope, this, 'replaceState');
    dpsp(scope, this, 'setState');
  }
}

module.exports = Store;
