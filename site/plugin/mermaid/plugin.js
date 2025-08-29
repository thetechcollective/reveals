/*!
 * reveal.js Mermaid plugin - directly using prism.js highlighting integration
 */

const RevealMermaid = {
    id: 'mermaid',
    
    init: function(reveal) {
        // Wait for DOM to be ready and then transform mermaid code blocks
        document.addEventListener('DOMContentLoaded', function() {
            // Pre-initialize mermaid to make sure it's ready
            if (typeof mermaid !== 'undefined') {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default', 
                    securityLevel: 'loose',
                    fontFamily: 'sans-serif'
                });
            }
        });
        
        // Function that actually processes the mermaid blocks
        function processMermaidBlocks() {
            if (typeof mermaid === 'undefined') {
                console.error('Mermaid library not loaded');
                return;
            }
            
            // Get all mermaid code blocks - try different possible selectors
            const selectors = [
                'code.language-mermaid',
                'code.mermaid',
                'pre.mermaid code',
                'pre code.lang-mermaid'
            ];
            
            let mermaidBlocks = [];
            
            // Try each selector
            for (const selector of selectors) {
                const blocks = document.querySelectorAll(selector);
                if (blocks.length > 0) {
                    console.log(`Found ${blocks.length} mermaid blocks with selector: ${selector}`);
                    mermaidBlocks = blocks;
                    break;
                }
            }
            
            if (mermaidBlocks.length === 0) {
                console.log('No mermaid code blocks found, trying to scan all code blocks');
                
                // Look for any code blocks that might contain mermaid content
                const allCodeBlocks = document.querySelectorAll('pre code');
                allCodeBlocks.forEach(block => {
                    const content = block.textContent.trim();
                    if (content.startsWith('graph ') || 
                        content.startsWith('flowchart ') || 
                        content.startsWith('sequenceDiagram') || 
                        content.startsWith('gantt') || 
                        content.startsWith('classDiagram') || 
                        content.startsWith('stateDiagram') || 
                        content.startsWith('erDiagram') || 
                        content.startsWith('journey') || 
                        content.startsWith('pie') || 
                        content.startsWith('gitGraph')) {
                        
                        console.log('Found potential mermaid block by content analysis');
                        mermaidBlocks = [...mermaidBlocks, block];
                    }
                });
            }
            
            if (mermaidBlocks.length === 0) {
                return; // Nothing to process
            }
            
            console.log(`Processing ${mermaidBlocks.length} mermaid blocks`);
            
            // Process each mermaid block
            mermaidBlocks.forEach((codeBlock, index) => {
                // Skip if already processed
                if (codeBlock.dataset.processed === 'true') {
                    return;
                }
                
                const preElement = codeBlock.parentElement;
                if (!preElement) return;
                
                // Mark as processed to avoid double processing
                codeBlock.dataset.processed = 'true';
                
                // Create a div for mermaid
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.innerHTML = codeBlock.textContent;
                mermaidDiv.id = `mermaid-diagram-${Date.now()}-${index}`;
                
                // Replace the pre element with the mermaid div
                preElement.parentNode.replaceChild(mermaidDiv, preElement);
            });
            
            // Render all mermaid diagrams
            try {
                mermaid.init(undefined, '.mermaid');
                console.log('Mermaid diagrams rendered successfully');
            } catch (error) {
                console.error('Error rendering mermaid diagrams:', error);
            }
        }
        
        // Process on slide change
        reveal.on('slidechanged', function() {
            setTimeout(processMermaidBlocks, 100);
        });
        
        // Process when reveal is ready
        reveal.on('ready', function() {
            setTimeout(processMermaidBlocks, 100);
        });
        
        // Also process on fragment shown/hidden
        reveal.on('fragmentshown', processMermaidBlocks);
        reveal.on('fragmenthidden', processMermaidBlocks);
    }
};

// Register the plugin with Reveal
if (typeof window.Reveal !== 'undefined') {
    window.RevealMermaid = RevealMermaid;
    window.Reveal.registerPlugin(RevealMermaid);
}
