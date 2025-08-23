---
title: "Reveals - Markdown Presentation Loader"
description: "Create instant reveal.js presentations from GitHub repositories with frontmatter support"
author: "The Tech Collective"
theme: "white"
transition: "slide"
separators:
  section: '\n\n---\n---\n\n'
  slide: '\n\n---\n\n'
---

### 🎯 Pure MarkDown Reveals

This project builds on [reveal.js](https://revealjs.com/)

The purpose it to go MarkDown crazy - and allow _all_ the nice reveal.js features to be available from simple markdown files.

All you have to do is to create a reveal-flavoured markdown with your slides. Store it in a public GitHub repository, and load it with the MarkDownLoader

---

## ✨ Features

- 📁 **Load from any public GitHub repository**
- 🎨 **Frontmatter configuration support**
- 🖼️ **Support for relative paths to local self-hosted resources**
- 🎬 **Theme and transition customization**
- 📱 **Everything else that [reveal.js](https://revealjs.com/) promised**

---
---

# 🚀 Quick Start

---

## Basic Usage

1. **Navigate to the MarkDownLoader**
    [reveals.thetechcollective.dev/markdownloader](https://reveals.thetechcollective.dev/markdownloader/)
2. **Fill in repository details**
   - **GitHub username/organization** (required)
   - **Repository name** (required)  
   - Markdown filename (optional, defaults to `presentation.md`)
3. There are more settings available, but they are all optional and can be configured in the frontmatter of your markdown file
4. **Click Load** 🎉

---

## URL parameters

YOu can also load presentations directly by specifying URL parameters:

```shell
owner=USERNAME  #required
repo=REPOSITORY #required
file=FILENAME   # optional, may including subfolders, defaults to presentation.md
```

**Example:**

[`/markdownloader/?owner=thetechcolelctive&repo=reveals&file=README.md`](https://reveals.thetechcollective.dev/markdownloader/?owner=thetechcollective&repo=reveals&file=README.md)

---
---

# 📝 Frontmatter Support

---

## Supported Fields

```yaml
---
title: "My Presentation"
description: "A great presentation"
author: "Your Name"
theme: "black"
transition: "fade"
separators:
  section: '\n\n---\n---\n\n'
  slide: '\n\n---\n\n'
---
```

---

---

## Metadata Fields

The following fields are supported for metadata
The values will be used to populate the HTML `<head>` section:

| Field | Purpose | Example |
|-------|---------|---------|
| `title` | Page title | `"My Presentation"` |
| `description` | Meta description | `"About my topic"` |
| `author` | Meta author | `"Jane Doe"` |

---

## Theme Options

Available themes:

- `white` (default) - `black` - `league`
- `sky` - `beige` - `simple` - `serif`
- `blood` - `night` - `moon` - `solarized`

```yaml
theme: "moon"
```

---

## Transition Options

Available transitions:

- `none` - `fade` - `slide` (default)
- `convex` - `concave` - `zoom`

```yaml
transition: "fade"
```

---

## Custom Separators

Override default slide separators:

```yaml
separators:
  section: '\n\n---\n---\n\n'  # Horizontal slides
  slide: '\n\n---\n\n'         # Vertical slides
```

---
---

# 🖼️ Image Support

---

## Relative Paths

The loader automatically converts relative paths to absolute GitHub URLs, respecting the markdown file's location:

**Relative paths** (start with `./`) - resolved relative to the markdown file's directory:

```markdown
![My Image](./images/photo.jpg)
```

**Absolute paths** (start with `/`) - resolved from the repository root:

```markdown
![My Logo](/assets/logo.png)
```

**Parent directory paths** (start with `../`) - navigate up directory levels:

```markdown
![Shared Asset](../shared/logo.png)
![Root Asset](../../logo.png)
```

**Examples:**

If markdown is at repo root (`file=presentation.md`):

- `./images/photo.jpg` → `https://raw.githubusercontent.com/owner/repo/main/images/photo.jpg`
- `/assets/logo.png` → `https://raw.githubusercontent.com/owner/repo/main/assets/logo.png`
- `../logo.png` → `https://raw.githubusercontent.com/owner/repo/main/logo.png` (can't go above root)

If markdown is in subfolder (`file=docs/guide/presentation.md`):

- `./images/photo.jpg` → `https://raw.githubusercontent.com/owner/repo/main/docs/guide/images/photo.jpg`
- `/assets/logo.png` → `https://raw.githubusercontent.com/owner/repo/main/assets/logo.png`
- `../shared.png` → `https://raw.githubusercontent.com/owner/repo/main/docs/shared.png`
- `../../logo.png` → `https://raw.githubusercontent.com/owner/repo/main/logo.png`

---

## Supported References

- **Markdown images:** `![alt](./path)`, `![alt](/path)`, and `![alt](../path)`
- **Markdown links:** `[text](./path)`, `[text](/path)`, and `[text](../path)`
- **HTML src attributes:** `src="./path"`, `src="/path"`, and `src="../path"`
- **HTML href attributes:** `href="./path"`, `href="/path"`, and `href="../path"`

All relative (`./`), absolute (`/`), and parent (`../`) paths are automatically resolved!

---
---

# 🎨 Advanced Features

---

## Slide-Specific Backgrounds

Use reveal.js slide directives in your markdown:

```markdown
<!-- .slide: data-background="#ff0000" -->
# Red Background Slide

<!-- .slide: data-background="./background.jpg" -->
# Image Background Slide
```

---

## Element Styling

Style individual elements:

```markdown
![Logo](./logo.png) <!-- .element: style="height: 200px;" -->

<q>Quoted text</q> <!-- .element: style="color: blue;" -->
```

---
---

# 📚 Examples

---

## Example Repository Structure

```text
my-presentation/
├── presentation.md      # Main presentation
├── images/
│   ├── logo.png
│   └── chart.jpg
└── assets/
    └── data.json
```

---

## Example Markdown

```markdown
---
title: "My Talk"
theme: "black"
transition: "fade"
---

# Welcome

![Logo](./images/logo.png)

<!--section-->

# Section 2

![Chart](./images/chart.jpg)
```

---
---

# 🛠️ Development

---

## Repository Structure

- **`/site/`** - Deployable website files
- **Root** - Development tools and configuration

```bash
npm ci          # Install dependencies
npm run build   # Build the site
npm start       # Development server
```

---

## Building

The site builds reveal.js components into `/site/dist/`:

- CSS themes and core styles
- JavaScript modules and plugins  
- Optimized for production deployment

---
---

# 🎭 Try It Now

---

## View This Manual

This README.md is itself a reveal.js presentation!

**Try it:**

```text
/markdownloader/?owner=thetechcollective&repo=reveals&file=README.md
```

---

## Create Your Own

1. **Create a GitHub repository**
2. **Add a markdown file with frontmatter**
3. **Include relative image paths**
4. **Load it with the presentation loader**

---

**Happy presenting!** 🎉
