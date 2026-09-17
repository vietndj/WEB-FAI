import http from 'http';
import fs from 'fs';
import path from 'path';

const BASE_DIR = '/Users/vietmac/Documents/CODE/WEB- FAI/fai';

async function fetchRoute(route) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runAdversarialAudit() {
  console.log('=== FORENSIC INDEPENDENT AUDIT SUITE (M3) ===');
  let failures = 0;
  let checks = 0;

  function verify(condition, name, details = '') {
    checks++;
    if (!condition) {
      console.error(`❌ [INTEGRITY FAILURE] ${name}: ${details}`);
      failures++;
    } else {
      console.log(`✅ [PASS] ${name}`);
    }
  }

  // 1. Audit Server Component Architecture
  const coursePages = [
    'aptech/accp',
    'aptech/1-nam',
    'aptech/6-thang',
    'aptech/100-200h',
    'arena/amsp',
    'arena/6-18-thang',
    'arena/100h',
    'skillking/18-thang',
    'skillking/100h',
    'chip-design',
    'ai-agent'
  ];

  for (const slug of coursePages) {
    const pagePath = path.join(BASE_DIR, 'src/app/dao-tao', slug, 'page.js');
    const content = fs.readFileSync(pagePath, 'utf8');
    const lines = content.trim().split('\n').length;
    verify(lines < 200, `${slug} line count < 200`, `Actual lines: ${lines}`);
    verify(!content.includes("'use client'"), `${slug} must be Server Component`, 'Contains use client');
    verify(content.includes('CourseLayout'), `${slug} imports CourseLayout`, 'Missing CourseLayout');
    verify(content.includes('metadata'), `${slug} exports metadata`, 'Missing metadata');
  }

  // 2. Audit CourseLayout & Subcomponents Authenticity
  const compDir = path.join(BASE_DIR, 'src/components/course');
  const comps = ['CourseLayout.jsx', 'CourseHero.jsx', 'CourseOverviewStats.jsx', 'CourseCurriculumTabs.jsx', 'CourseHighlights.jsx', 'CourseCTABanner.jsx'];
  for (const c of comps) {
    const p = path.join(compDir, c);
    verify(fs.existsSync(p), `Component exists: ${c}`);
    const code = fs.readFileSync(p, 'utf8');
    verify(code.length > 500, `Component ${c} has substantial implementation`, `Length: ${code.length}`);
    verify(!code.includes('TODO') && !code.includes('NotImplemented'), `Component ${c} has no TODO/NotImplemented stubs`);
  }

  // 3. Live Server Route Deep Content Verification
  const routeExpectations = [
    { route: '/dao-tao/aptech/accp', tokens: ['FPT APTECH', 'ACCP AI', '992 Giờ', 'Full-Stack Web'] },
    { route: '/dao-tao/aptech/1-nam', tokens: ['FPT APTECH', 'Backend', 'PHP Laravel', 'Python Django'] },
    { route: '/dao-tao/aptech/6-thang', tokens: ['FPT APTECH', 'Frontend', 'CPISM', 'Figma'] },
    { route: '/dao-tao/aptech/100-200h', tokens: ['FPT APTECH', 'Full Stack Web', 'Automation Test', 'BA'] },
    { route: '/dao-tao/arena/amsp', tokens: ['FPT ARENA', 'AMSP', 'Multimedia', 'Unreal Engine'] },
    { route: '/dao-tao/arena/6-18-thang', tokens: ['FPT ARENA', '6–18', 'Thiết Kế 2D, 3D', 'Autodesk Maya', 'Blender 3D'] },
    { route: '/dao-tao/arena/100h', tokens: ['FPT ARENA', '100 Giờ', 'Thiết Kế Thương Hiệu - Thương Mại', 'App/Web UI/UX'] },
    { route: '/dao-tao/skillking/18-thang', tokens: ['FPT SKILLKING', 'Digital Marketing With AI', 'Omnichannel'] },
    { route: '/dao-tao/skillking/100h', tokens: ['FPT SKILLKING', '100 Giờ', 'TikTok Shop', 'Google Mastery', 'Google Ads'] },
    { route: '/dao-tao/chip-design', tokens: ['FPT Jetking', 'Bán Dẫn', 'Synopsys', 'Cadence'] },
    { route: '/dao-tao/ai-agent', tokens: ['FPT Jetking', 'AI Agent', 'LLM', 'Multi-Agent Swarms'] }
  ];

  for (const exp of routeExpectations) {
    const res = await fetchRoute(exp.route);
    verify(res.statusCode === 200, `Route ${exp.route} returns HTTP 200`, `Status: ${res.statusCode}`);
    verify(res.body.length > 50000, `Route ${exp.route} payload size > 50KB`, `Size: ${res.body.length}`);
    verify(!res.body.includes('Hydration failed'), `Route ${exp.route} has no hydration error`, '');
    verify(!res.body.includes('Application error'), `Route ${exp.route} has no application error`, '');
    for (const t of exp.tokens) {
      verify(res.body.includes(t), `Route ${exp.route} contains expected token "${t}"`);
    }
  }

  // 4. Data SSoT Integrity Check
  const coursesPath = path.join(BASE_DIR, 'src/data/courses.js');
  const coursesCode = fs.readFileSync(coursesPath, 'utf8');
  verify(coursesCode.includes('COURSE_ACCP'), 'courses.js contains COURSE_ACCP');
  verify(coursesCode.includes('COURSE_AI_AGENT'), 'courses.js contains COURSE_AI_AGENT');

  const programsPath = path.join(BASE_DIR, 'src/data/programs.js');
  const programsCode = fs.readFileSync(programsPath, 'utf8');
  verify(programsCode.includes("export * from './courses'"), "programs.js re-exports courses.js");

  console.log(`\nAUDIT SUMMARY: ${checks} checks evaluated, ${failures} failures.`);
  if (failures > 0) {
    console.error(`VERDICT: INTEGRITY VIOLATION (${failures} checks failed)`);
    process.exit(1);
  } else {
    console.log('VERDICT: CLEAN (All forensic checks passed)');
  }
}

runAdversarialAudit().catch(err => {
  console.error('Audit exception:', err);
  process.exit(1);
});
