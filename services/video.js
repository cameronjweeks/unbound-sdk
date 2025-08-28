export class VideoService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async clearToken() {
    const params = {};
    const result = await this.sdk._fetch(
      `/video/clearVideoToken`,
      'POST',
      params,
      true,
    );
    return result;
  }

  async joinRoom(room, password, email) {
    this.sdk.validateParams(
      { room, password, email },
      {
        room: { type: 'string', required: true },
        password: { type: 'string', required: false },
        email: { type: 'string', required: false },
      },
    );

    const params = {
      body: {
        password,
        email,
        tokenType: 'cookie',
      },
    };
    const result = await this.sdk._fetch(`/video/${room}/join`, 'POST', params);
    return result;
  }

  async updateParticipant(roomId, participantId, update) {
    this.sdk.validateParams(
      { roomId, participantId, update },
      {
        roomId: { type: 'string', required: true },
        participantId: { type: 'string', required: true },
        update: { type: 'object', required: true },
      },
    );
    const params = {
      body: {
        ...update,
      },
    };
    const result = await this.sdk._fetch(
      `/video/${roomId}/${participantId}`,
      'PUT',
      params,
    );
    return result;
  }

  async removeParticipant(roomId, participantId) {
    this.sdk.validateParams(
      { roomId, participantId },
      {
        roomId: { type: 'string', required: true },
        participantId: { type: 'string', required: true },
      },
    );
    const params = {
      body: {
        participantId,
      },
    };
    const result = await this.sdk._fetch(
      `/video/${roomId}/leave`,
      'DELETE',
      params,
    );
    return result;
  }

  async leaveRoom(roomId) {
    this.sdk.validateParams(
      { roomId },
      {
        roomId: { type: 'string', required: true },
      },
    );
    const params = {};
    const result = await this.sdk._fetch(
      `/video/${roomId}/leave`,
      'DELETE',
      params,
    );
    return result;
  }

  async mute(
    roomId,
    participantId,
    mediaType,
    isMute,
    noDevice = false,
    streamCreation = false,
  ) {
    this.sdk.validateParams(
      { roomId, participantId, mediaType, isMute, noDevice, streamCreation },
      {
        roomId: { type: 'string', required: true },
        participantId: { type: 'string', required: true },
        mediaType: { type: 'string', required: true }, // camera, microphone
        isMute: { type: 'boolean', required: true },
        noDevice: { type: 'boolean', required: false },
        streamCreation: { type: 'boolean', required: false },
      },
    );
    const params = {
      body: {
        isMute,
        noDevice,
        streamCreation,
      },
    };
    const result = await this.sdk._fetch(
      `/video/${roomId}/${participantId}/mute/${mediaType}`,
      'PUT',
      params,
    );
    return result;
  }

  async createRoom({
    name,
    password,
    startTime,
    endTime,
    duration,
    durationUnit,
    timezone,
    waitingRoom,
    hosts,
    participants,
    startCameraMuted,
    startCameraMutedAfter,
    startMicrophoneMuted,
    startMicrophoneMutedAfter,
  }) {
    this.sdk.validateParams(
      {
        name,
        password,
        startTime,
        endTime,
        duration,
        durationUnit,
        timezone,
        waitingRoom,
        hosts,
        participants,
        startCameraMuted,
        startCameraMutedAfter,
        startMicrophoneMuted,
        startMicrophoneMutedAfter,
      },
      {
        name: { type: 'string', required: false },
        password: { type: 'string', required: false },
        startTime: { type: 'string', required: false },
        endTime: { type: 'string', required: false },
        duration: { type: 'number', required: false },
        durationUnit: { type: 'string', required: false },
        timezone: { type: 'string', required: false },
        waitingRoom: { type: 'boolean', required: false },
        hosts: { type: 'array', required: false },
        participants: { type: 'array', required: false },
        startCameraMuted: { type: 'boolean', required: false },
        startCameraMutedAfter: { type: 'number', required: false },
        startMicrophoneMuted: { type: 'boolean', required: false },
        startMicrophoneMutedAfter: { type: 'number', required: false },
      },
    );
    const params = {
      body: {
        name,
        password,
        startTime,
        endTime,
        duration,
        durationUnit,
        timezone,
        waitingRoom,
        hosts,
        participants,
        startCameraMuted,
        startCameraMutedAfter,
        startMicrophoneMuted,
        startMicrophoneMutedAfter,
      },
    };
    const result = await this.sdk._fetch(`/video`, 'POST', params);
    return result;
  }

  async updateRoom(roomId, update) {
    this.sdk.validateParams(
      { roomId, update },
      {
        roomId: { type: 'string', required: true },
        update: { type: 'object', required: true },
      },
    );

    // Validate specific update fields if they exist
    const validationSchema = {};
    if ('name' in update) validationSchema.name = { type: 'string' };
    if ('password' in update) validationSchema.password = { type: 'string' };
    if ('startTime' in update) validationSchema.startTime = { type: 'string' };
    if ('endTime' in update) validationSchema.endTime = { type: 'string' };
    if ('timezone' in update) validationSchema.timezone = { type: 'string' };
    if ('waitingRoom' in update)
      validationSchema.waitingRoom = { type: 'boolean' };
    if ('hosts' in update) validationSchema.hosts = { type: 'array' };
    if ('participants' in update)
      validationSchema.participants = { type: 'array' };
    if ('startCameraMuted' in update)
      validationSchema.startCameraMuted = { type: 'boolean' };
    if ('startCameraMutedAfter' in update)
      validationSchema.startCameraMutedAfter = { type: 'number' };
    if ('startMicrophoneMuted' in update)
      validationSchema.startMicrophoneMuted = { type: 'boolean' };
    if ('startMicrophoneMutedAfter' in update)
      validationSchema.startMicrophoneMutedAfter = { type: 'number' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(update, validationSchema);
    }

    const params = {
      body: {
        ...update,
      },
    };
    const result = await this.sdk._fetch(`/video/${roomId}`, 'PUT', params);
    return result;
  }

  async placeCall(roomId, phoneNumber, callerIdNumber) {
    this.sdk.validateParams(
      { roomId, phoneNumber, callerIdNumber },
      {
        roomId: { type: 'string', required: true },
        phoneNumber: { type: 'string', required: true },
        callerIdNumber: { type: 'string', required: false },
      },
    );

    const params = {
      body: {
        phoneNumber,
        callerIdNumber,
      },
    };
    const result = await this.sdk._fetch(
      `/video/${roomId}/placeOutboundCall`,
      'POST',
      params,
    );
    return result;
  }

  async listMeetings(options = {}) {
    // Validate optional parameters
    const validationSchema = {};
    if ('startDate' in options) validationSchema.startDate = { type: 'string' };
    if ('endDate' in options) validationSchema.endDate = { type: 'string' };
    if ('limit' in options) validationSchema.limit = { type: 'number' };
    if ('offset' in options) validationSchema.offset = { type: 'number' };

    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(options, validationSchema);
    }

    const params = {
      query: options,
    };

    const result = await this.sdk._fetch('/video/meetings', 'GET', params);
    return result;
  }

  async getMeetingAnalytics(roomId, params = {}) {
    this.sdk.validateParams(
      { roomId },
      {
        roomId: { type: 'string', required: true },
      },
    );

    // Validate optional parameters
    const validationSchema = {};
    if ('participantId' in params)
      validationSchema.participantId = { type: 'string' };
    if ('startTime' in params) validationSchema.startTime = { type: 'string' };
    if ('endTime' in params) validationSchema.endTime = { type: 'string' };
    if ('granularity' in params)
      validationSchema.granularity = { type: 'string' };
    if ('timezone' in params) validationSchema.timezone = { type: 'string' };
    if (Object.keys(validationSchema).length > 0) {
      this.sdk.validateParams(params, validationSchema);
    }

    const options = {
      query: params,
    };

    const result = await this.sdk._fetch(
      `/video/meetings/${roomId}/analytics`,
      'GET',
      options,
    );
    return result;
  }

  async deleteRoom(roomId) {
    this.sdk.validateParams(
      { roomId },
      {
        roomId: { type: 'string', required: true },
      },
    );
    const params = {};
    const result = await this.sdk._fetch(`/video/${roomId}`, 'DELETE', params);
    return result;
  }

  async addParticipant(roomId, participant) {
    this.sdk.validateParams(
      { roomId, participant },
      {
        roomId: { type: 'string', required: true },
        participant: { type: 'object', required: true },
      },
    );

    const params = {
      body: participant,
    };

    const result = await this.sdk._fetch(
      `/video/${roomId}/participants`,
      'POST',
      params,
    );
    return result;
  }

  async closeRoom(roomId) {
    this.sdk.validateParams(
      { roomId },
      {
        roomId: { type: 'string', required: true },
      },
    );

    const params = {};
    const result = await this.sdk._fetch(
      `/video/${roomId}/close`,
      'POST',
      params,
    );
    return result;
  }

  async validateGuestToken(token) {
    this.sdk.validateParams(
      { token },
      {
        token: { type: 'string', required: true },
      },
    );

    const params = {
      body: { token },
    };

    const result = await this.sdk._fetch(
      '/video/validateGuestToken',
      'POST',
      params,
    );
    return result;
  }

  async logStats(roomId, stats) {
    this.sdk.validateParams(
      { roomId, stats },
      {
        roomId: { type: 'string', required: true },
        stats: { type: 'object', required: true },
      },
    );

    const params = {
      body: stats,
    };

    const result = await this.sdk._fetch(
      `/video/${roomId}/stats`,
      'POST',
      params,
    );
    return result;
  }
}
