# Handoff Report — Milestone 1 Adversarial Negative Testing & Base64 Purge Verification

**Agent**: `challenger_m1_2`  
**Role**: EMPIRICAL CHALLENGER (critic, specialist)  
**Date**: 2026-09-03  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m1_2`  
**Verdict**: **REQUEST_CHANGES**  

---

## 1. Observation

1. **Adversarial Negative Testing on `/api/upload` (Task 1)**:
   - **Case 1.1: Plain text file upload (`text/plain`)**:
     Command:
     ```bash
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@package.json;filename=test.txt;type=text/plain" http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Input buffer contains unsupported image format"}
     HTTP_STATUS:500
     ```
   - **Case 1.2: PDF file upload (`application/pdf`)**:
     Command:
     ```bash
     echo "%PDF-1.4 test document" > /tmp/test.pdf
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@/tmp/test.pdf;type=application/pdf" http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Input buffer contains unsupported image format"}
     HTTP_STATUS:500
     ```
   - **Case 1.3: Binary garbage upload (`application/octet-stream`)**:
     Command:
     ```bash
     head -c 256 /dev/urandom > /tmp/garbage.bin
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@/tmp/garbage.bin;type=application/octet-stream" http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Input buffer contains unsupported image format"}
     HTTP_STATUS:500
     ```
   - **Case 1.4: Empty POST request without body/headers**:
     Command:
     ```bash
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Content-Type was not one of \"multipart/form-data\" or \"application/x-www-form-urlencoded\"."}
     HTTP_STATUS:500
     ```
   - **Case 1.5: Malformed multipart boundary / invalid body**:
     Command:
     ```bash
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -H "Content-Type: multipart/form-data; boundary=missing_boundary" --data-binary "malformed payload" http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Failed to parse body as FormData."}
     HTTP_STATUS:500
     ```
   - **Case 1.6: Missing 'file' field**:
     Command:
     ```bash
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "not_a_file=hello" http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Không tìm thấy tệp tải lên (trường \"file\" là bắt buộc)."}
     HTTP_STATUS:400
     ```
   - **Case 1.7: 0-byte empty file**:
     Command:
     ```bash
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@/dev/null;filename=empty.jpg" http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Tệp tải lên rỗng."}
     HTTP_STATUS:400
     ```
   - **Case 1.8: Missing query parameters on DELETE**:
     Command:
     ```bash
     curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X DELETE http://localhost:3000/api/upload
     ```
     Verbatim Response:
     ```json
     {"success":false,"error":"Thiếu tham số key hoặc url cần xóa."}
     HTTP_STATUS:400
     ```

2. **Code Inspection of `fai/src/app/api/upload/route.js`**:
   - Lines 9–11:
     ```javascript
     export async function POST(request) {
       try {
         const formData = await request.formData();
         const file = formData.get('file');
     ```
     `await request.formData()` throws a TypeError when Content-Type is missing or body is not valid multipart. Because it is not caught separately, it falls through to line 58.
   - Lines 36–42:
     ```javascript
     const processed = await processImage(inputBuffer, {
       watermark: shouldWatermark,
       quality: 82,
       maxWidth: 1600,
       maxHeight: 1600,
     });
     ```
     When non-image buffers (e.g. text, pdf, binary garbage) are passed, Sharp throws `Error: Input buffer contains unsupported image format`. There is no format check or error-specific catch for Sharp format errors before line 58.
   - Lines 58–67:
     ```javascript
       } catch (error) {
         console.error('Lỗi tải ảnh qua /api/upload:', error);
         return NextResponse.json(
           {
             success: false,
             error: error.message || 'Xử lý và tải ảnh lên máy chủ thất bại.',
           },
           { status: 500 }
         );
       }
     ```
     All errors caught by the top-level catch block unconditionally return `status: 500`.

3. **Base64 Purge Verification across `fai/src/` (Task 2)**:
   - Tool call: `grep_search` for `readAsDataURL` in `src/`:
     Result: `No results found` (0 occurrences).
   - Tool call: `grep_search` for `data:image` in `src/`:
     Result: `No results found` (0 occurrences).
   - Tool call: `grep_search` for `base64` in `src/`:
     Result: 1 occurrence, strictly in documentation comment at `src/lib/firestore.js:281`:
     `* Eliminates Base64 generation completely and returns public CDN URL.`
   - Tool call: `grep_search` for `FileReader` in `src/`:
     Result: `No results found` (0 occurrences).
   - Verified `uploadImage` implementation in `fai/src/lib/firestore.js` (lines 280–309): uploads via `fetch('/api/upload', { method: 'POST', body: formData })` and returns public R2 CDN URL.
   - Verified consumers: `src/app/admin/posts/new/page.js` (line 79) and `src/app/admin/posts/[id]/page.js` (line 102) both call `uploadImage` from `@/lib/firestore` and store the CDN URL in the `image` state.

4. **Regression Check on Web Pages & Build (Task 3)**:
   - `http://localhost:3000/doi-song`: HTTP 200 OK (52,331 bytes, zero console/rendering errors).
   - `http://localhost:3000/admin/posts`: HTTP 200 OK (29,417 bytes, zero console/rendering errors).
   - `http://localhost:3000/admin/posts/new`: HTTP 200 OK (30,026 bytes, zero console/rendering errors).
   - Build verification: `npx next build` compiled successfully in 3.3s with Turbopack, generating all 34 static and dynamic routes with 0 errors.

---

## 2. Logic Chain

1. **Requirement Definition**:
   - The user request explicitly specifies:
     > "Adversarial negative testing on /api/upload:
     > - Test sending non-image file (e.g. plain text, pdf, binary garbage).
     > - Test sending empty request or invalid multipart boundary.
     > - Confirm server returns proper HTTP 400 Bad Request without unhandled crash or 500."
2. **Evaluation against Observation 1**:
   - When a client sends a non-image file (plain text, PDF, binary garbage), the server throws Sharp's `unsupported image format` error and returns **HTTP 500** (`{"success":false,"error":"Input buffer contains unsupported image format"}`).
   - When a client sends an empty request or malformed multipart boundary, `request.formData()` throws a parsing error and the server returns **HTTP 500** (`Failed to parse body as FormData` or `Content-Type was not one of...`).
   - In HTTP specifications (RFC 9110), invalid client inputs (unsupported file formats, malformed multipart streams, missing headers) are client errors and MUST be responded to with status **400 Bad Request** (or 415 Unsupported Media Type), never **500 Internal Server Error**.
3. **Assessment of Other Areas**:
   - Observation 3 confirms Base64 purge is 100% complete across all `src/` files.
   - Observation 4 confirms no regressions on `/doi-song`, `/admin/posts`, and the production build compiles cleanly.
4. **Remediation Requirement**:
   - To satisfy Task 1, `fai/src/app/api/upload/route.js` must:
     1. Wrap `await request.formData()` in a try/catch block to return HTTP 400 if the body is not parseable FormData or is missing Content-Type.
     2. Check `file.type` or catch Sharp errors for unsupported formats (e.g. `err.message.includes('unsupported image format')`) to return HTTP 400 Bad Request instead of bubbling up to HTTP 500.

---

## 3. Caveats

- **No Caveats**: The issues were directly reproduced on `http://localhost:3000/api/upload` with concrete curl commands.
- Per review-only constraints, `challenger_m1_2` did not edit implementation code; this report serves as the actionable change request for `worker_m1`.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

- **Base64 Purge**: **PASSED** (0 instances of `readAsDataURL`, `data:image`, or Base64 storage in `src/`).
- **Web Pages & Build Integrity**: **PASSED** (`/doi-song` 200 OK, `/admin/posts` 200 OK, `next build` 100% success).
- **Negative Testing & Crash Resistance**: **FAILED**
  - Sending non-image files (txt, pdf, binary garbage) returns HTTP 500 instead of HTTP 400.
  - Sending empty or malformed multipart requests returns HTTP 500 instead of HTTP 400.

### Recommended Fix for `worker_m1`:
In `fai/src/app/api/upload/route.js`:
1. Handle FormData parsing error gracefully:
   ```javascript
   let formData;
   try {
     formData = await request.formData();
   } catch {
     return NextResponse.json(
       { success: false, error: 'Dữ liệu yêu cầu không hợp lệ hoặc thiếu multipart/form-data.' },
       { status: 400 }
     );
   }
   ```
2. Validate MIME type or catch unsupported format errors:
   ```javascript
   let processed;
   try {
     processed = await processImage(inputBuffer, { ... });
   } catch (err) {
     if (err.message && (err.message.includes('unsupported image format') || err.message.includes('Input buffer'))) {
       return NextResponse.json(
         { success: false, error: 'Định dạng tệp không được hỗ trợ. Vui lòng tải lên tệp ảnh hợp lệ (JPEG, PNG, WebP, GIF).' },
         { status: 400 }
       );
     }
     throw err;
   }
   ```

---

## 5. Verification Method

To verify the fix once applied by `worker_m1`:

1. **Test Non-Image Uploads (must return HTTP 400)**:
   ```bash
   # Text file
   curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@fai/package.json;filename=test.txt;type=text/plain" http://localhost:3000/api/upload
   # Expected: HTTP_STATUS:400

   # Binary garbage
   head -c 256 /dev/urandom > /tmp/garbage.bin
   curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@/tmp/garbage.bin;type=application/octet-stream" http://localhost:3000/api/upload
   # Expected: HTTP_STATUS:400
   ```

2. **Test Empty & Malformed Requests (must return HTTP 400)**:
   ```bash
   # Empty body
   curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST http://localhost:3000/api/upload
   # Expected: HTTP_STATUS:400

   # Invalid multipart boundary
   curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -H "Content-Type: multipart/form-data; boundary=invalid" --data-binary "malformed" http://localhost:3000/api/upload
   # Expected: HTTP_STATUS:400
   ```

3. **Confirm Valid Image Upload Still Returns HTTP 200**:
   ```bash
   curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST -F "file=@fai/public/logo_fpt_fai.png" http://localhost:3000/api/upload
   # Expected: HTTP_STATUS:200 with JSON { "success": true, "url": "https://pub-...webp" }
   ```
