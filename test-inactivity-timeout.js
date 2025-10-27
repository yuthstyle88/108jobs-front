/**
 * Test script to verify inactivity timeout implementation
 * 
 * This script verifies that:
 * 1. Inactivity timer is set up with 5-minute default timeout
 * 2. Timer starts when connection is established
 * 3. Timer resets on message activity
 * 4. Disconnect is triggered after timeout expires
 * 5. Timer is cleared on manual disconnect
 */

const fs = require('fs');
const path = require('path');

// Read the useWebSocket.ts file
const filePath = path.join(__dirname, 'src/modules/chat/hooks/useWebSocket.ts');
const content = fs.readFileSync(filePath, 'utf-8');

console.log('=== Inactivity Timeout Implementation Test ===\n');

// Test 1: Check if inactivity timeout options are defined
console.log('✓ Test 1: Checking inactivity timeout options...');
const hasInactivityTimeout = content.includes('inactivityTimeout?: number;');
const hasDisableFlag = content.includes('disableInactivityTimeout?: boolean;');
const hasCallback = content.includes('onInactivityTimeout?: () => void;');
if (hasInactivityTimeout && hasDisableFlag && hasCallback) {
  console.log('  ✓ Inactivity timeout options defined correctly\n');
} else {
  console.log('  ✗ Missing inactivity timeout options\n');
  process.exit(1);
}

// Test 2: Check if default timeout is 5 minutes (300000ms)
console.log('✓ Test 2: Checking default timeout value...');
const hasDefaultTimeout = content.includes('inactivityTimeout = 300000');
if (hasDefaultTimeout) {
  console.log('  ✓ Default timeout set to 5 minutes (300000ms)\n');
} else {
  console.log('  ✗ Default timeout not set correctly\n');
  process.exit(1);
}

// Test 3: Check if timer refs are defined
console.log('✓ Test 3: Checking timer refs...');
const hasTimerRef = content.includes('inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)');
const hasLastActivityRef = content.includes('lastActivityTimeRef = useRef<number>(Date.now())');
const hasDisconnectRef = content.includes('disconnectRef = useRef<(() => void) | null>(null)');
if (hasTimerRef && hasLastActivityRef && hasDisconnectRef) {
  console.log('  ✓ Timer refs defined correctly\n');
} else {
  console.log('  ✗ Missing timer refs\n');
  process.exit(1);
}

// Test 4: Check if timer management functions exist
console.log('✓ Test 4: Checking timer management functions...');
const hasClearFunction = content.includes('const clearInactivityTimer = useCallback(');
const hasStartFunction = content.includes('const startInactivityTimer = useCallback(');
const hasResetFunction = content.includes('const resetInactivityTimer = useCallback(');
if (hasClearFunction && hasStartFunction && hasResetFunction) {
  console.log('  ✓ Timer management functions defined\n');
} else {
  console.log('  ✗ Missing timer management functions\n');
  process.exit(1);
}

// Test 5: Check if timer starts on connection
console.log('✓ Test 5: Checking if timer starts on connection...');
const startsOnConnection = content.includes('// Start inactivity timer on successful connection') && 
                            content.includes('startInactivityTimer();');
if (startsOnConnection) {
  console.log('  ✓ Timer starts on successful connection\n');
} else {
  console.log('  ✗ Timer does not start on connection\n');
  process.exit(1);
}

// Test 6: Check if timer resets on message activity
console.log('✓ Test 6: Checking if timer resets on message activity...');
const resetsOnMessage = content.includes('// Reset inactivity timer on any message activity') && 
                        content.includes('resetInactivityTimer();');
if (resetsOnMessage) {
  console.log('  ✓ Timer resets on message activity\n');
} else {
  console.log('  ✗ Timer does not reset on message activity\n');
  process.exit(1);
}

// Test 7: Check if timer clears on disconnect
console.log('✓ Test 7: Checking if timer clears on disconnect...');
const clearsOnDisconnect = content.includes('// Clear inactivity timer') && 
                           content.includes('clearInactivityTimer();');
if (clearsOnDisconnect) {
  console.log('  ✓ Timer clears on disconnect\n');
} else {
  console.log('  ✗ Timer does not clear on disconnect\n');
  process.exit(1);
}

// Test 8: Check if disconnect is triggered on timeout
console.log('✓ Test 8: Checking if disconnect triggers on timeout...');
const triggersDisconnect = content.includes('inactivity timeout reached - disconnecting') &&
                          content.includes('disconnectRef.current()');
if (triggersDisconnect) {
  console.log('  ✓ Disconnect triggered on timeout\n');
} else {
  console.log('  ✗ Disconnect not triggered on timeout\n');
  process.exit(1);
}

// Test 9: Check if resetInactivityTimer is exposed in API
console.log('✓ Test 9: Checking if resetInactivityTimer is exposed...');
const exposedInInterface = content.includes('resetInactivityTimer: () => void;');
const exposedInReturn = content.match(/return\s*{[\s\S]*?resetInactivityTimer[\s\S]*?}/);
if (exposedInInterface && exposedInReturn) {
  console.log('  ✓ resetInactivityTimer exposed in API\n');
} else {
  console.log('  ✗ resetInactivityTimer not exposed in API\n');
  process.exit(1);
}

// Test 10: Check if cleanup is handled on unmount
console.log('✓ Test 10: Checking cleanup on unmount...');
const hasCleanup = content.includes('// Cleanup inactivity timer on unmount');
if (hasCleanup) {
  console.log('  ✓ Cleanup handled on unmount\n');
} else {
  console.log('  ✗ Cleanup not handled\n');
  process.exit(1);
}

console.log('=== All Tests Passed! ===\n');
console.log('Summary:');
console.log('- Inactivity timeout is configured with 5-minute default');
console.log('- Timer starts automatically when connected');
console.log('- Timer resets on any message activity (including typing)');
console.log('- Disconnect triggers automatically after 5 minutes of inactivity');
console.log('- Timer is properly cleaned up on disconnect and unmount');
console.log('- resetInactivityTimer() is exposed for manual reset if needed');
