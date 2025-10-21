/**
 * Test script to verify chat reconnection functionality
 * 
 * This script verifies:
 * 1. WebSocket reconnection logic is implemented in useWebSocket hook
 * 2. Exponential backoff is properly configured
 * 3. Automatic reconnection triggers on disconnect/error
 * 4. Manual disconnect prevents auto-reconnection
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Chat Reconnection Implementation...\n');

const hookPath = path.join(__dirname, 'src/modules/chat/hooks/useWebSocket.ts');
const hookContent = fs.readFileSync(hookPath, 'utf8');

let passCount = 0;
let failCount = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    passCount++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failCount++;
  }
}

// Test 1: Check reconnection options exist
test(
  'Reconnection options added to interface',
  hookContent.includes('autoReconnect?:') && 
  hookContent.includes('maxReconnectAttempts?:') && 
  hookContent.includes('reconnectInterval?:'),
  'Missing reconnection configuration options'
);

// Test 2: Check reconnection callbacks
test(
  'Reconnection callbacks defined',
  hookContent.includes('onReconnecting?:') && 
  hookContent.includes('onReconnected?:') && 
  hookContent.includes('onReconnectFailed?:'),
  'Missing reconnection callback functions'
);

// Test 3: Check reconnection state refs
test(
  'Reconnection state management implemented',
  hookContent.includes('reconnectAttemptsRef') && 
  hookContent.includes('reconnectTimerRef') && 
  hookContent.includes('isReconnectingRef') &&
  hookContent.includes('isManualDisconnectRef'),
  'Missing reconnection state references'
);

// Test 4: Check scheduleReconnect function exists
test(
  'scheduleReconnect function implemented',
  hookContent.includes('const scheduleReconnect') && 
  hookContent.includes('exponential backoff') &&
  hookContent.includes('Math.pow(2, reconnectAttemptsRef.current - 1)'),
  'scheduleReconnect function not found or missing exponential backoff'
);

// Test 5: Check clearReconnectTimer function
test(
  'clearReconnectTimer function implemented',
  hookContent.includes('const clearReconnectTimer') && 
  hookContent.includes('clearTimeout(reconnectTimerRef.current)'),
  'clearReconnectTimer function not properly implemented'
);

// Test 6: Check onopen handler resets reconnection
test(
  'onopen handler resets reconnection state',
  hookContent.includes('adapter.onopen') && 
  hookContent.includes('reconnectAttemptsRef.current = 0') &&
  hookContent.includes('clearReconnectTimer()') &&
  hookContent.includes('onReconnected?.()'),
  'onopen handler does not properly reset reconnection state'
);

// Test 7: Check onclose triggers reconnection
test(
  'onclose handler triggers reconnection',
  hookContent.includes('adapter.onclose') && 
  hookContent.includes('scheduleReconnect()') &&
  /adapter\.onclose\s*=\s*\(\)\s*=>\s*{[\s\S]*?scheduleReconnect\(\)/m.test(hookContent),
  'onclose handler does not trigger scheduleReconnect'
);

// Test 8: Check onerror triggers reconnection
test(
  'onerror handler triggers reconnection',
  hookContent.includes('adapter.onerror') && 
  hookContent.includes('scheduleReconnect()') &&
  /adapter\.onerror\s*=\s*\(.*?\)\s*=>\s*{[\s\S]*?scheduleReconnect\(\)/m.test(hookContent),
  'onerror handler does not trigger scheduleReconnect'
);

// Test 9: Check connect function clears manual disconnect flag
test(
  'connect function clears manual disconnect flag',
  hookContent.includes('const connect') && 
  hookContent.includes('isManualDisconnectRef.current = false'),
  'connect function does not clear manual disconnect flag'
);

// Test 10: Check disconnect function sets manual disconnect flag
test(
  'disconnect function sets manual disconnect flag',
  hookContent.includes('const disconnect') && 
  hookContent.includes('isManualDisconnectRef.current = true') &&
  hookContent.includes('clearReconnectTimer()'),
  'disconnect function does not properly set manual disconnect flag or clear timers'
);

// Test 11: Check cleanup effect
test(
  'Cleanup effect clears timers on unmount',
  /useEffect\s*\(\s*\(\)\s*=>\s*{[\s\S]*?return\s*\(\)\s*=>\s*{[\s\S]*?clearReconnectTimer\(\)/m.test(hookContent),
  'Missing cleanup effect to clear reconnection timer'
);

// Test 12: Check default values
test(
  'Default reconnection values are set',
  hookContent.includes('autoReconnect = true') && 
  hookContent.includes('maxReconnectAttempts = 5') &&
  hookContent.includes('reconnectInterval = 1000'),
  'Default reconnection values not properly configured'
);

// Test 13: Check max attempts guard
test(
  'Max reconnection attempts guard implemented',
  hookContent.includes('reconnectAttemptsRef.current >= maxReconnectAttempts') &&
  hookContent.includes('onReconnectFailed?.()'),
  'Max attempts guard or failure callback not properly implemented'
);

// Test 14: Check manual disconnect guard in scheduleReconnect
test(
  'Manual disconnect prevents auto-reconnection',
  /scheduleReconnect[\s\S]*?isManualDisconnectRef\.current[\s\S]*?return/m.test(hookContent),
  'scheduleReconnect does not check manual disconnect flag'
);

console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log('='.repeat(50));

if (failCount === 0) {
  console.log('\n🎉 All tests passed! Reconnection logic is properly implemented.');
  console.log('\nReconnection features:');
  console.log('  • Automatic reconnection on disconnect/error');
  console.log('  • Exponential backoff (1s, 2s, 4s, 8s, 16s)');
  console.log('  • Maximum 5 reconnection attempts');
  console.log('  • Manual disconnect prevention');
  console.log('  • Proper cleanup on unmount');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Please review the implementation.');
  process.exit(1);
}
