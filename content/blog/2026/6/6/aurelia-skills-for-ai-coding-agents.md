+++
title = "Aurelia Skills for AI Coding Agents"
authors = ["Dwayne Charrington"]
description = "Aurelia now has a public skills repository for Claude Code, Codex, and other AI coding agents."
date = 2026-06-06T10:00:00+10:00
lastmod = 2026-06-06T10:00:00+10:00
tags = ["aurelia2", "ai", "tools", "community"]
+++

A few people have asked whether Aurelia could have skills for tools like Claude Code and Codex.
That is a reasonable ask. More developers are using AI coding agents inside real projects now, and
framework-specific context matters.

So we created a public repository for it:

[github.com/aurelia/skills](https://github.com/aurelia/skills)

The first skill in the repo is for Aurelia 2. It is built from the same working guidance we have
been using locally: the sharp edges, the migration gotchas, the preferred project shape, and the
things an agent is likely to get wrong if it only learned Aurelia from a mix of old examples and
generic JavaScript advice.

## Why this exists

AI coding tools are only as useful as the context they have. Aurelia has been around long enough
that there is a lot of older material on the web, and not all of it applies to Aurelia 2.

That is where agents can drift. They might reach for `.delegate`, suggest `@autoinject`, set
`experimentalDecorators`, or invent project structure that does not match how Aurelia 2 works with
Vite today.

The skill gives the agent a better starting point. It tells it to inspect the project first, follow
the conventions already in the repo, and use current Aurelia 2 patterns. It also includes reminders
for the boring things that save time later, like making sure `tslib` exists when `importHelpers` is
enabled.

This is not a replacement for the docs. It is a working guide for coding agents so they stop
guessing.

## What is in the Aurelia 2 skill

The current `aurelia2` skill covers day-to-day Aurelia work:

- scaffolding new Aurelia 2 apps
- creating components and routes
- working with Vite projects
- using modern binding commands
- dependency injection and decorators
- testing with Vitest and Playwright
- Storybook and Tailwind setup when the project actually needs them
- SSR, prerendering, hydration, sitemap, robots, and takeover guidance

The SSR guidance lives in a separate reference file so agents only load it when the task asks for
SSR, prerendering, SEO rendering, hydration, or related debugging. That keeps the main skill focused
while still giving agents enough detail when the work gets deeper.

## Installing it in Codex

Codex users can install the Aurelia 2 skill directly from GitHub:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo aurelia/skills \
  --path skills/aurelia2
```

Restart Codex after installing so it picks up the new skill.

The repository also includes Codex plugin metadata, so it can be added as a marketplace:

```bash
codex plugin marketplace add aurelia/skills
```

## Installing it in Claude Code

Claude Code users can add the repository as a plugin marketplace:

```bash
claude plugin marketplace add aurelia/skills
claude plugin install aurelia-skills@aurelia-skills
```

For local testing, you can also clone the repo and load it for one session:

```bash
claude --plugin-dir /path/to/skills
```

## A shared home for future skills

The repository is called `aurelia/skills` on purpose. The first skill is for Aurelia 2, but the repo
does not need to stop there.

If we add skills for migrations, documentation work, plugin development, or common production
patterns, they can live in the same place. The useful thing here is not the packaging format. It is
having a shared, public source of truth that the community can improve.

If you have a repeatable Aurelia workflow, we would love to see it turned into a skill. It does not
have to be limited to Aurelia 2. Aurelia 1 skills are welcome too, especially for teams maintaining
production apps, planning migrations, or teaching agents how older Aurelia projects are structured.

Good candidates are the things you already find yourself explaining more than once: router patterns,
validation setup, forms, testing, migration checks, bundler gotchas, plugin authoring, or production
debugging habits. If a coding agent keeps making the same mistake, that is probably skill material.

Open a pull request on [aurelia/skills](https://github.com/aurelia/skills) with the skill folder and
the context you think agents need. The goal is simple: make working with Aurelia and modern LLM
tooling a nicer experience for everyone.

If you use Claude Code, Codex, or another tool that supports this style of skill, try it on an
Aurelia project and tell us where it falls short. The best version of this will come from the same
place Aurelia itself comes from: people using it on real apps, finding the rough parts, and helping
to smooth them out.
