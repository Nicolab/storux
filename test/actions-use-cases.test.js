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
const {Storux, Store, Scope} = require('../dist/storux');
const storux = new Storux();
const onVirtualNeverCalledSpy = test.spy();
const privateOnVirtual1Spy = test.spy();
const onVirtual1Spy = test.spy();
const onVirtual2Spy = test.spy();
const handleVirtual2Spy = test.spy();

const resetAllSpies = () => {
  privateOnVirtual1Spy.resetHistory();
  onVirtual1Spy.resetHistory();
  onVirtual2Spy.resetHistory();
  handleVirtual2Spy.resetHistory();
};

let sharedStore;
let assert = test.assert;
let {catchError} = require('./fixtures/helpers');

class SharedStore extends Store {
  constructor(opt) {
    super(opt);

    this
      .scope
      .ensureActions(
        'virtualForward',
        'virtual1',
        'virtual2',
        'virtualNeverCalled'
      )
      .mountActions({
        execActionNotListened: this.execActionNotListened,
        execActionChangeState: this.execActionChangeState,
        execActionNotReturn: this.execActionNotReturn,
      })
    ;

    this.virtual1.hooks.push(this.onVirtual1);
    this.virtual2.hooks.push(this.onVirtual2);
    this.virtualNeverCalled.hooks.push(this.onVirtualNeverCalled);
    this.execActionChangeState.hooks.push(this.onExecActionChangeState);
  }

  execAction({spy}) {
    let args = arguments;
    this.scope.dispatch().then((hasChanged) => spy(hasChanged, ...args));
    return 1;
  }

  execActionNotListened({spy}) {
    let args = arguments;
    this.scope.dispatch().then((hasChanged) => spy(hasChanged, ...args));
    return 2;
  }

  execActionNotReturn({spy}) {
    let args = arguments;
    this.scope.dispatch().then((hasChanged) => spy(hasChanged, ...args));
  }

  execActionChangeState({spy}) {
    let args = arguments;
    this.scope.dispatch().then((hasChanged) => spy(hasChanged, ...args));
  }

  onExecActionChangeState() {
    return {changeState: true}
  }

  // added manually in a tests case
  _onVirtual1(ns, payload, context) {
    privateOnVirtual1Spy(ns, payload, context);
    return {};
  }

  onVirtual1(ns, payload, context) {
    onVirtual1Spy(ns, payload, context);
    return {};
  }

  onVirtual2(ns, payload, context) {
    onVirtual2Spy(ns, payload, context);
    return {a: 'changed'};
  }

  onVirtualNeverCalled() {
    onVirtualNeverCalledSpy();
    return {};
  }
}

class ExternalStore extends Store {
  constructor(opt) {
    super(opt);

    sharedStore.scope.storux.after(
      sharedStore.virtual2,
      this.handleVirtual2,
      this
    );
  }

  handleVirtual2(payload, result, hasChanged) {
    handleVirtual2Spy(payload, result, hasChanged);
    this.scope.replaceState({'b': 'changed'});
  }
}

sharedStore = storux.create(SharedStore);

describe('Actions: use cases', function() {
  after(function() {
    assert(
      !onVirtualNeverCalledSpy.called,
      'onVirtualNeverCalled() is never called'
    );
  });

  describe('Dispatch', function () {
    afterEach(function() {
      resetAllSpies();
    });

    it.skip('action doesn\'t call replaceState() if the state is not changed', function() {

    });

    it('dispatch an action not listened, '
    + 'dispatch should returns a Promise (hasChanged false)', function(done) {
      let actionSpy = test.spy();

      test
        .object(
          sharedStore
            .execActionNotListened({spy: actionSpy})
            .then((num) => {
              test
                .case('return a Promise that resolves the return value of the action')
                .number(num)
                  .isIdenticalTo(2)

                .case('action dispatched, but the spy is called from dispatch().then(spy)')
                .wait(0, function() {
                  test
                    // hasChanged
                    .bool(actionSpy.firstCall.args[0])
                      .isFalse()

                    // payload
                    .object(actionSpy.firstCall.args[1])
                      .is({spy: actionSpy})
                  ;

                  done();
                })
              ;
            })
            .catch(catchError)
        )
      ;
    });

    it('dispatch returns a Promise (hasChanged true)', function(done) {
      let actionSpy = test.spy();

      test
        .undefined(sharedStore.getState().changeState)
        .object(
          sharedStore
            .execActionChangeState({spy: actionSpy})
            .then((result) => {
              test
                .undefined(result)

                .case('action dispatched, but the spy is called from dispatch().then(spy)')
                .wait(0, function() {
                  test
                    // hasChanged
                    .bool(actionSpy.firstCall.args[0])
                      .isTrue()

                    // payload
                    .object(actionSpy.firstCall.args[1])
                      .is({spy: actionSpy})

                    .bool(sharedStore.getState().changeState)
                      .isTrue()

                    .bool(sharedStore.replaceState({}))
                      .isTrue()
                  ;

                  done();
                })
              ;
            })
            .catch(catchError)
        )
      ;
    });

    it('dispatch an action not return', function(done) {
      let actionSpy = test.spy();

      test
        .object(
          sharedStore
            .execActionNotReturn({spy: actionSpy})
            .then((result) => {
              test
                .undefined(result)

                .case('action dispatched, but the spy is called from dispatch().then(spy)')
                .wait(0, function() {
                  test
                    // hasChanged
                    .bool(actionSpy.firstCall.args[0])
                      .isFalse()

                    // payload
                    .object(actionSpy.firstCall.args[1])
                      .is({spy: actionSpy})
                  ;

                  done();
                })
              ;
            })
            .catch(catchError)
        )
      ;
    });
  });

  describe('Virtual actions', function() {
    afterEach(function() {
      resetAllSpies();
    });

    it('generate actions and bind the virtual actions of the store', function() {
      test
        .object(sharedStore)
        .object(sharedStore.scope)
          .isInstanceOf(Scope)

        .function(sharedStore.getState)
        .function(sharedStore.setState)
        .function(sharedStore.replaceState)
        .function(sharedStore.virtualNeverCalled)
        .function(sharedStore.virtualForward)
        .function(sharedStore.virtual1)
        .function(sharedStore.virtual2)
      ;
    });

    it('virtual actions have the properties ID and displayName', function() {
      test
        .string(sharedStore.virtualForward.displayName)
          .isIdenticalTo('virtualForward')

        .string(sharedStore.virtualForward.id)
          .isIdenticalTo('sharedStore.virtualForward')

        .string(sharedStore.virtualNeverCalled.displayName)
          .isIdenticalTo('virtualNeverCalled')

        .string(sharedStore.virtualNeverCalled.id)
          .isIdenticalTo('sharedStore.virtualNeverCalled')

        .string(sharedStore.virtual1.displayName)
          .isIdenticalTo('virtual1')

        .string(sharedStore.virtual1.id)
          .isIdenticalTo('sharedStore.virtual1')

        .string(sharedStore.virtual2.displayName)
          .isIdenticalTo('virtual2')

        .string(sharedStore.virtual2.id)
          .isIdenticalTo('sharedStore.virtual2')
      ;
    });

    it('not call a not existing action', function() {
      test.exception(function() {
        sharedStore.notExists();
      });
    });

    it('virtual action should keep only the first argument passed to the action', function(done) {
      sharedStore
        .virtualForward(1, 2, 3, 'a', 'b', 'c', {a: 'a value'}, ['a', 'b'])
        .then((payload) => {
          test.number(payload).is(1);
          done();
        })
      ;
    });

    it('hook (from external) an action to a local function', function(done) {
      let thenDoneSpy = test.spy();

      sharedStore.virtual1.hooks.push(
        sharedStore._onVirtual1
      );

      sharedStore
        .virtual1(['a', 'b', 'c'])
        .then((payload) => {
          test
            .array(payload)
              .is(['a', 'b', 'c'])

            // onVirtual1() called with nextState (first argument)
            .object(privateOnVirtual1Spy.firstCall.args[0])
              .is({})
              .is(sharedStore.getState())

            // onVirtual1() called with (payload): a, b, c (second argument)
            .array(privateOnVirtual1Spy.firstCall.args[1])
              .is(payload)

            // onVirtual1() called with context (3rd argument)
            .object(privateOnVirtual1Spy.firstCall.args[2])
              .hasProperties(['actionId', 'actionName'])
              .hasProperty('actionId', 'sharedStore.virtual1')
              .hasProperty('actionName', 'virtual1')
          ;

          thenDoneSpy();
        })
        .catch(catchError)
      ;

      test.wait(0, function() {
        assert(thenDoneSpy.calledOnce, 'resolve action virtual1 ' + thenDoneSpy.callCount);
        assert(onVirtual1Spy.calledOnce, 'onVirtual1() was called once');
        assert(privateOnVirtual1Spy.calledOnce, '_onVirtual1() called once');
        thenDoneSpy.resetHistory();
        done();
      });
    });

    it('listen (from store) an external action (virtual) to an action listener'
    + ' and update the states of the two store', function(done) {
      let externalStore = storux.create(ExternalStore);
      let thenDoneSpy = test.spy();

      sharedStore
        .virtual2({a: false, b: true, c: false})
        .then((payload) => {
          test
            .object(payload)
              .is({a: false, b: true, c: false})

            // handleVirtual2() called with payload: {a, b, c} (argument 1)
            .object(handleVirtual2Spy.firstCall.args[0])
             .is(payload)

            // handleVirtual2() called with action result: {a, b, c} (argument 2)
            .object(handleVirtual2Spy.firstCall.args[1])
              .is(payload)

            // handleVirtual2() called with: hasChanged (argument 3)
            .bool(handleVirtual2Spy.firstCall.args[2])
              .isTrue()

            .object(sharedStore.getState())
              .is({a: 'changed'})

            .object(externalStore.getState())
              .is({b: 'changed'})
          ;

          thenDoneSpy();
        })
        .catch(catchError)
      ;

      test.wait(0, function() {
        assert(thenDoneSpy.calledOnce, 'resolve action virtual1 ' + thenDoneSpy.callCount);
        assert(handleVirtual2Spy.calledOnce, 'handleVirtual2() was called once');
        assert(onVirtual2Spy.calledOnce, 'onVirtual2() was called once');
        assert(privateOnVirtual1Spy.callCount === 0, '_onVirtual1() was always called once');
        assert(onVirtual1Spy.callCount === 0, 'onVirtual1() not called');

        thenDoneSpy.resetHistory();
        done();
      })
    });
  });
});
