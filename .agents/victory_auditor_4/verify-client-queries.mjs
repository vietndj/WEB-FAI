import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire('/Users/vietmac/Documents/CODE/WEB- FAI/fai/package.json');
const { initializeApp, getApps, getApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

// Load .env.local
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
      if (!process.env[key]) process.env[key] = val;
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

async function testQuery() {
  console.log('--- Checking Categories for group: doi-song ---');
  const catQuery = query(collection(db, 'categories'), where('group', '==', 'doi-song'));
  const catSnap = await getDocs(catQuery);
  console.log(`Found ${catSnap.size} categories under doi-song:`);
  catSnap.forEach((doc) => {
    console.log(`  - [${doc.id}] ${doc.data().title?.replace(/\n/g, ' - ')}`);
  });

  console.log('\n--- Checking Posts for each category ---');
  for (const catDoc of catSnap.docs) {
    const catId = catDoc.id;
    const postQuery = query(collection(db, 'posts'), where('categoryId', '==', catId), where('published', '==', true));
    const postSnap = await getDocs(postQuery);
    console.log(`Category "${catId}": ${postSnap.size} published post(s)`);
    postSnap.forEach((p) => {
      console.log(`    ↳ [${p.id}] ${p.data().title}`);
    });
  }
}

testQuery().catch(console.error);
