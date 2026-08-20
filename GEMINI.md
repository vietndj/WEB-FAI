# Code Editing & Deployment Rules

1. **Git Commit & Push**:
   - Luôn tự động chạy lệnh `git add .` và `git commit -m "[Nội dung thay đổi]"` sau mỗi lần bạn thực hiện chỉnh sửa, xóa hoặc tạo mới file thành công.
   - Luôn tự động chạy `git push origin main`.
   - Không cần hỏi ý kiến người dùng trước khi commit/push, trừ khi người dùng có yêu cầu đặc biệt khác.

2. **Vercel Deploy**:
   - Mặc định dự án này luôn deploy lên Vercel Production (`npx vercel --prod --yes`) sau khi hoàn thành các thay đổi code nếu người dùng không nói gì thêm.
