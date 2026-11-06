# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official Aurelia website (aurelia.io) and blog, built with Hugo static site generator. The site uses a custom theme with Tailwind CSS 4 (beta) for styling.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with drafts and future posts
npm run dev         # or npm start
# Serves at http://localhost:1313

# Production build
npm run build       # outputs to public/

# Regenerate Tailwind CSS (after config changes)
npx @tailwindcss/cli -i themes/aurelia-theme/assets/css/index.css -o themes/aurelia-theme/assets/css/generated.css
```

### Aurelia Apps (Interactive Components)

The `aurelia-apps/` directory contains an Aurelia 2 application for interactive site components:

```bash
cd aurelia-apps
npm start           # Vite dev server
npm run build       # Production build to dist/
npm run lint        # ESLint + Stylelint
```

The playground (`/playground/` and the `playground` shortcode) lives in `src/examples/playground.*` and `src/playground/`. Examples for `/playground/` are files in `assets/playground/examples/<id>/`, listed in the front matter of `content/playground.md`. `npm run build` also bundles the Aurelia packages the preview can import (`playground-runtime/entry.ts`) into `static/aurelia2/playground/`. After rebuilding, restart `hugo serve`: it doesn't pick up new chunk names in `static/aurelia2` on its own.

## Architecture

### Directory Structure

- `content/` - Markdown pages and blog posts
  - Blog posts use path convention: `content/blog/YYYY/M/D/post-name.md`
- `themes/aurelia-theme/` - Custom Hugo theme
  - `layouts/` - Hugo templates
  - `assets/css/` - Tailwind CSS files
  - `data/` - Navigation config (header.yaml, footer.yaml)
- `aurelia-apps/` - Aurelia 2 app for interactive components (separate Vite project)
- `static/` - Unprocessed files (favicons, images, downloads)
- `config/`, `data/`, `i18n/` - Site-wide settings and localization

### Content Conventions

- **Front matter**: Use TOML format with ISO 8601 dates
- **Drafts**: Set `draft = true` while iterating
- **Table of contents**: Add `toc = true` to front matter for auto-generated navigation
- **Embeds**: URLs from YouTube, StackBlitz, CodePen, npm, GitHub are auto-embedded
- **Playground embeds**: Use the `playground` shortcode for editable, runnable Aurelia examples. Without a `main.ts`, `my-app.ts` (or the first component) starts the app.

  ```
  {{< playground height="460" open="my-app.html" >}}
  {{< playground-file "my-app.ts" >}}
  export class MyApp { name = 'Aurelia'; }
  {{< /playground-file >}}
  {{< playground-file "my-app.html" >}}
  <h1>Hello, ${name}!</h1>
  {{< /playground-file >}}
  {{< /playground >}}
  ```

### Writing Style

- Never use emdashes (—). Use commas, parentheses, colons, or separate sentences instead.
- Never use scare quotes ("") around terms. Either use the term directly or rephrase.

### Styling

- Use Tailwind CSS utility classes (utility-first approach)
- Icons: Font Awesome (solid and brand icons available)
- Follow existing 2-space indentation in theme files

## Commit Guidelines

Use Conventional Commits with scoped prefixes:
- `feat(blog):` - Blog content changes
- `feat(theme):` - Theme/layout changes
- `fix(site):` - Bug fixes
- `docs(content):` - Documentation updates

Verify `npm run build` completes without errors before committing.
