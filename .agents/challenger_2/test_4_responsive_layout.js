// test_4_responsive_layout.js
// Verification and adversarial challenge of responsive layout properties

const fs = require('fs');
const path = require('path');

const pageFile = path.resolve(__dirname, '../../fai/src/app/tuyen-sinh/page.js');
const globalsFile = path.resolve(__dirname, '../../fai/src/app/globals.css');

const pageCode = fs.readFileSync(pageFile, 'utf8');
const globalsCode = fs.readFileSync(globalsFile, 'utf8');

console.log('=== TEST 4: RESPONSIVE LAYOUT PROPERTIES & ADVERSARIAL CHALLENGE ===\n');

// 1. Audit clamp() usage
console.log('--- Part 4.1: clamp() Fluid Typography & Sizing Audit ---');
const clampRegex = /clamp\([^)]+\)/g;
let clampMatches = [];
let m;
while ((m = clampRegex.exec(pageCode)) !== null) {
  clampMatches.push(m[0]);
}

console.log(`Found ${clampMatches.length} clamp() occurrences in page.js:`);
clampMatches.forEach((c, idx) => {
  console.log(`  [${idx + 1}] ${c}`);
});

// 2. Audit repeat(auto-fit, minmax(...)) usage
console.log('\n--- Part 4.2: repeat(auto-fit, minmax(...)) CSS Grid Audit ---');
const autoFitRegex = /repeat\(\s*auto-fit\s*,\s*minmax\([^)]+\)\s*\)/g;
let autoFitMatches = [];
while ((m = autoFitRegex.exec(pageCode)) !== null) {
  autoFitMatches.push(m[0]);
}

console.log(`Found ${autoFitMatches.length} auto-fit grid occurrences in page.js:`);
autoFitMatches.forEach((a, idx) => {
  console.log(`  [${idx + 1}] ${a}`);
});

// 3. Audit flexWrap usage
console.log('\n--- Part 4.3: flexWrap Usage Audit ---');
const flexWrapRegex = /flexWrap:\s*['"]wrap['"]/g;
let flexWrapCount = 0;
while ((m = flexWrapRegex.exec(pageCode)) !== null) {
  flexWrapCount++;
}
console.log(`Found ${flexWrapCount} flexWrap: 'wrap' instances in inline styles.`);

// 4. Adversarial Review: 12-Column Grid on Mobile Viewports (< 768px, 375px)
console.log('\n--- Part 4.4: ADVERSARIAL STRESS TEST - 12-Column Grids on Mobile ---');

// Check Block 4: Quy trình & Hồ sơ
// Line 931: gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px'
// Line 952: span 7 (admissions-steps-col)
// Line 1011: span 5 (admissions-dossier-col)

// Check Block 7: Liên hệ & Form đăng ký
// Line 1544: gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px'
// Line 1547: span 5 (admissions-contact-col)
// Line 1641: span 7 (admissions-form-col)

console.log('Analyzing 12-column grid containers in page.js:');
const twelveColContainers = [
  {
    block: 'Block 2: Đối tượng tuyển sinh (Line 583)',
    columns: 'repeat(12, 1fr)',
    children: ['span 12 (branding)', 'span 12 (auto-fit inner grid)'],
    mobileSafe: true,
    reason: 'Children both use span 12, naturally stacking vertically 100% width'
  },
  {
    block: 'Block 4: Quy trình 4 bước & Hồ sơ (Line 931)',
    columns: 'repeat(12, 1fr)',
    children: ['span 12 (steps head)', 'span 7 (admissions-steps-col)', 'span 5 (admissions-dossier-col)'],
    mobileSafe: false,
    reason: 'Inline style gridColumn: span 7 and span 5 force side-by-side layout in 12-col grid unless overridden by media queries.'
  },
  {
    block: 'Block 7: Liên hệ & Form đăng ký (Line 1544)',
    columns: 'repeat(12, 1fr)',
    children: ['span 5 (admissions-contact-col)', 'span 7 (admissions-form-col)'],
    mobileSafe: false,
    reason: 'Inline style gridColumn: span 5 and span 7 force side-by-side layout in 12-col grid unless overridden by media queries.'
  }
];

twelveColContainers.forEach(c => {
  console.log(`\nContainer: ${c.block}`);
  console.log(`  Columns: ${c.columns}`);
  console.log(`  Children: ${c.children.join(', ')}`);
  console.log(`  Mobile Safe: ${c.mobileSafe ? 'YES' : 'POTENTIAL RISK'}`);
  console.log(`  Reason: ${c.reason}`);
});

// Check if globals.css contains media queries targeting admissions-steps-col, admissions-dossier-col, admissions-contact-col, admissions-form-col
const targetClasses = ['admissions-steps-col', 'admissions-dossier-col', 'admissions-contact-col', 'admissions-form-col'];
console.log('\nChecking globals.css for media query overrides on inline grid columns:');
let missingResponsiveOverrides = [];

targetClasses.forEach(cls => {
  const hasOverride = new RegExp(`\\.${cls}\\b[^{]*\\{[^}]*grid-column`, 'i').test(globalsCode);
  console.log(`  - .${cls} responsive override in globals.css: ${hasOverride ? 'PRESENT' : 'NOT FOUND'}`);
  if (!hasOverride) {
    missingResponsiveOverrides.push(cls);
  }
});

// Mathematical layout simulation on 375px viewport (iPhone SE / mobile standard)
console.log('\n--- Mathematical Simulation on 375px Mobile Viewport ---');
const mobileViewportWidth = 375;
const containerPadding = 32; // approx 16px each side
const availableWidth = mobileViewportWidth - containerPadding; // ~343px

console.log(`Viewport width: ${mobileViewportWidth}px, Container available: ${availableWidth}px`);

// In Block 7: gap is 50px
// If 12-column grid is maintained:
// 12 columns + 11 gaps of 50px = (12 * col) + 550px!
// Even with gap = 0: 7/12 of 343px = ~200px (Form), 5/12 of 343px = ~142px (Contact)!
console.log('If 12-column grid with span 5 / span 7 remains active on 375px:');
console.log(`  - Available width: ${availableWidth}px with gap: 50px`);
console.log('  - The grid columns will overflow or severely squish the form (< 200px width for inputs)!');

if (missingResponsiveOverrides.length > 0) {
  console.log('\n[CRITICAL FINDING]: Missing media queries in globals.css for 12-column grid children.');
  console.log('Because gridColumn: "span 7" and "span 5" are set via inline styles, and there are NO !important media queries in globals.css for these classes:');
  console.log('On viewports under 768px or 992px, the Contact column and Form column remain side-by-side, causing severe mobile layout squishing or horizontal overflow!');
}

console.log('\n=== TEST 4 COMPLETED ===');
