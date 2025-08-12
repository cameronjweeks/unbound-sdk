export class ObjectsService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async byId(id, query = {}) {
    this.sdk.validateParams(
      { id, query },
      {
        id: { type: 'string', required: true },
        query: { type: 'object', required: false }
      },
    );

    const params = {
      query
    }

    const result = await this.sdk._fetch(`/object/${id}`, 'GET', params);
    return result;
  }

  async query(object, query = {}) {
    this.sdk.validateParams(
      { object, query },
      {
        object: { type: 'string', required: true },
        query: { type: 'object', required: false }
      },
    );

    const params = {
      query,
    }

    const result = await this.sdk._fetch(`/object/query/${object}`, 'GET', params);
    return result;
  }

  async updateById(object, id, update) {
    this.sdk.validateParams(
      { object, id, update },
      {
        object: { type: 'string', required: true },
        id: { type: 'string', required: true },
        update: { type: 'object', required: true }
      },
    );

    const params = {
      body: {
        where: {
          id,
        },
        update,
      },
    }

    const result = await this.sdk._fetch(`/object/${object}`, 'PUT', params);
    return result;
  }

  async update(object, where, update) {
    this.sdk.validateParams(
      { object, where, update },
      {
        object: { type: 'string', required: true },
        where: { type: 'object', required: true },
        update: { type: 'object', required: true }
      },
    );

    const params = {
      body: {
        where,
        update,
      },
    }

    const result = await this.sdk._fetch(`/object/${object}`, 'PUT', params);
    return result;
  }

  async create(object, body = {}) {
    this.sdk.validateParams(
      { object, body },
      {
        object: { type: 'string', required: true },
        body: { type: 'object', required: true }
      },
    );

    const params = {
      body
    }

    const result = await this.sdk._fetch(`/object/${object}`, 'POST', params);
    return result;
  }

  async delete(object, where) {
    this.sdk.validateParams(
      { object, where },
      {
        object: { type: 'string', required: true },
        where: { type: 'object', required: true }
      },
    );

    const params = {
      body: {
        where
      }
    }

    const result = await this.sdk._fetch(`/object/${object}`, 'DELETE', params);
    return result;
  }

  async deleteById(object, id) {
    this.sdk.validateParams(
      { object, id },
      {
        object: { type: 'string', required: true },
        id: { type: 'string', required: true }
      },
    );

    const params = {
      body: {
        where: {
          id
        }
      }
    }

    const result = await this.sdk._fetch(`/object/${object}`, 'DELETE', params);
    return result;
  }

  async describe(object) {
    this.sdk.validateParams(
      { object },
      {
        object: { type: 'string', required: true },
      },
    );

    const params = {
    }

    const result = await this.sdk._fetch(`/object/describe/${object}`, 'GET', params);
    return result;
  }

  async list() {
    const params = {
    }

    const result = await this.sdk._fetch(`/object/`, 'GET', params);
    return result;
  }
}