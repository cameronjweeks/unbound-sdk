export class NotesService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async list({ relatedId, recordTypeId, limit, orderBy, orderDirection }) {
    this.sdk.validateParams(
      { relatedId, limit, orderBy, orderDirection },
      {
        relatedId: { type: 'string', required: true },
        recordTypeId: { type: 'string', required: false },
        limit: { type: 'number', required: false },
        orderBy: { type: 'string', required: false },
        orderDirection: { type: 'string', required: false },
      },
    );

    const params = {
      query: {
        relatedId,
        recordTypeId,
        limit,
        orderBy,
        orderDirection,
      },
    };

    const result = await this.sdk._fetch('/notes', 'GET', params);
    return result;
  }

  async create({
    title,
    relatedId,
    recordTypeId,
    content_html,
    content_binary,
    content_json,
    version,
  }) {
    this.sdk.validateParams(
      {
        title,
        relatedId,
        recordTypeId,
        content_html,
        content_binary,
        content_json,
        version,
      },
      {
        title: { type: 'string', required: false },
        relatedId: { type: 'string', required: true },
        recordTypeId: { type: 'string', required: false },
        content_html: { type: 'string', required: false },
        content_binary: { type: 'array', required: false },
        content_json: { type: 'object', required: false },
        version: { type: 'number', required: false },
      },
    );

    const params = {
      body: {
        title,
        relatedId,
        recordTypeId,
        content_html,
        content_binary,
        content_json,
        version,
      },
    };

    const result = await this.sdk._fetch('/notes', 'POST', params);
    return result;
  }

  async update(
    noteId,
    { title, content_html, content_binary, content_json, version },
  ) {
    this.sdk.validateParams(
      { noteId, title, content_html, content_binary, content_json, version },
      {
        noteId: { type: 'string', required: true },
        title: { type: 'string', required: false },
        content_html: { type: 'string', required: false },
        content_binary: { type: 'array', required: false },
        content_json: { type: 'object', required: false },
        version: { type: 'number', required: false },
      },
    );

    const params = {
      body: {
        title,
        content_html,
        content_binary,
        content_json,
        version,
      },
    };

    const result = await this.sdk._fetch(`/notes/${noteId}`, 'PUT', params);
    return result;
  }

  async delete(noteId) {
    this.sdk.validateParams(
      { noteId },
      {
        noteId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/notes/${noteId}`, 'DELETE');
    return result;
  }

  async get(noteId) {
    this.sdk.validateParams(
      { noteId },
      {
        noteId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/notes/${noteId}`, 'GET');
    return result;
  }
}
