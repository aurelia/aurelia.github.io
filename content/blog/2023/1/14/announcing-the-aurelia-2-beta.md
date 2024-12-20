+++
title = "Announcing The Aurelia 2 Beta"
authors = ["Dwayne Charrington"]
description = "Announcing the beta release of Aurelia 2"
date = 2023-01-14T10:43:55.090Z
lastmod = 2023-01-14T10:43:55.090Z
+++


We know many of you have been waiting a while for this day. Aurelia 2 is now officially in beta. After an extensive alpha period, we are proud to finally get this out to you and ask the community to go forth and start building and testing.

It is no secret that the last few years have been difficult for everyone. The unforeseen pandemic uprooted the lives of many, including some on our nimble Aurelia core team. Despite setbacks and challenges, the team has never waivered in its commitment to getting Aurelia 2 into your hands.

First and foremost, we want to thank the community for their patience and support. We understand that many of you have been waiting for Aurelia 2, especially in a professional capacity and eagerly awaiting its release. Without the support of our sponsors on [Open Collective](https://opencollective.com/aurelia) and our passionate community, this release would not be possible.

Let's also take a moment to marvel at the longevity of Aurelia. Debuting in January 2015, it's already had an eight-year run as a framework. During those eight years, Aurelia has had next to none breaking changes, and the API has remained stable and consistent. Many in the community and the core team have had Aurelia applications in production for almost the entirety of those eight years and Aurelia continues to be the choice of developers now with its stability and longevity.

## What's new?

Suppose you have followed along with the alpha releases, blog posts and GitHub commits. You might have noticed many new things in Aurelia 2, especially if you're coming from Aurelia 1. The template syntax and underlying ethos of standards compliance are still there, but we have taken things to the next level.

You might already be aware, but Aurelia 2 is a complete rewrite. As such, the code is not only cleaner and more performant, it is battle-tested with [tens of thousands of unit tests](https://github.com/aurelia/aurelia/tree/master/packages/__tests__) covering the bare metal components of Aurelia as well as the numerous packages it offers. It's the best-tested version of Aurelia yet.

Don't worry. Despite being a rewrite, Aurelia 2 retains much of what you love about Aurelia 1 and makes migration a relatively straightforward process. The syntax is the same, using Javascript classes for components remains the same, and many of your Aurelia 1 apps will port over to Aurelia 2 without issue.

This is a partial list, and we recommend reading through the [new docs](https://docs.aurelia.io/) to learn about what has changed and how Aurelia 2 can fit into your workflow.

- [Better documentation](https://docs.aurelia.io/). We wanted to ensure that Aurelia 2 had some of the best documentation. Not only did we document the framework, but we have tutorials and better resources to teach developers how to work with Aurelia 2.
- Powerful new [component lifecycle architecture](https://docs.aurelia.io/components/component-lifecycles). In Aurelia 1, component lifecycle hooks were rigid, and most hooks didn't support asynchronous code. In Aurelia 2, we have kept some familiar hooks and introduced some new ones, including support for async lifecycles, including an asynchronous attaching lifecycle.
- Support for [Shadow DOM](https://docs.aurelia.io/components/class-and-style-binding#shadow-dom).
- [Better testing support](https://docs.aurelia.io/developer-guides/testing). Aurelia 2 provides documentation and resources to test your applications with ease.
- A [powerful new @watch decorator](https://docs.aurelia.io/getting-to-know-aurelia/watching-data) that allows you to perform expression-based observation in your applications and react accordingly.
- [Template promises](https://docs.aurelia.io/templates/template-syntax#template-promises). You can now work with promises within templates without needing boilerplate in your view models.
- Support for [lambda expressions in templates](https://docs.aurelia.io/templates/lambda-expressions). Another convenience feature allows you to write lambda expressions in your templates, convenient for working with `Array.filter`, `Array.sort` and other things you would have previously used view model or value converter boilerplate for.
- The introduction of [app tasks](https://docs.aurelia.io/getting-to-know-aurelia/app-tasks) provides higher-level framework hooks for running code at different points of the framework lifecycle.
- [In-built portal support](https://docs.aurelia.io/getting-to-know-aurelia/portalling-elements). You can now portal content in your Aurelia applications using the new' portal' attribute. No additional dependencies are required.
- [Extensive observation support](https://docs.aurelia.io/getting-to-know-aurelia/observation) for observing changes in your Aurelia applications, including the familiar observer functionality.
- Better support for [Web Components](https://docs.aurelia.io/developer-guides/web-components).
- New [.class and .style binding properties](https://docs.aurelia.io/templates/class-and-style-bindings), allowing you to conditionally add classes and styles into your templates in a cleaner way (goodbye messy ternary expressions to display classes and styles).
- Support for [optional syntax](https://docs.aurelia.io/templates/template-syntax#optional-syntax) in interpolation expressions. You can now use `??`, `?.`, and a couple of other optional syntaxes in your templates.
- A new [State plugin](https://docs.aurelia.io/aurelia-packages/state) that works with Aurelia's binding system. This replaces Aurelia Store for most things, but Store is still there if you need it.
- Two new routers: `@aurelia/router`, with a rich set of features, and `@aurelia/router-lite`, smaller but still covering basic routing needs.

There is so much more; this is merely a glance at what is new. We will let you explore your own to discover what is new and exciting in Aurelia 2.

## Things that have changed since Aurelia 1

Despite limiting breaking changes where possible, Aurelia 2 does differ in a few ways.

- Strings for modules are gone. This means you no longer need to use `PLATFORM.moduleName` in your applications as you're working with dependencies instead of relying on string paths to resolve dependencies. This means things play nicely with bundlers, tree shaking and more. It also removes the boilerplate and makes things faster.
- The `<compose>` element is now `<au-compose>`, but it no longer works with strings for components. For more information, please see the documentation on the new way to compose [here](https://docs.aurelia.io/getting-to-know-aurelia/dynamic-composition).
- The `@computedFrom` decorator is gone. In Aurelia 1, getters need to have their dependencies provided, or the framework would use dirty-checking. In Aurelia 2, getters do not need their dependencies listed, as Aurelia will discover these for you. Just write `get myGetter() {}`, and Aurelia 2 will do the rest.
- The `.delegate` event binding mode is gone. In Aurelia 1, `delegate` resulted in strange behavior that made debugging difficult. We promoted this initially for performance reasons, but now you can use `trigger` without issue.
- A [powerful new router](https://docs.aurelia.io/routing/getting-started). The new router is different to the router in Aurelia 1, and this is where most developers porting Aurelia 1 applications to Aurelia 2 will spend their time (if you use routing), as the way you work with the router is different.

## Aurelia 2 roadmap

The beta release of Aurelia 2 is only the beginning. While we will have a more detailed roadmap soon (in a separate post), at a high level, the following is coming down the Aurelia pipeline (with more to come).

- Support for the new JS decorator specification
- Support for tuple/record
- Hydration and SSR support
- Partial ahead-of-time compilation (AOT)
- Continuing work on reducing API surfaces
- Reducing the code size of the framework
- Developer experience and tooling improvements
- Better API consistency
- More benchmarks

## Try it today

You can either run `npx makes aurelia` on your command line or follow our [quick start guide](https://docs.aurelia.io/getting-started/quick-install-guide) to get get started. And, as always, we welcome all feedback and criticism (good and bad) from the community to make Aurelia an even better framework.