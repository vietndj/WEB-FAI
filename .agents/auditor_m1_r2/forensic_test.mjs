import { createRequire } from 'module';
import crypto from 'crypto';
import path from 'path';

const faiRoot = '/Users/vietmac/Documents/CODE/WEB- FAI/fai';
const require = createRequire(path.join(faiRoot, 'package.json'));
const sharp = require('sharp');

const { processImage } = await import(path.join(faiRoot, 'src/lib/imageProcessor.js'));
const { generateStorageKey, getR2Client } = await import(path.join(faiRoot, 'src/lib/cloudStorage.js'));

console.log('=== AUDITOR INDEPENDENT FORENSIC TEST SUITE ===');

// Check 1: Custom arbitrary dimensions (1733x1147)
console.log('\n--- CHECK 1: Custom arbitrary dimensions (1733x1147) ---');
const raw1 = await sharp({
  create: { width: 1733, height: 1147, channels: 3, background: { r: 12, g: 140, b: 200 } }
}).png().toBuffer();

const res1 = await processImage(raw1, { watermark: true });
console.log(`Input: 1733x1147 -> Output: ${res1.width}x${res1.height}, format: ${res1.format}, bytes: ${res1.sizeBytes}`);
if (res1.width > 1600) throw new Error('Width exceeds 1600!');
if (res1.format !== 'webp') throw new Error('Format is not webp!');
if (res1.sizeBytes >= 358400) throw new Error('Size exceeds 350KB!');
console.log('CHECK 1: PASSED');

// Check 2: Extreme tiny image (45x45) - must not crash watermark composite
console.log('\n--- CHECK 2: Extreme tiny image (45x45) ---');
const raw2 = await sharp({
  create: { width: 45, height: 45, channels: 3, background: { r: 255, g: 100, b: 50 } }
}).png().toBuffer();

const res2 = await processImage(raw2, { watermark: true });
console.log(`Input: 45x45 -> Output: ${res2.width}x${res2.height}, format: ${res2.format}, bytes: ${res2.sizeBytes}`);
if (res2.width !== 45 || res2.height !== 45) throw new Error('Tiny image dimensions unexpectedly altered!');
console.log('CHECK 2: PASSED');

// Check 3: Watermark disabled explicitly
console.log('\n--- CHECK 3: Watermark disabled flag (watermark: false) ---');
const res3 = await processImage(raw1, { watermark: false });
console.log(`Watermark disabled output: ${res3.width}x${res3.height}, bytes: ${res3.sizeBytes}`);
console.log('CHECK 3: PASSED');

// Check 4: Storage key generation entropy and format
console.log('\n--- CHECK 4: Storage key generation ---');
const key1 = generateStorageKey('My Photo Title 2026!.PNG', 'webp');
const key2 = generateStorageKey('My Photo Title 2026!.PNG', 'webp');
console.log(`Key 1: ${key1}`);
console.log(`Key 2: ${key2}`);
if (key1 === key2) throw new Error('Storage keys must have random entropy and not collide!');
if (!key1.startsWith('fai/posts/')) throw new Error('Storage key prefix violation!');
if (!key1.endsWith('.webp')) throw new Error('Storage key extension violation!');
console.log('CHECK 4: PASSED');

// Check 5: Verify Sharp output buffer integrity by re-parsing with sharp
console.log('\n--- CHECK 5: Re-parse output WebP buffer with Sharp ---');
const parsed = await sharp(res1.buffer).metadata();
console.log(`Parsed metadata: format=${parsed.format}, width=${parsed.width}, height=${parsed.height}`);
if (parsed.format !== 'webp') throw new Error('Sharp could not verify webp buffer format!');
if (parsed.width !== res1.width || parsed.height !== res1.height) throw new Error('Buffer dimensions mismatch metadata!');
console.log('CHECK 5: PASSED');

console.log('\n=== ALL AUDITOR INDEPENDENT FORENSIC TESTS COMPLETED SUCCESSFULLY ===');
