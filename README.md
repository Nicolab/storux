# Storux

ES6 Flux implementation using actions, listeners and reducers.

## Install

```sh
npm install storux --save
```

or

```sh
yarn add storux
```

## Usage

> TODO: doc


_MyStore.js_

```js
let {Storux} = require('storux');
let storux = new Storux();

class MyStore extends storux.Store {
  constructor(opt) {
    super(opt);

    this
      .scope

      // helpers that generate some actions
      .generateActions(
        'fetchDone',
        'fetchFail'
      )

      // mount all actions of the store
      .mountActions()

      // automatically bind all actions handlers.
      // Resolved by the naming convention: on<Action> or handle<Action>
      .bindActions(this)
    ;
  }

  fetch(dispatch, resourceId) {
    dispatch(resourceId);

    // like axios and other HTTP lib
    return http
      .get('/some-resource/' + resourceId)
      .then((res) => this.fetchDone(res.data))
      .catch(this.fetchFail)
    ;
  }

  /**
   * Fetch() handler.
   *
   * @param {object} ns The next state.
   * @param {string} resourceId A given resource id.
   * @return {object} Returns the next state.
   */
  onFetch(ns, resourceId) {
    console.log('onFetch ' + resourceId);
    return ns;
  }

  /**
   * FetchDone() handler.
   *
   * @param {object} ns The next state.
   * @param {object} data Some data.
   * @return {object} Returns the next state.
   */
  onFetchDone(ns, data) {
    ns.data = data;
    return ns;
  }

  /**
   * FetchFail() handler.
   *
   * @param {object} ns The next state.
   * @param {Error} err Error instance.
   * @return {object} Returns the next state.
   */
  onFetchFail(ns, err) {
    ns.data = null;
    ns.error = err;
    return ns;
  }
}

// universal way (isomorphic)
module.exports = storux.createStore(MyStore);
```

Also, each store is accessible via the `Storux` instance that was used to create it.
Example, the new instance of `MyStore` is accessible via `storux.stores.myStore`.

The store name is the class name with the first letter lowercased.
You can customize the store name if needed, example:

```js
// WebSocket store
class WSStore extends storux.Store {
  get displayName() {
    return 'wsStore';
  }

  // ...
}
```

### Lifecycle
#### Storux Lifecycle
##### createStore
##### createStore.<store name>
##### beforeActions
##### afterActions
##### beforeAction.<action name>
##### afterAction.<action name>

#### Store Lifecycle

##### init
##### resetState
##### listen
##### unlisten
##### beforeAction.<action name>
##### afterAction.<action name>


## LICENSE

[MIT](https://github.com/Nicolab/storux/blob/master/LICENSE) (c) 2016, Nicolas Tallefourtane.


## Author

| [![Nicolas Tallefourtane - Nicolab.net](https://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](https://nicolab.net) |
|---|
| [Nicolas Talle](https://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |


## Contributors

Thanks to [Irwin lourtet](https://github.com/ilourt) for the feedback.
