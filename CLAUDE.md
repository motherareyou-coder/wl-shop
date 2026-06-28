# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ 强制约束总纲（MUST READ FIRST）

> 本节是项目的最高优先级约束。任何会话开始、任何涉及页面/数据/SEO/样式/布局/文案的开发，**必须先读并遵守**以下规范文档。
> 每个约束在 CLAUDE.md 只留指针，**详细规范见对应独立文档**。

| # | 约束 | 强制等级 | 详细文档 |
|---|---|---|---|
| 1 | **SEO/GEO 规范**（最高优先级） | MUST | `docs/SEO_GEO_GUIDELINES.md` |
| 2 | **代码风格一致性** | MUST | `docs/CODE_STYLE.md` |
| 3 | **响应式与多端兼容** | MUST | `docs/RESPONSIVE.md` |
| 4 | **i18n 文案国际化** | MUST | `docs/I18N_GUIDELINES.md` |
| 5 | **可访问性 a11y** | SHOULD | `docs/A11Y_GUIDELINES.md` |
| 6 | **API 请求与错误处理** | MUST | `docs/API_GUIDELINES.md` |

### 约束 1：SEO/GEO 规范（最高优先级）
- **触发**：新建页面、改页面结构、改 SEO 数据、改图片、改 i18n、改任何会被搜索引擎/AI 抓取的内容。
- **动作**：开工前读 `docs/SEO_GEO_GUIDELINES.md` §8.1（新建页面检查清单）；提交前对照 §8.3（PR Review 项）。
- **原则**：SEO 是最高优先级，与功能/进度冲突时**优先 SEO** 并向用户说明。
- **历史问题**：见 `docs/ISSUES.md`。

### 约束 2：代码风格一致性
- **触发**：写任何 .vue / .ts / .scss 文件、改布局结构。
- **动作**：开工前读 `docs/CODE_STYLE.md`；布局改动复用现有 `site-grid` 栅格体系。
- **要点**：Tab 缩进、单引号、无分号、`<script setup lang="ts">`；组件命名按职责（容器类加 App 前缀，业务小组件语义命名）。

### 约束 3：响应式与多端兼容（PC / 手机 H5 / 平板）
- **触发**：写任何页面/组件、改布局、加交互元素。
- **动作**：开工前读 `docs/RESPONSIVE.md` 选择适配模式（A 双组件 / B v-if 分支 / C CSS 媒体查询）；提交前跑响应式自检清单。
- **兼容范围**：iOS Safari、Android Chrome、iPad、PC Chrome（含窗口缩窄至 720px 以下）。
- **原则**：SEO 与响应式冲突时优先 SEO（SSR 关键内容用模式 C）。

### 约束 4：i18n 文案国际化
- **触发**：写任何展示给用户的文字（按钮、标题、提示、占位符、错误信息）。
- **动作**：开工前读 `docs/I18N_GUIDELINES.md`；所有可见文案走 `$t()`/`t()`，禁止硬编码。
- **要点**：新 key 用英文 camelCase（禁止中文 key、带空格 key）；同步更新 `locales/en.ts`。

### 约束 5：可访问性 a11y
- **触发**：写交互元素、表单、图片、动态内容。
- **动作**：开工前读 `docs/A11Y_GUIDELINES.md`；可点击元素用 `<button>`/`<a>` 非 `<div @click>`；图片有 alt；视觉隐藏用 `sr-only`。
- **原则**：a11y 与 SEO 高度重合，良好 a11y 提升 SEO。

### 约束 6：API 请求与错误处理
- **触发**：任何调用后端接口。
- **动作**：开工前读 `docs/API_GUIDELINES.md`；页面首屏数据用 `useAPI`（SSR），store/事件回调用 `$api`；禁止裸 `$fetch`。
- **要点**：每个数据区块有 pending（骨架屏）/ error（重试）/ 成功三分支。

---

## Project Overview

iswink (iswink.com) — a Nuxt 3 e-commerce storefront for selling surprise/romantic gifts. The app supports SSR, multi-locale i18n (English active), responsive PC/mobile layouts, and SEO with structured data (JSON-LD, sitemap, robots.txt).

## Commands

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies (pnpm 9.4.0) |
| `pnpm dev` | Dev server (.env.development, no SSR) |
| `pnpm dev:local` | Dev server (.env.local, local backend) |
| `pnpm dev:prod` | Dev server (.env.production, SSR enabled) |
| `pnpm dev:fast` | Dev server (no-fork, faster startup) |
| `pnpm build:prod` | Production build |
| `pnpm build:dev` | Development build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |

Deployment: PM2 via `ecosystem.config.cjs` (cluster mode, port 3000, entry: `.output/server/index.mjs`).

## Architecture

### API Layer

- **`plugins/api.ts`** — Creates a `$fetch` instance (exposed as `useNuxtApp().$api`). Handles: tenant-id header, terminal header (PC/H5), auth token injection, auto token-refresh on 401 with request queue, error messages via ElMessage.
- **`composables/$api.ts`** — Shorthand: `$api(...)` = `useNuxtApp().$api(...)`.
- **`composables/useAPI.ts`** — Wraps `useFetch` with `$fetch: nuxtApp.$api`, SSR-enabled. All page data fetching should use this.

### API Proxy Routing

- **Dev (CSR)**: requests go to `/api/*` → Vite dev server proxy rewrites to `NUXT_API_TARGET_URL/app-api/*`
- **Production (SSR)**: requests go to `/app-api/*` → Nitro `routeRules` proxy to `NUXT_API_TARGET_URL/app-api/*`
- Configured in `nuxt.config.ts` via `runtimeConfig.public.apiBaseProxyPath`

### Stores (Pinia)

| Store | File | Purpose |
|---|---|---|
| `useAppStore` | `stores/app.ts` | Device detection (isPC/isMobile via body width), responsive breakpoints |
| `useUserStore` | `stores/user.ts` | Auth state (accessToken persisted to cookie/localStorage), user info, login/logout, token refresh |
| `useCartStore` | `stores/cart.ts` | Cart items (local when logged out, API-backed when logged in), persisted to localStorage |
| `useParamsStore` | `stores/params.ts` | Shared request parameters |
| `useChatStore` | `stores/chat.ts` | Customer service chat (WebSocket) |

### Auth Flow

1. `middleware/redirect-to-login.global.ts` — guards `/user/*` routes, redirects to `/login` if no token, fetches user info if token exists but user data missing.
2. Token refresh is transparent — `plugins/api.ts` queues concurrent requests during refresh and replays them.
3. `accessToken` is persisted to both cookie (for SSR hydration) and localStorage (for client).

### SEO

- **`composables/useSEO.ts`** — centralized SEO composable: generates meta tags, Open Graph, Twitter cards, canonical URLs, hreflang alternates, and JSON-LD structured data (Product, BreadcrumbList, Organization).
- **`config/seo.config.ts`** — route-specific SEO templates with i18n keys. `noIndexRoutes` for cart/checkout/user pages.
- Sitemap auto-generated in production from product/article IDs fetched from backend API.

### i18n

- Config: `locales/i18n.config.ts`, strategy: `prefix` (all routes have locale prefix e.g. `/en/...`)
- Currently active: English only. 14 other locales prepared but commented out.
- Locale detection disabled (`useCookie: false`).

### Responsive Design

- `useAppStore.listen()` (called in `plugins/ready.client.ts`) sets `isPC`/`isMobile` based on `body.clientWidth <= 720`.
- Many pages have separate `Mobile.vue` and `PC.vue` components (e.g. product, product-list, user/orderlist).

### Layouts

- `layouts/default.vue` — AppHeader + UserBreadcrumb + slot + AppFooter + AppChat
- `layouts/empty.vue` — bare layout (no header/footer)
- `layouts/login.vue` — login-specific layout

### Key Page Routes

- `/` — homepage, `/product/[id]` — product detail, `/product-list` — product listing
- `/articles`, `/articles/[id]` — blog/articles
- `/user/*` — auth-protected: cart, checkout, orders, favorites, wallet, address, reviews, etc.
- `/login`, `/forgetPassword` — auth pages
- `/seckill`, `/combination`, `/bargin`, `/coupon` — promotional activities

### Types

All TypeScript interfaces are in `types.ts` (UserInfo, AuthToken, Product, CartItem, SKU, Category, etc.).

## Code Conventions

- **Style**: Tabs for indent, single quotes, no semicolons (enforced by `@antfu/eslint-config`)
- **Components**: PascalCase files and names. Naming by responsibility — container/layout components prefixed with `App` (e.g. `AppHeader`, `AppFooter`, `AppModal`); small business components use semantic names without `App` prefix (e.g. `ProductPrice`, `CartNav`). See `docs/CODE_STYLE.md` §2.1 for the decision rule.
- **CSS**: SCSS with scoped styles. BEM-like class naming with `-` separator. Global styles in `assets/css/index.scss`. Element Plus SCSS variables injected via `additionalData`.
- **API calls**: Always use `useAPI` composable or `$api` shorthand. Never call `$fetch` directly in components.
- **State**: Global state in Pinia stores. Business logic in `composables/` or `stores/`, not in Vue components.
- **Types**: No `any` types. Import types with `import type`. All interfaces defined in `types.ts`.
- **Vue**: `<script setup lang="ts">` with Composition API only.
- **Icons**: Custom SVG icons in `assets/icons/`, loaded via `@nuxt/icon` with `icon-` prefix.

## Environment Files

| File | Backend | SSR | Purpose |
|---|---|---|---|
| `.env.local` | localhost:48080 | off | Local development |
| `.env.development` | dev server IP | off | Development team |
| `.env.production` | api.iswink.com | on | Production |

Key env vars: `NUXT_API_TARGET_URL`, `NUXT_PUBLIC_TENANT_ID`, `DOMAIN_URL`, `ENABLE_SSR`, `DEBUG`, plus SEO config vars (`NUXT_APP_TITLE_SUFFIX`, `NUXT_DEFAULT_KEYWORDS`, etc.).

## Internal Commit Convention

Internal commit message format: `wl-<number> <description>` (e.g. `wl-0058 修复首页SEO`). Keep this format for all commits.
