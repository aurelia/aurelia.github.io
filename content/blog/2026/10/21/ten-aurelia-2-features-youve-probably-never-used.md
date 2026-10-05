+++
title = "Ten Aurelia 2 Features You've Probably Never Used"
authors = ["Dwayne Charrington"]
description = "Counting with repeat.for, comparing against the previous item, template variables, promises in markup, portals, two-way focus, key modifiers, and a few more small things that save you writing code."
date = 2026-10-21T08:00:00+10:00
lastmod = 2026-10-21T08:00:00+10:00
tags = ["aurelia2", "tutorial"]
toc = true
+++

Most Aurelia apps get by on `value.bind`, `click.trigger`, `if.bind` and `repeat.for`. That covers a lot, but Aurelia 2 ships with plenty of smaller features that don't get much attention, and each one replaces code you'd otherwise write yourself.

Here are ten of them. Everything below works in RC.2 with no extra packages or registration.

## 1. Counting with `repeat.for`

`repeat.for` doesn't need an array. Give it a number and it counts from zero:

```html
<span
  repeat.for="i of 5"
  class="star ${i < rating ? 'filled' : ''}">★</span>
```

With `rating = 3`, you get five stars and the first three are filled. Skeleton loaders, pagination dots and fixed-size grids all work the same way, with no `Array.from({ length: 5 })` in your view model.

## 2. `$previous` in a repeat

You probably know `$index`, `$first` and `$last`. There's also `$previous`, which gives you the item from the iteration before. It's the easy way to add group headings to a sorted list:

```html
<template repeat.for="message of messages">
  <h3 if.bind="message.day !== $previous?.day">${message.day}</h3>
  <p>${message.text}</p>
</template>
```

A heading only renders when the day changes. The first item has no previous item, so the `?.` handles that case. It stays correct as the list changes, too: insert a message in the middle and the headings around it update.

## 3. `<let>` for template variables

When a template keeps repeating the same expression, give it a name with `<let>`:

```html
<let subtotal.bind="items.reduce((sum, item) => sum + item.price * item.quantity, 0)"></let>

<p>Subtotal: ${subtotal}</p>
<p if.bind="subtotal >= 100">You've got free shipping.</p>
```

Kebab-case names become camelCase, so `<let full-name.bind="...">` gives you `fullName`. The value updates when anything it depends on changes, and it belongs to the template, not your view model. If you do want it on the view model, add `to-binding-context` to the element.

## 4. `promise.bind`

Loading states usually mean an `isLoading` flag, an `error` property and a `try/catch/finally`. `promise.bind` does all of that in the template:

```html
<div promise.bind="profile">
  <p pending>Loading…</p>
  <p then="user">Hello, ${user.name}</p>
  <p catch="error">Couldn't load your profile: ${error.message}</p>
</div>
```

```ts
export class ProfilePage {
  profile = fetch('/api/me').then(r => r.json());
}
```

Only one of the three renders at a time. Assign a new promise to `profile` (for a retry button, say) and the template goes back to `pending` until it settles. If an older promise settles after you've replaced it, its result is ignored.

## 5. `portal`

Tooltips, dropdowns and modals have a habit of getting clipped by a parent with `overflow: hidden` or trapped under a sibling's `z-index`. `portal` renders an element somewhere else in the DOM while it stays bound to the component that declared it:

```html
<div class="tooltip" portal if.bind="showTooltip">
  ${tooltipText}
</div>
```

With no value, the element moves to the end of `<body>`. Give it a selector to put it somewhere specific:

```html
<div portal="#modals">...</div>
```

The bindings still use your component's scope, so `${tooltipText}` and any event handlers work as if the element never moved.

## 6. Two-way `focus.bind`

Focus is normally something you set imperatively, with a `ref` and a call to `.focus()`. The `focus` attribute binds it like any other value, and it's two-way by default:

```html
<input focus.bind="searchFocused" value.bind="query">
<p show.bind="searchFocused">Press Enter to search</p>
```

Set `searchFocused = true` and the input gets focus. When the user clicks or tabs away, `searchFocused` goes back to `false`. That makes it easy to focus a field when a panel opens, or to show hints only while the user is in the field.

## 7. `show.bind` and `hide.bind`

`if.bind` adds and removes elements. `show.bind` only toggles visibility:

```html
<div show.bind="isExpanded">...</div>
<div hide.bind="isExpanded">...</div>
```

`hide.bind` is the inverse, which saves you writing `show.bind="!isExpanded"`. Use `show` when something toggles often or holds state you want to keep, like a half-filled form in a collapsed panel or a video that should keep its place. Use `if` when the content is expensive to keep around or shouldn't exist at all until it's needed.

## 8. Event modifiers

Event bindings take modifiers after a colon, which covers most of what you'd otherwise check by hand in the handler:

```html
<!-- only on Enter -->
<input keydown.trigger:enter="addTodo()">

<!-- Ctrl+Enter to send, plain Enter still adds a new line -->
<textarea keydown.trigger:ctrl+enter="send()"></textarea>

<!-- call preventDefault() for you -->
<form submit.trigger:prevent="save()">...</form>

<!-- shift-click to select a range -->
<li click.trigger:shift="selectRange(item)">${item.name}</li>
```

`prevent` and `stop` call `preventDefault()` and `stopPropagation()`. `ctrl`, `alt`, `shift` and `meta` check modifier keys, and `left`, `middle` and `right` check mouse buttons. You can combine them with `+`, so `keydown.trigger:ctrl+shift+enter` works too.

## 9. `& self`

A modal backdrop should close the modal when it's clicked, but not when the click lands on the dialog inside it. Normally that means comparing `event.target` and `event.currentTarget`. The `self` binding behavior does it for you:

```html
<div class="backdrop" click.trigger="close() & self">
  <div class="dialog">
    <button>Inside the dialog</button>
  </div>
</div>
```

The handler only runs when the click target is the element with the binding, so clicks that bubble up from the dialog are ignored.

## 10. `& signal`

Some values change without any property changing. Relative times are the classic case: "just now" should become "5 min ago" even though `postedAt` hasn't changed. Bindings with `& signal` update whenever you send that signal. Here `timeAgo` is a value converter that turns a date into text like "5 min ago":

```html
<span>${comment.postedAt | timeAgo & signal:'clock'}</span>
```

```ts
import { ISignaler, resolve } from 'aurelia';

export class CommentList {
  private readonly signaler = resolve(ISignaler);
  private timer?: ReturnType<typeof setInterval>;

  attached() {
    this.timer = setInterval(() => this.signaler.dispatchSignal('clock'), 60_000);
  }

  detached() {
    clearInterval(this.timer);
  }
}
```

Every binding that listens for `clock` updates once a minute, anywhere in the app. Signals are also handy after a language or currency change, when every formatted value on the page needs to update at once.

## That's ten

There are more where these came from. `& updateTrigger:'blur'`, `& attr`, `switch.bind` and the spread syntax for bindables would all fit in a post like this. If you have a favourite small feature that should have made the list, tell us on [Discord](https://discord.gg/TPV3cvCZhz).
