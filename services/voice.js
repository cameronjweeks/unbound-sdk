export class VoiceService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async createCall({ to, from, connectionId, callerId, timeout, machineDetection, machineDetectionTimeout, recordingChannels, record, recordingFormat, recordingTrack, recordingMaxLength, transcribe, transcribeLanguage, webhookUrl, commandId, clientState, customHeaders, sipAuthUsername, sipAuthPassword, sipTransport, sipHeaders, ringTimeout, answeringMachineDetection, detectWordOrPhrase, billingGroupId, answerUrl, answerMethod }) {
    this.sdk.validateParams(
      { to },
      {
        to: { type: 'string', required: true },
        from: { type: 'string', required: false },
        connectionId: { type: 'string', required: false },
        callerId: { type: 'string', required: false },
        timeout: { type: 'number', required: false },
        machineDetection: { type: 'boolean', required: false },
        machineDetectionTimeout: { type: 'number', required: false },
        recordingChannels: { type: 'string', required: false },
        record: { type: 'boolean', required: false },
        recordingFormat: { type: 'string', required: false },
        recordingTrack: { type: 'string', required: false },
        recordingMaxLength: { type: 'number', required: false },
        transcribe: { type: 'boolean', required: false },
        transcribeLanguage: { type: 'string', required: false },
        webhookUrl: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
        clientState: { type: 'string', required: false },
        customHeaders: { type: 'array', required: false },
        sipAuthUsername: { type: 'string', required: false },
        sipAuthPassword: { type: 'string', required: false },
        sipTransport: { type: 'string', required: false },
        sipHeaders: { type: 'array', required: false },
        ringTimeout: { type: 'number', required: false },
        answeringMachineDetection: { type: 'string', required: false },
        detectWordOrPhrase: { type: 'string', required: false },
        billingGroupId: { type: 'string', required: false },
        answerUrl: { type: 'string', required: false },
        answerMethod: { type: 'string', required: false },
      },
    );

    const callData = { to };
    if (from) callData.from = from;
    if (connectionId) callData.connectionId = connectionId;
    if (callerId) callData.callerId = callerId;
    if (timeout) callData.timeout = timeout;
    if (machineDetection !== undefined) callData.machineDetection = machineDetection;
    if (machineDetectionTimeout) callData.machineDetectionTimeout = machineDetectionTimeout;
    if (recordingChannels) callData.recordingChannels = recordingChannels;
    if (record !== undefined) callData.record = record;
    if (recordingFormat) callData.recordingFormat = recordingFormat;
    if (recordingTrack) callData.recordingTrack = recordingTrack;
    if (recordingMaxLength) callData.recordingMaxLength = recordingMaxLength;
    if (transcribe !== undefined) callData.transcribe = transcribe;
    if (transcribeLanguage) callData.transcribeLanguage = transcribeLanguage;
    if (webhookUrl) callData.webhookUrl = webhookUrl;
    if (commandId) callData.commandId = commandId;
    if (clientState) callData.clientState = clientState;
    if (customHeaders) callData.customHeaders = customHeaders;
    if (sipAuthUsername) callData.sipAuthUsername = sipAuthUsername;
    if (sipAuthPassword) callData.sipAuthPassword = sipAuthPassword;
    if (sipTransport) callData.sipTransport = sipTransport;
    if (sipHeaders) callData.sipHeaders = sipHeaders;
    if (ringTimeout) callData.ringTimeout = ringTimeout;
    if (answeringMachineDetection) callData.answeringMachineDetection = answeringMachineDetection;
    if (detectWordOrPhrase) callData.detectWordOrPhrase = detectWordOrPhrase;
    if (billingGroupId) callData.billingGroupId = billingGroupId;
    if (answerUrl) callData.answerUrl = answerUrl;
    if (answerMethod) callData.answerMethod = answerMethod;

    const params = {
      body: callData,
    };

    const result = await this.sdk._fetch('/voice/calls', 'POST', params);
    return result;
  }

  async hangup(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const hangupData = {};
    if (clientState) hangupData.clientState = clientState;
    if (commandId) hangupData.commandId = commandId;

    const params = {
      body: hangupData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/hangup`, 'POST', params);
    return result;
  }

  async hold(callControlId, audioUrl, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        audioUrl: { type: 'string', required: false },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const holdData = {};
    if (audioUrl) holdData.audioUrl = audioUrl;
    if (clientState) holdData.clientState = clientState;
    if (commandId) holdData.commandId = commandId;

    const params = {
      body: holdData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/hold`, 'POST', params);
    return result;
  }

  async unhold(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const unholdData = {};
    if (clientState) unholdData.clientState = clientState;
    if (commandId) unholdData.commandId = commandId;

    const params = {
      body: unholdData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/unhold`, 'POST', params);
    return result;
  }

  async mute(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const muteData = {};
    if (clientState) muteData.clientState = clientState;
    if (commandId) muteData.commandId = commandId;

    const params = {
      body: muteData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/mute`, 'POST', params);
    return result;
  }

  async unmute(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const unmuteData = {};
    if (clientState) unmuteData.clientState = clientState;
    if (commandId) unmuteData.commandId = commandId;

    const params = {
      body: unmuteData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/unmute`, 'POST', params);
    return result;
  }

  async sendDtmf(callControlId, dtmf, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId, dtmf },
      {
        callControlId: { type: 'string', required: true },
        dtmf: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const dtmfData = { dtmf };
    if (clientState) dtmfData.clientState = clientState;
    if (commandId) dtmfData.commandId = commandId;

    const params = {
      body: dtmfData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/send_dtmf`, 'POST', params);
    return result;
  }

  async record(callControlId, recordingChannels, recordingFormat, recordingMaxLength, recordingTerminators, recordingBeep, recordingPlayBeep, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        recordingChannels: { type: 'string', required: false },
        recordingFormat: { type: 'string', required: false },
        recordingMaxLength: { type: 'number', required: false },
        recordingTerminators: { type: 'string', required: false },
        recordingBeep: { type: 'boolean', required: false },
        recordingPlayBeep: { type: 'boolean', required: false },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const recordData = {};
    if (recordingChannels) recordData.recordingChannels = recordingChannels;
    if (recordingFormat) recordData.recordingFormat = recordingFormat;
    if (recordingMaxLength) recordData.recordingMaxLength = recordingMaxLength;
    if (recordingTerminators) recordData.recordingTerminators = recordingTerminators;
    if (recordingBeep !== undefined) recordData.recordingBeep = recordingBeep;
    if (recordingPlayBeep !== undefined) recordData.recordingPlayBeep = recordingPlayBeep;
    if (clientState) recordData.clientState = clientState;
    if (commandId) recordData.commandId = commandId;

    const params = {
      body: recordData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/record_start`, 'POST', params);
    return result;
  }

  async stopRecording(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const stopData = {};
    if (clientState) stopData.clientState = clientState;
    if (commandId) stopData.commandId = commandId;

    const params = {
      body: stopData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/record_stop`, 'POST', params);
    return result;
  }

  async transcribe(callControlId, transcriptionEngine, transcriptionLanguage, transcriptionFormat, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        transcriptionEngine: { type: 'string', required: false },
        transcriptionLanguage: { type: 'string', required: false },
        transcriptionFormat: { type: 'string', required: false },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const transcribeData = {};
    if (transcriptionEngine) transcribeData.transcriptionEngine = transcriptionEngine;
    if (transcriptionLanguage) transcribeData.transcriptionLanguage = transcriptionLanguage;
    if (transcriptionFormat) transcribeData.transcriptionFormat = transcriptionFormat;
    if (clientState) transcribeData.clientState = clientState;
    if (commandId) transcribeData.commandId = commandId;

    const params = {
      body: transcribeData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/transcription_start`, 'POST', params);
    return result;
  }

  async stopTranscribing(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const stopData = {};
    if (clientState) stopData.clientState = clientState;
    if (commandId) stopData.commandId = commandId;

    const params = {
      body: stopData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/transcription_stop`, 'POST', params);
    return result;
  }

  async transfer(callControlId, to, from, answerUrl, answerMethod, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId, to },
      {
        callControlId: { type: 'string', required: true },
        to: { type: 'string', required: true },
        from: { type: 'string', required: false },
        answerUrl: { type: 'string', required: false },
        answerMethod: { type: 'string', required: false },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const transferData = { to };
    if (from) transferData.from = from;
    if (answerUrl) transferData.answerUrl = answerUrl;
    if (answerMethod) transferData.answerMethod = answerMethod;
    if (clientState) transferData.clientState = clientState;
    if (commandId) transferData.commandId = commandId;

    const params = {
      body: transferData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/transfer`, 'POST', params);
    return result;
  }

  async createConference({ name, recordingChannels, recordingFormat, recordingMaxLength, recordingTerminators, webhookUrl, commandId, clientState }) {
    this.sdk.validateParams(
      { name },
      {
        name: { type: 'string', required: true },
        recordingChannels: { type: 'string', required: false },
        recordingFormat: { type: 'string', required: false },
        recordingMaxLength: { type: 'number', required: false },
        recordingTerminators: { type: 'string', required: false },
        webhookUrl: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
        clientState: { type: 'string', required: false },
      },
    );

    const conferenceData = { name };
    if (recordingChannels) conferenceData.recordingChannels = recordingChannels;
    if (recordingFormat) conferenceData.recordingFormat = recordingFormat;
    if (recordingMaxLength) conferenceData.recordingMaxLength = recordingMaxLength;
    if (recordingTerminators) conferenceData.recordingTerminators = recordingTerminators;
    if (webhookUrl) conferenceData.webhookUrl = webhookUrl;
    if (commandId) conferenceData.commandId = commandId;
    if (clientState) conferenceData.clientState = clientState;

    const params = {
      body: conferenceData,
    };

    const result = await this.sdk._fetch('/voice/conferences', 'POST', params);
    return result;
  }

  async joinConference(callControlId, conferenceId, startConferenceOnEnter, endConferenceOnExit, muted, hold, holdAudioUrl, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId, conferenceId },
      {
        callControlId: { type: 'string', required: true },
        conferenceId: { type: 'string', required: true },
        startConferenceOnEnter: { type: 'boolean', required: false },
        endConferenceOnExit: { type: 'boolean', required: false },
        muted: { type: 'boolean', required: false },
        hold: { type: 'boolean', required: false },
        holdAudioUrl: { type: 'string', required: false },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const joinData = { conferenceId };
    if (startConferenceOnEnter !== undefined) joinData.startConferenceOnEnter = startConferenceOnEnter;
    if (endConferenceOnExit !== undefined) joinData.endConferenceOnExit = endConferenceOnExit;
    if (muted !== undefined) joinData.muted = muted;
    if (hold !== undefined) joinData.hold = hold;
    if (holdAudioUrl) joinData.holdAudioUrl = holdAudioUrl;
    if (clientState) joinData.clientState = clientState;
    if (commandId) joinData.commandId = commandId;

    const params = {
      body: joinData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/conference_join`, 'POST', params);
    return result;
  }

  async leaveConference(callControlId, clientState, commandId) {
    this.sdk.validateParams(
      { callControlId },
      {
        callControlId: { type: 'string', required: true },
        clientState: { type: 'string', required: false },
        commandId: { type: 'string', required: false },
      },
    );

    const leaveData = {};
    if (clientState) leaveData.clientState = clientState;
    if (commandId) leaveData.commandId = commandId;

    const params = {
      body: leaveData,
    };

    const result = await this.sdk._fetch(`/voice/calls/${callControlId}/actions/conference_leave`, 'POST', params);
    return result;
  }
}