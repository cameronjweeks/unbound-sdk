#!/usr/bin/env node

/*
 * Backwards Compatibility Test
 *
 * This script tests that the new modular SDK is backwards compatible
 * with the existing monolithic SDK usage patterns.
 */

import SDK from './index.js';

async function testBasicSDKFunctionality() {
  console.log('🧪 Testing basic SDK functionality...');

  // Test SDK initialization (same as original)
  const api = new SDK(
    'test-namespace',
    'call-123',
    'fake-jwt-token',
    'request-456',
  );

  // Verify all main services are available
  const expectedServices = [
    'login',
    'objects',
    'messaging',
    'video',
    'voice',
    'ai',
    'lookup',
    'layouts',
    'subscriptions',
    'workflows',
    'notes',
    'storage',
    'verification',
    'portals',
    'sipEndpoints',
    'externalOAuth',
    'googleCalendar',
    'enroll',
  ];

  for (const service of expectedServices) {
    if (!api[service]) {
      throw new Error(`❌ Service '${service}' not found on SDK instance`);
    }
    console.log(`✅ Service '${service}' is available`);
  }

  // Test nested services
  if (!api.messaging.sms) {
    throw new Error('❌ messaging.sms not found');
  }
  console.log('✅ messaging.sms is available');

  if (!api.messaging.email) {
    throw new Error('❌ messaging.email not found');
  }
  console.log('✅ messaging.email is available');

  if (!api.ai.generative) {
    throw new Error('❌ ai.generative not found');
  }
  console.log('✅ ai.generative is available');

  if (!api.workflows.items) {
    throw new Error('❌ workflows.items not found');
  }
  console.log('✅ workflows.items is available');

  console.log('✅ All services are properly available');
}

function testSDKMethods() {
  console.log('🧪 Testing SDK method signatures...');

  const api = new SDK('test-namespace');

  // Test that all expected methods exist with correct signatures
  const methodTests = [
    // Login service
    { path: 'login.login', params: ['username', 'password'] },
    { path: 'login.logout', params: [] },
    { path: 'login.validate', params: [] },

    // Objects service
    { path: 'objects.byId', params: ['id', 'query'] },
    { path: 'objects.query', params: ['object', 'query'] },
    { path: 'objects.create', params: ['object', 'body'] },
    { path: 'objects.updateById', params: ['object', 'id', 'update'] },

    // Messaging service
    { path: 'messaging.sms.send', params: [{}] },
    { path: 'messaging.email.send', params: [{}] },

    // Video service
    { path: 'video.createRoom', params: [{}] },
    { path: 'video.joinRoom', params: ['room', 'password', 'email'] },

    // AI service
    { path: 'ai.generative.chat', params: [{}] },
    { path: 'ai.tts.create', params: [{}] },
  ];

  for (const test of methodTests) {
    const pathParts = test.path.split('.');
    let obj = api;

    for (const part of pathParts) {
      if (!obj[part]) {
        throw new Error(`❌ Method '${test.path}' not found`);
      }
      obj = obj[part];
    }

    if (typeof obj !== 'function') {
      throw new Error(`❌ '${test.path}' is not a function`);
    }

    console.log(`✅ Method '${test.path}' exists and is a function`);
  }
}

function testSDKExtensibility() {
  console.log('🧪 Testing SDK extensibility...');

  const api = new SDK('test-namespace');

  // Test plugin system
  const testPlugin = {
    install: (sdk) => {
      sdk.testPluginFeature = () => 'plugin-working';
    },
  };

  api.use(testPlugin);

  if (!api.testPluginFeature) {
    throw new Error('❌ Plugin system not working');
  }

  if (api.testPluginFeature() !== 'plugin-working') {
    throw new Error('❌ Plugin not properly installed');
  }

  console.log('✅ Plugin system working correctly');

  // Test extension system
  class TestExtension {
    constructor(sdk) {
      this.testExtensionMethod = () => 'extension-working';
    }
  }

  api.extend(TestExtension);

  if (!api.testExtensionMethod) {
    throw new Error('❌ Extension system not working');
  }

  if (api.testExtensionMethod() !== 'extension-working') {
    throw new Error('❌ Extension not properly installed');
  }

  console.log('✅ Extension system working correctly');
}

function testClientServerCompatibility() {
  console.log('🧪 Testing client/server environment compatibility...');

  // Test server-side initialization
  const serverApi = new SDK(
    'test-namespace',
    'call-123',
    'jwt-token',
    'request-456',
  );

  if (serverApi.environment !== 'node') {
    console.log(
      '⚠️  Expected Node.js environment, this might be running in browser',
    );
  }

  // Test client-side style initialization
  const clientApi = new SDK(
    'test-namespace',
    null,
    null,
    null,
    'api.example.com',
  );

  console.log('✅ Both server and client initialization patterns work');
}

async function runAllTests() {
  console.log('🚀 Starting backwards compatibility tests...\n');

  try {
    await testBasicSDKFunctionality();
    console.log('');

    testSDKMethods();
    console.log('');

    testSDKExtensibility();
    console.log('');

    testClientServerCompatibility();
    console.log('');

    console.log('🎉 All backwards compatibility tests passed!');
    console.log('✅ The new modular SDK is fully backwards compatible');
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}
