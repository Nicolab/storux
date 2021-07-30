/**
 * This file is part of storux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/storux
 */

const Evemit = require('evemit');

import Store from './Store'
import Scope from './Scope'

import {
  isStore,
  toId,
} from './utils';

class Storux {
  /**
   * @constructor
   */
  constructor() {
    this.stores = {};
    this.Store = Storux.Store;

    // lifecycle
    this._lc = new Evemit();
    this.on = this._lc.on.bind(this._lc);
    this.once = this._lc.once.bind(this._lc);
    this.off = this._lc.off.bind(this._lc);
    this.emit = this._lc.emit.bind(this._lc);
    this.listeners = this._lc.listeners.bind(this._lc);
  }

  /**
   * Create a new `Store` instance.
   *
   * @param {Store}    StoruxStore A class (will be instancied) inherited from `Store`.
   * @param {object}   opt Specific store options (user land).
   * @param {object}   [opt.initialState] Initial state.
   * @param  {object}  [opt.displayName]  Custom store name (returned by the `displayName` method).
   * @return {Store} The new `Store` instance.
   */
  create(StoruxStore, opt = {}) {
    let storeName, store;

    opt.storux = this;
    store = new StoruxStore(opt);

    if (!isStore(store)) {
      throw new TypeError(
        'Storux.create() - `store` argument must be an instance of `Store`'
      );
    }

    storeName = store.scope.displayName;

    if (this.stores[storeName]) {
      throw new Error(
        'The store `' + storeName + '` is already defined' +
        ' in the `Storux` instance.'
      );
    }

    Object.defineProperty(this.stores, storeName, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: store,
    });

    this.emit('create', this.stores[storeName]);
    this.emit('create.' + storeName, this.stores[storeName]);

    // Remove the properties (of scope) used only to create the store
    // NOTE: `delete` is not appropriate because the value of the prototype
    // will be used instead. We do not want to delete at the prototype level
    // otherwise it would be reflected in all stores.
    Storux.removeScopePropsAfterCreation.forEach(function (prop) {
      store.scope[prop] = undefined;
    });

    // Now, this store is initialized
    store.scope.emit('init');

    return this.stores[storeName];
  }

  before(action, listener, thisScope) {
    this.on('before.' + toId(action), listener, thisScope);
    return this;
  }

  offBefore(action, listener) {
    this.off('before.' + toId(action), listener);
    return this;
  }

  after(action, listener, thisScope) {
    this.on('after.' + toId(action), listener, thisScope);
    return this;
  }

  offAfter(action, listener) {
    this.off('after.' + toId(action), listener);
    return this;
  }

  beforeEach(listener, thisScope) {
    this.on('before', listener, thisScope);
    return this;
  }

  offBeforeEach(listener) {
    this.off('before', listener);
    return this;
  }

  afterEach(listener, thisScope) {
    this.on('after', listener, thisScope);
    return this;
  }

  offAfterEach(listener) {
    this.off('after', listener);
    return this;
  }
}

Storux.Store = Store;

/**
 * Check if `value` is an instance of `Store`.
 *
 * @param  {*}  value Value to check.
 * @return {bool}
 */
Storux.isStore = isStore;

Storux.removeScopePropsAfterCreation = [
  '_createActionProxy',
  '_generateActions',
  'ensureActions',
  'ensureSaveActions',
  'mountAction',
  'mountActions',
];

/**
 * Create an action.
 *
 * @decorator
 * @param {string} name Action name to create.
 * @return {function}
 */
function action(name) {
  return function (target, key /* , desc */ ) {
    target._mount[key] = {
      type: 'action',
      name,
      fn: target[key]
    };
  }
}

/**
 * Create a hook for `actionName`
 *
 * @decorator
 * @param {string} actionName Action name to hook.
 * @return {function}
 */
function hook(actionName) {
  return function (target, key /* , desc */ ) {
    target._mount[key] = {
      type: 'hook',
      key,
      actionName
    };
  };
}

export {Storux, Store, Scope, action, hook};
