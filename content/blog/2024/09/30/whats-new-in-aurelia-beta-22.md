+++
title = "What’s New in Aurelia 2 Beta 22?"
authors = ["Dwayne Charrington"]
description = "The Aurelia team is thrilled to announce the release of **Aurelia 2 Beta 22**, packed with significant updates, new features, breaking changes, bug fixes, and improved documentation. This release represents our ongoing commitment to providing a robust and modern JavaScript framework for developers. Let’s dive into the highlights!"
date = 2024-09-30T10:00:00Z
lastmod = 2024-09-30T10:00:00Z
tags = ["aurelia2", "release"]
+++

## 🚨 Breaking Changes

With Beta 22, some significant breaking changes have been introduced to streamline functionality and align behavior with modern JavaScript principles. Developers upgrading to Beta 22 should review these changes carefully:

### **1. Improved `null`/`undefined` Handling in AST**  
Handling of `null` and `undefined` has been refined to behave more intuitively.  
- Property access on `null` or `undefined` now returns `undefined` in non-strict mode, mimicking optional chaining.
- Function calls on `null` or `undefined` also return `undefined`.

This ensures consistency across template expressions while maintaining compatibility with JavaScript’s strict mode. [Commit](https://github.com/aurelia/aurelia/commit/b96d7c4)

---

### **2. Bindable Callback Timing Adjusted**  
Callbacks on `bindable` properties are now triggered *after all changes have settled*. This improves stability and ensures callback logic executes at the correct time, particularly in complex binding scenarios. [Commit](https://github.com/aurelia/aurelia/commit/1e587e1)

---

### **3. Cleaner Parser Interfaces**  
The `ExpressionParser` no longer provides defaults for parsing.  
- This simplifies build-time compilation, reduces bundled code, and eliminates unnecessary expression parser inclusions.  
[Commit](https://github.com/aurelia/aurelia/commit/b55cbcd)

---

### **4. AST Evaluation Enhancements**  
Binding behavior and value converter evaluations are now optional in AST interfaces.  
- This allows greater flexibility in scenarios like effects, computed properties, and validation messages where these functionalities aren’t required.  
[Commit](https://github.com/aurelia/aurelia/commit/7d7e21b)

---

## ✨ New Features

### **1. Watch Expressions**  
The `observation` module introduces the ability to watch expressions.  
- Developers can now directly observe complex expressions, simplifying reactive data flows. [Commit](https://github.com/aurelia/aurelia/commit/6cd6b8d)

---

### **2. Reuse of Host and HostController**  
The `runtime-html` module now supports reusing host elements and their associated controllers.  
- This reduces overhead in scenarios where components or templates are reused frequently. [Commit](https://github.com/aurelia/aurelia/commit/0fe216e)

---

### **3. Aggregated Callbacks for Bindables**  
Bindables now support aggregated callbacks, enabling better coordination when multiple properties change simultaneously. [Commit](https://github.com/aurelia/aurelia/commit/7cdf3f0)

---

## 🐞 Bug Fixes

We’ve addressed numerous bugs to improve stability and developer experience:

- **Router-Lite**: Fixed issues allowing dots in parameter values and resolving element injection issues. [Details](https://github.com/aurelia/aurelia/commits/main?path=packages/router-lite)
- **Repeat Binding**: Addressed update issues involving duplicate items. [Commit](https://github.com/aurelia/aurelia/commit/9834c40)
- **Validation**: Improved prioritization of translated messages and fixed binding reset issues in validation HTML. [Details](https://github.com/aurelia/aurelia/commits/main?path=packages/validation-html)
- **Miscellaneous**: Fixed radio start/stop handling, refresh issues with URL parameters, and async redirection edge cases in the router. 

---

## 📚 Documentation Updates

This release includes updates to the documentation, such as detailed instructions for integrating TailwindCSS with the Vite plugin. A big thanks to our contributor [@hdzcalmir](https://github.com/hdzcalmir) for this improvement. [Details](https://github.com/aurelia/aurelia/commit/47913c5)

---

## 👥 New Contributors

We’re excited to welcome new contributors to the Aurelia community! Special shoutout to [@hdzcalmir](https://github.com/hdzcalmir) for their first contribution in improving our TailwindCSS integration documentation.

---

## 🔗 Full Changelog

For a complete list of changes in Beta 22, visit the [full changelog](https://github.com/aurelia/aurelia/compare/v2.0.0-beta.21...v2.0.0-beta.22).

---

## 📥 Upgrade Guide

To upgrade to Aurelia 2 Beta 22:
1. Update your project dependencies to the latest version of Aurelia packages.
2. Review breaking changes and update your code accordingly.
3. Test your application thoroughly to ensure compatibility.

---

Aurelia 2 Beta 22 continues to enhance the framework with powerful new features and refined behaviors. We can’t wait to see what you’ll build with it! 🚀