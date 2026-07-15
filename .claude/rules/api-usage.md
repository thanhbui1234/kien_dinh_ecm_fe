# 🛠 HƯỚNG DẪN SỬ DỤNG SHARED API (`shared-api`)

Gói `shared-api` là bộ khung giao tiếp dữ liệu trung tâm của toàn bộ hệ thống. Nó được chia thành 2 phần rõ rệt: **Client (Next.js)** và **Admin (Vite + React Query)**.

---

## 1. DÀNH CHO CLIENT (NEXT.JS APP ROUTER)

Client sử dụng native `fetch` của Next.js (thông qua SDK Master Factory) để tận dụng tối đa sức mạnh Caching/SEO.

**File Cấu hình Trung tâm:** `apps/user-next-app/src/lib/api.ts`

### 🔹 Gọi API (Default vs Có Config)
```tsx
import { api } from '@/lib/api';

export default async function ProductsPage({ searchParams }) {
  
  // 🟢 CÁCH 1: DỄ NHẤT (Default Config)
  // Không truyền tham số. Tự động gọi { page: 1, limit: 12 }
  const defaultData = await api.products.getProducts();

  // 🟡 CÁCH 2: KHI CÓ PHÂN TRANG (Truyền đè Config)
  // Lấy page từ biến searchParams của Next.js (URL: /products?page=2)
  const paginatedData = await api.products.getProducts(
    { page: searchParams.page },
    { next: { revalidate: 3600 } } // Thêm config riêng của Next.js Cache
  );
```

  return (
    <div>
      {items.map(product => <div key={product.id}>{product.name}</div>)}
    </div>
  );
}
```

### 🔹 Gọi API trong Client Component (`"use client"`)
```tsx
'use client';
import { api } from '@/lib/api';

export default function ContactForm() {
  const submit = async () => {
    // Tự ép kiểu an toàn theo chuẩn CreateLeadInput
    await api.leads.submitLead({
      fullName: "Nguyễn Văn A",
      phoneNumber: "0900000000",
      message: "Tư vấn CNC"
    });
  };
  return <button onClick={submit}>Gửi</button>;
}
```

---

## 2. DÀNH CHO ADMIN (VITE + REACT QUERY)

Admin là một SPA (Single Page Application) sử dụng **React Query v5** kết hợp Axios để xử lý Data Fetching (có loading, error state và auto-refetch).

**File Cấu hình Trung tâm:** Provider được bọc ở `apps/admin-vite-app/src/app/App.tsx` (qua `ApiProvider`).

### 🔹 Gọi danh sách (Default vs Có Config)
```tsx
import { useProducts } from 'shared-api/src/admin/hooks';

export default function ProductsPage() {
  // 🟢 CÁCH 1: DỄ NHẤT (Default Config)
  // Không truyền gì cả. Tự động lấy { page: 1, limit: 12 } 
  // Dùng cho các bảng đơn giản hoặc trang chủ
  const { data: defaultData } = useProducts();

  // 🟡 CÁCH 2: KHI CÓ PHÂN TRANG (Truyền đè Config)
  // Kết hợp với react-router-dom để bóc page từ URL
  const [searchParams] = useSearchParams();
  const { data: paginatedData } = useProducts({ 
      page: searchParams.get('page') || '1',
      limit: '20' // Ghi đè limit mặc định
  });
```
  const deleteMutation = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id); // Gọi xong bảng danh sách TỰ ĐỘNG reload
  };

  if (isLoading) return <div>Đang tải...</div>;

  return <div>{data?.items.map(p => p.name)}</div>;
}
```

---

## 3. CÁCH MỞ RỘNG (THÊM API MỚI)

Khi Backend cung cấp thêm một Module mới (VD: `news`):
1. Chạy `pnpm run gen-api` ở thư mục `packages/shared-api` để tải DTO mới.
2. Cập nhật `src/shared/schemas/news.schema.ts`.
3. Khai báo Query Key ở `src/shared/keys/news.keys.ts`.
4. Khai báo **Client Fetch**: Dùng `createListResource` và `createDetailResource` trong `src/client/api/news.client.ts`. Đừng quên update `createApiClient` Master Factory.
5. Khai báo **Admin React Query**: Viết các Hook (Sử dụng `keepPreviousData` cho List API) trong `src/admin/hooks/news/index.ts`.
