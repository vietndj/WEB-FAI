import re

file_path = "fai/src/components/StudentLife.jsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace bentoItems array
new_bentoItems = """const bentoItems = [
  {
    id: 'design',
    label: 'Bài Phát Biểu Đầy Cảm Hứng',
    tag: 'FPT Arena',
    src: '/fai_graduation_speech.jpg',
    size: 'bento-large-v',
  },
  {
    id: 'lab',
    label: 'Giải Bóng Đá All Star Cup',
    tag: 'Thể Thao',
    src: '/FAI-All-Star-Cup-season-2-2.jpg',
    size: 'bento-small',
  },
  {
    id: 'graduation_handshake',
    label: 'Tân Khoa Rạng Rỡ Trong Ngày Lễ',
    tag: 'Tốt Nghiệp',
    src: '/fai_graduation_handshake.png',
    size: 'bento-small',
  },
  {
    id: 'graduation',
    label: 'Nghi thức Tuyên Hứa Tân khoa',
    tag: 'Nghi Lễ',
    src: '/fai_graduation_hall.jpg',
    size: 'bento-large-h',
  },
  {
    id: 'study',
    label: 'Hàng Trăm Tân Khoa Tung Mũ Vinh Danh',
    tag: 'Khoảnh Khắc',
    src: '/fai_graduation_crowd.png',
    size: 'bento-medium',
  },
];"""

content = re.sub(r'const bentoItems = \[.*?\];', new_bentoItems, content, flags=re.DOTALL)

with open(file_path, "w") as f:
    f.write(content)
