# Getting started

In general, this documentation assumes that you’re reading it in sequence from front to back. Later chapters build on concepts in earlier chapters, and earlier chapters might not delve into details on a topic; we typically revisit the topic in a later chapter.

To take full advantage of the documentation and learn quickly Storux, it is recommended to test the examples as and when. Do not be a mere spectator!

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

Storux supports _ESM_ (ES Module / `import`), _CJS_ (CommonJS / `require`) and _UMD_ (Universal Module Definition).
So Storux can be imported from _ESM_ and _CJS_, ...

### Create the Storux instance

The `Storux` instance is like a container of stores.

```js
import {Storux} from 'storux';
// or const {Storux} = require('storux');

const storux = new Storux();

export default storux;
```

All the stores created with `storux` are accessible with `storux.stores`.

Example:

```js
import {Store} from 'storux';
// or const {Store} = require('storux');

class AppStore extends Store {}
class AuthStore extends Store {}
class BlogStore extends Store {}

const appStore = storux.create(AppStore);
const authStore = storux.create(AuthStore);
const blogStore = storux.create(BlogStore);

console.log(storux.stores);

appStore.setState({name: 'My awesome Web App'});

console.log('from Storux instance:', storux.stores.appStore.getState());
console.log('from AppStore instance:', appStore.getState());
```

Thanks to the instance of Storux, you can listen to the events of all stores.

> We will discuss it later in the documentation, in the chapter [lifecycle](lifecycle.md).

## Summary

At this point, you've successfully installed Storux, created the `storux` instance with your first stores.
Congratulations!

Further we will see the methods and patterns to interact with the state.

The [next chapter explores the core concepts](core-concepts.md), an essential chapter to understand Storux.
