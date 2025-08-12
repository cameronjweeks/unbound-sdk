export class RecordTypesService {
  constructor(sdk) {
    this.sdk = sdk;
    this.user = new UserRecordTypeDefaultsService(sdk);
  }

  async create({ name, description, create, update, read, delete: deleteUsers }) {
    this.sdk.validateParams(
      { name, description },
      {
        name: { type: 'string', required: true },
        description: { type: 'string', required: true },
        create: { type: 'array', required: false },
        update: { type: 'array', required: false },
        read: { type: 'array', required: false },
        delete: { type: 'array', required: false },
      },
    );

    const recordTypeData = { name, description };
    if (create) recordTypeData.create = create;
    if (update) recordTypeData.update = update;
    if (read) recordTypeData.read = read;
    if (deleteUsers) recordTypeData.delete = deleteUsers;

    const params = {
      body: recordTypeData,
    };

    const result = await this.sdk._fetch('/recordTypes/', 'POST', params);
    return result;
  }

  async update(id, { name, description, remove, add }) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
        name: { type: 'string', required: false },
        description: { type: 'string', required: false },
        remove: { type: 'object', required: false },
        add: { type: 'object', required: false },
      },
    );

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (remove) updateData.remove = remove;
    if (add) updateData.add = add;

    const params = {
      body: updateData,
    };

    const result = await this.sdk._fetch(`/recordTypes/${id}`, 'PUT', params);
    return result;
  }

  async delete(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/recordTypes/${id}`, 'DELETE');
    return result;
  }

  async get(id) {
    this.sdk.validateParams(
      { id },
      {
        id: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(`/recordTypes/${id}`, 'GET');
    return result;
  }

  async list() {
    const result = await this.sdk._fetch('/recordTypes/', 'GET');
    return result;
  }
}

export class UserRecordTypeDefaultsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({ recordTypeId, object, userId }) {
    this.sdk.validateParams(
      { recordTypeId, object },
      {
        recordTypeId: { type: 'string', required: true },
        object: { type: 'string', required: true },
        userId: { type: 'string', required: false },
      },
    );

    const defaultData = { recordTypeId, object };
    if (userId) defaultData.userId = userId;

    const params = {
      body: defaultData,
    };

    const result = await this.sdk._fetch('/recordTypes/user/', 'POST', params);
    return result;
  }

  async update({ recordTypeId, object, userId }) {
    this.sdk.validateParams(
      { recordTypeId, object },
      {
        recordTypeId: { type: 'string', required: true },
        object: { type: 'string', required: true },
        userId: { type: 'string', required: false },
      },
    );

    const updateData = { recordTypeId, object };
    if (userId) updateData.userId = userId;

    const params = {
      body: updateData,
    };

    const result = await this.sdk._fetch('/recordTypes/user/', 'PUT', params);
    return result;
  }

  async delete({ object, userId }) {
    this.sdk.validateParams(
      { object },
      {
        object: { type: 'string', required: true },
        userId: { type: 'string', required: false },
      },
    );

    const deleteData = { object };
    if (userId) deleteData.userId = userId;

    const params = {
      body: deleteData,
    };

    const result = await this.sdk._fetch('/recordTypes/user/', 'DELETE', params);
    return result;
  }

  async get({ object, userId }) {
    this.sdk.validateParams(
      { object },
      {
        object: { type: 'string', required: true },
        userId: { type: 'string', required: false },
      },
    );

    const params = {
      query: { object, userId },
    };

    const result = await this.sdk._fetch('/recordTypes/user/', 'GET', params);
    return result;
  }
}