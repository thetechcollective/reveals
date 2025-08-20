#!/bin/sh

# Alpine Linux Mermaid CLI Pre-Setup
# Installs Alpine-specific dependencies for Mermaid CLI BEFORE running the main postCreateCommand.sh
# This script focuses ONLY on Alpine + Mermaid requirements, letting postCreateCommand.sh handle the rest

set -e

PREFIX="🏔️   "
echo "$PREFIX Running $(basename $0) - Alpine Mermaid CLI Pre-Setup"

echo "$PREFIX Installing Alpine system dependencies for Mermaid CLI"
echo "$PREFIX ...updating Alpine package index"
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

echo "$PREFIX Installing build tools for npm native modules"
echo "$PREFIX ...installing make, gcc, g++, python3"
apk add make gcc g++ python3 py3-pip
echo "$PREFIX ...installing libc6-compat for Node.js compatibility"
apk add libc6-compat

echo "$PREFIX Setting up Puppeteer environment variables"
export CHROME_BIN="/usr/bin/chromium-browser"
export PUPPETEER_SKIP_DOWNLOAD="true"
echo "$PREFIX ...CHROME_BIN set to: $CHROME_BIN"
echo "$PREFIX ...PUPPETEER_SKIP_DOWNLOAD set to: $PUPPETEER_SKIP_DOWNLOAD"

echo "$PREFIX Adding environment variables to shell profiles"
echo 'export CHROME_BIN="/usr/bin/chromium-browser"' >> ~/.bashrc
echo 'export PUPPETEER_SKIP_DOWNLOAD="true"' >> ~/.bashrc
echo 'export CHROME_BIN="/usr/bin/chromium-browser"' >> ~/.zshrc
echo 'export PUPPETEER_SKIP_DOWNLOAD="true"' >> ~/.zshrc
echo "$PREFIX ...environment variables added to shell profiles"

echo "$PREFIX Installing Mermaid CLI globally"
npm install -g @mermaid-js/mermaid-cli
echo "$PREFIX ...mermaid-cli installed globally"

echo "$PREFIX Creating Puppeteer configuration (matching mermaid-cli Docker approach)"
cat > /workspace/puppeteer-config.json << 'EOF'
{
  "executablePath": "/usr/bin/chromium-browser",
  "args": [
    "--no-sandbox"
  ]
}
EOF
echo "$PREFIX ...puppeteer-config.json created"

echo "$PREFIX Testing Mermaid CLI setup"
mmdc_version=$(mmdc --version)
echo "$PREFIX ...mermaid-cli version: $mmdc_version"

echo "$PREFIX Verifying Chromium installation"
chromium_version=$(chromium-browser --version 2>/dev/null || echo "chromium-browser executable found")
echo "$PREFIX ...chromium: $chromium_version"

echo "$PREFIX Alpine Mermaid CLI Pre-Setup complete! 🏔️"
echo "$PREFIX Now handing over to main postCreateCommand.sh for standard workflow setup..."
echo "$PREFIX"

echo "$PREFIX SUCCESS"
exit 0
