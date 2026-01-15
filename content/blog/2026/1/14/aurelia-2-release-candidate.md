+++
title = "Aurelia 2 Release Candidate: It's Finally Happening"
authors = ["Dwayne Charrington"]
description = "After years of development, 27 beta releases, and countless commits, Aurelia 2 has reached its first stable release."
date = 2026-01-14T10:00:00Z
lastmod = 2026-01-14T10:00:00Z
tags = ["aurelia2", "release", "rc"]
+++

<iframe src="https://giphy.com/embed/huJmPXfeir5JlpPAx0" width="480" height="269" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

We did it. We actually did it.

After years of alpha releases, 27 beta releases (yes, twenty-seven), a global pandemic, team changes, and enough GitHub commits to make your scrolling finger tired, Aurelia 2 has officially reached **release candidate** status.

For those keeping score at home, we announced the beta back in January 2023. Three years later, here we are. We know. We *know*. But look, some things are worth waiting for: fine wine, a good brisket, and apparently, Aurelia 2.

## What Does Release Candidate Mean?

Release Candidate means the API is stable. It means you can build production applications without worrying about breaking changes sneaking up on you. This is the stable release you have been waiting for.

And no, we are not planning to have 27 release candidates like we did betas. We are not going to string this out like a TV show that should have ended three seasons ago.

## What's Changed?

If you have been following along with the beta releases, the release candidate will feel familiar. The big difference is not a list of new features, it is what the version number represents: stability.

No more wondering if the next release will break your code. No more checking changelogs nervously before upgrading. The API is locked in, and you can build with confidence.

A few things worth noting:

- Foundational work for SSR and hydration is in place, including the new `Aurelia.hydrate()` API. We will have a separate post diving into SSR, SSG, and AOT compilation as that work continues to mature.
- The repeat component's indexMap computation was optimized from O(n²) to O(n).
- Custom attribute bindable definitions changed: `primary` is now `defaultProperty`, and `defaultBindingMode` has been removed from definitions (use the `mode` option on individual `@bindable` decorators instead).

## How to Get Started

Ready to try the release candidate? Here is how:

```bash
npx makes aurelia
```

That will scaffold a new Aurelia 2 project for you. Pick your options, and you are ready to go.

If you are upgrading an existing project:

```bash
npm install aurelia@rc
```

## Thank You

To everyone who has stuck with us through the alpha, the beta, and now the release candidate: thank you. Your patience, your bug reports, your pull requests, and your continued belief in what Aurelia can be have made this possible.

To the developers running Aurelia 1 applications in production for nearly a decade: we see you. The [migration guide](https://docs.aurelia.io/migrating-to-aurelia-2/migrating-to-aurelia-2) is there when you are ready.

To the new developers discovering Aurelia for the first time: welcome. You picked a good time to show up.

Join us on [Discord](https://discord.gg/TPV3cvCZhz) to celebrate. Now go build something.
