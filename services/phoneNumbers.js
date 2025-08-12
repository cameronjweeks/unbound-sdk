export class PhoneNumbersService {
  constructor(sdk) {
    this.sdk = sdk;
    this.carrier = new PhoneNumberCarrierService(sdk);
  }

  async search({ 
    type, 
    country, 
    state, 
    city, 
    startsWith, 
    endsWith, 
    contains, 
    limit, 
    minimumBlockSize, 
    sms, 
    mms, 
    voice 
  }) {
    // Validate optional parameters
    const validationSchema = {};
    if ('type' in arguments[0]) validationSchema.type = { type: 'string' };
    if ('country' in arguments[0]) validationSchema.country = { type: 'string' };
    if ('state' in arguments[0]) validationSchema.state = { type: 'string' };
    if ('city' in arguments[0]) validationSchema.city = { type: 'string' };
    if ('startsWith' in arguments[0]) validationSchema.startsWith = { type: 'string' };
    if ('endsWith' in arguments[0]) validationSchema.endsWith = { type: 'string' };
    if ('contains' in arguments[0]) validationSchema.contains = { type: 'string' };
    if ('limit' in arguments[0]) validationSchema.limit = { type: 'number' };
    if ('minimumBlockSize' in arguments[0]) validationSchema.minimumBlockSize = { type: 'number' };
    if ('sms' in arguments[0]) validationSchema.sms = { type: 'boolean' };
    if ('mms' in arguments[0]) validationSchema.mms = { type: 'boolean' };
    if ('voice' in arguments[0]) validationSchema.voice = { type: 'boolean' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(arguments[0], validationSchema);
    }

    const params = {
      query: { 
        type, 
        country, 
        state, 
        city, 
        startsWith, 
        endsWith, 
        contains, 
        limit, 
        minimumBlockSize, 
        sms, 
        mms, 
        voice 
      },
    };

    const result = await this.sdk._fetch('/phoneNumbers/search', 'GET', params);
    return result;
  }

  async order({ phoneNumbers, name }) {
    this.sdk.validateParams(
      { phoneNumbers },
      {
        phoneNumbers: { type: 'array', required: true },
        name: { type: 'string', required: false },
      },
    );

    const orderData = { phoneNumbers };
    if (name) orderData.name = name;

    const params = {
      body: orderData,
    };

    const result = await this.sdk._fetch('/phoneNumbers/order', 'POST', params);
    return result;
  }

  async remove(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/phoneNumbers/${phoneNumber}`, 'DELETE');
    return result;
  }

  async update(id, { 
    name, 
    messagingWebHookUrl, 
    voiceWebHookUrl, 
    voiceAppExternalUrl, 
    voiceAppExternalMethod, 
    voiceApp, 
    voiceAppMetaData, 
    voiceRecordTypeId, 
    messagingRecordTypeId 
  }) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false },
        messagingWebHookUrl: { type: 'string', required: false },
        voiceWebHookUrl: { type: 'string', required: false },
        voiceAppExternalUrl: { type: 'string', required: false },
        voiceAppExternalMethod: { type: 'string', required: false },
        voiceApp: { type: 'string', required: false },
        voiceAppMetaData: { type: 'object', required: false },
        voiceRecordTypeId: { type: 'string', required: false },
        messagingRecordTypeId: { type: 'string', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (messagingWebHookUrl) updateData.messagingWebHookUrl = messagingWebHookUrl;
    if (voiceWebHookUrl) updateData.voiceWebHookUrl = voiceWebHookUrl;
    if (voiceAppExternalUrl) updateData.voiceAppExternalUrl = voiceAppExternalUrl;
    if (voiceAppExternalMethod) updateData.voiceAppExternalMethod = voiceAppExternalMethod;
    if (voiceApp) updateData.voiceApp = voiceApp;
    if (voiceAppMetaData) updateData.voiceAppMetaData = voiceAppMetaData;
    if (voiceRecordTypeId) updateData.voiceRecordTypeId = voiceRecordTypeId;
    if (messagingRecordTypeId) updateData.messagingRecordTypeId = messagingRecordTypeId;

    const params = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/phoneNumbers/${id}`, 'PUT', params);
    return result;
  }

  async updateCnam(phoneNumber, { cnam }) {
    this.sdk.validateParams(
      { phoneNumber, cnam },
      {
        phoneNumber: { type: 'string', required: true },
        cnam: { type: 'string', required: true },
      },
    );

    const params = {
      body: { cnam },
    };

    const result = await this.sdk._fetch(`/phoneNumbers/cnam/${phoneNumber}`, 'PUT', params);
    return result;
  }

  async format(number) {
    this.sdk.validateParams(
      { number },
      {
        number: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/phoneNumbers/format/${number}`, 'GET');
    return result;
  }
}

export class PhoneNumberCarrierService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async sync(carrier, { updateVoiceConnection, updateMessagingConnection }) {
    this.sdk.validateParams(
      { carrier },
      {
        carrier: { type: 'string', required: true },
        updateVoiceConnection: { type: 'boolean', required: false },
        updateMessagingConnection: { type: 'boolean', required: false },
      },
    );

    const params = {
      query: { updateVoiceConnection, updateMessagingConnection },
    };

    const result = await this.sdk._fetch(`/phoneNumbers/carrier/syncPhoneNumbers/${carrier}`, 'POST', params);
    return result;
  }

  async getDetails(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/phoneNumbers/carrier/${phoneNumber}`, 'GET');
    return result;
  }

  async delete(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/phoneNumbers/carrier/${phoneNumber}`, 'DELETE');
    return result;
  }
}