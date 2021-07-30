# Server Side Rendering (SSR)

The most common use case for server-side rendering is to handle the initial render when a user (or search engine crawler) first requests our app.

## Storux on the server

When using server rendering, we must also send the state of our app along in our response, so the client can use it as the initial state. This is important because we want the client to have access to the data preloaded by the server.

On the client side, a new Storux store will be created and initialized with the state provided from the server.

There are several ways to provide the initial data. A common one is to serialize the object generated by the server into a JSON string or by using a more secure serializer like in this example below.

Below a simplified example by defining it in a global property in the HTML response.

Server side:

```js
// ssr.js
import serialize from 'serialize-javascript';

function renderPage(html, initialData) {
  return `
    <html>
      <body>
        ${html}
      </body>
      <script>
        window.__INITIAL_STATE_FOR_MY_STORE__ = ${serialize(initialData)};
      </script>
      <script src="bundle.js"></script>
    </html>
  `;
}

export default function myController(req, res) {
  const initialData = {foo: 'Foo', bar: 'Bar'};
  const html = '<p>Some HTML inline or rendered from a template engine.</p>';
  req.send(renderPage(html, initialData));
}
```

Front side (2 examples):

1 - Inline, on the fly:

```js
// MyStore class
class MyStore extends Store {}

// Create myStore
const myStore = storux.create(MyStore, {
  initialState: window.__INITIAL_STATE_FOR_MY_STORE__
});

delete window.__INITIAL_STATE_FOR_MY_STORE__;

console.log(myStore.getState());
```

2 - In the constructor:

```js
// MyStore class
class MyStore extends Store {
  constructor(opt) {
    super(opt);

    this.scope.initialState = window.__INITIAL_STATE_FOR_MY_STORE__;

    delete window.__INITIAL_STATE_FOR_MY_STORE__;
  }
}

// Create myStore
const myStore = storux.create(MyStore);

console.log(myStore.getState());
```

And there you have it 😃