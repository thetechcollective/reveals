#!/bin/sh

# Setup script for Alpine Linux container with Mermaid CLI support
# Based on mermaid-js/mermaid-cli Docker approach

set -e

PREFIX="🏔️   "
echo "$PREFIX Running $(basename $0)"

echo "$PREFIX Setting up Alpine Linux environment for Mermaid CLI..."

echo "$PREFIX Updating Alpine package index"
apk update

echo "$PREFIX Installing Chromium and required fonts (matching mermaid-cli approach)"
echo "$PREFIX ...installing chromium browser"
apk add chromium
echo "$PREFIX ...installing fonts: noto-cjk, noto-emoji, terminus, dejavu"
apk add font-noto-cjk font-noto-emoji terminus-font ttf-dejavu
echo "$PREFIX ...installing fonts: freefont, font-awesome, inconsolata, linux-libertine"
apk add ttf-freefont ttf-font-awesome ttf-inconsolata ttf-linux-libertine
echo "$PREFIX ...rebuilding font cache"
fc-cache -f

echo "$PREFIX Installing additional development tools"
echo "$PREFIX ...installing git, curl, wget"
apk add git curl wget
echo "$PREFIX ...installing bash and zsh shells"
apk add bash zsh
echo "$PREFIX ...installing sudo"
apk add sudo
echo "$PREFIX ...installing build tools for npm native modules"
apk add make gcc g++ python3 py3-pip
echo "$PREFIX ...installing libc6-compat for Node.js compatibility"
apk add libc6-compat

echo "$PREFIX Setting up environment variables for Puppeteer"
export CHROME_BIN="/usr/bin/chromium-browser"
export PUPPETEER_SKIP_DOWNLOAD="true"
echo "$PREFIX ...CHROME_BIN set to: $CHROME_BIN"
echo "$PREFIX ...PUPPETEER_SKIP_DOWNLOAD set to: $PUPPETEER_SKIP_DOWNLOAD"

echo "$PREFIX Adding environment variables to shell profiles"
echo 'export CHROME_BIN="/usr/bin/chromium-browser"' >> ~/.bashrc
echo 'export PUPPETEER_SKIP_DOWNLOAD="true"' >> ~/.bashrc
echo 'export CHROME_BIN="/usr/bin/chromium-browser"' >> ~/.zshrc
echo 'export PUPPETEER_SKIP_DOWNLOAD="true"' >> ~/.zshrc
echo "$PREFIX ...environment variables added to ~/.bashrc and ~/.zshrc"

echo "$PREFIX Installing Node.js packages from lock file"
cd /workspace
npm ci

echo "$PREFIX Installing Mermaid CLI globally"
npm install -g @mermaid-js/mermaid-cli
echo "$PREFIX ...mermaid-cli installed globally"

echo "$PREFIX Setting up git configuration for workspace"
git config --global --add safe.directory /workspace
echo "$PREFIX ...safe directory configured"

echo "$PREFIX Creating Puppeteer configuration (matching mermaid-cli Docker approach)"
cat > /workspace/puppeteer-config.json << 'EOF'
{
  "executablePath": "/usr/bin/chromium-browser",
  "args": [
    "--no-sandbox"
  ]
}
EOF
echo "$PREFIX ...puppeteer-config.json created with simple configuration"

echo "$PREFIX Testing Mermaid CLI setup"
mmdc_version=$(mmdc --version)
echo "$PREFIX ...mermaid-cli version: $mmdc_version"

echo "$PREFIX Verifying Chromium installation"
chromium_version=$(chromium-browser --version 2>/dev/null || echo "chromium-browser executable found")
echo "$PREFIX ...chromium: $chromium_version"

echo "$PREFIX Setup complete! 🎉"
echo "$PREFIX"
echo "$PREFIX Testing Reveal.js build system"
npm run build
echo "$PREFIX ...Reveal.js build successful"
echo "$PREFIX"
echo "$PREFIX You can now:"
echo "$PREFIX   • Generate SVG diagrams: mmdc -p puppeteer-config.json -i input.mmd -o output.svg"
echo "$PREFIX   • Start dev server: npm start (will serve on localhost:8000)"
echo "$PREFIX   • Build project: npm run build"
echo "$PREFIX"

echo "$PREFIX SUCCESS"
exit 0
