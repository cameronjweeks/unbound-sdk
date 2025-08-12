export class MessagingService {
  constructor(sdk) {
    this.sdk = sdk;
    this.sms = new SmsService(sdk);
    this.email = new EmailService(sdk);
    this.campaigns = new CampaignsService(sdk);
  }
}

export class SmsService {
  constructor(sdk) {
    this.sdk = sdk;
    this.templates = new SmsTemplatesService(sdk);
  }

  async send({ 
    from, 
    to, 
    message, 
    templateId, 
    variables, 
    mediaUrls, 
    webhookUrl 
  }) {
    const messageData = {};
    if (from) messageData.from = from;
    if (message) messageData.message = message;
    if (templateId) messageData.templateId = templateId;
    if (variables) messageData.variables = variables;
    if (mediaUrls) messageData.mediaUrls = mediaUrls;
    if (webhookUrl) messageData.webhookUrl = webhookUrl;

    this.sdk.validateParams(
      { to, ...messageData },
      {
        to: { type: 'string', required: true },
        from: { type: 'string', required: false },
        message: { type: 'string', required: false },
        templateId: { type: 'string', required: false },
        variables: { type: 'object', required: false },
        mediaUrls: { type: 'array', required: false },
        webhookUrl: { type: 'string', required: false },
      },
    );

    const options = {
      body: { to, ...messageData },
    };

    const result = await this.sdk._fetch('/messaging/sms', 'POST', options);
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/sms/${id}`, 'GET');
    return result;
  }
}

export class SmsTemplatesService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({ name, message, variables }) {
    this.sdk.validateParams(
      { name, message },
      {
        name: { type: 'string', required: true },
        message: { type: 'string', required: true },
        variables: { type: 'object', required: false },
      },
    );

    const templateData = { name, message };
    if (variables) templateData.variables = variables;

    const options = {
      body: templateData,
    };

    const result = await this.sdk._fetch('/messaging/sms/templates', 'POST', options);
    return result;
  }

  async update(id, { name, message, variables }) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false },
        message: { type: 'string', required: false },
        variables: { type: 'object', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (message) updateData.message = message;
    if (variables) updateData.variables = variables;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/messaging/sms/templates/${id}`, 'PUT', options);
    return result;
  }

  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/sms/templates/${id}`, 'DELETE');
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/sms/templates/${id}`, 'GET');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/messaging/sms/templates', 'GET');
    return result;
  }
}

export class EmailService {
  constructor(sdk) {
    this.sdk = sdk;
    this.templates = new EmailTemplatesService(sdk);
    this.domains = new EmailDomainsService(sdk);
    this.addresses = new EmailAddressesService(sdk);
  }

  async send({ 
    from, 
    to, 
    cc, 
    bcc, 
    subject, 
    htmlBody, 
    textBody, 
    templateId, 
    variables, 
    attachments,
    replyTo,
    priority,
    tags
  }) {
    this.sdk.validateParams(
      { from, to, subject },
      {
        from: { type: 'string', required: true },
        to: { type: 'string', required: true },
        subject: { type: 'string', required: true },
        cc: { type: 'string', required: false },
        bcc: { type: 'string', required: false },
        htmlBody: { type: 'string', required: false },
        textBody: { type: 'string', required: false },
        templateId: { type: 'string', required: false },
        variables: { type: 'object', required: false },
        attachments: { type: 'array', required: false },
        replyTo: { type: 'string', required: false },
        priority: { type: 'string', required: false },
        tags: { type: 'array', required: false },
      },
    );

    const emailData = {
      from,
      to,
      subject,
    };

    if (cc) emailData.cc = cc;
    if (bcc) emailData.bcc = bcc;
    if (htmlBody) emailData.htmlBody = htmlBody;
    if (textBody) emailData.textBody = textBody;
    if (templateId) emailData.templateId = templateId;
    if (variables) emailData.variables = variables;
    if (attachments) emailData.attachments = attachments;
    if (replyTo) emailData.replyTo = replyTo;
    if (priority) emailData.priority = priority;
    if (tags) emailData.tags = tags;

    const options = {
      body: emailData,
    };

    const result = await this.sdk._fetch('/messaging/email', 'POST', options);
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/${id}`, 'GET');
    return result;
  }

  async updateDomain(domain, { dkimEnabled, customDkim }) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
        dkimEnabled: { type: 'boolean', required: false },
        customDkim: { type: 'object', required: false },
      },
    );

    const updateData = {};
    if (dkimEnabled !== undefined) updateData.dkimEnabled = dkimEnabled;
    if (customDkim) updateData.customDkim = customDkim;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/messaging/email/domain/${domain}`, 'PUT', options);
    return result;
  }
}

export class EmailTemplatesService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({ name, subject, htmlBody, textBody, variables }) {
    this.sdk.validateParams(
      { name, subject },
      {
        name: { type: 'string', required: true },
        subject: { type: 'string', required: true },
        htmlBody: { type: 'string', required: false },
        textBody: { type: 'string', required: false },
        variables: { type: 'object', required: false },
      },
    );

    const templateData = { name, subject };
    if (htmlBody) templateData.htmlBody = htmlBody;
    if (textBody) templateData.textBody = textBody;
    if (variables) templateData.variables = variables;

    const options = {
      body: templateData,
    };

    const result = await this.sdk._fetch('/messaging/email/templates', 'POST', options);
    return result;
  }

  async update(id, { name, subject, htmlBody, textBody, variables }) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false },
        subject: { type: 'string', required: false },
        htmlBody: { type: 'string', required: false },
        textBody: { type: 'string', required: false },
        variables: { type: 'object', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (subject) updateData.subject = subject;
    if (htmlBody) updateData.htmlBody = htmlBody;
    if (textBody) updateData.textBody = textBody;
    if (variables) updateData.variables = variables;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/messaging/email/templates/${id}`, 'PUT', options);
    return result;
  }

  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/templates/${id}`, 'DELETE');
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/templates/${id}`, 'GET');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/messaging/email/templates', 'GET');
    return result;
  }
}

export class EmailDomainsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const options = {
      body: { domain },
    };

    const result = await this.sdk._fetch('/messaging/email/domains', 'POST', options);
    return result;
  }

  async delete(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/domains/${domain}`, 'DELETE');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/messaging/email/domains', 'GET');
    return result;
  }

  async validateDns(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/domains/${domain}/validate`, 'POST');
    return result;
  }

  async checkStatus(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/domains/${domain}/status`, 'GET');
    return result;
  }

  async update(domain, { dkimEnabled, customDkim }) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
        dkimEnabled: { type: 'boolean', required: false },
        customDkim: { type: 'object', required: false },
      },
    );

    const updateData = {};
    if (dkimEnabled !== undefined) updateData.dkimEnabled = dkimEnabled;
    if (customDkim) updateData.customDkim = customDkim;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/messaging/email/domains/${domain}`, 'PUT', options);
    return result;
  }
}

export class EmailAddressesService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create(email) {
    this.sdk.validateParams(
      { email },
      {
        email: { type: 'string', required: true },
      },
    );

    const options = {
      body: { email },
    };

    const result = await this.sdk._fetch('/messaging/email/addresses', 'POST', options);
    return result;
  }

  async delete(email) {
    this.sdk.validateParams(
      { email },
      {
        email: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/addresses/${encodeURIComponent(email)}`, 'DELETE');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/messaging/email/addresses', 'GET');
    return result;
  }

  async checkStatus(email) {
    this.sdk.validateParams(
      { email },
      {
        email: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/email/addresses/${encodeURIComponent(email)}/status`, 'GET');
    return result;
  }
}

export class CampaignsService {
  constructor(sdk) {
    this.sdk = sdk;
    this.tollFree = new TollFreeCampaignsService(sdk);
    this.tenDlc = new TenDlcCampaignsService(sdk);
  }
}

export class TollFreeCampaignsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({
    companyName,
    phoneNumber,
    description,
    messageFlow,
    helpMessage,
    optInKeywords,
    optOutKeywords,
    website
  }) {
    this.sdk.validateParams(
      { companyName, phoneNumber, description, messageFlow },
      {
        companyName: { type: 'string', required: true },
        phoneNumber: { type: 'string', required: true },
        description: { type: 'string', required: true },
        messageFlow: { type: 'string', required: true },
        helpMessage: { type: 'string', required: false },
        optInKeywords: { type: 'array', required: false },
        optOutKeywords: { type: 'array', required: false },
        website: { type: 'string', required: false },
      },
    );

    const campaignData = {
      companyName,
      phoneNumber,
      description,
      messageFlow,
    };

    if (helpMessage) campaignData.helpMessage = helpMessage;
    if (optInKeywords) campaignData.optInKeywords = optInKeywords;
    if (optOutKeywords) campaignData.optOutKeywords = optOutKeywords;
    if (website) campaignData.website = website;

    const options = {
      body: campaignData,
    };

    const result = await this.sdk._fetch('/messaging/campaigns/tollfree', 'POST', options);
    return result;
  }

  async update(campaignId, updateData) {
    this.sdk.validateParams(
      { campaignId, updateData },
      {
        campaignId: { type: 'string', required: true },
        updateData: { type: 'object', required: true },
      },
    );

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/messaging/campaigns/tollfree/${campaignId}`, 'PUT', options);
    return result;
  }

  async delete(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/campaigns/tollfree/${campaignId}`, 'DELETE');
    return result;
  }

  async get(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/campaigns/tollfree/${campaignId}`, 'GET');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/messaging/campaigns/tollfree', 'GET');
    return result;
  }

  async refreshStatus(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/messaging/campaigns/tollfree/${campaignId}/refresh`, 'POST');
    return result;
  }

  async getPhoneNumberStatus(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const options = {
      query: { phoneNumber },
    };

    const result = await this.sdk._fetch('/messaging/campaigns/tollfree/phone-number-status', 'GET', options);
    return result;
  }
}

export class TenDlcCampaignsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async createBrand({
    companyName,
    ein,
    website,
    stockSymbol,
    stockExchange,
    ipPooling,
    optInMessage,
    optInKeywords,
    optOutMessage,
    optOutKeywords,
    helpMessage,
    helpKeywords
  }) {
    this.sdk.validateParams(
      { companyName },
      {
        companyName: { type: 'string', required: true },
        ein: { type: 'string', required: false },
        website: { type: 'string', required: false },
        stockSymbol: { type: 'string', required: false },
        stockExchange: { type: 'string', required: false },
        ipPooling: { type: 'boolean', required: false },
        optInMessage: { type: 'string', required: false },
        optInKeywords: { type: 'array', required: false },
        optOutMessage: { type: 'string', required: false },
        optOutKeywords: { type: 'array', required: false },
        helpMessage: { type: 'string', required: false },
        helpKeywords: { type: 'array', required: false },
      },
    );

    const brandData = { companyName };
    if (ein) brandData.ein = ein;
    if (website) brandData.website = website;
    if (stockSymbol) brandData.stockSymbol = stockSymbol;
    if (stockExchange) brandData.stockExchange = stockExchange;
    if (ipPooling !== undefined) brandData.ipPooling = ipPooling;
    if (optInMessage) brandData.optInMessage = optInMessage;
    if (optInKeywords) brandData.optInKeywords = optInKeywords;
    if (optOutMessage) brandData.optOutMessage = optOutMessage;
    if (optOutKeywords) brandData.optOutKeywords = optOutKeywords;
    if (helpMessage) brandData.helpMessage = helpMessage;
    if (helpKeywords) brandData.helpKeywords = helpKeywords;

    const options = {
      body: brandData,
    };

    const result = await this.sdk._fetch('/messaging/campaigns/10dlc/brand', 'POST', options);
    return result;
  }

  async updateBrand(brandId, {
    companyName,
    website
  }) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
        companyName: { type: 'string', required: false },
        website: { type: 'string', required: false },
      },
    );

    const updateData = {};
    if (companyName) updateData.companyName = companyName;
    if (website) updateData.website = website;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/messaging/campaigns/10dlc/brand/${brandId}`, 'PUT', options);
    return result;
  }
}