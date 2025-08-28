export class SipEndpointsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({ username, password, domain, displayName, description }) {
    this.sdk.validateParams(
      { username, password, domain },
      {
        username: { type: 'string', required: true },
        password: { type: 'string', required: true },
        domain: { type: 'string', required: true },
        displayName: { type: 'string', required: false },
        description: { type: 'string', required: false },
      },
    );

    const endpointData = { username, password, domain };
    if (displayName) endpointData.displayName = displayName;
    if (description) endpointData.description = description;

    const params = {
      body: endpointData,
    };

    const result = await this.sdk._fetch('/sipEndpoints', 'POST', params);
    return result;
  }

  async getWebRtcDetails() {
    const params = {};
    const result = await this.sdk._fetch('/sipEndpoints', 'GET', params, true);
    return result;
  }

  async getUsersWebRtc() {
    const result = await this.sdk._fetch('/sipEndpoints/users/webrtc', 'GET');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/sipEndpoints/list', 'GET');
    return result;
  }

  async get(endpointId) {
    this.sdk.validateParams(
      { endpointId },
      {
        endpointId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/sipEndpoints/${endpointId}`, 'GET');
    return result;
  }

  async update(endpointId, { displayName, description, enabled }) {
    this.sdk.validateParams(
      { endpointId },
      {
        endpointId: { type: 'string', required: true },
        displayName: { type: 'string', required: false },
        description: { type: 'string', required: false },
        enabled: { type: 'boolean', required: false },
      },
    );

    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (description) updateData.description = description;
    if (enabled !== undefined) updateData.enabled = enabled;

    const params = {
      body: updateData,
    };

    const result = await this.sdk._fetch(
      `/sipEndpoints/${endpointId}`,
      'PUT',
      params,
    );
    return result;
  }

  async delete(endpointId) {
    this.sdk.validateParams(
      { endpointId },
      {
        endpointId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/sipEndpoints/${endpointId}`,
      'DELETE',
    );
    return result;
  }
}
