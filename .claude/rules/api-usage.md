# 🛠 HƯỚNG DẪN SỬ DỤNG GIAO TIẾP DỮ LIỆU (API USAGE)

Hệ thống đã được thiết kế lại (Decoupled Architecture) nhằm tối ưu và chia tách rõ ràng:
- **`shared-api`**: CHỈ chứa các hằng số (Constants), cấu hình DTO, Zod Schemas và Query Keys. Không chứa logic gọi API.
- **`apps/user-next-app`**: Tự quản lý Fetch Client và các API Wrapper tại `src/api`.
- **`apps/admin-vite-app`**: Tự quản lý Axios Interceptor tại `src/lib/axios.ts` và React Query Hooks tại `src/queries`.

---

## 1. DÀNH CHO CLIENT (NEXT.JS APP ROUTER)

Client sử dụng native `fetch` của Next.js (thông qua SDK Master Factory tại `user-next-app/src/api`) để tận dụng tối đa sức mạnh Caching/SEO.

**File Cấu hình Trung tâm:** `apps/user-next-app/src/lib/api.ts`

### 🔹 Gọi API (Default vs Có Config)
```tsx
import { api } from '@/lib/api';

export default async function ProductsPage({ searchParams }) {
  
  // 🟢 CÁCH 1: DỄ NHẤT (Default Config)
  const defaultData = await api.products.getProducts();

  // 🟡 CÁCH 2: KHI CÓ PHÂN TRANG (Truyền đè Config)
  const paginatedData = await api.products.getProducts(
    { page: searchParams.page },
    { next: { revalidate: 3600 } } // Thêm config riêng của Next.js Cache
  );

  return (
    <div>
      {paginatedData.items.map(product => <div key={product.id}>{product.name}</div>)}
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
    await api.leads.submitLead({
      fullName: "Nguyễn Văn A",
      phoneNumber: "0900000000",
      message: "Tư vấn"
    });
  };
  return <button onClick={submit}>Gửi</button>;
}
```

---

## 2. DÀNH CHO ADMIN (VITE + REACT QUERY)

Admin là một SPA (Single Page Application) sử dụng **React Query v5** kết hợp với Axios Instance (tại `src/lib/axios.ts`) để xử lý Data Fetching.

**Thư mục chứa Hooks:** `apps/admin-vite-app/src/queries/`

### 🔹 Gọi danh sách (Default vs Có Config)
```tsx
import { useProducts } from '@/queries/products/useProducts';

export default function ProductsPage() {
  // 🟢 CÁCH 1: DỄ NHẤT (Default Config)
  const { data: defaultData } = useProducts();

  // 🟡 CÁCH 2: KHI CÓ PHÂN TRANG (Truyền đè Config)
  const [searchParams] = useSearchParams();
  const { data: paginatedData } = useProducts({ 
      page: searchParams.get('page') || '1',
      limit: '20' 
  });

  const deleteMutation = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id); // Dùng queryClient.invalidateQueries trong hook để reload
  };

  if (isLoading) return <div>Đang tải...</div>;

  return <div>{paginatedData?.items.map(p => p.name)}</div>;
}
```

---

## 4. QUY TẮC BẮT BUỘC: KHÔNG GỌI axiosInstance TRỰC TIẾP TRONG COMPONENTS

**Tuyệt đối không được** gọi `axiosInstance.post/put/patch/delete` trực tiếp bên trong component hoặc page file. Mọi mutation **bắt buộc** phải đi qua React Query hook.

### ✅ Đúng — qua React Query mutation hook
```tsx
// Khai báo hook tại src/queries/<domain>/useSave<Entity>Translation.ts
export const useSave<Entity>Translation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ entityId, ...data }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.DOMAIN.TRANSLATION(entityId), data);
      return res.data;
    },
    onSuccess: (_, { entityId }) => {
      queryClient.invalidateQueries({ queryKey: domainKeys.detail(entityId) });
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
      triggerRevalidate('domain');
    },
  });
};

// Sử dụng trong component/page
const saveMutation = useSaveEntityTranslation();
saveMutation.mutate({ entityId: id, lang: 'EN', name: '...' }, {
  onSuccess: () => { /* cập nhật local state */ },
  onError: () => { /* hiển thị lỗi */ },
});
```

### ❌ Sai — gọi axiosInstance trực tiếp
```tsx
// KHÔNG làm thế này trong component/page
await axiosInstance.post(API_ENDPOINTS.JOBS.TRANSLATION(id), { ... });
```

### Translation hooks hiện có (đã triển khai)
| Hook | File |
|------|------|
| `useSaveCategoryTranslation()` | `src/queries/categories/useSaveCategoryTranslation.ts` |
| `useSaveJobTranslation()` | `src/queries/jobs/useSaveJobTranslation.ts` |
| `useSaveProjectTranslation()` | `src/queries/projects/useSaveProjectTranslation.ts` |
| `useSaveProductTranslation()` | `src/queries/products/useSaveProductTranslation.ts` |

Khi thêm domain mới có translation, tạo hook tương tự trong folder `src/queries/<domain>/` và export qua `index.ts` của folder đó.

## 5. CÁCH MỞ RỘNG (THÊM API MỚI)

Khi Backend cung cấp thêm một Module mới (VD: `news`):
1. Chạy `pnpm run gen-api` ở thư mục `packages/shared-api` để tải DTO mới.
2. Cập nhật `shared-api/src/shared/schemas/news.schema.ts`.
3. Khai báo Query Key ở `shared-api/src/shared/keys/news.keys.ts`.
4. Khai báo **Client Fetch**: Dùng `createListResource` và `createDetailResource` trong `user-next-app/src/api/client/news.client.ts`. Đừng quên update `createApiClient` Master Factory.
5. Khai báo **Admin React Query**: Viết các Hook (Sử dụng `keepPreviousData` cho List API) trong `admin-vite-app/src/queries/news/`.
