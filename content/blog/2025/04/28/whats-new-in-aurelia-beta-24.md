+++
title = "What's New in Aurelia 2 Beta 24?"
authors = ["Dwayne Charrington"]
description = "Aurelia 2 Beta 24 is here! Discover the latest breaking changes, new features, bug fixes, and documentation updates in this major release."
date = 2025-04-28T10:00:00Z
lastmod = 2025-04-28T10:00:00Z
tags = ["aurelia2", "release"]
+++

## 🚨 Breaking Changes

Aurelia 2 Beta 24 introduces important breaking changes, but as always, we've got you covered with the details below.

### **Vite Plugin: Vite v6 Support**
- The Vite plugin now requires Vite v6. Update your project dependencies accordingly.  
[Commit](https://github.com/aurelia/aurelia/commit/5834d05)

### **Templating: Controller Host Removal**
- We've changed how Aurelia handles custom element hosts: if a host is already tied to another custom element, Aurelia won't create a new one. This mostly helps you avoid surprises/magic behaviors.
[Commit](https://github.com/aurelia/aurelia/commit/402c746)

### **DOM: Toggle $au and $aurelia**
- You can now hide the `$au` and `$aurelia` properties on DOM elements. If you want to make it harder for others to poke around or reverse engineer your app's internals, this is for you.  
[Commit](https://github.com/aurelia/aurelia/commit/7e1057b)

### **Type-Checking: Non-Public Members**
- Type-checking now supports non-public members, improving tooling and developer experience.  
[Commit](https://github.com/aurelia/aurelia/commit/165c213)

### **Documentation: New Tutorials & Guides**
- Tutorials for integrating Svelte, building with AI, creating a weather app, using web workers, websockets, and advanced list rendering and lambda expressions are now available.  
[Commit](https://github.com/aurelia/aurelia/commit/583d98d)

---

## ✨ New Features

### **Multiple `.class` Values in Templates**
- The template compiler now supports multiple `.class` values, making it easier to manage dynamic classes. The docs have also been updated to reflect this new behavior.
[Commit](https://github.com/aurelia/aurelia/commit/3b7513a)

### **Router-Lite: Navigation Strategy**
- New navigation strategy support in `router-lite` enables more flexible routing scenarios.  
[Commit](https://github.com/aurelia/aurelia/commit/6a7757f)

### **DOM: Toggle $au and $aurelia**
- You can now toggle the `$au` and `$aurelia` properties on DOM elements. This feature is designed to allow applications to make it harder to poke into or reverse engineer the view model/component trees of an Aurelia application. Some apps may wish to hide these properties completely for security or privacy reasons.  
[Commit](https://github.com/aurelia/aurelia/commit/7e1057b)

### **Type-Checking: Non-Public Members**
- Type-checking now supports non-public members, improving tooling and developer experience.  
[Commit](https://github.com/aurelia/aurelia/commit/165c213)

### **Documentation: New Tutorials & Guides**
- Tutorials for integrating Svelte, building with AI, creating a weather app, using web workers, websockets, and advanced list rendering and lambda expressions are now available.  
[Commit](https://github.com/aurelia/aurelia/commit/583d98d)

---

## 🐞 Bug Fixes

Aurelia 2 Beta 24 includes a host of bug fixes for improved stability and reliability:

- **i18n:** Reactive translation of conditional projected content (`t-params`).  
[Commit](https://github.com/aurelia/aurelia/commit/7fab7e6)
- **Dialog Service:** Updated tests for new error messages.  
[Commit](https://github.com/aurelia/aurelia/commit/4eb7805)
- **Validation:** Released references to binding behavior sources, invalidated property info cache, and improved rule discovery for nested expressions.  
[Commits](https://github.com/aurelia/aurelia/commit/78d0229), [a0b9ae6](https://github.com/aurelia/aurelia/commit/a0b9ae6), [f1e8956](https://github.com/aurelia/aurelia/commit/f1e8956)
- **Observation:** Allowed property deletion with proxies.  
[Commit](https://github.com/aurelia/aurelia/commit/7e652e9)
- **Ref Binding:** Updates value when key expression changes.  
[Commit](https://github.com/aurelia/aurelia/commit/9636d86)
- **Router-Lite:** Cancelling navigation with redirection from `canLoad` hook in child routes.  
[Commit](https://github.com/aurelia/aurelia/commit/bb0b09d)
- **Tooling/Typechecking:** Improved method call support.  
[Commit](https://github.com/aurelia/aurelia/commit/165c213)

---

## 📚 Documentation Updates

- Expanded documentation with new tutorials and guides for Svelte, ChatGPT, weather apps, web workers, websockets, list rendering, and lambda expressions.  
[Commit](https://github.com/aurelia/aurelia/commit/583d98d)

- Added in more detailed error documentation to help you understand and fix errors in your code.
[Commit](https://github.com/aurelia/aurelia/commit/4eb7805b25fae5c91eecbc80a52cc99d5781b119)

---

## 🔗 Full Changelog

For a complete list of changes in Beta 24, visit the [full changelog](https://github.com/aurelia/aurelia/compare/v2.0.0-beta.23...v2.0.0-beta.24).

---

## 📥 Upgrade Guide

To upgrade to Aurelia 2 Beta 24:
1. Update your project dependencies to the latest Aurelia packages and Vite v6.
2. Review breaking changes and update your code as needed.
3. Test your application thoroughly to ensure compatibility.

If you have any questions or need assistance, please join us on [Discord](https://discord.gg/TPV3cvCZhz) and reach out to the team.

---

Aurelia 2 Beta 24 continues to push the framework forward with powerful new features, improved stability, and expanded documentation.