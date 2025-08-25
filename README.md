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

🔗 If you are looking at this `README.md` in GitHub, try to <br/>[load it as a reveal](https://reveals.thetechcollective.dev/markdownloader/?repo=reveals&owner=thetechcollective&file=README.md)
<!-- .element style="font-size:30px" -->

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

# 🖼️ Self-hosted assets

---

## Path substitution

The loader precompiles your MarkDown and substitutes path references to absolute GitHub URLs.Safely supporting paths relative to you MarkDown file or your repo root- as you would expect

— and exactly as GitHub renders your `.md`.

👌 You can conveniently keep your assets in you own repo and reference them as you are used to

---

## Example Repository Structure

A repo named `lakruzz/presentations`

```yaml
presentations/
├── presentation.md      # Main presentation
├── vision/
│   ├── vision.md        # Vision document
│   ├── .png
│   └── chart.jpg
└── assets/
    ├── logo.png
    └── background.png
```

---

## Example paths substitution

In the `vision/vision.md` file

```markdown
![The chart](./chart.jpg) <!--  current directory relative to vision.md -->
![Logo](../assets/logo.jpg) <!-- parent directory, relative to vision.md -->
![Same logo](/assets/logo.png) <!-- repository root -->

```
<!-- .element style="text-align:left; font-size:15px" -->
...becomes

```html
<img alt="The Chart" 
  src="https://raw.githubusercontent.com/lakruzz/presentations/main/vision/chart.jpg">
<img alt="Logo" 
  src="https://raw.githubusercontent.com/lakruzz/presentations/main/assets/logo.png">
<img alt="Same logo" 
  src="https://raw.githubusercontent.com/lakruzz/presentations/main/assets/logo.png">
```
<!-- .element style="text-align:left; font-size:15px" -->

---

## Supported References

- Markdown references:<br/>
`[text](./path)`<!-- .element style=" font-size:25px" --><br/>
`![image](./path)`<!-- .element style=" font-size:25px" -->
- HTML [data-]src attributes:<br/>
`src="./path"`<!-- .element style=" font-size:25px" --><br/>
`data-src="./path"`<!-- .element style=" font-size:25px" -->
- HTML href attributes:<br/>
`href="./path"`<!-- .element style=" font-size:25px" -->
- Reveals data-background[-video] attributes:<br/>
`data-background="./path"`<!-- .element style=" font-size:25px" --><br/>
`data-background-video="./path"`<!-- .element style=" font-size:25px" -->

---

## ⛔️ NOT Supported References

Although valid in other contexts, we do  NOT substitute implied paths - path references NOT starting with `/` or `./` or `../`

Implied references are interpreted as ...just text and they ar not substituted.

---

### Implied references Example

Although the two examples below are semantically the same, we only support the explicit variant


```markdown[2]
![The chart](./chart.jpg) <!--  current directory relative to vision.md -->
![The chart - again](chart.jpg) <!--  implied current directory - not explicit enough -->

```
<!-- .element style="font-size:15px" -->
...becomes

```html[3]
<img alt="The Chart" 
  src="https://raw.githubusercontent.com/lakruzz/presentations/main/vision/chart.jpg">
<img alt="The Chart - again" src="chart.jpg">
```
<!-- .element style="font-size:15px" -->

⛔️ At runtime this will be interpreted as a resource inside the `/markdownloader` folder on the server. This won't work!
<!-- .element style="font-size:15px" -->

---
---

# 🎨 Advanced Features

---

## Reveal flavours

Reveal supports two directives you can pass on as `html` comments

- one for `slide`
- one for `element`

(see [reveal's documentation](https://revealjs.com/markdown/))
<!-- .element style="font-size:25px" -->

---

## Slide directive

An `html` comment starting with the keyword `.slide:`

Anything you add after that will be added to the `<section>` tag in the rendered `html`

```markdown
---

<!-- .slide: data-background="#ff0000" -->

# Slide header

Enjoy the (very) read background on this slide

---
```

...see it live on the next slide

---

<!-- .slide: data-background="#ff0000" -->

# Slide header

Enjoy the (very) read background on this slide

---

## Element directive

An `html` comment starting with the keyword `.element:`

Anything you add after that will be added to the _`the-most-recent-generated`_ tag in the rendered `html`

---

Element style example 1:

```markdown
---

# A list

- Item 1
- Item 2 <!-- .element: style="color: blue;" -->
- Item 3 <!-- .element: style="color: red;" -->

---
```

🤔 Will generate a list with three items, the first has the color defined by the theme, the second is blue and the third is red item
<!-- .element style="font-size:15px" -->

...see it live on the next slide

---

# A list

- Item 1
- Item 2 <!-- .element: style="color: blue;" -->
- Item 3 <!-- .element: style="color: red;" -->

---

Element style examples:

```markdown
---

# A list

- Item 1 <!-- class="fragment "-->
- Item 2 <!-- .element: style="color: blue;" -->
- Item 3 

<!-- .element: style="color: red;" -->

---
````

🤔 Will generate a list with three items, the first and third are red, the second is blue. Only the first items is shown at first, the second and third appear as you advance (click ⬇️ arrow)
<!-- .element style="font-size:15px" -->

...see it live on the next slide

---

# A list

- Item 1
- Item 2 <!-- .element: class="fragment"  style="color: blue;" -->
- Item 3 <!-- .element: class="fragment" -->

<!-- .element: style="color: red;" -->

---

# Notes

A new line containing only `Note:` will indicate the beginning of you speaker notes - until end of the slide.

```markdown
 ---

 # Notes

 Hit `s` ...for _speaker notes_

 Note:

 This slide has speaker notes

 ---
```

Note:

This slide has speaker notes
