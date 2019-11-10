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
const {Storux, Store} = require('../dist/storux');
const storux = new Storux();

let sharedStore;

class SharedStore extends Store {
  constructor(opt) {
    super(opt);

    this.scope.initialState = {
      sum: 0,
      ...this.scope.initialState
    };
  }
}

class NumberStore extends SharedStore {

}

sharedStore = storux.create(SharedStore);

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
    let numberStore = _storux.create(NumberStore, {initialState: {sum: 1}});

    test
      .number(sharedStore.getState().sum)
        .isIdenticalTo(0)

      .number(numberStore.getState().sum)
        .isIdenticalTo(1)
    ;
  });

  // TODO: add a spy listener
  it('reset to initial state', function() {
    let _storux = new Storux();
    let numberStore = _storux.create(NumberStore, {initialState: {sum: 1}});

    test
      .number(numberStore.getState().sum)
        .isIdenticalTo(1)

      .bool(numberStore.setState({sum: 42}))
        .isTrue()

      .number(numberStore.getState().sum)
        .isIdenticalTo(42)

      .bool(numberStore.scope.resetState())
        .isTrue()

      .number(numberStore.getState().sum)
        .isIdenticalTo(1)
    ;
  });

  // TODO: add some spies listeners
  it('reset to initial state when the store is recycled', function() {
    let _storux = new Storux();
    let numberStore = _storux.create(NumberStore, {initialState: {sum: 1}});

    test
      .number(numberStore.getState().sum)
        .isIdenticalTo(1)

      .bool(numberStore.setState({sum: 42}))
        .isTrue()

      .number(numberStore.getState().sum)
        .isIdenticalTo(42)

      .bool(numberStore.scope.recycle())
        .isTrue()

      .number(numberStore.getState().sum)
        .isIdenticalTo(1)
    ;
  });

  it.skip('listen the state changes', function() {

  });

  it.skip('unlisten the state changes', function() {

  });

  it('state is immutable', function() {
    let _storux = new Storux();
    let numberStore = _storux.create(NumberStore, {initialState: {sum: 1}});

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

  it('set a new state object with replaceState()', function() {
    let _storux = new Storux();
    let numberStore = _storux.create(NumberStore, {initialState: {sum: 1}});

    test
      .number(numberStore.getState().sum)
        .isIdenticalTo(1)

      .object(numberStore.getState())
        .is({sum: 1})

      .bool(numberStore.replaceState({foo: 'foo', bar: 'bar'}))
        .isTrue()

      .undefined(numberStore.getState().sum)

      .object(numberStore.getState())
        .hasNotProperty('sum')
        .is({foo: 'foo', bar: 'bar'})
    ;
  });

  it('merge some key/value in the state', function() {
    let _storux = new Storux();
    let numberStore = _storux.create(NumberStore, {initialState: {sum: 1}});

    test
      .number(numberStore.getState().sum)
        .isIdenticalTo(1)

      .object(numberStore.getState())
        .is({sum: 1})

      .bool(numberStore.setState({foo: 'foo', bar: 'bar'}))
        .isTrue()

      .number(numberStore.getState().sum)
        .isIdenticalTo(1)

      .object(numberStore.getState())
        .is({sum: 1, foo: 'foo', bar: 'bar'})

      .bool(numberStore.setState({sum: 42, foo: 'foo2', bar: 'bar', hello: 'Hello'}))
        .isTrue()

      .object(numberStore.getState())
        .is({sum: 42, foo: 'foo2', bar: 'bar', hello: 'Hello'})
    ;
  });
});
