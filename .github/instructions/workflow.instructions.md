---
applyTo: '**'
---

# Development Workflow Instructions

This document captures the development workflow used in this repository to help maintain consistency across conversations and sessions.

## Core Workflow Tools

This repository uses the `gh-tt` GitHub CLI extension for a lean, quality-first development workflow.

### Development Cycle

1. **Start new work**: `gh workon -t "description"`
   - Creates a new issue.
   - Creates issue-numbered branch (e.g., `12-fix_something`)
   - Branch names are prefixed with issue number

2. **Start new work - variant**: `gh workon -i ISSUE`
   - Works on an existing issue.
   - Creates issue-numbered branch (e.g., `12-fix_something`)
   - Branch names are prefixed with issue number

3. **Development**: Make changes, test locally
   - Use standard git commands for commits
   - Test locally at `localhost:8000` or similar

4. **Quality gate**: `gh wrapup "commit message"`
   - Triggers `wrapup.yml` workflow
   - Runs static analysis: spelling (cspell), markdown linting
   - Only validates "definition of done" - no deployment
   - Must pass before delivery

5. **Deliver**: `gh deliver`
   - Triggers `ready.yml` workflow  
   - Fast-forward merges to `main`
   - Closes issue and cleans up branches
   - Only runs after quality checks pass

6. **Auto-deploy**: Automatic on `main` push
   - `github-pages.yml` deploys to GitHub Pages
   - Creates `version.txt` with deployment info

7. **Reset workspace**: `git sweep`
   - Checkout main, pull latest
   - Clean up merged/deleted branches
   - Prepare for next issue

## Key Principles

- **Shift-left quality**: Catch issues early via static analysis
- **Fast-forward only**: Clean git history, no merge commits
- **Branch naming**: Always prefixed with issue number
- **Lean process**: Minimal overhead, maximum automation

## File Paths and Structure

### Important paths (always use root-relative paths)

- CSS: `/dist/theme/`, `/dist/reveal.css`
- JavaScript: `/dist/reveal.js`, `/js/gistloader.js`  
- Plugins: `/plugin/markdown/`, `/plugin/highlight/`

### Why root-relative paths

- Site deploys from domain root (`reveals.thetechcollective.dev/`)
- Prevents breakage when moving files between folders
- Eliminates fragile `../` relative path calculations

## Debugging Deployments

- Check `https://reveals.thetechcollective.dev/version.txt`
- Contains: commit SHA, timestamp, branch, workflow run
- Helps verify what's actually deployed vs cached content

## Reveal.js Specific Notes

### Markdown syntax

- `<!--section-->`: Horizontal slide separator
- `<!--slide-->`: Vertical slide separator  
- `<!-- .element: style="..." -->`: Style individual elements
- `<!-- .slide: data-background="..." -->`: Style entire slides

### Element styling placement

- **No newline before comment**: Styles the markdown element itself (images, links)
- **Newline before comment**: Styles the paragraph containing the content

## Common Issues

### Theme switching

- Always update theme when URL parameter provided (don't check against defaults)
- GistLoader should honor URL params regardless of default values

### Path issues

- Use root-relative paths (`/dist/`) not relative (`../dist/`)  
- Prevents breakage when moving files to different folder depths

## GitHub Actions Structure

- `wrapup.yml`: Quality gates (spelling, linting)
- `ready.yml`: Delivery (merge, cleanup)  
- `github-pages.yml`: Deployment to live site

## Testing

- Local: `localhost:8000` or dev server
- Live: `reveals.thetechcollective.dev`
- Version check: `/version.txt` endpoint
