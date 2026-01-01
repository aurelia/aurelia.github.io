+++
title = "Aurelia 1 to Aurelia 2 Migration Roadmap"
authors = ["Dwayne Charrington"]
description = "A practical, evergreen guide to planning and executing an Aurelia 1 to Aurelia 2 migration without losing momentum."
date = 2026-01-01T10:00:00Z
lastmod = 2026-01-01T10:00:00Z
tags = ["migration", "aurelia2", "aurelia1"]
+++

Aurelia 2 ships faster builds, modern tooling, and clearer composition patterns, but many teams
still run production workloads on Aurelia 1. This guide is an actionable roadmap you can revisit
whenever your organization is ready to upgrade. It combines planning steps with technical
checkpoints so you can move steadily without losing momentum.

---

## Migration at a glance

1. **Discover**: inventory routes, global resources, plugins, bundlers, and UX-critical flows.
2. **Decide**: pick a migration strategy (strangler shell, vertical slice, or in-place upgrade).
3. **Prepare**: scaffold Aurelia 2 with modern tooling, shared design tokens, and DI modules.
4. **Port**: move features in thin slices, paying attention to routing, composition, and state.
5. **Validate**: keep automated tests, visual diffs, and build checks green for both versions.
6. **Decommission**: remove Aurelia 1 dependencies after traffic fully shifts to Aurelia 2.

Keep this loop visible in your project tracker so stakeholders always know the current phase.

## Key mindset shifts from Aurelia 1 to 2

- **Explicit registration wins**: Instead of `aurelia.use` chains, Aurelia 2 relies on explicit
  DI registrations. Treat every reusable asset as a registration target and centralize them.
- **Routing is a module you register**: Register `RouterConfiguration` and use `@aurelia/router`
  for migrations. Expect `<au-viewport>` and route lifecycle hooks for guards and data loading.
- **Template and composition updates**: `import` replaces `require`, `.trigger` replaces
  `.delegate`, and `<compose>` becomes `<au-compose>` with `template` and `component` properties.
- **Lifecycle timing is more explicit**: Aurelia 2 adds a `bound` hook and supports async
  lifecycles. Review code that relies on `activate`, `bind`, or `attached` timing.
- **State strategy upgrade**: Prefer `@aurelia/state` or DI-backed services. Define clear state
  boundaries instead of scattered event aggregation.
- **Modern build tooling**: Vite is the default recommendation, with Webpack and Parcel supported.
  Plan time to replace RequireJS or SystemJS.

## Common gotchas (and how to dodge them)

### 1. Bootstrapping and DI

Aurelia 1 relied heavily on convention-based bootstrapping. Aurelia 2 wants explicit modules.

```ts
// Aurelia 1
export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .globalResources(['./value-converters/currency'])
    .plugin('my-plugin');

  aurelia.start().then(() => aurelia.setRoot('app'));
}
```

```ts
// Aurelia 2
import { Aurelia } from 'aurelia';
import { CurrencyValueConverter } from './value-converters/currency';
import { MyPlugin } from './plugins/my-plugin';

Aurelia
  .register(CurrencyValueConverter, MyPlugin)
  .app(MyApp)
  .start();
```

**Fix**: create `resources/index.ts` (or similar) that registers every shared component so the
rest of the app can import a single module. Aurelia 2 favors explicit injection via `resolve`
(or `@inject`), so audit classes that relied on implicit injection.

### 2. Global resources vs modules

`PLATFORM.moduleName` and string-based global resources disappear in Aurelia 2. If your Aurelia 1
app dynamically loaded components with strings, replace those lookups with explicit imports and
registrations. Spot-check code for:

- `PLATFORM.moduleName()` wrappers
- `config.globalResources([...])`
- Plugin `configure` functions that expect `FrameworkConfiguration`

Each occurrence needs a module-based registration in Aurelia 2. Features, plugins, and resources
are all just registrations now.

### 3. Template syntax updates

Aurelia 2 keeps the spirit of the template syntax, but a few commands and elements change:

- `require` becomes `import`
- `.delegate` becomes `.trigger`
- Replaceable parts use `<au-slot>` instead of `replaceable`

```html
<!-- Aurelia 1 -->
<require from="./my-card"></require>

<!-- Aurelia 2 -->
<import from="./my-card"></import>
```

### 4. Composition changes

Dynamic composition moved to `<au-compose>`, and the property names changed:

- `view` is now `template`
- `view-model` is now `component`
- String values refer to registered custom element names, not module IDs

```html
<au-compose template.bind="templatePath"
            component.bind="componentInstance">
</au-compose>
```

Ensure string-based composition points at registered elements via `dependencies`, `<import>`, or
global registration.

### 5. Routing differences

Use `@aurelia/router` and register it during bootstrap. Routing is more explicit in Aurelia 2,
with viewports, lifecycle hooks, and configuration colocated with components.

```ts
import { RouterConfiguration } from '@aurelia/router';

Aurelia
  .register(RouterConfiguration)
  .app(MyApp)
  .start();
```

Key migration shifts to watch:

- Replace `<router-view>` with `<au-viewport>`
- Move pipeline steps to lifecycle hooks such as `canLoad` and `canUnload`
- Replace `configureRouter` patterns with component routes or router customization
- Ensure string route targets map to registered components via `dependencies` or `<import>`

### 6. Lifecycle timing changes

Lifecycle timing is more explicit in Aurelia 2. The new `bound` hook exists for scenarios where
values are not ready during `bind`, and lifecycle methods support async operations. Review any
code that assumes synchronous ordering between `bind`, `attached`, and `activate`.

### 7. Binding semantics and reactivity

- Attribute and property casing is explicit. Audit `@bindable` names to avoid casing mismatches.
- Use `.two-way` only when you need bidirectional updates.
- Binding errors surface in development. Treat warnings as migration work items.

### 8. State management

If you used `@aurelia/store-v1`, plan a migration to `@aurelia/state` or simplify to DI-backed
services where global state is not required. Ensure action handlers return new state objects and
move any middleware to the newer `@aurelia/state` pipeline.

### 9. Build system shifts

- Replace `PLATFORM.moduleName`-based lazy loading with dynamic imports supported by your bundler.
- Ensure `src/html.d.ts` (or equivalent) exists so `.html` templates load cleanly in TypeScript.
- Karma + JSPM stacks are brittle. Use Vite for component workflows and Playwright or Cypress for
  E2E coverage.

### 10. Third-party plugins

Most community plugins now export DI-friendly registration objects. When migrating:

1. Check whether an Aurelia 2-compatible version exists.
2. If you are feeling game, port Aurelia 1 plugins that have not been updated yet.
3. If you would rather not, ask on Discord or Discourse and someone in the community might help.

## Suggested migration sequence

1. **Create a migration workbook**: track every route, plugin, and shared service. Include
   owners, dependencies, and complexity scores.
2. **Bootstrap Aurelia 2**: scaffold with Vite + TypeScript, copy design tokens, register shared
   assets, and add `@aurelia/router` early.
3. **Port leaf nodes first**: standalone custom elements, value converters, and services build
   confidence in the DI setup.
4. **Normalize templates and composition**: update `import`, `.trigger`, and `<au-compose>` usage
   before you migrate complex flows.
5. **Rebuild navigation**: mirror your top-level routing structure with `<au-viewport>` and
   lifecycle hooks. Verify guards, redirections, and query params.
6. **Align on shared state**: establish `@aurelia/state` or DI-backed services before porting
   feature-heavy screens.
7. **Validate and compare**: keep tests green, compare telemetry, and fix regressions before
   expanding rollout.
8. **Flip traffic gradually**: route a percentage of users (or internal testers) to Aurelia 2.
9. **Retire Aurelia 1**: remove unused dependencies, archive documentation, and update onboarding
   guides so new engineers only interact with Aurelia 2.

## Readiness checklist

- [ ] Migration strategy chosen and communicated
- [ ] Inventory of global resources, routes, and plugins complete
- [ ] Aurelia 2 shell (with `@aurelia/router` + bundler) scaffolded
- [ ] Shared DI module exports all reusable components and services
- [ ] Templates and composition updated for migrated slices
- [ ] Critical flows replicated in Aurelia 2 and covered by automated tests
- [ ] Monitoring and alerts configured for the new deployment path
- [ ] Aurelia 1 dependencies removed after cutover

---

## Closing thoughts

Migrating from Aurelia 1 is about aligning your frontend with the framework the core team
actively invests in. Use this roadmap as a repeatable playbook: inventory, plan, port, validate,
and retire. Whether you are preparing for a gradual strangler rollout or a focused rewrite of a
high-value feature, the combination of explicit DI, modern routing, and updated composition in
Aurelia 2 will pay dividends long after the migration dust settles.
