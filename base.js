/* eslint-disable indent */
/* eslint-disable prettier/prettier */

/*
 * Base SDK Class with Transport Plugin System
 * 
 * Optional Dependencies:
 * - mime-types: For accurate MIME type detection (automatically imported if available)
 *
 * This package is optional and the SDK will gracefully fall back to built-in MIME type
 * detection if not installed. For best MIME type accuracy, it's recommended to install:
 *
 * npm install mime-types
 */

export class BaseSDK {
  constructor(options = {}) {
    // Support both object and legacy positional parameters for backwards compatibility
    if (typeof options === 'string') {
      // Legacy positional parameters: (namespace, callId, token, fwRequestId)
      this.namespace = options || process?.env?.namespace;
      this.callId = arguments[1];
      this.token = arguments[2];
      this.fwRequestId = arguments[3];
    } else {
      // New object-based parameters
      const { namespace, callId, token, fwRequestId } = options;
      this.namespace = namespace || process?.env?.namespace;
      this.callId = callId;
      this.token = token;
      this.fwRequestId = fwRequestId;
    }
    
    this.transports = new Map();
    this._initializeEnvironment();
  }

  _initializeEnvironment() {
    const defaultDomain = 'api.unbound.cx';
    
    if (typeof window === 'undefined') {
      // Server-side (Node.js)
      this.environment = 'node';
      this.baseURL = `https://${this.namespace ? this.namespace : 'login'}.${
        process.env?.API_BASE_URL || defaultDomain
      }`;
    } else {
      // Client-side (browser)
      this.environment = 'browser';
      this.baseUrl = this.baseUrl || process?.env?.API_BASE_URL || defaultDomain;
      if (this.baseUrl && !this.baseUrl.startsWith('api.')) {
        this.baseUrl = `api.${this.baseUrl}`;
      }
      this.setNamespace(this.namespace);
    }
  }

  setToken(token) {
    this.token = token;
  }

  setNamespace(namespace) {
    this.namespace = namespace;
    const defaultDomain = 'api.unbound.cx';
    
    if (this.environment === 'node') {
      this.baseURL = `https://${this.namespace ? this.namespace : 'login'}.${
        process.env?.API_BASE_URL || defaultDomain
      }`;
    } else {
      this.fullUrl = `https://${this.namespace}.${this.baseUrl}`;
    }
  }

  addTransport(transport) {
    if (!transport || typeof transport.request !== 'function') {
      throw new Error('Transport must have a request method');
    }
    
    const priority = transport.getPriority ? transport.getPriority() : 50;
    const name = transport.name || `transport_${Date.now()}`;
    
    this.transports.set(name, {
      transport,
      priority
    });
  }

  removeTransport(name) {
    this.transports.delete(name);
  }

  async _getAvailableTransport(forceFetch = false) {
    if (forceFetch) {
      return null; // Use built-in HTTP
    }

    // Sort transports by priority (lower number = higher priority)
    const sortedTransports = Array.from(this.transports.values())
      .sort((a, b) => a.priority - b.priority);

    for (const { transport } of sortedTransports) {
      try {
        if (transport.isAvailable && await transport.isAvailable()) {
          return transport;
        }
      } catch (err) {
        console.debug(`Transport ${transport.name} not available:`, err.message);
        continue;
      }
    }

    return null; // Fall back to HTTP
  }

  validateParams(params, schema) {
    for (const key in schema) {
      if (params[key] === undefined && schema[key].required) {
        throw new Error(`Missing required parameter ${key}`);
      }

      if (params[key] !== undefined) {
        const expectedType = schema[key].type;
        const actualValue = params[key];
        let isValidType = false;

        if (expectedType === 'array') {
          isValidType = Array.isArray(actualValue);
        } else {
          isValidType = typeof actualValue === expectedType;
        }

        if (!isValidType) {
          const actualType = Array.isArray(actualValue)
            ? 'array'
            : typeof actualValue;
          throw new Error(
            `Invalid type for parameter ${key}: expected ${expectedType}, got ${actualType}`,
          );
        }
      }
    }
  }

  async _fetch(endpoint, method, params = {}, forceFetch = false) {
    const { body, query, headers = {} } = params;

    this.validateParams(
      { endpoint, method, body, query, headers },
      {
        endpoint: { type: 'string', required: true },
        method: { type: 'string', required: true },
        body: { type: 'object', required: false },
        query: { type: 'object', required: false },
        headers: { type: 'object', required: false },
      },
    );

    // Try transport plugins first
    const transport = await this._getAvailableTransport(forceFetch);
    if (transport) {
      try {
        const result = await transport.request(endpoint, method, params, {
          namespace: this.namespace,
          token: this.token,
          callId: this.callId,
          fwRequestId: this.fwRequestId,
          baseURL: this.baseURL || this.fullUrl,
        });
        return result;
      } catch (err) {
        console.warn(`Transport ${transport.name} failed, falling back to HTTP:`, err.message);
        // Fall through to HTTP
      }
    }

    // Built-in HTTP transport (fallback)
    return this._httpRequest(endpoint, method, params);
  }

  async _httpRequest(endpoint, method, params = {}) {
    const { body, query, headers = {} } = params;
    
    const options = {
      method,
      headers: {
        // Only set Content-Type if not already provided (check both cases)
        ...(headers?.['Content-Type'] || headers?.['content-type']
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...headers,
      },
    };

    // Add auth headers
    if (this.token) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }
    if (this.fwRequestId) {
      options.headers['x-request-id-fw'] = this.fwRequestId;
    }
    if (this.callId) {
      options.headers['x-call-id'] = this.callId;
    }

    // Set credentials for browser environment
    if (this.environment === 'browser') {
      options.credentials = 'include';
    }

    let url;
    if (this.environment === 'node') {
      url = `${this.baseURL}${endpoint}`;
    } else {
      url = `${this.fullUrl}${endpoint}`;
    }

    // Add query parameters
    if (query) {
      const params = new URLSearchParams(query).toString();
      url += `?${params}`;
    }

    // Handle body
    if (options.method.toLowerCase() === 'get') {
      delete options.body;
    } else if (body) {
      // For FormData or Buffer, pass directly without JSON.stringify
      const isFormData =
        body &&
        (body.constructor.name === 'FormData' ||
          typeof body.getBoundary === 'function');
      const isBuffer = Buffer && Buffer.isBuffer && Buffer.isBuffer(body);

      if (isFormData || isBuffer) {
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, options);
    const bodyResponse = await response.json();

    const responseHeaders = response.headers;
    const responseRequestId =
      responseHeaders?.get?.('x-request-id') ||
      responseHeaders?.['x-request-id'];

    if (!response.ok) {
      throw {
        name: `API :: Error :: https :: ${method} :: ${endpoint} :: ${responseRequestId} :: ${response?.status} :: ${response?.statusText}`,
        message: bodyResponse?.message || `API Error occured.`,
        method,
        endpoint,
        status: response?.status,
        statusText: response?.statusText,
      };
    }
    
    console.log(
      `API :: https :: ${method} :: ${endpoint} :: ${responseRequestId}`,
    );
    return bodyResponse;
  }
}