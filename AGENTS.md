# Repository Guidelines
This repository produces the public Aurelia website (aurelia.io) and companion blog as a Hugo-powered static site. Use the guidance below to keep releases fast and consistent.

## Project Structure & Module Organization
This Hugo site is configured through `hugo.toml`, with content and theme assets separated for clarity. Keep edits focused in the following directories:
- `content/` for Markdown pages and blog posts (`content/blog/YYYY/M/D/` keeps publishing dates consistent).
- `themes/aurelia-theme/` for layout templates (`layouts/`), reusable data (`data/`), and Tailwind-driven styling (`assets/`).
- `static/` for unprocessed files such as favicons, downloads, or partner logos.
- `resources/` and `public/` are Hugo build outputs; generated artifacts should not be committed unless release tooling explicitly requires it.
- `config/`, `data/`, and `i18n/` hold site-wide settings, menu definitions, and localized strings.

## Build, Test, and Development Commands
- `npm install` installs Hugo-related tooling (Tailwind CLI, PostCSS plugins).
- `npm run dev` (alias `npm start`) runs `hugo serve -D -F --ignoreCache`; use it for iterative work and previewing drafts at http://localhost:1313.
- `npm run build` calls `hugo --minify` to produce an optimized site in `public/`; run before every pull request to surface content or template warnings.
- `npx @tailwindcss/cli -i themes/aurelia-theme/assets/css/index.css -o themes/aurelia-theme/assets/css/generated.css` regenerates theme CSS if you adjust Tailwind configuration.

## Coding Style & Naming Conventions
Follow Conventional Commits naming for files and directories (e.g., blog folders mirror publication date). Markdown uses TOML front matter with ISO 8601 dates and `draft = true` while iterating. Keep prose wrapped at ~100 characters and use fenced code blocks with language hints. Theme JavaScript and CSS follow Tailwind 4 defaults; prefer utility-first classes over custom CSS, and respect the existing 2-space indentation.

## Writing Style
- Never use emdashes (—). Use commas, parentheses, colons, or separate sentences instead.
- Never use scare quotes ("") around terms. Either use the term directly or rephrase.

## Testing Guidelines
Automated tests are not yet configured, so rely on build verification. Run `npm run build` to catch broken shortcodes, missing assets, and i18n issues. While developing, watch the terminal output from `npm run dev` for 404s or deprecation notices, and refresh across desktop and mobile breakpoints before approval.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits with scoped prefixes (`feat(blog): introduce roadmap update`, `fix(theme): correct footer spacing`). Group related changes and keep generated files out of the diff. Pull requests must include: a concise summary, linked issue or discussion, screenshots or GIFs for visual changes, and confirmation that `npm run build` completes without errors. Tag reviewers familiar with the affected area (content, theme, or configuration) to accelerate feedback.
