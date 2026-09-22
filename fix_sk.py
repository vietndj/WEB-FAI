import os

file_path = "fai/src/data/courses.js"
with open(file_path, "r") as f:
    content = f.read()

old_sk = """      { icon: 'briefcase', title: 'Cam kết hỗ trợ việc làm FPT+', desc: 'Kết nối mạng lưới hàng trăm doanh nghiệp và agency marketing hàng đầu.' },"""
new_sk = """      { icon: 'briefcase', title: 'Kết nối hỗ trợ việc làm FPT+', desc: 'Mạng lưới hàng trăm doanh nghiệp và agency marketing hàng đầu.' },
      { icon: 'star', title: 'Tiên phong đào tạo Digital Marketing (vị trí số 1)', desc: 'Đơn vị đầu tiên tại Việt Nam đào tạo Fullstack Digital Marketing chuẩn Quốc Tế.' },
      { icon: 'users', title: 'Giảng viên chuyên gia thực chiến', desc: '100% giảng viên là CMO, Manager, Leader Marketing doanh nghiệp top đầu trực tiếp dẫn dắt.' },"""

content = content.replace(old_sk, new_sk)

with open(file_path, "w") as f:
    f.write(content)
