export class EmailTemplatesService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  /**
   * Create email template
   * @param {Object} params - Template parameters
   * @param {string} params.name - Template name (required)
   * @param {string} params.subject - Template subject (required)
   * @param {string} [params.html] - HTML template body
   * @param {string} [params.text] - Plain text template body
   * @returns {Promise<Object>} Created template details with auto-extracted variables
   * @example
   * // Create template with variables in the content
   * const template = await sdk.messaging.email.templates.create({
   *   name: 'Welcome Email',
   *   subject: 'Welcome {{firstName}}!',
   *   html: '<h1>Hello {{firstName}} {{lastName}}</h1>',
   *   text: 'Hello {{firstName}} {{lastName}}'
   * });
   * // Returns: { id, name, variables: ['firstName', 'lastName'] }
   */
  async create({ name, subject, html, text }) {
    this.sdk.validateParams(
      { name, subject },
      {
        name: { type: 'string', required: true },
        subject: { type: 'string', required: true },
        html: { type: 'string', required: false },
        text: { type: 'string', required: false },
      },
    );

    const templateData = { name, subject };
    if (html) templateData.html = html;
    if (text) templateData.text = text;

    const options = {
      body: templateData,
    };

    const result = await this.sdk._fetch(
      '/messaging/email/template',
      'POST',
      options,
    );
    return result;
  }

  /**
   * Update email template
   * @param {string} id - Template ID (required)
   * @param {Object} params - Update parameters
   * @param {string} [params.name] - Template name
   * @param {string} [params.subject] - Template subject
   * @param {string} [params.html] - HTML template body
   * @param {string} [params.text] - Plain text template body
   * @returns {Promise<Object>} Updated template details with auto-extracted variables
   * @example
   * // Update template - variables are auto-extracted from content
   * const updated = await sdk.messaging.email.templates.update('tpl_123', {
   *   subject: 'Hi {{firstName}}, welcome to {{companyName}}!'
   * });
   * // Returns updated template with variables: ['firstName', 'companyName']
   */
  async update(id, { name, subject, html, text }) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false },
        subject: { type: 'string', required: false },
        html: { type: 'string', required: false },
        text: { type: 'string', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (subject) updateData.subject = subject;
    if (html) updateData.html = html;
    if (text) updateData.text = text;

    const options = {
      body: updateData,
    };

    const result = await this.sdk._fetch(
      `/messaging/email/template/${id}`,
      'PUT',
      options,
    );
    return result;
  }

  /**
   * Delete email template
   * @param {string} id - Template ID (required)
   * @returns {Promise<Object>} Deletion confirmation
   */
  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/messaging/email/template/${id}`,
      'DELETE',
    );
    return result;
  }

  /**
   * Get email template by ID
   * @param {string} id - Template ID (required)
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
      `/messaging/email/template/${id}`,
      'GET',
    );
    return result;
  }

  /**
   * List all email templates
   * @returns {Promise<Array>} List of email templates
   */
  async list() {
    const result = await this.sdk._fetch('/messaging/email/template', 'GET');
    return result;
  }
}
