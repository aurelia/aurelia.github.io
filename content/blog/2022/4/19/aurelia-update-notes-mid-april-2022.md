+++
title = "Aurelia update notes - mid April 2022"
authors = ["bigopon"]
description = "The original router is back to v2, along with a better tooling experience."
date = 2022-04-19T01:41:59.594Z
lastmod = 2022-04-19T01:41:59.594Z
+++

Since the last updates, there have been several features, fixes and refactoring.

## Alpha 28

With this release, the original v2 router is back in the core repo. Applications can start using this router via
```ts
import { RouterConfiguration } from '@aurelia/router';
```

Note that the existing as follows:
```ts
import { RouterConfiguration } from 'aurelia';
```

still points to the router lite, and is equivalent to:

```ts
import { RouterConfiguration } from '@aurelia/router-lite';
```

In a near future release (alpha 29 or alpha 30), the above values will be swapped, and it will be as follows:

```ts
import { RouterConfiguration } from 'aurelia';
// is the same with
import { RouterConfiguration } from '@aurelia/router';
```

For existing applications that want to continue to use the `@aurelia/router-lite`, do:
```ts
import { RouterConfiguration } from '@aurelia/router-lite';
```

There's also a fix related to CSS modules and Tailwind in this release: previously, having a colon in class names while using css module will cause an exception to be thrown:

```html
<div class="md:message">${message}</div>
```
Now the above should work as expected.

## Alpha 27

In this release, Parcel2 support is added, and the convention now works with `index.js` convention of Nodejs, thanks to [3cp](https://github.com/3cp). With this, devs have more options to bundle and decide their component file names. This means for the following file structure:
```
FooBar
  | index.js
  | index.html
```
the following html will work as expected:
```html
<import from="FooBar">
```

Some other bug fixes are also packed in this release:

* local element should now able to see the owning element dependencies [#1375](https://github.com/aurelia/aurelia/issues/1375), thank [michaelnero](https://github.com/michaelnero) for reporting this.
* `case` now only creates its view when it's actually matched with the value of the owning `switch` attribute [#1372](https://github.com/aurelia/aurelia/issues/1372).
* the dev build should now have proper error message, so applications in development will see them in full. Previously there was a bug in the build script and it caused our dev dist to be almost the same with prod dist, making it difficult during development. Applications that were created before can do the 2 following steps to enable better error messages:
  * upgrade to `alpha 27` or later
  * add the following `alias` to the webpack `resolve` configuration: https://github.com/aurelia/new/blob/614a3c4824bbb4ea2cf5166e3cc3473de775cec8/webpack/webpack.config.js#L102-L126

## V1 updates

There has been a series of new releases for v1 core packages to resolve a security issue reported at https://github.com/advisories/GHSA-m6j2-v3gq-45r5. Thanks to [josundt](https://github.com/josundt) for creating an issue for it at https://github.com/aurelia/framework/issues/992. The stance used to be avoid throwing unnecessarily, and clear documentation insisting that applications must have an appropriate sanitizer of their owns to deal with arbitrary user input, though it's probably better throwing an error when the default HTML sanitizer is used instead. And thanks to this, a few v1 repos have received TS conversion, build & pipeline upgrades, making them friendlier to contribution, and require smaller maintenance effort for future changes.

While upgrading, you may experience some module duplications, if that is the case, best check and make sure that you only have 1 version of the core packages.

## Until next time

As always, we want to thank the community for their continued support, and we can't wait to finally get Aurelia 2 out there into the wild in its more completed form.

If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u).