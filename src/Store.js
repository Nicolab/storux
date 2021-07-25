/**
 * This file is part of storux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/storux
 */

import Scope from './Scope';

// scope shortcut, define protected property in the store
const dpsp = function (s, o, p, c) {
  Object.defineProperty(o, c || p, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: s[p].bind(s),
  });
};

/**
 * Base class for each store.
 */
class Store {
  constructor(opt = {}) {
    let scope = new Store.Scope({
      store: this,
      opt,
    });

    Object.defineProperty(this, 'scope', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: scope,
    });

    dpsp(scope, this, 'getState');
    dpsp(scope, this, 'setState');
    dpsp(scope, this, 'replaceState');
    this._mount();
  }

  _dispatch(payload, obj) {
    return this.scope.dispatch(payload, obj);
  }

  _save(obj, payload) {
    return this.scope.save(obj, payload);
  }

  /**
   * Called in the constructor to mount the decorators.
   * After construction, this method is undefined.
   */
  _mount() {
    // hooks
    let h = [];

    for (let k in this._mount) {
      let m = this._mount[k];

      if (m.type === 'action') {
        this.scope.mountAction(m.name, m.fn);
        continue;
      }

      if (m.type === 'hook') {
        h.push(m);
      }
    }

    // mount the hooks after all actions are mounted
    for (let i = 0, ln = h.length; i < ln; i++) {
      this[h[i].actionName].hooks.push(this[h[i].key]);
    }

    // disable this method
    // NOTE: delete instance property has not effect,
    // because it use the parent
    this._mount = undefined;
  }
}

Store.Scope = Scope;

export default Store;