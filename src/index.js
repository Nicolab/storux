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
    let notActions = store.scope.opt.notActions;
    let regNotActions = new RegExp(notActions.join('|'));

    for (let prop of props) {
      if (typeof store[prop] === 'function'
      && !store[prop].id
      && !regNotActions.test(prop)) {
        store.scope.mountAction(prop);
      }
    }
  };

  static Store = Store;

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

    // action handlers (map)
    this._ahm = new WeakMap();

    // action handlers listeners (map)
    this._ahlm = new WeakMap();
  }

  beforeAction(action, listener, thisScope) {
    this.on('beforeAction.' + action.id, listener, thisScope);

    return this;
  }

  afterAction(action, listener, thisScope) {
    this.on('afterAction.' + action.id, listener, thisScope);

    return this;
  }

  beforeActions(listener, thisScope) {
    this.on('beforeActions', listener, thisScope);

    return this;
  }

  afterActions(listener, thisScope) {
    this.on('afterActions', listener, thisScope);

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

    if (!opt.mountActionsResolver) {
      opt.mountActionsResolver = Storux.mountActionsResolver;
    }

    if (!opt.notActions) {
      opt.notActions = Storux.notActions.slice();
    }

    opt.storux = this;
    store = new StoruxStore(opt);

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

    this.emit('createStore', this.stores[storeName]);
    this.emit('createStore.' + storeName, this.stores[storeName]);

    // remove the properties (of scope) used only to create the store
    Storux.removeScopePropsAfterCreation.forEach((prop) => {
      store.scope[prop] = undefined;
    });

    // this store is initialized
    store.scope.emit('init');

    return this.stores[storeName];
  }
}

Storux.notActions = [
  // prefixes: handlers
  '^on',
  '^handle',
  // prefix: private and magic methods
  '^_',
  // methods
  '^constructor$',
  '^getState$',
  '^getPrevState$',
  '^replaceState$',
  '^setState$'
];

Storux.removeScopePropsAfterCreation = [
  'generateActions',
  'mountAction',
  'mountActions'
];

module.exports = {Storux, Store, Scope, Evemit};
