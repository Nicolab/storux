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
const {Storux, Store, Scope} = require('../src/');
const storux = new Storux();
const EmptyStore = require('./fixtures/EmptyStore');

// tests case
const itHasInternalLifecycle = require('./fixtures/itHasInternalLifecycle');
let emptyStore = storux.createStore(EmptyStore);

describe('Store class', function() {
  it('get the scope of the store', function() {
    test
      .object(emptyStore)
        .isInstanceOf(Store)

      .object(emptyStore.scope)
        .isInstanceOf(Scope)
    ;
  });

  it('has an internal lifecycle', function() {
    itHasInternalLifecycle(storux, storux.stores.emptyStore);
  });
});
