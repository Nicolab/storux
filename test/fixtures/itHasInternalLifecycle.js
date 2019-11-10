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
const Evemit = require('evemit');

/**
 * Tests case:
 * it has internal lifecycle.
 *
 * @param  {Storux} storux Storux instance.
 * @param  {Store|string} store  Store instance or store name
 * @return {UnitJs}
 */
module.exports = function itHasInternalLifecycle(storux, store) {
  store = typeof store === 'string' ? storux.stores[store] : store;

  return test
    .object(storux._lc)
      // FIXME: .isInstanceOf(Evemit)

    .object(store.scope._lc)
      .isIdenticalTo(storux.stores[store.scope.displayName].scope._lc)
      // FIXME: .isInstanceOf(Evemit)

    .object(store.scope._lc.events)
      .isIdenticalTo(storux.stores[store.scope.displayName].scope._lc.events)
      .isNotIdenticalTo(storux._lc.events)
  ;
};
