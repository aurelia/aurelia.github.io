+++
title = "Aurelia 2 Update - Alpha 26"
author = "bigopon"
description = "Fixes for template compiler, promise controller and computed observer."
date = 2022-03-14T11:16:50.681Z
lastmod = 2022-03-14T11:16:50.681Z
+++

## Alpha 26

There was an inconsistency in The template compiler where it ignores new attribute value when an attribute pattern transforms into a custom attribute without binding command. This is now fixed [6a190b8](https://github.com/aurelia/aurelia/commit/6a190b89ce7eb2d0eaad64619b9a7fa7ee8699a6). With this fix, applications can employ custom attribute and attribute pattern combo to create short, expressive and powerful attribute expressions in templates.

## Alpha 25

The `router` package has been renamed to `router-lite`. This is to prepare for the come back of the original router. Our plan forward is to have
  * the original router with both configuration, and component based routing as the default router
  * the router-lite as an alternative for configuration (v1 style) focused routing. This is suitable for v1 migration, and applications that require very light weight routing solution.

## Alpha 24

There are a few small fixes in this release:

* A fix on the computed observer where it throws when used with multiple getter layers [09971a2](https://github.com/aurelia/aurelia/commit/09971a2)
* A fix on the `promise` controller where it's yielding rejection error confusingly while cancelling a stale rendering. [0e5d75d](https://github.com/aurelia/aurelia/commit/0e5d75ddc0b40330e68bbab3a2b38ddcf969fd99)

Thanks to [jwx](https://github.com/jwx) for reporting both of those bugs.

## Alpha 23

A new feature to our `bindable` decorator: ability to recognize type via the `type` configuration. Please head to [this section of the bindable doc](https://docs.aurelia.io/getting-to-know-aurelia/components/bindable-properties#bindable-coercion) for more information.

## Alpha 22

The ability to destructure map in repeat templates is back, thanks to [Sayan](https://github.com/sayan751).
Now it can juts be `repeat.for=[k, v] of map` like v1.

From

```html
<p repeat.for="pair of map">key:${pair[0]} | value: ${pair[1]}</p>
```

to

```html
<p repeat.for="[k,v] of map">key:${k} | value: ${v}</p>
```

## Alpha 21

House keeping work mostly to trim the output size when minify the bundle.

## Until next time

As always, we want to thank the community for their continued support, and we can't wait to finally get Aurelia 2 out there into the wild in its more completed form.

If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u).