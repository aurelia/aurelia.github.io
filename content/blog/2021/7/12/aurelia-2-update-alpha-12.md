+++
title = "Aurelia 2 Update - Alpha 12"
authors = ["bigopon"]
description = "A minor update on various improvements of Aurelia 2."
date = 2021-07-12T00:27:33.000Z
lastmod = 2021-07-12T00:27:33.000Z
+++

There have been a few improvements since our last update for Aurelia 2 alpha 8. The focus of our progress has been introducing various missing powerful features from v1, namely template compilation hooks, caching control of `[if]`/`[else]` and DI factory resolution.

It's now possible to hook into compilation with `compiling`, there is also a powerful `@factory` decorator for instantiating services.
An example of registering a `compiling` hook globally is as follow:

```ts
import { templateCompilerHooks } from 'aurelia';

@templateCompilerHooks
export class A11yScanner {
  compiling(template) {
    template.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('alt')) {
        console.warn('no alt on img');
      }
    });
  }
}

Aurelia.register(A11yScanner);
```

The hydration story of v2 also got better with the introduction of an injectable `IHydrationContext`, which allows an application to capture the hydration hierarchy, which helps components learn about the context of their usage, empowering devtool integration.

Another v1 feature that is now in v2 is the caching control ability of `if`/`else`. An example is as follow:

```html
<my-component if="value.bind: condition; cache: false">Created every time {condition} changes false -> true<my-component>
<my-other-component else>Created every time {condition} changes true -> false<my-component>
```
Thanks [`@rzasinets`](https://github.com/rzasinets) for the issue at https://github.com/aurelia/aurelia/issues/1230

In addition, `<au-compose>` got some ergonomic enhancement: `containerless` now works with `<au-compose>`, which should help remove unnecessary wrapper code while dynamically composing components.

`<au-render>` also got some new capability: it's now possible to use component name to render, instead of definition. An example is as follow:

```html
<import from="./weekly-report"></import>
<import from="./monthly-report"></import>
<import from="./annually-report"></import>

Select report:
<select value.bind="reportType">
  <option>weekly</option>
  <option>monthy</option>
  <option>yearly</option>
</select>
<au-render if.bind="reportType" component="${reportType}-report">
```
It's a small change that should improve the ergonomic and usefulness of the `<au-render>`. If you have a large Aurelia v1 app, this will make the migration a little easier if you currently rely on `compose`.

Aside from the features, the core is also getting cleaned up to be leaner and faster. These updates also lead us to the following news about the distributable story: there are now three variants for development, production with bundler and vanilla usages.

The dist files of each package now look like this:

```
📁 esm
  📜 index.dev.js
  📜 index.js
  📜 index.prod.js
```

The difference between the dist can be summarized per the following table:

| name | error | warning | logging | sourcemap | minification | description |
| - | - | - | - | - | - | - |
| **index.dev.js** | full message | ✔ | ✔ | inlined | - | For development + bug reporting |
| **index.js** | code | - | - | point to source | - | For application production build |
| **index.prod.js** | code | - | - | - | ✔ | For online IDE, vanilla app, CDN usages |

Because of this change, an application built for production should be much leaner as all debugging code will be out of the final bundle. At the same time, Aurelia can provide more descriptive & comprehensive possible error messages without weighing down your application. Internal/private properties are also being considered mangled in non-dev builds to improve bundle size and performance.

To accommodate these changes, coded error messages \(https://docs.aurelia.io/reference/error-messages) have been introduced as a point of reference, with some possible resolution so that issues can be fixed quickly.

## Documentation

Last but not least, there is a new batch of tutorials, which can be seen in the tutorial section of our v2 doc at https://docs.aurelia.io. A simple example to get going is a crypto tracker at https://docs.aurelia.io/tutorials/building-a-realtime-cryptocurrency-price-tracker. An obligatory todo app, just in case :wink:, maybe come and check it out! https://docs.aurelia.io/tutorials/building-a-todo-application

These new introductory learning resources are a continuation of the ongoing documentation effort, aiming to produce and grow useful educational materials to benefit everyone in our community.

If you have any tutorials or learning resources you would like to contribute, all community contributions are welcomed to help others learn how to build applications with Aurelia 2.

## Until next time

Thank you to everyone for their continued support, especially those who have contributed to Aurelia 2 and helped get it to its current point. If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u)