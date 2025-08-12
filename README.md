# Unbound JavaScript SDK

[![npm version](https://badge.fury.io/js/%40unbound%2Fsdk.svg)](https://badge.fury.io/js/%40unbound%2Fsdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official JavaScript SDK for Unbound's comprehensive communication and AI platform. This SDK provides easy access to messaging (SMS/Email), voice calling, video conferencing, AI services, workflows, and data management capabilities.

## Features

- 🚀 **Universal**: Works in Node.js and browsers
- 📱 **Messaging**: SMS/MMS and Email with templates and campaigns
- 📞 **Voice**: Call management, conferencing, recording, transcription
- 📹 **Video**: Video conferencing with advanced controls
- 🤖 **AI**: Generative AI chat and text-to-speech
- 💾 **Data**: Object management with queries and relationships  
- 🔄 **Workflows**: Programmable workflow execution
- 🔌 **Extensible**: Plugin system for transports and extensions
- ⚡ **Performance**: Automatic transport optimization (NATS/Socket/HTTP)

## Installation

```bash
npm install @unboundcx/sdk
```

### Optional Dependencies

For enhanced functionality, you may also install:

```bash
# For Socket.io transport (browser environments)
npm install socket.io-client

# For improved MIME type detection
npm install mime-types
```

## Quick Start

### Basic Usage

```javascript
import SDK from '@unboundcx/sdk';

// Initialize the SDK
const api = new SDK({
  namespace: 'your-namespace',
  token: 'your-jwt-token'
});

// Or using legacy positional parameters (backwards compatible)  
const api = new SDK('your-namespace', null, 'your-jwt-token');

// Login (gets JWT token)
const login = await api.login.login('username', 'password');

// Send SMS
const sms = await api.messaging.sms.send({
  from: '+1234567890',
  to: '+0987654321', 
  message: 'Hello from Unbound!'
});

// Create video meeting
const meeting = await api.video.createRoom({
  name: 'Team Meeting',
  startTime: '2024-01-15T10:00:00Z',
  duration: 60
});
```

### Client-Side Usage (Browser/Svelte)

```javascript
import SDK from '@unboundcx/sdk';
import { socketAppStore } from './stores/socket.js';

// Initialize for browser usage
const api = new SDK({
  namespace: 'your-namespace',
  socketStore: socketAppStore  // Optional: for optimized WebSocket transport
});

// The SDK automatically connects to your-namespace.api.unbound.cx
const objects = await api.objects.query('contacts', { 
  limit: 10,
  orderBy: 'createdAt'
});
```

### Server-Side Usage (Node.js)

```javascript
import SDK from '@unboundcx/sdk';

// Initialize for server-side usage  
const api = new SDK({
  namespace: 'your-namespace',
  token: 'jwt-token',
  callId: 'call-id'          // Optional: for request tracking
});

// Automatically connects to your-namespace.api.unbound.cx
const result = await api.objects.create('leads', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});
```

## Constructor Options

The SDK constructor supports both object-based and legacy positional parameters:

### Object-Based Constructor (Recommended)

```javascript
const api = new SDK({
  namespace: 'your-namespace',    // Required: Your Unbound namespace
  token: 'jwt-token',             // Optional: JWT authentication token
  callId: 'call-123',             // Optional: Call tracking ID
  fwRequestId: 'request-456',     // Optional: Request forwarding ID
  socketStore: socketAppStore     // Optional: Socket.io store (browser only)
});
```

### Legacy Positional Constructor (Backwards Compatible)

```javascript
const api = new SDK(
  'your-namespace',    // namespace
  'call-123',          // callId  
  'jwt-token',         // token
  'request-456'        // fwRequestId
);
```

### Factory Function

```javascript
import { createSDK } from '@unboundcx/sdk';

const api = createSDK({
  namespace: 'your-namespace',
  token: 'jwt-token'
});
```

## API Reference

### Core Services

#### Authentication (`api.login`)
```javascript
// Login and get session
await api.login.login('username', 'password');
await api.login.logout();
await api.login.validate();
await api.login.changePassword('current', 'new');
```

#### Objects (`api.objects`) 
```javascript
// CRUD operations on data objects
await api.objects.create('contacts', { name: 'John', email: 'john@example.com' });
await api.objects.query('contacts', { limit: 10 });
await api.objects.byId('contact-123');
await api.objects.updateById('contacts', 'contact-123', { name: 'Jane' });
await api.objects.deleteById('contacts', 'contact-123');
await api.objects.describe('contacts'); // Get schema
await api.objects.list(); // List all object types
```

#### Messaging (`api.messaging`)
```javascript
// SMS/MMS
await api.messaging.sms.send({
  from: '+1234567890',
  to: '+0987654321',
  message: 'Hello!',
  mediaUrls: ['https://example.com/image.jpg']
});

// Email  
await api.messaging.email.send({
  from: 'sender@example.com',
  to: 'recipient@example.com', 
  subject: 'Hello',
  htmlBody: '<h1>Hello World!</h1>'
});

// Templates
await api.messaging.sms.templates.create({
  name: 'welcome',
  message: 'Welcome {{name}}!',
  variables: { name: 'string' }
});

// Campaign Management
await api.messaging.campaigns.tollFree.create({
  companyName: 'Acme Corp',
  phoneNumber: '+1234567890',
  description: 'Marketing campaign'
});
```

#### Video Conferencing (`api.video`)
```javascript
// Room Management
const room = await api.video.createRoom({
  name: 'Team Meeting',
  password: 'secret123',
  startTime: '2024-01-15T10:00:00Z',
  waitingRoom: true,
  hosts: ['user@example.com']
});

// Join meeting
await api.video.joinRoom(room.id, 'password', 'user@example.com');

// Participant controls
await api.video.mute(room.id, 'participant-id', 'microphone', true);
await api.video.removeParticipant(room.id, 'participant-id');

// Analytics
const analytics = await api.video.getMeetingAnalytics(room.id, {
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T11:00:00Z'
});
```

#### Voice Calling (`api.voice`)
```javascript
// Make calls
const call = await api.voice.createCall({
  to: '+1234567890',
  from: '+0987654321',
  record: true,
  transcribe: true
});

// Call controls
await api.voice.mute(call.callControlId);
await api.voice.hold(call.callControlId);
await api.voice.sendDtmf(call.callControlId, '1234');
await api.voice.transfer(call.callControlId, '+1555555555');
await api.voice.hangup(call.callControlId);

// Conference calls
const conference = await api.voice.createConference({ name: 'Team Call' });
await api.voice.joinConference(call.callControlId, conference.id);
```

#### AI Services (`api.ai`)
```javascript
// Generative AI
const response = await api.ai.generative.chat({
  messages: [{ role: 'user', content: 'Hello AI!' }],
  model: 'gpt-4',
  temperature: 0.7,
  method: 'openai'
});

// Text-to-Speech
const audio = await api.ai.tts.create({
  text: 'Hello, this is a test message',
  voice: 'en-US-Standard-A',
  audioEncoding: 'MP3'
});
```

### Utility Services

#### File Storage (`api.storage`)
```javascript
// Upload files
const files = await api.storage.uploadFiles(fileData, {
  classification: 'documents',
  isPublic: false,
  expireAfter: '30d'
});

// Get files
const fileUrl = api.storage.getFileUrl(files[0].storageId);
await api.storage.deleteFile(files[0].storageId);
```

#### Workflows (`api.workflows`)
```javascript
// Workflow items
await api.workflows.items.create({
  workflowVersionId: 'wf-123',
  category: 'communication',
  type: 'sendEmail',
  settings: { template: 'welcome' }
});

// Connections
await api.workflows.connections.create({
  workflowItemId: 'item-1',
  workflowItemPortId: 'output',
  inWorkflowItemId: 'item-2', 
  inWorkflowItemPortId: 'input'
});
```

## Transport Plugins

The SDK automatically optimizes transport based on environment:

- **Node.js**: NATS → HTTP fallback
- **Browser**: WebSocket → HTTP fallback  
- **Always available**: HTTP fetch

### Custom Transports

```javascript
import SDK from '@unboundcx/sdk';

class CustomTransport {
  constructor(config) {
    this.config = config;
    this.name = 'custom';
  }
  
  getPriority() { return 10; } // Lower = higher priority
  
  async isAvailable() {
    return true; // Check if transport is ready
  }
  
  async request(endpoint, method, params, options) {
    // Custom transport logic
    return response;
  }
}

const api = new SDK({ namespace: 'namespace', token: 'token' });
api.addTransport(new CustomTransport({}));
```

## Extensions

### Custom Extensions

```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({ namespace: 'namespace' });

// Add custom functionality via extensions
api.extend({
  customMethod: function() {
    return this.objects.query('custom', {});
  }
});

// Use custom method
await api.customMethod();
```

## Environment Support

### Node.js
```javascript
import SDK from '@unboundcx/sdk';

// Automatic environment detection
const api = new SDK({ namespace: process.env.UNBOUND_NAMESPACE });
```

### Browser/Webpack
```javascript
import SDK from '@unboundcx/sdk';

const api = new SDK({
  namespace: 'your-namespace'
});
// Automatically connects to your-namespace.api.unbound.cx
```

### Svelte
```javascript
import SDK from '@unboundcx/sdk';
import { socketAppStore } from '$lib/stores/socket.js';

const api = new SDK({
  namespace: 'your-namespace',
  socketStore: socketAppStore  // Enables WebSocket transport
});
// Automatically connects to your-namespace.api.unbound.cx
```

## Error Handling

```javascript
try {
  await api.messaging.sms.send({ to: 'invalid' });
} catch (error) {
  console.log(error.name);    // 'API :: Error :: https :: POST :: /messaging/sms :: ...'
  console.log(error.message); // 'Invalid phone number format'
  console.log(error.status);  // 400
  console.log(error.method);  // 'POST'
  console.log(error.endpoint); // '/messaging/sms'
}
```

## TypeScript Support

The SDK includes TypeScript definitions:

```typescript
import SDK, { MessagingService, VideoService } from '@unboundcx/sdk';

const api: SDK = new SDK({ namespace: 'namespace', token: 'token' });

// Full type safety
const sms: any = await api.messaging.sms.send({
  from: '+1234567890',
  to: '+0987654321', 
  message: 'Hello TypeScript!'
});
```

## Development

### Setup
```bash
git clone https://github.com/unbound/sdk-js.git
cd sdk-js
npm install
```

### Testing
```bash
npm test                # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests
npm run test:watch      # Watch mode
```

### Building
```bash
npm run build           # Build for production
npm run lint            # Check code style
npm run docs            # Generate documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://docs.unbound.cx/sdk)
- 🐛 [Issue Tracker](https://github.com/unbound/sdk-js/issues)
- 💬 [Community Forum](https://community.unbound.cx)
- 📧 [Email Support](mailto:support@unbound.cx)