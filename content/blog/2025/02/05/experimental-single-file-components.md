+++
title = "Experimental Single File Components Support For Aurelia 2 + Vite"
authors = ["Dwayne Charrington"]
description = "We're excited to announce experimental support for Single File Components (SFCs) in Aurelia 2. Learn how SFCs simplify your development workflow."
date = 2025-02-05T05:46:52+10:00
lastmod = 2025-02-05T05:46:52+10:00
tags = ["aurelia2", "vite", "sfc"]
+++

We're excited to announce **experimental support** for Single File Components (SFCs) in Aurelia 2 through a new Vite plugin. This marks a major step towards a more integrated and streamlined development experience in your Aurelia projects.

## What Are Single File Components?

Single File Components (SFCs) let you encapsulate your component's template, logic, and styles in a single `.au` file. If you've used Vue or other modern frameworks, you already appreciate the benefits, including:

- **Modularity:** Organize your component's structure without juggling multiple files.
- **Scoped Styles:** Automatically scope your styles to each component to prevent global CSS conflicts.
- **Preprocessor Support:** Easily work with Sass, Stylus, or even custom preprocessors.
- **Enhanced HMR:** Enjoy fast hot module replacement via Vite's efficient bundling.

## Why Are We Adding This Feature?

The Aurelia 2 team is committed to reducing boilerplate and making component development more enjoyable. With SFCs you can:

- **Streamline Development:** Combine HTML, CSS, and JavaScript into a single file.
- **Leverage Modern Tools:** Benefit from Vite's significant performance improvements, particularly during development.
- **Improve Maintainability:** Keep your codebase modular and easier to manage.

## Getting Started

To try out the experimental SFC support for Aurelia 2, install the SFC Vite plugin:

```bash
npm install @aurelia/sfc-vite --save-dev
```

In your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite';
import aurelia from '@aurelia/vite-plugin';
import aureliaSingleFileComponent from '@aurelia/sfc-vite';

export default defineConfig({
  plugins: [
    aurelia(),
    aureliaSingleFileComponent()
  ]
});
```

## How It Works

The SFC plugin transforms `.au` files into Aurelia-compatible components through:

1. **Virtual Modules:** Each section (`script`, `template`, `style`) becomes a virtual module for Vite to process
2. **Automatic Composition:** Combines template and class into a proper Aurelia component
3. **Style Scoping:** Adds unique data attributes for CSS isolation when using `scoped` attribute

## Using SFCs in Aurelia

Here's a complete example showing key features:

```html
<script lang="ts">
  import { bindable } from 'aurelia';

  export default class MyComponent {
    @bindable greeting = 'Hello';
  }
</script>

<template>
  <div>
    <h1>${greeting}, ${name}!</h1>
    <p if.bind="showMessage">This is scoped to this component</p>
  </div>
</template>

<style scoped lang="scss">
  $primary: #2c3e50;
  
  h1 {
    color: $primary;
    font-family: system-ui;
  }
  
  p {
    padding: 1rem;
    background: lighten($primary, 60%);
  }
</style>
```

And then register the component in your `main.ts` or `main.js`:

```typescript
import Aurelia from 'aurelia';
import { MyApp } from './my-app';

import MyComponent from './my-component.au';

Aurelia
  .register(MyComponent)
  .app(MyApp)
  .start();
```

If you're working with a TypeScript project, you will need to add the following to your `resources.d.ts` file to get rid of the type error:

```typescript
declare module '*.au';
```

## Key Features Deep Dive

### 1. Style Scoping Magic ✨
When using `<style scoped>`, the plugin automatically:
- Generates unique data attributes (e.g., `data-v-7ba5bd90`)
- Applies them to all root template elements
- Transforms CSS selectors to match scoped attributes

```css
/* Input */
h1 { color: blue; }

/* Output */
h1[data-v-7ba5bd90] { color: blue; }
```

### 2. Preprocessor Power ⚡
The plugin supports popular CSS preprocessers out of the box:

```html
<style lang="scss">
  /* SCSS features work! */
  $colors: red, green, blue;
  
  @each $color in $colors {
    .text-#{$color} { color: $color; }
  }
</style>
```

### 3. Custom Configuration
Advanced users can configure processing options:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    aureliaSingleFileComponent({
      style: {
        preprocessors: {
          scss: (code) => require('sass').compileString(code).css,
          // Add custom preprocessors here
        }
      }
    })
  ]
});
```

## Current Limitations

While exciting, this experimental implementation has some constraints and is definitely very much a work in progress. Some of the limitations include:

- 🚧 Components must be registered in your `main.ts` or `main.js` file
- 🚧 Single root element templates work best
- 🚧 No support for template-level type checking
- 🚧 Complex style selectors might need manual scoping
- 🚧 TypeScript source maps need additional configuration
- 🚧 No template pre-processors yet (Pug, Haml, etc.)

## Why Try It Now?

Even in this experimental state, SFCs offer:

- 🧪 Faster prototyping with colocated code
- 🧪 Foundation for future community standards
- 🧪 Opportunity to shape the SFC specification

## What's Next?

We're actively working on:

- Better TypeScript integration
- Expanded template features
- Official VSCode extension support
- Performance optimizations

Give it a try and share your feedback! Our goal is to make Aurelia SFCs the most developer-friendly implementation in the framework ecosystem.

> **Important**: This feature is purely opt-in - existing component formats will continue to work unchanged. We're committed to maintaining Aurelia's legendary backward compatibility.