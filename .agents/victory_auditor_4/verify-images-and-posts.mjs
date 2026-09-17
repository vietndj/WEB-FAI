import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire('/Users/vietmac/Documents/CODE/WEB- FAI/fai/package.json');
const sharp = require('sharp');
const { initializeApp, getApps, getApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Load .env.local from fai
const envPath = '/Users/vietmac/Documents/CODE/WEB- FAI/fai/.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkFirestoreAndImages() {
  console.log('--- 1. Querying ALL documents from Firestore `posts` ---');
  const snap = await getDocs(collection(db, 'posts'));
  console.log(`Total documents found in 'posts': ${snap.size}`);

  let base64Count = 0;
  const targetIds = [
    'wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung',
    'ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep',
    'hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi',
  ];

  const targetDocs = {};

  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const str = JSON.stringify(data);
    if (str.includes('data:image') || str.includes(';base64,')) {
      console.error(`❌ VIOLATION: Document ${docSnap.id} contains Base64 image data!`);
      base64Count++;
    }
    if (targetIds.includes(docSnap.id)) {
      targetDocs[docSnap.id] = data;
    }
  });

  if (base64Count === 0) {
    console.log(`✅ Base64 check PASSED: 0 out of ${snap.size} documents contain Base64!`);
  } else {
    console.error(`❌ Base64 check FAILED: ${base64Count} documents contain Base64!`);
  }

  console.log('\n--- 2. Checking 3 FPT Aptech Target Documents ---');
  for (const id of targetIds) {
    const docData = targetDocs[id];
    if (!docData) {
      console.error(`❌ Missing document in Firestore: ${id}`);
      continue;
    }
    console.log(`\nDoc ID: ${id}`);
    console.log(`  Title: ${docData.title}`);
    console.log(`  Category: ${docData.categoryId}`);
    console.log(`  Group: ${docData.group}`);
    console.log(`  Published: ${docData.published}`);
    console.log(`  Image URL: ${docData.image}`);

    // Download image and verify
    const imgUrl = docData.image;
    const res = await fetch(imgUrl);
    if (!res.ok) {
      console.error(`  ❌ Failed to download image from CDN: HTTP ${res.status}`);
      continue;
    }

    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    const contentType = res.headers.get('content-type');
    const sizeBytes = buf.length;
    const sizeKB = (sizeBytes / 1024).toFixed(2);

    console.log(`  HTTP Status: ${res.status}`);
    console.log(`  Content-Type: ${contentType}`);
    console.log(`  Size: ${sizeBytes} bytes (${sizeKB} KB) - Under 350KB: ${sizeBytes < 350 * 1024 ? 'YES ✅' : 'NO ❌'}`);

    const metadata = await sharp(buf).metadata();
    console.log(`  Sharp Metadata: format=${metadata.format}, dimensions=${metadata.width}x${metadata.height}, channels=${metadata.channels}`);

    // Check bottom-right corner pixels for non-transparent watermark overlay
    // Watermark was composited at bottom-right corner.
    // Let's inspect raw pixels near bottom-right
    const { data, info } = await sharp(buf)
      .extract({
        left: Math.max(0, metadata.width - 250),
        top: Math.max(0, metadata.height - 100),
        width: Math.min(250, metadata.width),
        height: Math.min(100, metadata.height),
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log(`  Bottom-Right Region: ${info.width}x${info.height}, extracted ${data.length} bytes of raw pixel data`);
  }
}

checkFirestoreAndImages().catch(console.error);
