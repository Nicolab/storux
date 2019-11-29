# Hooks

The hooks are a way more grained to handle the store state. This is a powerful feature of Storux inspired by the Flux pattern and the functionnal programming.

Some stores libraries like _Redux_ use this pattern.
Storux offer a way more simple and productive to use this pattern. Without declaring useless longs lists of annoying boilerplate, constants, actions, reducers...

```js
class MyStore extends Store {
  /**
   * An action that dispatches some data (payload).
   */
  @action('someAction')
  someAction() {
    this._dispatch({is: 'simple'});
  }

  /**
   * Handle the state when `someAction()` is called.
   *
   * @param {object} ns The next state.
   * @param {object} payload The payload dispatched by the action.
   * @return {object} The next state.
   */
  @hook('someAction')
  onSomeAction(ns, payload) {
    ns.is = 'very' + payload.is;
    ns.date = Date.now();

    return ns;
  }
}
```

Voilà! It's simple and productive, that's all we need to create a <del>reducer</del> hook 😉

A hook can be attached on one or several actions (reuse your hooks if you want). Hooks offer many possibilities 🚀

## Another way (useful from external)

In the following example we used a decorator. Storux makes it possible to create a hook programmatically.

See the example bellow:

```js
class MyStore extends Store {
  constructor(opt) {
    super(opt);

    this.someAction.hooks.push(this.onSomeAction);
    anotherStore.otherAction.hooks.push(this.onSomeAction);
  }

  /**
   * An action that dispatches some data (payload).
   */
  @action('someAction')
  someAction() {
    this._dispatch({is: 'simple'});
  }

  /**
   * Handle the state when `someAction()` is called.
   * Also this hook handle `anotherStore.otherAction()`.
   *
   * @param {object} ns The next state.
   * @param {object} payload The payload dispatched by the action.
   * @return {object} The next state.
   */
  onSomeAction(ns, payload) {
    ns.is = 'very' + payload.is;
    ns.date = Date.now();

    return ns;
  }
}
```

Here, the hook `onSomeAction()` handle the state of `MyStore` when `someAction()` is executed, and `AnotherStore` when `AnotherStore.otherAction()` is executed.

Be careful though, too much store interconnected (strong coupling) by hooks will make they difficult to maintain (spaghettis).

Depending on the case of interconnection. It may be more relevant to use the lifecycle with `Storux.after()` (or `Storux.before()`), that does not impact the state of the other store (light coupling).

> 💡 __Learn more__
>
> * [Actions](actions.md)
> * [Lifecycle](lifecycle.md)

## Summary

The [store state](state.md), [actions](actions.md) and hooks system are the main mechanisms to assimilate in order to effectively manage the state of an application.

At this point, you only have to [explore the lifecycle in the next chapter](lifecycle.md) to take full advantage of the benefits that Storux brings 🚀
