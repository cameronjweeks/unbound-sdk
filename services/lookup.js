export class LookupService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async cnam(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const params = {
      query: { phoneNumber },
    };

    const result = await this.sdk._fetch('/lookup/cnam', 'GET', params);
    return result;
  }

  async lrn(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const params = {
      query: { phoneNumber },
    };

    const result = await this.sdk._fetch('/lookup/lrn', 'GET', params);
    return result;
  }

  async number(phoneNumber) {
    this.sdk.validateParams(
      { phoneNumber },
      {
        phoneNumber: { type: 'string', required: true },
      },
    );

    const params = {
      query: { phoneNumber },
    };

    const result = await this.sdk._fetch('/lookup/number', 'GET', params);
    return result;
  }
}