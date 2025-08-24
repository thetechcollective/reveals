/**
 * Markdown Loader Module
 * Handles loading reveal.js presentations from GitHub repositories
 */

/**
 * Default configuration for the markdown loader
 */
const DEFAULT_CONFIG = {
	file: 'presentation.md',
	theme: 'lakruzz',
	highlightStyle: 'monokai',
	sectionSeparator: '\n\n---\n---\n\n',
	slideSeparator: `\n\n---\n\n`
};

/**
 * Available themes for the presentation
 */
const AVAILABLE_THEMES = [
	'white', 'black', 'league', 'beige', 'sky', 
	'night', 'serif', 'simple', 'solarized', 'blood', 'moon', 'lakruzz'
];

/**
 * Available highlight styles
 */
const AVAILABLE_HIGHLIGHT_STYLES = [
	'monokai', 'zenburn'
];

/**
 * Available transitions for the presentation
 */
const AVAILABLE_TRANSITIONS = [
	'none', 'fade', 'slide', 'convex', 'concave', 'zoom'
];

/**
 * MarkdownLoader class to handle repository-based presentations
 */
class MarkdownLoader {
	constructor() {
		this.params = null;
	}

	/**
	 * Parse URL parameters and return configuration object
	 */
	getUrlParams() {
		const params = new URLSearchParams(window.location.search);
		return {
			owner: params.get('owner'),
			repo: params.get('repo'),
			file: params.get('file'),
			theme: params.get('theme'),
			highlightStyle: params.get('highlightStyle'),
			transition: params.get('transition'),
			sectionSeparator: params.get('sectionSeparator'),
			slideSeparator: params.get('slideSeparator'),
			load: params.get('load'),
			local: params.get('local')
		};
	}

	/**
	 * Update stylesheets based on parameters
	 */
	updateStylesheets(theme, highlightStyle) {
		try {
			const themeEl = document.getElementById('theme');
			const highlightEl = document.getElementById('highlight-theme');
			
			console.log('updateStylesheets called with:', { theme, highlightStyle });
			console.log('themeEl:', themeEl);
			console.log('DEFAULT_CONFIG.theme:', DEFAULT_CONFIG.theme);
			
			console.log('updateStylesheets called with:', { theme, highlightStyle });
			console.log('themeEl:', themeEl);
			console.log('DEFAULT_CONFIG.theme:', DEFAULT_CONFIG.theme);
			
			// Always update theme - use provided theme or fall back to default
			if (themeEl) {
				const themeToUse = theme || DEFAULT_CONFIG.theme;
				const newThemeUrl = `/dist/theme/${themeToUse}.css`;
				console.log('Updating theme to:', newThemeUrl);
				themeEl.href = newThemeUrl;
				console.log('Theme element href after update:', themeEl.href);
			}
			
			// Always update highlight style if provided via URL parameter
			if (highlightEl && highlightStyle) {
				const newHighlightUrl = `/plugin/highlight/${highlightStyle}.css`;
				console.log('Updating highlight style to:', newHighlightUrl);
				highlightEl.href = newHighlightUrl;
			}
		} catch (error) {
			console.log('Error updating stylesheets:', error);
		}
	}

	/**
	 * Generate the theme options HTML
	 */
	generateThemeOptions(selectedTheme = null) {
		const options = ['<option value="">Use default</option>'];
		
		return options.concat(AVAILABLE_THEMES.map(theme => {
			const isSelected = theme === selectedTheme;
			const label = theme.charAt(0).toUpperCase() + theme.slice(1);
			return `<option value="${theme}"${isSelected ? ' selected' : ''}>${label}</option>`;
		})).join('');
	}

	/**
	 * Generate the highlight style options HTML
	 */
	generateHighlightOptions(selectedStyle = null) {
		const options = ['<option value="">Use default</option>'];
		
		return options.concat(AVAILABLE_HIGHLIGHT_STYLES.map(style => {
			const isSelected = style === selectedStyle;
			const label = style.charAt(0).toUpperCase() + style.slice(1);
			return `<option value="${style}"${isSelected ? ' selected' : ''}>${label}</option>`;
		})).join('');
	}

	/**
	 * Generate the configuration form HTML
	 */
	generateForm(params = {}) {
		return `
			<div class="repo-form-container">
				<h1>🎯 reveal.js Markdown Loader</h1>
				<p>Create instant presentations from GitHub repositories</p>

				<form id="repo-form">
					<div class="form-group">
						<label for="owner" class="required"><code>owner</code> – GitHub Username/Organization</label>
						<input type="text" id="owner" name="owner" placeholder="e.g., lakruzz" value="${params.owner || ''}" required>
					</div>

					<div class="form-group">
						<label for="repo" class="required"><code>repo</code> — Repository Name</label>
						<input type="text" id="repo" name="repo" placeholder="e.g., my-presentation" value="${params.repo || ''}" required>
					</div>

					<div class="form-group">
						<label for="file"><code>file</code> — File name including path, relative to the repository root</label>
						<input type="text" id="file" name="file" placeholder="presentation.md" value="${params.file && params.file !== DEFAULT_CONFIG.file ? params.file : ''}">
						<small style="color: #666; font-size: 12px;">A reveals flavored MarkDown file (Leave empty to use default)</small>
					</div>

					<div class="form-group">
						<label for="sectionSeparator">Section Separator (Regex)</label>
						<input type="text" id="sectionSeparator" name="sectionSeparator" placeholder="\\n\\n---\\n---\\n\\n" value="${params.sectionSeparator && params.sectionSeparator !== DEFAULT_CONFIG.sectionSeparator ? params.sectionSeparator : ''}">
						<small style="color: #666; font-size: 12px;">Regex pattern to separate horizontal slides (leave empty to use default)</small>
					</div>

					<div class="form-group">
						<label for="slideSeparator">Slide Separator (Regex)</label>
						<input type="text" id="slideSeparator" name="slideSeparator" placeholder="\\n\\n---\\n\\n" value="${params.slideSeparator && params.slideSeparator !== DEFAULT_CONFIG.slideSeparator ? params.slideSeparator : ''}">
						<small style="color: #666; font-size: 12px;">Regex pattern to separate vertical slides (leave empty to use default)</small>
					</div>
                    
                    <div class="form-group">
						<label for="themeSelect">Theme</label>
						<select id="themeSelect" name="theme">
							${this.generateThemeOptions(params.theme && params.theme !== DEFAULT_CONFIG.theme ? params.theme : null)}
						</select>
					</div>

					<div class="form-group">
						<label for="highlightStyle">Code Highlight Style</label>
						<select id="highlightStyle" name="highlightStyle">
							${this.generateHighlightOptions(params.highlightStyle && params.highlightStyle !== DEFAULT_CONFIG.highlightStyle ? params.highlightStyle : null)}
						</select>
					</div>

					<div class="button-group">
						<button type="submit" class="btn btn-secondary" id="load-btn">🚀 Load</button>
						<button type="button" class="btn btn-secondary" id="copy-url-btn">⏺️ Copy URL</button>
						<button type="button" class="btn" id="fill-example-btn">⬆️ Load Demo</button>
					</div>
				</form>
			</div>
		`;
	}

	/**
	 * Fill form with example data
	 */
	fillExample() {
		const elements = {
			owner: document.getElementById('owner'),
			repo: document.getElementById('repo'),
			file: document.getElementById('file'),
			theme: document.getElementById('themeSelect'),
			highlightStyle: document.getElementById('highlightStyle'),
			sectionSeparator: document.getElementById('sectionSeparator'),
			slideSeparator: document.getElementById('slideSeparator')
		};

		// Fill only the required fields
		if (elements.owner) elements.owner.value = 'lakruzz';
		if (elements.repo) elements.repo.value = 'my-presentation-repo';
		
		// Clear optional fields to use defaults
		if (elements.file) elements.file.value = '';
		if (elements.theme) elements.theme.selectedIndex = 0; // First option = "Use default"
		if (elements.highlightStyle) elements.highlightStyle.selectedIndex = 0; // First option = "Use default"
		if (elements.sectionSeparator) elements.sectionSeparator.value = '';
		if (elements.slideSeparator) elements.slideSeparator.value = '';
		
		// Trigger validation update after filling example data
		this.updateButtonStates();
		
		// Update select styling since we changed their values
		this.updateAllSelectStyling();
	}

	/**
	 * Handle form submission
	 */
	handleFormSubmit(event) {
		event.preventDefault();
		
		// Check if required fields are filled
		if (!this.areRequiredFieldsFilled()) {
			this.highlightMissingFields();
			return;
		}
		
		const formData = new FormData(event.target);
		const params = new URLSearchParams();
		
		for (let [key, value] of formData.entries()) {
			const trimmedValue = value.trim();
			
			// Skip empty values and the 'load' parameter
			if (!trimmedValue || key === 'load') {
				continue;
			}
			
			// Skip parameters that match default values
			if (this.isDefaultValue(key, trimmedValue)) {
				continue;
			}
			
			params.append(key, trimmedValue);
		}
		
		// Redirect to the same page with clean parameters (no defaults)
		window.location.href = '?' + params.toString();
	}

	/**
	 * Check if a parameter value matches the default
	 */
	isDefaultValue(key, value) {
		switch (key) {
			case 'file':
				return value === DEFAULT_CONFIG.file;
			case 'theme':
				return value === DEFAULT_CONFIG.theme;
			case 'highlightStyle':
				return value === DEFAULT_CONFIG.highlightStyle;
			case 'sectionSeparator':
				return value === DEFAULT_CONFIG.sectionSeparator;
			case 'slideSeparator':
				return value === DEFAULT_CONFIG.slideSeparator;
			default:
				return false;
		}
	}

	/**
	 * Generate a clean shareable URL from current form values
	 */
	generateShareableUrl() {
		const form = document.getElementById('repo-form');
		if (!form) return '';

		const formData = new FormData(form);
		const params = new URLSearchParams();
		
		for (let [key, value] of formData.entries()) {
			const trimmedValue = value.trim();
			
			// Skip empty values, 'load' parameter, and default values
			if (!trimmedValue || key === 'load' || this.isDefaultValue(key, trimmedValue)) {
				continue;
			}
			
			params.append(key, trimmedValue);
		}
		
		// Build full URL
		const baseUrl = window.location.origin + window.location.pathname;
		return baseUrl + (params.toString() ? '?' + params.toString() : '');
	}

	/**
	 * Copy shareable URL to clipboard
	 */
	async copyShareableUrl() {
		// Use the same elegant validation as the Load button
		const form = document.getElementById('repo-form');
		if (!form || !form.checkValidity()) {
			// Trigger native browser validation UI (same as Load button)
			if (form) {
				form.reportValidity();
			}
			return;
		}

		const url = this.generateShareableUrl();
		
		try {
			await navigator.clipboard.writeText(url);
			
			// Show success feedback
			const button = document.getElementById('copy-url-btn');
			const originalText = button.textContent;
			button.textContent = '✅ Copied';
			button.style.backgroundColor = '#28a745';
			
			setTimeout(() => {
				button.textContent = originalText;
				button.style.backgroundColor = '';
			}, 2000);
			
		} catch (err) {
			console.error('Failed to copy URL: ', err);
			// Fallback: show the URL in an alert
			alert('Copy this URL:\n\n' + url);
		}
	}

	/**
	 * Build GitHub raw URL from owner, repository and filename
	 */
	buildRepoRawUrl(owner, repo, filename) {
		return `https://raw.githubusercontent.com/${owner}/${repo}/main/${filename}`;
	}

	/**
	 * Build GitHub raw URL for resources (images, scripts, etc.)
	 */
	buildRepoResourceUrl(owner, repo, resourcePath, markdownFile = '') {
		let finalPath = resourcePath;
		
		// Handle parent directory navigation (../)
		if (resourcePath.startsWith('../')) {
			// Extract directory from markdown file path
			const markdownDir = markdownFile.includes('/') ? 
				markdownFile.substring(0, markdownFile.lastIndexOf('/')) : '';
			
			// Split the markdown directory into parts
			const dirParts = markdownDir ? markdownDir.split('/') : [];
			
			// Count and remove ../ segments from resource path
			let pathParts = resourcePath.split('/');
			let parentCount = 0;
			
			while (pathParts.length > 0 && pathParts[0] === '..') {
				parentCount++;
				pathParts.shift(); // Remove the '..' part
			}
			
			// Remove parent count directories from markdown path
			const adjustedDirParts = dirParts.slice(0, Math.max(0, dirParts.length - parentCount));
			
			// Combine adjusted directory with remaining path
			const remainingPath = pathParts.join('/');
			finalPath = adjustedDirParts.length > 0 ? 
				adjustedDirParts.join('/') + '/' + remainingPath : 
				remainingPath;
				
			console.log(`Parent navigation: ${resourcePath} from ${markdownFile} -> ${finalPath}`);
		} else if (!resourcePath.startsWith('/')) {
			// Handle relative paths (./ or no prefix)
			const cleanPath = resourcePath.startsWith('./') ? resourcePath.substring(2) : resourcePath;
			
			// Extract directory from markdown file path
			const markdownDir = markdownFile.includes('/') ? 
				markdownFile.substring(0, markdownFile.lastIndexOf('/') + 1) : '';
			
			// Combine markdown directory with resource path
			finalPath = markdownDir + cleanPath;
		} else {
			// Handle absolute paths (/) - remove leading slash
			finalPath = resourcePath.substring(1);
		}
		
		return `https://raw.githubusercontent.com/${owner}/${repo}/main/${finalPath}`;
	}

	/**
	 * Fetch markdown content from repository and precompile it
	 */
	async fetchAndPrecompileMarkdown(repoUrl, owner, repo, filename = '') {
		console.log('Fetching markdown from:', repoUrl);
		
		// Add cache-busting timestamp to prevent browser caching
		const cacheBustUrl = repoUrl + '?_cb=' + Date.now();
		console.log('Cache-busted URL:', cacheBustUrl);
		
		const response = await fetch(cacheBustUrl);
		
		if (!response.ok) {
			throw new Error(`Failed to fetch markdown: ${response.status} ${response.statusText}`);
		}
		
		const rawMarkdown = await response.text();
		console.log('Raw markdown fetched, length:', rawMarkdown.length);
		console.log('Raw markdown first 500 chars:', rawMarkdown.substring(0, 500));
		
		// Parse frontmatter
		const { frontmatter, content } = this.parseFrontmatter(rawMarkdown);
		console.log('Frontmatter parsed:', frontmatter);
		
		// Apply frontmatter to page
		this.applyFrontmatter(frontmatter);
		
		// Process relative paths in the markdown content
		const processedMarkdown = this.processRelativePaths(content, owner, repo, filename);
		console.log('Markdown processed, length:', processedMarkdown.length);
		
		return processedMarkdown;
	}

	/**
	 * Fetch and precompile local markdown file (no GitHub path processing)
	 */
	async fetchAndPrecompileLocalMarkdown(localUrl, filename = '') {
		console.log('Fetching local markdown from:', localUrl);
		
		// Add cache-busting timestamp to prevent browser caching
		const cacheBustUrl = localUrl + '?_cb=' + Date.now();
		console.log('Cache-busted URL:', cacheBustUrl);
		
		const response = await fetch(cacheBustUrl);
		
		if (!response.ok) {
			throw new Error(`Failed to fetch local markdown: ${response.status} ${response.statusText}`);
		}
		
		const rawMarkdown = await response.text();
		console.log('Raw local markdown fetched, length:', rawMarkdown.length);
		console.log('Raw local markdown first 500 chars:', rawMarkdown.substring(0, 500));
		
		// Parse frontmatter
		const { frontmatter, content } = this.parseFrontmatter(rawMarkdown);
		console.log('Frontmatter parsed:', frontmatter);
		
		// Apply frontmatter to page
		this.applyFrontmatter(frontmatter);
		
		// Process local relative paths in the markdown content
		const processedMarkdown = this.processLocalPaths(content, filename);
		console.log('Local markdown processed with path resolution, length:', processedMarkdown.length);
		
		return processedMarkdown;
	}

	/**
	 * Parse YAML frontmatter from markdown content
	 */
	parseFrontmatter(markdown) {
		// Check if markdown starts with frontmatter delimiter
		if (!markdown.startsWith('---\n')) {
			return { frontmatter: {}, content: markdown };
		}
		
		// Find the closing delimiter
		const endIndex = markdown.indexOf('\n---\n', 4);
		if (endIndex === -1) {
			return { frontmatter: {}, content: markdown };
		}
		
		// Extract frontmatter and content
		const frontmatterText = markdown.slice(4, endIndex);
		const content = markdown.slice(endIndex + 5);
		
		// Parse YAML frontmatter (simple parser for basic key-value pairs)
		const frontmatter = this.parseSimpleYaml(frontmatterText);
		
		return { frontmatter, content };
	}

	/**
	 * Simple YAML parser for frontmatter (handles basic key-value pairs and simple nested objects)
	 */
	parseSimpleYaml(yamlText) {
		const result = {};
		const lines = yamlText.split('\n');
		let currentContext = result;
		let currentKey = null;
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;
			
			const colonIndex = trimmed.indexOf(':');
			if (colonIndex === -1) continue;
			
			const key = trimmed.slice(0, colonIndex).trim();
			let value = trimmed.slice(colonIndex + 1).trim();
			
			// Check if this is a nested object (value is empty and next lines are indented)
			if (!value && i + 1 < lines.length) {
				const nextLine = lines[i + 1];
				if (nextLine.startsWith('  ') || nextLine.startsWith('\t')) {
					// This is a nested object, create it and parse nested items
					result[key] = {};
					currentContext = result[key];
					currentKey = key;
					continue;
				}
			}
			
			// Check if this line is indented (nested property)
			if ((line.startsWith('  ') || line.startsWith('\t')) && currentContext !== result) {
				// This is a nested property
				let nestedKey = key;
				let nestedValue = value;
				
				// Remove quotes if present
				if ((nestedValue.startsWith('"') && nestedValue.endsWith('"')) || 
				    (nestedValue.startsWith("'") && nestedValue.endsWith("'"))) {
					nestedValue = nestedValue.slice(1, -1);
				}
				
				currentContext[nestedKey] = nestedValue;
			} else {
				// This is a top-level property, reset context
				currentContext = result;
				currentKey = null;
				
				// Remove quotes if present
				if ((value.startsWith('"') && value.endsWith('"')) || 
				    (value.startsWith("'") && value.endsWith("'"))) {
					value = value.slice(1, -1);
				}
				
				result[key] = value;
			}
		}
		
		return result;
	}

	/**
	 * Apply frontmatter settings to the page
	 */
	applyFrontmatter(frontmatter) {
		// Update HTML head with metadata
		this.updateHtmlHead(frontmatter);
		
		// Update URL parameters if valid values are found
		this.updateUrlFromFrontmatter(frontmatter);
	}

	/**
	 * Update HTML head with frontmatter metadata
	 */
	updateHtmlHead(frontmatter) {
		const head = document.head;
		
		// Update title
		if (frontmatter.title) {
			console.log('Updating document title from frontmatter:', frontmatter.title);
			console.log('Current document title before update:', document.title);
			document.title = frontmatter.title;
			console.log('Document title after update:', document.title);
		}
		
		// Add or update description meta tag
		if (frontmatter.description) {
			console.log('Adding description meta tag:', frontmatter.description);
			let descriptionMeta = head.querySelector('meta[name="description"]');
			if (!descriptionMeta) {
				descriptionMeta = document.createElement('meta');
				descriptionMeta.name = 'description';
				head.appendChild(descriptionMeta);
			}
			descriptionMeta.content = frontmatter.description;
		}
		
		// Add or update author meta tag
		if (frontmatter.author) {
			console.log('Adding author meta tag:', frontmatter.author);
			let authorMeta = head.querySelector('meta[name="author"]');
			if (!authorMeta) {
				authorMeta = document.createElement('meta');
				authorMeta.name = 'author';
				head.appendChild(authorMeta);
			}
			authorMeta.content = frontmatter.author;
		}
	}

	/**
	 * Update URL parameters based on valid frontmatter values
	 */
	updateUrlFromFrontmatter(frontmatter) {
		const urlParams = new URLSearchParams(window.location.search);
		let hasChanges = false;
		
		// Add transition if valid and not already set
		if (frontmatter.transition && !urlParams.has('transition')) {
			const transition = frontmatter.transition.toLowerCase();
			if (AVAILABLE_TRANSITIONS.includes(transition)) {
				urlParams.set('transition', transition);
				hasChanges = true;
				console.log('Added transition from frontmatter:', transition);
			}
		}
		
		// Add theme if valid and not already set
		if (frontmatter.theme && !urlParams.has('theme')) {
			const theme = frontmatter.theme.toLowerCase();
			if (AVAILABLE_THEMES.includes(theme)) {
				urlParams.set('theme', theme);
				hasChanges = true;
				console.log('Added theme from frontmatter:', theme);
			}
		}
		
		// Add separators if specified and not already set
		if (frontmatter.separators) {
			if (frontmatter.separators.section && !urlParams.has('sectionSeparator')) {
				urlParams.set('sectionSeparator', frontmatter.separators.section);
				hasChanges = true;
				console.log('Added sectionSeparator from frontmatter:', frontmatter.separators.section);
			}
			
			if (frontmatter.separators.slide && !urlParams.has('slideSeparator')) {
				urlParams.set('slideSeparator', frontmatter.separators.slide);
				hasChanges = true;
				console.log('Added slideSeparator from frontmatter:', frontmatter.separators.slide);
			}
		}
		
		// Update URL if we have changes
		if (hasChanges) {
			const newUrl = window.location.pathname + '?' + urlParams.toString();
			console.log('Updating URL with frontmatter params:', newUrl);
			window.history.replaceState({}, '', newUrl);
			
			// Re-parse params to get the updated values
			this.params = this.getUrlParams();
		}
	}

	/**
	 * Process relative paths in markdown content
	 * Converts ./path references to full GitHub URLs
	 */
	processRelativePaths(markdown, owner, repo, filename = '') {
		console.log('Processing relative paths for repo:', `${owner}/${repo}`, 'file:', filename);
		
		// Process markdown image syntax: ![alt](./path), ![alt](/path), and ![alt](../path)
		let processed = markdown.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, alt, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, './' + path, filename);
			console.log(`Replacing relative image: ${match} -> ![${alt}](${fullUrl})`);
			return `![${alt}](${fullUrl})`;
		});
		
		processed = processed.replace(/!\[([^\]]*)\]\(\/([^)]+)\)/g, (match, alt, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, '/' + path, filename);
			console.log(`Replacing absolute image: ${match} -> ![${alt}](${fullUrl})`);
			return `![${alt}](${fullUrl})`;
		});
		
		processed = processed.replace(/!\[([^\]]*)\]\((\.\.\/[^)]+)\)/g, (match, alt, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, path, filename);
			console.log(`Replacing parent image: ${match} -> ![${alt}](${fullUrl})`);
			return `![${alt}](${fullUrl})`;
		});
		
		// Process markdown link syntax: [text](./path), [text](/path), and [text](../path)
		processed = processed.replace(/\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, text, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, './' + path, filename);
			console.log(`Replacing relative link: ${match} -> [${text}](${fullUrl})`);
			return `[${text}](${fullUrl})`;
		});
		
		processed = processed.replace(/\[([^\]]*)\]\(\/([^)]+)\)/g, (match, text, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, '/' + path, filename);
			console.log(`Replacing absolute link: ${match} -> [${text}](${fullUrl})`);
			return `[${text}](${fullUrl})`;
		});
		
		processed = processed.replace(/\[([^\]]*)\]\((\.\.\/[^)]+)\)/g, (match, text, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, path, filename);
			console.log(`Replacing parent link: ${match} -> [${text}](${fullUrl})`);
			return `[${text}](${fullUrl})`;
		});
		
		// Process HTML src attributes: src="./path", src="/path", and src="../path"
		processed = processed.replace(/\bsrc="\.\/([^"]+)"/g, (match, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, './' + path, filename);
			console.log(`Replacing relative src: ${match} -> src="${fullUrl}"`);
			return `src="${fullUrl}"`;
		});
		
		processed = processed.replace(/\bsrc="\/([^"]+)"/g, (match, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, '/' + path, filename);
			console.log(`Replacing absolute src: ${match} -> src="${fullUrl}"`);
			return `src="${fullUrl}"`;
		});
		
		processed = processed.replace(/\bsrc="(\.\.\/[^"]+)"/g, (match, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, path, filename);
			console.log(`Replacing parent src: ${match} -> src="${fullUrl}"`);
			return `src="${fullUrl}"`;
		});
		
		// Process HTML href attributes: href="./path", href="/path", and href="../path"
		processed = processed.replace(/\bhref="\.\/([^"]+)"/g, (match, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, './' + path, filename);
			console.log(`Replacing relative href: ${match} -> href="${fullUrl}"`);
			return `href="${fullUrl}"`;
		});
		
		processed = processed.replace(/\bhref="\/([^"]+)"/g, (match, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, '/' + path, filename);
			console.log(`Replacing absolute href: ${match} -> href="${fullUrl}"`);
			return `href="${fullUrl}"`;
		});
		
		processed = processed.replace(/\bhref="(\.\.\/[^"]+)"/g, (match, path) => {
			const fullUrl = this.buildRepoResourceUrl(owner, repo, path, filename);
			console.log(`Replacing parent href: ${match} -> href="${fullUrl}"`);
			return `href="${fullUrl}"`;
		});
		
		return processed;
	}

	/**
	 * Process relative paths for local files
	 */
	processLocalPaths(markdown, filename = '') {
		console.log('Processing local paths for file:', filename);
		
		// Extract directory from filename (e.g., "lab/presentation.md" -> "lab/")
		const fileDir = filename.includes('/') ? 
			filename.substring(0, filename.lastIndexOf('/') + 1) : '';
		
		// Process markdown image syntax: ![alt](./path) and ![alt](../path)
		let processed = markdown.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, alt, path) => {
			const localPath = `/${fileDir}${path}`;
			console.log(`Replacing local relative image: ${match} -> ![${alt}](${localPath})`);
			return `![${alt}](${localPath})`;
		});
		
		processed = processed.replace(/!\[([^\]]*)\]\((\.\.\/[^)]+)\)/g, (match, alt, path) => {
			const localPath = this.resolveLocalPath(path, fileDir);
			console.log(`Replacing local parent image: ${match} -> ![${alt}](${localPath})`);
			return `![${alt}](${localPath})`;
		});
		
		// Process markdown link syntax: [text](./path) and [text](../path)
		processed = processed.replace(/\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, text, path) => {
			const localPath = `/${fileDir}${path}`;
			console.log(`Replacing local relative link: ${match} -> [${text}](${localPath})`);
			return `[${text}](${localPath})`;
		});
		
		processed = processed.replace(/\[([^\]]*)\]\((\.\.\/[^)]+)\)/g, (match, text, path) => {
			const localPath = this.resolveLocalPath(path, fileDir);
			console.log(`Replacing local parent link: ${match} -> [${text}](${localPath})`);
			return `[${text}](${localPath})`;
		});
		
		// Process HTML src attributes: src="./path" and src="../path"
		processed = processed.replace(/\bsrc="\.\/([^"]+)"/g, (match, path) => {
			const localPath = `/${fileDir}${path}`;
			console.log(`Replacing local relative src: ${match} -> src="${localPath}"`);
			return `src="${localPath}"`;
		});
		
		processed = processed.replace(/\bsrc="(\.\.\/[^"]+)"/g, (match, path) => {
			const localPath = this.resolveLocalPath(path, fileDir);
			console.log(`Replacing local parent src: ${match} -> src="${localPath}"`);
			return `src="${localPath}"`;
		});
		
		return processed;
	}

	/**
	 * Resolve local paths with parent directory navigation
	 */
	resolveLocalPath(resourcePath, fileDir) {
		// Split the file directory into parts
		const dirParts = fileDir ? fileDir.split('/').filter(part => part) : [];
		
		// Count and remove ../ segments from resource path
		let pathParts = resourcePath.split('/');
		let parentCount = 0;
		
		while (pathParts.length > 0 && pathParts[0] === '..') {
			parentCount++;
			pathParts.shift(); // Remove the '..' part
		}
		
		// Remove parent count directories from file path
		const adjustedDirParts = dirParts.slice(0, Math.max(0, dirParts.length - parentCount));
		
		// Combine adjusted directory with remaining path
		const remainingPath = pathParts.join('/');
		const finalPath = adjustedDirParts.length > 0 ? 
			adjustedDirParts.join('/') + '/' + remainingPath : 
			remainingPath;
			
		console.log(`Local parent navigation: ${resourcePath} from ${fileDir} -> /${finalPath}`);
		return `/${finalPath}`;
	}

	/**
	 * Initialize reveal.js presentation with repository content
	 */
	async initializePresentation(params) {
		// Build the repository URL
		const repoUrl = this.buildRepoRawUrl(params.owner, params.repo, params.file || DEFAULT_CONFIG.file);
		console.log('Repository URL:', repoUrl);
		
		try {
			// Fetch and precompile the markdown content
			const processedMarkdown = await this.fetchAndPrecompileMarkdown(repoUrl, params.owner, params.repo, params.file || DEFAULT_CONFIG.file);
			
			// Re-parse params in case frontmatter updated them
			params = this.getUrlParams();
			
			// Update stylesheets based on parameters (including potential frontmatter updates)
			this.updateStylesheets(params.theme, params.highlightStyle);
			
			// Create the section element with processed markdown content
			const slidesContainer = document.getElementById('slides-container');
			slidesContainer.innerHTML = `
				<section data-markdown data-separator="${params.sectionSeparator || DEFAULT_CONFIG.sectionSeparator}" data-separator-vertical="${params.slideSeparator || DEFAULT_CONFIG.slideSeparator}">
					<textarea data-template>${processedMarkdown}</textarea>
				</section>
			`;
			
			// Update page title only if it wasn't set by frontmatter
			// Check if title is still the default or contains the loader name
			if (document.title === 'reveal.js - Markdown Loader' || 
			    document.title.startsWith('reveal.js - ')) {
				document.title = `reveal.js - ${params.file || DEFAULT_CONFIG.file}`;
				console.log('Set default page title:', document.title);
			} else {
				console.log('Keeping frontmatter title:', document.title);
			}
			
			// Build Reveal.js configuration
			const revealConfig = {
				controls: true,
				progress: true,
				history: true,
				center: true,
				hash: true,
				plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight, RevealMath.KaTeX ]
			};
			
			// Add transition if specified
			if (params.transition && AVAILABLE_TRANSITIONS.includes(params.transition.toLowerCase())) {
				revealConfig.transition = params.transition.toLowerCase();
				console.log('Using transition from URL:', revealConfig.transition);
			}
			
			// Initialize Reveal.js AFTER inserting the content
			Reveal.initialize(revealConfig);
			
		} catch (error) {
			console.error('Error loading and processing markdown:', error);
			// Fallback to original behavior if precompilation fails
			this.updateStylesheets(params.theme, params.highlightStyle);
			
			const slidesContainer = document.getElementById('slides-container');
			slidesContainer.innerHTML = `
				<section data-markdown="${repoUrl}" data-separator="${params.sectionSeparator || DEFAULT_CONFIG.sectionSeparator}" data-separator-vertical="${params.slideSeparator || DEFAULT_CONFIG.slideSeparator}"></section>
			`;
			
			document.title = `reveal.js - ${params.file || DEFAULT_CONFIG.file}`;
			
			Reveal.initialize({
				controls: true,
				progress: true,
				history: true,
				center: true,
				hash: true,
				plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight, RevealMath.KaTeX ]
			});
		}
	}

	/**
	 * Initialize reveal.js presentation with local file content
	 */
	async initializeLocalPresentation(params) {
		if (!params.file) {
			throw new Error('Local mode requires a file parameter');
		}

		// Build local file URL (relative to site root)
		const localUrl = `/${params.file}`;
		console.log('Local file URL:', localUrl);
		
		try {
			// Fetch and precompile the local markdown content
			const processedMarkdown = await this.fetchAndPrecompileLocalMarkdown(localUrl, params.file);
			
			// Re-parse params in case frontmatter updated them
			params = this.getUrlParams();
			
			// Update stylesheets based on parameters (including potential frontmatter updates)
			this.updateStylesheets(params.theme, params.highlightStyle);
			
			// Create the section element with processed markdown content
			const slidesContainer = document.getElementById('slides-container');
			slidesContainer.innerHTML = `
				<section data-markdown data-separator="${params.sectionSeparator || DEFAULT_CONFIG.sectionSeparator}" data-separator-vertical="${params.slideSeparator || DEFAULT_CONFIG.slideSeparator}">
					<textarea data-template>${processedMarkdown}</textarea>
				</section>
			`;
			
			// Update page title only if it wasn't set by frontmatter
			if (document.title === 'reveal.js - Markdown Loader' || 
				document.title === 'reveal.js - The HTML Presentation Framework' ||
				document.title.includes('Markdown Loader')) {
				document.title = `reveal.js - ${params.file}`;
			}
			
			// Build the reveal configuration
			const revealConfig = {
				controls: true,
				progress: true,
				history: true,
				center: true,
				hash: true,
				plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight, RevealMath.KaTeX ]
			};
			
			// Apply transition if specified
			if (params.transition && AVAILABLE_TRANSITIONS.includes(params.transition.toLowerCase())) {
				revealConfig.transition = params.transition.toLowerCase();
				console.log('Using transition from URL:', revealConfig.transition);
			}
			
			// Initialize Reveal.js AFTER inserting the content
			Reveal.initialize(revealConfig);
			
		} catch (error) {
			console.error('Error loading and processing local markdown:', error);
			
			// Fallback to direct loading if precompilation fails
			this.updateStylesheets(params.theme, params.highlightStyle);
			
			const slidesContainer = document.getElementById('slides-container');
			slidesContainer.innerHTML = `
				<section data-markdown="${localUrl}" data-separator="${params.sectionSeparator || DEFAULT_CONFIG.sectionSeparator}" data-separator-vertical="${params.slideSeparator || DEFAULT_CONFIG.slideSeparator}"></section>
			`;
			
			document.title = `reveal.js - ${params.file}`;
			
			Reveal.initialize({
				controls: true,
				progress: true,
				history: true,
				center: true,
				hash: true,
				plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight, RevealMath.KaTeX ]
			});
		}
	}

	/**
	 * Show the configuration form
	 */
	showForm() {
		console.log('Showing form - missing required params');
		
		// Show form instead of reveal.js, pre-filled with current URL parameters
		document.body.innerHTML = this.generateForm(this.params);
		
		// Add form event listener
		const form = document.getElementById('repo-form');
		if (form) {
			form.addEventListener('submit', (event) => this.handleFormSubmit(event));
		}

		// Add example button listener
		const exampleBtn = document.getElementById('fill-example-btn');
		if (exampleBtn) {
			exampleBtn.addEventListener('click', () => this.fillExample());
		}

		// Add copy URL button listener
		const copyBtn = document.getElementById('copy-url-btn');
		if (copyBtn) {
			copyBtn.addEventListener('click', () => this.copyShareableUrl());
		}

		// Add change listeners to selects for default styling
		this.setupSelectStyling();
		
		// Setup button validation
		this.setupButtonValidation();
	}

	/**
	 * Highlight missing or invalid required fields and show helpful message
	 */
	highlightMissingFields() {
		const ownerField = document.getElementById('owner');
		const repoField = document.getElementById('repo');
		const issues = [];
		
		// Check owner field
		const ownerValue = ownerField ? ownerField.value.trim() : '';
		if (!ownerValue) {
			if (ownerField) {
				this.highlightField(ownerField);
			}
			issues.push('GitHub Username is required');
		} else if (!this.isValidUsername(ownerValue)) {
			if (ownerField) {
				this.highlightField(ownerField);
			}
			issues.push('GitHub Username format is invalid (1-39 chars, alphanumeric and hyphens only)');
		}
		
		// Check repo field
		const repoValue = repoField ? repoField.value.trim() : '';
		if (!repoValue) {
			if (repoField) {
				this.highlightField(repoField);
			}
			issues.push('Repository name is required');
		} else if (!this.isValidRepoName(repoValue)) {
			if (repoField) {
				this.highlightField(repoField);
			}
			issues.push('Repository name format is invalid (1-100 chars, alphanumeric, hyphens, underscores, and dots)');
		}
		
		// Show helpful message
		if (issues.length > 0) {
			alert(issues.join('\n\n'));
		}
	}

	/**
	 * Highlight a field with red border
	 */
	highlightField(field) {
		field.style.borderColor = '#dc3545';
		field.style.boxShadow = '0 0 0 2px rgba(220,53,69,0.25)';
		setTimeout(() => {
			field.style.borderColor = '';
			field.style.boxShadow = '';
		}, 4000);
	}

	/**
	 * Validate repository name format (GitHub repo names)
	 */
	isValidRepoName(repoName) {
		if (!repoName || typeof repoName !== 'string') return false;
		// GitHub repo names: 1-100 chars, alphanumeric, hyphens, underscores, dots
		const repoPattern = /^[a-zA-Z0-9._-]{1,100}$/;
		return repoPattern.test(repoName.trim());
	}

	/**
	 * Validate GitHub username format
	 */
	isValidUsername(username) {
		if (!username || typeof username !== 'string') return false;
		// GitHub usernames: 1-39 chars, alphanumeric and hyphens, no consecutive hyphens, no start/end with hyphen
		const usernamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
		const trimmed = username.trim();
		return trimmed.length >= 1 && trimmed.length <= 39 && usernamePattern.test(trimmed);
	}

	/**
	 * Check if required form fields are filled and valid
	 */
	areRequiredFieldsFilled() {
		const ownerField = document.getElementById('owner');
		const repoField = document.getElementById('repo');
		
		const ownerValue = ownerField ? ownerField.value.trim() : '';
		const repoValue = repoField ? repoField.value.trim() : '';
		
		return this.isValidUsername(ownerValue) && this.isValidRepoName(repoValue);
	}

	/**
	 * Update button states based on form validation
	 */
	updateButtonStates() {
		const loadBtn = document.getElementById('load-btn');
		const copyBtn = document.getElementById('copy-url-btn');
		const form = document.getElementById('repo-form');
		const isValid = form ? form.checkValidity() : false;
		
		if (loadBtn) {
			if (isValid) {
				loadBtn.classList.remove('btn-secondary');
			} else {
				loadBtn.classList.add('btn-secondary');
			}
		}
		
		if (copyBtn) {
			if (isValid) {
				copyBtn.classList.remove('btn-secondary');
			} else {
				copyBtn.classList.add('btn-secondary');
			}
		}
	}

	/**
	 * Setup validation for buttons based on required fields
	 */
	setupButtonValidation() {
		// Initial button state check
		this.updateButtonStates();
		
		// Add input event listeners to required fields
		const ownerField = document.getElementById('owner');
		const repoField = document.getElementById('repo');
		
		if (ownerField) {
			ownerField.addEventListener('input', () => this.updateButtonStates());
		}
		
		if (repoField) {
			repoField.addEventListener('input', () => this.updateButtonStates());
		}
	}

	/**
	 * Setup styling for select elements to show defaults as grayed
	 */
	setupSelectStyling() {
		// Apply initial styling to all selects
		this.updateAllSelectStyling();
		
		// Use setTimeout to ensure DOM is fully ready
		setTimeout(() => {
			console.log('=== DELAYED SETUP ===');
			const themeSelect = document.getElementById('themeSelect');
			const highlightSelect = document.getElementById('highlightStyle');

			console.log('=== SETUP DEBUGGING ===');
			console.log('Theme select element:', themeSelect);
			console.log('Highlight select element:', highlightSelect);

			if (themeSelect) {
				console.log('Setting up theme select event listener');
				console.log('Theme select current value:', themeSelect.value);
				console.log('Theme select options count:', themeSelect.options ? themeSelect.options.length : 'NO OPTIONS');
				if (themeSelect.options) {
					console.log('Theme select options:', Array.from(themeSelect.options).map(o => o.value));
				}
				console.log('Theme select innerHTML:', themeSelect.innerHTML);
				
				// Simple approach - direct function assignment
				themeSelect.addEventListener('change', function(event) {
					console.log('=== THEME CHANGED EVENT FIRED ===');
					console.log('Event:', event);
					console.log('This:', this);
					console.log('Theme value:', this.value);
					console.log('Theme selectedIndex:', this.selectedIndex);
					console.log('Theme classes before:', this.className);
					
					if (this.value === '' || this.selectedIndex === 0) {
						console.log('Theme: Adding default-selected class');
						this.classList.add('default-selected');
					} else {
						console.log('Theme: Removing default-selected class');
						this.classList.remove('default-selected');
					}
					
					console.log('Theme classes after:', this.className);
					console.log('Theme computed style color:', window.getComputedStyle(this).color);
				}, { capture: false, passive: false });
				
				console.log('Theme event listener attached successfully');
			} else {
				console.log('ERROR: Theme select element not found!');
			}

			if (highlightSelect) {
				console.log('Setting up highlight select event listener');
				highlightSelect.addEventListener('change', function() {
					console.log('=== HIGHLIGHT CHANGED ===');
					console.log('Highlight value:', this.value);
					console.log('Highlight selectedIndex:', this.selectedIndex);
					console.log('Highlight classes before:', this.className);
					
					if (this.value === '' || this.selectedIndex === 0) {
						console.log('Highlight: Adding default-selected class');
						this.classList.add('default-selected');
					} else {
						console.log('Highlight: Removing default-selected class');
						this.classList.remove('default-selected');
					}
					
					console.log('Highlight classes after:', this.className);
					console.log('Highlight computed style color:', window.getComputedStyle(this).color);
				});
			} else {
				console.log('ERROR: Highlight select element not found!');
			}
		}, 100);
	}

	/**
	 * Update the styling of a single select element based on its value
	 */
	updateSingleSelectStyling(select) {
		if (select.value === '' || select.selectedIndex === 0) {
			select.classList.add('default-selected');
		} else {
			select.classList.remove('default-selected');
		}
	}

	/**
	 * Update the styling of all select elements based on their values
	 */
	updateAllSelectStyling() {
		const selects = document.querySelectorAll('.repo-form-container select');
		
		selects.forEach(select => {
			this.updateSingleSelectStyling(select);
		});
	}	/**
	 * Initialize the markdown loader
	 */
	async initialize() {
		this.params = this.getUrlParams();
		
		console.log('Params:', this.params);
		console.log('Has owner and repo:', !!(this.params.owner && this.params.repo));
		console.log('Load parameter:', this.params.load);
		console.log('Local parameter:', this.params.local);
		
		// Precedence logic:
		// 1. If local=true → Local mode (bypass GUI, work with local files)
		// 2. Else if load=false → Force GUI mode  
		// 3. Else if all required params present → Direct load mode
		// 4. Else → GUI mode
		
		if (this.params.local === 'true') {
			console.log('Local mode enabled - bypassing GUI');
			await this.initializeLocalPresentation(this.params);
		} else {
			// Check if we should force form display
			const shouldShowForm = this.params.load === 'false' || !this.params.owner || !this.params.repo;
			
			if (shouldShowForm) {
				this.showForm();
			} else {
				await this.initializePresentation(this.params);
			}
		}
	}
}

// Expose globally for usage
window.MarkdownLoader = MarkdownLoader;
