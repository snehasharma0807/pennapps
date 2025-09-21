#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking dependencies and API configuration...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ ERROR: package.json not found. Run this script from the project root.');
  process.exit(1);
}

// Check for required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'AUTH0_SECRET',
  'AUTH0_ISSUER_BASE_URL',
  'AUTH0_BASE_URL',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'GEMINI_API_KEY'
];

console.log('📋 Checking environment variables...');
let envVarsMissing = false;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ ERROR: ${envVar} not found. Please set ${envVar} in .env.local`);
    envVarsMissing = true;
  } else {
    console.log(`✅ ${envVar} is set`);
  }
}

if (envVarsMissing) {
  console.log('\n💡 Create a .env.local file with the following variables:');
  console.log('MONGODB_URI=your_mongodb_connection_string');
  console.log('AUTH0_SECRET=your_auth0_secret');
  console.log('AUTH0_ISSUER_BASE_URL=https://your_auth0_domain.auth0.com');
  console.log('AUTH0_BASE_URL=http://localhost:3000');
  console.log('AUTH0_CLIENT_ID=your_auth0_client_id');
  console.log('AUTH0_CLIENT_SECRET=your_auth0_client_secret');
  console.log('GEMINI_API_KEY=your_gemini_api_key');
  process.exit(1);
}

// Check for required packages
const requiredPackages = [
  'next',
  'mongoose',
  '@auth0/nextjs-auth0',
  'recharts',
  'face-api.js'
];

console.log('\n📦 Checking required packages...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  let packagesMissing = false;
  
  for (const pkg of requiredPackages) {
    if (!allDeps[pkg]) {
      console.error(`❌ ERROR: ${pkg} not installed. Run: npm install ${pkg}@latest`);
      packagesMissing = true;
    } else {
      console.log(`✅ ${pkg} is installed (${allDeps[pkg]})`);
    }
  }
  
  if (packagesMissing) {
    process.exit(1);
  }
} catch (error) {
  console.error('❌ ERROR: Could not read package.json:', error.message);
  process.exit(1);
}

// Check for outdated packages
console.log('\n🔄 Checking for outdated packages...');
try {
  const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
  const outdatedPackages = JSON.parse(outdated);
  
  const criticalPackages = ['next', 'mongoose', '@auth0/nextjs-auth0', 'recharts'];
  let hasCriticalOutdated = false;
  
  for (const [pkg, info] of Object.entries(outdatedPackages)) {
    if (criticalPackages.includes(pkg)) {
      console.warn(`⚠️  WARNING: ${pkg} is outdated. Current: ${info.current}, Latest: ${info.latest}`);
      hasCriticalOutdated = true;
    }
  }
  
  if (hasCriticalOutdated) {
    console.log('\n💡 Run "npm update" to update packages or install specific versions:');
    for (const [pkg, info] of Object.entries(outdatedPackages)) {
      if (criticalPackages.includes(pkg)) {
        console.log(`npm install ${pkg}@${info.latest}`);
      }
    }
  } else {
    console.log('✅ All critical packages are up to date');
  }
} catch (error) {
  if (error.status !== 1) { // npm outdated exits with 1 when packages are outdated
    console.error('❌ ERROR: Could not check for outdated packages:', error.message);
    process.exit(1);
  }
}

// Verify MongoDB connection
console.log('\n🗄️  Verifying MongoDB connection...');
try {
  const mongoose = require('mongoose');
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set');
  }
  
  // Test connection (with timeout)
  const connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  
  Promise.race([
    connectionPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
  ]).then(() => {
    console.log('✅ MongoDB connection successful');
    mongoose.disconnect();
  }).catch((error) => {
    console.error('❌ ERROR: MongoDB connection failed:', error.message);
    console.log('💡 Check your MONGODB_URI and ensure MongoDB is accessible');
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ ERROR: Could not test MongoDB connection:', error.message);
  process.exit(1);
}

console.log('\n🎉 All dependency and API checks passed!');
console.log('✅ Ready to build and deploy');
