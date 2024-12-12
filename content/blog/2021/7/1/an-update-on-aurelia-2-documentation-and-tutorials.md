+++
title = "An Update on Aurelia 2 Documentation and Tutorials"
author = "Dwayne Charrington"
author_url = "https://dwaynecharrington.com"
description = "Here at Aurelia HQ, we have been busy beavers. Work on Aurelia 2 continues full steam ahead. We are doing more frequent development releases. You might have noticed we are engaging the community a little bit better after the noticeable silence."
date = 2021-07-01T23:57:57.490Z
lastmod = 2021-07-01T23:57:57.490Z
+++

Here at Aurelia HQ, we have been busy beavers. Work on Aurelia 2 continues full steam ahead. We are doing more frequent development releases. You might have noticed we are engaging the community a little bit better after the noticeable silence.

Today, I want to talk about the great work done on the Aurelia 2 docs, what we've done, what is left and what we have in store for the future.

## New docs, who dis?

One of the biggest criticisms of Aurelia 1 in the early days was the lack of proper documentation. And in all honesty, it was a valid criticism to make. Most of the team were engineers, not writers and ask anyone who has written documentation before: it's hard. Over time, Aurelia 1 docs got to a point where they were in a good place. It took time, but we eventually got there.

Before we continue, I want to make it known that we still have a lot more work to do as the documentation currently stands. There are still many areas that need documentation, but we have an excellent start nonetheless.

But, before you can write docs, you have to have a plan and answer some critical questions:

- How will they be structured?
- How will they be organized to be accessible to both beginners and advanced users?
- What will things be called?
- How much detail do you go into before splitting something into its own section?

We identified two essential sections of the documentation, the ones "above the fold," which were:

- Getting Started — What is Aurelia, how do you install it, and what does a basic hello world app look like?
- Getting to know Aurelia — The basics that underpin Aurelia, templating and components, dependency injection, and other vital Aurelia concepts that users should learn before anything else.

We wanted the docs to be concise, for information to be readily accessible, and without blasting users with a wall of options and overwhelming them.

As you can see, the [templating section](https://docs.aurelia.io/getting-to-know-aurelia/introduction) is neatly organized and succinct now. If you are looking for information on interpolation or value converters amongst other templating features, you will find them in this section.

When it comes to plugins and other Aurelia features, we previously had those in their own individual sections, and it caused the sidebar to be huge. We have added a "Developer Guides" section, which is neatly organized for the new approach and uses nesting to keep things contained.

Want to learn about working with forms? [This guide](https://app.gitbook.com/@aurelia-1/s/aurelia/developer-guides/forms) has you covered. How about the router? [This one](https://app.gitbook.com/@aurelia-1/s/aurelia/developer-guides/routing) has you covered.

With Developer Guides, we wanted you to drill down for the information. Instead of having everything in front of you, really, the only thing that matters is what you want to learn at the time. Everything else should get out of your periphery.

Another section we are proud to eventually expand is a new "Reference" section aiming to give you quick resources for things you might want to know about. Want to see some interactive code examples for the `repeat.for` attribute? [We've got a page for that](https://app.gitbook.com/@aurelia-1/s/aurelia/reference/examples/binding-and-templating/looping-with-repeat.for).

We are also planning on a section for error messages that you might encounter in day to day Aurelia apps and how to debug and resolve them. This section doesn't have anything in it just yet, but eventually, it will.

As you can see, we have been busy, and we have done the initial push to docs now. [Go check them out](https://docs.aurelia.io) and let us know what you think so far. We still have more work to do, but work on the docs is happening on an almost daily basis now with frequent releases.

## Resources for those wanting to migrate from Aurelia 1 to Aurelia 2

I want to make quite clear that Aurelia 1 is not being abandoned, thrown out into the street, and left to fend for itself. Many of us on the core team maintain huge Aurelia 1 apps in production, some running since 2015.

I am sure everyone remembers what happened when Angular 2 was announced and that it wouldn't be easy to migrate from AngularJS. It's something that needed to happen, but people were shocked nonetheless. 

We want to reassure the community this will not be the case with Aurelia 2. We want you to be able to migrate your Aurelia 1 applications to Aurelia 2.

While Aurelia 2 differs in some aspects (the router and plugins), the syntax remains the same (with new powerful features added). Porting over will be made as painless as possible (it won't always just be a find and replace, but not impossible).

There will be resources to help those of you using Aurelia 1 to migrate over to version 2. We will have resources to that effect inside of the docs.

## New Aurelia 2 tutorials

We have held off for a while on creating Aurelia 2 tutorials until the framework was in a good state where most of the core was implemented.

One of the downsides of Aurelia 1 is that it didn't convey its intuitiveness and simplicity adequately. The docs teething issues aside, we just didn't have enough learning resources to show you the ropes. In the spirit of making everything better in version two, we have three completely Aurelia 2 tutorials, and there will be more by launch time.

- [Building a real-time cryptocurrency price tracker](https://docs.aurelia.io/tutorials/building-a-realtime-cryptocurrency-price-tracker) — in this tutorial, you will build an Aurelia 2 application that fetches cryptocurrency price information from Coingecko. For this, you will learn how to create an Aurelia 2 TypeScript application that uses Shadow DOM to encapsulate components.
- [Building a widget-based dashboard](https://docs.aurelia.io/tutorials/create-a-dashboard-using-dynamic-composition) is a more ambitious and longer tutorial where you build a dashboard application with five widgets that all do different things. For this, you once again use TypeScript but for styling, learn how to use CSS Modules.
- [Building a todo application](https://docs.aurelia.io/tutorials/building-a-todo-application) — the obligatory todo application. Build a simplistic and styled todo application in plain Javascript with HTML and CSS, but no external dependencies.

There will be a lot more tutorials to come. Some tutorials will actually use these as a springboard, especially for the planned tutorials around testing and refactoring. We want Aurelia to be welcoming and encouraging to developers of all skill levels.

## A huge thank you

It's mind-blowing to think Aurelia 1 was released in January 2015. We know many of you have been patiently waiting for Aurelia 2 for some time now (as have we), and we want to reassure you all that we are making steady progress on it. Once again, thank you to the community for your support and understanding.

And as always, if you have any feedback, questions or concerns, we love to hear from you.