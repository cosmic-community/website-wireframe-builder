const fs = require('fs');
const path = require('path');

// Script to inject console capture into built HTML files
function injectConsoleCapture() {
  const buildDir = '.next';
  const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
  
  function processHTMLFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processHTMLFiles(filePath);
      } else if (file.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Inject script tag if not already present
        if (!content.includes('dashboard-console-capture.js')) {
          content = content.replace('</head>', `${scriptTag}</head>`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Injected console capture into: ${filePath}`);
        }
      }
    }
  }
  
  processHTMLFiles(buildDir);
  console.log('Console capture injection complete');
}

// Run if called directly
if (require.main === module) {
  injectConsoleCapture();
}

module.exports = injectConsoleCapture;