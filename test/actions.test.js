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
const {Storux, Store} = require('storux');
let assert = test.assert;
let {handlePromise} = require('./fixtures/helpers');

class VirtActStore extends Store {
  constructor(opt) {
    super(opt);

    this
      .scope
      .ensureActions(
        'virtual1',
        'virtual2',
      )
      .ensureSaveActions(
        'virtualSave1',
        'virtualSave2',
      )
    ;

    this.virtual1.hooks.push(this.onVirtual1);
    this.virtual2.hooks.push(this.onVirtual2);
  }
}

class FooStore extends Store {
  constructor(opt) {
    super(opt);

    this.scope.mountActions({
      emptyDispatch: this.emptyDispatch,
      dispatchWithPayload: this.dispatchWithPayload,
      dispatchThePayload: this.dispatchThePayload,
      saveData: this.saveData,
    });

    this.dispatchThePayload.hooks.push(this.onDispatchThePayload);
    this.dispatchSpy = test.spy();
  }

  emptyDispatch() {
    this.scope.dispatch();
    this.dispatchSpy('emptyDispatch');
    return 'ret emptyDispatch';
  }

  dispatchWithPayload(payload) {
    this.scope.dispatch().then((hasChanged) => {
      test.bool(hasChanged).isFalse();
      this.dispatchSpy('dispatchWithPayload', payload, hasChanged);
    });

    assert(arguments.length === 1, 'receive one argument');
    assert(payload === 'hello', 'argument is hello');

    return {ret: 'dispatchWithPayload', payload};
  }

  dispatchThePayload(payload) {
    this.scope.dispatch(payload);
    this.dispatchSpy('dispatchThePayload', payload);
    return {ret: 'dispatchThePayload', payload};
  }

  onDispatchThePayload(ns, payload) {
    ns.fromHook = 'onDispatchThePayload';
    ns.receivedPayload = payload;

    return ns;
  }

  saveData(payload) {
    assert(arguments.length === 1, 'receive one argument');
    assert(payload === 'hello', 'argument is hello');

    this
      .scope
      .save({receivedPayload: payload, fromAction: 'saveData'})
      .then((hasChanged) => {
        this.dispatchSpy('saveData', payload, hasChanged);
        test.bool(hasChanged).isTrue();
      })
    ;

    return {ret: 'saveData', payload};
  }
}

describe('Actions', function() {
  it('dispatch and resolve the returned value', function(done) {
    let _storux = new Storux();
    let fooStore = _storux.create(FooStore);

    handlePromise(done, test
      .promise
      .given(fooStore.emptyDispatch())
      .then((ret) => {
        test
          .string(ret)
            .isIdenticalTo('ret emptyDispatch')

          .undefined(fooStore.dispatchSpy.defer)
          .undefined(fooStore.dispatchSpy.hooks)
          .value(fooStore.dispatchSpy.id)
            .notContains('fooStore')
            .notContains('dispatchSpy')
        ;

        assert(
          fooStore.dispatchSpy.calledOnce,
          'fooStore.dispatchSpy.calledOnce'
        );

        assert(
          fooStore.dispatchSpy.firstCall.args[0] === 'emptyDispatch',
          'emptyDispatch called'
        );
      })
    );
  });

  it('dispatch (with payload) and resolve the returned value', function(done) {
    let _storux = new Storux();
    let fooStore = _storux.create(FooStore);

    handlePromise(done, test
      .promise
      .given(fooStore.dispatchWithPayload('hello'))
      .then((ret) => {
        test
          .object(ret)
            .is({ret: 'dispatchWithPayload', payload: 'hello'})

          .undefined(fooStore.dispatchSpy.defer)
          .undefined(fooStore.dispatchSpy.hooks)
          .value(fooStore.dispatchSpy.id)
            .notContains('fooStore')
            .notContains('dispatchSpy')
        ;

        assert(
          fooStore.dispatchSpy.calledOnce,
          'fooStore.dispatchSpy.calledOnce'
        );
      })
    );
  });

  it('dispatch the payload and resolve the returned value', function(done) {
    let _storux = new Storux();
    let fooStore = _storux.create(FooStore);

    handlePromise(done, test
      .promise
      .given(fooStore.dispatchThePayload('hello'))
      .then((ret) => {
        test
          .object(ret)
            .is({ret: 'dispatchThePayload', payload: 'hello'})

          .undefined(fooStore.dispatchSpy.defer)
          .undefined(fooStore.dispatchSpy.hooks)
          .value(fooStore.dispatchSpy.id)
            .notContains('fooStore')
            .notContains('dispatchSpy')
        ;

        assert(
          fooStore.dispatchSpy.calledOnce,
          'fooStore.dispatchSpy.calledOnce'
        );

        assert(
          fooStore.dispatchSpy.firstCall.args[0] === 'dispatchThePayload',
          'dispatchThePayload called'
        );

        let state = fooStore.getState();

        assert(
          state.fromHook === 'onDispatchThePayload',
          'state from hook'
        );

        test.string(state.receivedPayload).isIdenticalTo('hello');
      })
    );
  });

  it('save() state and resolve the returned value', function(done) {
    let _storux = new Storux();
    let fooStore = _storux.create(FooStore);

    handlePromise(done, test
      .promise
      .given(fooStore.saveData('hello'))
      .then((ret) => {
        test
          .object(ret)
            .is({ret: 'saveData', payload: 'hello'})

          .undefined(fooStore.dispatchSpy.defer)
          .undefined(fooStore.dispatchSpy.hooks)
          .value(fooStore.dispatchSpy.id)
            .notContains('fooStore')
            .notContains('dispatchSpy')
        ;

        assert(
          fooStore.dispatchSpy.calledOnce,
          'fooStore.dispatchSpy.calledOnce'
        );

        assert(
          fooStore.dispatchSpy.firstCall.args[0] === 'saveData',
          'saveData called'
        );

        assert(
          fooStore.dispatchSpy.firstCall.args[1] === 'hello',
          'saveData payload'
        );

        assert(
          fooStore.dispatchSpy.firstCall.args[2] === true,
          'saveData state hasChanged'
        );

        let state = fooStore.getState();

        assert(
          state.fromAction === 'saveData',
          'state from saveData action'
        );

        assert(
          state.receivedPayload === 'hello',
          'payload from saveData action'
        );
      })
    );
  });

  it('save the state with virtual actions', function(done) {
    let _storux = new Storux();
    let vaStore = _storux.create(VirtActStore);

    handlePromise(done, test
      .promise
      .given(vaStore.virtualSave1({hello: 'world'}))
      .then((ret) => {
        test
          .function(vaStore.virtualSave1.defer)
          .array(vaStore.virtualSave1.hooks)
          .string(vaStore.virtualSave1.id)
            .isIdenticalTo('virtActStore.virtualSave1')

          .object(ret)
            .is({hello: 'world'})
            .is(vaStore.getState())
        ;

        return vaStore
          .virtualSave2({hello2: 'v2'})
          .then((ret2) => {
            test
              .function(vaStore.virtualSave2.defer)
              .array(vaStore.virtualSave2.hooks)
              .string(vaStore.virtualSave2.id)
                .isIdenticalTo('virtActStore.virtualSave2')

              .object(ret2)
                .is({hello2: 'v2'})

                .object(vaStore.getState())
                  .is({hello: 'world', hello2: 'v2'})
            ;
          })
        ;
      })
    );
  });
});