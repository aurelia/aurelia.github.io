+++
title = "How Reviewey Built Its Admin and Member Screens With Aurelia 2"
authors = ["Dwayne Charrington"]
description = "Reviewey (reviewey.com.au) runs Aurelia 2 across every logged-in admin and member screen, on top of a WordPress and custom application stack. Here is why the Australian review platform chose Aurelia 2 over React, and what it gained."
date = 2026-04-14T10:00:00+10:00
lastmod = 2026-04-14T10:00:00+10:00
tags = ["aurelia2", "use-case", "wordpress", "case-study"]
+++

[Reviewey](https://reviewey.com.au), an Australian review platform, runs on a mix of WordPress and a
custom application stack built around a set of services, and then reaches for Aurelia 2 the moment a
user logs in. Every administrative and member-facing screen behind the login is built with
Aurelia 2.

It is a good example of how Aurelia 2 fits a problem that a lot of teams actually have: a working
site that you do not want to rebuild, and a set of screens that need real application behaviour.

## What Reviewey does

[Reviewey.com.au](https://reviewey.com.au) is a two-way review platform. Businesses can review
customers, and customers can review businesses, and every review is tied to a real job, a real quote
or a real invoice. There are no anonymous drive-by ratings. If there was no job, there is no review.

Businesses get rated on quality of work, punctuality, communication, professionalism and price.
Customers get a Reviewey Passport score across timeliness of payment, communication, respect, site
readiness and follow-through, so a business can size up a job before quoting on it.

That matters here, because it describes the part of the product that needed a real front-end
framework. Dashboards, passport scores, review request flows and analytics are application screens,
not marketing pages.

## The constraint: the existing stack stays

Reviewey's public pages, the marketing site, the how-it-works content, the blog, run on WordPress.
Behind that sits a custom application layer made up of several independent services that handle the
product itself. That whole stack works, it ranks, and the team had no interest in throwing it away
to chase a full rewrite into a single page app.

The requirement was narrower and more honest than most framework decisions: the logged-in
experience needed rich, interactive functionality, but the rest of the platform needed to keep
working exactly as it does today. Whatever framework went in had to sit on top of the existing stack
without forcing a change to how everything behind it is built or deployed.

This is the scenario Aurelia has always handled well. You can mount it on a single element inside an
existing page, let it own the interactive part of the screen, and leave everything around it alone.
The backend keeps doing its job the way it already does. The admin and member screens become
Aurelia 2 apps that hydrate into the pages the platform serves.

## Why Aurelia 2

The team has been clear about what drew them to Aurelia 2. A few things stood out.

**It is developer friendly.** Aurelia 2's templates are close to standard HTML, its conventions are
predictable, and its dependency injection and binding system stay out of your way. For a team
shipping a steady stream of admin screens, that consistency is worth a lot. There is less framework
ceremony per feature, which means more time spent on the actual review and passport logic.

**It works with the existing stack instead of against it.** Aurelia 2 did not ask Reviewey to adopt
a new server model or a bespoke build pipeline for the whole platform. It slotted into what was
already running. The interactive screens are Aurelia, the rest of the stack is unchanged, and they
coexist cleanly. For a small team, not having to re-platform was a feature in itself.

**It adds rich functionality without changing how everything works.** This was the deciding point.
Reviewey needed dashboards, live passport scoring and interactive review flows, the kind of
behaviour that genuinely needs a component framework, but it needed all of that without rewriting
the parts of the app that were already fine. Aurelia 2 let them add capability surgically. The
login screens got an upgrade. The rest of the platform did not have to move.

## React was on the table

React was evaluated. It is the obvious default, and it would have done the job. The reason Reviewey
did not pick it came down to fit, not capability.

For a product where the framework only owns the logged-in screens and sits on top of an existing
stack, React brought more bloat and more tooling than the problem called for. The build setup, the
larger dependency surface and the surrounding ecosystem decisions you tend to inherit with React
were overhead Reviewey did not want to carry for what is, structurally, a set of admin panels on top
of an existing platform.

The deeper issue is that React on its own is a view library, and anything beyond light sprinkles
turns into assembling your own faux framework. You pick a state management library, then a router,
then something for forms and validation, then a way to talk to your services, then a styling
methodology, and on it goes. Every one of those is a decision, a dependency and a thing to keep
current. That is decision fatigue before a single feature ships. Reviewey does not have a large
team, so the technologies across the stack were chosen for their leanness, and a framework that
hands you a router, dependency injection, binding and conventions in the box fits that far better
than a pile of choices you have to make and maintain yourself.

Aurelia 2 gave them the rich interactivity with a lighter footprint and a smaller tooling burden.
The team could embed it where it was needed, keep the existing stack intact, and not take on a
larger frontend apparatus than the screens justified. Same outcome on the screens that mattered,
less weight everywhere else.

## What this looks like in practice

The split is clean:

- **Public and content pages**: served by the existing stack, unchanged. Marketing, the
  how-it-works pages, the blog, business profiles and SEO content stay where they are and keep
  ranking.
- **Logged-in admin and member screens**: Aurelia 2. Dashboards, profile and enquiry analytics,
  review request flows and passport scoring.

The boundary between the existing platform and Aurelia 2 maps almost exactly to the boundary between
content and application. That is not an accident. It is the architecture you get when you let each
tool do the part it is good at, rather than forcing one to do everything.

## Why it is a good fit for this kind of product

Plenty of teams are in Reviewey's position. They have a real platform that is doing its job, and a
growing set of screens that have outgrown jQuery and page reloads. The instinct to rewrite the whole
thing into a single page app is expensive and risky, and it usually is not necessary.

Aurelia 2 is a strong answer to that exact situation. It is progressive, you can adopt it screen by
screen. It is conventional, so a small team can stay productive without a large frontend
specialisation. And it is comfortable living alongside an existing backend rather than demanding to
own the entire stack.

Reviewey needed rich functionality on its logged-in screens without disturbing the rest of a working
product, and that is precisely the shape of problem Aurelia 2 was built to solve.

You can see the platform at [reviewey.com.au](https://reviewey.com.au).
