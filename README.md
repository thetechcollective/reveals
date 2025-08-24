---
title: "Reveals - Markdown Presentation Loader"
description: "Create instant reveal.js presentations from GitHub repositories with frontmatter support"
author: "The Tech Collective"
theme: "lakruzz"
transition: "fade"
separators:
  section: '\n\n---\n---\n\n'
  slide: '\n\n---\n\n'
---

## 🎯 Pure MarkDown Reveals

This project builds on [reveal.js](https://revealjs.com/)

The purpose it _separate what from how_ and to go `MarkDown` crazy 🤪 - and allow _all_ the nice reveal.js features to be available from simple markdown files.

---

### ⬇️ MarkDown only

All you have to do is to create a reveal-flavoured markdown with your slides. Store it in a public GitHub repository, and load it with the MarkDownLoader

---

## ✨ Features

📁 Load from any public GitHub repository<br/>
🎨 Frontmatter configuration support<br/>
🖼️ Expands relative paths to local self-hosted resources<br/>
🎬 Theme and transition customization<br/>
💯 Everything else that [reveal.js](https://revealjs.com/) promised<br/>
<!-- .element style="text-align:left; font-size:37px" -->

---
---

# 🚀 Quick Start

---

## Basic Usage

1. Open the free, Open Source **MarkDownLoader**<br/>
    🔗 [https://reveals.thetechcollective.dev/markdownloader](https://reveals.thetechcollective.dev/markdownloader/)<!-- .element style="font-size:30px" -->
2. ✏️ Fill in details:
   - **`owner`** GitHub username/organization
   - **`repo `** Repository name
   - **`file `** Markdown filename
3. 🎁 There are more settings available, but they are all optional
4. 🚀 Click **Load** 

<!-- .element style="text-align:left; font-size:30px" -->

---

## URL parameters

You can also load presentations directly by specifying URL parameters:

```python
owner=USERNAME  # required
repo=REPOSITORY # required
file=FILENAME   # optional, may including subfolders,
                # defaults to 'presentation.md'
```

### Example:

[`https://reveals.thetechcollective.dev/markdownloader/?owner=thetechcollctive&repo=reveals&file=README.md`](https://reveals.thetechcollective.dev/markdownloader/?owner=thetechcollective&repo=reveals&file=README.md) <!-- .element style="text-align:left; font-size:30px" -->

---
---

# 📝 Frontmatter Support

---

## 📝 Frontmatter

Add frontmatter to your MarkDown, to instruct the `MarkDownLoader` to use your preferences.

- Allows you to set the `title`, `description` and `author` of the loaded page
- Allows you to preload the URL parameters, so you can distribute cleaner URL's to you audience

---

## Supported Fields

```yaml
---
  title:       "My Presentation"
  description: "A great presentation"
  author:      "Your Name"
  theme:       "black"
  transition:  "slide"
  separators:
    section:   '\n\n---\n---\n\n'
    slide:     '\n\n---\n\n'
---
```

---

## Metadata Fields

The following frontmatter fields are supported in your markdown file for metadata

```yaml
---
  title:       "MarkDownLoader"
  description: "Your beautiful presentations ...as pure MarkDown"
  author:      "Lakruzz — Lars Kruse"
---
```

The fields will be used to populate the HTML `<head>` section:

```html
<head>
  <title>MarkDownLoader</title>
  <meta name="description" content="Your beautiful presentations ...as pure MarkDown">
  <meta name="author" content="Lakruzz — Lars Kruse">
</head>
```
<!-- .element style="text-align:left; font-size:15px" -->

---

## Appearance – Themes

The following frontmatter fields are supported in your markdown file and will impact the appearance

```yaml[2]
---
  theme:       "black" #default
  transition:  "slide" #default
---
```

#### Available themes:

`white` - `black` - `league` - `sky` - `beige` - `simple` - `serif` -`blood` - `night` - `moon` - `solarized` - `lakruzz`


---

## Appearance - Transitions

```yaml[3]
---
  theme:       "black" #default
  transition:  "slide" #default
---
```

#### Available transitions:

`none` - `fade` - `slide` - `convex` - `concave` - `zoom`

---

## Separators

Separators are used to define what marks a new section (horizontal) and the individual slides (vertical).

```yaml
---
  separators:
    section: '\n\n---\n---\n\n'  # default for horizontal slides
    slide:   '\n\n---\n\n'       # default for vertical slides
---
```

Using two or one markdown rulers (`---`) respectively, has the delicious side-effect that GitHub can render your MarkDown with dividers too.

---

## Separators - example

Here's an example that uses `html` comments as markers.

```yaml
---
  separators:
    section: '^<!--section-->'  
    slide:   '^<!--slide-->' 
---
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