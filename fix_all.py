import os
import re

def replace_in_file(filepath, old, new):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Replaced in {filepath}")
    else:
        # try regex if old has special chars
        print(f"NOT FOUND in {filepath}: {old[:50]}...")

# 1. Trang chủ CTA
replace_in_file('fai/src/components/BoldCTABlock.jsx', 'Đăng ký nhập học 2026', 'Đăng ký tư vấn')
replace_in_file('fai/src/components/BoldCTABlock.jsx', '/tuyen-sinh', '/tuyen-sinh#dang-ky')
replace_in_file('fai/src/components/TrustBar.jsx', '/tuyen-sinh', '/tuyen-sinh#dang-ky')
replace_in_file('fai/src/components/Testimonials.jsx', '/tuyen-sinh', '/tuyen-sinh#dang-ky')

# Footer
replace_in_file('fai/src/components/Footer.jsx', 'href="/lien-he"', 'href="/lien-he"') # Need to check if it's already there

# 2. courses.js & scholarships.js replacements
c_file = 'fai/src/data/courses.js'
s_file = 'fai/src/data/scholarships.js'

reps_c = [
    ("Sẵn sàng trở thành Lập trình viên Backend Chuyên nghiệp?", "Sẵn sàng trở thành\\nLập trình viên Backend\\nChuyên nghiệp?"),
    ("BẠN CÓ MUỐN TRỞ THÀNH CHUYÊN GIA LẬP TRÌNH BACKEND?", "BẠN CÓ MUỐN TRỞ THÀNH\\nCHUYÊN VIÊN LẬP TRÌNH BACKEND?"),
    ("CHƯƠNG TRÌNH ĐÀO TẠO LẬP TRÌNH FRONTEND 6 THÁNG\\nTÍCH HỢP TRÍ TUỆ NHÂN TẠO (AI)", "CHƯƠNG TRÌNH ĐÀO TẠO LẬP TRÌNH FRONT-END 6 THÁNG\\nTÍCH HỢP TRÍ TUỆ NHÂN TẠO (AI)"),
    ("Sẵn sàng trở thành Chuyên viên Lập trình Front-end?", "Sẵn sàng trở thành\\nChuyên viên\\nLập trình Front-end?"),
    ("BẠN CÓ MUỐN TRỞ THÀNH CHUYÊN GIA LẬP TRÌNH BACKEND?", "BẠN CÓ MUỐN TRỞ THÀNH\\nCHUYÊN VIÊN LẬP TRÌNH FRONT-END?"), # Wait, the original for Front-end might be different. Let's check.
    ("KIẾN TẠO LỘ TRÌNH CỦA RIÊNG BẠN", "ĐIỂM KHÁC BIỆT CỐT LÕI"),
    ("Chứng chỉ chuyên môn Aptech", "Chứng chỉ chuyên môn Aptech Global"),
    ("Chứng chỉ chuyên ngành FPT Aptech", "Chứng chỉ Quốc tế Aptech Global"),
    ("Đón đầu xu hướng việc làm FPT\\nĐược hỗ trợ kết nối phỏng vấn tuyển dụng tại hệ sinh thái FPT và hơn 300+ đối tác công nghệ.", "2 Hình thức học linh hoạt\\nOnline hoặc Offline tại cơ sở Hà Nội"),
    ("NHẬN THÔNG TIN TƯ VẤN BỘ KHÓA HỌC LẬP TRÌNH NGẮN HẠN TẠI FPT APTECH (100 - 200 GIỜ)", "NHẬN THÔNG TIN TƯ VẤN BỘ KHÓA HỌC\\nLẬP TRÌNH NGẮN HẠN TẠI FPT APTECH (100 - 200 GIỜ)"),
    ("Học thuyết Kiến tạo (Constructivism)", "Học thuyết Kiến tạo\\n(Constructivism)"),
    ("NHẬN THÔNG TIN TƯ VẤN KHÓA HỌC CHUYÊN SÂU 6 - 18 THÁNG TẠI FPT ARENA", "NHẬN THÔNG TIN TƯ VẤN\\nKHÓA HỌC  6 - 18 THÁNG TẠI FPT ARENA"),
    ("Chương trình huấn luyện 1-kèm-1, 80% thời lượng là thực hành trên các dự án thực tế giúp học viên hoàn thiện ngay sản phẩm Portfolio thương mại.", "Chương trình huấn luyện với 80% thời lượng là thực hành trên các dự án thực tế giúp học viên hoàn thiện ngay sản phẩm Portfolio thương mại."),
    ("Tập trung 100% vào kỹ năng thực hành theo dự án thực tế.", "Tập trung thời lượng vào kỹ năng thực hành theo dự án thực tế."),
    ("Huấn luyện 1-kèm-1, hoàn thiện sản phẩm thương mại ngay trong khóa", "Hoàn thiện sản phẩm thương mại ngay trong khóa."),
    ("Thiết Kế Thương Hiệu - Thương Mại", "Thiết Kế\\nThương Hiệu - Thương Mại"),
    ("Thiết Kế Đồ Họa 3D & Game", "Thiết Kế\\nĐồ Họa 3D & Game"),
    ("Đăng ký nhận tư vấn khóa học ngắn hạn và ưu đãi học phí lên tới 30% tại FPT Arena", "Đăng ký nhận tư vấn khóa học ngắn hạn và ưu đãi học phí tại FPT Arena Multimedia"),
    ("NHẬN THÔNG TIN TƯ VẤN KHÓA HỌC NGẮN HẠN 100H & HỌC BỔNG TẠI FPT ARENA", "NHẬN THÔNG TIN TƯ VẤN\\nKHÓA HỌC NGẮN HẠN 100H & HỌC BỔNG\\nTẠI FPT ARENA MULTIMEDIA"),
    ("BẠN CÓ MUỐN BỨT PHÁ KỸ NĂNG MULTIMEDIA CẤP TỐC?", "BẠN CÓ MUỐN BỨT PHÁ\\nKỸ NĂNG MULTIMEDIA CẤP TỐC?"),
    ("Full stack digital marketing", "Full Stack Digital Marketing/ Multi-Channel Marketing Strategy"),
    ("Sẵn sàng làm chủ Digital Marketing với AI?", "Sẵn sàng làm chủ\\nDigital Marketing với AI?"),
    ("NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT SKILLKING", "NHẬN THÔNG TIN TƯ VẤN\\nVỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026\\nTẠI FPT SKILLKING"),
    ("Tư vấn ngay", "Tư vấn ngay qua Zalo")
]

for old, new in reps_c:
    replace_in_file(c_file, old, new)

reps_s = [
    ("NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026\\nTẠI FPT APTECH", "NHẬN THÔNG TIN TƯ VẤN\\nVỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026\\nTẠI FPT APTECH"),
    ("NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT SKILLKING", "NHẬN THÔNG TIN TƯ VẤN\\nVỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026\\nTẠI FPT SKILLKING")
]

for old, new in reps_s:
    replace_in_file(s_file, old, new)

# And FPT Aptech 6 month fix "Đăng ký nhận tư vấn lộ trình học 6 tháng và thông tin học bổng mới nhất từ FPT Aptech ( ko bị xuống dòng như hiện tại )"
# I will have to find where it is.
