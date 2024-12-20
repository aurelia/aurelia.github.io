+++
title = 'Aurelia 2 — August 2023 Update'
authors = ['Dwayne Charrington']
description = 'An update on Aurelia 2 - August 2023 edition'
lastmod = '2023-10-10T10:44:34.044Z'
date = '2023-10-10T10:44:34.044Z'
+++

Hello everyone, sorry it has been a while since our last major update. There have been a lot of good things happening in Aurelia land and quite a few beta releases. We want to talk about all of the new things we have been working on and what’s next.

In this update we are going to talk about multiple beta versions; 4, 5, 6, 7 and 8. We won’t go over everything as quite a few things have changed in the four beta releases we are going to be talking about. There are links to the full release notes in each section.

# Why is Aurelia 2 still in beta?

Let's address the topic of Aurelia 2 first, as some of you have asked about its status and why it is still in beta. First and foremost, we want to assure you that we have not given up on Aurelia, and it is not dying. Although the team working on Aurelia is small, we are dedicated to its development. Many of us use Aurelia in our day jobs, client work, and personal projects. Aurelia 2 is actively being used and tested within our team.

However, due to our smaller team size, we are not immune to the impact of small issues. Some core team members have had personal matters to attend to, which unfortunately affected the momentum of Aurelia 2.

The reason why we have not released a release candidate (RC) version is because we are working on static analysis and other templating improvements, such as AOT (Ahead of Time) compilation and server rendering. When we do release Aurelia 2 RC1, we want to make sure that we avoid any major breaking changes, ideally none at all.

# More frequent blogs

Leading off the last point, we want to make it known going forward that we will be publishing more on the blog. We understand that many see the blog as a beacon of activity of sorts and that the lack of presence and activity might be a hinderance, especially when you’re selling Aurelia to your boss and clients.

Not only will we be communicating the progress of Aurelia 2 better, but we will also be publishing deep-dives and other pieces on Aurelia 2.

# Docs improvements

Many of you have told us how much you love the new Aurelia 2 docs and we appreciate the feedback. While the docs are in a great place now, work is still undergoing to make them even better. Over the past few months we have made improvements to the structure of the docs, but also added in plenty of code examples and fixed some issues around the wording of dependency injection especially.

If you would like to contribute to Aurelia 2 and love to write, we will always welcome community docs contributions.

# Beta releases 4, 5, 6, 7 & 8

In the last four beta releases we have made a cornucopia of changes to Aurelia 2. Some of these have been new feature additions to improve the developer experience, others performance-related improvements to improve the speed and size of Aurelia 2 applications. We have also identified and fixed a heap of bugs.

# Beta 8

In beta 8 we added in a couple of awesome features that improve the developer experience greatly. Some refactoring work to align Aurelia’s terminology and functionality to be more in line with components was also done.

- The compose functionality now supports passthrough bindings and containerless. This means when composing custom elements using `au-compose` you can now provide properties through to the composed custom element. [[1792](https://github.com/aurelia/aurelia/pull/1792)]
- Support for globals within templates has been added. What this means is you can reference global properties such as `Math` or `JSON` inside your templates. We have documented all of the available properties [here](https://docs.aurelia.io/templates/globals). [[1790](https://github.com/aurelia/aurelia/pull/1790)]

View the release notes [here](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.8).

# Beta 7

In beta 7 we took our foot off the gas pedal for a moment. We focused primarily on bug fixes in the `router-lite` package as well as some refactorings to make Aurelia better. One of the biggest improvements is the addition of error recovery to the `router-lite` package which allows dealing with errors in the router better.

View the release notes [here](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.7).

# Beta 6

In beta 6 some breaking changes were introduced and it is important to take note of them if you are on an earlier version of Aurelia 2.

- The infamous `au` class that gets added into your HTML has been removed. This was previously used to identify targets for hydration, but people have been asking to remove these classes for years. Well, now they're gone and it increases performance too. [[1768](https://github.com/aurelia/aurelia/pull/1768)]
- [BREAKING CHANGE] The `resolveAll` decorator has been refactored to `onResolveAll` [[1764](https://github.com/aurelia/aurelia/pull/1764)]
- The `@newInstanceOf` and `@newInstanceForScope` decorators now work with interfaces [[1767](https://github.com/aurelia/aurelia/pull/1767)]
- Allow injection of implementation and not just interfaces [[1766](https://github.com/aurelia/aurelia/pull/1766)]
- Allow deactivate to be called on the template controller while it's activating [[1729](https://github.com/aurelia/aurelia/pull/1729)]

View the release notes [here](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.6).

# Beta 5

Building on the momentum in beta 4, beta 5 introduces more new developer experience improves and fixes.

- Added in a `resolve` function to resolve DI dependencies in an easier way [[1748](https://github.com/aurelia/aurelia/pull/1748)]
- Ability to create getter based observers using the observer locator [[1750](https://github.com/aurelia/aurelia/pull/1750)]
- Allow the `@bindable` decorator to support getter/setter [[1753](https://github.com/aurelia/aurelia/pull/1753)]

View the release notes [here](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.5).

# Beta 4

In beta 4, we added in quite a few improvements to Aurelia and the developer experience.

- Throttle and bounce binding behaviors now allow you to trigger them using signals [[1739](https://github.com/aurelia/aurelia/pull/1739)]
- Added in a `@slotted` decorator which allows you to listen to changes on an `au-slot` element [[1735](https://github.com/aurelia/aurelia/pull/1735)]
- A whole bunch of fixes and improvements to the `router-lite` package. [[1733](https://github.com/aurelia/aurelia/pull/1733)], [[1730](https://github.com/aurelia/aurelia/pull/1730)], [[1723](https://github.com/aurelia/aurelia/pull/1723)]
- Added in a Vite plugin so you can bundle your apps using Vite [[1726](https://github.com/aurelia/aurelia/pull/1726)]

View the release notes [here](https://github.com/aurelia/aurelia/releases/tag/v2.0.0-beta.4).

# Thank you

We want to thank each and every one of you for supporting Aurelia 2. We know that the slow progress on Aurelia 2 has been frustrating and has created fear, uncertainty and doubt about your beloved framework. But, make no mistake: Aurelia is not going anywhere and we are nearing its first release candidate release very shortly. A lot of good things are coming.