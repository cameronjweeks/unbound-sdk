export class VoiceService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async call({
    to,
    from,
    callerIdName,
    callerIdNumber,
    timeout,
    confirmAnswer,
    app,
    variables,
    engagementSessionId,
    voiceChannelId,
    serverId,
  }) {
    this.sdk.validateParams(
      {},
      {
        to: { type: 'string', required: false },
        from: { type: 'string', required: false },
        callerIdName: { type: 'string', required: false },
        callerIdNumber: { type: 'string', required: false },
        timeout: { type: 'number', required: false },
        confirmAnswer: { type: 'boolean', required: false },
        app: { type: 'object', required: false },
        variables: { type: 'object', required: false },
        engagementSessionId: { type: 'string', required: false },
        voiceChannelId: { type: 'string', required: false },
        serverId: { type: 'string', required: false },
      },
    );

    const callData = {};
    if (to) callData.to = to;
    if (from) callData.from = from;
    if (callerIdName) callData.callerIdName = callerIdName;
    if (callerIdNumber) callData.callerIdNumber = callerIdNumber;
    if (timeout !== undefined) callData.timeout = timeout;
    if (confirmAnswer !== undefined) callData.confirmAnswer = confirmAnswer;
    if (app) callData.app = app;
    if (variables) callData.variables = variables;
    if (engagementSessionId) callData.engagementSessionId = engagementSessionId;
    if (voiceChannelId) callData.voiceChannelId = voiceChannelId;
    if (serverId) callData.serverId = serverId;

    const params = {
      body: callData,
    };

    const result = await this.sdk._fetch('/voice/calls', 'POST', params);
    return result;
  }

  async hangup(voiceChannelId) {
    this.sdk.validateParams(
      { voiceChannelId },
      {
        voiceChannelId: { type: 'string', required: true },
      },
    );

    const result = await this.sdk._fetch(
      `/voice/calls/${voiceChannelId}`,
      'DELETE',
    );
    return result;
  }

  async hold(channels) {
    this.sdk.validateParams(
      { channels },
      {
        channels: { type: 'array', required: true },
      },
    );

    const params = {
      body: { channels },
    };

    const result = await this.sdk._fetch('/voice/calls/hold', 'PUT', params);
    return result;
  }

  async mute(voiceChannelId, action = 'mute', direction = 'in') {
    this.sdk.validateParams(
      { voiceChannelId },
      {
        voiceChannelId: { type: 'string', required: true },
        action: { type: 'string', required: false },
        direction: { type: 'string', required: false },
      },
    );

    const params = {
      body: { action, direction },
    };

    const result = await this.sdk._fetch(
      `/voice/calls/mute/${voiceChannelId}`,
      'PUT',
      params,
    );
    return result;
  }

  async unmute(voiceChannelId, direction = 'in') {
    return this.mute(voiceChannelId, 'unmute', direction);
  }

  async sendDtmf(voiceChannelId, dtmf) {
    this.sdk.validateParams(
      { voiceChannelId, dtmf },
      {
        voiceChannelId: { type: 'string', required: true },
        dtmf: { type: 'string', required: true },
      },
    );

    const params = {
      body: { dtmf },
    };

    const result = await this.sdk._fetch(
      `/voice/calls/dtmf/${voiceChannelId}`,
      'POST',
      params,
    );
    return result;
  }

  async record(voiceChannelId, action = 'start', direction = 'both') {
    this.sdk.validateParams(
      { voiceChannelId },
      {
        voiceChannelId: { type: 'string', required: true },
        action: { type: 'string', required: false },
        direction: { type: 'string', required: false },
      },
    );

    const params = {
      body: { action, direction },
    };

    const result = await this.sdk._fetch(
      `/voice/calls/record/${voiceChannelId}`,
      'POST',
      params,
    );
    return result;
  }

  async stopRecording(voiceChannelId, direction = 'both') {
    return this.record(voiceChannelId, 'stop', direction);
  }

  async pauseRecording(voiceChannelId, direction = 'both') {
    return this.record(voiceChannelId, 'pause', direction);
  }

  async resumeRecording(voiceChannelId, direction = 'both') {
    return this.record(voiceChannelId, 'resume', direction);
  }

  async transcribe(
    voiceChannelId,
    action = 'start',
    direction = 'in',
    forwardText,
    forwardRtp,
  ) {
    this.sdk.validateParams(
      { voiceChannelId },
      {
        voiceChannelId: { type: 'string', required: true },
        action: { type: 'string', required: false },
        direction: { type: 'string', required: false },
        forwardText: { type: 'object', required: false },
        forwardRtp: { type: 'object', required: false },
      },
    );

    const bodyData = { action, direction };
    if (forwardText) bodyData.forwardText = forwardText;
    if (forwardRtp) bodyData.forwardRtp = forwardRtp;

    const params = {
      body: bodyData,
    };

    const result = await this.sdk._fetch(
      `/voice/calls/transcribe/${voiceChannelId}`,
      'POST',
      params,
    );
    return result;
  }

  async stopTranscribing(voiceChannelId, direction = 'in') {
    return this.transcribe(voiceChannelId, 'stop', direction);
  }

  async transfer({
    channels,
    to,
    callerIdName,
    callerIdNumber,
    timeout,
    voiceApp,
  }) {
    this.sdk.validateParams(
      { channels },
      {
        channels: { type: 'array', required: true },
        to: { type: 'string', required: false },
        callerIdName: { type: 'string', required: false },
        callerIdNumber: { type: 'string', required: false },
        timeout: { type: 'number', required: false },
        voiceApp: { type: 'object', required: false },
      },
    );

    const bodyData = { channels };
    if (to) bodyData.to = to;
    if (callerIdName) bodyData.callerIdName = callerIdName;
    if (callerIdNumber) bodyData.callerIdNumber = callerIdNumber;
    if (timeout !== undefined) bodyData.timeout = timeout;
    if (voiceApp) bodyData.voiceApp = voiceApp;

    const params = {
      body: bodyData,
    };

    const result = await this.sdk._fetch(
      '/voice/calls/transfer',
      'POST',
      params,
    );
    return result;
  }

  async conference(channels) {
    this.sdk.validateParams(
      { channels },
      {
        channels: { type: 'array', required: true },
      },
    );

    const params = {
      body: { channels },
    };

    const result = await this.sdk._fetch(
      '/voice/calls/conference',
      'POST',
      params,
    );
    return result;
  }
}
