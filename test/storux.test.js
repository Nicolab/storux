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
const EmptyStore = require('./fixtures/EmptyStore');

// tests case
const itHasInternalLifecycle = require('./fixtures/itHasInternalLifecycle');


/*----------------------------------------------------------------------------*\
  Fixtures
\*----------------------------------------------------------------------------*/

class InstanceStore extends Store {}
class Instance2Store extends Store {}

//----------------------------------------------------------------------------//


describe('Storux', function() {
  it('has an internal lifecycle', function() {
    itHasInternalLifecycle(storux, storux.create(EmptyStore));
  });

  it('should have the Store class accessible via storux.Store and Storux.Store', function() {
    test
      .function(Store)
        .isIdenticalTo(Storux.Store)
        .isIdenticalTo(storux.Store)
    ;
  });

  describe('Create store', function() {
    let instanceStore, instance2Store;

    it('should be an instance of Store with a certain structure', function() {
      instanceStore = storux.create(InstanceStore);

      test
        .object(instanceStore)
          .isInstanceOf(Store)
          .isInstanceOf(storux.Store)
          .isIdenticalTo(storux.stores.instanceStore)

        .object(instanceStore.scope)
          .hasProperty('displayName', 'instanceStore')
          .hasNotProperty('state')

        .object(instanceStore.scope.store)
          .isInstanceOf(Store)
          .isInstanceOf(storux.Store)
          .isIdenticalTo(instanceStore)
          .isIdenticalTo(storux.stores.instanceStore)
      ;
    });

    it('should create another store', function() {
      instance2Store = storux.create(Instance2Store);

      test
        .object(instance2Store)
          .isInstanceOf(Store)
          .isInstanceOf(storux.Store)
          .isIdenticalTo(storux.stores.instance2Store)

        .object(instance2Store.scope)
          .hasProperty('displayName', 'instance2Store')
          .hasNotProperty('state')

        .object(instance2Store.scope.store)
          .isInstanceOf(Store)
          .isInstanceOf(storux.Store)
          .isIdenticalTo(instance2Store)
          .isIdenticalTo(storux.stores.instance2Store)
      ;
    });

    it('should retrieve all stores', function() {
      test
        .object(storux.stores)
          .hasProperty('emptyStore')
          .hasProperty('instanceStore', instanceStore)
          .hasProperty('instance2Store', instance2Store)
          .hasLength(3)
      ;
    });

    it('can\'t create a store if is not an instance of the Store class', function() {
      function BadStore() {}

      test
        .bool(Storux.isStore(BadStore))
          .isFalse()

        .exception(function() {
          storux.create(BadStore);
        })
          .isInstanceOf(TypeError)
          .hasMessage(/`store` argument must be an instance of `Store`$/)

      ;
    });

    it('can\'t create a store if an identical store name is already created', function() {
      test
        .exception(function() {
          storux.create(InstanceStore);
        })
          .isInstanceOf(Error)
          .hasMessage(
            'The store `instanceStore` is already defined'
            + ' in the `Storux` instance.'
          )
      ;
    });

    it('remove after creation the properties used only to create the store', function() {
      class TestStore extends Store {
      }

      let testStore = storux.create(TestStore);
      let scopePropsToRemove = [
        '_createActionProxy',
        '_generateActions',
        'ensureActions',
        'ensureSaveActions',
        'mountAction',
        'mountActions'
      ];

      test
        .array(Storux.removeScopePropsAfterCreation)
          .is(scopePropsToRemove)

        .number(Storux.removeScopePropsAfterCreation.length)
          .isIdenticalTo(scopePropsToRemove.length)
      ;

      Storux.removeScopePropsAfterCreation.map((prop) => {
        test.undefined(testStore.scope[prop]);
      });
    });
  });
});
