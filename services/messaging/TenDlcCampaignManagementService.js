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
      {
        brandId,
        description,
        messageFlow,
        helpMessage,
        optInMessage,
        optOutMessage,
        useCase,
        vertical,
      },
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
  async update(
    campaignId,
    {
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
    } = {},
  ) {
    this.sdk.validateParams(
      {
        campaignId,
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
      },
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
    if (optoutKeywords !== undefined)
      updateData.optoutKeywords = optoutKeywords;
    if (affiliateMarketing !== undefined)
      updateData.affiliateMarketing = affiliateMarketing;
    if (ageGated !== undefined) updateData.ageGated = ageGated;
    if (directLending !== undefined) updateData.directLending = directLending;
    if (embeddedLink !== undefined) updateData.embeddedLink = embeddedLink;
    if (embeddedPhone !== undefined) updateData.embeddedPhone = embeddedPhone;
    if (numberPool !== undefined) updateData.numberPool = numberPool;
    if (autoRenewal !== undefined) updateData.autoRenewal = autoRenewal;
    if (subscriberHelp !== undefined)
      updateData.subscriberHelp = subscriberHelp;
    if (subscriberOptin !== undefined)
      updateData.subscriberOptin = subscriberOptin;
    if (subscriberOptout !== undefined)
      updateData.subscriberOptout = subscriberOptout;

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
