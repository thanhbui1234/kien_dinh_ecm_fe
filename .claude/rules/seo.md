# SEO Guidelines — `apps/user-next-app`

## Central source of truth

All brand constants and metadata builder functions live in one file:

```
apps/user-next-app/src/lib/seo.ts
```

**Never hardcode brand names, the production domain, or the default OG image path in any page file.** Always import from `@/lib/seo`.

```ts
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, buildBaseMetadata, buildProductMetadata, buildProjectMetadata } from '@/lib/seo';
```

Current values:
- `SITE_NAME` = `'Thanh Bằng'`
- `SITE_URL` = `'https://thanhbang.com'`
- `DEFAULT_OG_IMAGE` = `'/images/logo_thanh_bang.png'`

---

## Adding metadata to a new page

### Static page (no dynamic data)

Use `buildBaseMetadata`:

```ts
import type { Metadata } from 'next';
import { buildBaseMetadata } from '@/lib/seo';

export const metadata: Metadata = buildBaseMetadata({
  title: 'Tên trang',         // will become "Tên trang | Thanh Bằng"
  description: 'Mô tả...',
  path: '/your-path/',        // used for canonical URL
  ogImage: '/images/...',     // optional, falls back to DEFAULT_OG_IMAGE
});
```

### Product detail page

Use `buildProductMetadata`. It handles the full fallback chain automatically:
`seoMeta.metaTitle → product.name`
`seoMeta.metaDescription → product description → generated string`
`seoMeta.ogImage → product.thumbnailUrl → DEFAULT_OG_IMAGE`

```ts
import { buildProductMetadata } from '@/lib/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await api.products.getProductDetail(params.slug);
  if (!product) return { title: 'Sản phẩm' };
  return buildProductMetadata({
    name: product.name,
    slug: params.slug,
    thumbnailUrl: product.thumbnailUrl,
    seoMeta: product.detail?.seoMeta as Record<string, string> | undefined,
  });
}
```

### Project detail page

Use `buildProjectMetadata`. OG image: `project.coverImage → DEFAULT_OG_IMAGE`

```ts
import { buildProjectMetadata } from '@/lib/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await api.projects.getProjectDetail(params.slug);
  if (!project) return { title: 'Dự án' };
  return buildProjectMetadata({
    name: project.name,
    description: project.description,
    slug: params.slug,
    coverImage: project.coverImage,
  });
}
```

---

## Root layout (`app/layout.tsx`)

The root layout sets the global title template and fallback OG. Do not add per-page metadata here.

```ts
title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` }
metadataBase: new URL(SITE_URL)
```

The `template` means any page that exports `title: 'Foo'` (a plain string) will automatically render as `"Foo | Thanh Bằng"`. Pages that call `buildBaseMetadata` / `buildProductMetadata` / `buildProjectMetadata` already produce the full title string, so the template has no double effect on them.

---

## robots.ts and sitemap.ts

Both files live at `apps/user-next-app/src/app/` and are Next.js native route handlers (no package dependencies).

- `robots.ts` — allows all crawlers, points to `/sitemap.xml`.
- `sitemap.ts` — returns 8 static routes + all product and project slugs pulled from the API (`limit: '500'`). Uses `Promise.allSettled` so API failures don't break the sitemap. Revalidates every 3600 s.

When adding a new static route, append it to the `staticRoutes` array in `sitemap.ts`.

---

## Checklist for a new page

- [ ] `export const metadata` (static) or `export async function generateMetadata` (dynamic) present
- [ ] `title` does NOT include "| Thanh Bằng" manually — let the template or the builder functions handle it, OR use the full string from a builder
- [ ] `alternates.canonical` is set (builders do this automatically)
- [ ] `openGraph` and `twitter` blocks are populated (builders do this automatically)
- [ ] No hardcoded `"Thanh Bằng"`, `"thanhbang.com"`, or `"/images/logo_thanh_bang.png"` strings — use constants from `@/lib/seo`
- [ ] If it's a new static public route, add it to `sitemap.ts`
