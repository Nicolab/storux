# Storux

ES6 Flux implementation inspired by _Alt.js_ and _Redux_.

> In progress, not ready for prod.

## Install

```sh
npm install storux --save
```

## Usage

TODO: doc


_MyStore.js_

```js
let {Storux, Store} = require('storux');
let storux = new Storux();

class MyStore extends Store {
  constructor(opt) {
    super(opt);

    this
      .scope
      .generateActions(
        'fetchDone',
        'fetchFail'
      )
      .mountActions()
      .bindActions(this)
    ;
  }

  fetch(dispatch, resourceId) {
    dispatch();

    return http
      .get('/some-resource/' + resourceId)
      .then((data) => this.fetchDone(data))
      .catch((err) => this.fetchFail(data))
    ;
  }

  onFetchDone(data, {nextState}) {
    nextState.data = data;
    return nextState;
  }

  onFetchFail(err) {
    nextState.data = null;
    nextState.error = err;
    return nextState;
  }
}

// isomorphic way
module.exports = storux.createStore(MyStore);
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

| [![Nicolas Tallefourtane - Nicolab.net](http://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](http://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |


## Contributors

Thanks to [Irwin lourtet](https://github.com/pezioz) for the feedback.