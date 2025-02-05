+++
title = "Aurelia 2 + Storybook + Vite"
authors = ["Dwayne Charrington"]
description = "We're excited to announce early support for Storybook in Aurelia 2. Learn how Storybook simplifies your development workflow."
date = 2025-02-06T05:46:52+10:00
lastmod = 2025-02-06T05:46:52+10:00
tags = ["aurelia2", "vite", "storybook"]
+++

Many of you in the Aurelia community have been asking for Storybook support in Aurelia 2 and while official integration with the Storybook team is still in the works, we've got you covered with a plugin that allows you to use Storybook with Aurelia 2 now.

This early release version is a work in progress and we're looking for feedback from the community, but only currently supports the Vite bundler (Webpack support is coming soon).

## What is Storybook?

Storybook is a tool for building UI components and pages in isolation. It's a popular tool for building UI components and pages in isolation.

## How to use Storybook with Aurelia 2

To use Storybook with Aurelia 2, you need to install the following packages:

```bash
npm install --save-dev @aurelia/storybook
```


You'll also need to ensure you have the necessary Storybook dependencies. These might already be present in your Aurelia 2 project, but if not, install them:

```bash
npm install --save-dev @storybook/addons @storybook/core-events @storybook/builder-vite @storybook/core-common @storybook/preview-api @storybook/types
```

### Configuration

Next, we'll configure Storybook to work seamlessly with Aurelia 2 by creating a directory called `.storybook` in the root of your project and adding the following files:

1. **`.storybook/main.ts`**

    Create or update your `.storybook/main.ts` file. This file tells Storybook how to build your stories and which addons to use.

    ```typescript
    import type { StorybookConfig } from '@storybook/core-common';
    import { mergeConfig } from 'vite';

    const config: StorybookConfig & { viteFinal?: (config: any, options: any) => any } = {
      stories: ['../src/stories/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
      addons: [
        // Optional but recommended addons:
        // '@storybook/addon-links',
        // '@storybook/addon-essentials',
        // '@storybook/addon-interactions'
      ],
      framework: {
        name: '@aurelia/storybook',
        options: {},
      },
      core: {
        builder: '@storybook/builder-vite',
      },
      viteFinal: async (viteConfig) => {
        viteConfig.optimizeDeps = viteConfig.optimizeDeps || {};
        viteConfig.optimizeDeps.exclude = viteConfig.optimizeDeps.exclude || [];
        if (!viteConfig.optimizeDeps.exclude.includes('@aurelia/runtime-html')) {
          viteConfig.optimizeDeps.exclude.push('@aurelia/runtime-html');
        }
        return mergeConfig(viteConfig, {
          // ...any additional Vite configuration you might need
        });
      },
    };

    export default config as any;
    ```

2. **`.storybook/preview.ts`**

    This file lets you customize the rendering environment for your stories. Create or update `.storybook/preview.ts` with the following:

    ```typescript
    // .storybook/preview.ts
    export { render, renderToCanvas } from '@aurelia/storybook';
    ```

    This imports the necessary rendering functions from the `@aurelia/storybook` plugin.

3. **Add scripts to your package.json**

    Add the following scripts to your `package.json` file:

    ```json
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
    ```

### Writing Your First Story

Now comes the fun part, writing stories for your Aurelia 2 components! Let's use a simple `HelloWorld` component as an example:

```typescript
// src/components/hello-world.ts
import { customElement, bindable } from 'aurelia';

@customElement({
    name: 'hello-world',
    template: '<button click.trigger="increment()">${message} - Count: ${count}</button>',
})
export class HelloWorld {
    @bindable message = 'Hello World';
    
    count = 0;
    
    increment() {
        this.count++;
    }
}
```


Here's how you would create a story for this component:

```typescript
// src/stories/hello-world.stories.ts
import { HelloWorld } from '../components/hello-world';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/testing-library';

const meta = {
  title: 'Components/HelloWorld',
  component: HelloWorld,
  render: (args) => ({
    template: `<hello-world message.bind="message" on-increment.bind="onIncrement"></hello-world>`,
  }),
  argTypes: {
    message: { control: 'text' },
    onIncrement: { action: 'increment' }
  }
};

export default meta;

export const Default = {
  args: {
    message: "Hello from Storybook!",
  },
};

export const Interactive = {
  args: {
    message: "Click the button!",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
  }
};
```

In this story:

- We define the component we're showcasing (`HelloWorld`).
- We use `argTypes` to enable controls for the `message` prop in the Storybook UI.
- We create a `Default` story with a basic message.
- We create an `Interactive` story that uses the `play` function to simulate user interactions (clicking the button).

### Running Storybook

With your stories in place, start Storybook with:

```bash
npm run storybook
```

This will launch Storybook in your browser, where you can interact with your `HelloWorld` component and see it in action!

## Examples

You can find examples of Storybook stories for Aurelia 2 components in the [Aurelia Storybook repository](https://github.com/aurelia/storybook) in the `apps` directory which showcases how to use the new plugin.
## Contributing and Feedback

This is an early release, and we're eager to hear your feedback! Please report any issues or suggestions on the project's GitHub repository. We're also open to contributions, so feel free to submit pull requests. The repository is available at [https://github.com/aurelia/storybook](https://github.com/aurelia/storybook).

## Acknowledgements

A special thanks to Dmitry (@ekzobrain on GitHub) for his pioneering work on Storybook support for earlier versions of Storybook, which laid some of the groundwork for this implementation.

## Conclusion

We're incredibly excited about this integration and believe it will significantly enhance your Aurelia 2 development workflow. Give it a try, experiment with your components, and let us know what you think! We're committed to making this integration even better as Aurelia 2 matures.


