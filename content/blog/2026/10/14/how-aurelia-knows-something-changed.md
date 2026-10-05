+++
title = "How Aurelia Knows Something Changed"
authors = ["Dwayne Charrington"]
description = "Aurelia 2 doesn't diff your view model or run a digest loop. It swaps properties for getters and setters, tracks getters with a proxy, patches collection methods, and falls back to polling only when it has no other choice. Here's how each piece works, and the changes it can't see."
date = 2026-10-14T08:00:00+10:00
lastmod = 2026-10-14T08:00:00+10:00
tags = ["aurelia2", "internals"]
toc = true
+++

You write `this.name = 'Dwayne'` in a plain class with no decorators, no base class and no `setState`, and the page updates. There's no digest loop running in the background and no virtual DOM being diffed. Aurelia found out about that assignment the moment it happened. It does that with a handful of mechanisms, and the same mechanisms explain every binding that refuses to update.

This post walks through each one, using the `@aurelia/runtime` source as the map, and finishes with the changes Aurelia can't see and what to do about them.

## The first read

Take this template:

```html
<p>${user.nickname}</p>
```

When the binding behind `${user.nickname}` is bound, it evaluates the expression once to get the initial value. Evaluation doesn't just return a value, though. Every time it reads a property (`user` from the view model, then `nickname` from `user`), it asks for an observer for that object and key and subscribes to it.

Those observers come from `IObserverLocator`, and almost all of the interesting decisions live in its `createObserver` method. In order, it checks:

1. Is the target a DOM node? Then `runtime-html` supplies an observer that listens to events, such as `input` and `change` for a text box's `value`.
2. Is it `length` on an array, `size` on a Map or Set, or a numeric index on an array? Then it gets a collection observer.
3. Does the property have a getter? Then it gets a computed observer, or a dirty checker if the getter can't be replaced. Both are covered below.
4. Anything else, which is nearly every property you'll ever bind to, gets a `SetterObserver`.

## Getters and setters on plain properties

A `SetterObserver` does one thing. The first time something subscribes, it reads the current value and replaces the property with a getter and setter pair:

```typescript
// Simplified from setter-observer.ts
start() {
  this._value = this._obj[this._key];
  Object.defineProperty(this._obj, this._key, {
    enumerable: true,
    configurable: true,
    get: () => this._value,
    set: (value) => this.setValue(value),
  });
}

setValue(newValue) {
  if (Object.is(newValue, this._value)) return;
  const oldValue = this._value;
  this._value = newValue;
  this.subs.notify(newValue, oldValue);
}
```

That's the whole trick behind plain class observation. After the binding is set up, `user.nickname` is no longer a data property. If you inspect it, you'll find `get` and `set` where `value` used to be:

```typescript
Object.getOwnPropertyDescriptor(user, 'nickname');
// { get: f, set: f, enumerable: true, configurable: true }
```

A few things follow from this:

- **The property doesn't need to exist yet.** If `user` has no `nickname` when the template binds, the observer installs the accessor anyway, and a later `user.nickname = 'Dee'` updates the page.
- **Only the properties a binding reads are touched.** The rest of the object is left alone, and nothing is wrapped up front.
- **Setting the same value does nothing.** The comparison is `Object.is`, so assigning an identical string or the same object reference won't notify anyone.
- **Your object is never replaced.** The binding holds the same `user` you created, so code outside Aurelia that keeps a reference to it sees the same object and goes through the same setter.

## Setting a value doesn't touch the DOM right away

Notification is synchronous. When the setter runs, every subscriber hears about it before the assignment returns. The DOM write is not:

```typescript
component.user.nickname = 'Dee';
appHost.querySelector('p').textContent; // still the old value

await tasksSettled();
appHost.querySelector('p').textContent; // 'Dee'
```

Bindings that write to the DOM (text content, attributes, element properties, `class` and `style`) queue their update with `queueTask` instead of writing straight away. Each binding queues itself once, so ten assignments in a row produce one DOM write with the final value. Bindings into a custom element's bindable are not DOM writes, so they pass the value through immediately, and the child's `nameChanged` callback runs synchronously.

The delay is why tests `await tasksSettled()` (from `@aurelia/runtime`) after changing state. It's also why reading layout straight after an assignment gives you stale numbers.

## Getters: tracking with a proxy

Getters can't be handled the same way. There's no value to intercept, only a function, and Aurelia can't know what it depends on until it runs it. So that's what it does:

```typescript
export class TodoList {
  todos = [
    { title: 'Write post', done: false },
    { title: 'Publish post', done: false },
  ];

  get doneCount() {
    return this.todos.filter(t => t.done).length;
  }
}
```

```html
<p>${doneCount} done</p>
```

When the binding reads `doneCount`, the observer locator finds a getter on the prototype and creates a `ComputedObserver`. That observer calls your getter with `this` set to a proxy of your view model, and the proxy records every property read while the getter runs:

- `this.todos` subscribes to `todos` on the view model, and returns the array wrapped in a proxy too.
- `.filter(...)` on the wrapped array subscribes to the array as a collection, and hands each item to your callback wrapped as well.
- `t.done` subscribes to `done` on each todo.

Change any of those (`this.todos = []`, `todos.push(...)`, `todos[0].done = true`) and the getter runs again.

The proxy only collects dependencies. It has no `set` trap, and it isn't the thing that notices changes. When you write `todos[0].done = true`, that assignment hits the getter and setter that a `SetterObserver` installed on the real todo object, exactly as in the previous section. The proxy is only there to find out which properties need those observers.

Dependencies are collected fresh on every run, and anything the latest run didn't read is unsubscribed. That keeps branches cheap:

```typescript
get visible() {
  return this.showAll ? this.todos : this.todos.filter(t => !t.done);
}
```

While `showAll` is true, this getter doesn't subscribe to each todo's `done`, because the last run never read it.

The proxy wraps plain objects, arrays, Maps and Sets. It doesn't wrap Dates, or anything else whose internal state lives in slots rather than properties, and that comes up again later. If you need control instead of auto-tracking, `@computed` takes explicit dependencies, `deep`, and a `flush` option for when the getter recomputes. That's a post of its own.

## Collections: patched methods and index maps

Assigning a new array to `this.items` goes through a setter like anything else. `this.items.push(x)` doesn't assign anything, so the setter never runs.

For this, Aurelia patches the mutating methods on `Array.prototype`: `push`, `pop`, `shift`, `unshift`, `splice`, `reverse` and `sort`. It does the same for `set`, `delete` and `clear` on `Map.prototype`, and `add`, `delete` and `clear` on `Set.prototype`. Patching happens once, the first time any collection is observed. Each patched method looks up the array in a `WeakMap` of observed collections. If it isn't there, the native method runs and nothing else happens, so arrays your templates never touch pay for one map lookup.

When the array is observed, the patched method does the mutation itself and records an index map as it goes: for each position in the new array, which position it came from, or a marker meaning the item is new, plus a list of deleted indices. `repeat.for` uses that map to move, add and remove the existing DOM nodes instead of rendering the list again. That's why sorting a list of a thousand items in place moves nodes rather than recreating them.

Templates can also call read-only array methods and stay up to date:

```html
<p if.bind="selectedIds.includes(item.id)">Selected</p>
<p>${items.filter(i => i.done).length} done</p>
```

When an expression calls `includes`, `filter`, `map`, `find`, `some`, `every`, `slice`, `join`, `reduce` or the other read-only array methods, the binding subscribes to the array itself, so a later `push` updates it.

Maps and Sets don't get that treatment in templates. `${scores.get('a')}` and `${tags.has('x')}` show the right value when they bind, then never change, even after `scores.set('a', 5)`. `${scores.size}` and `repeat.for="[key, value] of scores"` do update. For lookups, use a getter. Inside a getter, the proxy tracks `get` and `has` properly:

```typescript
get scoreA() {
  return this.scores.get('a');
}
```

## Method calls in templates

Getters are tracked. Ordinary methods called from a template aren't:

```typescript
export class Profile {
  first = 'Dwayne';
  last = 'Charrington';

  fullName() {
    return `${this.first} ${this.last}`;
  }
}
```

```html
<p>${fullName()}</p>
```

This renders correctly, then stays that way forever. The binding observes the method's arguments, and there aren't any. It doesn't run the method under a proxy, so it has no idea that `first` and `last` matter. You have three ways out:

- Turn it into a getter, if it takes no arguments.
- Pass what it depends on: `${fullName(first, last)}`. Arguments are ordinary expressions and are observed.
- Decorate it with `@computed`. Since RC.1, `@computed` works on methods, and a decorated method called from a template is tracked the same way a getter is.

```typescript
import { computed } from 'aurelia';

export class Profile {
  first = 'Dwayne';
  last = 'Charrington';

  @computed
  fullName() {
    return `${this.first} ${this.last}`;
  }
}
```

Event handlers like `click.trigger="save()"` aren't affected by any of this. They run when the event fires, not when data changes.

## Dirty checking, the last resort

There's one case where Aurelia can neither install a setter nor safely replace a getter: an accessor that isn't configurable. The computed observer works by redefining the property, and `Object.defineProperty` refuses to touch a non-configurable one. With nothing to hook into, the observer locator hands the property to the dirty checker.

The dirty checker polls. It keeps a list of these properties and compares each one against its last known value on a timer, roughly every 100ms in a foreground tab. Background tabs throttle timers, so checks there are much less frequent. A change shows up late, and every dirty-checked property costs a read per check whether or not anything changed.

You rarely create one on purpose, but they turn up. `Object.defineProperty` defaults `configurable` to `false`, so a getter defined without spelling it out ends up dirty checked:

```typescript
Object.defineProperty(Account.prototype, 'balance', {
  get() { return this.credits - this.debits; },
  // configurable: true is missing, so this property gets dirty checked
});
```

Class getters are configurable, so `get balance()` in a class body is fine. Libraries that define their own accessors are the more common source.

To find them, turn on the `throw` setting during development:

```typescript
import { DirtyCheckSettings } from '@aurelia/runtime';

DirtyCheckSettings.throw = true;
```

Now any binding that would fall back to polling throws instead:

```
AUR0218: Dirty checked is not permitted in this application. Property key balance is being dirty checked.
```

`DirtyCheckSettings` also has `timeoutsPerCheck` to change the polling rate, and `disabled` to stop polling entirely. Disabling it means those properties are simply never updated, which is worse than slow.

## The changes Aurelia can't see

Everything above depends on a change going through a setter or a patched method. Anything that doesn't is invisible.

**Writing to an array index or `length` from your code.** `this.items[0] = 'z'` and `this.items.length = 0` are native operations on the array. Aurelia doesn't use a proxy on your arrays outside of getters, so it never hears about them, and neither the repeat nor `${items[0]}` updates. Use `splice`:

```typescript
this.items.splice(0, 1, 'z');            // replace the first item
this.items.splice(0, this.items.length); // clear
```

This matters for more than one stale value. After `items.length = 0`, the repeat still has views for the old items. The next real mutation hands it an index map that doesn't match what it rendered, and it throws `AUR0814` (number of views != number of items). `fill` and `copyWithin` aren't patched either, so they have the same problem.

Expressions in the template are a different story. `click.trigger="items[0] = 'z'"` goes through Aurelia's expression evaluator, which notifies the array observer itself, so that works.

**Mutating a Date.** `due.setDate(15)` changes the Date's internal slot, not a property, so nothing is listening. Build a new Date and assign it:

```typescript
const due = new Date(this.due);
due.setDate(15);
this.due = due;
```

**Deleting a property.** `delete user.nickname` removes the accessor the `SetterObserver` installed. Assign `user.nickname` later and you get a plain data property again, and the binding never hears about it. Set it to `undefined` or `null` instead.

**Reading `#private` fields in a getter.** A tracked getter runs with `this` set to a proxy, and JavaScript doesn't allow reading a private field through a proxy. A getter that returns `this.#count` fails with `Cannot read private member #count from an object whose class did not declare it`. Use TypeScript's `private` keyword for state a template depends on. It's only a type check and doesn't change the runtime object.

**State outside your objects.** A value read from `localStorage`, a module-level variable, or anything a third-party library keeps in a closure doesn't have a property Aurelia can attach to. Copy it onto your view model when it changes, usually from the library's own event or callback.

## Reacting in code

Bindings aren't the only things that can subscribe. A few tools give your own code a way in:

- `@observable` on a field installs the getter and setter when the instance is created, not when a binding first reads the property, and calls a `fieldNameChanged(newValue, oldValue)` method on every change. It works whether or not anything in a template is bound to the field.
- `@watch` runs a callback when an expression or a function's dependencies change. The function form is tracked by the same proxy getters use.
- `IObserverLocator` gives you the observers directly, through `getObserver(obj, key)`, `getArrayObserver(arr)` and the rest, when you need to subscribe from something that isn't a component.

`batch()` from `aurelia` helps when several assignments belong together. Notifications are synchronous, so a subscriber that depends on three properties hears about each assignment separately. Inside `batch(() => { ... })`, notifications are held until the callback returns, and each subscriber is told once with the final values.

## When a binding won't update

Most stale bindings come down to one of these:

1. The change didn't go through a setter: an index or `length` write, `fill`, a mutated Date, or a deleted property.
2. A template calls a method that reads state the binding can't see. Make it a getter, pass the dependencies as arguments, or add `@computed`.
3. A template calls `get` or `has` on a Map or Set. Move the lookup into a getter.
4. A getter reads `#private` state.
5. The value lives somewhere outside your view model.
6. The binding is fine and the DOM write hasn't happened yet. In a test, `await tasksSettled()`.

If none of these fit, `observer-locator.ts` in `packages/runtime/src` is under 300 lines and makes a good place to start reading. Or bring it to [Discord](https://discord.gg/TPV3cvCZhz), where somebody has almost certainly hit the same thing.
