export class StorageService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async uploadFiles(files, options = {}) {
    const { classification, expireAfter, isPublic, metadata } = options;

    // Validate files parameter
    if (!files) {
      throw new Error('Files parameter is required');
    }

    // Handle different file input formats
    let formData;
    if (typeof window !== 'undefined' && files instanceof FormData) {
      // Browser FormData
      formData = files;
    } else if (typeof window !== 'undefined' && files instanceof FileList) {
      // Browser FileList
      formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    } else if (Array.isArray(files)) {
      // File array (Node.js or Browser)
      formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    } else if (typeof files === 'object' && files.path) {
      // Single file object (Node.js)
      formData = new FormData();
      formData.append('files', files);
    } else {
      throw new Error('Invalid files format. Expected FormData, FileList, File array, or File object');
    }

    // Add optional parameters to FormData
    if (classification) formData.append('classification', classification);
    if (expireAfter) formData.append('expireAfter', expireAfter);
    if (isPublic !== undefined) formData.append('isPublic', isPublic.toString());
    if (metadata) formData.append('metadata', JSON.stringify(metadata));

    const params = {
      body: formData,
      headers: {
        // Let browser/Node.js set Content-Type with boundary for multipart/form-data
      }
    };

    // Remove Content-Type to let FormData set it properly
    delete params.headers['Content-Type'];

    const result = await this.sdk._fetch('/storage/upload', 'POST', params);
    return result;
  }

  async getFile(storageId, download = false) {
    this.sdk.validateParams(
      { storageId },
      {
        storageId: { type: 'string', required: true },
        download: { type: 'boolean', required: false },
      },
    );

    const params = {};
    if (download) {
      params.query = { download: 'true' };
    }

    const result = await this.sdk._fetch(`/storage/file/${storageId}`, 'GET', params);
    return result;
  }

  async getFileUrl(storageId, download = false) {
    this.sdk.validateParams(
      { storageId },
      {
        storageId: { type: 'string', required: true },
        download: { type: 'boolean', required: false },
      },
    );

    let url;
    if (this.sdk.environment === 'node') {
      url = `${this.sdk.baseURL}/storage/file/${storageId}`;
    } else {
      url = `${this.sdk.fullUrl}/storage/file/${storageId}`;
    }

    if (download) {
      url += '?download=true';
    }

    return url;
  }

  async deleteFile(storageId) {
    this.sdk.validateParams(
      { storageId },
      {
        storageId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/storage/file/${storageId}`, 'DELETE');
    return result;
  }

  async getStorageClassifications() {
    const result = await this.sdk._fetch('/storage/classifications', 'GET');
    return result;
  }

  async getFileInfo(storageId) {
    this.sdk.validateParams(
      { storageId },
      {
        storageId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/storage/file/${storageId}/info`, 'GET');
    return result;
  }

  async updateFileMetadata(storageId, metadata) {
    this.sdk.validateParams(
      { storageId, metadata },
      {
        storageId: { type: 'string', required: true },
        metadata: { type: 'object', required: true },
      },
    );

    const params = {
      body: { metadata },
    };

    const result = await this.sdk._fetch(`/storage/file/${storageId}/metadata`, 'PUT', params);
    return result;
  }

  async listFiles(options = {}) {
    const { classification, limit, offset, orderBy, orderDirection } = options;

    // Validate optional parameters
    const validationSchema = {};
    if ('classification' in options) validationSchema.classification = { type: 'string' };
    if ('limit' in options) validationSchema.limit = { type: 'number' };
    if ('offset' in options) validationSchema.offset = { type: 'number' };
    if ('orderBy' in options) validationSchema.orderBy = { type: 'string' };
    if ('orderDirection' in options) validationSchema.orderDirection = { type: 'string' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(options, validationSchema);
    }

    const params = {
      query: options,
    };

    const result = await this.sdk._fetch('/storage/files', 'GET', params);
    return result;
  }
}