// test_3_css_vars_and_tailwind.js
// Verification that no Tailwind CSS classes are relied on and all CSS variables exist in globals.css

const fs = require('fs');
const path = require('path');

const pageFile = path.resolve(__dirname, '../../fai/src/app/tuyen-sinh/page.js');
const globalsFile = path.resolve(__dirname, '../../fai/src/app/globals.css');

const pageCode = fs.readFileSync(pageFile, 'utf8');
const globalsCode = fs.readFileSync(globalsFile, 'utf8');

console.log('=== TEST 3: CSS VARIABLES & TAILWIND CSS INDEPENDENCE ===\n');

// 1. Extract CSS variables used in page.js
console.log('--- Part 3.1: CSS Variables Verification ---');
const varRegex = /var\(\s*(--[a-zA-Z0-9-_]+)\s*\)/g;
const usedVars = new Set();
let match;
while ((match = varRegex.exec(pageCode)) !== null) {
  usedVars.add(match[1]);
}

console.log(`Found ${usedVars.size} unique CSS variables used in page.js:`, Array.from(usedVars));

// Extract CSS variables defined in globals.css
const rootRegex = /:root\s*\{([^}]+)\}/s;
const rootMatch = globalsCode.match(rootRegex);
let definedVars = new Set();

if (rootMatch) {
  const rootContent = rootMatch[1];
  const defRegex = /(--[a-zA-Z0-9-_]+)\s*:/g;
  let defMatch;
  while ((defMatch = defRegex.exec(rootContent)) !== null) {
    definedVars.add(defMatch[1]);
  }
}

console.log(`Found ${definedVars.size} CSS variables defined in :root of globals.css:`, Array.from(definedVars));

let missingVars = [];
usedVars.forEach(v => {
  const exists = definedVars.has(v);
  console.log(`  - Variable "${v}": ${exists ? 'DEFINED' : 'MISSING'}`);
  if (!exists) {
    missingVars.push(v);
  }
});

if (missingVars.length === 0) {
  console.log('PASS: All CSS variables used in page.js are defined in globals.css :root!\n');
} else {
  console.error('FAIL: Missing CSS variables in globals.css:', missingVars, '\n');
}

// 2. Check for Tailwind CSS classes
console.log('--- Part 3.2: Tailwind CSS Independence & ClassName Audit ---');

// Extract all classNames
const classRegex = /className="([^"]+)"/g;
const usedClassNames = new Set();
while ((match = classRegex.exec(pageCode)) !== null) {
  match[1].split(/\s+/).forEach(cls => {
    if (cls.trim()) usedClassNames.add(cls.trim());
  });
}

console.log(`Total unique classNames in page.js: ${usedClassNames.size}`);
console.log('ClassNames found:', Array.from(usedClassNames));

// Common Tailwind utility patterns:
// e.g. text-, bg-, p-, px-, py-, m-, mx-, my-, flex, grid, items-, justify-, col-span-, w-, h-, rounded-, shadow-, border-
const tailwindPattern = /^(flex|grid|hidden|block|inline-block|relative|absolute|fixed|w-\d+|h-\d+|p-\d+|px-\d+|py-\d+|m-\d+|mx-\d+|my-\d+|text-(xs|sm|base|lg|xl|2xl|\w+-\d+)|bg-(white|black|\w+-\d+)|rounded(-\w+)?|shadow(-\w+)?|border(-\w+)?|justify-\w+|items-\w+|gap-\d+|col-span-\d+|row-span-\d+|font-(bold|semibold|normal)|leading-\w+|tracking-\w+|space-[xy]-\d+|opacity-\d+)$/;

let tailwindSuspects = [];
usedClassNames.forEach(cls => {
  if (tailwindPattern.test(cls)) {
    tailwindSuspects.push(cls);
  }
});

console.log('\nTailwind CSS Pattern Check:');
if (tailwindSuspects.length === 0) {
  console.log('PASS: Zero Tailwind utility classes detected in page.js.');
} else {
  console.warn('WARNING: Possible Tailwind classes detected:', tailwindSuspects);
}

// 3. Check stylesheet definitions for the used custom classes
console.log('\n--- Part 3.3: Definition Check for Custom Classes in globals.css ---');
const classDefinitionCheck = {};
usedClassNames.forEach(cls => {
  // Regex looking for .className in globals.css
  const escaped = cls.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const clsDefRegex = new RegExp(`\\.${escaped}\\b`);
  const isDefined = clsDefRegex.test(globalsCode);
  classDefinitionCheck[cls] = isDefined;
  console.log(`  - .${cls}: ${isDefined ? 'DEFINED in globals.css' : 'NOT DEFINED in globals.css (relies purely on inline styles)'}`);
});

console.log('\n=== TEST 3 COMPLETED ===');
process.exit(missingVars.length === 0 ? 0 : 1);
