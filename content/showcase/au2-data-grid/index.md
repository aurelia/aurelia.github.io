---
title: "Au2 Data Grid"
description: "A flexible data grid component for Aurelia 2 that supports custom elements, pagination, sorting, and column management."
date: 2023-01-15
showcase_categories: ["plugins", "data"]
github: "Sayan751/au2-data-grid"
npm: "@sparser/au2-data-grid"
demo: "https://sparser.github.io/au2-data-grid"
featured_image: "/images/showcase/au2-data-grid.png"
---

## Overview

Au2 Data Grid is a powerful and flexible data grid component for Aurelia 2 applications. Its standout feature is the ability to define the entire grid structure in markup, allowing seamless integration with your custom Aurelia 2 elements.

## Features

- **Custom Element Support**: Define grid columns using your own Aurelia 2 custom elements
- **Flexible Selection**: Configure single, multiple, or no item selection
- **Data Source Freedom**: Support for both static content and backend services
- **Pagination**: Built-in support for pageable content
- **Sorting**: Custom sort functionality via callbacks
- **Column Management**: 
  - Drag-and-drop column reordering
  - Column resizing
  - Efficient updates without full grid re-rendering

## Usage Example
```html
<data-grid model.bind="people">

  <!-- column #1 -->
  <grid-column>
    <header>
      <value-text value="First name"></value-text>        <!-- custom element -->
    </header>
    <normal-text value.bind="item.fname"></normal-text>   <!-- custom element -->
  </grid-column>

  <!-- column #2 -->
  <grid-column>
    <header>
      <value-text value="Last name"></value-text>
    </header>
    <normal-text value.bind="item.lname"></normal-text>
  </grid-column>

  <!-- column #3 -->
  <grid-column>
    <header>
      <value-text value="Age"></value-text>
    </header>
    <normal-text value.bind="item.age"></normal-text>
  </grid-column>
</data-grid>
```

## Installation 

```bash
npm i @sparser/au2-data-grid
```


The grid is designed to be framework-agnostic in terms of HTTP communication, allowing you to use your existing HTTP pipeline for data fetching and management.