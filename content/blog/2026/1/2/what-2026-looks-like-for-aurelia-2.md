+++
title = "What 2026 Looks Like for Aurelia 2: A Look at the Year Ahead"
authors = ["Dwayne Charrington"]
description = "A stable release is finally happening. Here's what Aurelia 2 looks like in 2026, and what we're doing to ensure Aurelia thrives for years to come."
date = 2026-01-02T10:00:00Z
lastmod = 2026-01-02T10:00:00Z
tags = ["aurelia2", "roadmap", "community"]
+++

Aurelia 2 is getting a stable release in 2026.

We know you have heard variations of this before. We also know Aurelia 2 has been in beta for longer than anyone expected. But 2025 changed things, and we are entering 2026 with more momentum than we have had in years.

## The Long Beta

Let's be direct about it: the beta took too long. A small team, personnel changes, personal challenges some core team members faced, a global pandemic, and structural shifts within the project all contributed to setbacks we did not anticipate. We have admittedly been Duke Nukem Forevering this thing. The difference is we never stopped shipping, and 2025 proved that.

## What We Shipped in 2025

Five beta releases. Hundreds of commits. Here is a sample of what landed:

**Templating and Binding**
- [The `$previous` variable](/blog/2025/12/29/aurelia-beta-27/) in repeaters for comparing items without external state
- [Manual getter dependencies](/blog/2025/12/29/aurelia-beta-27/) with `@computed` for fine-grained performance control
- [Async computed observers](/blog/2025/07/11/aurelia-beta-25/) for predictable, batched change notifications
- Multiple `.class` values in templates
- Value converters now receive binding context for smarter transformations

**Routing**
- [The `loaded` lifecycle hook](/blog/2025/12/29/aurelia-beta-27/), navigation direction detection, and automatic external link handling
- [Aggregated route parameters](/blog/2025/12/29/aurelia-beta-27/) so nested components can access ancestor params
- Path generation for building URLs from named routes
- Navigation strategies for more flexible routing scenarios
- [Clearer package names](/blog/2025/07/11/aurelia-beta-25/): `@aurelia/router-lite` became `@aurelia/router`

**State Management**
- [Multiple named and keyed stores](/blog/2025/12/29/aurelia-beta-27/) for partitioning state into logical domains
- [Middleware support](/blog/2025/07/11/aurelia-beta-25/) for logging, measuring, and transforming actions
- Memoized selectors that cache results until inputs change

**Dialog and UI**
- [Native HTML `<dialog>`](/blog/2025/07/11/aurelia-beta-25/) as the default renderer with CSS animations
- [Child dialog services](/blog/2025/12/29/aurelia-beta-27/) with preconfigured defaults
- [UI virtualization overhaul](/blog/2025/12/29/aurelia-beta-27/) with variable heights, horizontal scrolling, and infinite scroll

**Tooling and Developer Experience**
- [Experimental single file components](/blog/2025/02/05/experimental-single-file-components/) for Vite
- [Storybook support](/blog/2025/02/06/storybook-vite-support/) for both Vite and Webpack
- Vite 6 and Vite 7 support
- Type-checking for non-public members
- CLI improvements: TailwindCSS scaffolding, Storybook integration, default routes
- Toggle `$au` and `$aurelia` on DOM elements for security-conscious apps

**Documentation and Content**
- [Complete documentation overhaul](/blog/2025/08/06/extensive-aurelia-docs-work/) with philosophy docs, better navigation, and improved examples
- New tutorials covering Svelte integration, AI tooling, web workers, websockets, and more
- Video tutorials on AppTasks, synthetic views, and low-level concepts
- A brand new website

And the groundwork for SSR, SSG, and AOT compilation is already in Beta 27. These are not distant roadmap items. They are being actively wired up right now.

## 2026: The Year of Stable

This is the year. Here is what is coming:

- **Stable release**: After years of refinement, Aurelia 2 gets its official stable release
- **Server-side rendering (SSR)**: Vite-based SSR for better SEO and faster initial loads
- **Static site generation (SSG)**: Build static sites with Aurelia 2
- **Ahead-of-time compilation (AOT)**: Smaller bundles and faster startup times
- **VS Code extension**: Typechecking, syntax highlighting, refactorings, and more

We are at the point where we confidently recommend Aurelia 2 for new applications. If you are running Aurelia 1, the [migration roadmap](/blog/2026/1/1/migrating-aurelia-1-to-2-roadmap/) and updated documentation make it easier than ever to start planning your upgrade. Tooling support covers all major bundlers, and the developer experience keeps improving with each release.

## Building for the Long Term

Aurelia is entering its 11th year. The framework has weathered Rob stepping away, team restructuring, and the usual challenges of maintaining open source over the long term. Through all of it, the core mission has not changed: a framework that stays out of your way, respects web standards, and prioritizes developer experience.

Many of you are still running Aurelia 1 apps in production, some for nearly all of those 11 years. That kind of longevity matters to us, and we are working to ensure Aurelia remains sustainable for years to come. This means partnering with organizations that have a vested interest in the framework's success.

We will always remain independent and community-focused. If you look at our Discourse, Discord, and GitHub, you will see we take all feedback, contributions, and ideas into account. That is not changing.

If your company relies on Aurelia and wants to be part of its future, we are open to exploring partnerships. Whether through our [OpenCollective](https://opencollective.com/aurelia), logo placement, sponsored content that fits the Aurelia ethos, or case studies highlighting your work, there are ways to get involved and get your brand in front of the community.

## Start Now

If you have been waiting for the right moment, this is it. The framework is stable in practice, the documentation is comprehensive, and developers have been shipping production applications with Aurelia 2 for years.

Check out the [getting started guide](https://docs.aurelia.io/getting-started/quick-start-guide), join us on [Discord](https://discord.gg/TPV3cvCZhz), and start building.

2026 is going to be a big year for Aurelia. We are glad you are here for it.
