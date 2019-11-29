# Actions

> ℹ️ TODO: This documentation is in progress.

The actions are a way more precise to handle the state of a store. This is a powerful feature of Storux inspired by the Flux pattern.

In the Flux pattern the actions are the conventional way of interacting with the state of a store.

The actions are executed one by one, in the order of call. Even if the previous action is longer than the next one, the actions are put on hold in a queue. The next action is called only when the first dispatched, that all hooks (if there are) have finished their treatments on the state.

![Flux Pattern](assets/img/flux-simple-f8-diagram-explained-1300w.png)

_Flux pattern (from the [React.js documentation](https://facebook.github.io/flux/docs/in-depth-overview/))._

The definition of an action in a store is made easy with Storux.

Storux offers 2 ways, choice with a function or a decorator.

## Create actions with a function

Short example with 3 actions:

```js
// myStore.js

let {Storux, Store} = require('storux');
let storux = require('./path/to/storuxInstance');

class MyStore extends Store {
  constructor(opt) {
    super(opt);

    this.scope.initialState: {
      user: null,
      err: null,
      counter: 0,
    };

    // mount 3 actions
    this.scope.mountActions({
      count: this.count,
      fetchUser: this.fetchUser,
      createUser: this.createUser,
    });
  }

  /**
   * Action: Increment the counter.
   *
   * @return {Promise} Resolve the new counter value.
   */
  count() {
    let counter = this.getState().count + 1;

    this._save({counter});
    return counter;
  }

  /**
   * Action: Fetch an user by ID.
   *
   * @param {string} id User ID.
   * @return {Promise} Resolve the user.
   */
  fetchUser(id) {
    return axios
      .get('/user/' + id)
      .then((res) => this._save({user: res.data}))
      .catch((err) => this._save({user: null, err}));
  }

  /**
   * Action: Create an user.
   *
   * @param {string} user User data.
   * @return {Promise} Resolve the newest user.
   */
  createUser(user) {
    return axios
      .post('/user', user)
      .then((res) => this._save({user: res.data}))
      .catch((err) => this._save({user: null, err}));
  }
}
```

## Create actions with a decorator

The same with the decorator `@action`.

```js
// myStore.js

let {Storux, Store, action} = require('storux');
let storux = require('./path/to/storuxInstance');

class MyStore extends Store {
  constructor(opt) {
    super(opt);

    this.scope.initialState: {
      user: null,
      err: null,
      counter: 0,
    };
  }

  /**
   * Action: Increment the counter.
   *
   * @return {Promise} Resolve the new counter value.
   */
  @action('count')
  count() {
    let counter = this.getState().count + 1;

    this._save({counter});
    return counter;
  }

  /**
   * Action: Fetch an user by ID.
   *
   * @param {string} id User ID.
   * @return {Promise} Resolve the user.
   */
  @action('fetchUser')
  fetchUser(id) {
    return axios
      .get('/user/' + id)
      .then((res) => this._save({user: res.data}))
      .catch((err) => this._save({user: null, err}));
  }

  /**
   * Action: Create an user.
   *
   * @param {string} user User data.
   * @return {Promise} Resolve the newest user.
   */
  @action('createUser')
  createUser(user) {
    return axios
      .post('/user', user)
      .then((res) => this._save({user: res.data}))
      .catch((err) => this._save({user: null, err}));
  }
}
```

## CRUD with actions

Below an implementation proposal to request an API server.

> TODO: Doc in progress

## Summary

At this point, you've successfully learned the [core concepts](core-concepts.md), the behavior of the [store state](state.md) and created the store actions with 2 different flavors.

Further we will see the events to interact with the lifecycle of the actions and states in Storux.

The [next chapter explores the hooks](hooks.md), a useful complement to the actions to manipulate the store's state.
