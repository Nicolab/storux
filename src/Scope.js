/**
 * This file is part of storux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/storux
 */

import Evemit from 'evemit';
import {
  clone,
  isEquival,
  getFuncName,
  defineDisplayName,
  generateStoreName,
} from './utils';

function defaultDispatcher() {
  throw new ReferenceError('No action in progress');
}
/**
 * Handle the scope of a `Store` instance.
 */
class Scope {
  /**
   * @constructor
   * @param  {object}  cfg                    Scope config.
   * @param  {Store}   cfg.store              The `Store` instance handled
   *                                          by the `Scope` instance.
   * @param  {object}  cfg.opt                Store options
   * @param  {Storux}  cfg.opt.storux         A `Storux` instance.
   * @param  {object}  [cfg.opt.initialState] Initial state.
   * @param  {object}  [cfg.opt.displayName]  Custom store name
   *                                          (returned by the `displayName` method).
   */
  constructor({ store, opt }) {
    this.storux = opt.storux;
    opt.storux = null;
    this.opt = opt;
    this.store = store;
    this.initialState = this.opt.initialState ? clone({}, this.opt.initialState) : {};

    this.clone = clone;
    this.dispatch = defaultDispatcher;

    // lifecycle
    this._lc = new Evemit();
    this.on = this._lc.on.bind(this._lc);
    this.once = this._lc.once.bind(this._lc);
    this.off = this._lc.off.bind(this._lc);
    this.emit = this._lc.emit.bind(this._lc);
    this.listeners = this._lc.listeners.bind(this._lc);

    // store name
    defineDisplayName(
      this,
      this.opt.displayName ? this.opt.displayName : generateStoreName(this.store)
    );

    // Internal object.
    // Be careful, the reliability of the store can be degraded if misused.
    // Risk of headache with the object reference,
    // breaking the state flow in the application.
    // But the perfs are better than a private Map.
    this._p = {
      // Queue (actions stack)
      aq: [],
      // current action
      ca: null,
      // change listeners
      cl: [],
    };

    // force the pattern: constructor -> init -> state usable
    // avoid to update the state in the constructor before the initialization
    this.on('init', () => {
      this.dispatch = defaultDispatcher;
      this._p.ca = null;
      this._p.state = clone({}, this.initialState);
    });
  }
  /**
   * Attach a global state change `listener`.
   *
   * @param  {function} listener A callback called after each change.
   * The callback receives the current `Store` instance.
   * @return {function} A function to detach the listener.
   * @see Scope.unlisten()
   */
  listen(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError(this.displayName + ': listener must be a function.');
    }
    this._p.cl.push(listener);
    this.emit('listen', listener);
    // push proxy
    return () => this.unlisten(listener);
  }
  /**
   * Detach a global state change `listener`.
   *
   * @param  {function} listener  A callback attached with `store.scope.listen()`.
   * @return {bool}     `true` if the `listener` was found and detached,
   * `false` otherwise.
   * @see Scope.listen()
   */
  unlisten(listener) {
    let listeners = this._p.cl;
    let i = listeners.indexOf(listener);
    if (i === -1) {
      return false;
    }
    listeners.splice(i, 1);
    this.emit('unlisten', listener);
    return true;
  }
  /**
   * Get a clone of the state.
   *
   * @return {object} A clone of the state.
   */
  getState() {
    return clone({}, this._p.state);
  }
  /**
   * Like `setState()` but replace all state by `nextState`.
   *
   * @param  {object} [nextState={}] Next state.
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  replaceState(nextState = {}) {
    let ln, listeners;
    if (isEquival(this._p.state, nextState)) {
      return false;
    }
    this._p.state = clone({}, nextState);
    ln = this._p.cl.length;
    if (ln) {
      listeners = this._p.cl;
      for (let i = 0; i < ln; i++) {
        if (typeof listeners[i] === 'function') {
          listeners[i](this.store);
        } else {
          // prevent memory leak
          listeners.splice(i, 1);
        }
      }
    }
    return true;
  }
  /**
   * Performs a shallow merge of `obj` into current state of the store.
   *
   * @param  {object} obj Object to merge with the existing state.
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  setState(obj) {
    return this.replaceState({
      ...this._p.state,
      ...obj
    });
  }
  /**
   * Reset the state to the initial state.
   *
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  resetState() {
    let hasChanged = this.replaceState(this.initialState);
    if (hasChanged) {
      this.emit('resetState');
    }
    return hasChanged;
  }
  /**
   * Recycle the store:
   *  * Reset the state to the initial state.
   *  * Emit `init` event, with one argument `hasChanged`.
   *
   * ```js
   * myStore.scope.on('init', function(hasChanged) {
   *   // if first "init"
   *   if (typeof hasChanged === 'undefined') {
   *     console.log('first init');
   *     return;
   *   }
   *
   *   // recycled
   *   console.log('recycled, state changed? ', hasChanged);
   * });
   *
   * myStore.scope.recycle();
   * ```
   *
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  recycle() {
    let hasChanged = this.replaceState(this.initialState);
    this.emit('init', hasChanged);
    return hasChanged;
  }
  // eslint-disable-next-line spaced-comment
  /*-----------------------------------------------------------------------*\
    Actions
  \*-----------------------------------------------------------------------*/
  /**
   * Dispatch the payload.
   * Use this method when the state does not need to be updated.
   *
   * @param {*} [payload] Payload to dispatch.
   * @param {object} [obj] Object to merge with the existing state.
   * @return {Promise.<bool>}  A promise that will be resolved with a `boolean`.
   * `true` if the state was changed, `false` if the state is unchanged.
   */
  // dispatch = defaultDispatcher
  /**
   * Save the object with the existing state and dispatch the payload.
   *
   * @param {object} obj Object to merge with the existing state.
   * Use only when the action has no action hook(s) defined.
   * @param {*} payload Payload to dispatch.
   * @return {Promise.<bool>}  A promise that will be resolved with a `boolean`.
   * `true` if the state was changed, `false` if the state is unchanged.
   */
  save(obj, payload) {
    if (!this.dispatch._action || !this._p.ca) {
      throw new ReferenceError('No action in progress.');
    }
    if (this.dispatch._action.hooks.length) {
      throw new TypeError('This action have one or more hooks. Use dispatch() instead save().');
    }
    if (typeof obj !== 'object') {
      throw new TypeError('save() require an object in ' + this.dispatch._action.id);
    }
    return this.dispatch(payload, obj);
  }
  /**
   * Dispatch an `action`.
   * If one or more hooks exists, they are called one by one (reducing).
   *
   * @param  {function} action  Action.
   * @param  {object}  [payload]  payload dispatched from the action.
   * @param {object} [obj] Object to merge with the existing state,
   * used only when the action has no hooks defined.
   * @return {bool}  `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  _dispatcher({
    resolve,
    action,
    payload,
    obj,
    fnResult
  }) {
    let hasChanged;
    const scope = this;
    if (scope.dispatch._inProgress) {
      throw new Error('Dispatching in progress: ' + action.id +
        ' The dispatcher must be called only once by action.');
    }
    scope.dispatch._inProgress = true;
    // if no action hooks
    if (!action.hooks.length) {
      hasChanged = obj ? this.setState(obj) : false;
    } else {
      // call one by one (reducing).
      hasChanged = this._reduceActionHooks(action, payload);
    }
    // reset the dispatcher
    scope.dispatch = defaultDispatcher;
    resolve(fnResult);
    scope.storux.emit('after.' + action.id, payload, fnResult, hasChanged);
    scope.storux.emit('after', {
      actionId: action.id,
      actionName: action.displayName,
      result: fnResult,
      payload,
      hasChanged,
    });
    // reset current action
    scope._p.ca = null;
    scope._next();
    return hasChanged;
  }
  _next() {
    if (this._p.aq.length && !this.dispatch._action && !this._p.ca) {
      this._p.aq.shift()();
      return true;
    }
    return false;
  }
  _createActionProxy(fn) {
    const action = (...actionArgs) => {
      return new Promise((resolve) => {
        const scope = this;
        this._p.aq.push(
          /**
           * Call the original action.
           * `this` of implemented action method bind to the `Store` instance.
           *
           * @return {*} The original return value.
           */
          function proceed() {
            if (scope.dispatch._action || scope._p.ca) {
              throw new Error(action.id + ' can be called, because the action ' +
                scope.dispatch._action.id + ' is not finished');
            }
            /**
             * Dispatch the payload. Added when the action is called.
             *
             * @param {*} payload
             * @param {object} [obj] Object to merge with the existing state,
             * used only when the action has no action handler(s) defined.
             * @return {Promise.<bool>}  A promise that will be resolved with a `boolean`.
             * `true` if the state was changed, `false` if the state is unchanged.
             */
            scope.dispatch = function dispatch(payload, obj) {
              // eslint-disable-next-line promise/param-names
              return new Promise(function (ok) {
                // dispatch on the next event loop
                setImmediate(function () {
                  ok(scope._dispatcher({
                    resolve,
                    action,
                    payload,
                    obj,
                    fnResult
                  }));
                });
              });
            };
            // add the current action ref when the action is called
            scope.dispatch._action = action;
            scope._p.ca = action.id;
            // lifecycle
            // shallow copy
            actionArgs = actionArgs.slice();
            scope.storux.emit('before.' + action.id, actionArgs);
            scope.storux.emit('before', {
              actionId: action.id,
              actionName: action.displayName,
              actionArgs,
            });
            const fnResult = fn.apply(scope.store, actionArgs);
          });
        // if only one in the stack, start the call stack.
        // if not, the dispatcher will manage the progress of the stack.
        if (this._p.aq.length === 1) {
          this._next();
        }
      });
    };
    return action;
  }
  _getHandlerArgs({
    action,
    payload,
    nextState
  }) {
    return [
      nextState,
      payload,
      {
        actionId: action.id,
        actionName: action.displayName,
      },
    ];
  }
  _reduceActionHooks(action, payload) {
    let nextState = this.getState();
    for (let i = 0, ln = action.hooks.length; i < ln; i++) {
      let hook = action.hooks[i];
      if (typeof hook !== 'function') {
        throw new TypeError('The hook must be a function. Hook type: ' + typeof hook);
      }
      let _nextState = hook.apply(this.store, this._getHandlerArgs({
        action,
        payload,
        nextState
      }));
      // if it break the chain, it's a design error
      if (!_nextState || typeof _nextState !== 'object') {
        throw new TypeError('The hook "' + getFuncName(hook) +
          '" should return the next state for the action ' + action.id);
      }
      nextState = _nextState;
    }
    return this.replaceState(nextState);
  }
  /**
   * Mount an action.
   *
   * @param  {string} actionName Action name (method name).
   * @return {Scope} Current instance.
   */
  mountAction(actionName, fn) {
    // if already mounted
    if (this.store[actionName] && this.store[actionName].id) {
      return this;
    }
    const action = this._createActionProxy(fn);
    // this.store[actionName].displayName
    defineDisplayName(action, actionName);
    let fnName = getFuncName(fn);
    if (fnName && typeof this.store[fnName] === 'function') {
      this.store[fnName] = undefined;
    }
    action.id = this.displayName + '.' + action.displayName;
    action.defer = (...args) => setImmediate(action.apply(this.store, args));
    action.hooks = [];
    // mounted!
    this.store[actionName] = action;
    return this;
  }
  /**
   * Mount the actions of the store.
   *
   * ```js
   * this.scope.mountActions({
   *  create: this.create,
   *  update: this.update,
   * });
   * ```
   *
   * @param  {object} actions One or more actions names.
   * @return {Store}  Current instance.
   */
  mountActions(actions) {
    if (typeof actions !== 'object') {
      throw new ReferenceError('mountActions() requiere one or more actions to mount');
    }
    for (let name in actions) {
      this.mountAction(name, actions[name]);
    }
    return this;
  }
  /**
   * Generate one or more actions if they have not been defined.
   * The difference with this `ensureSaveActions()`,
   * the payload is not saved in the state.
   * The generated actions use `Scope.dispatch()`.
   *
   * @param  {string} ...actionName One or more actions names.
   * @return {Store}  Current instance.
   */
  ensureActions( /* actionName, ...*/ ) {
    return this._generateActions('dispatch', arguments);
  }
  /**
   * Generate one or more actions if they have not been defined.
   * The difference with `ensureActions()`,
   * the payload is saved in the state.
   * The generated actions use `Scope.save()`.
   *
   * @param  {string} ...actionName One or more actions names.
   * @return {Store}  Current instance.
   */
  ensureSaveActions( /* actionName, ...*/ ) {
    return this._generateActions('save', arguments);
  }
  _generateActions(method, actions) {
    let store = this.store;
    for (let i = 0, ln = actions.length; i < ln; i++) {
      let actionName = actions[i];
      if (store[actionName]) {
        continue;
      }
      // create the action method (passthrough)
      store[actionName] = function (payload) {
        if (method === 'save') {
          store.scope.save(payload, payload);
        } else {
          store.scope.dispatch(payload);
        }
        return payload;
      };
      this.mountAction(actionName, store[actionName]);
    }
    return this;
  }
}
export default Scope;
//# sourceMappingURL=Scope.js.map