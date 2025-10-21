#!/usr/bin/env node

/**
 * Reproduction script for peer online display issue
 * 
 * Issue: การแสดง peer online ฝั่ง refresh หน้าจอไม่ถูกต้อง อีกฝั่งถูกต้อง
 * Translation: The peer online display on the refresh side is incorrect, the other side is correct
 * 
 * Root cause: markPeerActive callback has stale closures due to missing dependencies
 * in the useCallback dependency array (line 93 in useChatRoom.ts)
 */

console.log('🔍 Peer Online Display Issue Reproduction');
console.log('==========================================');

console.log('\n📋 Issue Description:');
console.log('- When one user refreshes the page, peer online status is not displayed correctly');
console.log('- The other side (non-refreshed) shows correct online status');
console.log('- This creates inconsistent online presence indicators');

console.log('\n🐛 Root Cause Analysis:');
console.log('1. markPeerActive function in useChatRoom.ts (line 61-93)');
console.log('2. The useCallback dependency array is missing roomId and updatePeerPresence');
console.log('3. This causes stale closures that reference old roomId/updatePeerPresence values');
console.log('4. When the component re-renders after refresh, the callback still uses old values');

console.log('\n📍 File locations:');
console.log('- /src/modules/chat/hooks/useChatRoom.ts:93 (missing dependencies)');
console.log('- /src/modules/chat/contexts/ChatRoomsContext.tsx:48 (peerPresence state)');
console.log('- /src/app/[lang]/chat/_components/ChatRoomList/index.tsx:19 (displays online status)');

console.log('\n🔧 Expected Fix:');
console.log('Change line 93 in useChatRoom.ts from:');
console.log('}, []);');
console.log('to:');
console.log('}, [roomId, updatePeerPresence]);');

console.log('\n✅ This will ensure:');
console.log('- markPeerActive always uses current roomId and updatePeerPresence');
console.log('- Peer online status updates correctly after page refresh');
console.log('- Consistent online presence display on both sides');

console.log('\n🎯 Test scenario to verify fix:');
console.log('1. Open chat between two users');
console.log('2. Both users should see each other as online');
console.log('3. One user refreshes the page');  
console.log('4. Both users should still see each other as online (currently fails)');
console.log('5. Send a message from non-refreshed user');
console.log('6. Refreshed user should see sender as online (currently fails)');