export class GoogleCalendarService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async setupWebhook({ calendarId, eventTypes, webhookUrl, expirationTime }) {
    this.sdk.validateParams(
      { calendarId, eventTypes, webhookUrl },
      {
        calendarId: { type: 'string', required: true },
        eventTypes: { type: 'array', required: true },
        webhookUrl: { type: 'string', required: true },
        expirationTime: { type: 'number', required: false },
      },
    );

    const webhookData = { calendarId, eventTypes, webhookUrl };
    if (expirationTime) webhookData.expirationTime = expirationTime;

    const params = {
      body: webhookData,
    };

    const result = await this.sdk._fetch(
      '/googleCalendar/webhook',
      'POST',
      params,
    );
    return result;
  }

  async removeWebhook(webhookId) {
    this.sdk.validateParams(
      { webhookId },
      {
        webhookId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/googleCalendar/webhook/${webhookId}`,
      'DELETE',
    );
    return result;
  }

  async listWebhooks() {
    const result = await this.sdk._fetch('/googleCalendar/webhooks', 'GET');
    return result;
  }

  async getCalendarList() {
    const result = await this.sdk._fetch('/googleCalendar/calendars', 'GET');
    return result;
  }

  async getCalendarEvents(calendarId, options = {}) {
    this.sdk.validateParams(
      { calendarId },
      {
        calendarId: { type: 'string', required: true },
      },
    );

    // Validate optional parameters
    const validationSchema = {};
    if ('timeMin' in options) validationSchema.timeMin = { type: 'string' };
    if ('timeMax' in options) validationSchema.timeMax = { type: 'string' };
    if ('maxResults' in options)
      validationSchema.maxResults = { type: 'number' };
    if ('orderBy' in options) validationSchema.orderBy = { type: 'string' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(options, validationSchema);
    }

    const params = {
      query: { calendarId, ...options },
    };

    const result = await this.sdk._fetch(
      '/googleCalendar/events',
      'GET',
      params,
    );
    return result;
  }

  async processCalendarChange(changeData) {
    this.sdk.validateParams(
      { changeData },
      {
        changeData: { type: 'object', required: true },
      },
    );

    const params = {
      body: changeData,
    };

    const result = await this.sdk._fetch(
      '/googleCalendar/processChange',
      'POST',
      params,
    );
    return result;
  }
}
