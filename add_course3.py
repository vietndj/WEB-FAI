import re

file_path = "fai/src/data/courses.js"
with open(file_path, "r") as f:
    content = f.read()

khoa_3_str = """    {
      id: 'khoa-3',
      badge: 'KHOÁ 3 • WEB & AI MULTI-SKILL DEVELOPER',
      title: 'Web & AI Multi-skill Developer (200h)',
      durationHighlight: '200H',
      note: 'Lộ trình toàn diện kết hợp chuyên sâu cả Frontend và Backend, trang bị đầy đủ kỹ năng của một Full-Stack Web & AI Developer.',
      modules: [
        { stt: 1, subject: 'Phân tích Nghiệp vụ & Giao diện (BA & UI)', duration: '40 Giờ', role: 'BA / Frontend', content: 'Tổng hợp từ khóa 1: Thu thập yêu cầu, HTML5, CSS3, ReactJS và tích hợp AI.' },
        { stt: 2, subject: 'Lập trình Hướng đối tượng & CSDL', duration: '48 Giờ', role: 'Logic / DB', content: 'Java OOP, thiết kế và tối ưu hệ quản trị CSDL SQL Server & MongoDB.' },
        { stt: 3, subject: 'Xây dựng RESTful API & AI Backend', duration: '44 Giờ', role: 'Backend', content: 'Node.js, ExpressJS và ứng dụng OpenAI API / LangChain vào hệ thống.' },
        { stt: 4, subject: 'Kiểm thử Phần mềm (Manual & Automation)', duration: '28 Giờ', role: 'Tester', content: 'Kiểm thử tương thích, viết Testcase, Postman/Jest và xử lý ngoại lệ.' },
        { stt: 5, subject: 'Triển khai dự án (DevOps)', duration: '40 Giờ', role: 'DevOps', content: 'Thực hiện đồ án thực tế, đóng gói Docker, CI/CD và deploy lên Cloud.' }
      ]
    }
  ],"""

content = content.replace("    }\n  ],", "    },\n" + khoa_3_str)

# Also update courseOptions
# Row 61: ReactJS & AI Smart UI: Frontend, BA, Tester với AI (100h)
# AI Multi-skill Backend : Backend, Automation Test, DevOps với AI (100h)
# Web & AI Multi-skill Developer (200h)
old_options = """    courseOptions: [
      'ReactJS & AI Smart UI (100h)',
      'AI Multi-skill Backend (100h)'
    ]"""
new_options = """    courseOptions: [
      'ReactJS & AI Smart UI: Frontend, BA, Tester với AI (100h)',
      'AI Multi-skill Backend : Backend, Automation Test, DevOps với AI (100h)',
      'Web & AI Multi-skill Developer (200h)'
    ]"""
content = content.replace(old_options, new_options)
# Let's check if old_options exists as written, else just use regex.

with open(file_path, "w") as f:
    f.write(content)
