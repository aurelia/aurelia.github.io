+++
title = "Aurelia 2 Update - Alpha 33"
authors = ["bigopon"]
description = "New official plugin, testing tool improvement, event handling, hmr and lifecycle hooks."
date = 2022-06-01T01:19:15.317Z
lastmod = 2022-06-01T01:19:15.317Z
+++

Since the last v2 update, the focus of the Aurelia team has been around the prepartion for beta, with testing tools improvement, better ergonomic in common templating use cases. Belows are the highlights of the features/improvements over the last few alpha versions.

## Alpha 33

The new [State plugin](https://docs.aurelia.io/developer-guides/state) has been published and is ready to use and collect feedback. This is the intended to be the successor of the [v1 store plugin](http://aurelia.io/docs/plugins/store). With this plugin, template bindings can be connected to the singleton state via a simple `.state` binding command, or `& state` binding behavior:

```html
<input value.state="keywords">
<p>Keywords in app state is: ${keywords & state}</p>
```

Mutation request can now also be done directly from the template, with a `.dispatch` binding command:
```html
<input value.state="keywords" input.dispatch="{ type: 'keywords', params: [$event.target.value] }">
```

Connecting templates to the global state isn't always the case, sometimes it's desirable to connect a view model property to the global state too, and the `@fromState` decorator can be used to simplify the task:

```ts
import { fromState } from '@aurelia/state';

export class SearchAutoSuggest {
  @fromState(state => state.keywords)
  keywords
}
```

With these tools, it is anticipated that applications employing singleton or v1 store like patterns will be able to greatly simplify their code, reducing a good amount of boilerplate.

## Alpha 32

In this release, first core templating lifecycle hook `created` support is added. It is now simple to have shared logic that hooks into component `created` lifecycle:
```ts
import { lifecycleHooks } from 'aurelia';

@lifecycleHooks
export class CreatedHook {
  created(viewModel, controller) {
    ...
  }
}
```

Beside this, `hydrating` and `hydrated` support also follows in [alpha 33](#alpha-33), and hooking into them is similar to `created` lifecycle:
```ts
import { lifecycleHooks } from 'aurelia';

@lifecycleHooks
export class HydratingHook {
  hydrating(viewModel, controller) {
    ...
  }
}

@lifecycleHooks
export class HydratedHook {
  hydrated(viewModel, controller) {
    ...
  }
}
```

It is also fine to combine all hooks into a single class:
```ts
@lifecycleHooks
export class LoggingHook {
  created(viewModel, controller) {
    console.log({ viewModel, controller })
  }
  hydrating(viewModel, controller) {
    console.log({ viewModel, controller })
  }
  hydrated(viewModel, controller) {
    console.log({ viewModel, controller })
  }
}
```

## Alpha 31

A new builder pattern added, assertion methods of a test fixture are returned together with other properties, makeing it a lot simpler, less boilerplate-y to write tests. This will be improved more in a near future with many of  helpers/shortcuts to make Aurelia application test authoring a pleasure experience.

## Alpha 30

With a view model that looks like this
```ts
export class MyButton {
  onClick(event) {
    ...
  }
}
```
In the template of this, it's sometimes desirable to have
```html
<button click.trigger="onClick">
```
rather than
```html
<button click.trigger="onClick($event)">
```

Thanks to [brandonseydel](https://github.com/brandonseydel), it is now possible to write event handler like the former.

Another awesome contribution from Brandon in this release is Hot Module Reload (HMR). Support for HMR has also been added for webpack, HMR now works for all aurelia component including HTML only elements.

## Until next time

Thank you to everyone for their continued support, especially those who have contributed to Aurelia 2 and helped get it to its current point. If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u).