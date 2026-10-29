/**
 * Procedural harmonic audio synthesizer for VIP Event & Artist Anthems.
 * Generates valid 16-bit PCM RIFF WAV audio buffers with musical progressions,
 * harmonic brass/strings chords, rhythmic percussion, and dynamic filters.
 */

export interface AnthemAudioOptions {
  durationSeconds?: number;
  genre?: string;
  bpm?: number;
  title?: string;
}

export function synthesizeProceduralAnthemWav(options: AnthemAudioOptions): { buffer: Buffer; mimeType: string } {
  const sampleRate = 22050; // 22.05 kHz for fast generation and crisp fidelity
  const numChannels = 1;
  const bitsPerSample = 16;
  const duration = Math.min(Math.max(options.durationSeconds || 20, 8), 45);
  const totalSamples = Math.floor(sampleRate * duration);
  const bpm = options.bpm || 120;
  const genre = (options.genre || 'cinematic').toLowerCase();

  // Root frequencies for progression (e.g. D Minor / C Major / Epic Fanfare)
  // Base chord progressions in Hz
  let chordProgression: number[][] = [];
  if (genre.includes('bollywood') || genre.includes('maharashtra')) {
    // Phrygian / Bhairav inspired heroic modal progression: D (146.83), Eb (155.56), F# (185.0), A (220.0)
    chordProgression = [
      [146.83, 220.0, 293.66, 370.0], // D + A + D5 + F#
      [155.56, 196.0, 293.66, 392.0], // Eb + G + D + G5
      [185.0, 220.0, 277.18, 440.0],  // F# + A + C# + A5
      [146.83, 220.0, 293.66, 440.0], // D + A + D5 + A5
    ];
  } else if (genre.includes('runway') || genre.includes('lounge') || genre.includes('house')) {
    // Luxury Deep House / Runway: F minor 9th (F, Ab, C, Eb, G)
    chordProgression = [
      [87.31, 174.61, 261.63, 311.13], // F, F2, C4, Eb4
      [103.83, 207.65, 261.63, 329.63], // Ab, Ab2, C4, E4
      [116.54, 233.08, 293.66, 349.23], // Bb, Bb2, D4, F4
      [130.81, 196.00, 246.94, 392.00], // C, G3, B3, G4
    ];
  } else {
    // Epic Orchestral Red Carpet Fanfare: Triumphant C Major / G Major / A minor / F Major
    chordProgression = [
      [130.81, 196.00, 261.63, 329.63], // C, G, C4, E4
      [98.00, 146.83, 196.00, 293.66],  // G, D, G3, D4
      [110.00, 164.81, 220.00, 261.63], // A, E, A3, C4
      [87.31, 130.81, 174.61, 220.00],  // F, C, F3, A3
    ];
  }

  const pcmData = Buffer.alloc(totalSamples * 2);
  const secondsPerBeat = 60 / bpm;
  const beatsPerChord = 4;
  const secondsPerChord = secondsPerBeat * beatsPerChord;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const chordIndex = Math.floor((t / secondsPerChord) % chordProgression.length);
    const chord = chordProgression[chordIndex];
    const beatPhase = (t % secondsPerBeat) / secondsPerBeat;

    // Harmonic synthesis: Sum multiple oscillators with envelopes
    let sample = 0;

    // 1. Warm Sub Bass & Root Tone
    const rootFreq = chord[0];
    sample += 0.28 * Math.sin(2 * Math.PI * rootFreq * t);
    sample += 0.12 * Math.sin(2 * Math.PI * (rootFreq * 2) * t);

    // 2. Rich Strings & Brass Pad (chord notes with vibrato)
    const vibrato = 1 + 0.003 * Math.sin(2 * Math.PI * 5.5 * t);
    for (let c = 1; c < chord.length; c++) {
      const freq = chord[c] * vibrato;
      // Sawtooth-like harmonic richness
      sample += 0.10 * Math.sin(2 * Math.PI * freq * t);
      sample += 0.05 * Math.sin(2 * Math.PI * (freq * 2) * t);
      sample += 0.025 * Math.sin(2 * Math.PI * (freq * 3) * t);
    }

    // 3. High Shimmer Arpeggio / Melodic Fanfare
    const arpSpeed = 4; // 16th notes
    const arpIndex = Math.floor((t / (secondsPerBeat / arpSpeed)) % chord.length);
    const arpFreq = chord[arpIndex] * 2;
    const arpEnv = Math.exp(-3 * ((t % (secondsPerBeat / arpSpeed)) / (secondsPerBeat / arpSpeed)));
    sample += 0.14 * arpEnv * Math.sin(2 * Math.PI * arpFreq * t);

    // 4. Percussive Rhythm & Kick/Dhol transient on beat
    const kickEnv = Math.exp(-14 * beatPhase);
    const kickFreq = 50 + 80 * Math.exp(-25 * beatPhase);
    const kick = 0.22 * kickEnv * Math.sin(2 * Math.PI * kickFreq * t);
    sample += kick;

    // Snare / Clapper on beat 2 & 4
    const beatNumber = Math.floor(t / secondsPerBeat) % 4;
    if (beatNumber === 1 || beatNumber === 3) {
      const snareEnv = Math.exp(-18 * beatPhase);
      const noise = (Math.random() * 2 - 1) * 0.12 * snareEnv;
      sample += noise;
    }

    // Master Envelope (Fade in and Fade out)
    const fadeIn = Math.min(t / 1.5, 1);
    const fadeOut = Math.min((duration - t) / 2.0, 1);
    sample *= fadeIn * fadeOut;

    // Soft Limiter / Saturation
    sample = Math.tanh(sample * 1.3);

    // Write 16-bit signed PCM
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    pcmData.writeInt16LE(intSample, i * 2);
  }

  // Build RIFF WAV Header (44 bytes)
  const header = Buffer.alloc(44);
  const dataByteLength = pcmData.length;
  const totalFileLength = dataByteLength + 36;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  header.write('RIFF', 0);
  header.writeUInt32LE(totalFileLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  header.writeUInt16LE(1, 20);  // AudioFormat 1 = PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataByteLength, 40);

  const fullWavBuffer = Buffer.concat([header, pcmData]);
  return {
    buffer: fullWavBuffer,
    mimeType: 'audio/wav',
  };
}
