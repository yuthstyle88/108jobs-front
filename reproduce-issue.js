// Script to reproduce the read receipt issue
// Issue: lastReadAt shows "read" status even when conversation partner is offline

console.log("=== REPRODUCING READ RECEIPT ISSUE ===");

console.log("\n📋 ISSUE DESCRIPTION:");
console.log("Thai: lastReadAt การแสดง status ยังเป็น read ตลอดเวลา ต้องแก้ไข ในกรณี คู่สนทนาไม่ออนไลน์ ก็ ยัง แสดงเป็น read ต้องแก้ไข");
console.log("English: lastReadAt display status is still 'read' all the time, needs to be fixed. In cases where the conversation partner is not online, it still shows as 'read', needs to be fixed.");

console.log("\n🔍 CURRENT BEHAVIOR:");
console.log("1. User A sends message to User B");
console.log("2. User B reads message (WebSocket sends read receipt)");  
console.log("3. useReadReceiptListener receives event and calls setPeerLastReadAt()");
console.log("4. ChatMessageBubble shows 'read' status ✓");
console.log("5. User B goes offline");
console.log("6. ❌ PROBLEM: Messages still show as 'read' even though User B is offline");

console.log("\n🎯 EXPECTED BEHAVIOR:");
console.log("1. User A sends message to User B");
console.log("2. User B reads message while online → shows 'read' ✓");
console.log("3. User B goes offline");
console.log("4. ✅ EXPECTED: Messages should show as 'delivered' or 'sent' instead of 'read'");
console.log("5. When User B comes back online → can show as 'read' again");

console.log("\n🔧 ROOT CAUSE ANALYSIS:");
console.log("- useReadReceiptListener.ts line 20: Always sets current timestamp regardless of peer presence");
console.log("- ChatMessageBubble/index.tsx line 71-76: Only checks if lastReadAt exists, not if peer is online");
console.log("- No integration between peerPresence (ChatRoomsContext) and read receipt logic");

console.log("\n📁 FILES INVOLVED:");
console.log("- src/modules/chat/hooks/useReadReceiptListener.ts (needs presence check)");
console.log("- src/app/[lang]/chat/_components/ChatMessageBubble/index.tsx (read status logic)");
console.log("- src/modules/chat/contexts/ChatRoomsContext.tsx (peerPresence state)");

console.log("\n💡 SOLUTION APPROACH:");
console.log("1. Modify useReadReceiptListener to check peer presence before updating read status");
console.log("2. Clear read receipts when peer goes offline");
console.log("3. Restore read receipts when peer comes back online");
console.log("4. Update ChatMessageBubble to consider peer presence in read status logic");

console.log("\n=== REPRODUCTION COMPLETE ===");