#!/usr/bin/env node
/**
 * Genera efectos de sonido cortos y suaves (tonos sinusoidales con fundido) en assets/sounds/*.wav.
 * Uso: npm run sounds. No usa archivos de terceros, así que no hay problemas de licencia.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');
const RATE = 22050;
const VOLUME = 0.32;
const FADE_SECONDS = 0.012;

/** Cada sonido es una secuencia de notas [frecuencia Hz, duración s]. */
const SOUNDS = {
  correct: [
    [659.25, 0.08],
    [987.77, 0.14],
  ],
  wrong: [
    [392.0, 0.1],
    [311.13, 0.16],
  ],
  complete: [
    [523.25, 0.09],
    [659.25, 0.09],
    [783.99, 0.09],
    [1046.5, 0.22],
  ],
};

function renderNotes(notes) {
  const samples = [];
  for (const [frequency, seconds] of notes) {
    const length = Math.round(seconds * RATE);
    const fade = Math.round(FADE_SECONDS * RATE);
    for (let i = 0; i < length; i += 1) {
      const envelope = Math.min(1, i / fade, (length - i) / fade);
      samples.push(Math.sin((2 * Math.PI * frequency * i) / RATE) * VOLUME * envelope);
    }
  }
  return samples;
}

function toWav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((value, index) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), index * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

try {
  mkdirSync(OUT, { recursive: true });
  for (const [name, notes] of Object.entries(SOUNDS)) {
    writeFileSync(join(OUT, `${name}.wav`), toWav(renderNotes(notes)));
    process.stdout.write(`✔ assets/sounds/${name}.wav\n`);
  }
} catch (error) {
  process.stderr.write(`No se pudieron generar los sonidos: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
