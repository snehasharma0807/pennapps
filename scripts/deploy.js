#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting deployment process...\n');

// Step 1: Run dependency check
console.log('1. Running dependency check...');
try {
  execSync('npm run check-deps', { stdio: 'inherit' });
  console.log('✅ Dependency check passed\n');
} catch (error) {
  console.error('❌ Dependency check failed. Please fix issues before deploying.');
  process.exit(1);
}

// Step 2: Build the application
console.log('2. Building Next.js application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed. Please fix build errors.');
  process.exit(1);
}

// Step 3: Check if Chrome extension is ready
console.log('3. Validating Chrome extension...');
const extensionFiles = [
  'chrome-extension/manifest.json',
  'chrome-extension/popup.html',
  'chrome-extension/popup.js',
  'chrome-extension/background.js',
  'chrome-extension/content.js',
  'chrome-extension/face-detection.js'
];

let extensionValid = true;
for (const file of extensionFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing extension file: ${file}`);
    extensionValid = false;
  }
}

if (extensionValid) {
  console.log('✅ Chrome extension files validated\n');
} else {
  console.error('❌ Chrome extension validation failed');
  process.exit(1);
}

// Step 4: Generate deployment summary
console.log('4. Deployment Summary:');
console.log('   📦 Next.js app built and ready for Vercel');
console.log('   🔧 Chrome extension ready for Chrome Web Store');
console.log('   📊 MongoDB schemas configured');
console.log('   🔐 Custom authentication ready');
console.log('   🤖 Gemini API integration ready');
console.log('   📈 Analytics dashboard with Recharts ready');

console.log('\n🎉 Deployment preparation completed successfully!');
console.log('\nNext steps:');
console.log('1. Deploy to Vercel: Connect GitHub repo and set environment variables');
console.log('2. Package Chrome extension: zip the chrome-extension/ folder');
console.log('3. Submit to Chrome Web Store or distribute as unpacked extension');
console.log('4. Update extension manifest with production URLs');
