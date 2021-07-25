# Decorators

Storux decorators can define functions as [action](actions.md) or [hook](hooks.md).
The use of decorators is optional, it is just an awesome syntactic sugar 🦄

```js
// myStore.js

import {Storux, Store, action, hook} from 'storux';
import storux from './path/to/your/storuxInstance';

class MyStore extends Store {
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

## @action('actionName')

> Like `this.scope.mountAction('actionName', this.actionName)`

The method on which this annotation is placed, becomes an [action](actions.md).
The name in string allows to retrieve the action and its name even with the minified code (UglifyJS, etc).

## @hook('actionName')

> Like `this.actionName.push(this.onActionName)`

The method on which this annotation is placed, becomes a [hook](hooks.md).

## Troubleshooting

### VScode Linter

If this Linter error (below) occurred in VScode:

> Experimental support for decorators is a feature that is subject to change in a future release. Set the `experimentalDecorators` option to remove this warning.

Open the VScode settings `CTRL+,`: _File -> Preferences -> Settings_
Search and enable:
`javascript.implicitProjectConfig.experimentalDecorators`
