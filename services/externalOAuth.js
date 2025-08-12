export class ExternalOAuthService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({ name, provider, scopes, credentials, configuration }) {
    this.sdk.validateParams(
      { name, provider, scopes },
      {
        name: { type: 'string', required: true },
        provider: { type: 'string', required: true },
        scopes: { type: 'array', required: true },
        credentials: { type: 'object', required: false },
        configuration: { type: 'object', required: false },
      },
    );

    const oauthData = { name, provider, scopes };
    if (credentials) oauthData.credentials = credentials;
    if (configuration) oauthData.configuration = configuration;

    const params = {
      body: oauthData,
    };

    const result = await this.sdk._fetch('/externalOAuth', 'POST', params);
    return result;
  }

  async update(id, { name, scopes, credentials, configuration }) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false },
        scopes: { type: 'array', required: false },
        credentials: { type: 'object', required: false },
        configuration: { type: 'object', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (scopes) updateData.scopes = scopes;
    if (credentials) updateData.credentials = credentials;
    if (configuration) updateData.configuration = configuration;

    const params = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/externalOAuth/${id}`, 'PUT', params);
    return result;
  }

  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/externalOAuth/${id}`, 'DELETE');
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/externalOAuth/${id}`, 'GET');
    return result;
  }

  async getByName(name) {
    this.sdk.validateParams(
      { name },
      {
        name: { type: 'string', required: true },
      },
    );

    const params = {
      query: { name },
    };

    const result = await this.sdk._fetch('/externalOAuth/byName', 'GET', params);
    return result;
  }

  async getByScopeAndProvider(scope, provider) {
    this.sdk.validateParams(
      { scope, provider },
      {
        scope: { type: 'string', required: true },
        provider: { type: 'string', required: true },
      },
    );

    const params = {
      query: { scope, provider },
    };

    const result = await this.sdk._fetch('/externalOAuth/byScopeAndProvider', 'GET', params);
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/externalOAuth', 'GET');
    return result;
  }
}