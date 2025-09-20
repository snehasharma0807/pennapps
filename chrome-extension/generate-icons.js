// Simple script to create placeholder icons
const fs = require('fs');
const path = require('path');

// Create simple SVG icons
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="middle">🧠</text>
</svg>`;

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Create SVG files
fs.writeFileSync(path.join(iconsDir, 'icon16.svg'), createSVGIcon(16));
fs.writeFileSync(path.join(iconsDir, 'icon48.svg'), createSVGIcon(48));
fs.writeFileSync(path.join(iconsDir, 'icon128.svg'), createSVGIcon(128));

console.log('✅ SVG icons created successfully!');
console.log('📝 Note: Chrome extensions prefer PNG format. You can:');
console.log('1. Open the SVG files in a browser');
console.log('2. Right-click and "Save image as" to convert to PNG');
console.log('3. Or use an online SVG to PNG converter');
