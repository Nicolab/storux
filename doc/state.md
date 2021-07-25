# State

The state is a immutable object. Whenever the state is changed, a new object is created to kill the references of the old state object. This behavior avoids side effects difficult to debug.
The shallow copy of the state is the same way you would with _Redux_ and other state manager.

To avoid mistakes and to make a clone every time the state is getted with `getState()`, a clone of the state is returned (shallow copy). The state is cloned at the first level of keys.

This allows the developer to finely manage what must be cloned and the references that must be preserved.
A good compromise between performance and reliability of the data (mainly with the big deep object).

Example, consider this state:

```js
// myStore.getState();

{
  level1: {
    level2: {
      level3: 'level 3'
    },
    level2Bis: 'level 2 bis'
  },
  level1Bis: 'foo'
}
```

In this example:

* `level1` and `level1Bis` are a cloned.
* `level2` and his children are not cloned.

If you want to clone the children, you can use: `myStore.scope.clone()`, example:

```js
let obj = {
  level1: myStore.scope.clone({
    level2: {
      level3: 'level 3'
    },
    level2Bis: 'level 2 bis'
  }),
  level1Bis: 'foo'
};

myStore.setState(obj);
```

Or unreference each levels like this:

```js
let obj = {
  level1: {
    ...{
      level2: {
        ...{
          level3: 'level 3'
        }
      },
      level2Bis: 'level 2 bis'
    }
  },
  level1Bis: 'foo'
};

myStore.setState(obj);
```

Or use a helper like the _Lodash_ function `_.cloneDeep()`:

```js
let obj = {
  level1: _.cloneDeep({
    level2: {
      level3: 'level 3
    },
    level2Bis: 'level 2 bis'
  }),
  level1Bis: 'foo'
};

myStore.setState(obj);
```

Be careful to the performance with the deep copy, it is not always necessary.
What must be remembered is that each method of Storux interacting with the state, creates a shallow copy of the concerned object.

## Usage

### Shortcuts

All methods related to state processing are in the scope property of the store (`myStore.scope`).

To improve productivity, the most used methods can be accessed directly as store methods. See the list in [Store & Scope](/doc/core-concepts.md#store-and-scope).

### Initial state

When a store is created, an initial state may be defined in 2 ways.

> ✨ `InitialState` can also be used for the server-side rendering ([SSR](ssr.md)).

1 - Inline, on the fly:

```js
// MyStore class
class MyStore extends Store {}

// Create myStore
const myStore = storux.create(MyStore, {
  initialState: {foo: 'Foo', bar: 'Bar'}
});

console.log(myStore.getState());
```

2 - In the constructor:

```js
// MyStore class
class MyStore extends Store {
  constructor(opt) {
    super(opt);

    this.scope.initialState = {foo: 'Foo', bar: 'Bar'};
  }
}

// Create myStore
const myStore = storux.create(MyStore);

console.log(myStore.getState());
```

When the store is [reseted](#reset-state) or [recycled](#recycle-the-store), the state is redefined with the values of the initial state.

### Get state

* `myStore.scope.getState()` get a clone of the state.

### Set state

* `myStore.scope.setState(obj)` performs a shallow merge of `obj` into current state of the store. `obj` is merged with the existing state.

### Replace state

* `myStore.scope.replaceState(nextState)` like `setState()` but replace all state by `nextState`.

### Reset state

* `myStore.scope.resetState()` reset the state to the initial state.

### Recycle the store

* `myStore.scope.recycle()` recycle the store.

Like `resetState()` but emits the `init` event to restore the initial state of the store (not only the state values).

* Reset the state to the initial state.
* Emit `init` event, with one argument `hasChanged`.

```js
myStore.scope.on('init', function(hasChanged) {
  // if first "init"
  if (typeof hasChanged === 'undefined') {
    console.log('first init');
    return;
  }

  // recycled
  console.log('recycled, state changed? ', hasChanged);
});

myStore.scope.recycle();
```

### Lifecycle

All the state changes can be listened to (`listen` and `unlisten`).
See the [scope lifecycle](lifecycle.md#scope-lifecycle).
