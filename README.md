# Aurelia Website

The official website and blog for Aurelia (aurelia.io), built with Hugo.

## 🚀 Quick Start

1. **Prerequisites**
   - [Hugo Extended](https://gohugo.io/installation/) (v0.110.0 or later)
   - [Node.js](https://nodejs.org/) (v16 or later)
   - [npm](https://www.npmjs.com/) (v8 or later)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/aurelia/aurelia.github.io.git
   cd aurelia.github.io

   # Install dependencies
   npm install
   ```

3. **Development**
   ```bash
   # Start the development server
   hugo serve -D -F --ignoreCache
   ```
   Visit http://localhost:1313 to see the site.

## 📁 Project Structure

```
aurelia.github.io/
├── content/          # Site content
│   ├── blog/        # Blog posts organized by date
│   │   └── YYYY/    # Year folders
│   │       └── M/   # Month folders
│   │           └── D/# Day folders
│   ├── _index.md    # Homepage content
│   ├── faq.md       # FAQ page
│   ├── sponsor.md   # Sponsor page
│   └── roadmap.md   # Roadmap page
│
├── themes/
��   └── aurelia-theme/# Custom Aurelia theme
│       ├── assets/   # Theme assets (CSS, JS)
│       ├── data/     # Theme data files
│       └── layouts/  # Theme templates
│
└── static/          # Static files
```

## 📝 Content Management

### Blog Posts

Create new blog posts in `content/blog/YYYY/M/D/` with this frontmatter:

```markdown
+++
title = "Post Title"
author = "Author Name"
author_url = "https://example.com" # Optional
description = "Post description"
date = 2024-01-01T10:00:00Z
lastmod = 2024-01-01T10:00:00Z
draft = false
toc = true  # Enables in-page navigation
+++

Post content goes here...
```

### Content Embedding

The theme supports automatic embedding of various external content. Simply paste the URLs in your markdown:

```markdown
# Code Playgrounds
https://dumber.gist.com/your-gist-id
https://stackblitz.com/edit/your-project
https://codepen.io/username/pen/pen-id

# Videos
https://www.youtube.com/watch?v=video-id

# Package Information
https://www.npmjs.com/package/package-name

# GitHub
https://github.com/username/repo
```

### Table of Contents

Add `toc = true` to your page's frontmatter to enable an in-page navigation sidebar that automatically generates a table of contents from your page's headings.

```markdown
+++
title = "Page Title"
toc = true
+++
```

The table of contents will appear as a floating sidebar on desktop and can be toggled on mobile devices.

### Navigation

Edit `themes/aurelia-theme/data/header.yaml` to modify the navigation:

```yaml
menu:
  - name: "Home"
    link: "/"
  - name: "Docs"
    dropdown: true
    sections:
      - title: "Current"
        items:
          - name: "Aurelia 2 Docs"
            link: "https://docs.aurelia.io"
```

### Footer Configuration

Edit `themes/aurelia-theme/data/footer.yaml` to update footer links:

```yaml
footer:
  links:
    - name: "GitHub"
      link: "https://github.com/aurelia"
    - name: "Twitter"
      link: "https://twitter.com/aureliaeffect"
```

## 🛠 Development

### Local Development

1. Start the Hugo server:
   ```bash
   hugo server -D
   ```

2. Make changes to content or theme files
3. Hugo will automatically reload your browser

### Production Build

```bash
hugo
```

The site will be generated in the `public/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌟 License

- **Code**: Licensed under the [MIT License](LICENSE)
- **Content**: Licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/)

## 🌟 Community & Support

- [Discord](https://discord.gg/RBtyM6u)
- [Discourse](https://discourse.aurelia.io/)
- [GitHub Issues](https://github.com/aurelia/aurelia/issues)
- [Twitter](https://twitter.com/aureliaeffect)