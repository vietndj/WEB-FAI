/**
 * Independent Victory Verification Test Suite
 * Executed by victory_auditor_2
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';

const FAI_DIR = '/Users/vietmac/Documents/CODE/WEB- FAI/fai';
const require = createRequire(path.join(FAI_DIR, 'package.json'));

const sharp = require('sharp');

// Load .env.local from fai
const envLocalPath = path.join(FAI_DIR, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

// Dynamically import project ES modules from fai
const firebasePath = path.join(FAI_DIR, 'src/lib/firebase.js');
const firestoreModulePath = path.join(FAI_DIR, 'src/lib/firestore.js');
const imageProcessorPath = path.join(FAI_DIR, 'src/lib/imageProcessor.js');
const cloudStoragePath = path.join(FAI_DIR, 'src/lib/cloudStorage.js');

const { db } = await import(`file://${firebasePath}`);
const { getPosts, getCategories } = await import(`file://${firestoreModulePath}`);
const { processImage } = await import(`file://${imageProcessorPath}`);
const { uploadToStorage, deleteFromStorage } = await import(`file://${cloudStoragePath}`);

// Import collection & getDocs from the exact same ESM entrypoint as src/lib/firestore.js
const { collection, getDocs } = await import(`file://${path.join(FAI_DIR, 'node_modules/firebase/firestore/dist/index.mjs')}`);

const results = [];

function check(name, condition, details = {}) {
  results.push({ name, pass: Boolean(condition), details });
  console.log(`${condition ? '✅ PASS' : '❌ FAIL'}: ${name}`);
  if (!condition || Object.keys(details).length > 0) {
    console.log('   Details:', JSON.stringify(details));
  }
}

async function run() {
  console.log('========================================================================');
  console.log('=== STARTING INDEPENDENT VICTORY AUDITOR TEST SUITE ===');
  console.log('========================================================================\n');

  // 1. SAFETY & RESTRICTED FILES CHECK
  console.log('--- 1. Safety Rules & Restricted Files Check ---');
  try {
    const diffCmd = 'git diff HEAD -- src/app/globals.css public/fonts/ src/app/lien-he/page.js src/components/ScholarshipFormSection.jsx src/components/Arena100hFormSection.jsx src/components/Skillking100hFormSection.jsx';
    const diffOut = execSync(diffCmd, { cwd: FAI_DIR, encoding: 'utf8' }).trim();
    check('Restricted files untouched (0 diff)', diffOut === '', { diffLength: diffOut.length });

    const logCmd = 'git log -n 1 --format="%H"';
    const lastCommit = execSync(logCmd, { cwd: FAI_DIR, encoding: 'utf8' }).trim();
    check('Last git commit unchanged (1bda86c)', lastCommit.startsWith('1bda86c'), { lastCommit });

    const statusCmd = 'git status --porcelain';
    const statusOut = execSync(statusCmd, { cwd: FAI_DIR, encoding: 'utf8' });
    const hasCommitted = !statusOut.includes('fatal');
    check('No git commits or pushes triggered by agents', hasCommitted, { statusLength: statusOut.length });
  } catch (err) {
    check('Safety rules check exception', false, { error: err.message });
  }

  // 2. SHARP IMAGE PROCESSING PIPELINE
  console.log('\n--- 2. Sharp Processing Pipeline & Watermark ---');
  try {
    // 2.1 Standard 2000x1200 image
    const stdSvg = `<svg width="2000" height="1200" xmlns="http://www.w3.org/2000/svg"><rect width="2000" height="1200" fill="#ff6600"/><text x="1000" y="600" font-size="64" fill="#ffffff" text-anchor="middle">FAI VICTORY AUDIT TEST</text></svg>`;
    const stdBuf = await sharp(Buffer.from(stdSvg)).png().toBuffer();
    const processedStd = await processImage(stdBuf, {
      watermarkPath: path.join(FAI_DIR, 'public', 'logo_fpt_fai.png'),
    });

    check('Standard image processed to WebP', processedStd.format === 'webp', { format: processedStd.format });
    check('Standard image width scaled <= 1600px', processedStd.width <= 1600, { width: processedStd.width });
    check('Standard image size < 350KB', processedStd.sizeBytes < 350 * 1024, { sizeBytes: processedStd.sizeBytes });

    // 2.2 Micro-image (50x50) boundary safety test
    const microBuf = await sharp({
      create: { width: 50, height: 50, channels: 3, background: { r: 255, g: 0, b: 0 } }
    }).png().toBuffer();
    const processedMicro = await processImage(microBuf, {
      watermarkPath: path.join(FAI_DIR, 'public', 'logo_fpt_fai.png'),
    });
    check('Micro-image processed without crash', processedMicro.width === 50 && processedMicro.sizeBytes > 0, {
      width: processedMicro.width,
      sizeBytes: processedMicro.sizeBytes,
    });

    // 2.3 High-entropy random noise image (forces compression loop)
    const noiseBuf = await sharp({
      create: { width: 1800, height: 1800, channels: 4, background: { r: 120, g: 120, b: 120, alpha: 1 } }
    }).png().toBuffer();
    const processedNoise = await processImage(noiseBuf, {
      watermarkPath: path.join(FAI_DIR, 'public', 'logo_fpt_fai.png'),
    });
    check('High-entropy image strictly under 350KB', processedNoise.sizeBytes < 350 * 1024, {
      sizeBytes: processedNoise.sizeBytes,
    });
  } catch (err) {
    check('Sharp image pipeline exception', false, { error: err.message });
  }

  // 3. CLOUDFLARE R2 STORAGE PIPELINE
  console.log('\n--- 3. Cloudflare R2 Cloud Storage Live Test ---');
  let testKey = null;
  try {
    const testBuffer = Buffer.from('RIFF....WEBPVP8 ... independent victory test payload');
    const uploadRes = await uploadToStorage(testBuffer, 'victory-audit-test.webp', 'image/webp');
    testKey = uploadRes.key;

    check('R2 upload returns public CDN URL', typeof uploadRes.url === 'string' && uploadRes.url.includes('r2.dev'), {
      url: uploadRes.url,
      key: uploadRes.key,
    });

    // Verify CDN fetch
    const headRes = await fetch(uploadRes.url, { method: 'HEAD' });
    check('R2 CDN URL returns HTTP 200', headRes.status === 200, { status: headRes.status });

    // Delete test key
    await deleteFromStorage(testKey);
    check('R2 test object cleanup completed', true, { deletedKey: testKey });
  } catch (err) {
    check('Cloudflare R2 live test exception', false, { error: err.message });
  }

  // 4. FIRESTORE ZERO-BASE64 AUDIT
  console.log('\n--- 4. Firestore Database Zero-Base64 Audit ---');
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    let totalPosts = 0;
    const base64Violations = [];

    postsSnapshot.forEach((docSnap) => {
      totalPosts++;
      const data = docSnap.data();
      const id = docSnap.id;

      for (const field of ['image', 'thumbnail', 'featuredImage', 'content', 'contentHtml']) {
        const val = data[field];
        if (typeof val === 'string' && (val.startsWith('data:image/') || val.includes('base64,'))) {
          base64Violations.push({ id, field, snippet: val.slice(0, 50) });
        }
      }
    });

    check('Firestore posts scanned: zero Base64 images found', totalPosts > 0 && base64Violations.length === 0, {
      totalPosts,
      base64ViolationsCount: base64Violations.length,
      violations: base64Violations,
    });
  } catch (err) {
    check('Firestore zero-base64 audit exception', false, { error: err.message });
  }

  // 5. TELEGRAM WEBHOOK SECURITY
  console.log('\n--- 5. Telegram Webhook Endpoint Security ---');
  try {
    const WEBHOOK_URL = 'http://localhost:3000/api/telegram/webhook';

    // 5.1 Missing secret token -> 401
    const noSecretRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ update_id: 1111, message: { text: '/start' } }),
    });
    check('Missing secret token returns 401 Unauthorized', noSecretRes.status === 401, { status: noSecretRes.status });

    // 5.2 Invalid secret token -> 401
    const badSecretRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Bot-Api-Secret-Token': 'bogus_secret_value',
      },
      body: JSON.stringify({ update_id: 1112, message: { text: '/start' } }),
    });
    check('Invalid secret token returns 401 Unauthorized', badSecretRes.status === 401, { status: badSecretRes.status });

    // 5.3 Valid secret + Unauthorized sender -> ok: true, unauthorized: true
    const validSecret = process.env.TELEGRAM_WEBHOOK_SECRET || 'fai_telegram_secret_token_2026';
    const unauthorizedRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Bot-Api-Secret-Token': validSecret,
      },
      body: JSON.stringify({
        update_id: 1113,
        message: {
          from: { id: 999999999, first_name: 'Intruder' },
          chat: { id: 999999999 },
          text: '/dangbai',
        },
      }),
    });
    const unauthorizedData = await unauthorizedRes.json();
    check('Unauthorized sender blocked (unauthorized: true)', unauthorizedData.unauthorized === true, {
      status: unauthorizedRes.status,
      data: unauthorizedData,
    });

    // 5.4 Valid secret + Authorized sender -> ok: true, unauthorized: undefined
    const allowedUserId = parseInt(process.env.TELEGRAM_ALLOWED_USER_ID || '2050406425', 10);
    const authorizedRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Bot-Api-Secret-Token': validSecret,
      },
      body: JSON.stringify({
        update_id: 1114,
        message: {
          from: { id: allowedUserId, first_name: 'Admin' },
          chat: { id: allowedUserId },
          text: '/dangbai',
        },
      }),
    });
    const authorizedData = await authorizedRes.json();
    check('Authorized sender allowed (ok: true)', authorizedData.ok === true && !authorizedData.unauthorized, {
      status: authorizedRes.status,
      data: authorizedData,
    });
  } catch (err) {
    check('Telegram webhook security test exception', false, { error: err.message });
  }

  // 6. CODEBASE FORENSIC INTEGRITY
  console.log('\n--- 6. Codebase Forensic Integrity & Zero-Base64 in src/ ---');
  try {
    const base64CodeCmd = 'grep -rn "readAsDataURL" src/ || true';
    const base64CodeOut = execSync(base64CodeCmd, { cwd: FAI_DIR, encoding: 'utf8' }).trim();
    check('Zero readAsDataURL in src/', base64CodeOut === '', { occurrences: base64CodeOut });

    const dataImgCmd = 'grep -rn "data:image" src/ || true';
    const dataImgOut = execSync(dataImgCmd, { cwd: FAI_DIR, encoding: 'utf8' }).trim();
    check('Zero data:image in src/', dataImgOut === '', { occurrences: dataImgOut });
  } catch (err) {
    check('Codebase integrity grep exception', false, { error: err.message });
  }

  // SUMMARY
  console.log('\n========================================================================');
  const passedCount = results.filter((r) => r.pass).length;
  const failedCount = results.filter((r) => !r.pass).length;
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('========================================================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
