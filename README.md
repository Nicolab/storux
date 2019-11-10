# Storux

<div align="center">
  <img with="120" alt="Storux" src="/doc/assets/img/storux.png" />
</div>

Easy and powerful state store (Flux implementation) using actions, listeners and reducers (optional).
Storux is a state store manager, to manage the state of an application (Website, App mobile, Web App, ...).

You can manage the entire state of your project with a single store
or separate the state into many specific stores (authStore, articleStore, commentStore, appStore, ...).

Storux's philosophy is to be easy to use and productive. Powerful and makes life easier for the front developer.

Take advantage of the possibilities and __Enjoy!__

## Install

With NPM:

```sh
npm install storux --save
```

or with Yarn:

```sh
yarn add storux
```

## Usage

> 💡 __Recommended__
> Take a quick tour in the doc: [Learn Storux](/doc).

Quick example:

```js
// myStore.js

let {Storux, action, hook} = require('storux');
let storux = new Storux();

class MyStore extends storux.Store {
  constructor(opt) {
    super(opt);

    this
      .scope
      // helpers that generate some actions
      .ensureActions(
        'fetchDone',
        'fetchFail'
      )
    ;

    this.scope.initialState = {
      count: 0,
      data: null,
      err: null,
    };
  }

  /**
   * Add a number to the counter.
   *
   * @param {number} num
   * @return {Promise} Promise that resolve the new counter value.
   */
  @action('add')
  add(num) {
    let state = this.getState();
    let count = state.count + num;

    this._save({count});

    return count;
  }

  /**
   * Fetch a resource.
   *
   * @param {string} id Resource ID.
   * @return {Promise} Resolve the resource data.
   */
  @action('fetch')
  fetch(id) {
    this._dispatch(id);

    // like axios and other HTTP lib
    return http
      .get('/some-resource/' + id)
      .then((res) => this.fetchDone(res.data))
      .catch(this.fetchFail)
    ;
  }

  /**
   * FetchDone() handler.
   *
   * @param {object} ns The next state.
   * @param {object} data Some data.
   * @return {object} Returns the next state.
   */
  @hook('fetchDone')
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
  @hook('fetchFail')
  onFetchFail(ns, err) {
    ns.data = null;
    ns.error = err;

    return ns;
  }
}

export default storux.create(MyStore);
```

And use the this store:

```js
// app.js

import myStore from './stores/myStore';

myStore.fetch('db-id-xyz').then((data) => {
  console.log('data: ', data);
});

myStore.add(42).then((count) => {
  console.log('count: ', count);
});

// It's more relevant to use the lifecycle, like "listen()" and "unlisten()".
// Example for render the state in a UI component.
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

> 💡 Take a quick tour in the doc: [Learn Storux](doc) (recommended).

## LICENSE

[MIT](https://github.com/Nicolab/storux/blob/master/LICENSE) (c) 2016, Nicolas Tallefourtane.

## Author

| [![Nicolas Tallefourtane - Nicolab.net](https://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](https://nicolab.net) |
|---|
| [Nicolas Talle](https://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |

## Contributors

Thanks to [Irwin lourtet](https://github.com/ilourt) for the feedback.
