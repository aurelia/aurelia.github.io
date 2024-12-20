+++
title = "What's New in Aurelia 2 Beta 21?"
authors = ["Dwayne Charrington"]
description = "The Aurelia 2 Beta 21 release focuses on enhancing developer experience and addressing community-reported issues. Key improvements include support for increment/decrement assignment operators, fixes for the state plugin, router enhancements, and task queue refinements."
date = 2024-08-08T12:00:00Z
lastmod = 2024-08-08T12:00:00Z
tags = ["aurelia2", "release"]
+++

We're excited to announce the release of **Aurelia 2 Beta 21**! This release brings several highly requested features and important bug fixes to improve your development experience. Let's dive into what's new! 🚀

## ✨ New Features

### **Increment/Decrement Assignment Operators**

One of our most requested features is finally here! Beta 21 introduces support for unary increment/decrement and assignment operators (`++`, `--`, `+=`, `-=`, `/=`, `*=`). This allows for more concise and expressive code in your templates.

**Example:**
```html
<button @click="value++">Increment</button>
<button @click="value += 2">Increment by 2</button>
```

> **Important Note:** Using these operators in non-trigger bindings will result in an error (`AUR0113`) to prevent infinite update-eval loops.

```html
<!-- ❌ These will throw AUR0113 -->
<div>${value++}</div>
<my-component :prop="value++"></my-component>
```

## 🐞 Bug Fixes

### **State Plugin Improvements**
The state plugin received a critical fix ensuring all queued actions are properly executed. Previously, the last action in a queue might not be called if an action handler returned a promise that resolved after the second action was dispatched. ([#2023](https://github.com/aurelia/aurelia/pull/2023))

### **Router Enhancements**
- **Router-Lite**: Fixed element injection for routed view-models ([#2012](https://github.com/aurelia/aurelia/pull/2012))
- **Default Child Routes**: Resolved issues with filtering available endpoints ([#2013](https://github.com/aurelia/aurelia/pull/2013))
- **History Strategy**: Fixed router-lite behavior when `historyStrategy` is set to `none` ([#2005](https://github.com/aurelia/aurelia/pull/2005))

### **Task Queue Refinements**
- Fixed timing issues with multiple persistent delayed tasks ([#2007](https://github.com/aurelia/aurelia/pull/2007))
- Improved task queue processing loop for better reliability

### **Development Experience**
- **Vite Plugin**: Resolved vitest issues on Windows with HTML files ([#2006](https://github.com/aurelia/aurelia/pull/2006))
- **Types**: Improved bindable definitions for better TypeScript support ([#2010](https://github.com/aurelia/aurelia/pull/2010))

## 🔄 Refactorings

- **Task Queue**: Removed the 'reusable' parameter for simpler implementation ([#2008](https://github.com/aurelia/aurelia/pull/2008))
- **Binding**: Enhanced handling of binding glitches ([#2020](https://github.com/aurelia/aurelia/pull/2020))

## 📥 How to Upgrade

To upgrade to Aurelia 2 Beta 21:
1. Update your project dependencies to the latest version
2. Test your application thoroughly, particularly if you're using the state plugin or router features
3. Take advantage of the new increment/decrement operators in your templates!

## 🔗 Additional Resources

For a complete list of changes, check out the [full changelog](https://github.com/aurelia/aurelia/compare/v2.0.0-beta.20...v2.0.0-beta.21).

---

We're continuously working to make Aurelia 2 better with each release. Thank you to all our contributors and community members for your ongoing support and feedback! 💪
