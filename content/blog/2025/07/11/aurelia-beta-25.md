+++
title = "Aurelia 2 Beta 25: Binding updates, HTML Dialog, State Middleware and Router Rename"
authors = ["Dwayne Charrington"]
description = "Beta 25 is here with async computed observers, native html dialog, state middleware, router rename, and more."
date = 2025-07-11T10:00:00Z
lastmod = 2025-07-11T10:00:00Z
tags = ["aurelia2", "release"]
+++

Beta 25 is more than just another beta release. We've transformed computed observers from sync to async, swapped in a native HTML dialog, renamed our router packages, and added middleware support into state management. On top of that there are new utilities for recurring tasks, memoized selectors, path generation, context-aware value converters, and over a dozen bug fixes.

## Breaking Changes

### Binding - computed observers notify asynchronously by default  
Computed observers used to fire change notifications as soon as a dependency changed. Now they wait until the next tick before notifying subscribers. 

This switch from sync to async:

- Ensures change notifications happen at predictable times instead of in the middle of render or update cycles  
- Avoids platform limitations where requestAnimationFrame might not make sense (SSR, WebWorkers, custom hosts)  
- Batches computed updates into a single tick-based queue rather than the old raf queue  

In Beta 25 you can import the queue API from the runtime package:

```ts
import {
  Task,
  RecurringTask,
  getRecurringTasks,
  queueTask,
  queueAsyncTask,
  queueRecurringTask,
  runTasks,
  tasksSettled,
  TaskAbortError,
  TaskStatus
} from 'aurelia';
```

Example usage:

```ts
import { queueTask, tasksSettled } from 'aurelia';

queueTask(() => {
  console.log('all computed updates flushed');
});

await tasksSettled();
```

Given the extent of these changes, it is possible that there might be unintended side effects or issues that we have not run into. This is why we are creating some space in releases before release candidate. If you encounter any issues around observation, please do not hesitate to file an issue on our GitHub repository.

### Dialog – native HTML `<dialog>` is now the default renderer  
We ditched the old overlay hacks and made the browser's `<dialog>` element our go-to. 

Highlights:

- Overlay is optional - skip it if you don't need a backdrop  
- Animations via CSS show/hide options, globally or per `open()` call  
- `DefaultDialogConfiguration` renamed to `DialogConfigurationClassic`  
- Internal dialog event manager and animator APIs are now private  

Opening a dialog looks like:

```ts
dialogService.open({
  component: MyDialog,
  options: { show: 'fadeIn 200ms ease', hide: 'fadeOut 150ms ease' }
});
```

## Router - clearer package names  
We renamed the router packages and cleared up some ambiguity around routing packages.

- `@aurelia/router-lite` becomes `@aurelia/router` (default) 
- `@aurelia/router` becomes `@aurelia/router-direct`

Just update your imports and you're good to go.

## Vite Plugin – upgrade to Vite 7  
Our Vite plugin now targets Vite 7. You'll pick up the latest builder features and fixes. Older Vite versions will still work, but we recommend bumping to v7.

## New Features

- **queueRecurringTask** 
  Schedule a callback every tick until you cancel it. Perfect for polling or continuous checks.  
- **State middleware support** 
  Hook into every dispatched action to log, measure or transform before reducers run.  
- **Memoized selectors** 
  Create selectors that cache results until inputs change for zero-waste state reads.  
- **Path generation** 
  Build URLs from named routes instead of string building.  
- **Value converter context**
  Value converters receive binding source, target element and more so you can write smarter converters.

## 🐞 Bug Fixes

Over a dozen fixes that smooth out rough edges:

- **au-compose** stops re-composing when detached  
- **Binding** interpolation reacts to array mutations and skips updates once unbound  
- **Queue** cancellation no longer triggers unhandledRejection  
- **Runtime-HTML** repeater avoids unnecessary DOM churn  
- **i18n** translation binding checks `isBound` to prevent early updates  

Other fixes cover Vite build mode detection, object property wrapping, URI decoding in route-recognizer and more.

## Storybook

Some of you might have already known, but we've had a Storybook plugin for Aurelia for a little while now, but it only worked with Vite applications. The `@aurelia/storybook` package has been updated to work with Webpack too. We also added in some example stories and made it compatible with the latest Storybook 9 release https://github.com/aurelia/storybook/commit/8059f105218278a9e01ade919adea7ab9acb031c

## Aurelia CLI

The CLI that powers the `npx makes aurelia` scaffolding has also undergone some improvements.

- Added support for TailwindCSS into the app creation process https://github.com/aurelia/new/pull/122
- Added support for Storybook (Webpack and Vite apps) https://github.com/aurelia/new/pull/124
- When creating a new Aurelia 2 application with routing, there are default routes https://github.com/aurelia/new/pull/125
- We fixed our Shadow DOM implementation to work for all bundlers https://github.com/aurelia/new/pull/126

## Documentation updates

We are continually fine-tuning and improving the docs for Aurelia 2. In this release we made some nice improvements to the docs, to the point where listing all of the changes we made would require a separate update. A special thank you to the community for providing us valuable feedback and filing issues around this crucial aspect of Aurelia.

## Welcome New Contributor

Shout-out to [@graycrow](https://github.com/graycrow) for their [first PR](https://github.com/aurelia/aurelia/pull/2171) on translation binding.

## Full Changelog

- [https://github.com/aurelia/aurelia/compare/v2.0.0-beta.24...v2.0.0-beta.25](https://github.com/aurelia/aurelia/compare/v2.0.0-beta.24...v2.0.0-beta.25)
- [https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.25](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.25)

## Upgrade Guide

1. Update your `@aurelia/*` dependencies to `2.0.0-beta.25` and Vite to v7  
2. Change computed observer imports if you use the queue API  
3. Rename router package imports  
4. Test your app and join us on Discord if you hit issues

Beta 25 is packed with foundational changes that set the stage for smoother, more predictable apps as we head towards rleease candidate. Dive in and let us know what you build.

If you have any questions or need assistance, please join us on [Discord](https://discord.gg/TPV3cvCZhz) and reach out to the team.