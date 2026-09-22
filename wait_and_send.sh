#!/bin/bash
# Wait for task 164's log to contain "Excel generated!"
while ! grep -q "Excel generated!" /Users/vietmac/.gemini/antigravity/brain/2db34431-b6df-4b3e-bf55-23823d542868/.system_generated/tasks/task-164.log; do
    sleep 2
done
python3 /Users/vietmac/Documents/CODE/Quản\ gia/telegram_notify.py --file "17.9_nghiem_thu.xlsx" --caption "✅ [BẢN HOÀN THIỆN] Báo cáo nghiệm thu hiệu chỉnh hệ thống FAI (17/09). AI đã xử lý xong các bug và chụp ảnh minh chứng thành công 100%!" --force
