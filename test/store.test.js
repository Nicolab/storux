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
const {Storux, Store, Scope} = require('storux');
const storux = new Storux();
const EmptyStore = require('./fixtures/EmptyStore');

// tests case
const itHasInternalLifecycle = require('./fixtures/itHasInternalLifecycle');
let emptyStore = storux.create(EmptyStore);

describe('Store class', function() {
  it('get the scope of the store', function() {
    test
      .object(emptyStore)
        .isInstanceOf(Store)
        .isInstanceOf(storux.Store)

      .object(emptyStore.scope)
        .isInstanceOf(Scope)
        .isInstanceOf(EmptyStore.Scope)
        .isIdenticalTo(storux.stores.emptyStore.scope)
    ;
  });

  it('display resolved store name', function() {
    test
      .string(emptyStore.scope.displayName)
        .isIdenticalTo('emptyStore')
    ;
  });

  it('display custom store name', function() {
    class FooStore extends Store {
      get displayName() {
        return 'wsStore';
      }
    }

    class BarStore extends Store {
      static displayName = 'bStore';
    }

    let fooStore = storux.create(FooStore);
    let barStore = storux.create(BarStore);

    test
      .string(fooStore.scope.displayName)
        .isIdenticalTo('wsStore')

      .string(barStore.scope.displayName)
        .isIdenticalTo('bStore')
    ;
  });

  it('has an internal lifecycle', function() {
    itHasInternalLifecycle(storux, storux.stores.emptyStore);
  });

  it('has methods and properties', function() {
    test
      .object(emptyStore)
        .hasProperty('scope')
        .hasProperty('_mount', undefined)

      .function(emptyStore.getState)
      .function(emptyStore.setState)
      .function(emptyStore.replaceState)
      .function(emptyStore._dispatch)
      .function(emptyStore._save)
    ;
  });
});
