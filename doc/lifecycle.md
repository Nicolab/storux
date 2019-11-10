# Lifecycle

> ℹ️ TODO: This documentation is in progress.

## Storux Lifecycle

### create

Emitted each time any store is created.

### create.\<store name>

Emitted once when a specific store (store name) is created.

### before

Emitted each time (before) any action is called.

### after

Emitted each time (after) any action is called.

### before.\<action name>

Emitted each time (before) a specific action (action name) is called.

### after.\<action name>

Emitted each time (after) a specific action (action name) is called.

---

## Scope Lifecycle

### init

Emitted when the store is initialized.
Without argument when the store is created and whith one argument when the store is recycled.

Into a store:

```js
this.scope.on('init', function() {
  console.log('store initialization');
});
```

Outside the store:

```js
myStore.scope.on('init', function() {
  console.log('store initialization');
});
```

Take care that when the store is recycled (with `Store.scope.recycle()`),
the listener receives one argument `hasChanged` (boolean).

```js
myStore.scope.on('init', function(hasChanged) {
  // if first "init"
  if (typeof hasChanged === 'undefined') {
    console.log('first init, it\'s a creation!');
    return;
  }

  // recycled
  console.log('recycling the store! State changed? ', hasChanged);
});

myStore.scope.recycle();
```

> 💡 __Tips__
>
> If you want to handle some things when the state is initialized (created and/or recycled) by copying `Store.scope.initialState`,
> this event is the one you need.
>
> If you want to handle some things only when the store is created (before or after the creation),
> use `Storux.before()` or `Storux.after()`, it's more appropriate.

### resetState

Emitted without argument, when the store is reseted to the initial state.
If the state is unchanged (equal to the initial state), this event is not emitted for nothing.

```js
myStore.scope.on('resetState', function() {
  console.log('the store is reseted to the initial state');
});

// add some things in the store
myStore.setState({foo: 'bar'});

// reset the store state
myStore.scope.resetState();
```

### listen

Listen all state changes.

```js
myStore.scope.listen(function(store) {
  console.log('state updated:', store.getState());
});
```

### unlisten

Remove a state listener attached with `Store.scope.listen()`.

```js
function onMyStoreChange(store) {
  console.log('state updated:', store.getState());
}

// listen all myStore changes
myStore.scope.listen(onMyStoreChange);

// update the state
myStore.setState({hello: 'world'});

// remove the listener
myStore.scope.unlisten(onMyStoreChange);
```

Another way to listen and unlisten the state changes:

```js
// listen all myStore changes
let unlistenMyStore = myStore.scope.listen(function(store) {
  console.log('state updated:', store.getState());
});

// update the state
myStore.setState({hello: 'world'});

// remove the listener
myStore.scope.unlisten(unlistenMyStore);
```
