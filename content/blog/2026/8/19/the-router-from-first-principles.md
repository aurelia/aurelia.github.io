+++
title = "The Aurelia Router From First Principles"
authors = ["Dwayne Charrington"]
description = "Navigate from /users/1 to /users/2 and Aurelia throws your component away and builds a new one. Here's why: how the router turns a URL into a route tree, how viewports claim components, the order the hooks run in, and how transition plans decide what gets reused."
date = 2026-08-19T08:00:00+10:00
lastmod = 2026-08-19T08:00:00+10:00
tags = ["aurelia2", "router"]
toc = true
+++

Put a counter in a routed component's constructor, then navigate from `/users/1` to `/users/2`. The counter goes up. Same component, same viewport, and Aurelia still tore down the old instance and built a new one. Now set `transitionPlan: 'none'` on that route and try again. The URL changes, and the page keeps saying user 1.

Neither of those is a bug. The router makes a decision for every viewport on every navigation, and once you can see the pieces it's working with, the decision is easy to predict. This post builds those pieces up from the URL, using `@aurelia/router` as of RC.2.

## From a URL to a route tree

Here's the configuration the rest of the post uses. A user shell with two child routes, under an app with one:

```typescript
import { customElement } from 'aurelia';
import { route } from '@aurelia/router';

@customElement({ name: 'user-profile', template: 'profile' })
class UserProfile {}

@customElement({ name: 'user-posts', template: 'posts' })
class UserPosts {}

@route({
  routes: [
    { path: '', component: UserProfile },
    { path: 'posts', component: UserPosts },
  ],
})
@customElement({
  name: 'user-shell',
  template: 'shell[<au-viewport></au-viewport>]',
})
class UserShell {}

@route({ routes: [{ path: 'users/:id', component: UserShell }] })
@customElement({ name: 'my-app', template: '<au-viewport></au-viewport>' })
export class MyApp {}
```

When you call `router.load('users/1/posts')`, or click `<a load="users/1/posts">`, the string is parsed into a tree of viewport instructions. `/` means child, `+` means sibling, and `@name` targets a viewport. The router then turns those instructions into a `RouteTree`, which is a tree of `RouteNode`s. Each node records a component, the params it matched, the viewport it goes into, and its children. You can read the current one from `IRouter`:

```text
my-app
  user-shell    params={"id":"1"}  viewport=default
    user-posts  params={}          viewport=default
```

The root node is your app component. The router reads its route config and viewports but never loads it or calls its hooks.

What's less obvious is how the tree gets built. `MyApp`'s routes only know about `users/:id`. The router matches that against `users/1/posts`, and the leftover `posts` is stored on the node as residue. Nothing can recognize `posts` yet, because the routes that understand it belong to `UserShell`, and `UserShell` doesn't exist yet. The child node is added only after the shell has been created and has run its `loading` hook. You can see that in the hook order for a first navigation:

```text
user-shell  canLoad
user-shell  loading
user-posts  canLoad
user-posts  loading
user-posts  loaded
user-shell  loaded
```

So a child's `canLoad` can't veto the parent before the parent's `loading` runs. If a guard needs to protect a whole section, put it on the section's shell, not on each child.

One more property of the tree: every navigation describes all of it. If the page shows `a+b` and you navigate to `a`, the second viewport is emptied and `b` is unloaded. Nothing is kept unless the new instructions ask for it.

## Route contexts and viewports

Every routed component gets a `RouteContext`, which holds the component's child routes and a child DI container of its own.

When an `<au-viewport>` is created, it registers itself with the nearest context as a `ViewportAgent`. The viewport in `UserShell`'s template therefore belongs to the shell's context and can only show the shell's child routes. The viewport in `MyApp` belongs to the root context. The page's nesting of viewports is the route tree's nesting.

Inside one context, a node is matched to a viewport by name. An `<au-viewport>` without a `name` is called `default`. A request without a viewport name is also `default`, and it takes the first viewport that hasn't already been claimed in this navigation, named or not. A request with a name only goes to a viewport with that name. Given this template:

```html
<au-viewport name="main"></au-viewport>
<au-viewport name="side"></au-viewport>
```

and a route `{ path: 'help', component: HelpPanel, viewport: 'side' }`, navigating to `a+help` puts `a` in `main` (it was first and free) and `help` in `side`. The `viewport` in the route config is only a default, though. An explicit `help@main` in the instruction wins, and puts the help panel in `main`.

Unnamed sibling viewports are filled by position, and that affects reuse. With two unnamed viewports showing `a+b`, navigating to `b+a` doesn't swap the two existing components. Each viewport sees a different component than before, so both are destroyed and rebuilt. If siblings move around, give the viewports names and target them with `@`.

## The transition, phase by phase

Once the new tree is known, every viewport agent with something to change runs through the same phases. Here's the full log for `users/1/posts` to `users/2/posts`, where both components get replaced:

```text
user-posts #1  canUnload
user-shell #1  canUnload
user-shell #2  canLoad
user-posts #1  unloading
user-shell #1  unloading
user-shell #2  loading
user-posts #2  canLoad
user-posts #2  loading
user-posts #2  loaded
user-shell #2  loaded
```

The rule is that leaving runs bottom-up and arriving runs top-down. `canUnload` asks the deepest components first, then their parents. `canLoad` and `loading` start at the top. `unloading` goes bottom-up again. Then the views are swapped, so the old instances detach and the new ones attach, and `loaded` runs last, children before parents. Again, `user-posts #2` only shows up after `user-shell #2` has loaded, because it's residue until then.

There's a detail in the order that surprises people. The new component is constructed before its `canLoad` runs, because `canLoad` is a method on the instance. A guard that returns `false` still costs you a constructor call:

```typescript
@customElement({ name: 'locked-page', template: 'Locked' })
class LockedPage {
  constructor() { console.log('constructed'); }
  canLoad() { return false; }
}

await router.load('locked'); // logs 'constructed', returns false
```

Keep constructors cheap and do the real work in `loading`, which doesn't run until the component's own `canLoad` has passed.

## Transition plans

Every phase above is about a viewport whose component changes. The interesting case is a viewport that will show the same component it's already showing, with different input. That's what transition plans decide. The logic lives in two places, `ViewportAgent._scheduleUpdate` and `RouteConfig._getTransitionPlan`, and it's short enough to paraphrase in full:

```typescript
// viewport-agent.ts and route.ts, simplified
if (current === null || current.component !== next.component) {
  plan = 'replace';
} else if (navigationOptions.transitionPlan != null) {
  plan = navigationOptions.transitionPlan;
} else if (samePath(current, next) && shallowEquals(current.params, next.params)) {
  plan = 'none';
} else {
  const configured = routeConfig.transitionPlan ?? 'replace';
  plan = typeof configured === 'function' ? configured(current, next) : configured;
}
```

A different component always gets `replace`, and nothing can change that. For the same component, a plan passed to `router.load` wins. After that, an identical path with identical params is always `none`. Only then does the route's configured plan get a say, and the default is `replace`.

Here's what each plan does when navigating between `users/1`, `users/2`, and `users/2?tab=x`, with a component that counts its instances and logs its hooks:

| Navigation | default / `replace` | `invoke-lifecycles` | `none` |
|---|---|---|---|
| `users/1` to `users/2` | New instance, all hooks | Same instance, router hooks only | Nothing, still shows user 1 |
| `users/2` to `users/2` | Nothing | Nothing | Nothing |
| `users/2` to `users/2?tab=x` | Nothing | Nothing | Nothing |

### replace

`replace` treats the same component as if it were a different one. The old instance runs `canUnload` and `unloading` and is detached and disposed. A new one is constructed and runs `canLoad`, `loading`, `attached` and `loaded`. Anything held on the instance is gone: form input, scroll position inside the component, open subscriptions, cached data.

That's the default because it's the least surprising behavior. A component that only reads its params in `loading`, or worse in the constructor or `binding`, still shows the right user. Aurelia 1 and earlier Aurelia 2 builds defaulted to `invoke-lifecycles`. People kept finding stale state from the previous record, so the default was changed.

### invoke-lifecycles

`invoke-lifecycles` keeps the instance and runs the router hooks on it again:

```text
canUnload #1 | canLoad #1 2 | unloading #1 | loading #1 2 | loaded #1 2
```

There's no `detaching` and no `attached` in that list. The view stays in the DOM, and so does everything the component created. That's the point of the plan: a map, a rich text editor, or a big grid that takes a second to set up can just fetch the next record in `loading`.

The catch is that only router hooks run. Code in `binding`, `bound` or `attached` that depends on the current route won't run again, so move it into `loading`. You also have to reset anything that belonged to the previous record yourself.

### none

`none` skips everything. No hooks run and the instance keeps whatever params it had, which is how you end up looking at user 1 at the URL `/users/2`. Configuring it on a route only makes sense for a component that doesn't care about its params at all, or one that watches the route itself through `ICurrentRoute`. In practice you'll rarely set it. You'll meet it as the plan the router picks when nothing changed.

### Query strings don't count

Look at the comparison again: path and params. The query string isn't part of it. So `search?tab=a` to `search?tab=b` resolves to `none`, even on a route configured with `invoke-lifecycles`, and `loading` doesn't run. The URL changes, and the component isn't told.

There are two ways to react. `ICurrentRoute` is updated after every navigation, and its `query` is replaced rather than mutated, so a binding to it will update:

```typescript
import { customElement, resolve } from 'aurelia';
import { ICurrentRoute } from '@aurelia/router';

@customElement({
  name: 'search-page',
  template: `Tab: \${currentRoute.query.get('tab')}`,
})
export class SearchPage {
  readonly currentRoute = resolve(ICurrentRoute);
}
```

Or ask for the hooks when you navigate. A plan passed to `load` is checked before the identical-path rule, so this runs `loading` on the existing instance:

```typescript
await router.load('search?tab=b', { transitionPlan: 'invoke-lifecycles' });
```

The same override works the other way. `router.load('users/2', { transitionPlan: 'replace' })` while already on `users/2` builds a fresh instance, which is a reasonable way to implement a reset button.

### Choosing per navigation with a function

`transitionPlan` also takes a function that receives the current and next `RouteNode` and returns a plan. A user editor is a good fit. Moving between existing users can keep the editor and reload its data, but moving to or from the new-user form should start clean:

```typescript
import { customElement } from 'aurelia';
import { route, Params, RouteNode } from '@aurelia/router';

@customElement({ name: 'user-editor', template: '...' })
class UserEditor {
  id = '';
  loading(params: Params) {
    this.id = params.id!;
  }
}

@route({
  routes: [
    {
      path: 'users/:id',
      component: UserEditor,
      transitionPlan: (current: RouteNode, next: RouteNode) =>
        current.params.id === 'new' || next.params.id === 'new'
          ? 'replace'
          : 'invoke-lifecycles',
    },
  ],
})
@customElement({ name: 'my-app', template: '<au-viewport></au-viewport>' })
export class MyApp {}
```

`users/1` to `users/2` reuses the editor. `users/2` to `users/new` builds a new one, and so does `users/new` to `users/3`. The function is only consulted when the component is the same and the path or params differ. It's never called for a navigation to the exact same route, so you can't use it to force a reload there.

### Where the plan comes from

From strongest to weakest:

1. `transitionPlan` in the options passed to `router.load`.
2. `transitionPlan` on the route config entry.
3. A static `transitionPlan` on the component class.
4. The parent route's `transitionPlan`, which children inherit.
5. `replace`.

Inheritance means `@route({ transitionPlan: 'invoke-lifecycles', routes: [...] })` on your app switches every route below it. That's convenient, and it's also how you end up with a component that never resets and nobody remembers why.

## Nested routes and reuse

Plans are decided per viewport, which explains some of the nested results.

From `users/1` to `users/1/posts`, the shell's path and params are unchanged, so its plan is `none`. Only the shell's own viewport changes, from `user-profile` to `user-posts`, and since that's a different component it's a `replace`. The shell keeps its instance and its state.

From `users/1/posts` to `users/2/posts`, the shell's `id` changes, so with the default plan the shell is replaced. `user-posts` is replaced too, even though nothing about it changed. It lived in the old shell's context and viewport, and those went away with the old shell.

Make the parent `invoke-lifecycles` and the result changes. In a setup like `items/:id/d/:x`, going from `items/1/d/2` to `items/2/d/2` runs `loading` on the shell and nothing at all on the child, because the child's own path and params are identical. If the child reads anything that came from its parent's params, it won't find out the parent moved on. Either keep that data on the parent and bind it down, or leave the parent on `replace`.

## Picking a plan

Stay on `replace` unless you can name what it costs you. Most route components fetch some data and render it, and building a new one is cheap and guaranteed to be clean. Switch a route to `invoke-lifecycles` when the component is expensive to create or holds DOM state the user would notice losing. When you do, put all of the route-dependent setup in `loading`. Use a function when only some transitions should keep the instance. Leave `none` to the router.

If you hit a navigation that doesn't do what this model predicts, `viewport-agent.ts` in `packages/router/src` is where every one of these decisions is made. Or bring it to [Discord](https://discord.gg/TPV3cvCZhz).
