'use client';

import CourseLayout from '@/components/course/CourseLayout';
import { Award, Check, Clock, BrainCircuit, Layout, Globe, FolderGit2, ShieldCheck } from 'lucide-react';

const subjects = [
  { num: 'MÔN 01', title: 'Applications of AI in Programming', desc: 'Sử dụng các công cụ AI để gỡ lỗi mã của bạn và giải quyết những thách thức mới.', tag: 'AI Fundamentals' },
  { num: 'MÔN 02', title: 'Foundations of Programming with C', desc: 'Giải quyết các vấn đề lập trình căn bản bằng sơ đồ luồng và mã giả.', tag: 'Logic & Algorithm' },
  { num: 'MÔN 03', title: 'Building Next-Level Dynamic Websites', desc: 'Sử dụng HTML5 / CSS3 / JavaScript để phát triển các trang web và ứng dụng tương tác.', tag: 'Core Web Tech' },
  { num: 'MÔN 04', title: 'Responsive UI/UX Strategies', desc: 'Tìm hiểu các nguyên tắc cơ bản của thiết kế UX/UI web hiệu quả trên mọi màn hình.', tag: 'UI/UX & Figma' },
  { num: 'MÔN 05', title: 'GitHub Copilot Beginner to Pro – AI for Coding', desc: 'Sử dụng GitHub Copilot AI để tự động tạo mã và viết kiểm thử đơn vị.', tag: 'AI Assisted Coding' },
  { num: 'MÔN 06', title: 'React for Modern Web Development', desc: 'Thiết kế và phát triển các trang web động với thư viện ReactJS hiện đại nhất.', tag: 'ReactJS Modern' },
  { num: 'MÔN 07', title: 'Managing Data with SQL Server', desc: 'Chuẩn hóa dữ liệu thô thành các bảng cơ sở dữ liệu được tổ chức tốt trong SQL Server.', tag: 'Database Architecture' },
  { num: 'MÔN 08', title: 'Manual and Automation Software Testing with ChatGPT', desc: 'Khám phá cách Kỹ sư QA sử dụng GenAI/ChatGPT để kiểm thử phần mềm.', tag: 'AI QA & Testing' },
  { num: 'MÔN 09', title: 'Modern PHP Applications with Laravel', desc: 'Học cách làm việc với Laravel Framework để xây dựng các ứng dụng Web động.', tag: 'Backend Integration' },
  { num: 'MÔN 10', title: 'eProject – Laravel & PHP Application Development', desc: 'Phát triển một ứng dụng web phản hồi thực tế hoàn chỉnh dựa trên case study.', tag: 'Capstone Project' }
];

const targetCareers = [
  { title: 'Phát triển dự án Web & Frontend App', desc: 'Xây dựng các chức năng front-end của Website, Web application chuyên nghiệp.' },
  { title: 'Triển khai giao diện HTML/CSS/JS', desc: 'Triển khai giao diện tương thích đa thiết bị theo yêu cầu của khách hàng.' },
  { title: 'Phối hợp phát triển liên chức năng', desc: 'Phối hợp nhịp nhàng với Back-end developers và Web designers.' },
  { title: 'Đảm bảo tiêu chuẩn đồ họa & Brand', desc: 'Đảm bảo tiêu chuẩn đồ họa chất lượng cao và tính nhất quán thương hiệu.' },
  { title: 'Tối ưu trải nghiệm người dùng', desc: 'Thu thập ý kiến phản hồi và xây dựng hướng giải quyết tối ưu UX/UI.' },
  { title: 'Nghiên cứu & Ứng dụng công nghệ mới', desc: 'Nghiên cứu và áp dụng HTML/CSS, Javascript và AI mới nhất liên tục.' }
];

const whyChooseUs = [
  { icon: <Clock size={28} />, title: 'Rút ngắn thời gian – Đi làm sớm', desc: 'Chỉ 6 tháng tập trung cao độ, 70% thực hành làm đồ án.' },
  { icon: <BrainCircuit size={28} />, title: 'Đón đầu công nghệ AI', desc: 'Tích hợp AI ngay từ môn học đầu tiên để tăng hiệu suất lập trình.' },
  { icon: <Layout size={28} />, title: 'Chương trình chuẩn quốc tế', desc: 'Giáo trình chuyển giao từ Tập đoàn Aptech Ấn Độ cập nhật liên tục.' },
  { icon: <Globe size={28} />, title: 'Bằng cấp quốc tế uy tín', desc: 'Nhận chứng chỉ CPISM có giá trị toàn cầu sau khi tốt nghiệp.' },
  { icon: <FolderGit2 size={28} />, title: 'Xây dựng Portfolio ấn tượng', desc: 'Sở hữu đồ án eProject thực tế chứng minh năng lực trước nhà tuyển dụng.' },
  { icon: <ShieldCheck size={28} />, title: 'Cam kết hỗ trợ việc làm', desc: 'Kết nối mạng lưới hơn 500+ doanh nghiệp CNTT đối tác của FPT.' }
];

export default function Frontend6ThangPage() {
  return (
    <CourseLayout
      brandKey="aptech"
      activePath="/dao-tao/aptech/6-thang"
      bgWatermark="FRONTEND"
      brandBadge="FPT APTECH — LẬP TRÌNH FRONT END (6 THÁNG)"
      title="Chương trình Lập trình Front end 6 tháng"
      description="Chương trình đào tạo chuyên sâu Frontend tinh gọn trong 6 tháng, 70% thời lượng thực hành làm chủ HTML5, CSS3, JavaScript ES6+, Figma UI/UX, ReactJS và tích hợp các công nghệ sinh mã AI."
      heroStats={[
        { value: '6 Tháng', label: 'Thời gian học tập cô đọng, thực hành 70%.' },
        { value: 'Thực Chiến', label: 'Làm chủ Figma, ReactJS & Trợ lý AI thực tế.' },
        { value: 'Bằng CPISM', label: 'Chứng chỉ quốc tế do Aptech Ấn Độ cấp có giá trị toàn cầu.' }
      ]}
      bannerImage="/banner_aptech_sub_v2.png"
      overviewEyebrow="HÀNH TRÌNH TỔNG QUAN"
      overviewTitle="Lộ trình đào tạo Front end 6 tháng"
      overviewDesc="Chương trình tinh gọn tập trung vào kỹ năng thực chiến thị trường cần nhất"
      overviewCards={[
        { value: '10', label: 'Môn học chuẩn quốc tế' },
        { value: '01', label: 'Giai đoạn chuyên sâu' },
        { value: '01', label: 'Đồ án thực tế (eProject)' },
        { value: '01', label: 'Portfolio chuyên nghiệp' }
      ]}
      curriculumSlot={
        <section className="beau-section" style={{ padding: '100px 0 110px 0' }}>
          <div className="container" data-reveal>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="beau-section-eyebrow" style={{ color: '#f37021' }}>NỘI DUNG ĐÀO TẠO</span>
              <h2 className="beau-section-title">Danh sách 10 môn học chuyên sâu</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '750px', margin: '14px auto 0', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Lộ trình 10 môn học được thiết kế bài bản từ nền tảng thiết kế Figma, lập trình giao diện ReactJS đến ứng dụng trợ lý AI.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {subjects.map((sub, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(243,112,33,0.2)', borderRadius: '20px', padding: '28px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f37021', background: 'rgba(243,112,33,0.15)', padding: '4px 10px', borderRadius: '8px' }}>{sub.num} • {sub.tag}</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '14px 0 8px' }}>{sub.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.94rem', lineHeight: '1.6', margin: 0 }}>{sub.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      }
      customContent={
        <>
          {/* Certificate */}
          <section className="beau-section" style={{ backgroundColor: '#F8FAFC', color: '#0f172a', padding: '90px 0 100px 0' }}>
            <div className="container" data-reveal>
              <div style={{ background: '#ffffff', border: '1px solid rgba(243, 112, 33, 0.25)', borderLeft: '6px solid #f37021', borderRadius: '24px', padding: '48px 50px', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 500px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#f37021', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>BẰNG CẤP &amp; CHỨNG CHỈ QUỐC TẾ</span>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: 'var(--secondary)', margin: '10px 0 16px', lineHeight: 1.25, fontFamily: 'var(--font-sans)' }}>Chứng chỉ khi hoàn thành khóa học Lập trình Frontend</h2>
                  <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.75', margin: 0 }}>Sau khi hoàn thành khóa học Lập trình Frontend tại FPT Aptech, bạn sẽ có trong tay chứng chỉ <strong>CPISM: Certificate of Proficiency in Information Systems Management</strong> do <strong>Tập đoàn Aptech Ấn Độ</strong> cấp có giá trị toàn cầu.</p>
                </div>
                <div style={{ background: 'rgba(243, 112, 33, 0.08)', border: '2px solid #f37021', borderRadius: '20px', padding: '24px 36px', textAlign: 'center', boxShadow: '0 10px 30px rgba(243, 112, 33, 0.15)' }}>
                  <Award size={48} style={{ color: '#f37021', marginBottom: '8px' }} />
                  <h4 style={{ color: 'var(--secondary)', fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>CPISM</h4>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '4px 0 0', textTransform: 'uppercase', fontWeight: 700 }}>Giá trị toàn cầu</p>
                </div>
              </div>
            </div>
          </section>

          {/* Target Careers */}
          <section className="beau-section" style={{ padding: '100px 0 110px 0' }}>
            <div className="container" data-reveal>
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <span className="beau-section-eyebrow" style={{ color: '#f37021' }}>CƠ HỘI NGHỀ NGHIỆP</span>
                <h2 className="beau-section-title">Các công việc có thể đảm nhận sau khóa học</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {targetCareers.map((car, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(243, 112, 33, 0.2)', borderRadius: '20px', padding: '30px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>{car.title}</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.94rem', lineHeight: '1.6', margin: 0 }}>{car.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      }
      highlightsEyebrow="ĐẶC QUYỀN ĐÀO TẠO"
      highlightsTitle="Tại sao học Frontend nên chọn FPT Aptech?"
      highlightsDesc="FPT Aptech mang đến chương trình đào tạo thực chiến 6 tháng tinh gọn nhất thị trường."
      highlights={whyChooseUs}
      ctaTitle="Sẵn sàng trở thành Lập trình viên Frontend trong 6 tháng?"
      ctaDesc="Đăng ký nhận tư vấn lộ trình học cấp tốc và ưu đãi nhập học mới nhất từ FPT Aptech"
      ctaButtonText="Nhận lộ trình 1-1"
      ctaButtonHref="https://zalo.me/fptaptech"
      formProps={{
        programName: 'FPT Aptech - Frontend 6 Tháng',
        campuses: ['Hà Nội']
      }}
    />
  );
}
