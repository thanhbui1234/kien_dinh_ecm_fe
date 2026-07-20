# Frontend Performance Optimization Log

**Date:** 2026-07-20
**Scope:** `apps/user-next-app` (Next.js 15) + `apps/admin-vite-app` (Vite 6)

---

## 1. Skeleton Screens

### Vấn đề
Navigate giữa các pages bị blank/freeze hoàn toàn — không có feedback UI trong khi server component đang fetch data. User trải nghiệm như app bị treo.

### Giải pháp
Next.js App Router có cơ chế tự động dùng `loading.tsx` như một Suspense boundary. Khi file này tồn tại trong một route segment, Next.js stream HTML shell ngay lập tức và show skeleton trong khi data đang resolve. Không cần thêm package, không cần thêm logic.

### Tại sao skeleton thay vì spinner?
Spinner generic không cho user biết layout sẽ trông như thế nào. Skeleton match đúng layout thực tế → perceived performance tốt hơn, ít "nhảy layout" (CLS) hơn khi content hiện ra.

### Package liên quan
Không cần install thêm. Dùng `animate-pulse` có sẵn trong Tailwind CSS.

### Files tạo mới
```
apps/user-next-app/src/components/ui/Skeleton.tsx

  Primitive component reusable:
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
  Nhận prop className để override size/shape tùy từng context.

apps/user-next-app/src/app/loading.tsx
  Home: hero full-width + 2 product grids + 1 category row + 2 project grids

apps/user-next-app/src/app/about-us/loading.tsx
  Hero h-[55vh] + 2-col info block + timeline rows

apps/user-next-app/src/app/about-us/company-history/loading.tsx
  Breadcrumb + title + 8 timeline rows (year + title + desc)

apps/user-next-app/src/app/about-us/company-outline/loading.tsx
  Breadcrumb + title + 10 table rows + content block

apps/user-next-app/src/app/about-us/production-facilities/loading.tsx
  Breadcrumb + title + region heading + grid cards

apps/user-next-app/src/app/contact/loading.tsx
  5-col grid: left (title + 3 contact rows với icon circles) + right (form fields + button)

apps/user-next-app/src/app/products/loading.tsx
  Header bar + toolbar row + 12 cards grid-cols-2/3/4

apps/user-next-app/src/app/products/[slug]/loading.tsx
  Breadcrumb + 2-col: image left / info right + CTA button

apps/user-next-app/src/app/projects/loading.tsx
  Header bar + 12 cards grid-cols-1/2/3

apps/user-next-app/src/app/projects/[slug]/loading.tsx
  Hero banner h-[50vh] + content block + gallery grid
```

### Files xóa
```
apps/user-next-app/src/components/ui/PageLoader.tsx
  Spinner generic cũ — đã thay toàn bộ bằng skeleton, không còn dùng.
```

---

## 2. Suspense Streaming — HomePage

### Vấn đề
`page.tsx` ban đầu:
```ts
const banners = await api.settings.getBanners()           // sequential — block tất cả

const [products, projects, categories] = await Promise.all([...])  // chạy sau khi banners xong
```
Critical path = `getBanners latency` + `max(products, projects, categories latency)`.
Toàn bộ page bị block cho đến khi tất cả resolve xong mới trả HTML về browser.

### Giải pháp
Tách mỗi section thành một async server component tự fetch data riêng. Page trở thành non-async shell, render ngay lập tức. Mỗi section được wrap trong `<Suspense>` với skeleton fallback riêng.

```
Trước: getBanners → Promise.all(3) = 2 serial waterfalls
Sau:   4 fetch chạy hoàn toàn song song, section nào xong trước hiện trước
```

### Tại sao async server component thay vì fetch ở page rồi pass props?
Nếu fetch ở page thì page vẫn phải `await` tất cả trước khi render. Async server component đặt data fetch co-located với UI — Next.js deduplicates request tự động nếu cùng key, và mỗi component stream độc lập.

### Files thay đổi
```
apps/user-next-app/src/app/page.tsx
  Trước: async function HomePage() { const banners = await...; const [...] = await Promise.all }
  Sau:
    - function HomePage() — không còn async
    - Thêm 4 async server components trong cùng file:
        HeroSection()              — fetch getBanners()
        FeaturedProductsSection()  — fetch getProducts({ isFeatured, limit: 6 })
        FeaturedCategoriesSection() — fetch getCategories(), filter parentId null
        FeaturedProjectsWrapper()  — fetch getProjects({ isFeatured, limit: 6 })
    - Mỗi section có .catch(() => fallback) để không crash page nếu API lỗi
    - Wrap từng section: <Suspense fallback={<SectionSkeleton />}>
    - Bỏ <main> tag (chuyển lên layout.tsx)
```

---

## 3. Footer Jumping

### Vấn đề
Khi Suspense skeleton có chiều cao nhỏ hơn content thực tế, footer bị đẩy lên chiếm không gian. Khi content load xong và đẩy footer xuống → layout shift nhìn thấy được (giật).

### Giải pháp
Đảm bảo content area luôn chiếm tối thiểu full viewport height dù skeleton nhỏ hay content chưa load.

### Files thay đổi
```
apps/user-next-app/src/app/layout.tsx
  Thêm <main className="min-h-screen"> bao {children}
  → Footer luôn ở dưới cùng viewport, không nhảy lên khi skeleton nhỏ

apps/user-next-app/src/app/page.tsx
  Xóa <main> wrapper (tránh nested <main> trong <main> — invalid HTML)
  Thay bằng React fragment <>
```

---

## 4. next/font — Google Fonts

### Vấn đề
`globals.css` dòng 1:
```css
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:...");
```
Đây là external request render-blocking: browser phải:
1. Parse CSS và gặp `@import`
2. Dừng render để fetch `fonts.googleapis.com`
3. Fonts.googleapis.com trả về CSS, browser fetch tiếp font files từ `fonts.gstatic.com`
4. Mới bắt đầu render text

Tổng: 2 extra round-trips trước khi text hiện. Gây FOIT (Flash of Invisible Text) hoặc FOUT (Flash of Unstyled Text).

### Giải pháp
`next/font/google` (built-in Next.js, không cần install thêm):
- Tự download font lúc build time
- Self-host trên cùng domain với app → không external request
- Tự thêm `<link rel="preload">` vào `<head>` → browser preload trước khi render
- `font-display: swap` mặc định → không block render
- Tự tạo CSS variable để dùng trong Tailwind

### Package liên quan
Không cần install — `next/font` là built-in của Next.js 13+.

### Files tạo mới
```
apps/user-next-app/src/lib/fonts.ts
  import { Noto_Sans, Noto_Sans_JP } from "next/font/google"

  Noto_Sans:
    subsets: ["latin"]          — chỉ load latin subset, không load toàn bộ
    weight: [300,400,500,600,700]
    variable: "--font-noto-sans"  — CSS variable để dùng trong Tailwind
    display: "swap"

  Noto_Sans_JP:
    subsets: ["latin"]
    weight: [300,400,500,600,700]
    variable: "--font-noto-sans-jp"
    display: "swap"
```

### Files thay đổi
```
apps/user-next-app/src/app/globals.css
  Xóa dòng: @import url("https://fonts.googleapis.com/...")

apps/user-next-app/src/app/layout.tsx
  import { notoSans, notoSansJP } from "@/lib/fonts"
  <html className={`${notoSans.variable} ${notoSansJP.variable}`}>
  → Next.js inject <link rel="preload"> tự động vào <head>
```

---

## 5. Image Optimization

### Vấn đề A — about-us hero dùng `<img>` thô
```tsx
<img src={aboutThumbnail} className="absolute inset-0 w-full h-full object-cover" />
```
- Không có `preload` → browser không biết đây là LCP element
- Không tự optimize format (avif/webp)
- Không responsive srcset

### Fix A
```tsx
<Image src={aboutThumbnail} fill priority sizes="100vw" className="object-cover" />
```
- `priority` → Next.js thêm `<link rel="preload">` vào `<head>`, browser fetch sớm nhất có thể
- `fill` + parent `position: relative` → không cần hardcode width/height
- Next.js tự tạo srcset theo `deviceSizes` config

### Vấn đề B — next.config.ts remotePatterns quá rộng
```ts
remotePatterns: [
  { protocol: "https", hostname: "**" },  // cho phép proxy ảnh từ BẤT KỲ domain
  { protocol: "http",  hostname: "**" },
]
```
Rủi ro bảo mật: ai cũng có thể dùng Next.js image optimization endpoint của app để proxy ảnh từ domain lạ → tốn bandwidth + compute.

### Fix B — chỉ cho phép Cloudinary
```ts
remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }]
```

### Các thay đổi khác trong next.config.ts
```ts
imageSizes: [64, 128, 256, 384, 480]
  Trước: [16, 32, 48, 64, 96, 128, 256, 384]
  Lý do: 16/32/48 quá nhỏ, không có component nào trong app dùng image nhỏ vậy.
         Thêm 480 phù hợp với card layout ~480px trên mobile.
         Browser chọn size gần nhất từ trên xuống — ít size vô dụng = ít variants = ít storage.

minimumCacheTTL: 2592000  (30 ngày)
  Trước: không set = default 60 giây
  Lý do: Mỗi lần cache expire, Next.js phải re-process (resize, convert) ảnh.
         Ảnh Cloudinary không thay đổi URL khi update (thường dùng versioning).
         Cache 30 ngày → giảm re-processing đáng kể cho production.

formats: ["image/avif", "image/webp"]  — giữ nguyên
  avif được ưu tiên trước webp.
  avif nhỏ hơn ~50% so với webp cùng chất lượng.
  Browser không hỗ trợ avif sẽ fallback về webp tự động.
```

### Files thay đổi
```
apps/user-next-app/src/app/about-us/page.tsx
  import Image from 'next/image'  (thêm)
  <img> → <Image fill priority sizes="100vw">

apps/user-next-app/next.config.ts
  remotePatterns, imageSizes, minimumCacheTTL (xem trên)
```

---

## 6. generateStaticParams — Detail Pages

### Vấn đề
`/products/[slug]` và `/projects/[slug]` không có `generateStaticParams` → Next.js render on-demand khi có request. Mỗi user đầu tiên vào một slug phải chờ server fetch + render.

### Giải pháp
`generateStaticParams` báo Next.js pre-render tất cả slugs lúc `next build`. Kết quả được lưu dưới dạng static HTML, serve từ CDN edge → TTFB gần 0ms.

`export const revalidate = 3600` — ISR (Incremental Static Regeneration): sau 1 giờ, nếu có request mới thì Next.js re-generate page ở background. User vẫn nhận page cũ (không chờ), page mới sẵn sàng cho request tiếp theo.

### Tại sao limit: 200?
Fetch tất cả slugs có thể quá nhiều nếu data lớn. `limit: 200` đủ cho hầu hết catalog vừa và nhỏ. Nếu có hơn 200 slugs cần loop qua pages của API.

### Files thay đổi
```
apps/user-next-app/src/app/products/[slug]/page.tsx
  Thêm:
    export const revalidate = 3600

    export async function generateStaticParams() {
      const res = await api.products.getProducts({ limit: '200' }).catch(() => null)
      return (res?.items ?? []).map((p) => ({ slug: p.slug }))
    }

apps/user-next-app/src/app/projects/[slug]/page.tsx
  Thêm:
    export const revalidate = 3600

    export async function generateStaticParams() {
      const res = await api.projects.getProjects({ limit: '200' }).catch(() => null)
      return (res?.items ?? []).map((p) => ({ slug: p.slug }))
    }
```

---

## 7. LazyMotion — Framer Motion Bundle

### Vấn đề
```ts
import { motion } from "framer-motion"
```
Import `motion` object đầy đủ load toàn bộ framer-motion feature set vào bundle — bao gồm cả các feature không dùng (3D transforms, drag, layout animations phức tạp, v.v.).

### Giải pháp
`LazyMotion` là cơ chế của framer-motion để lazy load chỉ feature set cần thiết:
- `domAnimation` — animation, transitions, variants, gestures (hover/tap). Đủ cho 99% use case web thông thường. Nhẹ hơn ~30% so với full bundle.
- `domMax` — thêm layout animations, drag. Nặng hơn, chỉ cần nếu dùng `layoutId` hoặc drag.

Khi dùng `LazyMotion`, các component phải đổi từ `motion.div` → `m.div` (m là lightweight alias). Các hooks như `useInView`, `useScroll`, `useTransform`, `MotionConfig` vẫn import bình thường từ `framer-motion` — không thay đổi.

### Package liên quan
Không cần install thêm — `LazyMotion`, `m`, `domAnimation` đều có sẵn trong `framer-motion`.

### Files tạo mới
```
apps/user-next-app/src/components/ui/MotionProvider.tsx
  "use client" component wrap <LazyMotion features={domAnimation}>
  Mount 1 lần ở root layout → tất cả m.* components trong toàn app dùng chung feature set
  Phải là "use client" vì LazyMotion là React context provider
```

### Files thay đổi
```
apps/user-next-app/src/app/layout.tsx
  import MotionProvider
  Wrap toàn bộ <body> content trong <MotionProvider>

apps/user-next-app/src/components/home/FeaturedProjectsSection.tsx
  import { m, useInView } from "framer-motion"   (motion → m)
  Đổi tất cả: motion.div → m.div, motion.h3 → m.h3, motion.p → m.p

apps/user-next-app/src/app/about-us/company-history/CompanyHistoryTimeline.tsx
  import { m, useInView, useScroll, useTransform, MotionConfig } from "framer-motion"
  Đổi tất cả: motion.div → m.div, motion.span → m.span, motion.h3 → m.h3, motion.p → m.p
```

---

## 8. React Compiler

### Vấn đề
React re-render component khi state/props thay đổi — kể cả khi output không đổi. Developers phải viết `useMemo`, `useCallback`, `React.memo` thủ công để tránh unnecessary re-renders. Dễ quên, dễ sai, tốn thời gian.

### Giải pháp
React Compiler (trước gọi là React Forget) — Babel plugin phân tích code tại build time và tự động thêm memoization ở những chỗ cần thiết. Không cần thay đổi code, không cần viết `useMemo`/`useCallback`.

Đây là experimental feature của React 19 + Next.js 15. Stable trong React 19 RC.

### Package install
```
babel-plugin-react-compiler@rc
  Lý do dùng @rc tag: phiên bản stable release candidate, tương thích với React 19.
  Không dùng @latest vì @latest có thể trỏ về phiên bản cũ hơn không hỗ trợ React 19.
  Next.js 15 tự động dùng plugin này khi bật experimental.reactCompiler — không cần config Babel thêm.
```

### Files thay đổi
```
apps/user-next-app/package.json
  devDependencies: babel-plugin-react-compiler@rc

apps/user-next-app/next.config.ts
  experimental: {
    reactCompiler: true,
  }
```

---

## 9. Bundle Analyzer — Admin Vite App

### Vấn đề
`apps/admin-vite-app` có một số dependencies nặng nghi ngờ ảnh hưởng bundle size:
- `@imgly/background-removal` — kéo theo ONNX Runtime (~vài MB)
- `@tiptap/*` và `react-quill-new` — 2 rich text editors cùng tồn tại
- `recharts`, `framer-motion`, `@dnd-kit/*`

Không có cách nào biết chunk nào nặng nhất mà không có visualizer.

### Giải pháp
`rollup-plugin-visualizer` — plugin cho Vite/Rollup xuất ra file HTML interactive hiển thị:
- Treemap của tất cả modules trong bundle
- Size thực tế, gzip size, brotli size của từng chunk
- Dependency nào đang pull module nào vào bundle

### Tại sao không dùng `vite-bundle-visualizer` hay `vite-plugin-inspect`?
`rollup-plugin-visualizer` là standard nhất, tương thích Vite 6, không cần config thêm. `vite-plugin-inspect` focus vào plugin pipeline hơn là bundle output.

### Package install
```
rollup-plugin-visualizer (devDependency)
  Lý do devDep: chỉ dùng lúc build để analyze, không vào production bundle.
  Chỉ active khi ANALYZE=true — không ảnh hưởng build thường.
```

### Files thay đổi
```
apps/admin-vite-app/package.json
  devDependencies: rollup-plugin-visualizer
  scripts:
    "ad": "ANALYZE=true tsc -b && ANALYZE=true vite build"
    → Chạy TypeScript check trước rồi mới build với analyzer

apps/admin-vite-app/vite.config.ts
  import { visualizer } from "rollup-plugin-visualizer"
  Thêm vào plugins[]:
    process.env.ANALYZE === "true" && visualizer({
      open: true,           — tự mở stats.html sau khi build xong
      filename: "dist/stats.html",
      gzipSize: true,       — hiển thị gzip size để estimate production size
      brotliSize: true,     — brotli compress tốt hơn gzip ~15%, nhiều CDN dùng
    })
```

### Cách dùng
```bash
cd apps/admin-vite-app
pnpm analyze
# Build xong tự mở dist/stats.html trên browser
```

---

---

## 10. React.cache — Deduplication getCategories + getBanners

### Vấn đề
`getCategories` được gọi ở 4 nơi trong cùng một request tree:
- `layout.tsx` — để render Header với navigation categories
- `page.tsx (FeaturedCategoriesSection)` — để render categories section ở home
- `products/page.tsx` — để render filter sidebar
- `products/[slug]/page.tsx` — để resolve breadcrumb category

Mỗi lần gọi `api.categories.getCategories()` là một network request riêng biệt dù data giống hệt nhau. Cùng vấn đề với `getBanners`.

### Giải pháp
`React.cache` (built-in React 19, không cần install) deduplicates function call trong cùng render tree. Nếu cùng cache key được gọi nhiều lần trong một server request, chỉ có 1 network call thực sự xảy ra — các lần sau nhận kết quả từ cache.

### Tại sao không dùng `unstable_cache`?
`unstable_cache` cache across nhiều requests (persisted cache). `React.cache` chỉ cache trong phạm vi một request. Với data như categories (thay đổi theo admin update, cần consistent trong một page load), per-request dedup là đủ và safe hơn.

### Package liên quan
Không cần install — `cache` là built-in export của React 19.

### Files tạo mới
```
apps/user-next-app/src/lib/cached-api.ts
  import { cache } from "react"
  getCachedCategories() — cache wrapper của api.categories.getCategories()
  getCachedBanners()    — cache wrapper của api.settings.getBanners()
```

### Files thay đổi
```
apps/user-next-app/src/app/layout.tsx
  import getCachedCategories thay api.categories.getCategories

apps/user-next-app/src/app/page.tsx
  HeroSection: getCachedBanners() thay api.settings.getBanners()
  FeaturedCategoriesSection: getCachedCategories() thay api.categories.getCategories()
  Thêm: export const experimental_ppr = true (xem mục 12)

apps/user-next-app/src/app/products/page.tsx
  getCachedCategories() thay api.categories.getCategories() trong Promise.all

apps/user-next-app/src/app/products/[slug]/page.tsx
  getCachedCategories() thay api.categories.getCategories() trong Promise.all
```

---

## 11. next/dynamic — Lazy Load Lightbox

### Vấn đề
`yet-another-react-lightbox` được import trực tiếp ở đầu file trong 2 components:
- `ProductDetailClient.tsx`
- `ProjectGallery.tsx`

Lightbox chỉ render khi user click vào ảnh (`open === true`). Nhưng vì import tĩnh, toàn bộ ~30KB JS của lightbox vẫn được parse và execute trong initial bundle — dù user chưa click ảnh nào.

Ngoài ra, `ProjectGallery.tsx` còn sót lại `motion` import thay vì `m` từ đợt LazyMotion migration trước.

### Giải pháp
`next/dynamic` với `{ ssr: false }` — Next.js code-split lightbox thành chunk riêng, chỉ load khi component được mount lần đầu. Vì Lightbox là pure client-side UI (không có SEO value), `ssr: false` là hoàn toàn phù hợp.

### Package liên quan
Không cần install — `next/dynamic` là built-in của Next.js.

### Files thay đổi
```
apps/user-next-app/src/app/products/[slug]/ProductDetailClient.tsx
  Trước: import Lightbox from 'yet-another-react-lightbox'
  Sau:   const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
  Giữ nguyên: import 'yet-another-react-lightbox/styles.css' (CSS cần load sớm)

apps/user-next-app/src/app/projects/[slug]/ProjectGallery.tsx
  Trước: import Lightbox from 'yet-another-react-lightbox'
         import { motion, useInView } from 'framer-motion'
  Sau:   const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
         import { m, useInView } from 'framer-motion'  (fix LazyMotion migration)
         motion.button → m.button
```

---

## 12. PPR — Partial Prerendering (Home Page)

### Vấn đề
Home page dù đã có Suspense streaming, vẫn là SSR — mỗi request Next.js phải khởi động server render, chờ React stream HTML. TTFB (Time to First Byte) phụ thuộc vào server cold start và Edge routing.

### Giải pháp
PPR (Partial Prerendering) — experimental feature của Next.js 15. Cơ chế:
1. Lúc build time: Next.js render static shell của page (Header, Footer, ContactCTA, ShowroomCTA) và lưu thành static HTML trên CDN
2. Lúc runtime: Khi user request, CDN trả static shell ngay lập tức (< 5ms TTFB)
3. Đồng thời: Server stream các dynamic Suspense boundaries vào sau

Kết quả: user nhận được layout page ngay lập tức, nội dung stream vào. Tốt hơn full SSR đáng kể.

### Tại sao chỉ bật cho home page?
PPR yêu cầu tất cả dynamic content phải nằm trong `<Suspense>`. Home page đã có đầy đủ Suspense boundaries từ optimization trước. Các page khác (products, projects) còn có `searchParams` dynamic — cần audit thêm trước khi opt-in.

PPR dùng `"incremental"` mode (không phải `true`) để opt-in từng page, không bật global.

### Package liên quan
Không cần install — PPR là experimental feature của Next.js 15.3+.

### Files thay đổi
```
apps/user-next-app/next.config.ts
  experimental: {
    reactCompiler: true,
    ppr: "incremental",   ← thêm
  }

apps/user-next-app/src/app/page.tsx
  export const experimental_ppr = true  ← opt-in chỉ cho home page
```

---

## 13. Page-Level revalidate — About Sub-Pages

### Vấn đề
`about-us/company-history`, `about-us/company-outline`, `about-us/production-facilities` đều gọi API với `{ next: { revalidate: 3600 } }` ở level từng fetch call — nhưng không có `export const revalidate` ở page level.

Không có page-level declaration, Next.js không biết cache cả page. Behavior phụ thuộc vào từng API call riêng lẻ thay vì page-level ISR strategy nhất quán.

### Giải pháp
Thêm `export const revalidate = 3600` ở đầu mỗi page. Đây là page-level ISR declaration — Next.js sẽ cache toàn bộ page render và revalidate sau 1 giờ, consistent với các fetch-level revalidate đã có.

### Files thay đổi
```
apps/user-next-app/src/app/about-us/company-history/page.tsx
  Thêm: export const revalidate = 3600

apps/user-next-app/src/app/about-us/company-outline/page.tsx
  Thêm: export const revalidate = 3600

apps/user-next-app/src/app/about-us/production-facilities/page.tsx
  Thêm: export const revalidate = 3600
```

---

## 14. Bundle Analyzer — user-next-app

### Vấn đề
Không có visibility vào bundle size của Next.js client. Không biết chunk nào nặng nhất, dependency nào đang pull gì vào initial JS.

### Giải pháp
`@next/bundle-analyzer` — official Next.js package tích hợp webpack-bundle-analyzer. Xuất ra HTML interactive với treemap của tất cả chunks.

### Tại sao không dùng phiên bản cũ hơn?
Version được pin theo Next.js version (`^15.3.3`) để đảm bảo tương thích với webpack config của Next.js 15.

### Package install
```
@next/bundle-analyzer (devDependency)
  Lý do devDep: chỉ dùng lúc build analyze, không vào production bundle.
  Dùng require() thay vì import để tránh TS module resolution issue khi package chưa được install vào local node_modules (pnpm hoisting).
  Chỉ active khi ANALYZE=true — không ảnh hưởng build thường.
```

### Cách dùng
```bash
cd apps/user-next-app
pnpm analyze
# Build xong tự mở browser với 3 file HTML:
#   .next/analyze/client.html   — client bundles (JS user download)
#   .next/analyze/nodejs.html   — server bundles
#   .next/analyze/edge.html     — edge runtime bundles
```

### Lưu ý fix pnpm store
Nếu gặp lỗi `ERR_PNPM_UNEXPECTED_STORE`, chạy trước:
```bash
pnpm config set store-dir ~/.pnpm-store --global && pnpm install
```

### Files thay đổi
```
apps/user-next-app/package.json
  devDependencies: @next/bundle-analyzer@^15.3.3
  scripts:
    "analyze": "ANALYZE=true next build"

apps/user-next-app/next.config.ts
  const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: ... })
  export default withBundleAnalyzer(nextConfig)
```

---

## Files bị xóa

```
apps/user-next-app/src/components/ui/PageLoader.tsx
  Spinner generic cũ — đã thay toàn bộ bằng skeleton layout-matched.

apps/user-next-app/src/components/layout/RouteProgressBar.tsx
  Loading bar top-of-page — bỏ theo yêu cầu, thay bằng skeleton approach.
```

---

## Tổng kết file changes

| File | Trạng thái | Lý do |
|---|---|---|
| `src/components/ui/Skeleton.tsx` | Mới | Skeleton primitive |
| `src/components/ui/MotionProvider.tsx` | Mới | LazyMotion provider |
| `src/lib/fonts.ts` | Mới | next/font config |
| `src/lib/cached-api.ts` | Mới | React.cache dedup wrapper |
| `src/app/loading.tsx` | Mới | Home skeleton |
| `src/app/about-us/loading.tsx` | Mới | About skeleton |
| `src/app/about-us/company-history/loading.tsx` | Mới | Skeleton |
| `src/app/about-us/company-outline/loading.tsx` | Mới | Skeleton |
| `src/app/about-us/production-facilities/loading.tsx` | Mới | Skeleton |
| `src/app/contact/loading.tsx` | Mới | Skeleton |
| `src/app/products/loading.tsx` | Mới | Skeleton |
| `src/app/products/[slug]/loading.tsx` | Mới | Skeleton |
| `src/app/projects/loading.tsx` | Mới | Skeleton |
| `src/app/projects/[slug]/loading.tsx` | Mới | Skeleton |
| `src/app/layout.tsx` | Sửa | next/font + MotionProvider + min-h-screen + getCachedCategories |
| `src/app/page.tsx` | Sửa | Suspense streaming + PPR opt-in + cached API |
| `src/app/globals.css` | Sửa | Xóa @import Google Fonts |
| `src/app/about-us/page.tsx` | Sửa | `<img>` → `<Image priority>` |
| `src/app/about-us/company-history/page.tsx` | Sửa | revalidate = 3600 |
| `src/app/about-us/company-outline/page.tsx` | Sửa | revalidate = 3600 |
| `src/app/about-us/production-facilities/page.tsx` | Sửa | revalidate = 3600 |
| `src/app/products/page.tsx` | Sửa | getCachedCategories |
| `src/app/products/[slug]/page.tsx` | Sửa | generateStaticParams + revalidate + getCachedCategories |
| `src/app/products/[slug]/ProductDetailClient.tsx` | Sửa | Lightbox → next/dynamic |
| `src/app/projects/[slug]/page.tsx` | Sửa | generateStaticParams + revalidate |
| `src/app/projects/[slug]/ProjectGallery.tsx` | Sửa | Lightbox → next/dynamic + motion → m |
| `src/app/about-us/company-history/CompanyHistoryTimeline.tsx` | Sửa | motion → m |
| `src/components/home/FeaturedProjectsSection.tsx` | Sửa | motion → m |
| `next.config.ts` | Sửa | reactCompiler + PPR + image config + bundle-analyzer |
| `package.json` (user-next-app) | Sửa | babel-plugin-react-compiler + @next/bundle-analyzer |
| `apps/admin-vite-app/vite.config.ts` | Sửa | visualizer plugin |
| `apps/admin-vite-app/package.json` | Sửa | analyze script + rollup-plugin-visualizer |
| `src/components/ui/PageLoader.tsx` | Xóa | Replaced by skeletons |
| `src/components/layout/RouteProgressBar.tsx` | Xóa | Removed per request |
