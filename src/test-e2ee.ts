/**
 * Test script for E2EE (End-to-End Encryption) implementation
 * 
 * This script tests the key exchange process and encryption/decryption functionality
 * to ensure that the e2ee implementation is working correctly.
 */

import {
  generateEcKeyPair,
  exportPublicKey,
  importEcPublicKeyHex,
  encrypt,
  decrypt,
  arrayBufferToHex
} from './lib/web-crypto';

async function testKeyExchange() {
  console.log('Testing key exchange process...');
  
  // Client side: Generate key pair
  console.log('Client: Generating key pair...');
  const clientKeyPair = await generateEcKeyPair();
  const clientPublicKeyHex = await exportPublicKey(clientKeyPair.publicKey);
  console.log('Client public key (hex):', clientPublicKeyHex);
  
  // Server side: Generate key pair (simulated)
  console.log('Server: Generating key pair...');
  const serverKeyPair = await generateEcKeyPair();
  const serverPublicKeyHex = await exportPublicKey(serverKeyPair.publicKey);
  console.log('Server public key (hex):', serverPublicKeyHex);
  
  // Client side: Import server's public key
  console.log('Client: Importing server public key...');
  const importedServerPublicKey = await importEcPublicKeyHex(serverPublicKeyHex);
  
  // Server side: Import client's public key (simulated)
  console.log('Server: Importing client public key...');
  const importedClientPublicKey = await importEcPublicKeyHex(clientPublicKeyHex);
  
  // Client side: Derive shared secret
  console.log('Client: Deriving shared secret...');
  const clientSharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: importedServerPublicKey },
    clientKeyPair.privateKey,
    256
  );
  const clientSharedSecretHex = arrayBufferToHex(clientSharedSecret);
  console.log('Client shared secret (hex):', clientSharedSecretHex);
  
  // Server side: Derive shared secret (simulated)
  console.log('Server: Deriving shared secret...');
  const serverSharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: importedClientPublicKey },
    serverKeyPair.privateKey,
    256
  );
  const serverSharedSecretHex = arrayBufferToHex(serverSharedSecret);
  console.log('Server shared secret (hex):', serverSharedSecretHex);
  
  // Verify that both sides derived the same shared secret
  console.log('Verifying shared secrets match...');
  if (clientSharedSecretHex === serverSharedSecretHex) {
    console.log('✅ Key exchange successful! Both sides derived the same shared secret.');
    return clientSharedSecret;
  } else {
    console.error('❌ Key exchange failed! Shared secrets do not match.');
    throw new Error('Key exchange failed');
  }
}

async function testEncryptionDecryption(sharedSecret: ArrayBuffer) {
  console.log('\nTesting encryption/decryption functionality...');
  
  // Convert shared secret to a CryptoKey for AES-CBC
  console.log('Importing shared secret as AES-CBC key...');
  const aesKey = await crypto.subtle.importKey(
    'raw',
    sharedSecret,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Test data
  const sessionId = 'test-session-123456789';
  const originalMessage = 'This is a secret message that should be encrypted and decrypted correctly.';
  console.log('Original message:', originalMessage);
  
  // Encrypt the message
  console.log('Encrypting message...');
  const encryptedMessage = await encrypt(originalMessage, aesKey, sessionId);
  console.log('Encrypted message (base64):', encryptedMessage);
  
  // Decrypt the message
  console.log('Decrypting message...');
  const decryptedMessage = await decrypt(encryptedMessage, sessionId, aesKey);
  console.log('Decrypted message:', decryptedMessage);
  
  // Verify that the decrypted message matches the original
  console.log('Verifying decryption...');
  if (decryptedMessage === originalMessage) {
    console.log('✅ Encryption/decryption successful! Decrypted message matches original.');
  } else {
    console.error('❌ Encryption/decryption failed! Decrypted message does not match original.');
    throw new Error('Encryption/decryption failed');
  }
}

async function runTests() {
  try {
    console.log('=== E2EE Test Suite ===\n');
    
    // Test key exchange
    const sharedSecret = await testKeyExchange();
    
    // Test encryption/decryption
    await testEncryptionDecryption(sharedSecret);
    
    console.log('\n=== All tests passed! ===');
  } catch (error) {
    console.error('\n=== Test failed! ===');
    console.error(error);
  }
}

// Run the tests
runTests();