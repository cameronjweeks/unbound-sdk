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
  async update(
    campaignId,
    {
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
    } = {},
  ) {
    this.sdk.validateParams(
      {
        campaignId,
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
      },
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
    if (campaignDescription !== undefined)
      updateData.campaignDescription = campaignDescription;
    if (address1 !== undefined) updateData.address1 = address1;
    if (address2 !== undefined) updateData.address2 = address2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (pocFirstName !== undefined) updateData.pocFirstName = pocFirstName;
    if (pocLastName !== undefined) updateData.pocLastName = pocLastName;
    if (pocPhoneNumber !== undefined)
      updateData.pocPhoneNumber = pocPhoneNumber;
    if (pocEmail !== undefined) updateData.pocEmail = pocEmail;
    if (businessName !== undefined) updateData.businessName = businessName;
    if (website !== undefined) updateData.website = website;
    if (messageVolume !== undefined) updateData.messageVolume = messageVolume;
    if (optInWorkflow !== undefined) updateData.optInWorkflow = optInWorkflow;
    if (optInWorkflowUrls !== undefined)
      updateData.optInWorkflowUrls = optInWorkflowUrls;
    if (phoneNumbers !== undefined) updateData.phoneNumbers = phoneNumbers;
    if (productionMessageExample !== undefined)
      updateData.productionMessageExample = productionMessageExample;
    if (useCase !== undefined) updateData.useCase = useCase;
    if (useCaseDescription !== undefined)
      updateData.useCaseDescription = useCaseDescription;
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
