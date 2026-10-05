+++
title = "Testing Aurelia 2 Apps"
authors = ["Dwayne Charrington"]
description = "A practical guide to testing Aurelia 2 apps with Vitest and @aurelia/testing: setting up jsdom, rendering components with createFixture, waiting for the DOM with tasksSettled, swapping DI registrations for fakes, and testing routed components."
date = 2026-09-14T08:00:00+10:00
lastmod = 2026-09-14T08:00:00+10:00
tags = ["aurelia2", "testing"]
toc = true
+++

Most of the tests you'll write for an Aurelia app are small integration tests. You render a component into a DOM, click something or type into something, and check what's on the screen. `@aurelia/testing` exists to make that a few lines of code instead of fifty, and once the setup is in place there's really only one rule to remember: the view model changes right away, and the DOM catches up a moment later.

This post sets up Vitest from scratch, then works through `createFixture`, that one rule, swapping real services for fakes, and testing components that sit behind the router. It finishes with two snags that catch almost everyone the first time.

## Setting up Vitest

If your project came from `npx makes aurelia` and you picked Vitest, most of this is already done for you. If not, install the pieces:

```bash
npm i -D vitest jsdom @aurelia/testing @aurelia/runtime @aurelia/platform-browser
```

Keep the `@aurelia/*` packages on the same version as `aurelia`. Mixing an RC.2 `aurelia` with an older `@aurelia/testing` gives you two copies of the runtime, and the errors that come out of that are confusing.

Vitest needs a DOM, and it should run your code through the same Aurelia plugin as the app so that conventions (pairing `user-profile.ts` with `user-profile.html`) still work. Merging with your Vite config does both:

```typescript
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
}));
```

The setup file tells `@aurelia/testing` which platform to use and cleans up after every test:

```typescript
// test/setup.ts
import { BrowserPlatform } from '@aurelia/platform-browser';
import { setPlatform, onFixtureCreated, type IFixture } from '@aurelia/testing';
import { afterEach } from 'vitest';

const platform = new BrowserPlatform(window);
setPlatform(platform);
BrowserPlatform.set(globalThis, platform);

const fixtures: IFixture<object>[] = [];
onFixtureCreated(fixture => fixtures.push(fixture));

afterEach(async () => {
  await Promise.all(fixtures.filter(f => !f.torn).map(f => f.stop(true)));
  fixtures.length = 0;
});
```

`setPlatform` is what the testing package uses when it builds a container for each fixture. `BrowserPlatform.set` registers the same platform for code that looks it up from `globalThis`, which includes Aurelia's task queue. The `afterEach` stops every fixture the test created and removes it from the document, so you never have to remember to do it yourself. The `torn` filter skips fixtures a test already stopped on its own.

### Decorators in test files

If you're on Vite 8, the Aurelia plugin transforms standard decorators itself, and by default it only does that for files under `src/`. Put `@customElement` or `@valueConverter` on a class inside a test file and Vitest fails before running anything:

```
SyntaxError: Invalid or unexpected token
```

The message says nothing about decorators, so it can eat an afternoon. Either keep decorated classes in `src/`, or widen the plugin's decorator include to cover your tests:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import aurelia from '@aurelia/vite-plugin';

export default defineConfig({
  plugins: [
    aurelia({
      standardDecoratorInclude: ['src/**/*.ts', 'test/**/*.ts'],
    }),
  ],
});
```

## createFixture

Here's the component we'll start with, using conventions so the template lives next to the class:

```typescript
// src/click-counter.ts
export class ClickCounter {
  count = 0;
}
```

```html
<!-- src/click-counter.html -->
<button click.trigger="count++">Add one</button>
<span>${count}</span>
```

And a test:

```typescript
import { describe, it } from 'vitest';
import { createFixture } from '@aurelia/testing';
import { ClickCounter } from '../src/click-counter';

describe('click-counter', () => {
  it('starts at zero', async () => {
    const { assertText } = await createFixture(
      '<click-counter></click-counter>',
      class {},
      [ClickCounter],
    ).started;

    assertText('span', '0');
  });
});
```

`createFixture` takes three main arguments:

1. **A template.** This becomes the template of a root component, so it's usually just the element under test with whatever bindings you want to give it.
2. **A class or object for that root component.** `class {}` when you don't need anything, or a class with properties that the template binds to.
3. **Registrations.** Anything you'd pass to `container.register`: the components the template uses, value converters, plugins like the router, and fake services.

It builds a fresh container, creates an `<app>` host inside `document.body`, and starts an Aurelia app on it. Startup can be async, so `.started` gives you a promise that resolves to the fixture once every lifecycle hook has finished. If a component awaits something in `binding` or `attaching`, awaiting `.started` waits for that too.

The fixture has a lot on it. These are the parts you'll use most:

- `assertText(selector, text)`, `assertHtml`, `assertAttr`, `assertClass` and `assertValue` for checking the DOM. Call `assertText('...')` with one argument to check the whole app's text.
- `getBy(selector)`, which throws if it finds zero elements or more than one. `queryBy` returns `null` instead of throwing when nothing matches, and `getAllBy` returns an array.
- `trigger.click(selector)`, `trigger.keydown(selector, init)` and `trigger(selector, 'custom-event', init)` for firing events.
- `type(selector, value)`, which sets an input's value and fires `input`.
- `component` (the root view model), `container`, `appHost`, and `stop(true)` to tear it down early.

The assertion helpers throw plain assertion errors, so they work in any runner. You can mix them freely with Vitest's `expect`.

`component` is the root, not the element under test. When you need the child's view model, ask Aurelia for it:

```typescript
import { CustomElement } from 'aurelia';

const { getBy } = createFixture('<click-counter></click-counter>', class {}, [ClickCounter]);
const counter = CustomElement.for<ClickCounter>(getBy('click-counter')).viewModel;
```

Testing a bindable is a matter of binding it from the root. Here `UserCard` has a `@bindable user` and renders `<h3>${user.name}</h3>`:

```typescript
const { component, assertText } = createFixture(
  '<user-card user.bind="user"></user-card>',
  class { user = { id: 1, name: 'Ada' }; },
  [UserCard],
);

assertText('h3', 'Ada');
component.user = { id: 2, name: 'Grace' };
```

Which brings us to the one rule.

## The DOM updates later

Add a click to the counter test and check the DOM straight away:

```typescript
it('counts clicks', async () => {
  const { trigger, getBy } = createFixture('<click-counter></click-counter>', class {}, [ClickCounter]);

  trigger.click('button');
  expect(getBy('span').textContent).toBe('0'); // not updated yet

  await tasksSettled();
  expect(getBy('span').textContent).toBe('1');
});
```

`tasksSettled` comes from `@aurelia/runtime`. It isn't re-exported from `aurelia`.

The click runs `count++` synchronously, so the view model already holds `1` when `trigger.click` returns. The binding that writes `${count}` into the `<span>` doesn't touch the DOM at that point, though. It queues the write, and Aurelia flushes the queue on the next microtask. That batching is what stops ten property changes from causing ten DOM writes, and it's the reason a test that asserts straight after a change sees the old text.

`await tasksSettled()` waits until the queue is empty, including anything queued while it was draining. Use it after anything that changes state: a trigger, a direct assignment like `component.user = ...`, or a method call on a view model.

The other direction is synchronous. `type('input', 'Ada')` fires `input`, `value.bind` writes `'Ada'` into the view model on the spot, and you can assert on the view model without waiting. You only wait when you're checking the DOM.

Two details make `tasksSettled` more useful than a sleep:

- It resolves to `true` when it had queued work to wait for and `false` when the queue was already empty. That can tell you whether a test leaves work behind.
- If something throws inside queued work, such as a value converter that throws on a bad value, `tasksSettled` rejects with that error. A test that awaits it fails with the real cause instead of a stale DOM.

```typescript
component.amount = -5; // MoneyValueConverter throws on negative values
await expect(tasksSettled()).rejects.toThrow('negative money');
```

## Swapping registrations

Components that talk to the outside world should get it through DI, and that's what makes them testable. Here's a profile component that loads a user from an API:

```typescript
// src/user-api.ts
import { DI } from 'aurelia';

export interface User { id: number; name: string; }

export interface IUserApi {
  getUser(id: number): Promise<User>;
}

export class HttpUserApi implements IUserApi {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
}

export const IUserApi = DI.createInterface<IUserApi>('IUserApi', x => x.singleton(HttpUserApi));
```

```typescript
// src/user-profile.ts
import { bindable, resolve } from 'aurelia';
import { IUserApi, type User } from './user-api';

export class UserProfile {
  @bindable userId = 0;
  user: User | null = null;

  private readonly api = resolve(IUserApi);

  async binding() {
    this.user = await this.api.getUser(this.userId);
  }
}
```

The default on `IUserApi` only applies when nothing else has been registered for it. A fixture registers whatever you pass it before anything gets resolved, so a fake goes in the registrations list:

```typescript
import { Registration } from 'aurelia';

it('shows the user name', async () => {
  const fakeApi = { getUser: async (id: number) => ({ id, name: 'Ada Lovelace' }) };

  const { assertText } = await createFixture(
    '<user-profile user-id.bind="7"></user-profile>',
    class {},
    [UserProfile, Registration.instance(IUserApi, fakeApi)],
  ).started;

  assertText('h2', 'Ada Lovelace');
});
```

No `fetch`, no network, and `.started` waits for the async `binding` hook, so the name is already on screen. Use `vi.fn` for the fake's methods if you also want to check what was called with which arguments.

Class tokens work the same way. If a component calls `resolve(Clock)`, then `Registration.instance(Clock, { now: () => new Date(2030, 0, 1) })` pins the date for that test.

Each fixture gets its own container, so a fake registered in one test never leaks into the next one. Singletons are per fixture as well.

### Faking the window

Browser APIs are the other thing you'll want to swap. jsdom doesn't implement `window.confirm`. It prints `Not implemented: Window's confirm() method` and returns `undefined`, so a component that calls it directly can only ever take the cancel branch in a test. Resolve `IWindow` instead:

```typescript
import { resolve, IWindow } from 'aurelia';

export class DeleteButton {
  status = 'kept';
  private readonly window = resolve(IWindow);

  remove() {
    if (this.window.confirm('Delete this?')) {
      this.status = 'deleted';
    }
  }
}
```

```html
<!-- src/delete-button.html -->
<button click.trigger="remove()">Delete</button>
<i>${status}</i>
```

In the app, `IWindow` resolves to the real window. In a test, hand it an object with only the parts the component uses:

```typescript
it('deletes when confirmed', async () => {
  const asked: string[] = [];
  const fakeWindow = {
    confirm: (message: string) => { asked.push(message); return true; },
  } as unknown as IWindow;

  const { trigger, assertText } = createFixture(
    '<delete-button></delete-button>',
    class {},
    [DeleteButton, Registration.instance(IWindow, fakeWindow)],
  );

  trigger.click('button');
  await tasksSettled();

  assertText('i', 'deleted');
  expect(asked).toEqual(['Delete this?']);
});
```

`ILocation` and `IHistory` default to `location` and `history` on whatever `IWindow` resolves to. A fake window changes those too, unless you register them separately. When a component only needs one of them, register a fake for that interface and leave `IWindow` alone.

### Without a DOM at all

Not everything needs a fixture. A view model method that does arithmetic or shapes data can be tested on its own, with one catch. `resolve()` only works while a container is creating the object, so `new UserPage()` throws:

```
AUR0016: There is not a currently active container to resolve "InterfaceSymbol<IUserApi>". Are you trying to "new Class(...)" that has a resolve(...) call?
```

Let a container create it instead:

```typescript
import { DI, Registration } from 'aurelia';

const container = DI.createContainer();
container.register(Registration.instance(IUserApi, fakeApi));

const page = container.get(UserPage);
```

`container.invoke(UserPage)` does the same thing and always gives you a new instance.

## Routed components

The router adds one complication. It treats the app's root component as the root of the route tree, and in a fixture the root component is whatever class you pass as the second argument. Write the obvious test:

```typescript
createFixture('<my-app></my-app>', class {}, [RouterConfiguration, MyApp]);
```

The `@route` config on `MyApp` is ignored, because `MyApp` is now just an element inside the real root, and navigating to any of its routes fails:

```
AUR3401: Neither the route 'users' matched any configured route at 'app' nor a fallback is configured for the viewport 'default'
```

Make the routed component the root instead, and reuse its own template:

```typescript
import { CustomElement, Registration } from 'aurelia';
import { RouterConfiguration, IRouter } from '@aurelia/router';
import { MyApp } from '../src/my-app';

function createApp(api: IUserApi) {
  const { template } = CustomElement.getDefinition(MyApp);
  return createFixture(template as string, MyApp, [
    RouterConfiguration.customize({ historyStrategy: 'none' }),
    Registration.instance(IUserApi, api),
  ]).started;
}
```

`historyStrategy: 'none'` keeps navigation from pushing entries onto jsdom's history. Vitest gives each test file one jsdom window, so anything pushed there is still around for the next test in the file.

Here's the app being tested. It has a home route and a user page that loads its data in the `loading` hook:

```typescript
// src/my-app.ts
@route({
  routes: [
    { path: ['', 'home'], component: HomePage },
    { path: 'users/:id', component: UserPage },
  ],
})
export class MyApp {}
```

```html
<!-- src/my-app.html -->
<nav><a load="users/7">Ada</a></nav>
<au-viewport></au-viewport>
```

```typescript
// src/user-page.ts
export class UserPage implements IRouteViewModel {
  user: User | null = null;
  private readonly api = resolve(IUserApi);

  async loading(params: Params) {
    this.user = await this.api.getUser(Number(params.id));
  }
}
```

`router.load` returns a promise that resolves once the navigation has finished, including the async `loading` hook and the render, so you can assert straight after it:

```typescript
const fakeApi = { getUser: vi.fn(async (id: number) => ({ id, name: `User ${id}` })) };

it('loads a user by id', async () => {
  const { container, assertText } = await createApp(fakeApi);

  assertText('h2', 'Home');

  await container.get(IRouter).load('users/42');

  expect(fakeApi.getUser).toHaveBeenCalledWith(42);
  assertText('h2', 'User 42');
});
```

Clicking a link is closer to what a user does, and there's no promise to await, so wait for the queue:

```typescript
it('follows a load link', async () => {
  const { trigger, assertText } = await createApp(fakeApi);

  trigger.click('a', { cancelable: true });
  await tasksSettled();

  assertText('h2', 'User 7');
});
```

`tasksSettled` covers the whole navigation, async hook included. Pass `{ cancelable: true }` to the click. The `load` attribute calls `preventDefault()` so the browser doesn't follow the link's `href`, but a synthetic event isn't cancelable unless you say so. Leave it out and the test still passes, but jsdom tries to follow the link and prints `Not implemented: navigation` to the console, which looks like a failure every time you read the output.

Guards and hooks are often easier to test without the router at all. `canLoad`, `loading` and `canUnload` are plain methods, so create the component through a container and call them:

```typescript
it('loads the user from the id param', async () => {
  const container = DI.createContainer();
  container.register(Registration.instance(IUserApi, fakeApi));

  const page = container.get(UserPage);
  await page.loading({ id: '3' });

  expect(page.user?.name).toBe('User 3');
});
```

Save the fixture tests for the things only the router does: matching paths, rendering into viewports, redirects from a guard, and links.

## What to test where

Some rules of thumb:

- If you want to know what ends up on screen, use a fixture and `assertText`. Wait for `tasksSettled` before any DOM assertion that follows a change.
- If you care about logic, create the class through a container and call methods. These tests are fast and don't care about templates.
- Never touch `fetch`, `window` or `localStorage` directly from a component. Resolve the thing through DI so each test can register a fake for it.
- Only test routing with the router when the router is the thing you're testing.

If you run into something this post doesn't cover, the `@aurelia/testing` source is short and readable (`createFixture` lives in `startup.ts`), and you can ask about it in the [Aurelia Discord](https://discord.gg/TPV3cvCZhz).
