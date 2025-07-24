/**
 * EditForm script for fetchIsoData function
 * 
 * This script tests the fetchIsoData function with different scenarios to ensure
 * it works correctly and handles errors properly.
 * 
 * Run with: ts-node src/test-fetchiso.ts
 */

import fetchIsoData from './lib/api/fetchIsoData';
import { IncomingHttpHeaders } from 'http';

// Mock headers for testing
const mockHeaders: IncomingHttpHeaders = {
  'host': 'localhost:3000',
  'user-agent': 'EditForm Script',
  'accept': 'application/json',
  'cookie': '',  // No auth cookie for testing unauthenticated requests
};

// EditForm scenarios
async function runTests() {
  console.log('=== fetchIsoData EditForm Suite ===\n');
  
  // EditForm 1: Basic functionality with valid URL
  await testValidUrl();
  
  // EditForm 2: Error handling with invalid URL
  await testInvalidUrl();
  
  // EditForm 3: Authentication handling
  await testAuthPath();
  
  console.log('\n=== EditForm Suite Complete ===');
}

// EditForm valid URL scenario
async function testValidUrl() {
  console.log('EditForm 1: Basic functionality with valid URL');
  try {
    const url = '/';
    console.log(`Fetching data for URL: ${url}`);
    
    const result = await fetchIsoData(url, mockHeaders);
    
    if (result) {
      console.log('✅ Successfully fetched data');
      console.log('Path:', result.path);
      console.log('Has site data:', !!result.siteRes);
      console.log('Has user info:', !!result.myUserInfo);
      console.log('Has error data:', !!result.errorPageData);
    } else {
      console.log('❌ Failed to fetch data (null result)');
    }
  } catch (error) {
    console.error('❌ EditForm failed with error:', error);
  }
  console.log('-----------------------------------');
}

// EditForm invalid URL scenario
async function testInvalidUrl() {
  console.log('EditForm 2: Error handling with invalid URL');
  try {
    const url = '/non-existent-page-12345';
    console.log(`Fetching data for URL: ${url}`);
    
    const result = await fetchIsoData(url, mockHeaders);
    
    if (result) {
      console.log('✅ Handled invalid URL gracefully');
      console.log('Path:', result.path);
      console.log('Has error data:', !!result.errorPageData);
      if (result.errorPageData) {
        console.log('Error message:', result.errorPageData.error);
      }
    } else {
      console.log('❌ Failed to handle invalid URL (null result)');
    }
  } catch (error) {
    console.error('❌ EditForm failed with error:', error);
  }
  console.log('-----------------------------------');
}

// EditForm authentication handling
async function testAuthPath() {
  console.log('EditForm 3: Authentication handling');
  try {
    // Use a path that requires authentication
    const url = '/seller-account-setting';
    console.log(`Fetching data for URL: ${url}`);
    
    const result = await fetchIsoData(url, mockHeaders);
    
    if (result === null) {
      console.log('✅ Correctly redirected unauthenticated request');
    } else {
      console.log('❌ Failed to redirect unauthenticated request');
      console.log('Result:', result);
    }
  } catch (error) {
    console.error('❌ EditForm failed with error:', error);
  }
  console.log('-----------------------------------');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});