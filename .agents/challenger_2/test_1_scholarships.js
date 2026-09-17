// test_1_scholarships.js
// Verification of 4 scholarship brands, tiers, training programs, and tuition accounts

const fs = require('fs');
const path = require('path');

const pageFile = path.resolve(__dirname, '../../fai/src/app/tuyen-sinh/page.js');
const pageCode = fs.readFileSync(pageFile, 'utf8');

console.log('=== TEST 1: SCHOLARSHIPS, PROGRAMS & TUITION DATA INTEGRITY ===\n');

// Extract TRAINING_PROGRAMS_2026
const progMatch = pageCode.match(/const TRAINING_PROGRAMS_2026 = (\[[\s\S]*?\n\]);/);
if (!progMatch) {
  console.error('FAIL: Could not extract TRAINING_PROGRAMS_2026 from page.js');
  process.exit(1);
}
const TRAINING_PROGRAMS_2026 = eval(progMatch[1]);

// Extract SCHOLARSHIP_BRANDS
const brandsMatch = pageCode.match(/const SCHOLARSHIP_BRANDS = (\{[\s\S]*?\n\};)/);
if (!brandsMatch) {
  console.error('FAIL: Could not extract SCHOLARSHIP_BRANDS from page.js');
  process.exit(1);
}
let brandStr = brandsMatch[1].trim();
if (brandStr.endsWith(';')) brandStr = brandStr.slice(0, -1);
const SCHOLARSHIP_BRANDS = eval(`(${brandStr})`);

// Extract TUITION_ACCOUNTS
const tuitionMatch = pageCode.match(/const TUITION_ACCOUNTS = (\[[\s\S]*?\n\]);/);
if (!tuitionMatch) {
  console.error('FAIL: Could not extract TUITION_ACCOUNTS from page.js');
  process.exit(1);
}
const TUITION_ACCOUNTS = eval(tuitionMatch[1]);

let passed = true;

// 1. Check TRAINING_PROGRAMS_2026
console.log('[1.1] Verifying 11 Training Programs across brands:');
const expectedPrograms = [
  'Lập trình Fullstack 2 năm - FPT Aptech',
  'Lập trình Back end 1 năm - FPT Aptech',
  'Lập trình Front end 6 tháng - FPT Aptech',
  'Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech',
  'Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia',
  'Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia',
  'Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia',
  'Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking',
  'Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking',
  'Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking',
  'Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking'
];

const actualPrograms = [];
TRAINING_PROGRAMS_2026.forEach(b => {
  b.programs.forEach(p => actualPrograms.push(p));
});

console.log(`Total programs found: ${actualPrograms.length} (Expected: 11)`);
if (actualPrograms.length !== 11) {
  console.error(`FAIL: Expected 11 programs, found ${actualPrograms.length}`);
  passed = false;
}

expectedPrograms.forEach((p, idx) => {
  const found = actualPrograms.includes(p);
  console.log(`  - Program [${idx + 1}] "${p}": ${found ? 'PASS' : 'FAIL'}`);
  if (!found) passed = false;
});

// 2. Check 4 Scholarship Brands
console.log('\n[1.2] Verifying 4 Scholarship Brands:');
const expectedBrands = ['aptech', 'arena', 'skillking', 'jetking'];
expectedBrands.forEach(b => {
  const brandData = SCHOLARSHIP_BRANDS[b];
  if (!brandData) {
    console.error(`FAIL: Brand ${b} missing from SCHOLARSHIP_BRANDS`);
    passed = false;
  } else {
    console.log(`  - Brand "${b}": ${brandData.name} - ${brandData.items.length} items`);
  }
});

// Check Aptech tiers
console.log('\n[1.3] Verifying FPT Aptech Scholarship Tiers:');
const aptechItems = SCHOLARSHIP_BRANDS.aptech.items;
const expectedAptech = ['14 Triệu', '10 Triệu', '6 Triệu', '2 Triệu'];
const actualAptech = aptechItems.map(i => i.value);
console.log('  Expected values:', expectedAptech);
console.log('  Actual values:  ', actualAptech);
if (JSON.stringify(expectedAptech) !== JSON.stringify(actualAptech)) {
  console.error('  FAIL: Aptech tiers do not match expected');
  passed = false;
} else {
  console.log('  PASS: Aptech tiers match');
}

// Check Arena tiers
console.log('\n[1.4] Verifying FPT Arena Multimedia Scholarship Tiers:');
const arenaItems = SCHOLARSHIP_BRANDS.arena.items;
const expectedArena = ['14 Triệu', '10 Triệu', '6 Triệu', '1.5 - 2 Triệu'];
const actualArena = arenaItems.map(i => i.value);
console.log('  Expected values:', expectedArena);
console.log('  Actual values:  ', actualArena);
if (JSON.stringify(expectedArena) !== JSON.stringify(actualArena)) {
  console.error('  FAIL: Arena tiers do not match expected');
  passed = false;
} else {
  console.log('  PASS: Arena tiers match');
}

// Check Skillking tiers
console.log('\n[1.5] Verifying FPT Skillking Scholarship Tiers:');
const skillkingItems = SCHOLARSHIP_BRANDS.skillking.items;
const expectedSkillking = ['14 Triệu', '10 Triệu', '6 Triệu', '1.5 - 2 Triệu'];
const actualSkillking = skillkingItems.map(i => i.value);
console.log('  Expected values:', expectedSkillking);
console.log('  Actual values:  ', actualSkillking);
if (JSON.stringify(expectedSkillking) !== JSON.stringify(actualSkillking)) {
  console.error('  FAIL: Skillking tiers do not match expected');
  passed = false;
} else {
  console.log('  PASS: Skillking tiers match');
}

// Check Jetking tiers
console.log('\n[1.6] Verifying FPT Jetking Scholarship Tiers:');
const jetkingItems = SCHOLARSHIP_BRANDS.jetking.items;
const expectedJetking = ['8 Triệu', '8 Triệu'];
const actualJetking = jetkingItems.map(i => i.value);
console.log('  Expected values:', expectedJetking);
console.log('  Actual values:  ', actualJetking);
if (JSON.stringify(expectedJetking) !== JSON.stringify(actualJetking)) {
  console.error('  FAIL: Jetking tiers do not match expected');
  passed = false;
} else {
  console.log('  PASS: Jetking tiers match');
}

// Check Tuition accounts
console.log('\n[1.7] Verifying Tuition Accounts (HN & DN):');
const hnAccount = TUITION_ACCOUNTS.find(a => a.campusKey === 'HN');
const dnAccount = TUITION_ACCOUNTS.find(a => a.campusKey === 'DN');

if (!hnAccount || hnAccount.accountNumber !== '00006969813' || hnAccount.transferSyntax !== 'FAIHN_hotensinhvien_HP HK 1') {
  console.error('FAIL: HN tuition account details mismatch', hnAccount);
  passed = false;
} else {
  console.log('  PASS: HN Tuition Account (00006969813, FAIHN_hotensinhvien_HP HK 1)');
}

if (!dnAccount || dnAccount.accountNumber !== '03557714109' || dnAccount.transferSyntax !== 'FAIDN_hotensinhvien_HP HK 1') {
  console.error('FAIL: DN tuition account details mismatch', dnAccount);
  passed = false;
} else {
  console.log('  PASS: DN Tuition Account (03557714109, FAIDN_hotensinhvien_HP HK 1)');
}

console.log(`\n=== TEST 1 RESULT: ${passed ? 'ALL PASSED' : 'FAILED'} ===`);
process.exit(passed ? 0 : 1);
