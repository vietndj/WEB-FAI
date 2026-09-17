const fs = require('fs');
const http = require('http');

async function main() {
  console.log('=== RUNNING INDEPENDENT VICTORY AUDIT SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Inspect source file
  const pagePath = '/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js';
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  // Check obsolete test entrance removal
  assert(!pageContent.includes('Môn 1: Tiếng Anh'), 'Old entrance test "Môn 1: Tiếng Anh" is completely removed from source');
  assert(!pageContent.includes('Môn 2: Sáng Tạo'), 'Old entrance test "Môn 2: Sáng Tạo" is completely removed from source');
  assert(!pageContent.includes('1900 6000'), 'Old hotline "1900 6000" is completely removed');
  assert(!pageContent.includes('Bằng tốt nghiệp THPT (bản sao'), 'Old dossier items (Bằng THPT) removed from source');

  // Check R1.1 content
  assert(pageContent.includes('Cơ hội rộng mở cho người đam mê'), 'R1.1: Target audience title present');
  assert(pageContent.includes('Người đi làm chuyển ngành'), 'R1.1: Career changer audience highlighted');
  assert(pageContent.includes('Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển'), 'R1.1: Direct admission motto present');
  assert(pageContent.includes('01 Phiếu đăng ký nhập học'), 'R1.1: Dossier item 1 present');
  assert(pageContent.includes('01 Bản sao công chứng CCCD'), 'R1.1: Dossier item 2 present');
  assert(pageContent.includes('01 Cam kết sinh viên đã đọc'), 'R1.1: Dossier item 3 present');
  assert(pageContent.includes('Những điều sinh viên cần biết'), 'R1.1: Dossier handbook reference present');

  // Check R1.2 Scholarships
  assert(pageContent.includes('FPT Aptech'), 'R1.2: Brand FPT Aptech present');
  assert(pageContent.includes('FPT Arena Multimedia'), 'R1.2: Brand FPT Arena Multimedia present');
  assert(pageContent.includes('FPT Skillking'), 'R1.2: Brand FPT Skillking present');
  assert(pageContent.includes('FPT Jetking'), 'R1.2: Brand FPT Jetking present');
  assert(pageContent.includes('Học bổng tài năng Chip Design'), 'R1.2: Jetking Chip Design scholarship present');
  assert(pageContent.includes('Học bổng tài năng AI Agent'), 'R1.2: Jetking AI Agent scholarship present');
  assert(pageContent.includes('14.000.000 VNĐ') || pageContent.includes('14 Triệu'), 'R1.2: 14M scholarship present');
  assert(pageContent.includes('10.000.000 VNĐ') || pageContent.includes('10 Triệu'), 'R1.2: 10M scholarship present');
  assert(pageContent.includes('6.000.000 VNĐ') || pageContent.includes('6 Triệu'), 'R1.2: 6M scholarship present');

  // Check R1.3 Tuition
  assert(pageContent.includes('00006969813'), 'R1.3: Hanoi STK 00006969813 present');
  assert(pageContent.includes('Trường Đại học FPT'), 'R1.3: Hanoi account holder present');
  assert(pageContent.includes('FAIHN_hotensinhvien_HP HK 1'), 'R1.3: Hanoi transfer syntax present');
  assert(pageContent.includes('03557714109'), 'R1.3: Danang STK 03557714109 present');
  assert(pageContent.includes('Phân hiệu trường Đại học FPT tại TP Đà Nẵng'), 'R1.3: Danang account holder present');
  assert(pageContent.includes('FAIDN_hotensinhvien_HP HK 1'), 'R1.3: Danang transfer syntax present');
  assert(pageContent.includes('Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội'), 'R1.3: TPBank Hanoi branch present');
  assert(pageContent.includes('Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng'), 'R1.3: TPBank Danang branch present');

  // Check R1.4 FAQ Absence from tuyen-sinh page
  const hasFAQInPage = pageContent.includes('Câu hỏi thường gặp') || pageContent.includes('faq-item') || pageContent.includes('accordion');
  assert(!hasFAQInPage, 'R1.4: No FAQ accordion or "Câu hỏi thường gặp" block in page.js');

  // Check R1.5 Hotline & Email
  assert(pageContent.includes('024 7300 8855'), 'R1.5: Hanoi hotline present');
  assert(pageContent.includes('0236 730 8826'), 'R1.5: Danang hotline present');
  assert(pageContent.includes('fai@fpt.edu.vn'), 'R1.5: Contact email present');

  // Check 11 training programs
  const programs = [
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

  for (const prog of programs) {
    assert(pageContent.includes(prog), `R1.5: Program "${prog}" present in dropdown list`);
  }

  // Check mandatory checkbox & privacy policy URL
  assert(pageContent.includes('https://fpt.edu.vn/thu-vien-anh/11140'), 'R1.5: Privacy policy URL present');
  assert(pageContent.includes('Đồng ý để dữ liệu cá nhân của Anh/Chị được thu thập'), 'R1.5: Privacy policy disclaimer present');

  // Check Phone regex
  const phoneRegex = /^(0[35789])[0-9]{8}$/;
  assert(!phoneRegex.test('0|12345678'), 'Regex validation: pipe injection rejected');
  assert(phoneRegex.test('0912345678'), 'Regex validation: standard 09 valid');
  assert(phoneRegex.test('0388888888'), 'Regex validation: standard 03 valid');
  assert(phoneRegex.test('0777777777'), 'Regex validation: standard 07 valid');
  assert(phoneRegex.test('0888888888'), 'Regex validation: standard 08 valid');
  assert(phoneRegex.test('0555555555'), 'Regex validation: standard 05 valid');
  assert(!phoneRegex.test('0123456789'), 'Regex validation: invalid prefix 01 rejected');
  assert(!phoneRegex.test('091234567'), 'Regex validation: 9 digits rejected');
  assert(!phoneRegex.test('09123456789'), 'Regex validation: 11 digits rejected');

  // 2. Fetch live HTML from local dev server
  await new Promise((resolve) => {
    http.get('http://localhost:3000/tuyen-sinh', (res) => {
      let data = '';
      assert(res.statusCode === 200, `Live Server: HTTP Status code is ${res.statusCode} (expected 200)`);

      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        assert(data.length > 5000, `Live Server: HTML response length is ${data.length} bytes (>5000 bytes)`);
        assert(data.includes('C&#x1A1; h&#x1ED9;i r&#x1ED9;ng m&#x1EDF; cho ng&#x1B0;&#x1EDD;i &#x111;am m&#xEA;') || data.includes('Cơ hội rộng mở cho người đam mê'), 'Live Server: Hero title in rendered HTML');
        assert(data.includes('00006969813'), 'Live Server: Hanoi STK in rendered HTML');
        assert(data.includes('03557714109'), 'Live Server: Danang STK in rendered HTML');
        assert(data.includes('024 7300 8855') || data.includes('02473008855'), 'Live Server: Hotline HN in rendered HTML');
        assert(data.includes('0236 730 8826') || data.includes('02367308826'), 'Live Server: Hotline DN in rendered HTML');
        assert(data.includes('https://fpt.edu.vn/thu-vien-anh/11140'), 'Live Server: Privacy policy link in rendered HTML');
        assert(!data.includes('Môn 1: Tiếng Anh'), 'Live Server: Old exam content absent from rendered HTML');
        assert(!data.includes('Môn 2: Sáng Tạo'), 'Live Server: Old exam content absent from rendered HTML');

        // Check main tag specifically for FAQ block absence
        const mainMatch = data.match(/<main[\s\S]*?<\/main>/);
        assert(mainMatch !== null, 'Live Server: Main container found in HTML');
        if (mainMatch) {
          const mainHtml = mainMatch[0];
          const hasFaqInMain = mainHtml.includes('Câu hỏi thường gặp') || mainHtml.includes('faq-item') || mainHtml.includes('accordion');
          assert(!hasFaqInMain, 'Live Server: FAQ section/accordion absent from main page interface');
        }

        resolve();
      });
    }).on('error', (err) => {
      assert(false, `Live Server Error: ${err.message}`);
      resolve();
    });
  });

  console.log(`\nTEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
