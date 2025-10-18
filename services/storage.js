export class StorageService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  // Private helper method to detect content type from filename
  _getContentType(fileName) {
    if (!fileName) return 'application/octet-stream';

    try {
      // Try to use mime-types package if available
      const mime = import('mime-types');
      return mime.lookup
        ? mime.lookup(fileName) || 'application/octet-stream'
        : this._getFallbackContentType(fileName);
    } catch (error) {
      return this._getFallbackContentType(fileName);
    }
  }

  // Private fallback content type detection
  _getFallbackContentType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const commonTypes = {
      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      odt: 'application/vnd.oasis.opendocument.text',
      ods: 'application/vnd.oasis.opendocument.spreadsheet',
      odp: 'application/vnd.oasis.opendocument.presentation',
      rtf: 'application/rtf',
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      ico: 'image/x-icon',
      tiff: 'image/tiff',
      tif: 'image/tiff',
      psd: 'image/vnd.adobe.photoshop',
      raw: 'image/x-canon-cr2',
      heic: 'image/heic',
      heif: 'image/heif',
      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      flac: 'audio/flac',
      aac: 'audio/aac',
      ogg: 'audio/ogg',
      wma: 'audio/x-ms-wma',
      m4a: 'audio/mp4',
      opus: 'audio/opus',
      // Video
      mp4: 'video/mp4',
      avi: 'video/avi',
      mkv: 'video/mkv',
      mov: 'video/quicktime',
      wmv: 'video/x-ms-wmv',
      flv: 'video/x-flv',
      webm: 'video/webm',
      // Archives
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      tar: 'application/x-tar',
      gz: 'application/gzip',
      // Text
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      xml: 'application/xml',
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      // Other
      sql: 'application/sql',
      log: 'text/plain',
    };
    return commonTypes[ext] || 'application/octet-stream';
  }

  // Private helper to create FormData for Node.js environment
  _createNodeFormData(file, fileName, formFields) {
    const boundary = `----formdata-${Date.now()}-${Math.random().toString(36)}`;
    const CRLF = '\r\n';
    let body = '';

    // Add file field with proper MIME type detection
    const contentType = this._getContentType(fileName);

    body += `--${boundary}${CRLF}`;
    body += `Content-Disposition: form-data; name="files"; filename="${
      fileName || 'file'
    }"${CRLF}`;
    body += `Content-Type: ${contentType}${CRLF}${CRLF}`;

    // Convert to buffers and combine
    const headerBuffer =
      typeof Buffer !== 'undefined'
        ? Buffer.from(body, 'utf8')
        : new TextEncoder().encode(body);
    const fileBuffer =
      typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(file)
        ? file
        : typeof Buffer !== 'undefined'
          ? Buffer.from(file)
          : new TextEncoder().encode(file);

    // Add form fields
    let fieldsBuffer =
      typeof Buffer !== 'undefined' ? Buffer.alloc(0) : new Uint8Array(0);
    for (const [name, value] of formFields) {
      const fieldData = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}`;
      const fieldDataBuffer =
        typeof Buffer !== 'undefined'
          ? Buffer.from(fieldData, 'utf8')
          : new TextEncoder().encode(fieldData);
      if (typeof Buffer !== 'undefined') {
        fieldsBuffer = Buffer.concat([fieldsBuffer, fieldDataBuffer]);
      } else {
        const newBuffer = new Uint8Array(
          fieldsBuffer.length + fieldDataBuffer.length,
        );
        newBuffer.set(fieldsBuffer);
        newBuffer.set(fieldDataBuffer, fieldsBuffer.length);
        fieldsBuffer = newBuffer;
      }
    }

    // Final boundary
    const endBoundary =
      typeof Buffer !== 'undefined'
        ? Buffer.from(`${CRLF}--${boundary}--${CRLF}`, 'utf8')
        : new TextEncoder().encode(`${CRLF}--${boundary}--${CRLF}`);

    // Combine all parts
    let formData;
    if (typeof Buffer !== 'undefined') {
      formData = Buffer.concat([
        headerBuffer,
        fileBuffer,
        fieldsBuffer,
        endBoundary,
      ]);
    } else {
      const totalLength =
        headerBuffer.length +
        fileBuffer.length +
        fieldsBuffer.length +
        endBoundary.length;
      formData = new Uint8Array(totalLength);
      let offset = 0;
      formData.set(headerBuffer, offset);
      offset += headerBuffer.length;
      formData.set(fileBuffer, offset);
      offset += fileBuffer.length;
      formData.set(fieldsBuffer, offset);
      offset += fieldsBuffer.length;
      formData.set(endBoundary, offset);
    }

    return {
      formData,
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
    };
  }

  // Private helper to create FormData for browser environment
  _createBrowserFormData(file, fileName, formFields) {
    const formData = new FormData();

    // Add the file - handle both Buffer and File objects
    if (
      typeof Buffer !== 'undefined' &&
      Buffer.isBuffer &&
      Buffer.isBuffer(file)
    ) {
      const blob = new Blob([file]);
      formData.append('files', blob, fileName || 'file');
    } else if (file instanceof File) {
      formData.append('files', file);
    } else {
      throw new Error(
        'In browser environment, file must be a Buffer or File object',
      );
    }

    // Add other parameters
    for (const [name, value] of formFields) {
      formData.append(name, value);
    }

    return {
      formData,
      headers: {}, // Let browser handle content-type automatically
    };
  }

  // Shared upload logic
  async _performUpload(
    file,
    fileName,
    formFields,
    endpoint = '/storage/upload',
    method = 'POST',
  ) {
    const isNode = typeof window === 'undefined';
    let formData, headers;

    if (isNode) {
      const result = this._createNodeFormData(file, fileName, formFields);
      formData = result.formData;
      headers = result.headers;
    } else {
      const result = this._createBrowserFormData(file, fileName, formFields);
      formData = result.formData;
      headers = result.headers;
    }

    const params = {
      body: formData,
      headers,
    };

    return await this.sdk._fetch(endpoint, method, params, true);
  }

  async upload({
    classification = 'generic',
    folder,
    fileName,
    file,
    isPublic = false,
    country = 'US',
    expireAfter,
    relatedId,
    createAccessKey = false,
    accessKeyExpiresIn,
  }) {
    this.sdk.validateParams(
      {
        classification,
        folder,
        fileName,
        file,
        isPublic,
        country,
        expireAfter,
        relatedId,
        createAccessKey,
        accessKeyExpiresIn,
      },
      {
        classification: { type: 'string', required: false },
        folder: { type: 'string', required: false },
        fileName: { type: 'string', required: false },
        file: { type: 'object', required: true },
        isPublic: { type: 'boolean', required: false },
        country: { type: 'string', required: false },
        expireAfter: { type: 'string', required: false },
        relatedId: { type: 'string', required: false },
        createAccessKey: { type: 'boolean', required: false },
        accessKeyExpiresIn: { type: 'string', required: false },
      },
    );

    // Build form fields
    const formFields = [];
    if (classification) formFields.push(['classification', classification]);
    if (folder) formFields.push(['folder', folder]);
    if (isPublic !== undefined)
      formFields.push(['isPublic', isPublic.toString()]);
    if (country) formFields.push(['country', country]);
    if (expireAfter) formFields.push(['expireAfter', expireAfter]);
    if (relatedId) formFields.push(['relatedId', relatedId]);
    if (createAccessKey !== undefined)
      formFields.push(['createAccessKey', createAccessKey.toString()]);
    if (accessKeyExpiresIn)
      formFields.push(['accessKeyExpiresIn', accessKeyExpiresIn]);

    return this._performUpload(file, fileName, formFields);
  }

  async uploadFiles(files, options = {}) {
    const { classification, expireAfter, isPublic, metadata } = options;

    // Validate files parameter
    if (!files) {
      throw new Error('Files parameter is required');
    }

    // Handle different file input formats and convert to array for processing
    let fileArray = [];

    if (typeof window !== 'undefined' && files instanceof FormData) {
      throw new Error(
        'FormData input not supported for uploadFiles. Use individual File objects or FileList.',
      );
    } else if (typeof window !== 'undefined' && files instanceof FileList) {
      // Browser FileList
      for (let i = 0; i < files.length; i++) {
        fileArray.push({ file: files[i], fileName: files[i].name });
      }
    } else if (Array.isArray(files)) {
      // File array (Node.js or Browser)
      fileArray = files.map((file, index) => ({
        file,
        fileName: file.name || `file-${index}`,
      }));
    } else if (
      typeof files === 'object' &&
      (files.path || files instanceof File)
    ) {
      // Single file object (Node.js) or File (Browser)
      fileArray = [
        { file: files, fileName: files.name || files.path || 'file' },
      ];
    } else {
      throw new Error(
        'Invalid files format. Expected FileList, File array, or File object',
      );
    }

    // For multiple files, we need to handle them individually since our shared helper is for single files
    // We could enhance the shared helper for multiple files, but for now let's use the existing approach
    const isNode = typeof window === 'undefined';
    let formData;
    const headers = {};

    if (isNode) {
      // Node.js: Create multipart form data manually
      const boundary = `----formdata-${Date.now()}-${Math.random().toString(
        36,
      )}`;
      const CRLF = '\r\n';
      const body = '';

      const bufferParts = [];

      // Add all files
      for (const { file, fileName } of fileArray) {
        const contentType = this._getContentType(fileName);
        const fileHeader = `--${boundary}${CRLF}Content-Disposition: form-data; name="files"; filename="${fileName}"${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`;

        bufferParts.push(Buffer.from(fileHeader, 'utf8'));
        bufferParts.push(Buffer.isBuffer(file) ? file : Buffer.from(file));
        bufferParts.push(Buffer.from(CRLF, 'utf8'));
      }

      // Add form fields
      const formFields = [];
      if (classification) formFields.push(['classification', classification]);
      if (expireAfter) formFields.push(['expireAfter', expireAfter]);
      if (isPublic !== undefined)
        formFields.push(['isPublic', isPublic.toString()]);
      if (metadata) formFields.push(['metadata', JSON.stringify(metadata)]);

      for (const [name, value] of formFields) {
        const fieldData = `--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}${CRLF}`;
        bufferParts.push(Buffer.from(fieldData, 'utf8'));
      }

      // Final boundary
      bufferParts.push(Buffer.from(`--${boundary}--${CRLF}`, 'utf8'));

      formData = Buffer.concat(bufferParts);
      headers['content-type'] = `multipart/form-data; boundary=${boundary}`;
    } else {
      // Browser: Use native FormData
      formData = new FormData();

      // Add all files
      for (const { file, fileName } of fileArray) {
        formData.append('files', file, fileName);
      }

      // Add optional parameters
      if (classification) formData.append('classification', classification);
      if (expireAfter) formData.append('expireAfter', expireAfter);
      if (isPublic !== undefined)
        formData.append('isPublic', isPublic.toString());
      if (metadata) formData.append('metadata', JSON.stringify(metadata));
    }

    const params = {
      body: formData,
      headers,
    };

    return await this.sdk._fetch('/storage/upload', 'POST', params, true);
  }

  async getFile(storageId, path, download = false) {
    this.sdk.validateParams(
      { storageId, path },
      {
        storageId: { type: 'string', required: false },
        download: { type: 'boolean', required: false },
        path: { type: 'string', require: false },
      },
    );

    const params = { returnRawResponse: true };
    if (download) {
      params.query = { download: 'true' };
    }

    let url = `/storage/${storageId}`;
    if (path) {
      url += `/storage/${path.startsWith('/') ? path.slice(1) : path}`;
    }

    const result = await this.sdk._fetch(url, 'GET', params, true);
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
      url = `${this.sdk.baseURL}/storage/${storageId}`;
    } else {
      url = `${this.sdk.fullUrl}/storage/${storageId}`;
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

    const result = await this.sdk._fetch(
      `/storage/file/${storageId}`,
      'DELETE',
    );
    return result;
  }

  async getStorageClassifications() {
    const result = await this.sdk._fetch('/storage/classifications', 'GET');
    return result;
  }

  async uploadProfileImage({ file, classification = 'user_images', fileName }) {
    this.sdk.validateParams(
      { file, classification },
      {
        file: { type: 'object', required: true },
        classification: { type: 'string', required: true },
        fileName: { type: 'string', required: false },
      },
    );

    // Validate classification
    const validClassifications = ['user_images', 'account_logo'];
    if (!validClassifications.includes(classification)) {
      throw new Error(
        'Invalid classification. Must be "user_images" or "account_logo"',
      );
    }

    // Build form fields exactly like the regular upload but only include classification
    const formFields = [];
    formFields.push(['classification', classification]);

    // Use the correct profile image endpoint with proper FormData
    return this._performUpload(
      file,
      fileName || 'profile-image.jpg',
      formFields,
      '/storage/upload-profile-image',
    );
  }

  async getFileInfo(storageId) {
    this.sdk.validateParams(
      { storageId },
      {
        storageId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/storage/file/${storageId}/info`,
      'GET',
    );
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

    const result = await this.sdk._fetch(
      `/storage/file/${storageId}/metadata`,
      'PUT',
      params,
    );
    return result;
  }

  async listFiles(options = {}) {
    const { classification, folder, limit, offset, orderBy, orderDirection } =
      options;

    // Validate optional parameters
    const validationSchema = {};
    if ('classification' in options)
      validationSchema.classification = { type: 'string' };
    if ('folder' in options) validationSchema.folder = { type: 'string' };
    if ('limit' in options) validationSchema.limit = { type: 'number' };
    if ('offset' in options) validationSchema.offset = { type: 'number' };
    if ('orderBy' in options) validationSchema.orderBy = { type: 'string' };
    if ('orderDirection' in options)
      validationSchema.orderDirection = { type: 'string' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(options, validationSchema);
    }

    const params = {
      query: options,
    };

    const result = await this.sdk._fetch('/storage/files', 'GET', params);
    return result;
  }

  /**
   * Generate an access key for an existing storage file
   * @param {string} fileId - The storage file ID
   * @param {number} expiresIn - Access key expiration time in seconds (default: 1800 = 30 minutes)
   * @returns {Promise<Object>} Object containing access key, URL, and expiration info
   */
  async generateAccessKey(fileId, expiresIn = 1800) {
    this.sdk.validateParams(
      { fileId, expiresIn },
      {
        fileId: { type: 'string', required: true },
        expiresIn: { type: 'number', required: false },
      },
    );

    const params = {
      body: { expiresIn },
    };

    const result = await this.sdk._fetch(
      `/storage/${fileId}/accessKey`,
      'POST',
      params,
    );
    return result;
  }

  /**
   * List storage configurations with optional filtering
   * @param {Object} options - Filter options
   * @param {string} options.classification - Filter by classification
   * @param {string} options.country - Filter by country
   * @param {boolean} options.isSystem - Filter by system/custom configs
   * @param {boolean} options.includeGlobal - Include global configurations (default: true)
   * @returns {Promise<Object>} Object containing configurations and summary
   */
  async listStorageConfigurations(options = {}) {
    const { classification, country, isSystem, includeGlobal } = options;

    // Validate optional parameters
    const validationSchema = {};
    if ('classification' in options)
      validationSchema.classification = { type: 'string' };
    if ('country' in options) validationSchema.country = { type: 'string' };
    if ('isSystem' in options) validationSchema.isSystem = { type: 'boolean' };
    if ('includeGlobal' in options)
      validationSchema.includeGlobal = { type: 'boolean' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(options, validationSchema);
    }

    const params = {
      query: options,
    };

    const result = await this.sdk._fetch(
      '/storage/configurations',
      'GET',
      params,
    );
    return result;
  }

  /**
   * Create a new custom storage configuration
   * @param {Object} config - Configuration data
   * @param {string} config.classification - Configuration classification
   * @param {string} config.country - Country code
   * @param {Array} config.s3Regions - S3 regions array
   * @param {Array} config.gccRegions - Google Cloud regions array
   * @param {Array} config.azureRegions - Azure regions array
   * @param {number} config.minimumProviders - Minimum number of providers (default: 1)
   * @param {number} config.minimumRegionsS3 - Minimum S3 regions (default: 1)
   * @param {number} config.minimumRegionsGCC - Minimum GCC regions (default: 1)
   * @param {number} config.minimumRegionsAzure - Minimum Azure regions (default: 1)
   * @returns {Promise<Object>} Created configuration object
   */
  async createStorageConfiguration(config) {
    const {
      classification,
      country,
      s3Regions,
      gccRegions,
      azureRegions,
      minimumProviders,
      minimumRegionsS3,
      minimumRegionsGCC,
      minimumRegionsAzure,
    } = config;

    this.sdk.validateParams(config, {
      classification: { type: 'string', required: true },
      country: { type: 'string', required: true },
      s3Regions: { type: 'object', required: false },
      gccRegions: { type: 'object', required: false },
      azureRegions: { type: 'object', required: false },
      minimumProviders: { type: 'number', required: false },
      minimumRegionsS3: { type: 'number', required: false },
      minimumRegionsGCC: { type: 'number', required: false },
      minimumRegionsAzure: { type: 'number', required: false },
    });

    const params = {
      body: config,
    };

    const result = await this.sdk._fetch(
      '/storage/configurations',
      'POST',
      params,
    );
    return result;
  }

  /**
   * Update an existing storage configuration
   * System configurations have limited update capabilities (only regions and minimum levels)
   * Custom configurations can update all fields
   * @param {string} id - Configuration ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated configuration object
   */
  async updateStorageConfiguration(id, updates) {
    this.sdk.validateParams(
      { id, updates },
      {
        id: { type: 'string', required: true },
        updates: { type: 'object', required: true },
      },
    );

    const params = {
      body: updates,
    };

    const result = await this.sdk._fetch(
      `/storage/configurations/${id}`,
      'PUT',
      params,
    );
    return result;
  }

  /**
   * Delete a custom storage configuration
   * System configurations cannot be deleted
   * @param {string} id - Configuration ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteStorageConfiguration(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/storage/configurations/${id}`,
      'DELETE',
    );
    return result;
  }

  /**
   * Update file contents and metadata
   * @param {string} storageId - Storage file ID (required)
   * @param {Object} params - Update parameters
   * @param {Object} [params.file] - New file content (Buffer, File, or binary data)
   * @param {string} [params.fileName] - New file name
   * @param {string} [params.classification] - New classification
   * @param {string} [params.folder] - New folder path
   * @param {boolean} [params.isPublic] - Public access setting
   * @param {string} [params.country] - Country setting
   * @param {string} [params.expireAfter] - Expiration setting
   * @param {string} [params.relatedId] - Related record ID
   * @returns {Promise<Object>} Updated file details
   */
  async updateFile(
    storageId,
    {
      file,
      fileName,
      classification,
      folder,
      isPublic,
      country,
      expireAfter,
      relatedId,
    },
  ) {
    this.sdk.validateParams(
      { storageId },
      {
        storageId: { type: 'string', required: true },
        file: { type: 'object', required: false },
        fileName: { type: 'string', required: false },
        classification: { type: 'string', required: false },
        folder: { type: 'string', required: false },
        isPublic: { type: 'boolean', required: false },
        country: { type: 'string', required: false },
        expireAfter: { type: 'string', required: false },
        relatedId: { type: 'string', required: false },
      },
    );

    if (file) {
      // If updating file content, use multipart form data
      const formFields = [];
      if (classification) formFields.push(['classification', classification]);
      if (folder) formFields.push(['folder', folder]);
      if (fileName) formFields.push(['fileName', fileName]);
      if (isPublic !== undefined)
        formFields.push(['isPublic', isPublic.toString()]);
      if (country) formFields.push(['country', country]);
      if (expireAfter) formFields.push(['expireAfter', expireAfter]);
      if (relatedId) formFields.push(['relatedId', relatedId]);

      return this._performUpload(
        file,
        fileName,
        formFields,
        `/storage/${storageId}`,
        'PUT',
      );
    } else {
      // If only updating metadata, use JSON request
      const updateData = {};
      if (fileName !== undefined) updateData.fileName = fileName;
      if (classification !== undefined)
        updateData.classification = classification;
      if (folder !== undefined) updateData.folder = folder;
      if (isPublic !== undefined) updateData.isPublic = isPublic;
      if (country !== undefined) updateData.country = country;
      if (expireAfter !== undefined) updateData.expireAfter = expireAfter;
      if (relatedId !== undefined) updateData.relatedId = relatedId;

      const options = {
        body: updateData,
      };

      const result = await this.sdk._fetch(
        `/storage/${storageId}`,
        'PUT',
        options,
      );
      return result;
    }
  }
}
