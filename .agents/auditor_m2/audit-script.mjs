import fs from 'fs';
import path from 'path';

// Load .env.local from fai
const envLocalPath = path.resolve(process.cwd(), '.env.local');
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

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../fai/src/lib/firebase.js';
import * as telegram from '../../fai/src/lib/telegram.js';
import * as gemini from '../../fai/src/lib/gemini.js';
import * as session from '../../fai/src/lib/telegramSession.js';

async function runForensicAudit() {
  console.log('====================================================');
  console.log('AUDITOR M2 FORENSIC INTEGRITY CHECKS');
  console.log('====================================================\n');

  const findings = [];

  // --- CHECK 1: Base64 Purge Verification in Firestore 'posts' ---
  console.log('--- CHECK 1: Base64 Purge in Firestore Collection "posts" ---');
  try {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    console.log(`Total posts found in Firestore: ${snapshot.size}`);

    let base64Count = 0;
    const sampleImages = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const img = data.image || '';
      if (typeof img === 'string' && (img.startsWith('data:image') || img.includes(';base64,'))) {
        base64Count++;
        console.error(`[VIOLATION] Doc ID ${docSnap.id} contains Base64 in 'image' field!`);
      }
      // Check contentHtml
      const content = data.contentHtml || '';
      if (typeof content === 'string' && content.includes('data:image')) {
        base64Count++;
        console.error(`[VIOLATION] Doc ID ${docSnap.id} contains Base64 in 'contentHtml' field!`);
      }

      if (img && sampleImages.length < 5) {
        sampleImages.push({ id: docSnap.id, imagePrefix: img.slice(0, 60) });
      }
    });

    console.log('Sample image URLs in posts:');
    sampleImages.forEach((s) => console.log(`  * Doc ${s.id}: ${s.imagePrefix}...`));

    if (base64Count === 0) {
      console.log(`[PASS] Zero Base64 strings detected across all ${snapshot.size} posts in Firestore.`);
      findings.push({ name: 'Base64 Purge in Firestore', pass: true, count: snapshot.size });
    } else {
      console.error(`[FAIL] Found ${base64Count} Base64 instances in posts!`);
      findings.push({ name: 'Base64 Purge in Firestore', pass: false, count: base64Count });
    }
  } catch (err) {
    console.error(`[ERROR] Firestore query failed: ${err.message}`);
    findings.push({ name: 'Base64 Purge in Firestore', pass: false, error: err.message });
  }

  // --- CHECK 2: Code Authenticity & Facade Detection ---
  console.log('\n--- CHECK 2: Code Authenticity & Facade Detection ---');
  const filesToAudit = [
    'src/lib/telegram.js',
    'src/lib/gemini.js',
    'src/lib/telegramSession.js',
    'src/app/api/telegram/webhook/route.js',
  ];

  let facadeViolation = false;

  for (const relPath of filesToAudit) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`[FAIL] File missing: ${relPath}`);
      facadeViolation = true;
      continue;
    }

    const code = fs.readFileSync(fullPath, 'utf8');

    // Check for dummy stubs
    if (code.includes('TODO') && code.includes('return null')) {
      console.error(`[VIOLATION] Suspicious stub in ${relPath}`);
      facadeViolation = true;
    }

    // Specific checks
    if (relPath.endsWith('telegram.js')) {
      const hasFetch = code.includes('fetch(url') || code.includes('fetch(downloadUrl');
      const hasBaseUrl = code.includes('https://api.telegram.org');
      if (!hasFetch || !hasBaseUrl) {
        console.error(`[VIOLATION] telegram.js does not connect to real Telegram API!`);
        facadeViolation = true;
      } else {
        console.log(`[PASS] ${relPath} authentic Telegram API integration verified.`);
      }
    }

    if (relPath.endsWith('gemini.js')) {
      const hasGoogleGenAI = code.includes('@google/genai') && code.includes('GoogleGenAI');
      const hasModel = code.includes('gemini-2.5-flash');
      const hasSchema = code.includes('ARTICLE_OPTIONS_SCHEMA') && code.includes('option1') && code.includes('option2');
      if (!hasGoogleGenAI || !hasModel || !hasSchema) {
        console.error(`[VIOLATION] gemini.js missing authentic GoogleGenAI SDK integration or schema!`);
        facadeViolation = true;
      } else {
        console.log(`[PASS] ${relPath} authentic Gemini 2.5 Flash SDK integration verified.`);
      }
    }

    if (relPath.endsWith('telegramSession.js')) {
      const hasFirestore = code.includes('firebase/firestore') && code.includes('telegram_sessions');
      if (!hasFirestore) {
        console.error(`[VIOLATION] telegramSession.js does not use Firestore 'telegram_sessions'!`);
        facadeViolation = true;
      } else {
        console.log(`[PASS] ${relPath} authentic Firestore session management verified.`);
      }
    }

    if (relPath.endsWith('route.js')) {
      const hasSecretCheck = code.includes('x-telegram-bot-api-secret-token') && code.includes('401');
      const hasWhitelistCheck = code.includes('TELEGRAM_ALLOWED_USER_ID') || code.includes('isUserAllowed');
      const hasPipeline = code.includes('processImage') && code.includes('uploadToStorage') && code.includes('createPost');
      if (!hasSecretCheck || !hasWhitelistCheck || !hasPipeline) {
        console.error(`[VIOLATION] route.js missing required pipeline or security checks!`);
        facadeViolation = true;
      } else {
        console.log(`[PASS] ${relPath} authentic webhook route, security, and publishing flow verified.`);
      }
    }
  }

  findings.push({ name: 'Code Authenticity & Facade Check', pass: !facadeViolation });

  // --- CHECK 3: Live Functionality Verification ---
  console.log('\n--- CHECK 3: Independent Module Tests ---');
  try {
    // Test Telegram Client exports
    const tgFns = ['sendMessage', 'sendPhoto', 'answerCallbackQuery', 'editMessageText', 'getFile', 'downloadFileBuffer'];
    const missingTg = tgFns.filter((fn) => typeof telegram[fn] !== 'function');
    const tgPass = missingTg.length === 0;
    console.log(`- Telegram client exports: ${tgPass ? 'PASS' : 'FAIL'}`);

    // Test Gemini generator API key guard
    let geminiGuardPass = false;
    try {
      await gemini.generateArticleOptions(null, null, 'Test note', { apiKey: '' });
    } catch (e) {
      if (e.message.includes('GEMINI_API_KEY is missing')) {
        geminiGuardPass = true;
      }
    }
    console.log(`- Gemini API key guard: ${geminiGuardPass ? 'PASS' : 'FAIL'}`);

    // Test Telegram Session CRUD
    const testChatId = 'audit_session_test_999';
    await session.setTelegramSession(testChatId, { step: 'AUDIT_TEST', testVal: 12345 });
    const s1 = await session.getTelegramSession(testChatId);
    const s1Pass = s1 && s1.step === 'AUDIT_TEST' && s1.testVal === 12345;
    await session.clearTelegramSession(testChatId);
    const s2 = await session.getTelegramSession(testChatId);
    const s2Pass = s2 === null;
    const sessionPass = s1Pass && s2Pass;
    console.log(`- Firestore session lifecycle: ${sessionPass ? 'PASS' : 'FAIL'}`);

    findings.push({
      name: 'Independent Module Functionality',
      pass: tgPass && geminiGuardPass && sessionPass,
    });
  } catch (err) {
    console.error(`[ERROR] Live module test failed: ${err.message}`);
    findings.push({ name: 'Independent Module Functionality', pass: false, error: err.message });
  }

  console.log('\n====================================================');
  console.log('AUDIT FINDINGS SUMMARY');
  console.log('====================================================');
  let overallClean = true;
  findings.forEach((f) => {
    console.log(`[${f.pass ? 'PASS' : 'FAIL'}] ${f.name}`);
    if (!f.pass) overallClean = false;
  });
  console.log(`FINAL VERDICT: ${overallClean ? 'CLEAN' : 'INTEGRITY VIOLATION'}`);
  console.log('====================================================');

  if (!overallClean) process.exit(1);
}

runForensicAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
