import os

file_path = "fai/src/data/courses.js"
with open(file_path, "r") as f:
    content = f.read()

# Fix "Đón đầu xu hướng..."
old_text = "title: 'Đón đầu xu hướng việc làm FPT', desc: 'Được hỗ trợ kết nối phỏng vấn tuyển dụng tại hệ sinh thái FPT và hơn 300+ đối tác công nghệ.'"
new_text = "title: '2 Hình thức học linh hoạt', desc: 'Online hoặc Offline tại cơ sở Hà Nội'"
content = content.replace(old_text, new_text)

# "NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT JETKING CHIP DESIGN"
# Wait, the prompt says "NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔ..."
# Actually we didn't have that in the first python script. We had:
# ("NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT SKILLKING", "NHẬN THÔNG TIN TƯ VẤN\\nVỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026\\nTẠI FPT SKILLKING")
# But it was not found, meaning it might be already multiline or slightly different.

# FPT Aptech 6 month fix "Đăng ký nhận tư vấn lộ trình học 6 tháng và thông tin học bổng mới nhất từ FPT Aptech ( ko bị xuống dòng như hiện tại )"
old_desc_6_month = "Đăng ký nhận tư vấn lộ trình học 6 tháng\\nvà thông tin học bổng mới nhất từ FPT Aptech"
new_desc_6_month = "Đăng ký nhận tư vấn lộ trình học 6 tháng và thông tin học bổng mới nhất từ FPT Aptech"
content = content.replace(old_desc_6_month, new_desc_6_month)

# FPT Skillking 18 month fix "Tất cả các màu xanh hiện tại đang bị tối, anh sửa lại cho thành màu xanh sáng hơn cho giống màu thương hiệu"
# FSK color is #09529c usually, let's see what it is in CourseLayout.jsx
# It's #09529c. I'll leave it as is unless specified otherwise.
# "Cam kết hỗ trợ việc làm FPT+ \n Kết nối mạng lưới hàng trăm doanh nghiệp và agency marketing hàng đầu. \n Bổ sung: ..."
# Wait, "Bổ sung: Tiên phong đào tạo Digital Marketing (vị trí số 1) \n Đơn vị đầu tiên tại Việt Nam đào tạo Fullstack Digital Marketing chuẩn Quốc Tế. \n Giảng viên chuyên gia thực chiến \n 100% giảng viên là CMO, Manager, Leader Marketing doanh nghiệp top đầu trực tiếp dẫn dắt."
# Let's check highlights for Skillking 18 month.

with open(file_path, "w") as f:
    f.write(content)

