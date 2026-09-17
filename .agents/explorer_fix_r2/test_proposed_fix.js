// test_proposed_fix.js
// Dry-run testing of the proposed fixes for tuyen-sinh/page.js

const fs = require('fs');
const path = require('path');

const originalFilePath = path.resolve(__dirname, '../../fai/src/app/tuyen-sinh/page.js');
const originalCode = fs.readFileSync(originalFilePath, 'utf8');

console.log('=== TEST PROPOSED FIX SIMULATION ===\n');

// 1. Simulate Defect 1 Fix: Phone Regex
const oldRegexSnippet = 'const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;';
const newRegexSnippet = 'const phoneRegex = /^(0[35789])[0-9]{8}$/;';

if (!originalCode.includes(oldRegexSnippet)) {
  console.error('ERROR: Could not find oldRegexSnippet in page.js');
  process.exit(1);
}

let proposedCode = originalCode.replace(oldRegexSnippet, newRegexSnippet);

// 2. Simulate Defect 2 Fix: Responsive Styles
// We will add the <style> block and classNames to the grid containers
const oldContainerBlock4 = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>`;
const newContainerBlock4 = `<div className="admissions-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>`;

const oldContainerBlock7 = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>`;
const newContainerBlock7 = `<div className="admissions-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>`;

const styleBlock = `      <style>{\`
        @media (max-width: 992px) {
          .admissions-steps-grid,
          .admissions-contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .admissions-steps-col,
          .admissions-dossier-col,
          .admissions-contact-col,
          .admissions-form-col {
            grid-column: span 12 !important;
            width: 100% !important;
          }
        }
      \`}</style>`;

const oldPageContainer = `<div className="admissions-page-container" style={{ backgroundColor: '#ffffff', color: '#1a2332', fontFamily: 'var(--font-sans)' }}>`;
const newPageContainer = `${oldPageContainer}\n${styleBlock}`;

proposedCode = proposedCode.replace(oldContainerBlock4, newContainerBlock4);
proposedCode = proposedCode.replace(oldContainerBlock7, newContainerBlock7);
proposedCode = proposedCode.replace(oldPageContainer, newPageContainer);

// Check phone regex test cases
console.log('--- 1. Testing Phone Regex Fix ---');
const newPhoneRegex = /^(0[35789])[0-9]{8}$/;
const testCases = [
  { input: '0912345678', expected: true },
  { input: '0381234567', expected: true },
  { input: '0561234567', expected: true },
  { input: '0771234567', expected: true },
  { input: '0861234567', expected: true },
  { input: '0|12345678', expected: false },
  { input: '0|98765432', expected: false },
  { input: '02473008855', expected: false },
  { input: '0123456789', expected: false }
];

let regexPassed = true;
testCases.forEach(tc => {
  const res = newPhoneRegex.test(tc.input);
  const ok = res === tc.expected;
  if (!ok) regexPassed = false;
  console.log(`  [${ok ? 'PASS' : 'FAIL'}] "${tc.input}" -> ${res} (expected ${tc.expected})`);
});

// Check ESLint on proposed code
console.log('\n--- 2. Testing ESLint on Proposed Code ---');
const { execSync } = require('child_process');

function testLint() {
  const tempPath = path.resolve(__dirname, '../../fai/src/app/tuyen-sinh/test-temp-proposed.js');
  try {
    fs.writeFileSync(tempPath, proposedCode, 'utf8');
    execSync('npx eslint src/app/tuyen-sinh/test-temp-proposed.js', {
      cwd: path.resolve(__dirname, '../../fai'),
      stdio: 'pipe'
    });
    console.log('  ESLint passed with 0 errors and 0 warnings.');
    return true;
  } catch (err) {
    console.error('  ESLint failed:', err.stdout ? err.stdout.toString() : err.message);
    return false;
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

// Check Tailwind patterns on all classNames
console.log('\n--- 3. Testing Tailwind Patterns ---');
const classRegex = /className="([^"]+)"/g;
const usedClassNames = new Set();
let match;
while ((match = classRegex.exec(proposedCode)) !== null) {
  match[1].split(/\s+/).forEach(cls => {
    if (cls.trim()) usedClassNames.add(cls.trim());
  });
}
const tailwindPattern = /^(flex|grid|hidden|block|inline-block|relative|absolute|fixed|w-\d+|h-\d+|p-\d+|px-\d+|py-\d+|m-\d+|mx-\d+|my-\d+|text-(xs|sm|base|lg|xl|2xl|\w+-\d+)|bg-(white|black|\w+-\d+)|rounded(-\w+)?|shadow(-\w+)?|border(-\w+)?|justify-\w+|items-\w+|gap-\d+|col-span-\d+|row-span-\d+|font-(bold|semibold|normal)|leading-\w+|tracking-\w+|space-[xy]-\d+|opacity-\d+)$/;

let tailwindPassed = true;
usedClassNames.forEach(cls => {
  if (tailwindPattern.test(cls)) {
    console.error(`  FAIL: Tailwind class matched: ${cls}`);
    tailwindPassed = false;
  }
});
if (tailwindPassed) {
  console.log(`  PASS: Zero Tailwind classes in ${usedClassNames.size} unique classes.`);
  console.log('  Classes:', Array.from(usedClassNames));
}

const lintPassed = testLint();

console.log('\n=== SUMMARY ===');
console.log(`Regex Fix: ${regexPassed ? 'PASSED' : 'FAILED'}`);
console.log(`Lint Check: ${lintPassed ? 'PASSED' : 'FAILED'}`);
console.log(`Tailwind Independence: ${tailwindPassed ? 'PASSED' : 'FAILED'}`);

if (regexPassed && lintPassed && tailwindPassed) {
  console.log('\nALL CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  process.exit(1);
}
