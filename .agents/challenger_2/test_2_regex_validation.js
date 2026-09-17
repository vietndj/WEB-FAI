// test_2_regex_validation.js
// Stress-testing phone and email regex patterns and validation logic

const fs = require('fs');
const path = require('path');

const pageFile = path.resolve(__dirname, '../../fai/src/app/tuyen-sinh/page.js');
const pageCode = fs.readFileSync(pageFile, 'utf8');

console.log('=== TEST 2: PHONE & EMAIL REGEX VALIDATION CHALLENGE ===\n');

// Extract regex definitions directly from page.js
const phoneRegexMatch = pageCode.match(/const phoneRegex = (\/.*?\/);/);
const emailRegexMatch = pageCode.match(/const emailRegex = (\/.*?\/);/);

if (!phoneRegexMatch || !emailRegexMatch) {
  console.error('FAIL: Could not extract regex patterns from page.js');
  process.exit(1);
}

const phoneRegex = eval(phoneRegexMatch[1]);
const emailRegex = eval(emailRegexMatch[1]);

console.log(`Extracted phoneRegex: ${phoneRegex}`);
console.log(`Extracted emailRegex: ${emailRegex}\n`);

// 1. Phone number stress testing
console.log('--- Part 2.1: Phone Validation Test Cases ---');

const phoneTestCases = [
  // Valid standard VN phone numbers
  { input: '0912345678', expectedValid: true, desc: 'Standard Viettel/Vinaphone (09)' },
  { input: '0381234567', expectedValid: true, desc: 'Viettel prefix (03)' },
  { input: '0561234567', expectedValid: true, desc: 'Vietnamobile prefix (05)' },
  { input: '0771234567', expectedValid: true, desc: 'Mobifone prefix (07)' },
  { input: '0861234567', expectedValid: true, desc: 'Viettel prefix (08)' },
  { input: '098 765 4321', expectedValid: true, desc: 'Valid phone with internal spaces (cleaned via replace)' },
  { input: ' 0987654321 ', expectedValid: true, desc: 'Valid phone with leading/trailing spaces' },

  // Edge cases & Invalid numbers
  { input: '02473008855', expectedValid: false, desc: '11-digit landline (Hà Nội hotline)' },
  { input: '0123456789', expectedValid: false, desc: 'Old 11-digit mobile prefix (012)' },
  { input: '0412345678', expectedValid: false, desc: 'Invalid prefix 04' },
  { input: '0612345678', expectedValid: false, desc: 'Invalid prefix 06' },
  { input: '091234567', expectedValid: false, desc: 'Too short (9 digits)' },
  { input: '09123456789', expectedValid: false, desc: 'Too long (11 digits)' },
  { input: '091234567a', expectedValid: false, desc: 'Contains letters' },
  { input: 'abcdefghij', expectedValid: false, desc: 'All letters' },
  { input: '+84912345678', expectedValid: false, desc: 'International format +84 (currently rejected by ^0)' },
  { input: '84912345678', expectedValid: false, desc: '84 prefix without +' },
  { input: '0|12345678', expectedValid: false, desc: 'ADVERSARIAL: Literal pipe character "0|12345678" - does [3|5|7|8|9] accept | ?' },
  { input: '0|98765432', expectedValid: false, desc: 'ADVERSARIAL: Pipe syntax injection "0|98765432"' }
];

let phoneBugs = [];

phoneTestCases.forEach(tc => {
  const cleaned = tc.input.replace(/\s+/g, '');
  const isValid = phoneRegex.test(cleaned);
  const pass = isValid === tc.expectedValid;
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`[${status}] Phone "${tc.input}" -> cleaned: "${cleaned}" -> result: ${isValid} | Expected: ${tc.expectedValid} (${tc.desc})`);
  if (!pass) {
    phoneBugs.push({ tc, cleaned, result: isValid });
  }
});

console.log('\n--- Part 2.2: Email Validation Test Cases ---');

const emailTestCases = [
  // Valid emails
  { input: 'test@fpt.edu.vn', expectedValid: true, desc: 'Institutional edu domain' },
  { input: 'user.name+tag@gmail.com', expectedValid: true, desc: 'Gmail with plus tag' },
  { input: 'user123@sub.domain.co', expectedValid: true, desc: 'Subdomain' },
  { input: 'a@b.cd', expectedValid: true, desc: 'Short valid email' },
  { input: ' user@fpt.edu.vn ', expectedValid: true, desc: 'Leading/trailing spaces (cleaned with trim())' },

  // Invalid emails
  { input: '', expectedValid: false, desc: 'Empty string' },
  { input: 'plainaddress', expectedValid: false, desc: 'No @ symbol' },
  { input: '@domain.com', expectedValid: false, desc: 'Missing local part' },
  { input: 'user@', expectedValid: false, desc: 'Missing domain part' },
  { input: 'user@domain', expectedValid: false, desc: 'Missing TLD dot' },
  { input: 'user@.com', expectedValid: false, desc: 'Missing domain name before dot' },
  { input: 'user@domain.', expectedValid: false, desc: 'Missing TLD after dot' },
  { input: 'user name@domain.com', expectedValid: false, desc: 'Space inside local part' },
  { input: 'user@domain .com', expectedValid: false, desc: 'Space in domain' },
  { input: 'user@domain..com', expectedValid: false, desc: 'Consecutive dots in domain' }
];

let emailBugs = [];

emailTestCases.forEach(tc => {
  const trimmed = tc.input.trim();
  const isValid = emailRegex.test(trimmed);
  const pass = isValid === tc.expectedValid;
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`[${status}] Email "${tc.input}" -> trimmed: "${trimmed}" -> result: ${isValid} | Expected: ${tc.expectedValid} (${tc.desc})`);
  if (!pass) {
    emailBugs.push({ tc, trimmed, result: isValid });
  }
});

console.log('\n=== EMPIRICAL OBSERVATION & ANALYSIS ===');
if (phoneBugs.length > 0) {
  console.log('\n[CRITICAL/HIGH FINDING] Phone Regex Character Class Flaw:');
  phoneBugs.forEach(b => {
    console.log(`  - Input "${b.tc.input}" gave ${b.result}, expected ${b.tc.expectedValid}. Reason: ${b.tc.desc}`);
  });
  console.log('  -> In JavaScript RegExp, `[3|5|7|8|9]` includes the pipe "|" character in the set of matched characters!');
  console.log('  -> Therefore, "0|12345678" passes regex validation! Proper character class is `[35789]`.');
}

if (emailBugs.length > 0) {
  console.log('\n[NOTABLE FINDING] Email Regex Permissiveness:');
  emailBugs.forEach(b => {
    console.log(`  - Input "${b.tc.input}" gave ${b.result}, expected ${b.tc.expectedValid}. Reason: ${b.tc.desc}`);
  });
}

console.log('\n=== TEST 2 COMPLETED ===');
