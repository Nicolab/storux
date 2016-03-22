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

let {catchError, testHasChanged} = require('./fixtures/helpers');

const test = require('unit.js');
const {Storux, Store, Scope} = require('../src/');
const assert = test.assert;

const onV1Spy = test.spy();
const onV2Spy = test.spy();

const delay1Spy = test.spy();
const delay2Spy = test.spy();
const delay3Spy = test.spy();
const delay4Spy = test.spy();

const onDelay1Spy = test.spy();
const onDelay2Spy = test.spy();
const onDelay3Spy = test.spy();
const onDelay4Spy = test.spy();

const resetAllSpies = () => {
  onV1Spy.reset();
  onV2Spy.reset();

  delay1Spy.reset();
  delay2Spy.reset();
  delay3Spy.reset();
  delay4Spy.reset();

  onDelay1Spy.reset();
  onDelay2Spy.reset();
  onDelay3Spy.reset();
  onDelay4Spy.reset();
};

describe('Flux', function() {

  class FluxStore extends Store {
    constructor(opt) {
      super(opt);

      this
        .scope
        .generateActions(
          'v1',
          'v2'
        )
        .mountActions()
        .bindActions(this)
      ;
    }

    delay1(dispatch, arg) {
      let id = 1;

      assert(arg === id, `position call ${id} (arg: ${arg}).`);
      delay1Spy();
      dispatch(id).then(testHasChanged(true));

      return id;
    }

    delay2(dispatch, arg) {
      let id = 2;

      assert(arg === id, `position call ${id} (arg: ${arg}).`);
      delay2Spy();

      setTimeout(() => dispatch(id).then(testHasChanged(true)), 0);

      return id;
    }

    delay3(dispatch, arg) {
      let id = 3;

      assert(arg === id, `position call ${id} (arg: ${arg}).`);
      delay3Spy();

      setTimeout(() => dispatch(id).then(testHasChanged(true)), 5);

      return id;
    }

    delay4(dispatch, arg) {
      let id = 4;

      assert(arg === id, `position call ${id} (arg: ${arg}).`);
      delay4Spy();

      setTimeout(() => dispatch(id).then(testHasChanged(true)), 10);

      return id;
    }

    onV1(payload, {nextState, actionId, actionName}) {
      test
        .string(payload)
          .isIdenticalTo('1')

        .string(actionId)
          .isIdenticalTo('fluxStore.v1')

        .string(actionName)
          .isIdenticalTo('v1')
      ;

      onV1Spy({payload, nextState, state: this.getState()});

      return {...nextState, v1: true};
    }

    onV2(payload, {nextState, actionId, actionName}) {
      test
        .undefined(payload)

        .string(actionId)
          .isIdenticalTo('fluxStore.v2')

        .string(actionName)
          .isIdenticalTo('v2')
      ;

      onV2Spy({payload, nextState, state: this.getState()});

      return {...nextState, v2: true};
    }

    onDelay1(id, {nextState, actionId, actionName}) {
      test
        .number(id)
          .isIdenticalTo(1)

        .string(actionId)
          .isIdenticalTo('fluxStore.delay1')

        .string(actionName)
          .isIdenticalTo('delay1')
      ;

      onDelay1Spy({payload: id, nextState, state: this.getState()});

      return {...nextState, delay1: true};
    }

    onDelay2(id, {nextState, actionId, actionName}) {
      test
        .number(id)
          .isIdenticalTo(2)

        .string(actionId)
          .isIdenticalTo('fluxStore.delay2')

        .string(actionName)
          .isIdenticalTo('delay2')
      ;

      onDelay2Spy({payload: id, nextState, state: this.getState()});

      return {...nextState, delay2: true};
    }

    onDelay3(id, {nextState, actionId, actionName}) {
      test
        .number(id)
          .isIdenticalTo(3)

        .string(actionId)
          .isIdenticalTo('fluxStore.delay3')

        .string(actionName)
          .isIdenticalTo('delay3')
      ;

      onDelay3Spy({payload: id, nextState, state: this.getState()});

      return {...nextState, delay3: true};
    }

    onDelay4(id, {nextState, actionId, actionName}) {
      test
        .number(id)
          .isIdenticalTo(4)

        .string(actionId)
          .isIdenticalTo('fluxStore.delay4')

        .string(actionName)
          .isIdenticalTo('delay4')
      ;

      onDelay4Spy({payload: id, nextState, state: this.getState()});

      return {...nextState, delay4: true};
    }
  }

  describe('Handling the store', function() {
    let store, storux;

    beforeEach(function() {
      resetAllSpies();
      storux = new Storux();
      store = storux.createStore(FluxStore);
    });

    describe('Unidirectional flux', function () {
      it('Action and listener executed and resolved one after one (reversed)', function(done) {
        store.delay4(4).catch((err) => catchError(err));
        store.v1('1').catch((err) => catchError(err));
        store.delay3(3).catch((err) => catchError(err));
        store.delay2(2).catch((err) => catchError(err));
        store.v2().catch((err) => catchError(err));
        store.delay1(1).catch((err) => catchError(err));

        test.wait(100, function() {
          assert(delay4Spy.calledOnce, 'delay4Spy.calledOnce');
          assert(delay4Spy.calledBefore(delay3Spy), 'delay4Spy.calledBefore');
          assert(delay4Spy.calledBefore(delay2Spy), 'delay4Spy.calledBefore');
          assert(delay4Spy.calledBefore(delay1Spy), 'delay4Spy.calledBefore');
          assert(delay4Spy.calledBefore(onV1Spy), 'delay4Spy.calledBefore');
          assert(delay4Spy.calledBefore(onV2Spy), 'delay4Spy.calledBefore');

          assert(onV1Spy.calledOnce, 'onV1Spy.calledOnce');
          assert(onV1Spy.calledBefore(delay3Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(delay2Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(delay1Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(onV2Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledAfter(delay4Spy), 'onV1Spy.calledAfter');

          assert(delay3Spy.calledOnce, 'delay3Spy.calledOnce');
          assert(delay3Spy.calledBefore(delay2Spy), 'delay3Spy.calledBefore');
          assert(delay3Spy.calledBefore(delay1Spy), 'delay3Spy.calledBefore');
          assert(delay3Spy.calledBefore(onV2Spy), 'delay3Spy.calledBefore');
          assert(delay3Spy.calledAfter(delay4Spy), 'delay3Spy.calledAfter');
          assert(delay3Spy.calledAfter(onV1Spy), 'delay3Spy.calledAfter');

          assert(delay2Spy.calledOnce, 'delay2Spy.calledOnce');
          assert(delay2Spy.calledBefore(delay1Spy), 'delay2Spy.calledBefore');
          assert(delay2Spy.calledBefore(onV2Spy), 'delay2Spy.calledBefore');
          assert(delay2Spy.calledAfter(delay4Spy), 'delay2Spy.calledAfter');
          assert(delay2Spy.calledAfter(delay3Spy), 'delay2Spy.calledAfter');
          assert(delay2Spy.calledAfter(onV1Spy), 'delay2Spy.calledAfter');

          assert(onV2Spy.calledOnce, 'onV2Spy.calledOnce');
          assert(onV2Spy.calledBefore(delay1Spy), 'onV2Spy.calledBefore');
          assert(onV2Spy.calledAfter(delay4Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(onV1Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(delay3Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(delay2Spy), 'onV2Spy.calledAfter');

          assert(delay1Spy.calledOnce, 'delay1Spy.calledOnce');
          assert(delay1Spy.calledAfter(delay4Spy), 'delay1Spy.calledAfter');
          assert(delay1Spy.calledAfter(delay3Spy), 'delay1Spy.calledAfter');
          assert(delay1Spy.calledAfter(delay2Spy), 'delay1Spy.calledAfter');
          assert(delay1Spy.calledAfter(onV1Spy), 'delay1Spy.calledAfter');
          assert(delay1Spy.calledAfter(onV2Spy), 'delay1Spy.calledAfter');

          done();
        });
      });

      it('Action executed and resolved one after one (ordered)', function(done) {
        store.v1('1').catch((err) => catchError(err));
        store.delay1(1).catch((err) => catchError(err));
        store.delay2(2).catch((err) => catchError(err));
        store.delay3(3).catch((err) => catchError(err));
        store.delay4(4).catch((err) => catchError(err));
        store.v2().catch((err) => catchError(err));

        test.wait(100, function() {
          assert(onV1Spy.calledOnce, 'onV1Spy.calledOnce');
          assert(onV1Spy.calledBefore(delay1Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(delay2Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(delay3Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(delay4Spy), 'onV1Spy.calledBefore');
          assert(onV1Spy.calledBefore(onV2Spy), 'onV1Spy.calledBefore');

          assert(delay1Spy.calledOnce, 'delay1Spy.calledOnce');
          assert(delay1Spy.calledBefore(delay2Spy), 'delay1Spy.calledBefore');
          assert(delay1Spy.calledBefore(onV2Spy), 'delay1Spy.calledBefore');

          assert(delay2Spy.calledOnce, 'delay2Spy.calledOnce');
          assert(delay2Spy.calledBefore(delay3Spy), 'delay2Spy.calledBefore');

          assert(delay3Spy.calledOnce, 'delay3Spy.calledOnce');
          assert(delay3Spy.calledBefore(delay4Spy), 'delay3Spy.calledBefore');

          assert(delay4Spy.calledOnce, 'delay4Spy.calledOnce');
          assert(delay4Spy.calledBefore(onV2Spy), 'delay4Spy.calledBefore');

          assert(onV2Spy.calledOnce, 'onV2Spy.calledOnce');
          assert(onV2Spy.calledAfter(onV1Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(delay1Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(delay2Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(delay3Spy), 'onV2Spy.calledAfter');
          assert(onV2Spy.calledAfter(delay4Spy), 'onV2Spy.calledAfter');

          done();
        });
      });

      it('one after one, preserve the state and the return value', function(done) {
        let thenCount = 0;

        // NOTE:
        // The flux of the actions and its state reducers is unidirectional,
        // but not the thenable after the action.
        // The role of the thenable is only to be executed
        // when the action flow is resolved
        // (action + all state changes of this action).
        // This action is resolved,
        // so no need to reduce the performance by blocking the call stack.
        // To finely manipulate each state change,
        // use store.scope.listen() and store.scope.unlisten()

        store
          .v1('1')
          .then((ret) => {
            let spyArgs = onV1Spy.firstCall.args[0];
            let {v1, v2, delay1, delay2, delay3, delay4} = spyArgs.nextState;
            let state = spyArgs.state;

            test
              .string(ret)
                .isIdenticalTo('1')
                .isIdenticalTo(spyArgs.payload)
            ;

            // the payload received by arguments in the handler (reducer)
            assert(
              !v1 && !delay1 && !delay2 && !delay3 && !delay4 && !v2,
              'v1: payload received by the handler'
            );

            // the state when the action handler was executed
            assert(
              !state.v1
              && !state.delay1
              && !state.delay2
              && !state.delay3
              && !state.delay4
              && !state.v2,
              'v1: get the values of the current event loop'
            );

            thenCount++;
          })
          .catch((err) => catchError(err))
        ;

        store
          .delay1(1)
          .then((ret) => {
            let spyArgs = onDelay1Spy.firstCall.args[0];
            let {v1, v2, delay1, delay2, delay3, delay4} = spyArgs.nextState;
            let state = spyArgs.state;

            test
              .number(ret)
                .isIdenticalTo(1)
                .isIdenticalTo(spyArgs.payload)
            ;

            // the payload received by arguments in the handler (reducer)
            assert(
              v1 && !delay1 && !delay2 && !delay3 && !delay4 && !v2,
              'delay1: payload received by the handler'
            );

            // the state when the action handler was executed
            assert(
              state.v1
              && !state.delay1
              && !state.delay2
              && !state.delay3
              && !state.delay4
              && !state.v2,
              'delay1: get the values of the current event loop'
            );

            thenCount++;
          })
          .catch((err) => catchError(err))
        ;

        store
          .delay2(2)
          .then((ret) => {
            let spyArgs = onDelay2Spy.firstCall.args[0];
            let {v1, v2, delay1, delay2, delay3, delay4} = spyArgs.nextState;
            let state = spyArgs.state;

            test
              .number(ret)
                .isIdenticalTo(2)
                .isIdenticalTo(spyArgs.payload)
            ;

            // the payload received by arguments in the handler (reducer)
            assert(
              v1 && delay1 && !delay2 && !delay3 && !delay4 && !v2,
              'delay2: payload received by the handler'
            );

            // the state when the action handler was executed
            assert(
              state.v1
              && state.delay1
              && !state.delay2
              && !state.delay3
              && !state.delay4
              && !state.v2,
              'delay2: get the values of the current event loop'
            );

            thenCount++;
          })
          .catch((err) => catchError(err))
        ;

        store
          .delay3(3)
          .then((ret) => {
            let spyArgs = onDelay3Spy.firstCall.args[0];
            let {v1, v2, delay1, delay2, delay3, delay4} = spyArgs.nextState;
            let state = spyArgs.state;

            test
              .number(ret)
                .isIdenticalTo(3)
                .isIdenticalTo(spyArgs.payload)
            ;

            // the payload received by arguments in the handler (reducer)
            assert(
              v1 && delay1 && delay2 && !delay3 && !delay4 && !v2,
              'delay3: payload received by the handler'
            );

            // the state when the action handler was executed
            assert(
              state.v1
              && state.delay1
              && state.delay2
              && !state.delay3
              && !state.delay4
              && !state.v2,
              'delay3: get the values of the current event loop'
            );

            thenCount++;
          })
          .catch((err) => catchError(err))
        ;

        store
          .delay4(4)
          .then((ret) => {
            let spyArgs = onDelay4Spy.firstCall.args[0];
            let {v1, v2, delay1, delay2, delay3, delay4} = spyArgs.nextState;
            let state = spyArgs.state;

            test
              .number(ret)
                .isIdenticalTo(4)
                .isIdenticalTo(spyArgs.payload)
            ;

            // the payload received by arguments in the handler (reducer)
            assert(
              v1 && delay1 && delay2 && delay3 && !delay4 && !v2,
              'delay4: payload received by the handler'
            );

            // the state when the action handler was executed
            assert(
              state.v1
              && state.delay1
              && state.delay2
              && state.delay3
              && !state.delay4
              && !state.v2,
              'delay4: get the values of the current event loop'
            );

            thenCount++;
          })
          .catch((err) => catchError(err))
        ;

        store
          .v2()
          .then((ret) => {
            let spyArgs = onV2Spy.firstCall.args[0];
            let {v1, v2, delay1, delay2, delay3, delay4} = spyArgs.nextState;
            let state = spyArgs.state;

            test
              .undefined(ret)
              .undefined(spyArgs.payload)
            ;

            // the payload received by arguments in the handler (reducer)
            assert(
              v1 && delay1 && delay2 && delay3 && delay4 && !v2,
              'v2: payload received by the handler'
            );

            // the state when the action handler was executed
            assert(
              state.v1
              && state.delay1
              && state.delay2
              && state.delay3
              && state.delay4
              && !state.v2,
              'v2: get the values of the current event loop'
            );

            thenCount++;
          })
          .catch((err) => catchError(err))
        ;

        test.wait(100, function() {
          assert(thenCount === 6, 'All then() functions was called');

          test
            .object(store.getState())
              .is({
                v1: true,
                delay1: true,
                delay2: true,
                delay3: true,
                delay4: true,
                v2: true
              })

            .object(store.getPrevState())
              .is({
                v1: true,
                delay1: true,
                delay2: true,
                delay3: true,
                delay4: true
              })
          ;

          done();
        });
      });
    });
  });
});
