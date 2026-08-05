+++
title = "Storybook 3.0 for Aurelia 2: Goodbye Boilerplate"
authors = ["Dwayne Charrington"]
description = "@aurelia/storybook 3.0.0 is out. The renderer boilerplate is gone, your bindables become controls automatically, and autodocs, CSF Factories, and portable stories all work."
date = 2026-08-06T07:15:00+10:00
lastmod = 2026-08-06T07:15:00+10:00
tags = ["aurelia2", "storybook", "release", "tools"]
+++

Remember the setup instructions from the Storybook post back in February 2025? We told you to put
this in `.storybook/preview.ts`:

```ts
export { render, renderToCanvas } from '@aurelia/storybook';
```

And then a `viteFinal` block to shove `@aurelia/runtime-html` into `optimizeDeps.exclude`, because
otherwise Vite would pre-bundle it, you'd end up with two copies of the Aurelia runtime, and your
components would break in ways that made absolutely no sense. Good times.

Delete all of it. `@aurelia/storybook` 3.0.0 just landed on npm.

```bash
npm install --save-dev @aurelia/storybook
```

## Controls just work now

This is easily one of the most exciting parts of the release.

The old way: write a `render` function for every story, hand-write the template, then hand-write the
`argTypes` so you'd get controls in the sidebar. Three places to keep in sync, for one component.
Miss one and you're sat there wondering why your slider does nothing.

The new way:

```ts
import type { Meta, StoryObj } from '@aurelia/storybook';
import { StatCard } from '../components/stat-card';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  args: {
    label: 'Active users',
    value: 1284,
  },
} satisfies Meta<typeof StatCard>;

export default meta;

export const Default = {} satisfies StoryObj<typeof meta>;
```

That's all you have to do. No render function, no template, no argTypes.

The framework reads your `@bindable` definitions and turns them into args, controls, and a bindables
table in the docs. It only binds the args you actually pass, so any bindables you leave out keep
their own defaults instead of getting stomped with `undefined`.

Twiddling a control now updates the running view model in place instead of nuking the app and
starting over. Add or remove a bindable arg and yeah, it remounts, but changing a value doesn't. If
your component does real work in its lifecycle hooks you'll notice the difference the first time you
drag a slider.

Still want to write your own templates? `defineAureliaStory` hasn't gone anywhere. Use it for
projected content, local resources, whatever markup you need. It's just not the default anymore.

## The config got a lot shorter

`.storybook/main.ts` is typed now, and the builder wiring happens for you:

```ts
import { defineMain } from '@aurelia/storybook/node';

export default defineMain({
  stories: ['../src/**/*.@(mdx|stories.@(ts|js))'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@aurelia/storybook',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
});
```

The preset adds the Aurelia Vite plugin if you haven't already got one, and keeps the Aurelia
runtime packages out of dependency pre-bundling so you don't end up with two copies. That whole
dance you used to do by hand is just handled.

Swap that builder line for `@storybook/builder-webpack5` or `storybook-builder-rsbuild` and you get
the matching loader rules instead. The February 2025 release was Vite only, with Webpack listed as
coming soon. Webpack 5 and Rsbuild are proper first-class citizens now.

## Docs, factories and tests

Autodocs works. Add `@storybook/addon-docs`, tag your preview with `autodocs`, and you get docs
pages where the source block shows the actual Aurelia markup your story rendered, not a serialised
object soup. MDX works with the normal Storybook blocks, no special Aurelia wrapper needed.

If you're into Storybook's CSF Factories API, that's wired up with real Aurelia type inference, so
`preview.meta` and `meta.story` know about your component instance, your decorators and your addon
parameters:

```ts
const meta = preview.meta({
  title: 'Example/HelloWorld',
  component: HelloWorld,
  args: { message: 'Hello from Storybook', onIncrement: fn() },
});

export const Default = meta.story({
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }));
    await expect(args.onIncrement).toHaveBeenCalledWith(1);
  },
});
```

Play functions can grab `mount` if they want to drive the initial render themselves. There are
portable stories in `@aurelia/storybook/portable-stories`, so you can yank a story straight into a
Vitest test with `composeStories` and call `run()` on it. And if you want the full treatment,
Storybook's Vitest addon will run your stories in real Chromium.

## Right, what breaks

This is tagged a major release for a reason, some stuff has changed, so make sure you read before
upgrading.

**Your preview file.** If `.storybook/preview.ts` still has that `export { render, renderToCanvas }`
line, delete it. Storybook picks them up from the preset now, and exporting them yourself just
fights with it. `framework`, `frameworkOptions`, `aureliaFramework` and `externals` are gone too.
Nobody's going to miss them.

**The host element.** This is the sneaky one. Stories used to render inside
`<sb-app containerless>`, which meant no actual element in the DOM. Now they render inside
`<sb-aurelia-story>`,
which is a real element that really is there. So if you've got CSS or DOM snapshots that assume your
component sits directly inside the canvas, there's a wrapper in the way now. It won't throw an
error. It'll just quietly look wrong. Check your selectors.

**Dependencies.** `@aurelia/runtime-html` isn't a peer dep anymore, and `@aurelia/runtime` is a
direct dependency instead. Peers moved up to Storybook 10.5.6 and Aurelia 2.0.0-rc.2. The
`preview/types` and `preview/storybook-types` subpaths are type-only now, so if you were importing
them for a runtime value that'll break. Grab Storybook's types from `storybook/internal/types`.

The full list is in the [changelog](https://github.com/aurelia/storybook/blob/main/CHANGELOG.md).

## Go break it

The [repo](https://github.com/aurelia/storybook) has three example apps in `apps/`, one per builder,
and CI keeps all of them working. Easiest way to see a real setup for whatever bundler you're on.

If you bounced off Storybook last time because the setup felt like a fight, give it another go. And
if it still fights you, open an issue. We only find out about this stuff when someone tells us.
