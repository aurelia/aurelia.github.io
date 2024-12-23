+++
title = "Common Migration Gotchas: Aurelia 1 to Aurelia 2"
authors = ["Dwayne Charrington"]
description = "Common migration challenges and how to overcome them when upgrading from Aurelia 1 to Aurelia 2."
date = 2024-12-23T10:00:00Z
lastmod = 2024-12-23T10:00:00Z
tags = ["migration", "aurelia2"]
+++

Migrating to Aurelia 2 offers a wealth of improvements but also introduces significant changes that can trip up even experienced Aurelia developers. This guide focuses on the nuances of Aurelia 2's registration system, routing, dependency injection (DI), and plugin ecosystem, as well as tackling other migration hurdles.

---

## 🔄 Registration and App Bootstrapping

The most noticeable change in Aurelia 2 is how applications are bootstrapped. Gone are the days of the `aurelia-app` attribute with no value defaulting to standard configuration. Instead, Aurelia 2 uses a more explicit registration system:

Instead of chaining methods such as `plugin` or `feature`, you now explicitly register components, services, and plugins using native ES modules.

**Aurelia 1 Approach**

```typescript
export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .globalResources(PLATFORM.moduleName('./global-component'))
    .plugin(PLATFORM.moduleName('some-plugin'))
    .feature('./my-feature');

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
```

**Aurelia 2 Approach**

```typescript
import { MyGlobalComponent } from './global-component';
import { SomePlugin } from 'some-plugin';

Aurelia
  .register(MyGlobalComponent, SomePlugin)
  .app(MyApp)
  .start();
```

The biggest change in Aurelia 2 is how integrations work. String-based conventions are replaced with native ES modules, and there's no distinction between resources, plugins, and features - everything is just a dependency that can be registered to a container.

### Aurelia 1 Plugin/Feature Pattern

```typescript
// producer/index.ts
export function configure(config: FrameworkConfiguration) {
  config.globalResources(['./my-component', './my-component-2']);
}

// main.ts (consumer)
aurelia.use
  .plugin('producer')      // Using as plugin
  .feature('./producer');  // Using as feature
```

#### Aurelia 2 Integration Pattern

```typescript
// producer/index.ts
import { IContainer } from 'aurelia';
import { MyComponent } from './my-component';
import { MyComponent2 } from './my-component-2';

export const Producer = {
  register(container: IContainer) {
    container.register(
      MyComponent,
      MyComponent2
    );
  },
};

// main.ts (consumer)
Aurelia.register(Producer);
```

#### Key Changes
- Components registered with `Aurelia.register()` are globally accessible
- `PLATFORM.moduleName` is no longer needed for bundling
- Use direct ES module imports instead of string-based module names
- No distinction between plugins, features, and resources
- Registration is more explicit and type-safe
- Container-based registration provides more flexibility and control

---

## 💉 Dependency Injection: No More Auto-Injection

In Aurelia 1, the `@autoinject` decorator was used to automatically inject dependencies into a class. This is no longer supported in Aurelia 2. Instead, you need to explicitly inject dependencies using the `resolve` function or the `@inject` decorator.

**Aurelia 1 Approach**

```typescript
import { autoinject } from 'aurelia-framework';

@autoinject
export class MyComponent {
  constructor(private readonly myService: MyService) {
    this.myService.doSomething();
  }
}
```

**Aurelia 2 Approach**

```typescript
import { resolve } from 'aurelia';

export class MyComponent {
  private readonly myService = resolve(MyService);

  constructor() {
    this.myService.doSomething();
  }
}
```

You can also use `resolve` inline with the constructor:

```typescript
export class MyComponent {
  constructor(private readonly myService = resolve(MyService)) {
    this.myService.doSomething();
  }
}
```

#### Using Constructor Injection
```typescript
import { inject } from 'aurelia';

@inject(MyService)
export class MyComponent {
  constructor(private readonly myService: MyService) {
    this.myService.doSomething();
  }
}
```

---

## 🎯 Enhanced Dependency Injection with Interfaces

While basic DI still works in Aurelia 2, the framework introduces powerful new patterns using `DI.createInterface` that provide better type safety and flexibility.

### Using DI.createInterface

The new interface-based DI system offers two main approaches:

#### 1. Strongly-Typed with Default Implementation
```typescript
export class ApiClient {
  async getProducts(filter) { /* ... */ }
}

export interface IApiClient extends ApiClient {}
export const IApiClient = DI.createInterface<IApiClient>('IApiClient', x => x.singleton(ApiClient));
```

#### 2. Interface-Only (Loose Coupling)
```typescript
export interface IApiClient {
  getProducts(filter): Promise<Product[]>;
}

export const IApiClient = DI.createInterface<IApiClient>('IApiClient');

// Registration needed when no default is provided
Aurelia.register(Registration.singleton(IApiClient, ApiClient));
```

### Consuming Interfaces

There are multiple ways to inject interfaces in your components:

```typescript
export class MyComponent {
  // Using resolve
  private readonly api = resolve(IApiClient);

  // Future convention (once implemented)
  constructor(private readonly api: IApiClient) {}
}
```

You can also use the `@inject` decorator to inject the interface:

```typescript
import { inject } from 'aurelia';

@inject(IApiClient)
export class MyComponent {
  constructor(private readonly api: IApiClient) {}
}
```

---

## 🎨 Template Syntax Changes

Aurelia 2 introduces several changes to the template syntax, including the removal of the `require` attribute, optional `<template>` elements, and the replacement of the `.delegate` command with `.trigger`.

### Key Changes

#### 1. Custom Element Syntax

In Aurelia 1, the `require` attribute was used to load components. In Aurelia 2, the `require` attribute has been replaced with the `import` attribute. When defining templates in Aurelia 1, you had to use the `<template>` element, in Aurelia 2 the `<template>` element is now optional.

```html
<!-- Aurelia 1 -->
<template>
  <require from="./my-component"></require>
  <my-component></my-component>
</template>

<!-- Aurelia 2 -->
<import from="./my-component"></import>
<my-component></my-component>
```

#### 2. The `.delegate` command has been replaced with `.trigger`

Unless you're using the v1 compatibility package, attempting to use `.delegate` will throw an console error.

```html
<!-- Aurelia 1 -->
<button click.delegate="handleClick()">Click Me</button>

<!-- Aurelia 2 -->
<button click.trigger="handleClick()">Click Me</button>
```

#### 3. View-model Ref Syntax Changes
```html
<!-- Aurelia 1 -->
<div view-model.ref="myRef"></div>

<!-- Aurelia 2 -->
<div component.ref="myRef"></div>
```

#### 4. Replaceable Slot Changes
```html
<!-- Aurelia 1 -->
<template replaceable="header">
  <h1>${title}</h1>
</template>

<!-- Aurelia 2 -->
<au-slot name="header">
  <h1>${title}</h1>
</au-slot>
```

---

## ✒️ Composition Changes

The composition system in Aurelia 2 has undergone significant changes from Aurelia 1. While maintaining its ease of use, several key aspects work differently.

### Property Name Changes

The most immediate change is in property naming:

- `view` is now `template`
- `view-model` is now `component`

**Aurelia 1 Approach**
```html
<compose view.bind="templatePath"
         view-model.bind="componentInstance">
</compose>
```

**Aurelia 2 Approach**
```html
<au-compose template.bind="templatePath"
            component.bind="componentInstance">
</au-compose>
```

Data is still passed to the component using the `model` property and inside of the component, available using the `activate` lifecycle hook.

### Module Resolution Changes

In Aurelia 2, string values for `template` and `component` properties are handled differently:

- String values are no longer automatically resolved as module names
- `template` only accepts template strings
- `component` only accepts objects or classes

To load templates dynamically from a URL (to achieve v1 style composition), you can create a value converter:

```typescript
export class LoadTemplateValueConverter {
  toView(url: string): Promise<string> {
    return fetch(url).then(r => r.text());
  }
}
```

Then use it in your template:
```html
<au-compose template="https://my-server.com/templates/${componentName} | loadTemplate">
</au-compose>
```

### Reference Handling

The `component.ref` binding now references the composed view model instead of the composer itself:

```html
<!-- References the composed component -->
<au-compose component.bind="myComponent"
            component.ref="composedViewModel">
</au-compose>
```

### Scope Inheritance

Aurelia 2 introduces more controlled scope inheritance:

- By default, outer scope is not inherited when composing custom elements
- Parent scope only inherits when composing a view-only or plain object view model
- Scope behavior can be explicitly controlled using the `scope-behavior` attribute

```html
<!-- Force scoped behavior -->
<au-compose scope-behavior="scoped"
            component.bind="myComponent">
</au-compose>

<!-- Auto behavior - inherits parent scope for view-only composition -->
<au-compose scope-behavior="auto"
            template.bind="myTemplate">
</au-compose>
```

Available scope behaviors:
- `auto`: Inherits parent scope in view-only composition
- `scoped`: Never inherits parent scope, even in view-only composition

---

## 🔄 Lifecycle Changes

Aurelia 2 introduces significant changes to component lifecycles, providing better timing guarantees and async support. Here's what you need to know:

### Key Lifecycle Changes

#### 1. New Lifecycle Hook: `bound`

The `bound` hook was added to address edge cases where information isn't available in `bind`, such as from-view bindings and refs:

```typescript
export class MyComponent {
  // Aurelia 1: Often needed queueMicroTask in bind
  bind() {
    this.taskQueue.queueMicroTask(() => {
      // Access refs or from-view bindings
    });
  }

  // Aurelia 2: Use bound instead
  bound() {
    // Refs and from-view bindings are now available
  }
}
```

#### 2. Async Support in Lifecycle Hooks

Aurelia 2 natively supports async operations in several lifecycle hooks:

```typescript
export class MyComponent {
  // Aurelia 1: Required CompositionTransaction
  bind() {
    this.compositionTransactionNotifier = this.compositionTransaction.enlist();
    
    return this.loadData().then(() => {
      this.compositionTransactionNotifier.done();
    });
  }

  // Aurelia 2: Simply return a Promise
  async binding() {
    await this.loadData();
  }
}
```

#### 3. Renamed Lifecycle Methods

A couple of lifecycle methods have been renamed to better reflect their timing:

```typescript
export class MyComponent {
  // Aurelia 1
  unbind() { /* ... */ }
  detached() { /* ... */ }

  // Aurelia 2
  unbinding() { /* ... */ }
  detaching() { /* ... */ }
}
```

#### 4. Improved Attached Timing

The `attached` hook now guarantees that all child components are attached:

```typescript
export class MyComponent {
  // Aurelia 1: Often needed delays
  attached() {
    this.taskQueue.queueMicroTask(() => {
      // Work with child components
    });
  }

  // Aurelia 2: No delays needed
  attached() {
    // Child components are guaranteed to be attached
  }
}
```

### Lifecycle Order and Timing

Here's the complete lifecycle sequence in Aurelia 2:

1. `define` - Configure the component definition
2. `hydrating` - Component is being hydrated
3. `hydrated` - Component hydration complete
4. `created` - Component instance created
5. `binding` - Data binding begins (can be async)
6. `bound` - Data binding complete
7. `attaching` - DOM attachment begins (can be async)
8. `attached` - DOM attachment complete
9. `detaching` - Component removal begins (can be async)
10. `unbinding` - Data unbinding begins (can be async)
11. `dispose` - Final cleanup

### Controller Access

If you need access to the component's controller (previously "view" in v1):

```typescript
import { IController } from '@aurelia/runtime';

export class MyComponent {
  private readonly controller = resolve(IController);

  created() {
    // Access parent controller (previously owningView)
    const parent = this.controller.parent;
  }
}
```

### Route Component Lifecycle

Route components have additional lifecycle hooks:

```typescript
export class MyRouteComponent {
  async canLoad(params: Parameters, instruction: RoutingInstruction, navigation: Navigation) {
    // Return boolean or navigation instruction
    return true;
  }

  async loading(params: Parameters, instruction: RoutingInstruction, navigation: Navigation) {
    // Perform loading operations
  }

  async canUnload(instruction: RoutingInstruction, navigation: Navigation) {
    // Return boolean
    return true;
  }

  async unloading(instruction: RoutingInstruction, navigation: Navigation) {
    // Cleanup before navigation
  }
}
```

---

## 🔄 Routing Changes

Aurelia 2 introduces new types and patterns for routing in the form of `@aurelia/router` and `@aurelia/router-lite`. If you are using routing in Aurelia 1, you will find that this is a significant change.

### Router Packages

Aurelia 2 provides two distinct router packages:

- `@aurelia/router`: Full-featured router with direct routing support
- `@aurelia/router-lite`: Lightweight router with configured routing only

### Route Configuration

#### Aurelia 1 Style

```typescript
export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'home/index' },
      { route: 'users', name: 'users', moduleId: 'users/index', nav: true }
    ]);
  }
}
```

#### Aurelia 2 Style

```typescript
import { route } from '@aurelia/router-lite';

@route({
  routes: [
    {
      path: ['', 'home'],
      component: import('./home-component'),
      title: 'Home'
    },
    {
      path: 'about',
      component: import('./about-component'),
      title: 'About'
    }
  ]
})
export class MyApp {}
```

You can also use `static routes` to define routes:

```typescript
export class MyApp {
  static routes = [
    { path: ['', 'home'], component: HomeComponent, title: 'Home' },
    { path: 'about', component: AboutComponent, title: 'About' }
  ];
}
```

### View Changes

#### Template Syntax

- Aurelia 1 used `<router-view>` for route content placement
- Aurelia 2 uses `<au-viewport>` instead

### Router Setup

Aurelia 2 requires explicit router registration during bootstrap, you no longer need to use the `configureRouter` method.

```typescript
import { RouterConfiguration } from '@aurelia/router-lite';

Aurelia
  .register(RouterConfiguration.customize({
    useUrlFragmentHash: true
  }))
  .app(MyApp)
  .start();
```

### Router Pipeline Steps

The router pipeline has been significantly simplified in Aurelia 2. Instead of explicit pipeline steps, Aurelia 2 uses lifecycle hooks with the `@lifecycleHooks()` decorator for shared routing logic.

#### Aurelia 1 Pipeline Steps

```typescript
import { RouterConfiguration, Router } from 'aurelia-router';

export class App {
  configureRouter(config: RouterConfiguration, router: Router): void {
    config.addPipelineStep('authorize', AuthorizeStep);
    config.addAuthorizeStep(AuthorizeStep);
    config.addPreRenderStep(PreRenderStep);
    config.addPostRenderStep(PostRenderStep);
  }
}
```

#### Aurelia 2 Lifecycle Hooks

In Aurelia 2, shared routing logic is implemented using lifecycle hooks. Here's a typical authentication/authorization example:

```typescript
import { lifecycleHooks } from '@aurelia/runtime-html';
import { 
  IRouteViewModel, 
  Params, 
  RouteNode, 
  NavigationInstruction 
} from '@aurelia/router-lite';

@lifecycleHooks()
export class AuthenticationHook {
  private readonly auth = resolve(IAuthService);

  canLoad(
    viewModel: IRouteViewModel,
    params: Params,
    next: RouteNode,
    current: RouteNode | null
  ): boolean | NavigationInstruction {
    if (!next.data?.requiresAuth) {
      return true;
    }
    
    return this.auth.isAuthenticated 
      ? true 
      : `login?returnUrl=${next.computeAbsolutePath()}`;
  }
}
```

Register the hooks during app bootstrap:

```typescript
Aurelia
  .register(
    RouterConfiguration,
    AuthenticationHook,
    AuthorizationHook
  )
  .app(MyApp)
  .start();
```

#### Available Lifecycle Hooks

Route components and shared hooks can implement these lifecycle methods:

```typescript
export interface IRouteViewModel {
  // Called before loading - return false/navigation to prevent
  canLoad?(
    params: Params,
    next: RouteNode,
    current: RouteNode | null
  ): boolean | NavigationInstruction | Promise<boolean | NavigationInstruction>;

  // Called during component loading
  loading?(
    params: Params,
    next: RouteNode, 
    current: RouteNode | null
  ): void | Promise<void>;

  // Called before unloading - return false to prevent
  canUnload?(
    next: RouteNode | null,
    current: RouteNode
  ): boolean | Promise<boolean>;

  // Called during component unloading
  unloading?(
    next: RouteNode | null,
    current: RouteNode
  ): void | Promise<void>;
}
```

#### Using Route Data for Authorization

You can add metadata to routes to work with lifecycle hooks:

```typescript
@route({
  routes: [
    {
      path: 'admin',
      component: AdminComponent,
      data: {
        requiresAuth: true,
        roles: ['admin']
      }
    }
  ]
})
export class MyApp {}
```

Then check this data in your hooks:

```typescript
@lifecycleHooks()
export class AuthorizationHook {
  private readonly auth = resolve(IAuthService);

  canLoad(viewModel: any, params: any, next: RouteNode): boolean | string {
    const roles = next.data?.roles;
    if (!roles) return true;

    return this.auth.hasRoles(roles) 
      ? true 
      : 'forbidden';
  }
}
```

The key differences from Aurelia 1 are:
- No explicit pipeline steps - use lifecycle hooks instead
- Hooks receive the component instance as first parameter
- More predictable execution order based on registration
- Simpler, more maintainable authorization patterns
- Better TypeScript support and type safety
- Async operations are handled more elegantly
---

## Conclusion

Migrating to Aurelia 2 is a significant step, but with the right approach and a solid understanding of the changes, it can be a smooth transition. By focusing on the core concepts and patterns, you can leverage the improvements in Aurelia 2 while minimizing the challenges.

Remember, the Aurelia team is here to help you through the migration process. If you have any questions or need assistance, don't hesitate to reach out to the community or the Aurelia team on the [Aurelia Discord](https://discord.gg/SMaXVZMReK) or [Aurelia Forums](https://discourse.aurelia.io/).