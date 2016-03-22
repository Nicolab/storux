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

let {
  clone,
  isEquival,
  isStore,
  getStoreProtoProps,
  getFuncName,
  defineDisplayName,
  generateStoreName,
  handlerNameToActionName
} = require('./utils');

const _privateMap = new WeakMap();

/**
 * Handle the scope of a `Store` instance.
 */
class Scope {

  /**
   * @constructor
   * @param  {object}  cfg             Scope config.
   * @param  {Store}   cfg.store       The `Store` instance handled
   * by the `Scope` instance.
   * @param  {object}  cfg.opt         Store options
   * @param  {Storux}  cfg.opt.storux  A `Storux` instance.
   */
  constructor({store, opt}) {
    let _private;

    this.storux = opt.storux;
    opt.storux = null;

    this.opt = opt;
    this.store = store;
    this.actionsStack = [];
    this.changeListeners = [];
    this.lifecycle = new Evemit();
    this.initialState = this.opt.initialState || {};

    // store name
    defineDisplayName(this, generateStoreName(this.store));

    _private = _privateMap
      .set(this, {
        currentAction: null,
        actionsQueue: 0,
        prevState: {},
        state: this.initialState
      })
      .get(this)
    ;

    // force the pattern: constructor -> init -> state usable
    // avoid to update the state in the constructor before the initialization
    this.lifecycle.once('init', () => {
      _private.state = this.initialState;
    });
  }

  beforeAction(action, listener, thisScope) {
    this.storux.lifecycle.on('beforeAction.' + action.displayName, listener, thisScope);

    return this;
  }

  afterAction(action, listener, thisScope) {
    this.storux.lifecycle.on('afterAction.' + action.displayName, listener, thisScope);

    return this;
  }

  /**
   * Bind a given action to a given handler.
   *
   * @param  {object}   action  Action name or action method (existing in this scope).
   * @param  {function} handler
   * @return {Store}  Current instance.
   */
  bindAction(action, handler) {
    let actionHandlers;
    let handlerName = getFuncName(handler);
    let actionHandlersMap = this.storux._actionHandlersMap;

    // if it's an external handler
    if (!this.store[action.displayName]
    || this.store[action.displayName] !== action
    || !this.store[handlerName]
    || this.store[handlerName] !== handler) {
      throw new Error(
        handlerName
        + ' cannot bind the action (' + action.id + ') from another store.'
        + ' Use instead the method "store.scope.afterAction()". See the doc.'
      );
    }

    actionHandlers = actionHandlersMap.get(action);

    if (!actionHandlers) {
      actionHandlers = actionHandlersMap.set(action, []).get(action);
    }

    actionHandlers.push(handler);

    return this;
  }

  /**
   * Bind one or more action handlers to one or more actions.
   *
   * ---
   *
   * Bind the actions of the current store:
   * ```js
   * this.bindActions(this);
   * ```
   *
   * Bind the actions of a given store
   * ```js
   * this.bindActions(anotherStore);
   * ```
   *
   * Bind specific actions:
   * ```js
   * this.bindActions(
   *   // list {handlerName: action}
   *   onFetch: this.fetch,
   *   onUpdate: this.update,
   *   onDelete: this.delete,
   *
   *   // one or more actions to bind with `this.onShowLoader`
   *   onShowLoader: [this.showLoader, this.fetch, this.update, this.delete],
   * );
   * ```
   *
   * @param {Store|array[function]} list
   * @return {Scope}  Current instance.
   */
  bindActions(list) {
    if (isStore(list)) {
      return this.bindStoreActions(list);
    }

    for (let handlerName in list) {
      let actions = list[handlerName];
      let actionHandler = this[handlerName];

      if (Array.isArray(actions)) {
        for (let i = 0, ln = actions.length; i < ln; i++) {
          this.bindAction(actions[i], actionHandler);
        }
      } else {
        this.bindAction(actions, actionHandler);
      }
    }

    return this;
  }

  /**
   * Bind each action of the `store` passed in argument.
   *
   * A handler is attached to the action,
   * if his name is the action name prefixed by `on`.
   *
   * @param {Store} store Store where each action will be binded.
   * @return {Scope}  Current instance.
   */
  bindStoreActions(store) {
    let props = getStoreProtoProps(store);

    for (let prop of props) {
      // if handler
      if (typeof store[prop] === 'function' && prop.indexOf('on') === 0) {
        let actionName = handlerNameToActionName(prop);
        let action = store[actionName];
        // if have a related action
        if (action) {
          // {function} store.myAction, {function} store.onMyAction
          this.bindAction(action, store[prop]);
        }
      }
    }

    return this;
  }

  /**
   * Bind a given action handler to a given listener.
   *
   * @param  {function} actionHandler
   * @param  {function} listener
   * @return {Scope}  Current instance.
   */
  bindActionHandler(actionHandler, listener) {
    let _actionHandlerListenersMap = this.storux._actionHandlerListenersMap;
    let _actionHandlerListeners = _actionHandlerListenersMap.get(actionHandler);

    if (!_actionHandlerListeners) {
      _actionHandlerListeners = actionHandlerListenersMap
        .set(actionHandler, [])
        .get(actionHandler)
      ;
    }

    _actionHandlerListeners.push(listener);

    return this;
  }

  /**
   * Generate actions
   *
   * @param  {string} ...actionName One or more actions names.
   * @return {Store}  Current instance.
   */
  generateActions(/*actionName, ...*/) {
    let store = this.store;

    for(let i = 0, ln = arguments.length; i < ln; i++) {
      let actionName = arguments[i];

      if(store[actionName]) {
        throw new Error(
          'generateActions(): ' + actionName + 'is already defined.'
        );
      }

      // create the action method
      store[actionName] = function(dispatch, payload) {
        dispatch(payload);
        return payload;
      };
    }

    return this;
  }

  /**
   * Mount an action.
   *
   * @param  {string} actionName Action name (method name).
   * @return {Scope} Current instance.
   */
  mountAction(actionName) {
    let _private;

    // if already mounted
    if (this.store[actionName] && this.store[actionName].id) {
      return this;
    }

    _private = _privateMap.get(this);

    const fn = this.store[actionName];
    const action = (...actionArgs) => {
      return new Promise((resolve, reject) => {
        this.actionsStack.push({
          /**
           * Call the original action.
           * `this` bind to the `Scope` instance.
           * `this` of implemented action method bind to the `Store` instance.
           * @return {*} The original return value.
           */
          proceed() {
            _private.actionsQueue++;
            _private.currentAction = action.id + '#' + _private.actionsQueue;

            // shallow copy
            actionArgs = actionArgs.slice();

            this.storux.lifecycle.emit(
              'beforeAction.' + action.displayName, actionArgs
            );

            this.storux.lifecycle.emit('beforeActions', {
              actionId: action.id,
              actionName: action.displayName,
              actionArgs
            });

            // first arg: dispatch() called from the method implemented
            // `payload` to dispatch
            actionArgs.unshift((payload) => {
              return this._dispatchAction({action, payload})
                .then((hasChanged) => {
                  resolve(fnResult);

                  _private.actionsQueue--;
                  _private.currentAction = null;

                  this.storux.lifecycle.emit(
                    'afterAction.' + action.displayName,
                    payload,
                    fnResult,
                    hasChanged
                  );

                  this.storux.lifecycle.emit('afterActions', {
                    actionId: action.id,
                    actionName: action.displayName,
                    result: fnResult,
                    payload,
                    hasChanged
                  });

                  this._next();

                  return hasChanged;
                })
                .catch((err) => {
                  reject(err)
                  throw err;
                })
              ;
            });

            const fnResult = fn.apply(this.store, actionArgs);
          }
        });

        // if only in the stack, start the call stack.
        // if not, the dispatcher will manage the progress of the stack.
        if(this.actionsStack.length === 1) {
          this._next();
        }
      })
      .catch((err) => {
        throw err;
      });
    };

    // this.store[actionName].displayName
    defineDisplayName(action, actionName);

    action.id = this.displayName + '.' + action.displayName;
    action.defer = (...args) => setTimeout(action.apply(this.store, args), 0);

    // mounted!
    this.store[actionName] = action;

    return this;
  }

  /**
   * Mount the actions of the store.
   *
   * @param  {string} [...name] Zero, one or more actions names.
   * If zero, mountActionsResolver() is used.
   * @return {Store}  Current instance.
   */
  mountActions(/*...name, */) {
   if(arguments.length) {
     for(let name of arguments) {
       this.mountAction(name);
     }
   } else {
     // resolve and mount the actions of the store
     this.opt.mountActionsResolver(this.store);
   }

   return this;
  }

  _next() {
    if (this.actionsStack.length && !_privateMap.get(this).currentAction) {
      this.actionsStack.shift().proceed.call(this);
      return true;
    }

    return false;
  }

  getHandlerArgs({action, payload, nextState}) {
    return [
      payload,
      {
        actionId: action.id,
        actionName: action.displayName,
        nextState
      }
    ];
  }

  callActionHandler({action, actionHandler, payload, nextState}) {
    let nextStateUpdated = actionHandler.apply(
      this.store,
      this.getHandlerArgs({action, payload, nextState})
    );

    // if it break the chain, it's a design error
    if (!nextStateUpdated || typeof nextStateUpdated !== 'object') {
      throw new TypeError(
        'The handler "' + getFuncName(actionHandler)
        + '" should return the next state for the action ' + action.id
      );
    }

    return nextStateUpdated;
  }

  reduceActionHandlers(actionHandlers, action, payload) {
    let nextState;
    let _actionHandlerListenersMap = this.storux._actionHandlerListenersMap;

    nextState = this.getState();

    for (let i = 0, ln = actionHandlers.length; i < ln; i++) {
      let actionHandler = actionHandlers[i];
      let _nextState = this.callActionHandler(
        {action, actionHandler, payload, nextState}
      );

      if (_nextState && typeof _nextState === 'object') {
        let listeners = _actionHandlerListenersMap.get(actionHandler);

        nextState = _nextState;

        if (listeners && listeners.length) {
          // call each listener of the current action handler
          for (let i = 0, ln = listeners.length; i < ln; i++) {
            listeners[i].apply(null, this.getHandlerArgs({action, payload, nextState}));
          }
        }
      }
    }

    return this.setState(nextState);
  }


  /**
   * Dispatch an `action` to all handlers of this `action`.
   *
   * @param  {function} action  Action.
   * @param  {object}  [payload]  payload dispatched from the action.
   * @return {Promise.<bool>}  A promise that will be resolved with a `boolean`.
   * `true` if the state was changed, `false` if the state is unchanged.
   */
  _dispatchAction({action, payload}) {
    let actionHandlers = this.storux._actionHandlersMap.get(action);

    // if no action handlers
    if(!actionHandlers || !actionHandlers.length) {
      return Promise.resolve(false);
    }

    return Promise.resolve(
      this.reduceActionHandlers(actionHandlers, action, payload)
    );
  }

  /**
   * Attach a change `listener`.
   *
   * @param  {function} listener A callback called after each change.
   * The callback receives the current `Store` instance.
   * @return {function} A function to detach the listener.
   * @see Scope.unlisten()
   */
  listen(listener) {
    this.changeListeners.push(listener);
    this.lifecycle.emit('listen', listener);

    // push proxy
    return () => this.unlisten(listener);
  }

  /**
   * Detach a change `listener`.
   *
   * @param  {function} listener  A callback attached with `store.scope.listen()`.
   * @return {bool}     `true` if the `listener` was found and detached, `false` otherwise.
   * @see Scope.listen()
   */
  unlisten(listener) {
    let changeListeners = this.changeListeners;
    let i = changeListeners.indexOf(listener);

    if (i === -1) {
      return false;
    }

    changeListeners.splice(i, 1);
    this.lifecycle.emit('unlisten', listener);

    return true;
  }

  /**
   * Get a clone of the state.
   *
   * @return {object} A clone of the state.
   */
  getState() {
    return clone({}, _privateMap.get(this).state);
  }

  /**
   * Get a clone of the previous state.
   *
   * @return {object} A clone of the previous state.
   */
  getPrevState() {
    return clone({}, _privateMap.get(this).prevState);
  }

  /**
   * Set the new state of the store.
   *
   * @param  {object} [nextState={}] Next state.
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  setState(nextState = {}) {
    let changeListeners = this.changeListeners;
    let ln = changeListeners.length;
    let _private = _privateMap.get(this);

    if (isEquival(_private.state, nextState)) {
      return false;
    }

    // state is already cloned (previous setState)
    // and prevState is cloned by getPrevState() on each call.
    // So needless to clone again prevState.
    _private.prevState = _private.state;
    _private.state = clone({}, nextState);

    if (ln) {
      for (let i = 0; i < ln; i++) {
        changeListeners[i](this);
      }
    }

    return true;
  }

  /**
   * Merge the state of the store with `obj`.
   *
   * @param  {object} obj Object to merge with the state.
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  mergeState(obj) {
    return this.setState({..._privateMap.get(this).state, ...obj});
  }

  /**
   * Reset the state to the initial state.
   *
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  resetState() {
    let hasChanged = this.setState(this.initialState);

    if(hasChanged) {
      this.lifecycle.emit('resetState');
    }

    return hasChanged;
  }

  /**
   * Recycle the store:
   *  * Reset the state to the initial state.
   *  * Reset prevState (previous state).
   *  * Emit `init` event.
   *
   * @return {bool} `true` if the state was changed,
   * `false` if the state is unchanged.
   */
  recycle() {
    let hasChanged = this.setState(this.initialState);

    _privateMap.get(this).prevState = {};
    this.lifecycle.emit('init', hasChanged);

    return hasChanged;
  }
}

module.exports = Scope;
