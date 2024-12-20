+++
title = "Aurelia 2 Update - Alpha 20"
authors = ["Dwayne Charrington"]
description = "Not wanting to spam you all every time we release a new alpha update for Aurelia 2, we have been consolidating multiple release notes (as you might have noticed the last couple of updates)."
date = 2021-09-07T10:45:55.994Z
lastmod = 2021-09-07T10:45:55.994Z
+++

Not wanting to spam you all every time we release a new alpha update for Aurelia 2, we have been consolidating multiple release notes (as you might have noticed the last couple of updates).

In releases 17, 18, 19 and now 20, we have been focused on extensive refactoring work to solidify the underlying core of Aurelia and dependencies. We have put out 20 releases (and counting) of Aurelia 2 alpha because we want to ensure that the core is stable as we move into beta. We want to avoid any significant breaking changes in beta releases (and up) in the spirit of proper versioning.

## Alpha 20

The `au-slot` element [now works with the `containerless` attribute](https://github.com/aurelia/aurelia/commit/9fa0a06) allowing you to clean your markup by removing unnecessary HTML elements from the DOM.

[The router now supports component factories](https://github.com/aurelia/aurelia/commit/8541b48). Similarly to other routing libraries, you might be familiar with the syntax: `component: () => import('./my-component')` on the route allowing your routes to be split and lazily loaded using bundlers like Webpack.

## Alpha 19

In this release, [we primarily worked on the store plugin](https://github.com/aurelia/aurelia/blob/master/docs/CHANGELOG.md#200-alpha19-2021-08-29), fixing numerous bugs reported.

## Alpha 18

We introduced [quite a significant new feature](https://github.com/aurelia/aurelia/commit/998b91c) in alpha 18 (did you notice?) that now allows attribute capturing and spreading using the new `...$attrs` syntax.

With this new feature, we can relay attributes from a parent element to the children inside of it. And because Aurelia 2 has good documentation, we have an entire section dedicated to this new functionality [here](https://docs.aurelia.io/getting-to-know-aurelia/introduction/attributes-transferring).

To read through a complete changelog of bug fixes, features and refactorings, you can view the changelog [here](https://github.com/aurelia/aurelia/blob/master/docs/CHANGELOG.md) if these update posts are not enough to satiate your thirst for information.


## Until next time

As always, we want to thank the community for their continued support, and we can't wait to finally get Aurelia 2 out there into the wild in its more completed form.

If you ever have any questions or issues, please don't hesitate to reach out. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues). Or maybe just come over to the [Aurelia Discord channel for some chat](https://discord.gg/RBtyM6u).