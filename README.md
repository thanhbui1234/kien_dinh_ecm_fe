# Kien Dinh ECM Frontend

This is a **pnpm + Turborepo monorepo** with two apps sharing UI components and an API client.

## Build & Development Commands

```bash
# Development (all apps in parallel via Turborepo)
pnpm dev

# Single app dev
pnpm --filter user-next-app dev      # Next.js on port 3000
pnpm --filter admin-vite-app dev     # Vite on port 3001

# Build
pnpm build                           # All apps (respects dependency order)
pnpm --filter user-next-app build
pnpm --filter admin-vite-app build

# Lint
pnpm lint

# Add packages
pnpm --filter <package-name> add <pkg>

# pnpm store (if store mismatch errors occur)
pnpm --store-dir /Users/thanhbc/Library/pnpm/store/v3 --filter <pkg> add <dep>
```

No test framework is currently configured.

## Architecture

```
apps/
  user-next-app/     → Next.js 15 (App Router), customer-facing wedding film site
  admin-vite-app/    → Vite + React 19, admin CMS dashboard

packages/
  shared-ui/         → shadcn/ui components (Button, Badge, Card, Dialog, Input, etc.)
  shared-api/        → API client factory, React Query providers, auth adapters
  config/            → Shared ESLint config + tsconfig.base.json
```

**Key architectural decisions:**
- Tailwind CSS v4 with native framework plugins (`@tailwindcss/postcss` for Next.js, `@tailwindcss/vite` for Vite)
- shadcn/ui components live in `packages/shared-ui/` with new-york style variant
- `cn()` utility from `shared-ui/lib/utils.ts` (clsx + tailwind-merge)
- CSS variables in oklch color space for theming (`shared-ui/styles/globals.css`)
- Next.js uses `transpilePackages: ["shared-ui", "shared-api"]` to consume workspace packages
- Path alias `@/*` maps to `./src/` in both apps
- Root tsconfig has `@ui/*` → `packages/shared-ui/*`

**Turborepo pipeline:** `build` tasks depend on `^build` (packages build before apps). `dev` is persistent and uncached.

## Admin App (admin-vite-app)

**State management:** useReducer + React Context in `src/context/admin-context.tsx`. Domain hooks (`useCollection`, `useBanner`, `useAbout`, `useFooter`, etc.) abstract dispatch for each page.

**Routing:** React Router v7 with all routes inside `<AdminLayout />`. Pages live in `src/pages/`.

**UI pattern:** Pages use composite components from `src/components/composite/` (PageContainer, SectionCard, SectionConfigForm, EntityList, EntityFormDialog, FormField, SaveBar, ConfirmDialog, EmptyState, TagInput, ColorField).

**Forms:** React Hook Form with zod validation. Save buttons are disabled until `formState.isDirty` is true.

**Data:** Currently mock/static data in `src/data/mock-data.ts`. API client configured via `VITE_API_URL` env var (pointing to localhost:8000).

**Types:** All interfaces in `src/types/index.ts`. Key generic: `Collection<TConfig, TItem>` used by highlights/reels/films. `useCollection<K>()` provides typed CRUD for any collection key.

## User App (user-next-app)

**Folder structure:**
```
src/
├── app/                    (routes: /, /wedding-highlight, /wedding-reels, /traditional-film, /contact)
├── components/
│   ├── layout/             (Header, Footer, SlideMenu)
│   ├── sections/           (AboutSection, WeddingHighlightSection, WeddingReelsSection, ContactPreview)
│   ├── ui/                 (VideoBanner, PageTitleBar, ThemeToggle)
│   └── providers/          (TopLoadingBarProvider)
├── data/                   (videos.ts — static fallback until API is live)
├── hooks/                  (useScrollAnimation)
├── lib/                    (api.ts — serverFetch via shared-api)
└── types/                  (content.ts — interfaces matching admin config shapes)
```

**Config-ready pattern:** Section components accept optional props with static defaults. When the API is live, server components will fetch config and pass it as props — no client-side refactor needed.
```tsx
// Example: AboutSection accepts optional props, falls back to static data
function AboutSection({ stats = DEFAULT_STATS, images = DEFAULT_IMAGES }: AboutSectionProps) {}
```

**API integration:** `shared-api` is wired up via `transpilePackages` in next.config.ts. `src/lib/api.ts` exports `serverFetch` (uses `createServerFetch` with cookie-based auth). `NextQueryProvider` wraps the app in `providers.tsx`.

**Content data:** `src/data/videos.ts` is the static fallback for highlight videos, traditional films, and reels until the API is ready.

**Page transitions:** `react-top-loading-bar` via `TopLoadingBarProvider` in `src/components/providers/`. Auto-detects internal link clicks and completes on pathname change.

**Theme:** next-themes with class-based dark mode (default: light).

## Shared API Package (shared-api)

Exports: `createApiClient`, token adapters (`createStorageAdapter`, `createCookieAdapter`), `ApiQueryProvider`, `useApiClient` hook, `queryKeys`, and a `createServerFetch` for SSR.

## Deployment

Vercel with two separate projects pointing to the same repo:
- user-next-app: root directory `apps/user-next-app`
- admin-vite-app: root directory `apps/admin-vite-app`

Vercel handles Turborepo remote caching and skips builds for unaffected apps automatically.
