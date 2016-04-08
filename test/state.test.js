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

const test = require('unit.js');
const {Storux, Store} = require('../src/');
const storux = new Storux();
const onVirtualNeverCalledSpy = test.spy();

let sharedStore;
let assert = test.assert;
let {catchError} = require('./fixtures/helpers');

class SharedStore extends Store {
  constructor(opt) {
    super(opt);

    this
      .scope
      .generateActions(
        'inc',
        'dec',
        'virtualNeverCalled'
      )
      .mountActions()
      .bindActions(this)
    ;

    this.scope.initialState = {
      sum: 0,
      ...opt.initialState
    };
  }

  onInc({number, testStateSum = true}, {state, nextState}) {
    test
      .object(this.getState())
        .is(state)
        .isNotEqualTo(state)
        .isEqualTo(nextState)
    ;

    if (testStateSum) {
      test
        .number(this.getState().sum)
          .is(state.sum)
          .isNot(nextState.sum)
      ;
    }

    return {...nextState, sum: nextState.sum + number};
  }

  onDec({number, testStateSum = true}, {state, nextState}) {
    test
      .object(this.getState())
        .is(state)
        .isNotEqualTo(state)
        .isEqualTo(nextState)
    ;

    if (testStateSum) {
      test
        .number(this.getState().sum)
          .is(state.sum)
          .isNot(nextState.sum)
      ;
    }

    return {...nextState, sum: nextState.sum - number};
  }

  onVirtualNeverCalled() {
    onVirtualNeverCalledSpy();
    return {sum: 0};
  }
}

class NumberStore extends SharedStore {

}

sharedStore = storux.createStore(SharedStore);

describe('State', function() {
  it('get state', function() {
    test
      .object(sharedStore.getState())
        .is(sharedStore.scope.getState())
        .is({sum: 0})
        .is(sharedStore.scope.initialState)
    ;
  });

  it('init the initial state', function() {
    let _storux = new Storux();
    let numberStore = _storux.createStore(NumberStore, {initialState: {sum: 1}});

    test
      .number(sharedStore.getState().sum)
        .isIdenticalTo(0)

      .number(numberStore.getState().sum)
        .isIdenticalTo(1)
    ;
  });

  it.skip('reset to initial state', function() {

  });

  it.skip('reset to initial state when the store is recycled', function() {

  });

  it.skip('listen the state changes', function() {

  });

  it.skip('unlisten the state changes', function() {

  });

  it('state is immutable', function() {
    let _storux = new Storux();
    let numberStore = _storux.createStore(NumberStore, {initialState: {sum: 1}});

    test
      .undefined(numberStore.state)

      .when(numberStore.state = {})
        .object(numberStore.getState())
          .is({sum: 1})
          .isNot({})

      .bool(numberStore.replaceState({sum: 1}))
        .isFalse()

      .bool(numberStore.replaceState({sum: 2}))
        .isTrue()

      .object(numberStore.getState())
        .is({sum: 2})
    ;
  });

  it.skip('properties descriptors are not crushed when the state is cloned', function() {

  });

  it.skip('set a new state object', function() {

  });

  it.skip('merge some key/value in the state', function() {

  });

  it.skip('action doesn\'t call replaceState() if the state is not changed', function() {

  });
});
