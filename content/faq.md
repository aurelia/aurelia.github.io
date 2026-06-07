---
title: "FAQ"
description: "Frequently asked questions about Aurelia"
type: "faq"
---

## Who maintains Aurelia?

Aurelia was created by Rob Eisenberg in 2015 and is now a community-driven project with a dedicated core team. The core team and community contributors maintain the framework together, fix bugs, and ship new features.

This mix of consistent stewardship and community involvement keeps Aurelia stable and responsive to what developers actually need.

## What's the difference between Aurelia 1 and Aurelia 2?

Aurelia 2 is a ground-up rewrite that keeps Aurelia 1's convention-over-configuration approach while modernising the internals:

- **Faster rendering**: Rewritten rendering engine with better memory management
- **TypeScript first**: Built in TypeScript for stronger type safety and tooling
- **Simpler APIs**: Streamlined APIs with less boilerplate
- **Smaller bundles**: Better tree-shaking and a modular package system
- **Improved reactivity**: A new reactivity system that's easier to debug

Most Aurelia 1 applications migrate with relatively minor changes, since the core concepts carry over.

## Can I still use Aurelia 1?

Yes. Aurelia 1 is in maintenance mode, which means:

- Critical security and major bug fixes are still made
- It remains stable and production-ready
- Existing documentation and resources stay available
- Community support continues on Discord and the forums

New feature work happens on Aurelia 2, so we recommend it for new projects.

## Is Aurelia reliable?

Aurelia has been in production since 2015, and stability is a core goal:

- **Minimal breaking changes** between releases
- **Semantic versioning** applied consistently
- **Clear deprecation policies** and documented migration paths
- **Thorough test coverage** and code review

This means you can build long-term applications without bracing for frequent rewrites.

## Is Aurelia fast?

Aurelia is built for performance without sacrificing developer productivity:

- **No virtual DOM**: Updates go straight to the DOM through the reactive binding system
- **Fine-grained reactivity**: Only what changed gets updated
- **Batched updates**: DOM changes are batched automatically
- **Tree-shakeable**: You ship only the code you use
- **Fast startup**: Quick initial load and time-to-interactive

The result is applications that stay responsive while keeping CPU and memory use low.

## Should I be concerned that Aurelia isn't as popular as other options?

Aurelia has a smaller community than some frameworks, but that doesn't have to be a drawback:

- **Production proven**: Used in production by startups through to large enterprises since 2015
- **Actively developed**: Regular updates from the core team and contributors
- **Dogfooded**: The core team uses Aurelia in production daily
- **Direct support**: Answers often come straight from core team members on Discord and the forums
- **Solid ecosystem**: Works with popular tools and libraries out of the box

Community size isn't the best way to judge a framework. Aurelia's architecture, stability, and standards-based approach make it a strong choice for teams that value clean, maintainable code, and a smaller community often means more direct, higher-signal support.

## How does Aurelia compare to other frameworks and libraries?

A few things set Aurelia apart:

- **Convention-based**: Less boilerplate, more focus on your actual logic
- **Standards-based**: Builds on web standards rather than framework-specific abstractions
- **Extensible**: Modular architecture that's straightforward to extend
- **Familiar**: Concepts map closely to plain JavaScript and TypeScript
- **No virtual DOM**: A reactive binding system that performs well and is easy to debug
- **Third-party friendly**: Works with external libraries without wrappers or heavy config
- **Testable**: First-class testing support with simple unit testing

Other frameworks may have larger ecosystems, but Aurelia's focus on developer experience and clean architecture suits teams building maintainable, long-lived applications.

## How do I contribute to Aurelia?

Contributions of all kinds are welcome:

- **Code**: Fix bugs or add features
- **Documentation**: Improve the docs, fix typos, or add examples
- **Tutorials and blog posts**: Share what you've built and learned
- **Bug reports**: Help us find and reproduce issues
- **Feature requests**: Tell us what would make Aurelia better
- **Community support**: Help other developers on Discord and the forums

Every contribution helps. See our [Contributing Guide](https://docs.aurelia.io/community-contribution/contributor-guide) to get started.

## How do I manage state in Aurelia 2 applications?

Aurelia 2 supports several approaches to state, so you can match the tool to the problem:

- **Component state**: Built-in observable properties for local state
- **Global state**: The official @aurelia/store package for Redux-style state
- **Service-based state**: Shared state through dependency injection
- **Third-party libraries**: Easy integration with MobX, Redux, and others
- **Signal-based reactivity**: For precise, fine-grained updates

Pick the approach that fits your application, from simple component state to full application-wide state management.

## What types of web applications can I build with Aurelia 2?

Aurelia 2 supports any modern web application, including:

- **Single-page apps**: Fast, dynamic web applications
- **Progressive web apps**: Installable apps with offline support
- **Enterprise software**: Large-scale business applications
- **Micro frontends**: Independent, separately deployable modules
- **Mobile web apps**: Touch-friendly, responsive interfaces
- **Content sites**: Simple, content-focused websites
- **Desktop apps**: Cross-platform apps via Electron

The same architecture scales from a simple website to a complex enterprise system.

## How do I implement routing in Aurelia 2?

Aurelia 2's router covers everything from simple to complex navigation:

- **Component-to-route mapping** with minimal setup
- **Nested routes** for parent-child structures
- **Route guards** for authentication and authorisation
- **Dynamic routes** with URL parameters and query strings
- **Automatic code-splitting** for performance
- **HTML5 history API** integration
- **Lifecycle hooks** for full navigation control

Build straightforward or deeply nested navigation while keeping your code organised.

## How do I test Aurelia 2 applications?

Aurelia 2 is built to be testable:

- **Unit testing**: Works with Jest, Mocha, and other popular runners
- **Component testing**: Test components in isolation
- **End-to-end testing**: Integrates with Playwright and Cypress
- **Mocking**: Dependency injection makes test setup and mocking easy
- **CI/CD**: Fits cleanly into automated pipelines

Dependency injection and clear conventions keep tests easy to write and maintain.

## What is Aurelia's license?

Aurelia is released under the MIT license, one of the most permissive open source licenses:

- **Free to use** in personal and commercial projects
- **Modify freely** to suit your needs
- **Distribute** your modifications
- **No royalties** for commercial use
- **Provided as-is** with no warranty
- **Simple attribution** requirement

The MIT license lets you use Aurelia in any project while keeping full control of your code.

## How is Aurelia funded?

Aurelia is funded through a community-driven model:

- **Community sponsors** via GitHub Sponsors and Open Collective
- **Corporate sponsors** using Aurelia in production
- **Professional services** such as consulting, training, and support
- **Volunteer contributors** giving their time and expertise

This mix keeps Aurelia sustainable and independent. Every contribution, financial or in code, helps maintain and improve the framework for everyone.
