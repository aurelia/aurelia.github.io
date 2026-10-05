+++
title = "Aurelia 2 RC.1 and RC.2: What You Missed"
authors = ["Dwayne Charrington"]
description = "Two release candidates shipped this year without a blog post. Eager route loading, IContextRouter, Vite 8 support, reactive destructuring in repeat.for, and nearly 40 changes in total."
date = 2026-10-05T08:00:00+10:00
lastmod = 2026-10-05T08:00:00+10:00
tags = ["aurelia2", "release", "rc"]
+++

Aurelia 2 RC.1 came out on 13 March and RC.2 on 2 August, and we never blogged about either. If you only follow Aurelia through this blog, you could be forgiven for thinking nothing has happened since [the first release candidate](/blog/2026/1/14/aurelia-2-release-candidate/) in January. Plenty has. Between them, the two releases carry nearly 40 changelog entries, and RC.2 is now the `latest` tag on npm, so a fresh `npm install aurelia` already gets you everything below.

This post is the catch-up. Most of the work went into the router, so that's where we'll start.

## Router

### Deep links to nested routes, fixed with eager loading

This was one of the oldest open router issues ([#2273](https://github.com/aurelia/aurelia/issues/2273)). Say a parent route has the paths `parent` and `parent/:id`, and it has a child route at `child`. A user pastes `/parent/child` into the address bar. The router only knows about the parent at that point, so it matches `child` as the value of `:id` and the child route never loads.

RC.1 adds eager loading ([#2355](https://github.com/aurelia/aurelia/pull/2355)). Turn it on and the router builds the full routing table when the app starts:

```typescript
RouterConfiguration.customize({
  useEagerLoading: true,
})
```

With the whole table available up front, `parent/child` and `parent/:id/child` are separate entries and the ambiguity goes away.

There is one catch. Because every path ends up in a single table, empty-path child routes clash with their parents. Give the child a real path and use the viewport's `default` instead:

```diff
  @route({
    routes: [
-     { path: ['', 'child'], component: ChildComponent },
+     { path: ['child'], component: ChildComponent },
    ]
  })
- @customElement({ name: 'routed-component', template: `<au-viewport></au-viewport>` })
+ @customElement({ name: 'routed-component', template: `<au-viewport default="child"></au-viewport>` })
  export class RoutedComponent {}
```

Eager loading is off by default. If deep links into nested routes work fine for you today, you don't need it.

### `IContextRouter`

If your components are full of `router.load(path, { context: this.routeContext })`, this one is for you. `IContextRouter` ([#2368](https://github.com/aurelia/aurelia/pull/2368)) wraps the router together with the component's current route context, so every `load()` call resolves relative to where the component lives:

```typescript
import { resolve } from '@aurelia/kernel';
import { IContextRouter } from '@aurelia/router';

export class OrderDetails {
  private readonly router = resolve(IContextRouter);

  async showLine(id: string) {
    await this.router.load(`lines/${id}`);
  }

  async backToSummary() {
    await this.router.load('../summary');
  }
}
```

In your root component, inject it with `resolve(lazy(IContextRouter))` instead (`lazy` also comes from `@aurelia/kernel`).

### Path syntax that works like a file system

The rules for paths passed to `load()` are now consistent ([#2369](https://github.com/aurelia/aurelia/pull/2369)), and if you've ever used a terminal, they'll look familiar:

- `/path` is absolute, from the root of the app.
- `path` and `./path` are relative to the current routing context.
- `../path` goes up one routing context. Each extra `../` goes up another level.

The same change makes an explicit `transitionPlan` passed to `load()` actually stick, which someone reported on Discord:

```typescript
this.router.load('test', { transitionPlan: 'replace' });
```

### Dynamic route titles

RC.2 makes `RouteNode.title` writable ([#2427](https://github.com/aurelia/aurelia/pull/2427)). That means a lifecycle hook can set the title from data it has just loaded, and the router still composes the document title from the route tree as usual:

```typescript
async loading(params, next) {
  this.user = await this.users.get(params.id);
  next.title = `User: ${this.user.name}`;
}
```

This works in `canLoad`, `loading` and `loaded`. It's also the better option compared to setting `document.title` yourself, which happens outside the router and can be overwritten on the next navigation.

### The rest of the router fixes

RC.2 fixed a long list of router bugs. A few that might have bitten you:

- Cold-start deep links to child routes under an empty-path parent no longer report an unknown route ([#2418](https://github.com/aurelia/aurelia/pull/2418)).
- A base path like `/app` is no longer stripped from the start of `/apple` ([#2443](https://github.com/aurelia/aurelia/pull/2443)).
- Hash-based routing can navigate to an empty-path root route ([#2396](https://github.com/aurelia/aurelia/pull/2396)).
- Routed content renders through `<au-viewport containerless>`, including nested containerless viewports ([#2413](https://github.com/aurelia/aurelia/pull/2413)).
- Encoded parameters in child routes (spaces, symbols, Unicode) are handled correctly ([#2401](https://github.com/aurelia/aurelia/pull/2401)).
- Returning `false` from `canUnload` restores the route context properly ([#2431](https://github.com/aurelia/aurelia/pull/2431)).
- Object-form route configs keep a component's static `nav` value ([#2441](https://github.com/aurelia/aurelia/pull/2441)).
- In RC.1, the `load` attribute generates the right `href` when combined with `as-element` ([#2391](https://github.com/aurelia/aurelia/pull/2391)).

## Templates and binding

### Destructuring in `repeat.for` stays in sync

Object destructuring in repeaters is now reactive ([#2448](https://github.com/aurelia/aurelia/pull/2448)):

```html
<div repeat.for="{ id: orderId, items } of orders">
  Order #${orderId}: ${items.length} items
</div>
```

Change `items` on one of those orders and the row updates. The locals are one-way, so assigning to `orderId` in the template won't write back to the order. Only shallow patterns and aliases are supported. Nested patterns like `{ customer: { name } }`, default values and rest properties throw `AUR0177`, which tells you what to do instead. For anything more complicated, `order of orders` still works exactly as it always has.

### `@computed` on methods (experimental)

You could already put `@computed` on getters. RC.1 lets you put it on methods too ([#2382](https://github.com/aurelia/aurelia/pull/2382)), which helps when a template calls something like `matches(product)` and you want control over what it tracks:

```typescript
import { computed } from 'aurelia';

export class ProductList {
  filter = '';
  products: Product[] = [];

  @computed('filter')
  matches(product: Product) {
    return product.name.includes(this.filter);
  }
}
```

Tracking only kicks in when the method is called from a binding or another computed. A normal call from your own code behaves like any other method. Passing `deps: []` turns tracking off for that method entirely. This one is marked experimental, so the syntax could still change before 2.0 final.

### Batching `au-compose` updates

If you change `component` and `model` on an `<au-compose>` at the same time, it can call `activate` twice. Setting `flush-mode="async"` ([#2376](https://github.com/aurelia/aurelia/pull/2376)) batches both changes into one update:

```html
<au-compose
  component.bind="currentComponent"
  model.bind="currentModel"
  flush-mode="async">
</au-compose>
```

The default is still `sync`, so nothing changes unless you opt in.

### `gap` for `virtual-repeat`

RC.2 adds a `gap` option to `virtual-repeat` ([#2409](https://github.com/aurelia/aurelia/pull/2409)). Before this, if your rows had a margin, you had to add it to `item-height` and keep the two numbers in step yourself. Now you can describe them separately:

```html
<div virtual-repeat.for="item of items; item-height: 48; gap: 12"
     style="height: 48px; margin-bottom: 12px;">
  ${item.name}
</div>
```

It works for horizontal lists as well.

### Smaller fixes worth knowing about

- `:z` keyboard modifiers now work. Z was the one letter missing from the default key mappings ([#2445](https://github.com/aurelia/aurelia/pull/2445)).
- Underscores in `<let>` targets are no longer camel-cased ([#2446](https://github.com/aurelia/aurelia/pull/2446)).
- `virtual-repeat` now picks up mutations when the collection goes through a value converter or binding behavior ([#2410](https://github.com/aurelia/aurelia/pull/2410)).
- Deep computed observation no longer blows the stack on cyclic object graphs ([#2442](https://github.com/aurelia/aurelia/pull/2442)).
- `IObservation.watch` with `immediate: false` skips the first callback as intended, instead of not observing at all ([#2377](https://github.com/aurelia/aurelia/pull/2377)).
- In development builds, Aurelia now warns when it spots a component that renders itself with no guard, so you get a hint before the maximum call stack error ([#2361](https://github.com/aurelia/aurelia/pull/2361)).

## Tooling

### Vite 8

`@aurelia/vite-plugin` now supports Vite 8 as well as Vite 7 ([#2449](https://github.com/aurelia/aurelia/pull/2449)). Vite 8 uses Oxc to transform code, and the plugin compiles standard decorators before Oxc sees them. That covers your own decorators, the ones Aurelia conventions add, web workers, HMR and SSR builds. For a typical app there's nothing to configure.

There is one requirement. Your `tsconfig.json` must not enable `experimentalDecorators` or `emitDecoratorMetadata`, because those switch TypeScript to the old decorator pipeline. If you have decorated code outside `src/`, add it with the `standardDecoratorInclude` option.

### TypeScript 6

Convention preprocessing now supports TypeScript 6 and still works with TypeScript 5 ([#2447](https://github.com/aurelia/aurelia/pull/2447)). Aurelia's tooling can also sit alongside the TypeScript 7 CLI without either getting in the other's way.

### Vite build fixes

- Builds with a custom `--mode` (anything other than `production`) were dropping compiled templates, including templates for lazy-loaded routes. That's fixed ([#2417](https://github.com/aurelia/aurelia/pull/2417)).
- Development mode no longer adds a global `development` export condition that could change how your other dependencies resolve ([#2419](https://github.com/aurelia/aurelia/pull/2419)).
- On Windows, a drive letter in a different case (`C:` vs `c:`) no longer causes source files to be skipped ([#2420](https://github.com/aurelia/aurelia/pull/2420)).
- HMR keeps component state across several edits in a row ([#2378](https://github.com/aurelia/aurelia/pull/2378)).

## Deprecations and removals

The built-in `email` validation rule is deprecated ([#2387](https://github.com/aurelia/aurelia/pull/2387)). It still works for now. The problem is the pattern behind it, which doesn't follow the email address standards (RFC 5322 and RFC 6532). The first version of the change removed the rule outright. It became a deprecation instead so existing apps keep working. If you depend on it, plan to replace it with a custom rule that uses a proper email address parser.

The `define` lifecycle hook is gone from the public types and the docs ([#2444](https://github.com/aurelia/aurelia/pull/2444)). The runtime stopped calling it a while ago, so if your code still has a `define` method, it was already doing nothing.

## Upgrading

RC.2 is the `latest` tag on npm:

```bash
npm install aurelia@latest
```

Make sure any `@aurelia/*` packages you depend on directly are on `2.0.0-rc.2` as well.

Neither release was meant to break anything, but check two things when you upgrade:

- The path syntax cleanup in RC.1 is worth a quick check if your app uses relative `router.load()` calls.
- If you move to Vite 8, check your `tsconfig.json` for `experimentalDecorators`.

## Contributors

Thanks to everyone who contributed code or docs to RC.1 and RC.2:

- [@fkleuver](https://github.com/fkleuver)
- [@bigopon](https://github.com/bigopon)
- [@Sayan751](https://github.com/Sayan751)
- [@Vheissu](https://github.com/Vheissu)
- [@davidsk](https://github.com/davidsk)
- [@krushnamegh](https://github.com/krushnamegh)
- [@JamBalaya56562](https://github.com/JamBalaya56562)

## Full changelogs

- [RC.0 to RC.1](https://github.com/aurelia/aurelia/compare/v2.0.0-rc.0...v2.0.0-rc.1)
- [RC.1 to RC.2](https://github.com/aurelia/aurelia/compare/v2.0.0-rc.1...v2.0.0-rc.2)

The next release is already taking shape on master, including `else if` chains. We'll write about that one when it ships, not seven months later. If anything here breaks for you, come and tell us on [Discord](https://discord.gg/TPV3cvCZhz).
