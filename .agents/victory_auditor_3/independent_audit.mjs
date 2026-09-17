/**
 * independent_audit.mjs
 * Independent Victory Verification Script by victory_auditor_3
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log('=== VICTORY AUDITOR 3: INDEPENDENT VERIFICATION SUITE ===\n');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      if (details) console.log(`   Details: ${details}`);
      passCount++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (details) console.error(`   Details: ${details}`);
      failCount++;
    }
  }

  // 1. Tuyển sinh Page Verification
  console.log('\n--- 1. AUDITING /tuyen-sinh COMPLIANCE WITH ORIGINAL_REQUEST.md ---');
  const tuyenSinh = await fetchUrl(`${BASE_URL}/tuyen-sinh`);
  assert(tuyenSinh.status === 200, 'Tuyển sinh HTTP Status 200', `Status: ${tuyenSinh.status}`);
  
  // R1.1: Direct admission, no exam
  assert(tuyenSinh.body.includes('Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển'), 'Direct admission message present', 'Found "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển"');
  assert(!tuyenSinh.body.includes('Môn 1: Tiếng Anh') && !tuyenSinh.body.includes('Môn 1 Tiếng Anh'), 'Old exam Subject 1 (English) eliminated');
  assert(!tuyenSinh.body.includes('Môn 2: Sáng tạo') && !tuyenSinh.body.includes('Môn 2 Sáng Tạo / Logic'), 'Old exam Subject 2 (Creativity/Logic) eliminated');

  // R1.2: Admission documents (Phiếu đăng ký, CCCD công chứng, Cam kết sinh viên)
  assert(tuyenSinh.body.includes('Phiếu đăng ký nhập học'), 'Hồ sơ: Phiếu đăng ký nhập học present');
  assert(tuyenSinh.body.includes('CCCD'), 'Hồ sơ: CCCD công chứng present');
  assert(tuyenSinh.body.includes('Cam kết sinh viên') || tuyenSinh.body.includes('Những điều sinh viên cần biết'), 'Hồ sơ: Cam kết sinh viên present');

  // R1.3: Scholarships 4 brands
  assert(tuyenSinh.body.includes('FPT Aptech') && tuyenSinh.body.includes('Học bổng tài năng'), 'Aptech scholarships present');
  assert(tuyenSinh.body.includes('FPT Arena Multimedia'), 'Arena scholarships present');
  assert(tuyenSinh.body.includes('FPT Skillking'), 'Skillking scholarships present');
  assert(tuyenSinh.body.includes('FPT Jetking'), 'Jetking scholarships present');

  // R1.4: Tuition bank info
  assert(tuyenSinh.body.includes('00006969813'), 'Hanoi Tuition STK 00006969813 present');
  assert(tuyenSinh.body.includes('Trường Đại học FPT'), 'Hanoi Account Holder name present');
  assert(tuyenSinh.body.includes('FAIHN_hotensinhvien_HP HK 1'), 'Hanoi transfer syntax present');
  assert(tuyenSinh.body.includes('03557714109'), 'Da Nang Tuition STK 03557714109 present');
  assert(tuyenSinh.body.includes('Phân hiệu trường Đại học FPT tại TP Đà Nẵng'), 'Da Nang Account Holder name present');
  assert(tuyenSinh.body.includes('FAIDN_hotensinhvien_HP HK 1'), 'Da Nang transfer syntax present');

  // R1.5: No FAQ section
  assert(!tuyenSinh.body.includes('Câu hỏi thường gặp') && !tuyenSinh.body.includes('FAQ'), 'FAQ section eliminated from tuyen-sinh UI', 'No Câu hỏi thường gặp or visible FAQ block in HTML');

  // R1.6: Online registration form fields
  assert(tuyenSinh.body.includes('Lập trình Fullstack 2 năm - FPT Aptech'), 'Form includes Aptech Fullstack course option');
  assert(tuyenSinh.body.includes('Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia'), 'Form includes Arena AMSP course option');
  assert(tuyenSinh.body.includes('Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking'), 'Form includes Skillking course option');
  assert(tuyenSinh.body.includes('Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking'), 'Form includes Jetking Chip Design course option');
  assert(tuyenSinh.body.includes('Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking'), 'Form includes Jetking AI Agent course option');
  assert(tuyenSinh.body.includes('https://fpt.edu.vn/thu-vien-anh/11140'), 'Privacy policy external link present');

  // 2. Về FAI Page Verification
  console.log('\n--- 2. AUDITING /ve-fai PAGE & SECTIONS ---');
  const veFai = await fetchUrl(`${BASE_URL}/ve-fai`);
  assert(veFai.status === 200, 'Về FAI HTTP Status 200');
  assert(veFai.body.includes('27 năm'), 'Về FAI milestone / 27 years history present');
  assert(veFai.body.includes('Tập đoàn FPT'), 'Về FAI FPT Group ecosystem present');

  // 3. All 11 Course Pages Verification
  console.log('\n--- 3. AUDITING ALL 11 COURSE PAGES VIA COURSE LAYOUT ---');
  const coursePaths = [
    '/dao-tao/aptech/accp',
    '/dao-tao/aptech/1-nam',
    '/dao-tao/aptech/6-thang',
    '/dao-tao/aptech/100-200h',
    '/dao-tao/arena/amsp',
    '/dao-tao/arena/6-18-thang',
    '/dao-tao/arena/100h',
    '/dao-tao/skillking/18-thang',
    '/dao-tao/skillking/100h',
    '/dao-tao/chip-design',
    '/dao-tao/ai-agent'
  ];

  for (const path of coursePaths) {
    const res = await fetchUrl(`${BASE_URL}${path}`);
    assert(res.status === 200, `Course Route HTTP 200: ${path}`, `Size: ${Buffer.byteLength(res.body, 'utf8')} bytes`);
  }

  // 4. Check Interactivity elements in Code
  console.log('\n--- 4. AUDITING INTERACTIVE ELEMENTS & CODE ARCHITECTURE ---');
  // Copy button in TuitionBankSection
  assert(tuyenSinh.body.includes('fai-btn-copy') || tuyenSinh.body.includes('handleCopy') || tuyenSinh.body.includes('Sao chép'), 'Copy button UI present in tuition section');
  
  console.log('\n========================================================================');
  console.log(`AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('========================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
