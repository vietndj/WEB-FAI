# Handoff Report — Specification Mining for FAI 2026 Admissions Page

## 1. Observation

### Source Documents Inspected
- **ORIGINAL_REQUEST.md**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md` (Total 81 lines).
  - Lines 19-27: "R1.1 Quy chế tuyển sinh & Điều kiện nhập học: Đối tượng tuyển sinh... Nhấn mạnh đối tượng 'Người đi làm chuyển ngành'... Bỏ hoàn toàn phần thi tuyển / kiểm tra năng lực cũ (Môn 1 Tiếng Anh, Môn 2 Sáng tạo/Logic). Thay bằng 2 hình thức xét tuyển thẳng: Đăng ký Online... Đăng ký trực tiếp... Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển... Hồ sơ nhập học: Rút gọn chính xác theo mẫu: 01 Phiếu đăng ký nhập học, 01 Bản sao công chứng CCCD, 01 Cam kết sinh viên đã đọc 'Những điều sinh viên cần biết'."
  - Lines 28-34: "R1.2 Học bổng và Ưu đãi nhập học 2026: Tạo khối hiển thị phân chia theo 4 sản phẩm/thương hiệu đào tạo (FPT Aptech, FPT Arena Multimedia, FPT Skillking, FPT Jetking)..."
  - Lines 35-40: "R1.3 Chính sách học phí 2026: Hà Nội: STK 00006969813 - Trường Đại học FPT - Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội - Cú pháp: FAIHN_hotensinhvien_HP HK 1. Đà Nẵng: STK 03557714109 - Phân hiệu trường Đại học FPT tại TP Đà Nẵng - Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng - Cú pháp: FAIDN_hotensinhvien_HP HK 1."
  - Lines 41-43: "R1.4 Loại bỏ khối Câu hỏi thường gặp (FAQ): Không hiển thị khối FAQ trên trang này."
  - Lines 44-64: "R1.5 Đăng ký tuyển sinh trực tuyến & Liên hệ: Hotline 024 7300 8855 • 0236 730 8826, Email fai@fpt.edu.vn... Dropdown chọn chương trình quan tâm (đủ 11 chương trình)... Lựa chọn Cơ sở: Hà Nội hoặc Đà Nẵng... Checkbox bắt buộc: 'Đồng ý để dữ liệu cá nhân của Anh/Chị được thu thập trên trang này... tại đây' (link trỏ đến https://fpt.edu.vn/thu-vien-anh/11140)."
  - Lines 65-69: "R2 Ràng buộc phát triển Local & Thẩm mỹ UI: Chỉ cập nhật mã nguồn trên môi trường local, kiểm tra trực tiếp qua http://localhost:3000/tuyen-sinh... Tuyệt đối KHÔNG tự động git commit, git push hay deploy lên Vercel/Production... Giữ vững style thiết kế hiện đại... không gây lỗi React hydration."

- **Google Spreadsheet Data Extraction**:
  - Command: `curl -sL "https://docs.google.com/spreadsheets/d/1o-AA9iOXfsjGD-nKaFo-KDH4wqzT61hzoUK5WuuHSmU/export?format=csv&gid=1279045597"`
  - Verbatim Content extracted:
    - Row 4: "1. Đối tượng tuyển sinh: Cơ hội rộng mở cho người đam mê... Sửa Người đi làm chuyển ngành: Muốn thay đổi công việc nhàm chán hiện tại bằng một nghề tràn đầy cảm hứng hoặc đang tìm kiếm một công việc với mức thu nhập lý tưởng"
    - Row 5: "2. Cách thức đăng ký: Đăng ký Online: Đăng ký nhập học trực tuyến tại website của Viện Đào tạoc Quốc Tế FPT. Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển. Đăng ký trực tiếp: Đăng ký nhập học trực tiếp tại các cơ sở của Viện Đào tạoc Quốc Tế FPT. Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển"
    - Row 6: "3. Hồ sơ nhập học: - 01 Phiếu đăng ký nhập học, - 01 Bản sao công chức CCCD, - 01 Cam kết sinh viên. đã đọc 'Những điều sinh viên cần biết'"
    - Row 7: "Học bổng và Ưu đãi nhập học 2026: 1. FPT Aptech (Tài năng 14tr, Khuyến khích 10tr, Chuyển ngành 6tr, Tân bịnh sáng tạo 2tr); 2. FPT Arena Multimedia (Tài năng 14tr, Khuyến khích 10tr, Chuyển ngành 6tr, Tân bịnh sáng tạo 1.5 - 2tr); 3. FPT Skillking (Tài năng 14tr, Khuyến khích 10tr, Chuyển ngành 6tr, Tân bịnh sáng tạo 1.5 - 2tr); 4. FPT Jetking (Tài năng Chip Design 8tr, Tài năng AI Agent 8tr)"
    - Row 8: "Chính sách học phí 2026: Hà Nội STK 00006969813, Đà Nẵng STK 03557714109..."
    - Row 9: "Câu hỏi thường gặp (FAQ) => bỏ"
    - Row 10: "Đăng ký tuyển sinh trực tuyến: Hotline 024 7300 8855 • 0236 730 8826, Email fai@fpt.edu.vn, Form 11 chương trình, Checkbox link https://fpt.edu.vn/thu-vien-anh/11140"

- **Existing Codebase State**:
  - `src/app/tuyen-sinh/page.js` (lines 1-302):
    - Line 34: Still mentions "môn thi năng lực đầu vào và hồ sơ thủ tục nhập học chính thức..."
    - Lines 112-150 (Block 3): Still displays "Môn 1: Tiếng Anh" and "Môn 2: Sáng Tạo / Logic" and "Kiểm tra năng lực đầu vào".
    - Lines 170-206: Still lists 4-step process including "02 Kiểm tra năng lực: Làm bài kiểm tra đầu vào (Tiếng Anh & Sáng tạo/Logic)".
    - Lines 217-238: Still lists 5 old dossiers including High school diploma, High school academic records, 4 photos of size 3x4.
    - Completely lacks Scholarship section (Block 2026).
    - Completely lacks Tuition payment banking info section (Block 2026).
    - Does NOT have online registration form (only shows hotline `1900 6000` at line 280).
  - `src/components/Header.jsx` (lines 115-119):
    - Points to `#thong-tin`, `#hoc-bong`, `#hoc-phi`, `#dang-ky`, `#faq`.
  - Local Server status:
    - Command: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tuyen-sinh` returned `200`.

## 2. Logic Chain

1. **Premise 1 (Policy Transition)**: FAI has shifted its admissions strategy for 2026 from an exam-based assessment ("Môn 1 Tiếng Anh", "Môn 2 Sáng tạo / Logic") to a 100% direct admission model ("Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển") via Online and In-person channels.
2. **Premise 2 (Dossier Simplification)**: Because admissions are now direct, the dossier requirement is radically streamlined to just 3 documents (Application form, certified copy of CCCD, student commitment), dropping prior academic transcripts, graduation diplomas, and portrait photos.
3. **Premise 3 (Product-line Scholarships)**: The 2026 scholarship pool is segmented strictly by 4 brands (Aptech, Arena Multimedia, Skillking, Jetking). Each has distinct tiers (up to 14M for talent, 10M early bird, 6M career switcher, 1.5-2M creative rookie, and specialized 8M chips/AI).
4. **Premise 4 (Financial Clarity & Security)**: Tuition payment requires exact banking instructions with distinct accounts for Hanoi (TPBank `00006969813`) and Danang (TPBank `03557714109`) with standardized syntax (`FAIHN_hotensinhvien_HP HK 1` / `FAIDN_hotensinhvien_HP HK 1`). Providing copy buttons prevents input errors during banking transfers.
5. **Premise 5 (Form & Compliance)**: The new form requires capturing 11 exact programs across the 4 brands, selecting campus (Hanoi / Danang), and strictly enforcing the legal privacy consent checkbox with outbound link `https://fpt.edu.vn/thu-vien-anh/11140`.
6. **Deduction & Strategy**: The existing `src/app/tuyen-sinh/page.js` must undergo a complete content and structural refactor to replace old exam blocks with direct admission blocks, add the Scholarship switcher/grid, add the Tuition banking card block, remove FAQ completely, and integrate the full-featured registration form with hotlines `024 7300 8855` • `0236 730 8826`.

## 3. Caveats

- **Typo Corrections**: The raw Google Sheet had several typos ("Tân bịnh" instead of "Tân binh", "công chức" instead of "công chứng", "Đào tạoc" instead of "Đào tạo"). As documented in `spec_report.md` Section 3 (Edge Cases E01, E03, E04), the normalized spelling has been adopted according to `ORIGINAL_REQUEST.md`.
- **FAQ in Header Megamenu**: The website Header (`Header.jsx`) has a link to `/tuyen-sinh#faq`. Since R1.4 mandates that the admissions page must NOT display any FAQ block, clicking this link will either do nothing or land at the bottom. An invisible anchor or future update to `Header.jsx` can be handled, but on `/tuyen-sinh` the FAQ block is strictly excluded.
- **Form Submission Target**: There is no custom backend API route `/api/tuyen-sinh` in Next.js. Similar to `ScholarshipFormSection.jsx`, the form on `/tuyen-sinh` should support optimistic submission state management (loading indicator -> success confirmation screen), with optional Google Apps Script submission if a webhook URL is configured.

## 4. Conclusion

The requirements mining phase is 100% complete:
- Every requirement (R1.1, R1.2, R1.3, R1.4, R1.5, R2) has been extracted, categorized, and itemized.
- All exact program names (11 programs), banking credentials (STK, accounts, TPBank branches, syntax), scholarship tiers (4 brands), contact hotlines, and legal links have been cataloged in `spec_report.md`.
- The delta analysis between the existing code and the target state is clearly mapped out.
- The project is ready for the Planner and Implementer agents to proceed without any ambiguity.

## 5. Verification Method

To independently verify the findings in this report:

1. **Verify Google Sheet extraction**:
   ```bash
   curl -sL "https://docs.google.com/spreadsheets/d/1o-AA9iOXfsjGD-nKaFo-KDH4wqzT61hzoUK5WuuHSmU/export?format=csv&gid=1279045597"
   ```
2. **Inspect Current Page vs Target**:
   ```bash
   cat "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js" | grep -E "Tiếng Anh|Sáng tạo|1900 6000"
   ```
3. **Verify Local Dev Server Status**:
   ```bash
   curl -I http://localhost:3000/tuyen-sinh
   ```
4. **Read Specification Report**:
   ```bash
   cat "/Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1/spec_report.md"
   ```

Invalidation conditions: If the university admission office changes scholarship amounts or bank account numbers in the Google Sheet, or re-introduces entrance exam testing, the tables in `spec_report.md` will need to be revised.
