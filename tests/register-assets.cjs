// Simple require hooks to stub non-JS assets when running Node (tsx) tests
// This prevents SyntaxError: Unexpected token '<' for SVGs and similar assets.

const path = require('node:path');

function exportFilename(module, filename) {
  // Export the absolute filename by default; many libs just need any truthy string.
  module.exports = filename;
}

function exportEmpty(module) {
  module.exports = {};
}

// Image and media files -> export their filename string
[
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico', '.avif'
].forEach(ext => {
  require.extensions[ext] = exportFilename;
});

// Stylesheets -> export empty object
['.css', '.scss', '.sass', '.less', '.styl'].forEach(ext => {
  require.extensions[ext] = exportEmpty;
});

// Optional: raw assets (e.g., fonts) -> export filename
['.woff', '.woff2', '.ttf', '.eot', '.otf'].forEach(ext => {
  require.extensions[ext] = exportFilename;
});
