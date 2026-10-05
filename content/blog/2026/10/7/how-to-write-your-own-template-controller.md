+++
title = "How to Write Your Own Template Controller"
authors = ["Dwayne Charrington"]
description = "if, repeat, with and promise are ordinary custom attributes with one flag set. Here's how they work, and how to build your own: one that renders content while a media query matches, and one that adds a variable to its template."
date = 2026-10-07T08:00:00+10:00
lastmod = 2026-10-07T08:00:00+10:00
tags = ["aurelia2", "tutorial"]
toc = true
+++

`if.bind`, `repeat.for`, `with.bind`, `promise.bind`, `switch.bind` and `portal` look like part of the template language, but none of them are special. Each one is a custom attribute with `isTemplateController: true` in its definition, and the source for all of them sits in a single folder of `@aurelia/runtime-html`. Nothing they do is off limits to your own code.

This post builds two of them from scratch. The first, `media`, renders its element only while a CSS media query matches. The second, `clock`, adds a `$now` variable that the template inside it can bind to. Between them they cover nearly everything a template controller can do.

## What makes it a template controller

A normal custom attribute is handed the element it sits on and gets to change it. A template controller is never handed that element at all. When the compiler finds one, it lifts the element out of the template, compiles it into a separate view, and puts a pair of comment markers where the element used to be.

Take this markup:

```html
<nav media="(min-width: 768px)">Hi ${name}</nav>
<p>after</p>
```

While the query doesn't match, the DOM contains only the markers:

```html
<!--au-start--><!--au-end--><p>after</p>
```

And while it does, the view sits between them:

```html
<!--au-start--><nav>Hi Dwayne</nav><!--au-end--><p>after</p>
```

The `media` attribute itself never reaches the page. The compiled `<nav>` belongs to the controller now, and the controller gets three things to work with:

- `IViewFactory` creates views from the compiled element. You can call it as many times as you like, which is how `repeat` renders a list.
- `IRenderLocation` is the `au-end` marker. A view inserts its nodes just before it.
- `this.$controller` is the controller Aurelia creates for your attribute. It holds the current `scope` and tells you whether you're active.

Your job is to decide when to create a view, when to activate it, which scope to give it, and when to take it away again. That's the entire contract.

Before you build one, check you need one. If you want to change an element that always exists (add a class, set up a tooltip, listen for clicks), write a regular custom attribute. You need a template controller only when the question is whether the content exists, how many copies of it exist, or what scope it binds against.

## Building `media`

Responsive layouts usually get by on CSS. Sometimes, though, hiding something isn't enough: a heavy chart you don't want on phones at all, or a desktop navigation component that does its own setup work in `attached`. A common fix is to listen to `matchMedia` in a component, store a boolean, and `if.bind` on it. That works, but every component that needs it repeats the listener code. A template controller does the job once:

```html
<desktop-nav media="(min-width: 768px)"></desktop-nav>
<mobile-nav media="(max-width: 767px)"></mobile-nav>
```

Here's the whole thing:

```typescript
import {
  bindable,
  IRenderLocation,
  IViewFactory,
  IWindow,
  resolve,
  templateController,
} from 'aurelia';
import type {
  ControllerVisitor,
  ICustomAttributeController,
  IHydratedController,
  ISyntheticView,
} from '@aurelia/runtime-html';

@templateController({
  name: 'media',
  defaultProperty: 'query',
  noMultiBindings: true,
})
export class Media {
  @bindable query = '';

  readonly $controller!: ICustomAttributeController<this>;

  private readonly factory = resolve(IViewFactory);
  private readonly location = resolve(IRenderLocation);
  private readonly window = resolve(IWindow);

  private view?: ISyntheticView;
  private mql?: MediaQueryList;

  attaching(initiator: IHydratedController) {
    this.listen();
    return this.update(initiator);
  }

  detaching(initiator: IHydratedController) {
    this.stopListening();
    void this.view?.deactivate(initiator, this.$controller);
  }

  queryChanged() {
    if (!this.$controller.isActive) return;
    this.stopListening();
    this.listen();
    void this.update();
  }

  accept(visitor: ControllerVisitor) {
    return this.view?.accept(visitor);
  }

  dispose() {
    this.view?.dispose();
    this.view = undefined;
  }

  private listen() {
    this.mql = this.window.matchMedia(this.query);
    this.mql.addEventListener('change', this.onChange);
  }

  private stopListening() {
    this.mql?.removeEventListener('change', this.onChange);
    this.mql = undefined;
  }

  private onChange = () => {
    void this.update();
  };

  private update(initiator?: IHydratedController) {
    const { $controller } = this;

    if (this.mql?.matches) {
      const view = this.view ??= this.factory.create($controller).setLocation(this.location);
      return view.activate(initiator ?? view, $controller, $controller.scope);
    }

    if (this.view) {
      return this.view.deactivate(initiator ?? this.view, $controller);
    }
  }
}
```

The controller types are imported from `@aurelia/runtime-html`. The `aurelia` package already depends on it, so there's nothing extra to install, but if your package manager is strict about undeclared dependencies, add it to `package.json`. Then register the class like any other resource:

```typescript
Aurelia
  .register(Media)
  .app(MyApp)
  .start();
```

Now let's go through it.

### The definition, and a colon problem

`@templateController` takes the same options as `@customAttribute`, minus `isTemplateController` (it sets that for you). Two of the options here matter.

`defaultProperty: 'query'` says which bindable gets the attribute's value. Without it, Aurelia looks for a bindable called `value`, which is what the built-in `if` uses. `query` reads better in the class.

`noMultiBindings: true` is the one that will catch you out. Custom attributes support a shorthand for setting several bindables at once:

```html
<div my-tooltip="text: Save changes; position: top"></div>
```

The compiler decides whether a value uses this syntax by looking for a colon. Media queries are full of colons, so without the flag, `(min-width: 768px)` gets read as an instruction to bind a property called `(min-width`, and compilation fails with:

```
AUR0707: Template compilation error: creating binding to non-bindable property (min-width on media.
```

Any attribute whose value might legitimately contain a colon (a time, a URL, a CSS declaration) needs `noMultiBindings: true`.

### Creating the view lazily

All the real work happens in `update()`. When the query matches, it creates the view if there isn't one yet and activates it. When it stops matching, it deactivates the view.

Two details are worth pointing out. First, the view is created on first use, not up front, so a `<desktop-nav>` behind a query that never matches on a phone is never instantiated. Its constructor doesn't run and none of its bindings are created.

Second, `update()` doesn't check whether the view is already active before activating it, or already inactive before deactivating it. It doesn't have to. Activating an active view and deactivating an inactive one both do nothing, so you don't need to track that state yourself.

`setLocation(this.location)` tells the view where its nodes go. Activating the view inserts them before the `au-end` marker, and deactivating it takes them back out. The view keeps its nodes and bindings while it's inactive, so turning it back on is cheap.

### Who started this?

Every `activate` and `deactivate` call takes an `initiator` as its first argument. This is the controller that started the current lifecycle, and Aurelia uses it to track when everything in that lifecycle (including async hooks) has finished.

There are two situations, and they get different initiators:

- In `attaching` and `detaching`, your controller is being added or removed as part of something bigger, such as a route change or a parent `if` flipping. Pass the `initiator` you were given, so the view's lifecycle is part of that larger operation. Return the activation promise from `attaching`, and the parent waits for it before it counts as attached.
- When something happens on its own (the media query changes or a bindable changes), there's no parent operation. The view becomes its own initiator, which is what `initiator ?? view` does.

`detaching` calls `deactivate` with `void` in front, and that's deliberate. Because the parent's initiator was passed in, the deactivation is already tracked as part of the parent's teardown, so there's nothing to return. This is the same pattern the built-in `if` uses.

### Bindable changes

`queryChanged()` runs whenever the bound query changes, so `media.bind="breakpoints.desktop"` works too. It can also run before the controller has been attached, which is why it returns early if `$controller.isActive` is false. In that case `attaching` will pick up the current value anyway.

### Cleaning up

Three pieces handle teardown:

- `detaching` stops listening to `matchMedia`, so a controller that's been removed doesn't react to window resizes. `attaching` starts listening again if the content comes back, for example inside an `if` that toggles.
- `dispose()` runs when Aurelia is done with the controller for good. The controller created the view, so it owns it and has to dispose of it.
- `accept()` lets Aurelia walk the controller tree through your view. Leave it out and features that search the tree, such as the router finding viewports, can't see anything rendered inside your controller.

### Why `resolve(IWindow)`?

You could call `window.matchMedia` directly. Resolving `IWindow` from DI keeps the controller away from globals, so it can run under a non-browser platform, and a test can register a fake window and switch the query on and off at will. More on that further down.

## Building `clock`: giving a view its own scope

`media` hands its view the scope it was given, so the content binds exactly as if the controller weren't there. A template controller can also give the view a different scope, and that's how `repeat` provides `$index` and `with` changes what `this` points at.

Here's a controller that adds a `$now` variable and refreshes it on an interval:

```html
<p clock.bind="1000">Last refreshed ${$now.toLocaleTimeString()}</p>
```

```typescript
import {
  bindable,
  IRenderLocation,
  IViewFactory,
  resolve,
  Scope,
  templateController,
} from 'aurelia';
import type {
  ControllerVisitor,
  ICustomAttributeController,
  IHydratedController,
  ISyntheticView,
} from '@aurelia/runtime-html';

@templateController('clock')
export class Clock {
  @bindable value = 1000;

  readonly $controller!: ICustomAttributeController<this>;

  private readonly factory = resolve(IViewFactory);
  private readonly location = resolve(IRenderLocation);

  private readonly context = { $now: new Date() };
  private view?: ISyntheticView;
  private timer?: ReturnType<typeof setInterval>;

  attaching(initiator: IHydratedController) {
    this.start();
    const { $controller } = this;
    const view = this.view ??= this.factory.create($controller).setLocation(this.location);
    const scope = Scope.fromParent($controller.scope, this.context);
    return view.activate(initiator, $controller, scope);
  }

  detaching(initiator: IHydratedController) {
    this.stop();
    void this.view?.deactivate(initiator, this.$controller);
  }

  valueChanged() {
    if (!this.$controller.isActive) return;
    this.stop();
    this.start();
  }

  accept(visitor: ControllerVisitor) {
    return this.view?.accept(visitor);
  }

  dispose() {
    this.view?.dispose();
    this.view = undefined;
  }

  private start() {
    this.context.$now = new Date();
    this.timer = setInterval(() => {
      this.context.$now = new Date();
    }, Number(this.value) || 1000);
  }

  private stop() {
    clearInterval(this.timer);
  }
}
```

The only new line is this one:

```typescript
const scope = Scope.fromParent($controller.scope, this.context);
```

`Scope.fromParent` creates a scope with `this.context` as its binding context and the controller's own scope as its parent. When a binding inside the view looks up a name, it checks `this.context` first and then works its way up through the parent scopes. So `${$now}` resolves to the clock, and everything else (`${label}`, event handlers, value converters) still resolves against the component, the same as before.

You don't need to do anything special to make `$now` reactive. `this.context` is a plain object, and Aurelia observes it the same way it observes your component properties. Assigning a new `Date` updates every binding that reads it.

The `$` prefix is a convention, not syntax. Because lookups check the inner scope first, a variable called `now` would hide any `now` property on the component, and the bug that causes is hard to spot. Built-in variables like `$index` and `$previous` use the prefix for the same reason, so it's worth copying.

## Things that will trip you up

**Order matters when there's more than one.** If an element has several template controllers, the compiler processes them from right to left. The rightmost one gets the compiled element, and each one to its left wraps the one beside it. In `repeat.for="item of items" if.bind="item.visible"`, every repeated row gets its own `if`. Swap the two attributes and you have one `if` wrapping the entire list.

**Not every place can host one.** Template controllers can't go on a surrogate `<template as-element="...">`, and spread bindings (`...$attrs`) skip them. Both throw compiler errors that say so.

**Rapid changes and async hooks.** If the content inside your controller has async `attaching` or `detaching` hooks, a second change can arrive while the first is still in progress. Neither example here guards against that, and for most controllers it doesn't matter. If yours flips quickly and wraps slow components, read how the built-in [`if`](https://github.com/aurelia/aurelia/blob/master/packages/runtime-html/src/resources/template-controllers/if.ts) keeps a pending promise and a swap counter, so an old change can't finish after a newer one.

**Sharing a container.** By default every view a controller creates shares the DI container it was created in. If each view needs its own child container, for example so each one gets its own instance of a service, add `containerStrategy: 'new'` to the definition. The built-in `promise` controller does this.

## Testing it

Controllers are easy to test with `createFixture` from `@aurelia/testing`. This is where resolving `IWindow` pays off, because the test can hand the controller a window whose `matchMedia` it controls:

```typescript
import { Registration } from 'aurelia';
import { IWindow } from '@aurelia/runtime-html';
import { tasksSettled } from '@aurelia/runtime';
import { assert, createFixture } from '@aurelia/testing';

it('renders only while the query matches', async () => {
  const media = fakeMatchMedia(); // a stub that lets the test flip `matches`
  media.set('(min-width: 768px)', true);

  const { appHost } = createFixture(
    `<nav media="(min-width: 768px)">Menu</nav>`,
    class App {},
    [Media, Registration.instance(IWindow, media.window)],
  );
  assert.strictEqual(appHost.querySelector('nav')?.textContent, 'Menu');

  media.set('(min-width: 768px)', false);
  await tasksSettled();
  assert.strictEqual(appHost.querySelector('nav'), null);
});
```

Test the teardown as well. Wrap the controller in an `if`, toggle it off, and assert that the `change` listener was removed. A template controller that leaks listeners won't throw anything. Your app will just get a little slower every time the user navigates.

## Where to go next

The built-in controllers are the best reference there is, and they're short. [`with`](https://github.com/aurelia/aurelia/blob/master/packages/runtime-html/src/resources/template-controllers/with.ts) is under a hundred lines and very close to `clock`. [`if`](https://github.com/aurelia/aurelia/blob/master/packages/runtime-html/src/resources/template-controllers/if.ts) shows how to manage two views and handle async swaps. [`repeat`](https://github.com/aurelia/aurelia/blob/master/packages/runtime-html/src/resources/template-controllers/repeat.ts) shows how far you can take it. The [template controllers page](https://docs.aurelia.io/getting-to-know-aurelia/composition-patterns/template-controllers) in the docs covers `link()`, which `else` uses to attach itself to the `if` before it.

If you build something good with this, show us on [Discord](https://discord.gg/TPV3cvCZhz). I'd like to see a feature-flag controller that isn't a hand-rolled `if.bind="flags.has('x')"` in every component.
