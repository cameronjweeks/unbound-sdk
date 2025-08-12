/* eslint-disable indent */
/* eslint-disable prettier/prettier */

import { BaseSDK } from './base.js';
import { LoginService } from './services/login.js';
import { ObjectsService } from './services/objects.js';
import { MessagingService } from './services/messaging.js';
import { VideoService } from './services/video.js';
import { VoiceService } from './services/voice.js';
import { AIService } from './services/ai.js';
import { LookupService } from './services/lookup.js';
import { LayoutsService } from './services/layouts.js';
import { SubscriptionsService } from './services/subscriptions.js';
import { WorkflowsService } from './services/workflows.js';
import { NotesService } from './services/notes.js';
import { StorageService } from './services/storage.js';
import { VerificationService } from './services/verification.js';
import { PortalsService } from './services/portals.js';
import { SipEndpointsService } from './services/sipEndpoints.js';
import { ExternalOAuthService } from './services/externalOAuth.js';
import { GoogleCalendarService } from './services/googleCalendar.js';
import { EnrollService } from './services/enroll.js';
import { PhoneNumbersService } from './services/phoneNumbers.js';
import { RecordTypesService } from './services/recordTypes.js';
import { GenerateIdService } from './services/generateId.js';

class UnboundSDK extends BaseSDK {
  constructor(options = {}) {
    // Support both object and legacy positional parameters for backwards compatibility
    if (typeof options === 'string') {
      // Legacy positional parameters: (namespace, callId, token, fwRequestId, url, socketStore)
      const namespace = options;
      const callId = arguments[1];
      const token = arguments[2];
      const fwRequestId = arguments[3];
      const url = arguments[4];
      const socketStore = arguments[5];
      
      super({ namespace, callId, token, fwRequestId });
      
      // Handle client-side specific parameters
      if (url) {
        this.baseUrl = url;
        this._initializeEnvironment();
      }
      
      if (socketStore) {
        this.socketStore = socketStore;
      }
    } else {
      // New object-based parameters
      const { namespace, callId, token, fwRequestId, url, socketStore } = options;
      
      super({ namespace, callId, token, fwRequestId });
      
      // Handle client-side specific parameters
      if (url) {
        this.baseUrl = url;
        this._initializeEnvironment();
      }
      
      if (socketStore) {
        this.socketStore = socketStore;
      }
    }
    
    // Initialize all service modules
    this.login = new LoginService(this);
    this.objects = new ObjectsService(this);
    this.messaging = new MessagingService(this);
    this.video = new VideoService(this);
    this.voice = new VoiceService(this);
    this.ai = new AIService(this);
    this.lookup = new LookupService(this);
    this.layouts = new LayoutsService(this);
    this.subscriptions = new SubscriptionsService(this);
    this.workflows = new WorkflowsService(this);
    this.notes = new NotesService(this);
    this.storage = new StorageService(this);
    this.verification = new VerificationService(this);
    this.portals = new PortalsService(this);
    this.sipEndpoints = new SipEndpointsService(this);
    this.externalOAuth = new ExternalOAuthService(this);
    this.googleCalendar = new GoogleCalendarService(this);
    this.enroll = new EnrollService(this);
    this.phoneNumbers = new PhoneNumbersService(this);
    this.recordTypes = new RecordTypesService(this);
    this.generateId = new GenerateIdService(this);
    
    // Add additional services that might be missing
    this._initializeAdditionalServices();
  }

  _initializeAdditionalServices() {
    // Placeholder for additional services that might be discovered
    // This will be populated as we find missing APIs
  }

  // Extension method for plugins (internal SDK, transport plugins, etc.)
  use(plugin) {
    if (typeof plugin === 'function') {
      plugin(this);
    } else if (plugin && typeof plugin.install === 'function') {
      plugin.install(this);
    } else {
      throw new Error('Plugin must be a function or have an install method');
    }
    return this;
  }

  extend(extension) {
    if (typeof extension === 'function') {
      // Extension is a class constructor
      const instance = new extension(this);
      
      // Merge extension methods/properties into this SDK
      for (const key in instance) {
        if (instance.hasOwnProperty(key) && typeof instance[key] !== 'undefined') {
          this[key] = instance[key];
        }
      }
    } else if (typeof extension === 'object') {
      // Extension is an object with methods
      Object.assign(this, extension);
    } else {
      throw new Error('Extension must be a class constructor or object');
    }
    return this;
  }

  // Transport plugin methods
  addTransport(transport) {
    super.addTransport(transport);
    return this;
  }

  removeTransport(name) {
    super.removeTransport(name);
    return this;
  }

  // Backwards compatibility helper methods
  async buildMasterAuth({ namespace, accountId, userId }) {
    // This method should only be available in Node.js environment
    // and will be added via internal SDK extension
    throw new Error('buildMasterAuth is only available with the internal SDK extension. Please use: sdk.use(InternalExtension)');
  }
}

// Export both the class and a factory function for convenience
export default UnboundSDK;
export { UnboundSDK };

// Factory function for common usage patterns
export function createSDK(options = {}) {
  return new UnboundSDK(options);
}

// Re-export service classes for advanced usage
export { LoginService } from './services/login.js';
export { ObjectsService } from './services/objects.js';
export { MessagingService } from './services/messaging.js';
export { VideoService } from './services/video.js';
export { VoiceService } from './services/voice.js';
export { AIService } from './services/ai.js';
export { LookupService } from './services/lookup.js';
export { LayoutsService } from './services/layouts.js';
export { SubscriptionsService } from './services/subscriptions.js';
export { WorkflowsService } from './services/workflows.js';
export { NotesService } from './services/notes.js';
export { StorageService } from './services/storage.js';
export { VerificationService } from './services/verification.js';
export { PortalsService } from './services/portals.js';
export { SipEndpointsService } from './services/sipEndpoints.js';
export { ExternalOAuthService } from './services/externalOAuth.js';
export { GoogleCalendarService } from './services/googleCalendar.js';
export { EnrollService } from './services/enroll.js';
export { PhoneNumbersService, PhoneNumberCarrierService } from './services/phoneNumbers.js';
export { RecordTypesService, UserRecordTypeDefaultsService } from './services/recordTypes.js';
export { GenerateIdService } from './services/generateId.js';
export { BaseSDK } from './base.js';