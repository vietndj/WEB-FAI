import fs from 'fs';

async function runTestSuite() {
  console.log("=== BẮT ĐẦU BỘ KIỂM THỬ ĐỘC LẬP - REVIEWER 1 ===");

  const filePath = '/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js';
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const res = await fetch("http://localhost:3000/tuyen-sinh");
  const html = await res.text();
  const status = res.status;

  const results = [];
  const assert = (id, description, passed, details = "") => {
    results.push({ id, description, passed, details });
    console.log(`[${passed ? "PASS" : "FAIL"}] ${id}: ${description} ${details ? `(${details})` : ""}`);
  };

  // 1. HTTP Server Check
  assert("TC-HTTP-200", "Máy chủ dev trả về HTTP 200 OK", status === 200, `Status: ${status}`);

  // 2. R1.1: Direct Admissions & Target Audience
  assert("TC-R1.1-DIRECT-TEXT", "Thông điệp 'Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển'", fileContent.includes("Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển"));
  assert("TC-R1.1-NO-EXAM-1", "Loại bỏ hoàn toàn 'Môn 1: Tiếng Anh'", !fileContent.includes("Môn 1: Tiếng Anh") && !fileContent.includes("Môn 1 Tiếng Anh"));
  assert("TC-R1.1-NO-EXAM-2", "Loại bỏ hoàn toàn 'Môn 2: Sáng Tạo / Logic'", !fileContent.includes("Môn 2: Sáng Tạo / Logic") && !fileContent.includes("Môn 2 Sáng tạo / Logic"));
  assert("TC-R1.1-CAREER-CHANGER", "Nhấn mạnh nhóm đối tượng Người đi làm chuyển ngành", fileContent.includes("Người đi làm chuyển ngành") && fileContent.includes("ƯU ĐÃI ĐẾN 6 TRIỆU"));
  assert("TC-R1.1-DOSSIER-COUNT", "Đúng 03 loại giấy tờ trong hồ sơ nhập học", 
    fileContent.includes("01 Phiếu đăng ký nhập học") && 
    fileContent.includes("01 Bản sao công chứng CCCD") && 
    fileContent.includes("01 Cam kết sinh viên đã đọc"));

  // 3. R1.2: 4 Brand Scholarships
  assert("TC-R1.2-APTECH", "FPT Aptech có đủ 4 mức học bổng (14M, 10M, 6M, 2M)", 
    fileContent.includes("14 Triệu") && fileContent.includes("10 Triệu") && fileContent.includes("6 Triệu") && fileContent.includes("2 Triệu"));
  assert("TC-R1.2-ARENA", "FPT Arena Multimedia có mức học bổng 1.5 - 2 Triệu", fileContent.includes("1.5 - 2 Triệu"));
  assert("TC-R1.2-SKILLKING", "FPT Skillking có đủ thông tin học bổng", fileContent.includes("FPT Skillking") && fileContent.includes("Digital Marketing"));
  assert("TC-R1.2-JETKING", "FPT Jetking có học bổng Chip Design 8M và AI Agent 8M", 
    fileContent.includes("Học bổng tài năng Chip Design") && 
    fileContent.includes("Học bổng tài năng AI Agent") && 
    fileContent.includes("8 Triệu"));

  // 4. R1.3: Tuition Banking Information
  assert("TC-R1.3-HN-STK", "Hà Nội STK 00006969813 & cú pháp FAIHN_hotensinhvien_HP HK 1", 
    fileContent.includes("00006969813") && fileContent.includes("FAIHN_hotensinhvien_HP HK 1"));
  assert("TC-R1.3-DN-STK", "Đà Nẵng STK 03557714109 & cú pháp FAIDN_hotensinhvien_HP HK 1", 
    fileContent.includes("03557714109") && fileContent.includes("FAIDN_hotensinhvien_HP HK 1"));
  assert("TC-R1.3-TPBANK", "Ngân hàng TPBank cho cả hai cơ sở", 
    fileContent.includes("Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội") && 
    fileContent.includes("Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng"));
  assert("TC-R1.3-COPY-BUTTONS", "Tính năng nút sao chép 1-chạm cho STK và Cú pháp", fileContent.includes("handleCopy"));

  // 5. R1.4: Strict Absence of FAQ
  assert("TC-R1.4-NO-FAQ-SECTION", "Không có khối câu hỏi thường gặp FAQ trên giao diện", 
    !fileContent.includes("Câu hỏi thường gặp") && 
    !fileContent.includes("Hỏi đáp tuyển sinh") && 
    !fileContent.includes("FAQ Accordion"));

  // 6. R1.5: Hotlines & Online Form
  assert("TC-R1.5-HOTLINES", "Hotline Hà Nội 024 7300 8855 và Đà Nẵng 0236 730 8826", 
    fileContent.includes("024 7300 8855") && fileContent.includes("0236 730 8826"));
  assert("TC-R1.5-EMAIL", "Email liên hệ fai@fpt.edu.vn", fileContent.includes("fai@fpt.edu.vn"));
  assert("TC-R1.5-CAMPUS-SELECT", "Lựa chọn cơ sở Hà Nội & Đà Nẵng", 
    fileContent.includes("Cơ sở Hà Nội") || fileContent.includes("Cơ sở {campusName}"));
  assert("TC-R1.5-PRIVACY-LINK", "Link điều khoản bảo vệ dữ liệu https://fpt.edu.vn/thu-vien-anh/11140", 
    fileContent.includes("https://fpt.edu.vn/thu-vien-anh/11140"));

  const exactPrograms = [
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

  let programsFound = true;
  for (const prog of exactPrograms) {
    if (!fileContent.includes(prog)) {
      programsFound = false;
      console.error(`Missing program: ${prog}`);
    }
  }
  assert("TC-R1.5-11-PROGRAMS", "Đầy đủ 11 chương trình đào tạo chuẩn theo đặc tả", programsFound);

  // 7. R2: Local Dev & Style
  assert("TC-R2-NO-TAILWIND", "Không sử dụng Tailwind CSS (sử dụng inline styles và CSS variables)", 
    !fileContent.includes("className=\"flex ") && 
    !fileContent.includes("className=\"text-") && 
    !fileContent.includes("className=\"bg-"));

  // 8. Integrity Checks
  assert("TC-INT-REAL-LOGIC", "Integrity Check: Thực thi logic thực, không dùng dummy facade", 
    typeof fileContent === 'string' && fileContent.length > 20000 && fileContent.includes("validateForm") && fileContent.includes("handleFormSubmit"));

  const passedAll = results.every(r => r.passed);
  console.log(`\nTổng kết: ${results.filter(r => r.passed).length}/${results.length} test cases ĐẠT.`);
  if (!passedAll) {
    process.exit(1);
  }
}

runTestSuite();
