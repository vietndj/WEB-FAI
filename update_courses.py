import re

file_path = "fai/src/data/courses.js"
with open(file_path, "r") as f:
    content = f.read()

def replace(old, new):
    global content
    if old not in content:
        print(f"NOT FOUND: {old}")
    content = content.replace(old, new)

# Aptech 1 năm
replace("Sẵn sàng trở thành Lập trình viên Backend Chuyên nghiệp?", "Sẵn sàng trở thành\\nLập trình viên Backend\\nChuyên nghiệp?")
replace("Tư vấn ngay", "Tư vấn ngay qua Zalo") # We will handle links separately if needed, wait. 
# actually let's check CTA text first
