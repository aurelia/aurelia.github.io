+++
title = "Aurelia 2 Update - Alpha 8"
author = "Dwayne Charrington"
author_url = "https://dwaynecharrington.com"
description = "Hi everyone, we hope you have been staying healthy and safe in these uncertain times we still find ourselves in. Unfortunately, things slowed down a bit in Aurelia land over the last few months due to unforeseen circumstances. We are happy to report that we've now been able to adapt to these changes, and you're going to see more releases and development work as we focus on completing Aurelia 2. We also realize that a lot of the work that has been done can easily be missed if you're not watching the GitHub [https://github.com/aurelia/aurelia], so make sure you keep an eye on that one too."
date = 2021-06-22T05:44:14.511Z
lastmod = 2021-06-22T05:44:14.511Z
+++

Hi everyone, we hope you have been staying healthy and safe in these uncertain times we still find ourselves in. Unfortunately, things slowed down a bit in Aurelia land over the last few months due to unforeseen circumstances. We are happy to report that we've now been able to adapt to these changes, and you're going to see more releases and development work as we focus on completing Aurelia 2. We also realize that a lot of the work that has been done can easily be missed if you're not watching the [GitHub](https://github.com/aurelia/aurelia), so make sure you keep an eye on that one too.

We have just released Aurelia alpha version 8, and with it comes some small but significant changes, some fixing bugs you might have encountered in previous alpha versions of Aurelia 2. We will also be letting you know about all of the awesome things that Aurelia 2 alpha versions 7 and 6 introduced and fixed.

On a related note, some of you might have missed the fact that Aurelia Store [has now been ported over to Aurelia 2](https://github.com/aurelia/aurelia/pull/592) which has been available since alpha.4. In Aurelia 2 alpha 3, we also introduced support for a [new promise template controller](https://github.com/aurelia/aurelia/commit/c6df35a), allowing you to work with promises inside of your views. We highly recommend you check out the docs [here](https://docs.aurelia.io/getting-to-know-aurelia/introduction/built-in-template-features#using-promises-in-templates-with-promise-bind) on using the new promise template controller.

## Documentation

As many of you already know, the documentation for Aurelia 2 has been lagging behind the framework a little bit. While the documentation for version 2 is a lot better than version 1 (at least, we think so), with all of these new features and improvements over version 1, there is a lot more to document. Also, because we are still in alpha, things are often changing, and documentation needs to be updated accordingly.

So the looming questions we have had as Aurelia 2 heads toward stable launch are: where do you put everything, and how do you organize it?

We believe we have answered the above questions we asked ourselves and welcome honest feedback from the community regarding the direction we are taking.

We know those of you wanting to dig into Aurelia 2 will be happy to know that concurrently to work being done on the framework code, documentation is being incrementally improved on an almost daily basis.

What this means is over the coming weeks, you will notice Aurelia 2 docs changing. If you're eagle-eyed and have been paying attention, you might have already seen some changes. We are starting to add working code examples inside of the examples section. Our first pilot page was one for the repeater that you can see [here](https://docs.aurelia.io/examples/binding-and-templating/looping-with-repeat.for).

The "Hello World" tutorial [now has a page with a working example](https://docs.aurelia.io/getting-started/quick-start-guide/running-our-app) that you can edit. It allows newcomers and even those wanting to brush up on their skills to interact and experience Aurelia right from within the docs.

## Features

### 2.0.0-alpha.8 (2021-06-22)

Some changes regarding compilation have been introduced, including a build method [that allows more raw information](https://github.com/aurelia/aurelia/commit/240692d). We have also [added two purer low-level primitives](https://github.com/aurelia/aurelia/commit/240692d) `isTwoWay` and `map`, allowing better compilation.

[You can now use au-slot on the same element with a template controller](https://github.com/aurelia/aurelia/commit/240692d). This will allow you to do this in your templates now:

```
<template repeat.for="i of items" au-slot="myslot">${i.name} -- ${i.value}</template>
```

Some other minor bug fixes and refactorings mostly related to making templating and lower-level implementations cleaner were done. Which, if you're curious, you can read about more in the changelog [here](https://github.com/aurelia/aurelia/blob/master/docs/CHANGELOG.md#200-alpha8-2021-06-22).

### 2.0.0-alpha.7 (2021-06-20)

In alpha 7, [Aurelia 2 now supports Jest 27](https://github.com/aurelia/aurelia/commit/2145bbe) which closes off [bug 1175](https://github.com/aurelia/aurelia/issues/1175). We had to change some configuration and API values for Jest 27 due to the changes in Jest. We plan on splitting up our tooling packages to make them easier to maintain in a future release.

### 2.0.0-alpha.6 (2021-06-11)

In Aurelia 2, the `<au-compose>` element allows you to compose parts of your UI dynamically, and while we have had compose support for quite some time, it didn't function the same way it did in Aurelia 1. For example, if you wanted to compose a view and not have to provide a view model, the v2 compose element did not support this until now. You can now pass in just a `view` as you could in Aurelia 1, amongst other familiar features of compose. The pull request for this work [here](https://github.com/aurelia/aurelia/pull/1184) explains some changes and differences to v1. Please note that the parent binding scope inheritance feature for view-only composition can also be changed.

## Bug Fixes

### 2.0.0-alpha.7 (2021-06-20)

There was an annoying router bug where links denoted as external would be hijacked by the router (sorry about that), which [has now been fixed with accompanying tests](https://github.com/aurelia/aurelia/commit/387c084).

Telling the Dependency Injection container that you want a new instance using either `@newInstanceOf` or `newInstanceForScope` [now correctly invokes the registered interface](https://github.com/aurelia/aurelia/commit/8753b4e).

### 2.0.0-alpha.6 (2021-06-11)

When using the `attr` binding command, it wouldn't take precedence over custom attributes when binding. [This bug has now been fixed](https://github.com/aurelia/aurelia/commit/5ecd6a7), so the `attr` binding command will always take precedence over custom attributes.

## Until next time

We want to thank everyone for their continued support, especially those who have contributed to Aurelia 2 and helped get it to its current point. If you ever have any questions or issues, please don't hesitate to reach out to us. The best place to ask questions is on the [Aurelia Discourse](https://discourse.aurelia.io/) and any bugs or feature requests on [the Aurelia GitHub](https://github.com/aurelia/aurelia/issues).