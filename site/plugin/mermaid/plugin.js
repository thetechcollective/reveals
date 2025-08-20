/*!
 * reveal.js Mermaid plugin
 * Renders Mermaid diagrams in Reveal.js presentations
 */

const Plugin = {

	id: 'mermaid',

	init: function( reveal ) {
		
		// Check if Mermaid is available
		if (typeof mermaid === 'undefined') {
			console.warn('Mermaid library not found. Please include mermaid.js before this plugin.');
			return;
		}

		// Configure Mermaid with Reveal.js friendly settings
		mermaid.initialize({
			startOnLoad: false,
			theme: 'default',
			securityLevel: 'loose',
			themeVariables: {
				fontFamily: 'inherit'
			}
		});

		// Function to render all Mermaid diagrams on the current slide
		const renderMermaidDiagrams = () => {
			// Find all elements with mermaid class on visible slides
			const mermaidElements = reveal.getRevealElement().querySelectorAll('.mermaid:not([data-processed])');
			
			mermaidElements.forEach((element, index) => {
				// Check if the element is on a visible slide
				const slide = element.closest('section');
				if (slide && (slide.classList.contains('present') || slide.classList.contains('future') || slide.classList.contains('past'))) {
					// Generate unique ID for this diagram
					const id = `mermaid-diagram-${Date.now()}-${index}`;
					element.id = id;
					
					// Get the diagram definition
					const definition = element.textContent.trim();
					
					// Clear the element content
					element.innerHTML = '';
					
					// Render the diagram
					try {
						mermaid.render(id + '-svg', definition).then(({ svg }) => {
							element.innerHTML = svg;
							element.setAttribute('data-processed', 'true');
						}).catch(error => {
							console.error('Mermaid rendering error:', error);
							element.innerHTML = `<div style="color: red; padding: 1em; border: 1px dashed red;">
								<strong>Mermaid Rendering Error:</strong><br>
								<pre style="margin: 0.5em 0; font-size: 0.8em;">${error.message}</pre>
								<details style="margin-top: 0.5em;">
									<summary style="cursor: pointer;">Show diagram source</summary>
									<pre style="margin: 0.5em 0; font-size: 0.8em; background: #f5f5f5; padding: 0.5em;">${definition}</pre>
								</details>
							</div>`;
							element.setAttribute('data-processed', 'true');
						});
					} catch (error) {
						console.error('Mermaid rendering error:', error);
						element.innerHTML = `<div style="color: red; padding: 1em; border: 1px dashed red;">
							<strong>Mermaid Rendering Error:</strong><br>
							<pre style="margin: 0.5em 0; font-size: 0.8em;">${error.message}</pre>
						</div>`;
						element.setAttribute('data-processed', 'true');
					}
				}
			});
		};

		// Function to process Mermaid code blocks (```mermaid)
		const processMermaidCodeBlocks = () => {
			const codeBlocks = reveal.getRevealElement().querySelectorAll('pre code.language-mermaid, pre code.mermaid');
			
			codeBlocks.forEach(codeBlock => {
				if (!codeBlock.closest('.mermaid')) {
					// Replace the code block with a mermaid div
					const mermaidDiv = document.createElement('div');
					mermaidDiv.className = 'mermaid';
					mermaidDiv.textContent = codeBlock.textContent;
					
					// Replace the entire pre block
					const preElement = codeBlock.closest('pre');
					if (preElement) {
						preElement.parentNode.replaceChild(mermaidDiv, preElement);
					}
				}
			});
		};

		// Process any existing Mermaid code blocks first
		processMermaidCodeBlocks();

		// Render diagrams when Reveal.js is ready
		if (reveal.isReady()) {
			renderMermaidDiagrams();
		} else {
			reveal.addEventListener('ready', renderMermaidDiagrams);
		}

		// Re-render diagrams when slides change
		reveal.addEventListener('slidechanged', renderMermaidDiagrams);

		// Also render when fragments are shown (in case mermaid is in a fragment)
		reveal.addEventListener('fragmentshown', renderMermaidDiagrams);

		// Process any dynamically added content
		reveal.addEventListener('overviewshown', renderMermaidDiagrams);
		reveal.addEventListener('overviewhidden', renderMermaidDiagrams);

		console.log('Reveal.js Mermaid plugin initialized');
	}

};

export default () => Plugin;
