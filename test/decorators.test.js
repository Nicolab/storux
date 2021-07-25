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
const {Storux, Store, action, hook} = require('storux');

describe('Decorators', function() {
  describe('action()', function() {
    it('mount decorated function as an action', function() {
      class FooStore extends Store {
        constructor(opt) {
          super(opt);

          this.scope.initialState = {count: 0};
        }

        @action('a1')
        a1(num) {
          return this._save({count: this.getState().count + num});
        }

        @action('a2')
        a(num) {
          this._dispatch(num);
          return num + 1;
        }
      }

      let _storux = new Storux();
      let fooStore = _storux.create(FooStore);

      fooStore.a1(1).then((hasChanged) => {
        test
          .bool(hasChanged)
            .isTrue()

          .number(fooStore.getState().count)
            .isIdenticalTo(1)
        ;
      });

      fooStore.a1(2).then((hasChanged) => {
        test
          .bool(hasChanged)
            .isTrue()

          .object(fooStore.getState())
            .is({count: 3})
        ;
      });

      test.undefined(fooStore.a);

      fooStore.a2(10).then((num) => {
        test
          .number(num)
            .isIdenticalTo(11)

          .object(fooStore.getState())
            // last state
            .is({count: 3})
        ;
      });
    });
  });

  describe('hook()', function() {
    it('push decorated function to the specified hooks', function() {
      class FooStore extends Store {
        constructor(opt) {
          super(opt);

          this.scope.initialState = {count: 0};
        }

        @action('a1')
        a1() {
          return this._dispatch(1);
        }

        @hook('a1')
        onA1(ns, num) {
          ns.count += num;
          return ns;
        }
      }

      let _storux = new Storux();
      let fooStore = _storux.create(FooStore);

      fooStore.a1().then((hasChanged) => {
        test
          .bool(hasChanged)
            .isTrue()

          .number(fooStore.getState().count)
            .isIdenticalTo(1)
        ;
      });

      fooStore.a1().then((hasChanged) => {
        test
          .bool(hasChanged)
            .isTrue()

          .object(fooStore.getState())
            .is({count: 2})
        ;
      });
    });
  });
});

