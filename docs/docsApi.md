# Hướng Dẫn Sử Dụng API & Generate DTO

Đây là tài liệu hướng dẫn cách xem API Document, tải cấu hình JSON thô và tự động sinh code TypeScript (DTOs) từ hệ thống Backend.

## 1. Tài liệu API Chính Thức (Swagger UI)
- **Đường dẫn Swagger:** [https://kien-dinh-ecm-be.onrender.com/api/docs](https://kien-dinh-ecm-be.onrender.com/api/docs)
- **Lưu ý:** Nếu bạn muốn xem trực quan danh sách các API, test gọi API trực tiếp, hay đọc giải thích chi tiết cho từng trường dữ liệu, hãy truy cập vào đường dẫn trên qua trình duyệt.

---

## 2. Các lệnh (Scripts) Hỗ Trợ 

*(Lưu ý: Chạy các lệnh này tại thư mục `packages/shared-api`. Code sinh ra đã được `.gitignore` nên mỗi người cần tự chạy ở local).*

```bash
cd packages/shared-api
pnpm gen-api
pnpm download-spec
```

### 📜 Script 1: Sinh tự động các DTO/Types cho Typescript
```bash
pnpm gen-api
```
**Công dụng:**
- Lệnh này sử dụng cấu trúc API từ Swagger để tự động tạo ra các `interface`/`type` của Typescript (được lưu vào `src/index.ts`).
- Giúp Frontend luôn đồng bộ kiểu dữ liệu (DTO) với Backend, bắt lỗi type-safe mà không cần phải viết tay lại các Models.

### 📥 Script 2: Tải file API JSON thô (Raw Spec)
```bash
pnpm download-spec
```
**Công dụng:**
- Lệnh này sẽ kéo file cấu hình OpenAPI chuẩn (`swagger-spec.json`) về máy.
- File `swagger-spec.json` chứa toàn bộ mô tả chi tiết của API dưới dạng cấu trúc dữ liệu JSON (định nghĩa endpoint, required fields, params, type...).
- **Khi nào cần dùng?** Khi bạn muốn đưa file này cho các công cụ Code Generator khác, hoặc cung cấp cho các AI Assistant/Plugin để chúng đọc, phân tích và hiểu hệ thống API của bạn một cách chính xác nhất mà không cần giải thích dài dòng.


packages/shared-api/
└── src/
    └── docs/
        ├── dto-api.ts
        └── swagger-spec.json
