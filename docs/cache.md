# Next.js Cache & Revalidation Guide

Hệ thống sử dụng cơ chế **On-Demand Revalidation bằng Tags** để đồng bộ dữ liệu giữa Admin (Vite) và Client (Next.js) khi có thay đổi.

## 1. Gắn Tag ở Client (Next.js)
Tất cả các API lấy danh sách/chi tiết (`GET`) trong thư mục `apps/user-next-app/src/api/client/api/` phải được gắn thuộc tính tag để định danh cache.

```typescript
// Ví dụ: Gắn tag 'products' trong api lấy danh sách sản phẩm
return listResource(params, { ...options, next: { tags: ['products'] } } as any);
```
*Các tag hệ thống đang dùng: `products`, `categories`, `projects`, `banners`, `timelines`, `slogans`, `system-settings`.*

## 2. Kích hoạt Xóa Cache ở Admin (Vite)
Khi có hành động làm thay đổi dữ liệu (**Thêm / Sửa / Xóa**) ở Admin, bắt buộc gọi hàm `triggerRevalidate(tag)` trong phần `onSuccess` để báo cho Next.js biết và xóa cache.

```typescript
import { triggerRevalidate } from '@/utils/revalidate';

// CHÚ Ý: Chỉ gọi khi dữ liệu thay đổi thực sự (Mutations). 
// KHÔNG gọi lúc Search, chuyển trang hay Filter.
onSuccess: () => {
    queryClient.invalidateQueries(...);
    triggerRevalidate('products');
}
```

## 3. Lưu ý: Static vs Dynamic Routes
- **Dynamic Routes (Trang Động - VD: Trang List sản phẩm có dùng searchParams):** Render lại mỗi khi người dùng truy cập. Tuy nhiên các hàm fetch API bên trong vẫn có thể bị cache, nên bắt buộc phải có `tags` để có thể ép load data mới.
- **Static Routes (Trang Tĩnh - VD: Trang Chi tiết sản phẩm):** Được Next.js cache thành file HTML cứng. Việc gọi `triggerRevalidate('products')` từ Admin sẽ chủ động đập bỏ file HTML cũ, ép hệ thống tự động build lại file HTML mới vào lần truy cập tiếp theo.
