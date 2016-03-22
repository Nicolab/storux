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

let Evemit = require('evemit');
let Store = require('./Store');
let Scope = require('./Scope');

let {
  isStore,
  getStoreProtoProps
} = require('./utils');

if (!WeakMap) {
  throw new Error(
    'WeakMap is not supported by this browser. '
    + 'Please use a polyfill (see the Storux doc).'
  );
}

class Storux {
  /**
   * Check if `value` is an instance of `Store`.
   *
   * @param  {*}  value Value to check.
   * @return {bool}
   */
  static isStore(value) {
    return isStore(value);
  };

  /**
   * A function that finds the implemented actions in the `store` class
   * and mounts the final actions methods (by decoration).
   *
   * @param  {Store} store An instance inheriting `Store` class.
   */
  static mountActionsResolver(store) {
    let props = getStoreProtoProps(store).concat(Object.keys(store));
    let notActions = Storux.notActions;

    for (let prop of props) {
      if (typeof store[prop] === 'function'
      // If such a "notAction" is found,
      // the every method immediately returns false
      && notActions.every((notAction) => prop.indexOf(notAction) !== 0)) {
        store.scope.mountAction(prop);
      }
    }
  };

  static notActions = [
    // prefixes: handlers
    'on',
    'handle',
    // prefix: private and magic methods
    '_',
    // methods
    'constructor',
    'getState',
    'getPrevState',
    'setState'
  ];

  static removeScopePropsAfterCreation = [
    'generateActions',
    'mountAction',
    'mountActions'
  ];

  /**
   * @constructor
   */
  constructor() {
    this.stores = {};
    this.lifecycle = new Evemit();
    this._actionHandlersMap = new WeakMap();
    this._actionHandlerListenersMap = new WeakMap();
  }

  beforeAction(action, listener, thisScope) {
    this.lifecycle.on('beforeAction.' + action.displayName, listener, thisScope);

    return this;
  }

  afterAction(action, listener, thisScope) {
    this.lifecycle.on('afterAction.' + action.displayName, listener, thisScope);

    return this;
  }

  /**
   * Create a new `Store` instance.
   *
   * @param {Store}    StoruxStore A class (will be instancied) inherited from `Store`.
   * @param {object}   opt Options.
   * @param {object}   [opt.storeOpt] Specific store options (user land).
   * @param {function} [opt.mountActionsResolver=Storux.mountActionsResolver]
   * See `Storux.mountActionsResolver`.
   * @param {object}   [opt.initialState] I nitial state.
   * @return {Store} The new `Store` instance.
   */
  createStore(StoruxStore, opt = {}) {
    let storeName, store;

    opt.mountActionsResolver = Storux.mountActionsResolver;
    store = new StoruxStore(this, opt);

    if (!isStore(store)) {
      throw new TypeError(
        'Storux.createStore() - `store` argument must be an instance of `Store`'
      );
    }

    storeName = store.scope.displayName;

    if (this.stores[storeName]) {
      throw new Error(
        'The store `' + storeName + '` is already defined'
        + ' in the `Storux` instance.'
      );
    }

    Object.defineProperty(this.stores, storeName, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: store
    });

    this.lifecycle.emit('createStore', this.stores[storeName]);
    this.lifecycle.emit('createStore.' + storeName, this.stores[storeName]);

    // remove the properties (of scope) used only to create the store
    Storux.removeScopePropsAfterCreation.forEach((prop) => {
      store.scope[prop] = undefined;
    });

    // this store is initialized
    store.scope.lifecycle.emit('init');

    return this.stores[storeName];
  }
}

module.exports = {Storux, Store, Scope, Evemit};
