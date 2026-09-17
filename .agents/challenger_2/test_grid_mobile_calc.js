// test_grid_mobile_calc.js
// Mathematical & CSS specification proof of the 12-column inline grid defect on mobile

console.log('=== EMPIRICAL VERIFICATION: 12-COLUMN INLINE GRID ON MOBILE VIEWPORTS ===\n');

const viewports = [
  { name: 'iPhone SE', width: 375, padding: 32 },
  { name: 'iPhone 14 / 15', width: 393, padding: 32 },
  { name: 'Standard Android', width: 412, padding: 32 },
  { name: 'iPad Portrait', width: 768, padding: 48 }
];

viewports.forEach(vp => {
  console.log(`--- Viewport: ${vp.name} (${vp.width}px) ---`);
  const contentWidth = vp.width - vp.padding;

  // Block 7: Contact (span 5) + Form (span 7), gap: 50px
  const gap7 = 50;
  const colTrack7 = (contentWidth - gap7) / 12;
  const contactWidth = colTrack7 * 5;
  const formWidth = colTrack7 * 7;

  console.log(`Block 7 (Contact + Form): Available width = ${contentWidth}px, Gap = ${gap7}px`);
  console.log(`  - admissions-contact-col (span 5): ${contactWidth.toFixed(1)}px`);
  console.log(`  - admissions-form-col (span 7):    ${formWidth.toFixed(1)}px`);

  // Block 4: Steps (span 7) + Dossier (span 5), gap: 40px
  const gap4 = 40;
  const colTrack4 = (contentWidth - gap4) / 12;
  const stepsWidth = colTrack4 * 7;
  const dossierWidth = colTrack4 * 5;

  console.log(`Block 4 (Steps + Dossier): Available width = ${contentWidth}px, Gap = ${gap4}px`);
  console.log(`  - admissions-steps-col (span 7):   ${stepsWidth.toFixed(1)}px`);
  console.log(`  - admissions-dossier-col (span 5): ${dossierWidth.toFixed(1)}px`);

  const isFormCramped = formWidth < 280;
  console.log(`  -> Form severely cramped (< 280px minimum usable form width): ${isFormCramped ? 'YES (UNUSABLE)' : 'NO'}\n`);
});
