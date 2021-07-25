# Core concepts

> ℹ️ This documentation is in progress.

## Store and Scope

ℹ️ __Good to know__

* The store is where you manage the state of your application.
* The scope of the store is responsible for its internal functioning, you do not have to worry about that.

To not pollute the scope of a store, all methods related to state processing are in the scope property of the store (`myStore.scope`).

To improve productivity, the most used methods can be accessed directly as store methods.

Here is the list of shortcuts:

| Store | Scope |
|:-----|:-----|
| `this.getState()` | `this.scope.getState()` |
| `this.setState()` | `this.scope.setState()` |
| `this.replaceState()` | `this.scope.replaceState()` |
| `this._dispatch()` | `this.scope.dispatch()` |
| `this._save()` | `this.scope.save()` |

## Flux pattern

The Flux pattern was primarily promoted by React.js. You can discover more about the [Flux pattern in the React.js documentation](https://facebook.github.io/flux/docs/in-depth-overview/).

This chapter is not intended to learn the Flux pattern. A short explanation (taken from the doc of React.js), the data in a Flux application flows in a single direction:

![Flux Pattern](assets/img/flux-simple-f8-diagram-1300w.png)

> This structure allows us to reason easily about our application in a way that is reminiscent of functional reactive programming, or more specifically data-flow programming or flow-based programming, where data flows through the application in a single direction — there are no two-way bindings. Application state is maintained only in the stores, allowing the different parts of the application to remain highly decoupled. Where dependencies do occur between stores, they are kept in a strict hierarchy, with synchronous updates managed by the dispatcher.
 -- <cite>From React.js documentation</cite>

![Flux Pattern](assets/img/flux-simple-f8-diagram-explained-1300w.png)

When you use the actions in Storux, you use the Flux pattern. Storux manages this for you 💪

### Actions

* [Actions](actions.md)

> TODO

### Actions and hooks

* [Actions](actions.md)
* [Hooks](hooks.md)

> TODO

### Create a store that has actions

> TODO

### Create a store that has actions and hooks

> TODO