export class AIService {
  constructor(sdk) {
    this.sdk = sdk;
    this.generative = new GenerativeService(sdk);
    this.tts = new TextToSpeechService(sdk);
  }
}

export class GenerativeService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async chat({
    prompt,
    messages,
    relatedId,
    model,
    temperature,
    subscriptionId,
    stream,
    method,
  }) {
    this.sdk.validateParams(
      { method },
      {
        prompt: { type: 'string', required: false },
        messages: { type: 'array', required: false },
        relatedId: { type: 'string', required: false },
        model: { type: 'string', required: false },
        temperature: { type: 'number', required: false },
        subscriptionId: { type: 'string', required: false },
        stream: { type: 'boolean', required: false },
        method: { type: 'string', required: true },
      },
    );

    const params = {
      body: {
        prompt,
        messages,
        relatedId,
        model,
        temperature,
        subscriptionId,
        stream,
        method,
      },
    };

    const result = await this.sdk._fetch('/ai/generative/chat', 'POST', params);
    return result;
  }

  async playbook({
    prompt,
    messages,
    relatedId,
    model,
    temperature,
    subscriptionId,
    stream,
    playbookId,
    sessionId,
  }) {
    this.sdk.validateParams(
      { playbookId },
      {
        prompt: { type: 'string', required: false },
        messages: { type: 'array', required: false },
        relatedId: { type: 'string', required: false },
        model: { type: 'string', required: false },
        temperature: { type: 'number', required: false },
        subscriptionId: { type: 'string', required: false },
        stream: { type: 'boolean', required: false },
        playbookId: { type: 'string', required: true },
        sessionId: { type: 'string', required: false },
      },
    );

    const params = {
      body: {
        prompt,
        messages,
        relatedId,
        model,
        temperature,
        subscriptionId,
        stream,
        playbookId,
        sessionId,
      },
    };

    const result = await this.sdk._fetch(
      '/ai/generative/playbook',
      'POST',
      params,
    );
    return result;
  }

  async chatOllama({
    prompt,
    messages,
    relatedId,
    model,
    temperature,
    subscriptionId,
    stream,
    method,
  }) {
    this.sdk.validateParams(
      { method },
      {
        prompt: { type: 'string', required: false },
        messages: { type: 'array', required: false },
        relatedId: { type: 'string', required: false },
        model: { type: 'string', required: false },
        temperature: { type: 'number', required: false },
        subscriptionId: { type: 'string', required: false },
        stream: { type: 'boolean', required: false },
        method: { type: 'string', required: true },
      },
    );

    const params = {
      body: {
        prompt,
        messages,
        relatedId,
        model,
        temperature,
        subscriptionId,
        stream,
        method,
      },
    };

    const result = await this.sdk._fetch(
      '/ai/generative/ollama',
      'POST',
      params,
    );
    return result;
  }
}

export class TextToSpeechService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create({
    text,
    voice,
    languageCode,
    ssmlGender,
    audioEncoding,
    speakingRate,
    pitch,
    volumeGainDb,
    effectsProfileIds,
  }) {
    this.sdk.validateParams(
      { text },
      {
        text: { type: 'string', required: true },
        voice: { type: 'string', required: false },
        languageCode: { type: 'string', required: false },
        ssmlGender: { type: 'string', required: false },
        audioEncoding: { type: 'string', required: false },
        speakingRate: { type: 'number', required: false },
        pitch: { type: 'number', required: false },
        volumeGainDb: { type: 'number', required: false },
        effectsProfileIds: { type: 'array', required: false },
      },
    );

    const ttsData = { text };
    if (voice) ttsData.voice = voice;
    if (languageCode) ttsData.languageCode = languageCode;
    if (ssmlGender) ttsData.ssmlGender = ssmlGender;
    if (audioEncoding) ttsData.audioEncoding = audioEncoding;
    if (speakingRate) ttsData.speakingRate = speakingRate;
    if (pitch) ttsData.pitch = pitch;
    if (volumeGainDb) ttsData.volumeGainDb = volumeGainDb;
    if (effectsProfileIds) ttsData.effectsProfileIds = effectsProfileIds;

    const params = {
      body: ttsData,
    };

    const result = await this.sdk._fetch('/ai/tts', 'POST', params);
    return result;
  }
}
