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
			file: params.get('file'),
			theme: params.get('theme'),
			highlightStyle: params.get('highlightStyle'),
			sectionSeparator: params.get('sectionSeparator'),
			slideSeparator: params.get('slideSeparator'),
			load: params.get('load')
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
				themeEl.href = `/dist/theme/${theme}.css`;
			}
			
			if (highlightEl && highlightStyle && highlightStyle !== DEFAULT_CONFIG.highlightStyle) {
				highlightEl.href = `/plugin/highlight/${highlightStyle}.css`;
			}
		} catch (error) {
			console.log('Error updating stylesheets:', error);
		}
	}

	/**
	 * Generate the theme options HTML
	 */
	generateThemeOptions(selectedTheme = null) {
		const options = ['<option value="">Use default (White)</option>'];
		
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
		const options = ['<option value="">Use default (Monokai)</option>'];
		
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
			<div class="gist-form-container">
				<h1>🎯 reveal.js Gist Loader</h1>
				<p>Create instant presentations from GitHub Gists</p>
				
				<div class="form-note">
					<strong>Note:</strong> GitHub caches gist raw URLs. Changes may take a few minutes to appear. For immediate updates trigger a cache refresh by simply adding an arbitrary parameter to the url (e.g., <code>?v=2</code>).
				</div>

				<form id="gist-form">
					<div class="form-group">
						<label for="owner" class="required">GitHub Username</label>
						<input type="text" id="owner" name="owner" placeholder="e.g., lakruzz" value="${params.owner || ''}" required>
					</div>

					<div class="form-group">
						<label for="gist" class="required">Gist ID</label>
						<input type="text" id="gist" name="gist" placeholder="e.g., ac9ecc6b852a433ffb88056bfdb15d68" value="${params.gist || ''}" required>
					</div>

					<div class="form-group">
						<label for="file">Filename</label>
						<input type="text" id="file" name="file" placeholder="presentation.md" value="${params.file && params.file !== DEFAULT_CONFIG.file ? params.file : ''}">
						<small style="color: #666; font-size: 12px;">A reveals flavored MarkDown file (Leave empty to use default)</small>
					</div>

					<div class="form-group">
						<label for="sectionSeparator">Section Separator (Regex)</label>
						<input type="text" id="sectionSeparator" name="sectionSeparator" placeholder="^<!--section-->" value="${params.sectionSeparator && params.sectionSeparator !== DEFAULT_CONFIG.sectionSeparator ? params.sectionSeparator : ''}">
						<small style="color: #666; font-size: 12px;">Regex pattern to separate horizontal slides (leave empty to use default)</small>
					</div>

					<div class="form-group">
						<label for="slideSeparator">Slide Separator (Regex)</label>
						<input type="text" id="slideSeparator" name="slideSeparator" placeholder="^<!--slide-->" value="${params.slideSeparator && params.slideSeparator !== DEFAULT_CONFIG.slideSeparator ? params.slideSeparator : ''}">
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
			gist: document.getElementById('gist'),
			file: document.getElementById('file'),
			theme: document.getElementById('themeSelect'),
			highlightStyle: document.getElementById('highlightStyle'),
			sectionSeparator: document.getElementById('sectionSeparator'),
			slideSeparator: document.getElementById('slideSeparator')
		};

		// Fill only the required fields
		if (elements.owner) elements.owner.value = 'lakruzz';
		if (elements.gist) elements.gist.value = 'ac9ecc6b852a433ffb88056bfdb15d68';
		
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
		const form = document.getElementById('gist-form');
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
		const form = document.getElementById('gist-form');
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
		const gistUrl = this.buildGistRawUrl(params.owner, params.gist, params.file || DEFAULT_CONFIG.file);
		console.log('Gist URL:', gistUrl);
		
		// Create the section element with data-markdown attribute
		const slidesContainer = document.getElementById('slides-container');
		slidesContainer.innerHTML = `
			<section data-markdown="${gistUrl}" data-separator="${params.sectionSeparator || DEFAULT_CONFIG.sectionSeparator}" data-separator-vertical="${params.slideSeparator || DEFAULT_CONFIG.slideSeparator}"></section>
		`;
		
		// Update page title
		document.title = `reveal.js - ${params.file || DEFAULT_CONFIG.file}`;
		
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
		
		// Show form instead of reveal.js, pre-filled with current URL parameters
		document.body.innerHTML = this.generateForm(this.params);
		
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
		const gistField = document.getElementById('gist');
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
		
		// Check gist field
		const gistValue = gistField ? gistField.value.trim() : '';
		if (!gistValue) {
			if (gistField) {
				this.highlightField(gistField);
			}
			issues.push('Gist ID is required');
		} else if (!this.isValidGistId(gistValue)) {
			if (gistField) {
				this.highlightField(gistField);
			}
			issues.push('Gist ID format is invalid (should be 32-character hexadecimal string)');
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
	 * Validate gist ID format (GitHub gist IDs are 32-character hexadecimal strings)
	 */
	isValidGistId(gistId) {
		if (!gistId || typeof gistId !== 'string') return false;
		// GitHub gist IDs are typically 32 characters, all lowercase hex
		const gistPattern = /^[a-f0-9]{32}$/i;
		return gistPattern.test(gistId.trim());
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
		const gistField = document.getElementById('gist');
		
		const ownerValue = ownerField ? ownerField.value.trim() : '';
		const gistValue = gistField ? gistField.value.trim() : '';
		
		return this.isValidUsername(ownerValue) && this.isValidGistId(gistValue);
	}

	/**
	 * Update button states based on form validation
	 */
	updateButtonStates() {
		const loadBtn = document.getElementById('load-btn');
		const copyBtn = document.getElementById('copy-url-btn');
		const form = document.getElementById('gist-form');
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
		const gistField = document.getElementById('gist');
		
		if (ownerField) {
			ownerField.addEventListener('input', () => this.updateButtonStates());
		}
		
		if (gistField) {
			gistField.addEventListener('input', () => this.updateButtonStates());
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
		const selects = document.querySelectorAll('.gist-form-container select');
		
		selects.forEach(select => {
			this.updateSingleSelectStyling(select);
		});
	}	/**
	 * Initialize the gist loader
	 */
	initialize() {
		this.params = this.getUrlParams();
		
		console.log('Params:', this.params);
		console.log('Has owner and gist:', !!(this.params.owner && this.params.gist));
		console.log('Load parameter:', this.params.load);
		
		// Check if we should force form display
		const shouldShowForm = this.params.load === 'false' || !this.params.owner || !this.params.gist;
		
		if (shouldShowForm) {
			this.showForm();
		} else {
			this.initializePresentation(this.params);
		}
	}
}

// Expose globally for usage
window.GistLoader = GistLoader;
