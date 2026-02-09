/**
 * STT Streaming Example
 *
 * This example demonstrates the simplified Speech-to-Text streaming API
 * using the new EventEmitter-based interface.
 */

import { initializeSdk } from '../index.js';
import fs from 'fs';

async function main() {
  // Initialize SDK
  const sdk = await initializeSdk({
    token: 'your-api-token',
  });

  // Create streaming transcription session
  console.log('Creating STT stream...');
  const stream = await sdk.ai.stt.stream({
    engine: 'google',
    model: 'phone_call',
    languageCode: 'en-US',
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    interimResults: true,
    enableAutomaticPunctuation: true,
  });

  // Handle events
  stream.on('ready', () => {
    console.log('Stream ready for audio');
  });

  stream.on('transcript', (result) => {
    const prefix = result.isFinal ? '[FINAL]' : '[interim]';
    console.log(`${prefix} ${result.text} (confidence: ${result.confidence})`);
  });

  stream.on('error', (error) => {
    console.error('Stream error:', error);
  });

  stream.on('close', () => {
    console.log('Stream closed');
  });

  // Example 1: Stream from file
  console.log('\n--- Streaming from file ---');
  const audioFile = fs.createReadStream('audio.wav');

  audioFile.on('data', (chunk) => {
    stream.write(chunk);
  });

  audioFile.on('end', () => {
    console.log('File streaming complete');
    stream.end();
  });

  // Example 2: Stream from buffer chunks
  // console.log('\n--- Streaming from buffer chunks ---');
  // const audioBuffer = fs.readFileSync('audio.wav');
  // const chunkSize = 8192;
  //
  // for (let i = 0; i < audioBuffer.length; i += chunkSize) {
  //   const chunk = audioBuffer.slice(i, i + chunkSize);
  //   stream.write(chunk);
  // }
  // stream.end();

  // Example 3: Stream from RTP/Media Manager
  // mediaManager.on('audio', (pcmData) => {
  //   stream.write(pcmData);
  // });
  //
  // call.on('end', () => {
  //   stream.end();
  // });

  // Later: Retrieve full transcript from database (automatic storage)
  // const savedTranscript = await sdk.ai.stt.get(stream.sessionId);
  // console.log('Saved transcript:', savedTranscript);
}

// Run example
main().catch(console.error);
