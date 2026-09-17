'use client';

import CourseLayout from '@/components/course/CourseLayout';
import { ShieldCheck, BrainCircuit, Zap, Globe, Wrench, FolderGit2 } from 'lucide-react';

const semesters = [
  {
    num: 'HỌC KỲ 01',
    shortTitle: 'Web Foundations & AI',
    fullTitle: 'Web Foundations & AI Development',
    subTitle: 'Nền tảng Thiết kế Website, Lập trình Frontend & Trợ lý AI',
    desc: 'Làm chủ các công cụ thiết kế giao diện Figma, lập trình ứng dụng Web tương tác với HTML5, CSS3, JavaScript ES6+, kết nối cơ sở dữ liệu và tích hợp các công nghệ sinh mã AI để tự động hóa quy trình viết mã.',
    coreStack: ['Figma UI/UX Design', 'HTML5 / CSS3 / JavaScript ES6+', 'Bootstrap & Responsive Web', 'SQL Server Database Architecture'],
    aiTools: ['ChatGPT & Claude for Code', 'GitHub Copilot AI Assistant', 'AI Prompt Engineering for Devs', 'v0.dev / Cursor AI Workflow'],
    careers: ['Junior Frontend Developer', 'Web UI/UX Specialist', 'Database Support Engineer', 'AI Integration Trainee']
  },
  {
    num: 'HỌC KỲ 02',
    shortTitle: 'Python & Data MLOps',
    fullTitle: 'Python, Data Analytics & Machine Learning Pipeline',
    subTitle: 'Lập trình Python, Phân tích Dữ liệu lớn & Ứng dụng AI',
    desc: 'Học sâu về ngôn ngữ lập trình Python, xử lý và làm sạch dữ liệu lớn, xây dựng các mô hình học máy (Machine Learning) ứng dụng và thiết kế hệ thống RESTful API kết nối mô hình trí tuệ nhân tạo.',
    coreStack: ['Python Core & Advanced OOP', 'NumPy, Pandas, Matplotlib Data Analytics', 'FastAPI & Flask RESTful Services', 'Machine Learning Models Integration'],
    aiTools: ['Jupyter AI Lab', 'LangChain & LlamaIndex', 'Hugging Face Open Models', 'Gemini & OpenAI API Integration'],
    careers: ['Python Developer', 'Data Analytics Specialist', 'AI Solution Support Associate', 'Machine Learning Trainee']
  },
  {
    num: 'HỌC KỲ 03',
    shortTitle: 'Java Microservices',
    fullTitle: 'Java Microservices Architecture & Mobile AI Flutter',
    subTitle: 'Kiến trúc Phần mềm Doanh nghiệp & Ứng dụng Di động Đa nền tảng',
    desc: 'Thiết kế và triển khai kiến trúc dịch vụ doanh nghiệp với Java Spring Boot Microservices kết hợp xây dựng ứng dụng di động đa nền tảng Flutter tích hợp tính năng thị giác máy tính và nhận dạng giọng nói AI.',
    coreStack: ['Java SE & Enterprise Spring Boot', 'Microservices Architecture', 'Flutter Mobile Cross-platform', 'PostgreSQL & Docker Containerization'],
    aiTools: ['Spring AI Framework', 'Mobile AI On-Device (TFLite)', 'AI Code Reviewer Bots', 'Automated Unit Test Generators'],
    careers: ['Java Backend Developer', 'Mobile Application Developer (Flutter)', 'Microservices Engineer', 'Cloud-Native Developer Trainee']
  },
  {
    num: 'HỌC KỲ 04',
    shortTitle: 'Enterprise & Capstone',
    fullTitle: 'Enterprise Integration & Capstone Project',
    subTitle: 'Hệ thống Doanh nghiệp & Đồ án Tốt nghiệp',
    desc: 'Thiết kế kiến trúc hệ thống lớn tích hợp AI End-to-End, giải quyết bài toán nghiệp vụ phức tạp và bảo vệ đồ án tốt nghiệp trước hội đồng chuyên gia FPT.',
    coreStack: ['Full Stack AI Architecture', '.NET Core / Next.js', 'CI/CD & DevOps Pipeline', 'Enterprise Security'],
    aiTools: ['Custom AI Agents', 'Copilot Workspace', 'Claude for Code', 'AI Architecture Reviewer'],
    careers: ['Full-Stack AI Software Engineer', 'AI Integration Specialist', 'Solutions Architect Trainee', 'Tech Lead Assistant']
  }
];

const whyChooseUs = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Cam kết việc làm hệ sinh thái FPT+',
    desc: 'Đảm bảo cơ hội việc làm rộng mở tại FPT Software, FPT AI, FPT Smart Cloud và hàng trăm doanh nghiệp công nghệ liên kết.'
  },
  {
    icon: <BrainCircuit size={28} />,
    title: 'Chương trình ACCP AI độc quyền',
    desc: 'Đón đầu kỷ nguyên AI với giáo trình mới nhất từ Tập đoàn Aptech Ấn Độ, tích hợp AI vào từng môn học từ nền tảng đến chuyên sâu.'
  },
  {
    icon: <Zap size={28} />,
    title: 'Làm chủ công cụ AI & Vibe Coding mới nhất',
    desc: 'Ứng dụng thành thạo AI vào quy trình phân tích, viết code, kiểm thử và tối ưu hóa dự án, tăng năng suất làm việc gấp 5 lần.'
  },
  {
    icon: <Globe size={28} />,
    title: 'Hệ sinh thái học tập 24/7',
    desc: 'Đặc quyền truy cập các nền tảng học tập dành riêng cho sinh viên FPT: Onlinevarsity, Aptech ProConnect, Coursera, Udemy và kết nối trực tiếp với cộng đồng Dev toàn cầu.'
  },
  {
    icon: <Wrench size={28} />,
    title: 'Đào tạo đa kỹ năng thực chiến',
    desc: 'Trang bị trọn bộ kỹ năng từ UI/UX, Frontend, Backend, Mobile đến Data & DevOps, tự tin thích ứng với mọi dự án công nghệ.'
  },
  {
    icon: <FolderGit2 size={28} />,
    title: 'Học qua dự án (Project Based)',
    desc: 'Thực hành liên tục qua các đồ án (eProject) mỗi học kỳ. Tích hợp ngay công nghệ mới nhất để xây dựng Portfolio cá nhân ấn tượng trước cả khi tốt nghiệp.'
  }
];

export default function Fullstack2NamPage() {
  return (
    <CourseLayout
      brandKey="aptech"
      activePath="/dao-tao/aptech/accp"
      brandBadge="FPT APTECH ACCP AI 2026"
      title={<>CHƯƠNG TRÌNH LẬP TRÌNH VIÊN QUỐC TẾ 2 NĂM<br />AI ĐA KỸ NĂNG</>}
      subtitle="Đón đầu xu hướng – Nắm bắt cơ hội thực chiến"
      description={[
        'Ngành CNTT Việt Nam đang trong giai đoạn bùng nổ. Theo dự báo của TopDev, từ 2023 – 2026, thị trường sẽ thiếu hụt từ 150.000 – 200.000 lập trình viên. Cơ hội nghề nghiệp vô cùng rộng mở, nhưng sẽ chỉ dành cho những ứng viên sở hữu kỹ năng thực chiến và khả năng ứng dụng công nghệ mới.',
        'Tại FPT Aptech, chúng tôi không ngừng đổi mới để sinh viên luôn đi trước một bước. Chương trình Lập trình Full-Stack tích hợp AI được thiết kế với triết lý: Học nhanh – Đi làm sớm, tối ưu hóa thời gian, tăng cường trải nghiệm thực tế và đáp ứng chính xác nhu cầu khắt khe của doanh nghiệp.'
      ]}
      heroCallout={{
        tag: 'ĐIỂM KHÁC BIỆT CỐT LÕI',
        text: 'Mỗi sinh viên được định hướng và thiết kế một lộ trình cá nhân hóa dựa trên kỹ năng, sở thích và mục tiêu nghề nghiệp. Giúp bạn tối ưu thời gian học tập, phát huy tối đa thế mạnh và sẵn sàng hòa nhập ngay vào môi trường doanh nghiệp.'
      }}
      bannerImage="/banner_aptech_sub_v2.png"
      overviewEyebrow="HÀNH TRÌNH TỔNG QUAN"
      overviewTitle="Lộ trình đào tạo tổng quan 2 năm"
      overviewDesc="Một hành trình toàn diện được đúc kết qua những con số biết nói"
      overviewCards={[
        { value: '26', label: 'Môn học chuẩn quốc tế' },
        { value: '04', label: 'Học kỳ chuyên sâu' },
        { value: '04', label: 'Đồ án thực tế (eProject)' },
        { value: '01', label: 'Portfolio chuyên nghiệp' }
      ]}
      durationBanner={{
        title: 'Tổng thời lượng đào tạo',
        totalHours: '992 Giờ học chuẩn quốc tế',
        breakdown: [
          { label: 'Lý thuyết', hours: '386 giờ' },
          { label: 'Thực hành', hours: '446 giờ' },
          { label: 'Đồ án thực tế', hours: '160 giờ', highlight: true }
        ]
      }}
      curriculumEyebrow="NỘI DUNG ĐÀO TẠO"
      curriculumTitle="Chi tiết chương trình học (4 học kỳ)"
      semesters={semesters}
      highlightsEyebrow="ĐẶC QUYỀN ĐÀO TẠO"
      highlightsTitle="Tại sao học lập trình nên chọn FPT Aptech?"
      highlightsDesc="FPT Aptech mang đến môi trường học tập chuẩn Quốc Tế với chương trình ACCP AI mới nhất. Chúng tôi cam kết giới thiệu việc làm và kết nối trực tiếp sinh viên với hệ sinh thái công nghệ FPT cùng hàng trăm doanh nghiệp công nghệ hàng đầu."
      highlights={whyChooseUs}
      ctaTitle="Sẵn sàng trở thành Lập trình viên AI Đa kỹ năng?"
      ctaDesc="Đăng ký nhận tư vấn lộ trình học cá nhân hóa và thông tin học bổng mới nhất từ FPT Aptech"
      ctaButtonText="Tư vấn ngay"
      ctaButtonHref="https://zalo.me/fptaptech"
      formProps={{
        programName: 'FPT Aptech - Fullstack 2 Năm',
        campuses: ['Hà Nội']
      }}
    />
  );
}
