/**
 * Gist Loader Module
 * Handles loading reveal.js presentations from GitHub Gists
 */

/**
 * Default configuration for the gist loader
 */
const DEFAULT_CONFIG = {
	file: 'presentation.md',
	theme: 'white',
	highlightStyle: 'monokai',
	sectionSeparator: '^<!--section-->',
	slideSeparator: '^<!--slide-->'
};

/**
 * Available themes for the presentation
 */
const AVAILABLE_THEMES = [
	'white', 'black', 'league', 'beige', 'sky', 
	'night', 'serif', 'simple', 'solarized', 'blood', 'moon'
];

/**
 * Available highlight styles
 */
const AVAILABLE_HIGHLIGHT_STYLES = [
	'monokai', 'zenburn'
];

/**
 * GistLoader class to handle gist-based presentations
 */
class GistLoader {
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
			gist: params.get('gist'),
			file: params.get('file') || DEFAULT_CONFIG.file,
			theme: params.get('theme') || DEFAULT_CONFIG.theme,
			highlightStyle: params.get('highlightStyle') || DEFAULT_CONFIG.highlightStyle,
			sectionSeparator: params.get('sectionSeparator') || DEFAULT_CONFIG.sectionSeparator,
			slideSeparator: params.get('slideSeparator') || DEFAULT_CONFIG.slideSeparator
		};
	}

	/**
	 * Update stylesheets based on parameters
	 */
	updateStylesheets(theme, highlightStyle) {
		try {
			const themeEl = document.getElementById('theme');
			const highlightEl = document.getElementById('highlight-theme');
			
			if (themeEl && theme && theme !== DEFAULT_CONFIG.theme) {
				themeEl.href = `dist/theme/${theme}.css`;
			}
			
			if (highlightEl && highlightStyle && highlightStyle !== DEFAULT_CONFIG.highlightStyle) {
				highlightEl.href = `plugin/highlight/${highlightStyle}.css`;
			}
		} catch (error) {
			console.log('Error updating stylesheets:', error);
		}
	}

	/**
	 * Generate the theme options HTML
	 */
	generateThemeOptions() {
		return AVAILABLE_THEMES.map(theme => 
			`<option value="${theme}">${theme.charAt(0).toUpperCase() + theme.slice(1)}</option>`
		).join('');
	}

	/**
	 * Generate the highlight style options HTML
	 */
	generateHighlightOptions() {
		return AVAILABLE_HIGHLIGHT_STYLES.map(style => 
			`<option value="${style}">${style.charAt(0).toUpperCase() + style.slice(1)}</option>`
		).join('');
	}

	/**
	 * Generate the configuration form HTML
	 */
	generateForm() {
		return `
			<div class="gist-form-container">
				<h1>🎯 reveal.js Gist Loader</h1>
				<p>Create instant presentations from GitHub Gists</p>
				
				<div class="form-note">
					<strong>Note:</strong> GitHub caches gist raw URLs. Changes may take a few minutes to appear when using the short URL format. For immediate updates, use the specific commit SHA in your gist URL.
				</div>

				<form id="gist-form">
					<div class="form-group">
						<label for="owner" class="required">GitHub Username</label>
						<input type="text" id="owner" name="owner" placeholder="e.g., lakruzz" required>
					</div>

					<div class="form-group">
						<label for="gist" class="required">Gist ID</label>
						<input type="text" id="gist" name="gist" placeholder="e.g., ac9ecc6b852a433ffb88056bfdb15d68" required>
					</div>

					<div class="form-group">
						<label for="file">Filename</label>
						<input type="text" id="file" name="file" placeholder="presentation.md" value="presentation.md">
					</div>

					<div class="form-group">
						<label for="theme">Theme</label>
						<select id="theme" name="theme">
							${this.generateThemeOptions()}
						</select>
					</div>

					<div class="form-group">
						<label for="highlightStyle">Code Highlight Style</label>
						<select id="highlightStyle" name="highlightStyle">
							${this.generateHighlightOptions()}
						</select>
					</div>

					<div class="form-group">
						<label for="sectionSeparator">Section Separator (Regex)</label>
						<input type="text" id="sectionSeparator" name="sectionSeparator" placeholder="^<!--section-->" value="^<!--section-->">
						<small style="color: #666; font-size: 12px;">Regex pattern to separate horizontal slides</small>
					</div>

					<div class="form-group">
						<label for="slideSeparator">Slide Separator (Regex)</label>
						<input type="text" id="slideSeparator" name="slideSeparator" placeholder="^<!--slide-->" value="^<!--slide-->">
						<small style="color: #666; font-size: 12px;">Regex pattern to separate vertical slides</small>
					</div>

					<button type="submit" class="btn">🚀 Load Presentation</button>
					<button type="button" class="btn btn-secondary" id="fill-example-btn">📝 Fill Example</button>
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
			gist: document.getElementById('gist'),
			file: document.getElementById('file'),
			sectionSeparator: document.getElementById('sectionSeparator'),
			slideSeparator: document.getElementById('slideSeparator')
		};

		if (elements.owner) elements.owner.value = 'lakruzz';
		if (elements.gist) elements.gist.value = 'ac9ecc6b852a433ffb88056bfdb15d68';
		if (elements.file) elements.file.value = 'presentation.md';
		if (elements.sectionSeparator) elements.sectionSeparator.value = '^<!--section-->';
		if (elements.slideSeparator) elements.slideSeparator.value = '^<!--slide-->';
	}

	/**
	 * Handle form submission
	 */
	handleFormSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const params = new URLSearchParams();
		
		for (let [key, value] of formData.entries()) {
			if (value.trim()) {
				params.append(key, value.trim());
			}
		}
		
		// Redirect to the same page with parameters
		window.location.href = '?' + params.toString();
	}

	/**
	 * Build GitHub raw URL from owner, gist ID and filename
	 */
	buildGistRawUrl(owner, gistId, filename) {
		return `https://gist.githubusercontent.com/${owner}/${gistId}/raw/${filename}`;
	}

	/**
	 * Initialize reveal.js presentation with gist content
	 */
	initializePresentation(params) {
		// Update stylesheets based on parameters only if they differ from defaults
		this.updateStylesheets(params.theme, params.highlightStyle);
		
		// Build the gist URL
		const gistUrl = this.buildGistRawUrl(params.owner, params.gist, params.file);
		console.log('Gist URL:', gistUrl);
		
		// Create the section element with data-markdown attribute
		const slidesContainer = document.getElementById('slides-container');
		slidesContainer.innerHTML = `
			<section data-markdown="${gistUrl}" data-separator="${params.sectionSeparator}" data-separator-vertical="${params.slideSeparator}"></section>
		`;
		
		// Update page title
		document.title = `reveal.js - ${params.file}`;
		
		// Initialize Reveal.js
		Reveal.initialize({
			controls: true,
			progress: true,
			history: true,
			center: true,
			hash: true,
			plugins: [ RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.KaTeX ]
		});
	}

	/**
	 * Show the configuration form
	 */
	showForm() {
		console.log('Showing form - missing required params');
		
		// Show form instead of reveal.js
		document.body.innerHTML = this.generateForm();
		
		// Add form event listener
		const form = document.getElementById('gist-form');
		if (form) {
			form.addEventListener('submit', (event) => this.handleFormSubmit(event));
		}

		// Add example button listener
		const exampleBtn = document.getElementById('fill-example-btn');
		if (exampleBtn) {
			exampleBtn.addEventListener('click', () => this.fillExample());
		}
	}

	/**
	 * Initialize the gist loader
	 */
	initialize() {
		this.params = this.getUrlParams();
		
		console.log('Params:', this.params);
		console.log('Has owner and gist:', !!(this.params.owner && this.params.gist));
		
		if (this.params.owner && this.params.gist) {
			this.initializePresentation(this.params);
		} else {
			this.showForm();
		}
	}
}

// Expose globally for usage
window.GistLoader = GistLoader;
