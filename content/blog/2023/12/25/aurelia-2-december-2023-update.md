+++
title = "Aurelia 2 — December 2023 Update"
authors = ["Dwayne Charrington"]
description = "An update on Aurelia 2 - December 2023 edition"
date = 2023-12-25T07:46:53.313Z
lastmod = 2023-12-25T07:46:53.313Z
+++

Hello Aurelians! As the year draws to a close, we're excited to share the latest enhancements and fixes that have been integrated into Aurelia's v2.0.0-beta.9. Our team has been working tirelessly to ensure that Aurelia not only continues to meet your needs but also surpasses expectations with each update. So, let's dive into what's new and improved this December.

# v2.0.0-beta.9: Features and Fixes Galore

The latest beta release is packed with features and bug fixes that refine the developer experience and expand the capabilities of Aurelia. Here are some of the highlights:

## Features:

- **Vite Plugin Enhancements:** We've upgraded our Vite plugin to allow all options to be passed, giving you more control and flexibility over your build process. [#1830](https://github.com/aurelia/aurelia/commit/3d87341)
- **Template Popover APIs:** Our commitment to rich interactivity continues with support for popover APIs in templates, making it easier to create engaging, dynamic interfaces. [#1851](https://github.com/aurelia/aurelia/commit/f4b552b)

## Bug Fixes:

We've squashed a variety of bugs to streamline your development experience:

- Fixes for generative native modules and examples in the build process. [#1854](https://github.com/aurelia/aurelia/commit/9a7cc65)
- Ensured `au-slot` works seamlessly with shadow DOM. [#1841](https://github.com/aurelia/aurelia/commit/c750d4f)
- Addressed duplicate primitive handling and batched mutation issues in repeaters. [#1840](https://github.com/aurelia/aurelia/commit/703d275)
- Sorted out `repeat` directive bugs related to sort+splice operations. [#703d275](https://github.com/aurelia/aurelia/commit/703d275)
- Improved validation by ignoring property accessor instrumenters and allowing `rules.off` on objects without rules. [#342847f](https://github.com/aurelia/aurelia/commit/342847f)
- Enhanced i18n by enabling translation of camelCased bindables. [#1838](https://github.com/aurelia/aurelia/commit/ff761fb)
- Refined router-lite with better lifecycle transitions and transition plan selections. [#1821](https://github.com/aurelia/aurelia/commit/8e961af), [#1817](https://github.com/aurelia/aurelia/commit/d214fdc)
- Improved dialog functionality with `startingZIndex` usage. [#1809](https://github.com/aurelia/aurelia/commit/de79aea)

## Refactorings:

- Streamlined runtime-html with if-then-else conditions. [#1833](https://github.com/aurelia/aurelia/commit/7192e74)
- Removed strict binding options from custom elements and consolidated tests under the src folder. [#1807](https://github.com/aurelia/aurelia/commit/7b4455f)

## Documentation Overhaul:

We've made extensive updates to our documentation with the following improvements:

- Deep linkable sections, making it easier to navigate directly to key topics such as templating syntax.
- The aim of our refactoring effort was to reduce noise and break down massive walls of text into more digestible content.
- Expanded sections with more explanations, code examples, and details, particularly in areas like the fetch client and binding behaviors.
- Comprehensive documentation of return types, requests, and advanced scenarios for the fetch client.
- A sweep of grammatical fixes to polish our docs.
- Coverage of some previously undocumented or lesser-known features and APIs in Aurelia.
- New recipes added for integrating technologies like Cordova/Phonegap, Apollo GraphQL, and SignalR.

Check out the newly structured and enriched documentation [here](https://docs.aurelia.io/templates).

# Wrapping Up the Year

As we wrap up 2023, we want to extend our heartfelt gratitude to the community for your unwavering support. Your feedback, contributions, and enthusiasm for Aurelia continue to drive us forward. We're committed to delivering an exceptional framework that empowers you to build amazing applications with ease and elegance.

Stay tuned for more updates and, as always, happy coding!

View the full release notes for v2.0.0-beta.9 [here](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.9).

Happy holidays,

The Aurelia team.