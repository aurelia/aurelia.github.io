+++
title = "Aurelia 2 Meets the World: Integrating with Vue, React, and Svelte using Island Architecture"
authors = ["Dwayne Charrington"]
description = "How to use the island architecture with Aurelia 2 and modern libraries."
date = 2025-01-08T10:00:00Z
lastmod = 2025-01-08T10:00:00Z
tags = ["aurelia2", "tutorial"]
+++

In the ever-evolving ecosystem of web, frameworks and libraries are no longer isolated silos but are expected to coexist and collaborate. Aurelia 2, with its powerful binding system and extensibility, shines as a framework capable of seamlessly integrating into applications built with other popular frameworks like Vue, React, and Svelte. One standout approach to achieving this is through the Island Architecture, which allows developers to carve out interactive components or sections within an otherwise static or framework-specific app.

In this post, we’ll explore how you can use Aurelia 2 alongside other frameworks using techniques like bootstrapping and enhancement. We’ll dive into real-world examples that showcase how to add Aurelia components to React, Vue, or even static HTML pages, making the most of this flexible framework.

## What is Island Architecture?

Island Architecture is an approach where interactive, JavaScript-powered components (islands) are embedded within otherwise static or server-rendered content. These islands can be powered by different frameworks, making it a natural fit for Aurelia 2’s modular design. This architecture is particularly useful when migrating legacy apps or building hybrid solutions that blend multiple technologies.

### Why Use Aurelia 2 in Multi-Framework Applications?

1. Framework-Agnostic Enhancements: Aurelia’s enhance API allows it to integrate with existing DOM, enabling you to upgrade static or server-rendered content into interactive components without full framework control.
2. Incrementally migrate from Aurelia 1: Aurelia 2’s modular architecture makes it easier to migrate from Aurelia 1, leveraging existing components and code.
2. Modular Architecture: Aurelia’s flexible architecture makes it easy to initialize and manage individual components independently.
3. Minimal Footprint: Aurelia 2’s performance and bundling ensure a lightweight addition to your existing stack.

## Understanding Aurelia 2 Initialization Methods

Before diving into examples, it's important to understand the two main ways to initialize Aurelia 2:

### `.enhance()` vs `.app().start()`

- **enhance()**: Used when you want Aurelia to enhance existing DOM elements without taking over the entire page. Perfect for island architecture and embedding within other frameworks.
- **app().start()**: Used when Aurelia should control the entire application lifecycle and DOM. This is typically used for full Aurelia applications.

For our island architecture examples, we'll use `.enhance()` since we want Aurelia to coexist with other frameworks rather than take full control.

## Example 1: Using Aurelia 2 in a Aurelia 1 Application

A common scenario is you have an existing Aurelia 1 application and you want to migrate to Aurelia 2, but you don't want to do it all at once (for cost and time reasons). You can start by embedding Aurelia 2 components into your existing application, incrementally migrating your application to Aurelia 2 on a per-component basis.

Say for example you have a component called `dynamic-form` in your Aurelia 1 application and you want to migrate this to Aurelia 2. You could replace the element with an element and a specific ID.

### Your Aurelia 1 HTML might look like this:

```html
<require from="./dynamic-form"></require>
<dynamic-form></dynamic-form>
```

You could replace this with HTML such as:
```html
<div id="dynamic-form"></div>
```

In your Aurelia 2 component HTML, use the HTML from your Aurelia 1 application.

### Aurelia 2 (most likely inside of a `main.ts` or `main.js` file):

```typescript
import { Aurelia } from 'aurelia';
import { DynamicForm } from './dynamic-form';

const au = new Aurelia();

const host = document.querySelector('#dynamic-form');
if (host) {
  au.enhance({
    host,
    component: DynamicForm
  });
}
```

This will use our DIV as the host and load our `dynamic-form` component defined in Aurelia 2 inside of the DIV.

## Example 2: Embedding Aurelia Components in a Vue Application

Let's say you're working on a Vue application but want to leverage Aurelia 2's powerful binding system for a complex form component.

### Vue Component:

```vue
<template>
  <div>
    <h1>Vue App</h1>
    <div ref="aureliaHost"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Aurelia } from 'aurelia';
import { DynamicForm } from './dynamic-form';

// Use Vue ref instead of querySelector
const aureliaHost = ref<HTMLElement | null>(null);
let au: Aurelia | null = null;

onMounted(async () => {
  if (aureliaHost.value) {
    au = new Aurelia();
    await au.enhance({
      host: aureliaHost.value,
      component: DynamicForm
    });
  }
});

onUnmounted(() => {
  // Ensure proper cleanup
  if (au) {
    au.stop();
    au = null;
  }
});
</script>
```

## Example 3: Using Aurelia in a React Application

React's declarative nature works harmoniously with Aurelia's flexibility. Here's how to embed an Aurelia component within a React application:

```typescript
import React, { useEffect, useRef } from 'react';
import { Aurelia } from 'aurelia';
import { ChatWidget } from './chat-widget';

interface LiveChatProps {
  initialMessages?: string[];
  onMessageSent?: (message: string) => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ initialMessages, onMessageSent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let au: Aurelia | null = null;
    
    if (containerRef.current) {
      au = new Aurelia();
      au.enhance({
        host: containerRef.current,
        component: ChatWidget
      });
    }

    return () => {
      if (au) {
        au.stop();
      }
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default LiveChat;
```

## Example 4: Integrating Aurelia with Svelte

Svelte's simplicity and compilation-first approach can be augmented with Aurelia for complex data bindings or interactions.

### Svelte Component:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Aurelia } from 'aurelia';
  import { AnalyticsDashboard } from './analytics-dashboard';

  // Props
  export let dashboardData = {};
  export let onDataUpdate = (data) => {};

  // References
  let container: HTMLElement;
  let au: Aurelia;

  onMount(() => {
    // Ensure container exists before enhancing
    if (container) {
      au = new Aurelia();
      au.enhance({
        host: container,
        component: AnalyticsDashboard
      });
    }
  });

  onDestroy(() => {
    if (au) {
      au.stop();
    }
  });
</script>

<!-- Bind the container element -->
<div bind:this={container}></div>
```

## Best Practices

1. **Proper Lifecycle Management**: Always clean up Aurelia instances using `au.stop()` when the host component unmounts.
2. **Isolated Components**: Keep Aurelia components self-contained to avoid conflicts with the parent framework.
3. **State Management**: Consider using events or shared services for communication between Aurelia and host framework components.
4. **Performance Optimization**: 
   - Lazy load Aurelia components when possible
   - Use micro-frontends patterns for larger applications
   - Configure build tools to optimize bundle sizes

## Common Pitfalls to Avoid

1. **Memory Leaks**: Failing to cleanup Aurelia instances when components unmount
2. **DOM Conflicts**: Attempting to manipulate the same DOM elements from both frameworks
3. **Event Bubbling**: Not properly handling event propagation between frameworks
4. **Style Isolation**: CSS conflicts between framework-specific styles

## Conclusion

Aurelia 2’s modular and framework-agnostic design makes it a powerhouse for integrating interactive components into existing applications. Whether you’re embedding it in Vue, React, Svelte, or static HTML, the flexibility of the enhance API and Island Architecture ensures seamless interactivity without overhauling your entire stack.

By leveraging Aurelia 2 in multi-framework environments, you gain the best of all worlds, creating modern, engaging web experiences tailored to your needs.