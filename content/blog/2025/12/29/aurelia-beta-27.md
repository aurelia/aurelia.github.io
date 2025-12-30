+++
title = "Aurelia 2 Beta 27: 13 Features and a Glimpse of What's Next"
authors = ["Dwayne Charrington"]
description = "SSR, SSG, and AOT are almost here. Beta 27 ships 13 features and 16 fixes across state, routing, virtualization, and more."
date = 2025-12-29T10:00:00Z
lastmod = 2025-12-29T10:00:00Z
tags = ["aurelia2", "release"]
+++

Beta 27 is a landmark release. With 13 new features, 16 bug fixes, and foundational refactoring for SSR and AOT compilation, this update touches nearly every corner of Aurelia 2. Whether you're managing complex state, building virtualized lists, or waiting for server-side rendering support, there's something substantial here for you.

## SSR and AOT on the Horizon

Fred ([@fkleuver](https://github.com/fkleuver)) has been laying the groundwork for server-side rendering and ahead-of-time compilation. Beta 27 includes several internal refactors that pave the way for these features: AST nodes converted to interfaces for easier serialization ([#2309](https://github.com/aurelia/aurelia/pull/2309)), numeric instruction discriminants for smaller payloads ([#2329](https://github.com/aurelia/aurelia/pull/2329)), and a simplified template compiler ([#2310](https://github.com/aurelia/aurelia/pull/2310)).

SSR, SSG, and AOT compilation are actively being wired up and will be ready for testing shortly. Initial versions will be based on Vite. Alongside this, a new VS Code extension is coming with typechecking, syntax highlighting, refactorings, and more.

## State Management

### Multiple Named and Keyed Stores

You can now register and manage multiple independent stores identified by names or DI keys ([#2262](https://github.com/aurelia/aurelia/pull/2262)).

Previously, applications were limited to a single default store, which meant contending with large monolithic state objects as applications grew. Multiple stores let you partition state into logical domains (user state, UI state, feature-specific data), each managed independently.

The `@fromState` decorator accepts optional store locators, and template syntax allows fine-grained store selection. The default store continues to work unchanged for backward compatibility.

## Dialog

### Child Dialog Services with Default Settings

Large applications often need preconfigured dialog services for different contexts: confirmation dialogs, form dialogs, notification dialogs. The new child dialog service API ([#2300](https://github.com/aurelia/aurelia/pull/2300)) lets you create scoped dialog services with default settings that inherit from the parent:

```typescript
const confirmService = dialogService.createChild({
  lock: true,
  overlayDismiss: false
});

// All dialogs opened via confirmService inherit these defaults
confirmService.open({ component: ConfirmDialog });
```

This eliminates repetitive configuration and provides cleaner separation of dialog concerns.

## Router Enhancements

Beta 27 brings five router improvements that address common pain points.

### Aggregated Route Parameters

The new `getRouteParameters()` helper ([#2264](https://github.com/aurelia/aurelia/pull/2264)) gives nested components clean access to ancestor parameters without walking parent chains. For a route like `company/:companyId/project/:projectId/task/:taskId`, deeply nested components can now:

```typescript
import { getRouteParameters } from '@aurelia/router';

// Get all parameters from the route hierarchy
const params = getRouteParameters(this);
console.log(params.companyId, params.projectId, params.taskId);
```

The helper supports configurable merge strategies when parameter names collide across route levels.

### The `loaded` Lifecycle Hook

The new `loaded` hook ([#2267](https://github.com/aurelia/aurelia/pull/2267)) fires after the component swap completes, once per navigation. This complements `loading` (which fires before swap) and provides a dedicated point for initialization that requires the component to be fully attached:

```typescript
export class MyComponent {
  loading(params) {
    // Before swap - fetch data
  }

  loaded(params) {
    // After swap - initialize third-party libraries that need DOM
  }
}
```

### Navigation Direction Detection

Know whether the user navigated forward or backward with the new `isBack` property ([#2243](https://github.com/aurelia/aurelia/pull/2243)):

```typescript
loading(params, instruction) {
  if (instruction.navigation.isBack) {
    // Restore scroll position, skip animations, etc.
  }
}
```

### External Link Detection

The router now auto-detects absolute URLs, protocol links, and protocol-relative hrefs as external ([#2270](https://github.com/aurelia/aurelia/pull/2270)). No more `external` attributes on every outbound link. You can configure an allow-list for domains that should still use router navigation.

## Repeat Improvements

### The `$previous` Variable

A new opt-in `contextual` property enables the `$previous` variable in repeaters ([#2261](https://github.com/aurelia/aurelia/pull/2261)). This unlocks patterns that previously required external state:

```html
<!-- Section headers when category changes -->
<div repeat.for="item of items; contextual: true">
  <h2 if.bind="item.category !== $previous?.category">
    ${item.category}
  </h2>
  <div>${item.name}</div>
</div>

<!-- Highlight changes in a changelog -->
<div repeat.for="entry of changelog; contextual: true">
  <span class="${entry.value !== $previous?.value ? 'changed' : ''}">
    ${entry.value}
  </span>
</div>
```

Since contextual properties add computation overhead, they're disabled by default. Enable them only where you need access to `$previous`.

## Observation

### Manual Getter Dependencies

The `@computed` decorator now accepts explicit dependencies ([#2260](https://github.com/aurelia/aurelia/pull/2260)), giving you precise control over when getters re-evaluate:

```typescript
@computed('items.length', 'taxRate')
get total() {
  return this.items.reduce((sum, i) => sum + i.price, 0) * (1 + this.taxRate);
}
```

Options include flush timing (`sync` vs async) and deep observation:

```typescript
@computed({ deps: ['cart'], deep: true })
get cartTotal() {
  // Re-evaluates when any cart item property changes
}
```

Note: deep observation doesn't observe newly added properties. Replace the entire object to trigger updates.

## UI Virtualization

The virtualization plugin received a comprehensive overhaul ([#2178](https://github.com/aurelia/aurelia/pull/2178)):

- **Variable item heights**: render items of different sizes (use cautiously, layout calculations are expensive)
- **Horizontal scrolling**: virtualize horizontal lists alongside vertical ones
- **Infinite scrolling**: event-driven loading as users approach content boundaries
- **Better configurability**: bindable properties for sizing and behavior
- **Improved error handling**: centralized error codes with descriptive messages

## Validation

### Cross-Field Validation with `ensureGroup`

The new `ensureGroup` method ([#2217](https://github.com/aurelia/aurelia/pull/2217)) handles validation scenarios where fields depend on each other:

```typescript
ValidationRules
  .ensureGroup()
  .satisfies((model) => model.endDate > model.startDate)
  .withMessage('End date must be after start date')
  .on(MyModel);
```

## Plugin Conventions

### HTML Transformation

The new `transformHtml` option ([#2320](https://github.com/aurelia/aurelia/pull/2320)) lets you modify HTML during the build process. This is useful for preprocessing, optimization, or custom syntax.

### Template Type-Checker Improvements

The template type-checker now supports `<let>` declarations ([#2223](https://github.com/aurelia/aurelia/pull/2223)) and `with` bindings ([#2224](https://github.com/aurelia/aurelia/pull/2224)) with proper scope visibility, catching more errors at build time.

## Bug Fixes

This release includes 16 bug fixes across the framework:

- **HMR**: Fixed doubly rendered elements and broken state on hot reload ([#2206](https://github.com/aurelia/aurelia/pull/2206), [#2316](https://github.com/aurelia/aurelia/pull/2316), [#2326](https://github.com/aurelia/aurelia/pull/2326))
- **Router**: Fixed error recovery, URL generation, `nav: false` exceptions, and hash fragment paths ([#2263](https://github.com/aurelia/aurelia/pull/2263), [#2254](https://github.com/aurelia/aurelia/pull/2254), [#2251](https://github.com/aurelia/aurelia/pull/2251), [#2218](https://github.com/aurelia/aurelia/pull/2218))
- **Binding**: Property bindings now stop reacting during controller deactivation ([#2293](https://github.com/aurelia/aurelia/pull/2293))
- **Computed observers**: Callback timing now matches normal observer behavior ([#2249](https://github.com/aurelia/aurelia/pull/2249))
- **Bindables**: Underscores in attribute names are preserved (`_my_prop` stays `_my_prop`) ([#2241](https://github.com/aurelia/aurelia/pull/2241))
- **au-compose**: Surrogate attributes now apply correctly to host elements ([#2272](https://github.com/aurelia/aurelia/pull/2272))
- **Web components**: Observed attribute naming conventions are now enforced ([#2298](https://github.com/aurelia/aurelia/pull/2298))
- **CSS Modules**: Fixed processing for static class attributes in nested templates ([#2226](https://github.com/aurelia/aurelia/pull/2226))
- **Build**: Fixed package.json exports for the `development` condition and added Node 22 compatibility ([#2321](https://github.com/aurelia/aurelia/pull/2321), [#2327](https://github.com/aurelia/aurelia/pull/2327))

## Breaking Changes

### DOM Queue Removed

The old `platform.domQueue` and `platform.taskQueue` APIs have been removed ([#2305](https://github.com/aurelia/aurelia/pull/2305)) in favor of the queue implementation introduced in Beta 25. If you're using these directly, migrate to the new queue API:

```typescript
import { queueTask, tasksSettled } from 'aurelia';

queueTask(() => {
  // Your queued work
});

await tasksSettled();
```

## Contributors

Thanks to everyone who contributed to this release:

- [@bigopon](https://github.com/bigopon)
- [@fkleuver](https://github.com/fkleuver)
- [@Sayan751](https://github.com/Sayan751)
- [@Vheissu](https://github.com/Vheissu)
- [@RubenMaguregui](https://github.com/RubenMaguregui)

## Full Changelog

- [https://github.com/aurelia/aurelia/compare/v2.0.0-beta.26...v2.0.0-beta.27](https://github.com/aurelia/aurelia/compare/v2.0.0-beta.26...v2.0.0-beta.27)
- [https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.27](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.27)

## Upgrade Guide

1. Update your `@aurelia/*` dependencies to `2.0.0-beta.27`
2. Replace any `platform.domQueue` or `platform.taskQueue` usage with the new queue API
3. Test your app thoroughly, this is a large release

Beta 27 represents months of work across state management, routing, rendering, and SSR foundations. The groundwork being laid now will enable server-side rendering and ahead-of-time compilation in upcoming releases. As always, join us on [Discord](https://discord.gg/TPV3cvCZhz) if you have questions or encounter issues.
