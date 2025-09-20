// Minimal test content script
console.log('🚨 TEST CONTENT SCRIPT LOADED!');
console.log('🚨 URL:', window.location.href);
console.log('🚨 Timestamp:', new Date().toISOString());

// Simple test function
window.testFunction = function() {
  console.log('🧪 Test function called!');
  return 'SUCCESS';
};

console.log('🚨 Test function assigned:', typeof window.testFunction);
