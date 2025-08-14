### Repository Structure

This repository is organized with a clean separation between development tools and the deployable website:

- **`/site/`** - Contains all website files (HTML, CSS, JS, plugins, examples). This folder is deployed to GitHub Pages.
- **Root directory** - Contains development tools, build configuration, and repository metadata.

#### Development Commands

```bash
# Install dependencies
npm ci

# Build the site (generates files in /site/dist/)
npm run build

# Start development server (serves from /site/ folder)
npm start

# Run tests
npm test
```

The site is automatically deployed to GitHub Pages from the `/site/` folder when changes are pushed to the main branch.
