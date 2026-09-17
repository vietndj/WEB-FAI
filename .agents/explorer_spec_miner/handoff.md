# BÁO CÁO ĐẶC TẢ CHI TIẾT (SPECIFICATION MINING REPORT)
## DỰ ÁN TÁI CẤU TRÚC KIẾN TRÚC DỮ LIỆU & GIAO DIỆN FAI WEB 2026

**Người thực hiện**: `explorer_spec_miner` (Specification Miner Archetype)  
**Ngày hoàn thành**: 2026-09-03  
**Môi trường**: Next.js 15 App Router, Local Development Mode (`http://localhost:3000`)  
**Tài liệu thẩm quyền**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md`  
**Mã nguồn khảo sát**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`

---

## 1. OBSERVATION (QUAN SÁT THỰC TẾ)

Dựa trên việc kiểm tra toàn diện tài liệu yêu cầu gốc `ORIGINAL_REQUEST.md` và mã nguồn hiện hữu tại `src/app/tuyen-sinh/page.js`, `src/app/dao-tao/*`, `src/app/lien-he/page.js`, `src/components/*`, chúng tôi ghi nhận các dữ kiện kỹ thuật và nội dung xác thực sau:

1. **Vấn đề God-Files hiện tại**:
   - Tệp `src/app/tuyen-sinh/page.js` dài tới 1,995 dòng code monolithic, nhúng cứng toàn bộ dữ liệu 11 khóa học, bảng học bổng 4 thương hiệu, 2 tài khoản ngân hàng, thông tin hotline, toàn bộ 7 khối layout và logic form đăng ký.
   - Tệp `src/app/ve-fai/page.js` dài 1,011 dòng; `src/app/lien-he/page.js` dài 597 dòng có danh sách campus bị phân mảnh theo từng thương hiệu riêng rẽ.
   - Thư mục `src/data/` hiện chỉ có duy nhất `src/data/news.js`, hoàn toàn thiếu các file Single Source of Truth cho `programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`.

2. **Khảo sát 11 chương trình đào tạo 2026**:
   - Danh mục 11 chương trình nằm rải rác nhưng có cấu trúc định tuyến tương ứng 100% tại `src/app/dao-tao/`:
     + `aptech/accp`: Lập trình Fullstack 2 năm - FPT Aptech (4 học kỳ, 784+ giờ, bằng ADSE)
     + `aptech/1-nam`: Lập trình Back end 1 năm - FPT Aptech (2 học kỳ, bằng DISM)
     + `aptech/6-thang`: Lập trình Front end 6 tháng - FPT Aptech (1 học kỳ, 10 môn, bằng CPISM)
     + `aptech/100-200h`: Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech (3 cấu phần module)
     + `arena/amsp`: Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia (4 học kỳ, bằng ADIM)
     + `arena/6-18-thang`: Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia (3 tracks 6-12-18 tháng)
     + `arena/100h`: Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia (4 khóa chuyên đề 100h)
     + `skillking/18-thang`: Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking (3 học kỳ, bằng Advanced Diploma)
     + `skillking/100h`: Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking (3 khóa chuyên đề 100h)
     + `chip-design`: Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking (4 học kỳ, LAB Synopsys/Cadence)
     + `ai-agent`: Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking (4 học kỳ, 784 giờ, exit points 6-12-18-24 tháng)

3. **Khảo sát Quỹ học bổng & Ưu đãi 2026**:
   - Được phân theo 4 thương hiệu với các hạn mức VNĐ cụ thể:
     + FPT Aptech: Tài năng (14 triệu), Khuyến khích nhập học (10 triệu), Chuyển ngành (6 triệu), Tân binh sáng tạo (2 triệu).
     + FPT Arena Multimedia: Tài năng (14 triệu), Khuyến khích nhập học (10 triệu), Chuyển ngành (6 triệu), Tân binh sáng tạo (1.5 - 2 triệu).
     + FPT Skillking: Tài năng (14 triệu), Khuyến khích nhập học (10 triệu), Chuyển ngành (6 triệu), Tân binh sáng tạo (1.5 - 2 triệu).
     + FPT Jetking: Tài năng Chip Design (8 triệu), Tài năng AI Agent (8 triệu), kèm đặc quyền tài khoản VIP Coursera & Udemy.

4. **Khảo sát Tài khoản chuyển khoản học phí 2026**:
   - Hà Nội: STK `00006969813`, Đơn vị: `Trường Đại học FPT`, Ngân hàng: `Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội`, Cú pháp: `FAIHN_hotensinhvien_HP HK 1`.
   - Đà Nẵng: STK `03557714109`, Đơn vị: `Phân hiệu trường Đại học FPT tại TP Đà Nẵng`, Ngân hàng: `Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng`, Cú pháp: `FAIDN_hotensinhvien_HP HK 1`.

5. **Khảo sát Liên hệ & Mạng lưới Campus**:
   - Hotlines trung tâm: Hà Nội `024 7300 8855`, Đà Nẵng `0236 730 8826`.
   - Email tiếp nhận toàn viện: `fai@fpt.edu.vn`. Giờ làm việc: `8:00 - 21:00 hàng ngày`.
   - Campus chính Hà Nội: Cổng 1, Nhà E, FPT Polytechnic, 13 Phan Tây Nhạc, P. Xuân Phương; Số 8 Tôn Thất Thuyết, Cầu Giấy; 94 Lương Yên; 264 Đội Cấn.
   - Campus chính Đà Nẵng: 130 Đống Đa, P. Hải Châu; và Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn.

6. **Khảo sát Form đăng ký trực tuyến**:
   - Các trường: Họ và tên (`fullName`), Số điện thoại (`phone`), Email (`email`), Cơ sở (`campus`: Hà Nội / Đà Nẵng), Khóa học (`program`: Dropdown 11 chương trình nhóm theo 4 brand), Điều khoản bảo vệ dữ liệu (`agreeTerms`: checkbox bắt buộc trỏ tới `https://fpt.edu.vn/thu-vien-anh/11140`).
   - Endpoint tích hợp: Apps Script Webhook `https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec`.

---

## 2. FEATURES DISCOVERED (DANH MỤC TÍNH NĂNG KHẢO SÁT TOÀN DIỆN)

### Bảng 1: Danh mục 11 Chương trình đào tạo chính thức 2026

| # | Category (Brand) | Feature (Program ID) | Display Name | Duration | Description | Target Audience | Semesters / Roadmap Modules | Discovered Via |
|---|------------------|----------------------|--------------|----------|-------------|-----------------|-----------------------------|----------------|
| 1 | FPT Aptech | `aptech/accp` | Lập trình Fullstack 2 năm - FPT Aptech | 2 năm | Đào tạo Lập trình viên Quốc tế Full-stack tích hợp AI thực chiến từ Web, Python, Data/MLOps, Java Microservices đến Enterprise Capstone. | Học sinh THPT, sinh viên CNTT, người đi làm chuyển ngành công nghệ. | 4 Học kỳ: HK1 (Web Foundations & AI), HK2 (Python, Data & MLOps), HK3 (Java Microservices & Mobile AI Flutter), HK4 (Enterprise Integration & Capstone). Bằng ADSE. | `ORIGINAL_REQUEST.md` (R1.5), `src/app/dao-tao/aptech/accp/page.js` |
| 2 | FPT Aptech | `aptech/1-nam` | Lập trình Back end 1 năm - FPT Aptech | 1 năm | Đào tạo chuyên sâu kiến trúc Backend, CSDL SQL Server, Web Fullstack với React & PHP/Laravel, Desktop JavaFX, C# và Python/Node.js. | Sinh viên CNTT cần thực chiến, người muốn đi làm nhanh trong 12 tháng. | 2 Học kỳ: HK1 (Web Fullstack React & PHP Laravel, 10 môn), HK2 (Desktop JavaFX, C#, Python Django, Node.js + AI, 11 môn). Bằng DISM. | `src/app/dao-tao/aptech/1-nam/page.js` |
| 3 | FPT Aptech | `aptech/6-thang` | Lập trình Front end 6 tháng - FPT Aptech | 6 tháng | Lộ trình tinh gọn 70% thực hành làm chủ UI/UX Figma, ReactJS hiện đại, kết nối SQL Server, Backend PHP Laravel và kiểm thử với ChatGPT/Copilot. | Người mới bắt đầu, người chuyển nghề cấp tốc, người cần có việc làm sau 6 tháng. | 1 Học kỳ (10 môn học): AI Applications, C Logic, HTML5/CSS3/JS, UI/UX Responsive, Copilot MOOC, ReactJS, SQL Server, Testing AI MOOC, PHP Laravel, eProject. Bằng CPISM. | `src/app/dao-tao/aptech/6-thang/page.js` |
| 4 | FPT Aptech | `aptech/100-200h` | Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech | 100 - 200 giờ | Module hóa linh hoạt đa kỹ năng (BA, Frontend, Backend, Automation Tester, DevOps) tích hợp AI để giải quyết nhanh lỗ hổng kỹ năng doanh nghiệp. | Lập trình viên bổ sung kỹ năng, QA/Tester học tự động hóa, người chuyển việc cấp tốc. | 3 Cấu phần: Khóa 1 (100h: ReactJS, BA, Java, Tester), Khóa 2 (100h: NodeJS Backend, SQL/NoSQL, AI API, Docker), Lộ trình tích hợp (200h Full-Stack & AI). | `src/app/dao-tao/aptech/100-200h/page.js` |
| 5 | FPT Arena Multimedia | `arena/amsp` | Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia | 2 năm | Đào tạo Chuyên gia Mỹ thuật Đa phương tiện chuẩn quốc tế: Thiết kế đồ họa 2D, Làm phim KTS, Hoạt hình 3D VFX và Game 3D Real-time trên Unreal Engine 5. | Học sinh tốt nghiệp THPT, người đam mê sáng tạo, designer muốn chuẩn hóa bằng quốc tế. | 4 Học kỳ: HK1 (Graphic Design & Digital Branding), HK2 (Digital Filmmaking & 3D Game Asset), HK3 (Advanced 3D Animation & VFX Compositing), HK4 (Real-Time 3D & Game Art Unreal Engine 5). Bằng ADIM. | `src/app/dao-tao/arena/amsp/page.js` |
| 6 | FPT Arena Multimedia | `arena/6-18-thang` | Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia | 6–18 tháng | Lộ trình chuyên ngành mũi nhọn linh hoạt: Thiết kế Đồ họa 2D & UI/UX (6 tháng), Làm phim kỹ thuật số & VFX (12 tháng), hoặc Hoạt hình 3D & Game Design (18 tháng). | Người chuyển ngành cần đi làm nhanh theo từng mảng chuyên môn cụ thể. | 3 Tracks: Track 6 tháng (Đồ họa 2D & Figma UI/UX), Track 12 tháng (Quay dựng phim KTS, CGI, After Effects), Track 18 tháng (Maya, Blender, Unreal Engine, Hoạt hình 3D). | `src/app/dao-tao/arena/6-18-thang/page.js` |
| 7 | FPT Arena Multimedia | `arena/100h` | Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia | 100 giờ | Đào tạo thực chiến 80% thực hành làm Project ngay từ ngày đầu, có ngay sản phẩm Portfolio để đi làm hoặc nhận dự án Freelance. | Content creators, chủ shop kinh doanh, sinh viên marketing cần kỹ năng thiết kế/video nhanh. | 4 Khóa chuyên đề: Khóa 1 (Thiết Kế Thương Hiệu - Thương Mại), Khóa 2 (Thiết Kế App/Web UI/UX), Khóa 3 (Làm Video / Clip Sáng Tạo), Khóa 4 (Thiết Kế Đồ Họa 3D & Game). | `src/app/dao-tao/arena/100h/page.js` |
| 8 | FPT Skillking | `skillking/18-thang` | Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking | 18 tháng | Khóa học Digital Marketing toàn diện số 1 VN theo chuẩn Ấn Độ kết hợp AI: Social Media, Performance Ads, SEO/SEM, Data Studio, CRM, E-Commerce và IMC đa kênh. | Sinh viên khối ngành kinh tế/marketing, người đi làm chuyển ngành, chủ doanh nghiệp. | 3 Học kỳ: HK1 (Social Media Executive & AI Content), HK2 (Digital Performance Executive & Google Ads/SEO/Data), HK3 (Full stack Digital Marketing & Omnichannel IMC). Bằng Advanced Diploma. | `src/app/dao-tao/skillking/18-thang/page.js` |
| 9 | FPT Skillking | `skillking/100h` | Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking | 100 giờ | Khóa học ngắn hạn cấp tốc tập trung 100% vào kỹ năng thực chiến ra số, tối ưu chi phí quảng cáo và vận hành bán hàng đa kênh. | Chủ shop online, người kinh doanh thực chiến, nhân viên marketing cần tăng trưởng doanh thu. | 3 Khóa chuyên đề: Khóa 1 (Social Media Creator & Ads Performance Meta/TikTok), Khóa 2 (Google Mastery: SEO & Google Ads), Khóa 3 (S-Commerce & TikTok Shop Mastery). | `src/app/dao-tao/skillking/100h/page.js` |
| 10 | FPT Jetking | `chip-design` | Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking | 2 năm | Đào tạo Kỹ sư Thiết kế vi mạch bán dẫn quốc tế tích hợp AI, thực hành bản quyền công cụ EDA Synopsys & Cadence, thiết kế ASIC/SoC/FPGA. | Sinh viên ngành kỹ thuật (Điện tử, Tự động hóa, CNTT, Vật lý), người muốn vào ngành bán dẫn. | 4 Học kỳ: HK1 (Mạch điện tử & Lập trình vi điều khiển), HK2 (Kiến trúc & Quy trình thiết kế vi mạch), HK3 (HDL Verilog/VHDL & EDA Tools), HK4 (Thiết kế vi mạch SoC/ASIC/FPGA). Bằng HDSE. | `src/app/dao-tao/chip-design/page.js` |
| 11 | FPT Jetking | `ai-agent` | Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking | 6 tháng - 2 năm | Đào tạo Kỹ sư AI Agent chuyên sâu: Data Science, Machine Learning, Computer Vision, NLP, GenAI, Large Language Models và hệ thống Multi-AI Agent tự hành. | Lập trình viên đón đầu làn sóng Generative AI, người muốn phát triển trợ lý ảo và tự động hóa. | 4 Học kỳ (784h): HK1 (Foundations Data Science & AI Agent - exit 6m), HK2 (Advanced Analytics & Vision Agent - exit 12m), HK3 (NLP Agent & Deep Learning - exit 18m), HK4 (Multi-Agent Systems & GenAI). | `src/app/dao-tao/ai-agent/page.js` |

---

### Bảng 2: Danh mục Quỹ học bổng & Ưu đãi tuyển sinh 2026

| # | Thương hiệu | Tên Học bổng / Ưu đãi | Giá trị hiển thị | Số tiền (VNĐ) | Đối tượng & Tiêu chí áp dụng | Badge hiển thị |
|---|-------------|-----------------------|------------------|---------------|------------------------------|----------------|
| 1 | FPT Aptech | Học bổng tài năng | 14 Triệu | 14.000.000 VNĐ | Dành cho thí sinh có thành tích học tập xuất sắc hoặc thể hiện đam mê lập trình công nghệ vượt trội. | HỌC BỔNG XUẤT SẮC |
| 2 | FPT Aptech | Khuyến khích nhập học | 10 Triệu | 10.000.000 VNĐ | Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục nhập học sớm các đợt mở lớp mới năm 2026. | NHẬP HỌC SỚM |
| 3 | FPT Aptech | Ưu đãi chuyển ngành | 6 Triệu | 6.000.000 VNĐ | Chính sách trợ lực đặc quyền dành riêng cho người đi làm và sinh viên chuyển hướng sang ngành Lập trình. | DÀNH CHO NGƯỜI CHUYỂN NGÀNH |
| 4 | FPT Aptech | Học bổng "Tân binh sáng tạo" | 2 Triệu | 2.000.000 VNĐ | Quỹ hỗ trợ tân sinh viên gia nhập các chuyên ngành Lập trình Fullstack và Backend. | QUỸ TÂN BINH |
| 5 | FPT Arena Multimedia | Học bổng tài năng | 14 Triệu | 14.000.000 VNĐ | Dành cho thí sinh có năng khiếu mỹ thuật, đồ họa, video hoặc portfolio sáng tạo nổi bật. | HỌC BỔNG XUẤT SẮC |
| 6 | FPT Arena Multimedia | Khuyến khích nhập học | 10 Triệu | 10.000.000 VNĐ | Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục đăng ký sớm trong kỳ tuyển sinh. | NHẬP HỌC SỚM |
| 7 | FPT Arena Multimedia | Ưu đãi chuyển ngành | 6 Triệu | 6.000.000 VNĐ | Dành riêng cho người đi làm muốn đổi việc, theo đuổi đam mê thiết kế Multimedia, 2D/3D & Game. | DÀNH CHO NGƯỜI CHUYỂN NGÀNH |
| 8 | FPT Arena Multimedia | Học bổng "Tân binh sáng tạo" | 1.5 - 2 Triệu | 1.500.000 – 2.000.000 VNĐ | Khuyến khích tân sinh viên hoàn tất hồ sơ sớm vào các chuyên ngành Mỹ thuật số. | QUỸ TÂN BINH |
| 9 | FPT Skillking | Học bổng tài năng | 14 Triệu | 14.000.000 VNĐ | Dành cho thí sinh đam mê Digital Marketing và có tư duy kinh doanh trực tuyến đột phá cùng AI. | HỌC BỔNG XUẤT SẮC |
| 10 | FPT Skillking | Khuyến khích nhập học | 10 Triệu | 10.000.000 VNĐ | Ưu đãi trừ trực tiếp vào học phí cho các suất đăng ký nhập học sớm trong các đợt khai giảng. | NHẬP HỌC SỚM |
| 11 | FPT Skillking | Ưu đãi chuyển ngành | 6 Triệu | 6.000.000 VNĐ | Hỗ trợ chuyển đổi sự nghiệp toàn diện sang Tiếp thị số đa kênh tích hợp trí tuệ nhân tạo. | DÀNH CHO NGƯỜI CHUYỂN NGÀNH |
| 12 | FPT Skillking | Học bổng "Tân binh sáng tạo" | 1.5 - 2 Triệu | 1.500.000 – 2.000.000 VNĐ | Quỹ tài trợ tân binh đăng ký khóa Fullstack Digital Marketing With AI. | QUỸ TÂN BINH |
| 13 | FPT Jetking | Học bổng tài năng Chip Design | 8 Triệu | 8.000.000 VNĐ | Dành cho học viên theo học ngành Thiết kế vi mạch bán dẫn quốc tế tích hợp AI 2 năm. | CHIP DESIGN QUỐC TẾ |
| 14 | FPT Jetking | Học bổng tài năng AI Agent | 8 Triệu | 8.000.000 VNĐ | Dành cho học viên theo học ngành Lập trình AI Agent chuyên sâu đón đầu làn sóng Generative AI. | AI AGENT TIÊN PHONG |

---

### Bảng 3: Tài khoản ngân hàng học phí 2026

| Cơ sở | Số tài khoản | Tên người thụ hưởng | Ngân hàng thụ hưởng | Chi nhánh | Cú pháp chuyển tiền chuẩn | Ví dụ minh họa | Địa chỉ cơ sở |
|-------|--------------|---------------------|---------------------|-----------|---------------------------|----------------|---------------|
| **Hà Nội** | `00006969813` | Trường Đại học FPT | Ngân hàng Tiên Phong (TPBank) | Chi nhánh Hà Nội | `FAIHN_hotensinhvien_HP HK 1` | `FAIHN_NguyenVanAn_HP HK 1` | Toà nhà FPT, Phố Dịch Vọng Hậu, Cầu Giấy, Hà Nội |
| **Đà Nẵng** | `03557714109` | Phân hiệu trường Đại học FPT tại TP Đà Nẵng | Ngân hàng Tiên Phong (TPBank) | Chi nhánh Đà Nẵng | `FAIDN_hotensinhvien_HP HK 1` | `FAIDN_TranThiBinh_HP HK 1` | Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng |

---

### Bảng 4: Hệ thống thông tin liên hệ & Campus toàn quốc

| Phân loại | Tên đơn vị / Cơ sở | Địa chỉ cụ thể | Hotline liên hệ | Email tiếp nhận | Ghi chú vận hành |
|-----------|--------------------|----------------|-----------------|-----------------|------------------|
| **Toàn viện (FAI)** | Viện Đào tạo Quốc tế FPT | Toàn hệ thống | HN: `024 7300 8855`<br>ĐN: `0236 730 8826` | `fai@fpt.edu.vn` | Giờ tư vấn: 8:00 - 21:00 hàng ngày |
| **Hà Nội Campus** | FPT Polytechnic & FAI Phan Tây Nhạc | Cổng số 1, Nhà E, Toà nhà FPT Polytechnic, 13 Phan Tây Nhạc, P. Xuân Phương, Q. Nam Từ Liêm, Hà Nội | `024 7300 8855`<br>`0833 999 810` | `aptech.hn@fpt.edu.vn`<br>`farena.hn@fpt.edu.vn` | Đào tạo cả 4 thương hiệu |
| **Hà Nội Campus** | FPT Cầu Giấy / Tôn Thất Thuyết | Số 8 Tôn Thất Thuyết, Phường Cầu Giấy, Hà Nội | `0833 999 810` | `aptech.hn@fpt.edu.vn` | FPT Aptech |
| **Hà Nội Campus** | FPT Arena Đội Cấn | 264 Đội Cấn, Phường Ba Đình, Hà Nội | `024 7300 8855` | `farena.hn@fpt.edu.vn` | FPT Arena Multimedia |
| **Hà Nội Campus** | FPT Lương Yên | 94 Lương Yên, Phường Bạch Đằng, Q. Hai Bà Trưng, Hà Nội | `024 7300 8855` | `farena.hn@fpt.edu.vn`<br>`skillking.hn@fpt.edu.vn` | FPT Arena & FPT Skillking |
| **Đà Nẵng Campus** | FPT Đống Đa | 130 Đống Đa, Phường Hải Châu, TP. Đà Nẵng | `0236 730 8826`<br>`0941 173 530` | `farena.dn@fpt.edu.vn`<br>`skillking.dn@fpt.edu.vn` | Arena, Skillking, Jetking |
| **Đà Nẵng Campus** | Phân hiệu ĐH FPT Đà Nẵng | Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn, Đà Nẵng | `0236 730 8826` | `fai@fpt.edu.vn` | Trung tâm thực nghiệm & Khảo thí |
| **TP. HCM (Mạng lưới)** | Cơ sở 21 Bis Hậu Giang | 21 Bis Hậu Giang, Phường Tân Sơn Nhất, TP. Hồ Chí Minh | `0834 999 810`<br>`028 7300 8866` | `aptech.hcm@fpt.edu.vn` | Phục vụ học viên miền Nam |
| **TP. HCM (Mạng lưới)** | Cơ sở Nguyên Hồng | 84A Nguyên Hồng, Phường Hạnh Thông, TP. Hồ Chí Minh | `0834 999 810`<br>`028 7300 8866` | `aptech.hcm@fpt.edu.vn` | Phục vụ học viên miền Nam |
| **Cần Thơ (Mạng lưới)** | Cơ sở Cần Thơ | 55 Cách Mạng Tháng 8, Phường Cái Khế, TP. Cần Thơ | `0292 730 8806` | `farena.ct@fpt.edu.vn` | Phục vụ học viên Tây Nam Bộ |

---

### Bảng 5: Đặc tả trường dữ liệu Form Đăng ký xét tuyển trực tuyến 2026

| Trường dữ liệu | Tên field trong state | Kiểu dữ liệu (Type) | Quy tắc Validation | Thông báo lỗi khi không hợp lệ | Giá trị mặc định / Options | Link / Ràng buộc phụ thuộc |
|----------------|----------------------|---------------------|--------------------|--------------------------------|----------------------------|----------------------------|
| **Họ và tên** | `fullName` | `string` (text) | Bắt buộc (`trim().length >= 2`). | "Vui lòng nhập họ và tên"<br>"Họ và tên tối thiểu 2 ký tự" | `''` (Rỗng) | Không chứa ký tự đặc biệt nguy hiểm. |
| **Số điện thoại** | `phone` | `string` (tel) | Bắt buộc, đúng chuẩn 10 chữ số VN: `/^(0[35789])[0-9]{8}$/`. | "Vui lòng nhập số điện thoại"<br>"Số điện thoại không hợp lệ (cần 10 chữ số hợp lệ)" | `''` (Rỗng) | Loại bỏ khoảng trắng trước khi regex. |
| **Địa chỉ Email** | `email` | `string` (email) | Bắt buộc, định dạng email chuẩn: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. | "Vui lòng nhập địa chỉ email"<br>"Địa chỉ email không đúng định dạng" | `''` (Rỗng) | - |
| **Cơ sở học tập** | `campus` | `string` (radio/button) | Bắt buộc chọn 1 trong 2 cơ sở. | - | `'Hà Nội'` | Lựa chọn: `['Hà Nội', 'Đà Nẵng']` |
| **Chương trình quan tâm** | `program` | `string` (select dropdown) | Bắt buộc chọn 1 trong 11 chương trình chính thức. | - | `'Lập trình Fullstack 2 năm - FPT Aptech'` | Phân nhóm theo 4 `optgroup`: FPT Aptech (4), FPT Arena (3), FPT Skillking (2), FPT Jetking (2). |
| **Điều khoản bảo vệ dữ liệu** | `agreeTerms` | `boolean` (checkbox) | Bắt buộc phải là `true`. | "Bạn cần đồng ý với Quy định bảo vệ dữ liệu cá nhân của FPT" | `true` | Hyperlink bắt buộc mở tab mới: `https://fpt.edu.vn/thu-vien-anh/11140`. |

---

## 3. EDGE CASES (CÁC TRƯỜNG HỢP BIÊN & QUY TẮC XỬ LÝ)

| # | Feature | Input / Tình huống | Observed Behavior / Xử lý chuẩn | Rationale / Giải thích kỹ thuật |
|---|---------|--------------------|----------------------------------|---------------------------------|
| 1 | Phone Validation | Nhập số điện thoại có dấu cách: `"0912 345 678"` hoặc dấu gạch `"0912-345-678"` | Regex cần `phone.replace(/\s+/g, '').replace(/-/g, '')` trước khi test. Nếu đúng 10 số hợp lệ -> Chấp nhận. | Người dùng di động thường bật auto-fill có chứa dấu cách. |
| 2 | Phone Validation | Nhập số bàn cố định Hà Nội (`02473008855`) hoặc số quốc tế (`+84...`) | Bị chặn bởi regex di động `^(0[35789])`. | Tư vấn tuyển sinh qua SMS/Zalo cần số điện thoại di động cá nhân của thí sinh. |
| 3 | Terms Agreement | Thí sinh bỏ chọn checkbox `agreeTerms` rồi bấm Submit | Form chặn submit ngay tại client, hiển thị thông báo lỗi màu đỏ `#dc2626` bên dưới checkbox. | Tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân của FPT. |
| 4 | Network / CORS Timeout | API Apps Script phản hồi chậm hoặc bị CORS chặn khi gửi từ trình duyệt | Sử dụng `fetch(url, { method: 'POST', mode: 'no-cors' })` trong khối `try...catch`, luôn chuyển sang màn hình thành công sau timeout nhẹ để không gây nghẽn trải nghiệm người dùng. | Apps Script execution redirect thường gây lỗi CORS trong fetch tiêu chuẩn. |
| 5 | Copy STK ngân hàng | Trình duyệt không hỗ trợ `navigator.clipboard` (hoặc chạy trong In-App Browser Facebook/Zalo không có HTTPS permission) | Hệ thống kích hoạt fallback tự động tạo thẻ `<textarea style="position: absolute; left: -9999px">`, thực thi `document.execCommand('copy')`. | Đảm bảo nút copy STK hoạt động 100% trên mọi mobile in-app webview. |
| 6 | Đổi Tab học bổng | Người dùng chuyển qua lại giữa 4 tab (Aptech, Arena, Skillking, Jetking) | UI thay đổi mượt mà themeColor (`#f37021`, `#ffb600`, `#09529c`, `#dc2626`), re-render danh sách card học bổng mà không bị giật trang hay scroll layout. | Quản lý bằng React state cục bộ hoặc component con độc lập `ScholarshipTabSection`. |
| 7 | Nhập lại form | Sau khi submit thành công, bấm "Gửi thêm đăng ký mới" | Reset sạch state `formData` về mặc định, ẩn màn hình success, hiển thị lại form trống sẵn sàng nhập tiếp. | Cho phép phụ huynh/thí sinh đăng ký thêm cho bạn bè hoặc chương trình thứ 2. |

---

## 4. LOGIC CHAIN (LẬP LUẬN TỪ ĐẶC TẢ TỚI KIẾN TRÚC MÃ NGUỒN)

1. **Từ Hiện trạng God-Files tới Single Source of Truth**:
   - Hiện nay, thông tin 11 chương trình, quỹ học bổng, STK học phí và hotline bị hardcode lặp lại ở ít nhất 6 file khác nhau (`tuyen-sinh/page.js`, `lien-he/page.js`, `Footer.jsx`, `ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`, `Skillking100hFormSection.jsx`).
   - Mỗi lần cập nhật một số điện thoại hay một mức học bổng, lập trình viên phải sửa tay cả 6 file, dẫn đến sai lệch dữ liệu (ví dụ: một nơi ghi hotline `0833 999 810`, nơi khác ghi `024 7300 8855`).
   - Do đó, việc tách rời dữ liệu vào 4 tệp dữ liệu chuẩn tại `src/data/`:
     + `src/data/programs.js`
     + `src/data/scholarships.js`
     + `src/data/tuition.js`
     + `src/data/contacts.js`
     là bước đi nền tảng bắt buộc, đóng vai trò "Single Source of Truth".

2. **Cấu trúc dữ liệu chi tiết đề xuất cho 4 file Data**:
   - **`src/data/programs.js`**: Export `TRAINING_PROGRAMS_2026` (mảng nhóm theo 4 brand cho Dropdown Form) và `PROGRAM_DETAILS` (Object chi tiết với lộ trình từng học kỳ, core stack, AI tools, careers, certificate cho các trang đào tạo).
   - **`src/data/scholarships.js`**: Export `SCHOLARSHIP_BRANDS` chứa 4 brand (id, name, tagline, themeColor, accentBg, borderColor, items gồm title, value, amount, desc, badge).
   - **`src/data/tuition.js`**: Export `TUITION_ACCOUNTS` chứa mảng 2 tài khoản (HN & DN: campusKey, campusName, badge, accountNumber, accountName, bankName, shortBank, branch, transferSyntax, syntaxExample, address).
   - **`src/data/contacts.js`**: Export `GLOBAL_CONTACTS` (hotlineHN, hotlineDN, email, website, workingHours) và `CAMPUS_LOCATIONS` (phân theo thành phố và thương hiệu).

3. **Từ Monolithic `tuyen-sinh/page.js` tới Atomic Sub-components**:
   - Tệp `tuyen-sinh/page.js` gần 2,000 dòng hiện chứa 7 Block logic rõ rệt. Khi bẻ nhỏ thành các component trong `src/components/tuyen-sinh/`:
     + `HeroSection.jsx` (Block 1: Tiêu đề, badge 2026, nút anchor)
     + `TargetAudienceSection.jsx` (Block 2: Đối tượng tuyển sinh, nhấn mạnh người chuyển ngành)
     + `AdmissionMethodSection.jsx` (Block 3: Xét tuyển thẳng, không cần thi tuyển)
     + `AdmissionDossierSection.jsx` (Block 4: Quy trình 4 bước & hồ sơ rút gọn 3 mục)
     + `ScholarshipTabSection.jsx` (Block 5: Tab chuyển đổi 4 thương hiệu học bổng 2026)
     + `TuitionBankSection.jsx` (Block 6: Thẻ chuyển khoản TPBank 2 miền & nút 1-chạm copy)
     + `OnlineRegistrationSection.jsx` (Block 7: Hotline & Form đăng ký 11 khóa học + checkbox điều khoản)
   - Tệp `src/app/tuyen-sinh/page.js` sẽ thu gọn xuống dưới 150-200 dòng, chỉ làm nhiệm vụ import các block con và quản lý layout tổng thể.

4. **Tuân thủ quy tắc khóa luồng font chữ**:
   - Luồng song song đang tinh chỉnh font sang `SVN-Sonoma` và `SVN-Poppins`.
   - Toàn bộ sub-components và trang Tuyển sinh phải sử dụng `fontFamily: 'var(--font-sans)'` hoặc class chung, tuyệt đối không hardcode font inline để tự động đồng bộ khi luồng font hoàn thành.

---

## 5. CAVEATS (CÁC ĐIỂM CẦN LƯU Ý & GIẢ ĐỊNH)

1. **Giả định về Backend Form**:
   - Hiện tại ứng dụng sử dụng Google Apps Script làm endpoint hứng dữ liệu form đăng ký. URL script `https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec` hoạt động với chế độ `no-cors`.
   - Nếu trong tương lai có thêm endpoint Telegram Bot hoặc CRM FPT nội bộ, form cần hỗ trợ cơ chế nạp URL linh hoạt từ biến môi trường (`process.env.NEXT_PUBLIC_ADMISSION_WEBHOOK_URL`).
2. **Khu vực đào tạo TP. HCM và Cần Thơ**:
   - Trong chính sách học phí 2026 của `ORIGINAL_REQUEST.md`, tài liệu chỉ đặc tả 2 khu vực nộp học phí là **Hà Nội** và **Đà Nẵng**. Vì vậy khối học phí trên trang Tuyển sinh tập trung hiển thị chuẩn xác 2 STK này. Các cơ sở TP. HCM và Cần Thơ tiếp tục hiển thị tại trang Liên hệ (`/lien-he`) và chân trang (`Footer.jsx`).
3. **Phạm vi bảo vệ luồng làm việc**:
   - Tuyệt đối tuân thủ quy tắc phát triển cục bộ (Local Only): Không chạy `git commit`, `git push` hay deploy lên Vercel Production.

---

## 6. CONCLUSION (KẾT LUẬN & KIẾN NGHỊ CHO ORCHESTRATOR)

1. **Hoàn tất khai thác 100% đặc tả**: Toàn bộ 5 yêu cầu cốt lõi (11 khóa học 2026, quỹ học bổng 4 thương hiệu, STK học phí 2 miền, liên hệ các campus, form đăng ký trực tuyến) đã được đào sâu, bóc tách và tài liệu hóa chi tiết với độ chính xác tuyệt đối.
2. **Kế hoạch triển khai cho Worker Agents**:
   - **Bước 1**: Tạo 4 tệp dữ liệu tại `src/data/`: `programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`.
   - **Bước 2**: Tạo thư mục `src/components/tuyen-sinh/` và phân rã `src/app/tuyen-sinh/page.js` thành 6-7 atomic sub-components.
   - **Bước 3**: Refactor `src/app/tuyen-sinh/page.js` để lắp ghép các components, giảm độ dài từ 1,995 dòng xuống < 200 dòng.
   - **Bước 4**: Kiểm thử xác minh giao diện trên `http://localhost:3000/tuyen-sinh` (Responsive 375px, 768px, 1280px, Tab chuyển đổi, Copy STK, Submit Form).

---

## 7. VERIFICATION METHOD (PHƯƠNG PHÁP XÁC MINH ĐỘC LẬP)

Để kiểm chứng tính xác thực của bản báo cáo này, các agents hoặc kiểm thử viên có thể chạy các lệnh và thao tác sau:

1. **Xác minh số lượng và tên 11 chương trình**:
   - Xem tệp `ORIGINAL_REQUEST.md` tại các dòng 50–61.
   - Đối chiếu với các thư mục thực tế tại `fai/src/app/dao-tao/`:
     ```bash
     ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/dao-tao"
     ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/dao-tao/aptech"
     ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/dao-tao/arena"
     ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/dao-tao/skillking"
     ```
2. **Xác minh số liệu học bổng & tài khoản ngân hàng**:
   - Xem tệp `ORIGINAL_REQUEST.md` dòng 28–40.
   - Kiểm tra mã nguồn hiện tại trong `fai/src/app/tuyen-sinh/page.js` dòng 63–230.
3. **Xác minh form đăng ký và link bảo vệ dữ liệu**:
   - Kiểm tra `fai/src/app/tuyen-sinh/page.js` dòng 1883–1933, xác nhận link `https://fpt.edu.vn/thu-vien-anh/11140`.
4. **Kiểm tra trạng thái build dev server local**:
   - Mở trình duyệt tại `http://localhost:3000/tuyen-sinh`.
   - Kiểm tra console log không có lỗi React Hydration mismatch.
