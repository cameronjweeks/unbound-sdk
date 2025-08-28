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

  /**
   * Send an SMS/MMS message
   * @param {Object} params - Message parameters
   * @param {string} params.to - Recipient phone number (required)
   * @param {string} [params.from] - Sender phone number
   * @param {string} [params.message] - Message text
   * @param {string} [params.templateId] - Template ID to use
   * @param {Object} [params.variables] - Template variables
   * @param {Array<string>} [params.mediaUrls] - Media URLs for MMS
   * @param {string} [params.webhookUrl] - Webhook URL for delivery status
   * @returns {Promise<Object>} Message details
   */
  async send({
    from,
    to,
    message,
    templateId,
    variables,
    mediaUrls,
    webhookUrl,
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

  /**
   * Get SMS/MMS message by ID
   * @param {string} id - Message ID
   * @returns {Promise<Object>} Message details
   */
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

  /**
   * Create SMS template
   * @param {Object} params - Template parameters
   * @param {string} params.name - Template name (required)
   * @param {string} params.message - Template message (required)
   * @param {Object} [params.variables] - Template variables
   * @returns {Promise<Object>} Created template details
   */
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

    const result = await this.sdk._fetch(
      '/messaging/sms/templates',
      'POST',
      options,
    );
    return result;
  }

  /**
   * Update SMS template
   * @param {string} id - Template ID
   * @param {Object} params - Update parameters
   * @param {string} [params.name] - Template name
   * @param {string} [params.message] - Template message
   * @param {Object} [params.variables] - Template variables
   * @returns {Promise<Object>} Updated template details
   */
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

    const result = await this.sdk._fetch(
      `/messaging/sms/templates/${id}`,
      'PUT',
      options,
    );
    return result;
  }

  /**
   * Delete SMS template
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Deletion result
   */
  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/sms/templates/${id}`,
      'DELETE',
    );
    return result;
  }

  /**
   * Get SMS template by ID
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Template details
   */
  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/sms/templates/${id}`,
      'GET',
    );
    return result;
  }

  /**
   * List all SMS templates
   * @returns {Promise<Array>} List of templates
   */
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
    tags,
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

    const result = await this.sdk._fetch(
      `/messaging/email/domain/${domain}`,
      'PUT',
      options,
    );
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

    const result = await this.sdk._fetch(
      '/messaging/email/templates',
      'POST',
      options,
    );
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

    const result = await this.sdk._fetch(
      `/messaging/email/templates/${id}`,
      'PUT',
      options,
    );
    return result;
  }

  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/email/templates/${id}`,
      'DELETE',
    );
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/email/templates/${id}`,
      'GET',
    );
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

    const result = await this.sdk._fetch(
      '/messaging/email/domains',
      'POST',
      options,
    );
    return result;
  }

  async delete(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/email/domains/${domain}`,
      'DELETE',
    );
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

    const result = await this.sdk._fetch(
      `/messaging/email/domains/${domain}/validate`,
      'POST',
    );
    return result;
  }

  async checkStatus(domain) {
    this.sdk.validateParams(
      { domain },
      {
        domain: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/email/domains/${domain}/status`,
      'GET',
    );
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

    const result = await this.sdk._fetch(
      `/messaging/email/domains/${domain}`,
      'PUT',
      options,
    );
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

    const result = await this.sdk._fetch(
      '/messaging/email/addresses',
      'POST',
      options,
    );
    return result;
  }

  async delete(email) {
    this.sdk.validateParams(
      { email },
      {
        email: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/email/addresses/${encodeURIComponent(email)}`,
      'DELETE',
    );
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

    const result = await this.sdk._fetch(
      `/messaging/email/addresses/${encodeURIComponent(email)}/status`,
      'GET',
    );
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

  /**
   * Create toll-free campaign
   * @param {Object} params - Campaign parameters
   * @param {string} params.companyName - Company name (required)
   * @param {string} params.phoneNumber - Phone number (required)
   * @param {string} params.description - Campaign description (required)
   * @param {string} params.messageFlow - Message flow description (required)
   * @param {string} [params.helpMessage] - Help message
   * @param {Array<string>} [params.optInKeywords] - Opt-in keywords
   * @param {Array<string>} [params.optOutKeywords] - Opt-out keywords
   * @param {string} [params.website] - Business website
   * @returns {Promise<Object>} Created campaign details
   */
  async create({
    companyName,
    phoneNumber,
    description,
    messageFlow,
    helpMessage,
    optInKeywords,
    optOutKeywords,
    website,
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

    const result = await this.sdk._fetch(
      '/messaging/campaigns/tollfree',
      'POST',
      options,
    );
    return result;
  }

  /**
   * Get toll-free campaign by ID
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign details
   */
  async get(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/tollfree/${campaignId}`,
      'GET',
    );
    return result;
  }

  /**
   * Update toll-free campaign
   * @param {string} campaignId - Campaign ID to update
   * @param {Object} params - Update parameters
   * @param {string} [params.name] - Campaign name
   * @param {string} [params.campaignDescription] - Campaign description
   * @param {string} [params.address1] - Business address line 1
   * @param {string} [params.address2] - Business address line 2
   * @param {string} [params.city] - Business city
   * @param {string} [params.state] - Business state
   * @param {string} [params.zip] - Business zip code
   * @param {string} [params.pocFirstName] - Point of contact first name
   * @param {string} [params.pocLastName] - Point of contact last name
   * @param {string} [params.pocPhoneNumber] - Point of contact phone
   * @param {string} [params.pocEmail] - Point of contact email
   * @param {string} [params.businessName] - Business name
   * @param {string} [params.website] - Business website
   * @param {string} [params.messageVolume] - Expected message volume
   * @param {string} [params.optInWorkflow] - Opt-in workflow description
   * @param {Array<string>} [params.optInWorkflowUrls] - Opt-in workflow image URLs
   * @param {Array<string>} [params.phoneNumbers] - Phone numbers for campaign
   * @param {string} [params.productionMessageExample] - Production message example
   * @param {string} [params.useCase] - Use case category
   * @param {string} [params.useCaseDescription] - Use case description
   * @param {string} [params.webhookUrl] - Webhook URL
   * @returns {Promise<Object>} Updated campaign information
   */
  async update(campaignId, {
    name,
    campaignDescription,
    address1,
    address2,
    city,
    state,
    zip,
    pocFirstName,
    pocLastName,
    pocPhoneNumber,
    pocEmail,
    businessName,
    website,
    messageVolume,
    optInWorkflow,
    optInWorkflowUrls,
    phoneNumbers,
    productionMessageExample,
    useCase,
    useCaseDescription,
    webhookUrl,
  } = {}) {
    this.sdk.validateParams(
      { campaignId, name, campaignDescription, address1, address2, city, state, zip, pocFirstName, pocLastName, pocPhoneNumber, pocEmail, businessName, website, messageVolume, optInWorkflow, optInWorkflowUrls, phoneNumbers, productionMessageExample, useCase, useCaseDescription, webhookUrl },
      {
        campaignId: { type: 'string', required: true },
        name: { type: 'string', required: false },
        campaignDescription: { type: 'string', required: false },
        address1: { type: 'string', required: false },
        address2: { type: 'string', required: false },
        city: { type: 'string', required: false },
        state: { type: 'string', required: false },
        zip: { type: 'string', required: false },
        pocFirstName: { type: 'string', required: false },
        pocLastName: { type: 'string', required: false },
        pocPhoneNumber: { type: 'string', required: false },
        pocEmail: { type: 'string', required: false },
        businessName: { type: 'string', required: false },
        website: { type: 'string', required: false },
        messageVolume: { type: 'string', required: false },
        optInWorkflow: { type: 'string', required: false },
        optInWorkflowUrls: { type: 'array', required: false },
        phoneNumbers: { type: 'array', required: false },
        productionMessageExample: { type: 'string', required: false },
        useCase: { type: 'string', required: false },
        useCaseDescription: { type: 'string', required: false },
        webhookUrl: { type: 'string', required: false },
      },
    );

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (campaignDescription !== undefined) updateData.campaignDescription = campaignDescription;
    if (address1 !== undefined) updateData.address1 = address1;
    if (address2 !== undefined) updateData.address2 = address2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (pocFirstName !== undefined) updateData.pocFirstName = pocFirstName;
    if (pocLastName !== undefined) updateData.pocLastName = pocLastName;
    if (pocPhoneNumber !== undefined) updateData.pocPhoneNumber = pocPhoneNumber;
    if (pocEmail !== undefined) updateData.pocEmail = pocEmail;
    if (businessName !== undefined) updateData.businessName = businessName;
    if (website !== undefined) updateData.website = website;
    if (messageVolume !== undefined) updateData.messageVolume = messageVolume;
    if (optInWorkflow !== undefined) updateData.optInWorkflow = optInWorkflow;
    if (optInWorkflowUrls !== undefined) updateData.optInWorkflowUrls = optInWorkflowUrls;
    if (phoneNumbers !== undefined) updateData.phoneNumbers = phoneNumbers;
    if (productionMessageExample !== undefined) updateData.productionMessageExample = productionMessageExample;
    if (useCase !== undefined) updateData.useCase = useCase;
    if (useCaseDescription !== undefined) updateData.useCaseDescription = useCaseDescription;
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/tollfree/${campaignId}`,
      'PUT',
      options,
    );
    return result;
  }

  async delete(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/tollfree/${campaignId}`,
      'DELETE',
    );
    return result;
  }

  /**
   * List all toll-free campaigns with optional filtering
   * @param {Object} [params] - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=50] - Items per page
   * @param {string} [params.name] - Filter by campaign name
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.operatorType='contains'] - Filter operator: contains, equals, startsWith, endsWith
   * @returns {Promise<Array>} List of campaigns
   */
  async list({ page, limit, name, status, operatorType } = {}) {
    const queryParams = new URLSearchParams();
    
    if (page !== undefined) queryParams.append('page', page);
    if (limit !== undefined) queryParams.append('limit', limit);
    if (name) queryParams.append('name', name);
    if (status) queryParams.append('status', status);
    if (operatorType) queryParams.append('operatorType', operatorType);

    const url = queryParams.toString() 
      ? `/messaging/campaigns/tollfree?${queryParams.toString()}`
      : '/messaging/campaigns/tollfree';

    const result = await this.sdk._fetch(url, 'GET');
    return result;
  }

  async refreshStatus(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/tollfree/refresh/${campaignId}`,
      'GET',
    );
    return result;
  }

  async getPhoneNumberCampaignStatus(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/tollfree/phoneNumber/${encodeURIComponent(
        phoneNumber,
      )}/campaignStatus`,
      'GET',
    );
    return result;
  }
}

export class TenDlcCampaignsService {
  constructor(sdk) {
    this.sdk = sdk;
    this.brands = new TenDlcBrandsService(sdk);
    this.campaigns = new TenDlcCampaignManagementService(sdk);
  }

  /**
   * Get phone number campaign status for 10DLC
   * @param {string} phoneNumber - Phone number to check
   * @returns {Promise<Object>} Campaign status information
   */
  async getPhoneNumberCampaignStatus(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/phoneNumber/${encodeURIComponent(
        phoneNumber,
      )}/campaignStatus`,
      'GET',
    );
    return result;
  }
}

export class TenDlcBrandsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  /**
   * List all 10DLC brands with optional filtering
   * @param {Object} [params] - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=50] - Items per page
   * @param {string} [params.name] - Filter by brand name
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.operatorType='contains'] - Filter operator: contains, equals, startsWith, endsWith
   * @returns {Promise<Array>} List of brands
   */
  async list({ page, limit, name, status, operatorType } = {}) {
    const queryParams = new URLSearchParams();
    
    if (page !== undefined) queryParams.append('page', page);
    if (limit !== undefined) queryParams.append('limit', limit);
    if (name) queryParams.append('name', name);
    if (status) queryParams.append('status', status);
    if (operatorType) queryParams.append('operatorType', operatorType);

    const url = queryParams.toString() 
      ? `/messaging/campaigns/10dlc/brand?${queryParams.toString()}`
      : '/messaging/campaigns/10dlc/brand';

    const result = await this.sdk._fetch(url, 'GET');
    return result;
  }

  /**
   * Create a new 10DLC brand
   * @param {Object} params - Brand parameters
   * @param {string} params.name - Brand display name (required)
   * @param {string} params.entityType - Entity type: PRIVATE_PROFIT, PUBLIC_PROFIT, NON_PROFIT (required)
   * @param {string} [params.cspId] - CSP ID for resellers  
   * @param {string} params.companyName - Company name (required)
   * @param {string} [params.ein] - Employer Identification Number
   * @param {string} params.address1 - Street address (required)
   * @param {string} [params.address2] - Street address line 2
   * @param {string} params.city - City (required)
   * @param {string} params.state - State (required)
   * @param {string} params.postalCode - Postal code (required)
   * @param {string} params.country - Country (required)
   * @param {string} [params.pocFirstName] - Point of contact first name
   * @param {string} [params.pocLastName] - Point of contact last name
   * @param {string} params.pocEmail - Point of contact email (required)
   * @param {string} params.pocPhone - Point of contact phone (required)
   * @param {string} [params.stockSymbol] - Stock symbol for public companies
   * @param {string} [params.stockExchange] - Stock exchange for public companies
   * @param {string} [params.website] - Company website
   * @param {string} params.vertical - Business vertical (required)
   * @param {string} [params.altBusinessId] - Alternative business ID
   * @param {string} [params.altBusinessIdType] - Alternative business ID type
   * @param {string} [params.brandRelationship] - Brand relationship
   * @returns {Promise<Object>} Created brand details
   */
  async create({
    name,
    entityType,
    cspId,
    companyName,
    ein,
    address1,
    address2,
    city,
    state,
    postalCode,
    country,
    pocFirstName,
    pocLastName,
    pocEmail,
    pocPhone,
    stockSymbol,
    stockExchange,
    website,
    vertical,
    altBusinessId,
    altBusinessIdType,
    brandRelationship,
  }) {
    this.sdk.validateParams(
      { name, entityType, companyName, address1, city, state, postalCode, country, pocEmail, pocPhone, vertical },
      {
        name: { type: 'string', required: true },
        entityType: { type: 'string', required: true },
        cspId: { type: 'string', required: false },
        companyName: { type: 'string', required: true },
        ein: { type: 'string', required: false },
        address1: { type: 'string', required: true },
        address2: { type: 'string', required: false },
        city: { type: 'string', required: true },
        state: { type: 'string', required: true },
        postalCode: { type: 'string', required: true },
        country: { type: 'string', required: true },
        pocFirstName: { type: 'string', required: false },
        pocLastName: { type: 'string', required: false },
        pocEmail: { type: 'string', required: true },
        pocPhone: { type: 'string', required: true },
        stockSymbol: { type: 'string', required: false },
        stockExchange: { type: 'string', required: false },
        website: { type: 'string', required: false },
        vertical: { type: 'string', required: true },
        altBusinessId: { type: 'string', required: false },
        altBusinessIdType: { type: 'string', required: false },
        brandRelationship: { type: 'string', required: false },
      },
    );

    const brandData = {
      name,
      entityType,
      companyName,
      address1,
      city,
      state,
      postalCode,
      country,
      pocEmail,
      pocPhone,
      vertical,
    };
    if (cspId) brandData.cspId = cspId;
    if (ein) brandData.ein = ein;
    if (address2) brandData.address2 = address2;
    if (pocFirstName) brandData.pocFirstName = pocFirstName;
    if (pocLastName) brandData.pocLastName = pocLastName;
    if (stockSymbol) brandData.stockSymbol = stockSymbol;
    if (stockExchange) brandData.stockExchange = stockExchange;
    if (website) brandData.website = website;
    if (altBusinessId) brandData.altBusinessId = altBusinessId;
    if (altBusinessIdType) brandData.altBusinessIdType = altBusinessIdType;
    if (brandRelationship) brandData.brandRelationship = brandRelationship;

    const options = {
      body: brandData,
    };

    const result = await this.sdk._fetch(
      '/messaging/campaigns/10dlc/brand',
      'POST',
      options,
    );
    return result;
  }

  /**
   * Get a 10DLC brand by ID
   * @param {string} brandId - Brand ID (required)
   * @returns {Promise<Object>} Brand details
   */
  async get(brandId) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}`,
      'GET',
    );
    return result;
  }

  /**
   * Update a 10DLC brand
   * @param {string} brandId - Brand ID to update (required)
   * @param {Object} params - Brand parameters to update
   * @param {string} [params.name] - Brand display name
   * @param {string} [params.entityType] - Entity type: PRIVATE_PROFIT, PUBLIC_PROFIT, NON_PROFIT
   * @param {string} [params.cspId] - CSP ID for resellers
   * @param {string} [params.companyName] - Company name
   * @param {string} [params.ein] - Employer Identification Number
   * @param {string} [params.address1] - Street address
   * @param {string} [params.address2] - Street address line 2
   * @param {string} [params.city] - City
   * @param {string} [params.state] - State
   * @param {string} [params.postalCode] - Postal code
   * @param {string} [params.country] - Country
   * @param {string} [params.pocFirstName] - Point of contact first name
   * @param {string} [params.pocLastName] - Point of contact last name
   * @param {string} [params.pocEmail] - Point of contact email
   * @param {string} [params.pocPhone] - Point of contact phone
   * @param {string} [params.stockSymbol] - Stock symbol for public companies
   * @param {string} [params.stockExchange] - Stock exchange for public companies
   * @param {string} [params.website] - Company website
   * @param {string} [params.vertical] - Business vertical
   * @param {string} [params.altBusinessId] - Alternative business ID
   * @param {string} [params.altBusinessIdType] - Alternative business ID type
   * @param {string} [params.brandRelationship] - Brand relationship
   * @param {string} [params.businessContactEmail] - Business contact email for 2025 compliance
   * @param {string} [params.firstName] - First name for 2025 compliance  
   * @param {string} [params.lastName] - Last name for 2025 compliance
   * @param {string} [params.mobilePhone] - Mobile phone for 2025 compliance
   * @returns {Promise<Object>} Updated brand details
   */
  async update(brandId, {
    name,
    entityType,
    cspId,
    companyName,
    ein,
    address1,
    address2,
    city,
    state,
    postalCode,
    country,
    pocFirstName,
    pocLastName,
    pocEmail,
    pocPhone,
    stockSymbol,
    stockExchange,
    website,
    vertical,
    altBusinessId,
    altBusinessIdType,
    brandRelationship,
    businessContactEmail,
    firstName,
    lastName,
    mobilePhone,
  } = {}) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
        name: { type: 'string', required: false },
        entityType: { type: 'string', required: false },
        cspId: { type: 'string', required: false },
        companyName: { type: 'string', required: false },
        ein: { type: 'string', required: false },
        address1: { type: 'string', required: false },
        address2: { type: 'string', required: false },
        city: { type: 'string', required: false },
        state: { type: 'string', required: false },
        postalCode: { type: 'string', required: false },
        country: { type: 'string', required: false },
        pocFirstName: { type: 'string', required: false },
        pocLastName: { type: 'string', required: false },
        pocEmail: { type: 'string', required: false },
        pocPhone: { type: 'string', required: false },
        stockSymbol: { type: 'string', required: false },
        stockExchange: { type: 'string', required: false },
        website: { type: 'string', required: false },
        vertical: { type: 'string', required: false },
        altBusinessId: { type: 'string', required: false },
        altBusinessIdType: { type: 'string', required: false },
        brandRelationship: { type: 'string', required: false },
        businessContactEmail: { type: 'string', required: false },
        firstName: { type: 'string', required: false },
        lastName: { type: 'string', required: false },
        mobilePhone: { type: 'string', required: false },
      },
    );

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (entityType !== undefined) updateData.entityType = entityType;
    if (cspId !== undefined) updateData.cspId = cspId;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (ein !== undefined) updateData.ein = ein;
    if (address1 !== undefined) updateData.address1 = address1;
    if (address2 !== undefined) updateData.address2 = address2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (country !== undefined) updateData.country = country;
    if (pocFirstName !== undefined) updateData.pocFirstName = pocFirstName;
    if (pocLastName !== undefined) updateData.pocLastName = pocLastName;
    if (pocEmail !== undefined) updateData.pocEmail = pocEmail;
    if (pocPhone !== undefined) updateData.pocPhone = pocPhone;
    if (stockSymbol !== undefined) updateData.stockSymbol = stockSymbol;
    if (stockExchange !== undefined) updateData.stockExchange = stockExchange;
    if (website !== undefined) updateData.website = website;
    if (vertical !== undefined) updateData.vertical = vertical;
    if (altBusinessId !== undefined) updateData.altBusinessId = altBusinessId;
    if (altBusinessIdType !== undefined) updateData.altBusinessIdType = altBusinessIdType;
    if (brandRelationship !== undefined) updateData.brandRelationship = brandRelationship;
    if (businessContactEmail !== undefined) updateData.businessContactEmail = businessContactEmail;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (mobilePhone !== undefined) updateData.mobilePhone = mobilePhone;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}`,
      'PUT',
      options,
    );
    return result;
  }

  /**
   * Delete a 10DLC brand
   * @param {string} brandId - Brand ID to delete (required)
   * @returns {Promise<Object>} Deletion confirmation
   */
  async delete(brandId) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}`,
      'DELETE',
    );
    return result;
  }

  /**
   * Revet (re-vet) a 10DLC brand - resubmit brand for carrier approval
   * @param {string} brandId - Brand ID to revet (required)
   * @returns {Promise<Object>} Revet confirmation and updated brand status
   */
  async revet(brandId) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}/revet`,
      'PUT',
    );
    return result;
  }

  /**
   * Get brand feedback from carriers
   * @param {string} brandId - Brand ID to get feedback for (required)
   * @returns {Promise<Object>} Brand feedback details from carriers
   */
  async getFeedback(brandId) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}/feedback`,
      'GET',
    );
    return result;
  }

  /**
   * Create external brand vetting for higher throughput approval
   * @param {string} brandId - Brand ID to create external vetting for (required)
   * @param {Object} [vettingData] - External vetting data
   * @returns {Promise<Object>} External vetting creation confirmation
   */
  async createExternalVetting(brandId, vettingData) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
        vettingData: { type: 'object', required: false },
      },
    );

    const options = {
      body: vettingData || {},
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}/externalVetting`,
      'POST',
      options,
    );
    return result;
  }

  /**
   * Get brand external vetting responses
   * @param {string} brandId - Brand ID to get vetting responses for (required)
   * @returns {Promise<Object>} External vetting responses
   */
  async getExternalVettingResponses(brandId) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}/externalvetting/responses`,
      'GET',
    );
    return result;
  }

  /**
   * Resend two-factor authentication email for PUBLIC_PROFIT brands
   * @param {string} brandId - Brand ID to resend 2FA for
   * @returns {Promise<Object>} Success message and details
   */
  async resend2fa(brandId) {
    this.sdk.validateParams(
      { brandId },
      {
        brandId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/brand/${brandId}/resend-2fa`,
      'POST',
    );
    return result;
  }
}

export class TenDlcCampaignManagementService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  /**
   * List all 10DLC campaigns with optional filtering
   * @param {Object} [params] - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=50] - Items per page
   * @param {string} [params.name] - Filter by campaign name
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.operatorType='contains'] - Filter operator: contains, equals, startsWith, endsWith
   * @returns {Promise<Array>} List of campaigns
   */
  async list({ page, limit, name, status, operatorType } = {}) {
    const queryParams = new URLSearchParams();
    
    if (page !== undefined) queryParams.append('page', page);
    if (limit !== undefined) queryParams.append('limit', limit);
    if (name) queryParams.append('name', name);
    if (status) queryParams.append('status', status);
    if (operatorType) queryParams.append('operatorType', operatorType);

    const url = queryParams.toString() 
      ? `/messaging/campaigns/10dlc/campaign?${queryParams.toString()}`
      : '/messaging/campaigns/10dlc/campaign';

    const result = await this.sdk._fetch(url, 'GET');
    return result;
  }

  /**
   * Create a new 10DLC campaign
   * @param {Object} params - Campaign parameters
   * @param {string} params.brandId - Brand ID (required)
   * @param {string} params.description - Campaign description (required)
   * @param {string} params.messageFlow - Message flow description (required)
   * @param {string} [params.helpMessage] - Help message
   * @param {string} [params.optInMessage] - Opt-in message
   * @param {string} [params.optOutMessage] - Opt-out message
   * @param {string} [params.useCase] - Use case category
   * @param {string} [params.vertical] - Vertical category
   * @returns {Promise<Object>} Created campaign details
   */
  async create({
    brandId,
    description,
    messageFlow,
    helpMessage,
    optInMessage,
    optOutMessage,
    useCase,
    vertical,
  }) {
    this.sdk.validateParams(
      { brandId, description, messageFlow, helpMessage, optInMessage, optOutMessage, useCase, vertical },
      {
        brandId: { type: 'string', required: true },
        description: { type: 'string', required: true },
        messageFlow: { type: 'string', required: true },
        helpMessage: { type: 'string', required: false },
        optInMessage: { type: 'string', required: false },
        optOutMessage: { type: 'string', required: false },
        useCase: { type: 'string', required: false },
        vertical: { type: 'string', required: false },
      },
    );

    const campaignData = {
      brandId,
      description,
      messageFlow,
    };

    if (helpMessage !== undefined) campaignData.helpMessage = helpMessage;
    if (optInMessage !== undefined) campaignData.optInMessage = optInMessage;
    if (optOutMessage !== undefined) campaignData.optOutMessage = optOutMessage;
    if (useCase !== undefined) campaignData.useCase = useCase;
    if (vertical !== undefined) campaignData.vertical = vertical;

    const options = {
      body: campaignData,
    };

    const result = await this.sdk._fetch(
      '/messaging/campaigns/10dlc/campaign',
      'POST',
      options,
    );
    return result;
  }

  /**
   * Get a 10DLC campaign by ID
   */
  async get(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}`,
      'GET',
    );
    return result;
  }

  /**
   * Update a 10DLC campaign
   * @param {string} campaignId - Campaign ID to update
   * @param {Object} params - Update parameters
   * @param {string} [params.name] - Campaign name
   * @param {string} [params.description] - Campaign description  
   * @param {string} [params.messageFlow] - Message flow description
   * @param {Array<string>} [params.samples] - Sample messages (up to 4)
   * @param {string} [params.webhookUrl] - Webhook URL
   * @param {string} [params.helpMessage] - Help message
   * @param {string} [params.optInMessage] - Opt-in message
   * @param {string} [params.optOutMessage] - Opt-out message
   * @param {string} [params.helpKeywords] - Help keywords (comma-separated)
   * @param {string} [params.optinKeywords] - Opt-in keywords (comma-separated)
   * @param {string} [params.optoutKeywords] - Opt-out keywords (comma-separated)
   * @param {boolean} [params.affiliateMarketing] - Affiliate marketing flag
   * @param {boolean} [params.ageGated] - Age gated content flag
   * @param {boolean} [params.directLending] - Direct lending flag
   * @param {boolean} [params.embeddedLink] - Embedded links flag
   * @param {boolean} [params.embeddedPhone] - Embedded phone numbers flag
   * @param {boolean} [params.numberPool] - Number pool usage flag
   * @param {boolean} [params.autoRenewal] - Auto-renewal flag
   * @param {boolean} [params.subscriberHelp] - Subscriber help support flag
   * @param {boolean} [params.subscriberOptin] - Subscriber opt-in requirement flag
   * @param {boolean} [params.subscriberOptout] - Subscriber opt-out support flag
   * @returns {Promise<Object>} Updated campaign information
   */
  async update(campaignId, {
    name,
    description,
    messageFlow,
    samples,
    webhookUrl,
    helpMessage,
    optInMessage,
    optOutMessage,
    helpKeywords,
    optinKeywords,
    optoutKeywords,
    affiliateMarketing,
    ageGated,
    directLending,
    embeddedLink,
    embeddedPhone,
    numberPool,
    autoRenewal,
    subscriberHelp,
    subscriberOptin,
    subscriberOptout,
  } = {}) {
    this.sdk.validateParams(
      { campaignId, name, description, messageFlow, samples, webhookUrl, helpMessage, optInMessage, optOutMessage, helpKeywords, optinKeywords, optoutKeywords, affiliateMarketing, ageGated, directLending, embeddedLink, embeddedPhone, numberPool, autoRenewal, subscriberHelp, subscriberOptin, subscriberOptout },
      {
        campaignId: { type: 'string', required: true },
        name: { type: 'string', required: false },
        description: { type: 'string', required: false },
        messageFlow: { type: 'string', required: false },
        samples: { type: 'array', required: false },
        webhookUrl: { type: 'string', required: false },
        helpMessage: { type: 'string', required: false },
        optInMessage: { type: 'string', required: false },
        optOutMessage: { type: 'string', required: false },
        helpKeywords: { type: 'array', required: false },
        optinKeywords: { type: 'array', required: false },
        optoutKeywords: { type: 'array', required: false },
        affiliateMarketing: { type: 'boolean', required: false },
        ageGated: { type: 'boolean', required: false },
        directLending: { type: 'boolean', required: false },
        embeddedLink: { type: 'boolean', required: false },
        embeddedPhone: { type: 'boolean', required: false },
        numberPool: { type: 'boolean', required: false },
        autoRenewal: { type: 'boolean', required: false },
        subscriberHelp: { type: 'boolean', required: false },
        subscriberOptin: { type: 'boolean', required: false },
        subscriberOptout: { type: 'boolean', required: false },
      },
    );

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (messageFlow !== undefined) updateData.messageFlow = messageFlow;
    if (samples !== undefined) updateData.samples = samples;
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;
    if (helpMessage !== undefined) updateData.helpMessage = helpMessage;
    if (optInMessage !== undefined) updateData.optInMessage = optInMessage;
    if (optOutMessage !== undefined) updateData.optOutMessage = optOutMessage;
    if (helpKeywords !== undefined) updateData.helpKeywords = helpKeywords;
    if (optinKeywords !== undefined) updateData.optinKeywords = optinKeywords;
    if (optoutKeywords !== undefined) updateData.optoutKeywords = optoutKeywords;
    if (affiliateMarketing !== undefined) updateData.affiliateMarketing = affiliateMarketing;
    if (ageGated !== undefined) updateData.ageGated = ageGated;
    if (directLending !== undefined) updateData.directLending = directLending;
    if (embeddedLink !== undefined) updateData.embeddedLink = embeddedLink;
    if (embeddedPhone !== undefined) updateData.embeddedPhone = embeddedPhone;
    if (numberPool !== undefined) updateData.numberPool = numberPool;
    if (autoRenewal !== undefined) updateData.autoRenewal = autoRenewal;
    if (subscriberHelp !== undefined) updateData.subscriberHelp = subscriberHelp;
    if (subscriberOptin !== undefined) updateData.subscriberOptin = subscriberOptin;
    if (subscriberOptout !== undefined) updateData.subscriberOptout = subscriberOptout;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}`,
      'PUT',
      options,
    );
    return result;
  }

  /**
   * Delete a 10DLC campaign
   */
  async delete(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}`,
      'DELETE',
    );
    return result;
  }

  /**
   * Get campaign operation status
   */
  async getOperationStatus(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}/operationStatus`,
      'GET',
    );
    return result;
  }

  /**
   * Get MNO campaign metadata
   */
  async getMnoMetaData(campaignId) {
    this.sdk.validateParams(
      { campaignId },
      {
        campaignId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}/mnoMetaData`,
      'GET',
    );
    return result;
  }

  /**
   * Add phone number to campaign
   */
  async addPhoneNumber(campaignId, phoneNumberData) {
    this.sdk.validateParams(
      { campaignId, phoneNumberData },
      {
        campaignId: { type: 'string', required: true },
        phoneNumberData: { type: 'object', required: true },
      },
    );

    const options = {
      body: phoneNumberData,
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}/phoneNumber`,
      'POST',
      options,
    );
    return result;
  }

  /**
   * Update phone number in campaign
   */
  async updatePhoneNumber(campaignId, phoneNumberData) {
    this.sdk.validateParams(
      { campaignId, phoneNumberData },
      {
        campaignId: { type: 'string', required: true },
        phoneNumberData: { type: 'object', required: true },
      },
    );

    const options = {
      body: phoneNumberData,
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}/phoneNumber`,
      'PUT',
      options,
    );
    return result;
  }

  /**
   * Remove phone number from campaign
   */
  async removePhoneNumber(campaignId, phoneNumberData) {
    this.sdk.validateParams(
      { campaignId, phoneNumberData },
      {
        campaignId: { type: 'string', required: true },
        phoneNumberData: { type: 'object', required: true },
      },
    );

    const options = {
      body: phoneNumberData,
    };

    const result = await this.sdk._fetch(
      `/messaging/campaigns/10dlc/campaign/${campaignId}/phoneNumber`,
      'DELETE',
      options,
    );
    return result;
  }
}
