export class PortalsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({ name, domain, settings, isPublic, customCss, customJs, favicon, logo }) {
    this.sdk.validateParams(
      { name, domain },
      {
        name: { type: 'string', required: true },
        domain: { type: 'string', required: true },
        settings: { type: 'object', required: false },
        isPublic: { type: 'boolean', required: false },
        customCss: { type: 'string', required: false },
        customJs: { type: 'string', required: false },
        favicon: { type: 'string', required: false },
        logo: { type: 'string', required: false },
      },
    );

    const portalData = { name, domain };
    if (settings) portalData.settings = settings;
    if (isPublic !== undefined) portalData.isPublic = isPublic;
    if (customCss) portalData.customCss = customCss;
    if (customJs) portalData.customJs = customJs;
    if (favicon) portalData.favicon = favicon;
    if (logo) portalData.logo = logo;

    const params = {
      body: portalData,
    };

    const result = await this.sdk._fetch('/portals', 'POST', params);
    return result;
  }

  async update(portalId, { name, domain, settings, isPublic, customCss, customJs, favicon, logo }) {
    this.sdk.validateParams(
      { portalId },
      {
        portalId: { type: 'string', required: true },
        name: { type: 'string', required: false },
        domain: { type: 'string', required: false },
        settings: { type: 'object', required: false },
        isPublic: { type: 'boolean', required: false },
        customCss: { type: 'string', required: false },
        customJs: { type: 'string', required: false },
        favicon: { type: 'string', required: false },
        logo: { type: 'string', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (domain) updateData.domain = domain;
    if (settings) updateData.settings = settings;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (customCss) updateData.customCss = customCss;
    if (customJs) updateData.customJs = customJs;
    if (favicon) updateData.favicon = favicon;
    if (logo) updateData.logo = logo;

    const params = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/portals/${portalId}`, 'PUT', params);
    return result;
  }

  async delete(portalId) {
    this.sdk.validateParams(
      { portalId },
      {
        portalId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/portals/${portalId}`, 'DELETE');
    return result;
  }

  async get(portalId) {
    this.sdk.validateParams(
      { portalId },
      {
        portalId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/portals/${portalId}`, 'GET');
    return result;
  }

  async getPublic(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const params = {
      query: { domain },
    };

    const result = await this.sdk._fetch('/portals/public', 'GET', params);
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/portals', 'GET');
    return result;
  }

  async verifyDns(portalId) {
    this.sdk.validateParams(
      { portalId },
      {
        portalId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/portals/${portalId}/verify-dns`, 'POST');
    return result;
  }
}