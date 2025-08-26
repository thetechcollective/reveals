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
- **DRY**: Dont Repeat Yourself, strive for low cyclomatic complexity and avoid copy'n'paste reuse

## File Paths and Structure

### reveal flavored Markdown syntax

- ``\n\n---\n---\n\n``: Horizontal slide separator, two markdown rules
- `\n\n---\n\n`: Vertical slide separator, a markdown ruler
- `<!-- .element: style="..." -->`: Style individual elements
- `<!-- .slide: data-background="..." -->`: Style entire slides

## GitHub Actions Structure

- `wrapup.yml`: Quality gates (spelling, linting)
- `ready.yml`: Delivery (merge, cleanup)  
- `github-pages.yml`: Deployment to live site

## Testing

- Local: `localhost:8000` or dev server
- Live: `reveals.thetechcollective.dev`
- Version check: `/version.txt` endpoint
