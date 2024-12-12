+++
title = "Aurelia 2 Update - Alpha 16"
author = "bigopon"
description = "For the last month, since alpha-12, the focus of the Aurelia team has been v1 feature parity besides various bugs fixing, refactoring, performance & documentation improvements."
date = 2021-08-09T23:40:49.513Z
lastmod = 2021-08-09T23:40:49.513Z
+++

For the last month, since alpha-12, the focus of the Aurelia team has been v1 feature parity besides various bugs fixing, refactoring, performance & documentation improvements.

The web-component plugin has been ported to v2. And web-components (WC) (custom)elements defined via Aurelia work independently with Aurelia components (elements), this enable mix-matching Aurelia components and WC elements together, enabling even more flexible, powerful & dynamic composition. The plugin also supports built-in element extensions, allowing simple HTML DOM. For the plugin documentation, visit [https://docs.aurelia.io/developer-guides/web-components](https://docs.aurelia.io/developer-guides/web-components).

Another feature that is in this batch is `enhance`. HTML enhancement is now as simple and ceremony-free as it is in v1, as the way `enhance` works in v2 has been made similar to the way it does in v1. It's a realization that this usage of `enhance` is easier and more common than the previously experimented API. It can be as plain as the following:

```typescript
aurelia.enhance({
  host,
  component: { name: 'Aurelia', message: 'world' }
})
```

For `enhance` documentation, visit [https://docs.aurelia.io/getting-to-know-aurelia/app-configuration-and-startup#enhance](https://docs.aurelia.io/getting-to-know-aurelia/app-configuration-and-startup#enhance).

With some bugs around attribute parser fixed, `then`/`catch` syntaxes in `promise` are now available again. Which means it can be as simple as the following:

```html
<div promise.bind="fetchUserProfile()">
  <div then="data">${data.name}</div>
  <div catch="err">${err.message}</div>
</div>
```

instead of having to write:

```html
<div promise.bind="fetchUserProfile()">
  <div then.bind="data">${data.name}</div>
  <div catch.bind="err">${err.message}</div>
</div>
```

For attribute pattern documentation, visit [https://docs.aurelia.io/developer-guides/attributepattern](https://docs.aurelia.io/developer-guides/attributepattern). For promise documentation, visit [https://docs.aurelia.io/getting-to-know-aurelia/introduction/built-in-template-features/promise.bind](https://docs.aurelia.io/getting-to-know-aurelia/introduction/built-in-template-features/promise.bind).

Another work related to syntax is the way binding command & template compiler work together has been slightly changed, so that now binding commands will take care of the expression parsing. This is to prepare for our incoming features related to attribute transferring, (or spreading, sort of) which has been long requested.

And finally, the way dist files are built has been improved around prop mangling. Now with a name cache configuration for Terser, it's guaranteed that a certain private property is always mangled to a certain letter. This may help if some applications need to work around something before an RFC to add a feature that was not anticipated in Alpha. There will be a section in the official documentation to list all of the private properties mapping.


## Until next time

Thank you to everyone for their continued support, especially those who have contributed to Aurelia 2 and helped get it to its current point. If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u).