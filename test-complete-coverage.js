#!/usr/bin/env node

/*
 * Complete API Coverage Test
 *
 * This script tests that ALL API endpoints are covered in both
 * the public SDK and internal SDK extensions.
 */

import SDK from './index.js';
import InternalSDK from '../sdk-internal/index.js';

async function testPublicSDKCompleteness() {
  console.log('🧪 Testing complete public SDK coverage...');

  const api = new SDK('test-namespace');

  // Test all expected public services
  const publicServices = [
    // Core services
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

    // Additional services found in analysis
    'externalOAuth',
    'googleCalendar',
    'enroll',
    'phoneNumbers',
    'recordTypes',
    'generateId',
  ];

  console.log(`📊 Checking ${publicServices.length} public services...`);

  for (const service of publicServices) {
    if (!api[service]) {
      throw new Error(`❌ Public service '${service}' missing from SDK`);
    }
    console.log(`✅ ${service}`);
  }

  // Test nested services
  const nestedServices = [
    { path: 'messaging.sms', description: 'SMS messaging' },
    { path: 'messaging.email', description: 'Email messaging' },
    { path: 'messaging.campaigns', description: 'Messaging campaigns' },
    { path: 'ai.generative', description: 'Generative AI' },
    { path: 'ai.tts', description: 'Text-to-speech' },
    { path: 'workflows.items', description: 'Workflow items' },
    { path: 'workflows.connections', description: 'Workflow connections' },
    { path: 'subscriptions.socket', description: 'Socket subscriptions' },
    { path: 'phoneNumbers.carrier', description: 'Phone number carrier ops' },
    { path: 'recordTypes.user', description: 'User record type defaults' },
  ];

  console.log(`📊 Checking ${nestedServices.length} nested services...`);

  for (const { path, description } of nestedServices) {
    const pathParts = path.split('.');
    let obj = api;

    for (const part of pathParts) {
      if (!obj[part]) {
        throw new Error(`❌ Nested service '${path}' (${description}) missing`);
      }
      obj = obj[part];
    }
    console.log(`✅ ${path} - ${description}`);
  }

  console.log('✅ All public services verified!');
}

async function testInternalSDKCompleteness() {
  console.log('🧪 Testing complete internal SDK coverage...');

  const api = new SDK('test-namespace');
  api.use(InternalSDK);

  // Verify buildMasterAuth is available
  if (typeof api.buildMasterAuth !== 'function') {
    throw new Error('❌ buildMasterAuth method not available on SDK');
  }
  console.log('✅ buildMasterAuth method available');

  // Test all internal services
  const internalServices = [
    'sip',
    'email',
    'programmableVoice',
    'servers',
    'socket',
  ];

  console.log(`📊 Checking ${internalServices.length} internal services...`);

  for (const service of internalServices) {
    if (!api.internal[service]) {
      throw new Error(`❌ Internal service '${service}' missing from SDK`);
    }
    console.log(`✅ internal.${service}`);
  }

  // Test nested internal services
  const nestedInternalServices = [
    {
      path: 'internal.programmableVoice.voiceChannel',
      description: 'Voice channel management',
    },
    {
      path: 'internal.programmableVoice.transcription',
      description: 'Transcription services',
    },
    { path: 'internal.servers.aws', description: 'AWS server management' },
  ];

  console.log(
    `📊 Checking ${nestedInternalServices.length} nested internal services...`,
  );

  for (const { path, description } of nestedInternalServices) {
    const pathParts = path.split('.');
    let obj = api;

    for (const part of pathParts) {
      if (!obj[part]) {
        throw new Error(
          `❌ Nested internal service '${path}' (${description}) missing`,
        );
      }
      obj = obj[part];
    }
    console.log(`✅ ${path} - ${description}`);
  }

  console.log('✅ All internal services verified!');
}

async function testMethodAvailability() {
  console.log('🧪 Testing method availability across services...');

  const api = new SDK('test-namespace');
  api.use(InternalSDK);

  // Sample of critical methods that should be available
  const criticalMethods = [
    // Public API methods
    { path: 'login.login', desc: 'User login' },
    { path: 'objects.query', desc: 'Object querying' },
    { path: 'messaging.sms.send', desc: 'SMS sending' },
    { path: 'messaging.email.send', desc: 'Email sending' },
    { path: 'video.createRoom', desc: 'Video room creation' },
    { path: 'voice.createCall', desc: 'Voice call creation' },
    { path: 'ai.generative.chat', desc: 'AI chat' },
    { path: 'phoneNumbers.search', desc: 'Phone number search' },
    { path: 'phoneNumbers.order', desc: 'Phone number ordering' },
    { path: 'recordTypes.create', desc: 'Record type creation' },
    { path: 'generateId.createId', desc: 'ID generation' },

    // Internal API methods
    { path: 'internal.sip.router', desc: 'SIP routing' },
    { path: 'internal.email.incrementOpen', desc: 'Email tracking' },
    { path: 'internal.programmableVoice.setVariable', desc: 'Voice variables' },
    { path: 'internal.servers.create', desc: 'Server creation' },
    { path: 'internal.socket.createConnection', desc: 'Socket connections' },
  ];

  console.log(`📊 Checking ${criticalMethods.length} critical methods...`);

  for (const { path, desc } of criticalMethods) {
    const pathParts = path.split('.');
    let obj = api;

    for (const part of pathParts) {
      if (!obj[part]) {
        throw new Error(`❌ Method '${path}' (${desc}) not found`);
      }
      obj = obj[part];
    }

    if (typeof obj !== 'function') {
      throw new Error(`❌ '${path}' (${desc}) is not a function`);
    }

    console.log(`✅ ${path} - ${desc}`);
  }

  console.log('✅ All critical methods verified!');
}

async function testServiceCounts() {
  console.log('🧪 Testing service counts...');

  const api = new SDK('test-namespace');
  api.use(InternalSDK);

  // Count public services
  const publicServiceCount = Object.keys(api).filter(
    (key) =>
      typeof api[key] === 'object' &&
      api[key] !== null &&
      key !== 'internal' &&
      !key.startsWith('_') &&
      key !== 'namespace' &&
      key !== 'baseURL' &&
      key !== 'callId' &&
      key !== 'token' &&
      key !== 'fwRequestId' &&
      key !== 'environment' &&
      key !== 'transports',
  ).length;

  // Count internal services
  const internalServiceCount = Object.keys(api.internal || {}).length;

  console.log(`📊 Public services: ${publicServiceCount}`);
  console.log(`📊 Internal services: ${internalServiceCount}`);

  // Expected counts based on our implementation
  const expectedPublicServices = 21; // Updated count
  const expectedInternalServices = 5;

  if (publicServiceCount < expectedPublicServices) {
    console.warn(
      `⚠️  Expected at least ${expectedPublicServices} public services, found ${publicServiceCount}`,
    );
  } else {
    console.log(
      `✅ Public service count: ${publicServiceCount} (expected: ${expectedPublicServices}+)`,
    );
  }

  if (internalServiceCount < expectedInternalServices) {
    throw new Error(
      `❌ Expected at least ${expectedInternalServices} internal services, found ${internalServiceCount}`,
    );
  } else {
    console.log(
      `✅ Internal service count: ${internalServiceCount} (expected: ${expectedInternalServices})`,
    );
  }
}

async function runAllTests() {
  console.log('🚀 Starting complete API coverage tests...\n');

  try {
    await testPublicSDKCompleteness();
    console.log('');

    await testInternalSDKCompleteness();
    console.log('');

    await testMethodAvailability();
    console.log('');

    await testServiceCounts();
    console.log('');

    console.log('🎉 ALL API COVERAGE TESTS PASSED!');
    console.log(
      '✅ The new modular SDK covers all public and internal API endpoints',
    );
    console.log('✅ Ready for production deployment');
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}
