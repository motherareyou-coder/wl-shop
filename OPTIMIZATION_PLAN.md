# iswink 项目优化方案

> 基于代码审查生成，按优先级分阶段执行。每项任务标注涉及文件、具体操作和预期收益。

---

## 阶段一：P0 — 必须立即修复（影响核心指标）

### 1.1 修复 404 处理 — 消除 Soft 404

**问题：** `middleware/redirect-404-to-home.global.ts` 将所有未匹配路由 302 重定向到首页。搜索引擎无法收到 404 状态码，导致首页被索引到无数个不同 URL 下。

**涉及文件：**
- `middleware/redirect-404-to-home.global.ts` — 删除此文件
- 新建 `error.vue`（项目根目录）

**操作：**

1. 删除 `middleware/redirect-404-to-home.global.ts`

2. 创建 `error.vue`：

```vue
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
    url: string
  }
}>()

const localePath = useLocalePath()
const handleError = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusCode === 404 ? 'Page not found' : error.message }}</p>
    <button @click="handleError">Back to Home</button>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  h1 { font-size: 96px; margin: 0; color: #333; }
  p { font-size: 18px; color: #666; margin: 16px 0 32px; }
  button {
    padding: 12px 32px;
    background: #000;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
```

**预期收益：** 搜索引擎能正确识别 404，不再产生 soft 404 问题。

---

### 1.2 核心页面添加 `<h1>` 标签

**问题：** 首页、商品列表、文章列表、文章详情、所有促销页面均无 `<h1>` 标签。

**涉及文件及操作：**

| 文件 | 操作 |
|---|---|
| `pages/index/index.vue` | 在第一个可视区域添加 `<h1>`，如 `<h1 class="sr-only">{{ $t('seo.home.title') }}</h1>` |
| `pages/product-list/index.vue` | 添加 `<h1>` 包含分类或页面名称 |
| `pages/articles/index.vue` | 添加 `<h1>` 如 "Articles & Guides" |
| `pages/articles/[id].vue` | 将标题 `<div class="new-detail__title">` 改为 `<h1>` |
| `pages/seckill/index.vue` | 添加 `<h1>` 如 "Flash Deals" |
| `pages/combination/index.vue` | 添加 `<h1>` |
| `pages/coupon/index.vue` | 添加 `<h1>` |
| `pages/bargin/index.vue` | 添加 `<h1>` |

> **注意：** 每个页面有且仅有一个 `<h1>`，与 `<title>` 内容呼应但不需完全相同。可使用 `.sr-only` 样式视觉隐藏但保留语义。

**预期收益：** 修复基础 SEO 排名因素，帮助搜索引擎理解页面主题。

---

### 1.3 Element Plus CSS 按需引入

**问题：** `assets/css/element.scss` 引入全量 Element Plus 样式（~200-400KB），且通过 `additionalData` 注入到每个 SCSS 文件。

**涉及文件：**
- `assets/css/element.scss`
- `nuxt.config.ts`（SCSS additionalData 配置）
- `assets/css/common.scss`（Element Plus 覆盖样式）

**操作：**

1. `assets/css/element.scss` — 改为按需引入实际使用的组件样式：

```scss
// 只引入实际使用的组件样式，例如：
@use 'element-plus/theme-chalk/src/message.scss' as *;
@use 'element-plus/theme-chalk/src/message-box.scss' as *;
@use 'element-plus/theme-chalk/src/drawer.scss' as *;
@use 'element-plus/theme-chalk/src/checkbox.scss' as *;
@use 'element-plus/theme-chalk/src/pagination.scss' as *;
@use 'element-plus/theme-chalk/src/dialog.scss' as *;
@use 'element-plus/theme-chalk/src/input.scss' as *;
// ... 按实际使用情况逐个添加
```

2. 需要全站排查使用了哪些 Element Plus 组件（可运行构建分析辅助排查，见 4.1 节）

**预期收益：** 减少 200-400KB CSS 体积，加快 FCP。

---

## 阶段二：P1 — 高优先级（显著提升性能和 SEO）

### 2.1 修复 i18n baseUrl 拼写错误

**问题：** `nuxt.config.ts:180` 中 `DOMAIN_URl` 应为 `DOMAIN_URL`，导致 hreflang 绝对路径为空。

**涉及文件：** `nuxt.config.ts`

**操作：**

```ts
// 修改前
baseUrl: process.env.DOMAIN_URl,

// 修改后
baseUrl: process.env.DOMAIN_URL,
```

**预期收益：** hreflang 标签正常生成绝对 URL。

---

### 2.2 用户页面 noindex 标签生效

**问题：** `/user/**` 页面使用原生 `useHead` 而非 `useSEO`，导致 `config/seo.config.ts` 中定义的 `noIndexRoutes` 从未生效。

**涉及文件：** 所有 `pages/user/**/*.vue`

**操作方案（二选一）：**

**方案 A：** 每个 user 页面的 `useHead` 中手动添加 noindex：

```ts
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  // ... 其他现有配置
})
```

**方案 B（推荐）：** 统一改用 `useSEO` composable，集中管理：

```ts
useSEO({ noIndex: true })
```

**预期收益：** 阻止搜索引擎索引购物车、结算、订单等无 SEO 价值的页面。

---

### 2.3 图片优化 — `<img>` 替换为 `<NuxtImg>`

**问题：** 约 40 处原生 `<img>` 标签缺少懒加载、尺寸声明、格式转换。

**涉及文件：**

| 文件 | `<img>` 数量 |
|---|---|
| `components/CartService.vue` | 4 |
| `pages/product/components/ActivityTips.vue` | 8 |
| `pages/product/components/Activities.vue` | 1 |
| `pages/product/components/Review/Mobile.vue` | 1 |
| `pages/product/components/Review/PC.vue` | 1 |
| `pages/seckill/components/Picks.vue` | 1+ |
| `pages/user/index.vue` | 5 |
| `pages/bargin/index.vue` | 2 |
| `pages/coupon/index.vue` | 2 |
| `pages/seckill/index.vue` | 2 |
| `pages/combination/index.vue` | 2 |

**操作：**

将 `<img :src="xxx">` 替换为：

```vue
<NuxtImg
  :src="xxx"
  preset="product"
  loading="lazy"
  width="400"
  height="400"
  :alt="描述文字"
/>
```

> 首屏可见图片使用 `loading="eager"` + `fetchpriority="high"`，非首屏使用 `loading="lazy"`。必须声明 `width/height` 防止 CLS。

**预期收益：** 自动转 WebP/AVIF、懒加载、消除 CLS，显著改善 LCP 和 PageSpeed 分数。

---

### 2.4 字体优化

**问题：** `font-display: swap` 被注释；使用 TTF 而非 WOFF2；全局阻塞渲染。

**涉及文件：**
- `assets/css/common.scss`（@font-face 声明）
- `assets/fonts/miSansLatin/MiSansLatinVF.ttf`（字体文件）
- `nuxt.config.ts`（可选：添加 preload）

**操作：**

1. 将 `MiSansLatinVF.ttf` 转换为 `.woff2` 格式（使用 Google 的 [woff2 工具](https://github.com/google/woff2)）

2. 修改 `assets/css/common.scss`：

```css
@font-face {
    font-family: "MiSans Latin";
    src: url('../fonts/miSansLatin/MiSansLatinVF.woff2') format('woff2');
    font-display: swap;  /* 必须启用 */
    font-weight: 100 900;
}
```

3. 可选 — 在 `nuxt.config.ts` 的 `app.head.link` 中添加预加载：

```ts
link: [
  { rel: 'preload', href: '/fonts/MiSansLatinVF.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
]
```

**预期收益：** 消除 FOIT（文字闪烁），字体体积减少约 30%，改善 FCP。

---

### 2.5 API 串行请求并行化

**问题：** 多个页面存在不必要的串行 `await`，阻塞 SSR 渲染。

**涉及文件及操作：**

**`pages/product/[id].vue`** — 两个独立的数据请求应并行化：

```ts
// 修改前：串行
const productRes = await useAPI('product/spu/get-detail', { params: { id } })
const reviewRes = await useAPI('product/review/page', { params: { spuId: id } })

// 修改后：并行
const [productRes, reviewRes] = await Promise.all([
  useAPI('product/spu/get-detail', { params: { id } }),
  useAPI('product/review/page', { params: { spuId: id } }),
])
```

同理处理：
- `pages/user/index.vue`
- `pages/seckill/index.vue`
- `pages/user/aftersaleview/[id].vue`（3 个串行请求）

> **注意：** 仅当请求之间无依赖关系时才可并行化。如果第二个请求依赖第一个的返回值，则保持串行。

**预期收益：** SSR 模式下 TTFB 减少约 50%（取决于最慢的请求）。

---

### 2.6 添加服务端页面缓存（SWR）

**问题：** 所有页面每次请求都重新服务端渲染，无缓存。

**涉及文件：** `nuxt.config.ts`

**操作：** 在 `nitro.routeRules` 中添加 SWR 缓存：

```ts
nitro: {
  compressPublicAssets: true,
  routeRules: {
    // API 代理（已有）
    '/app-api/**': {
      proxy: `${process.env.NUXT_API_TARGET_URL}/app-api/**`,
    },
    // === 新增页面缓存 ===
    '/': { swr: 3600 },                    // 首页缓存 1 小时
    '/en': { swr: 3600 },
    '/en/product-list/**': { swr: 3600 },   // 商品列表缓存 1 小时
    '/en/product/**': { swr: 86400 },       // 商品详情缓存 24 小时
    '/en/articles/**': { swr: 86400 },      // 文章详情缓存 24 小时
    '/en/seckill/**': { swr: 600 },         // 秒杀页缓存 10 分钟（数据变化快）
    // 静态资源缓存（已有）
    '/**/*.{js,css,svg,png,jpg,jpeg,webp}': {
      headers: { 'Cache-Control': 'max-age=31536000, immutable' },
    },
  },
},
```

> **注意：** 路由前缀 `/en/` 对应当前 i18n 策略 `prefix`。如果将来启用更多语言，需要为每个 locale 添加对应规则。登录相关页面（`/en/login`、`/en/user/**`）不缓存。

**预期收益：** 重复请求直接返回缓存，TTFB 从数百毫秒降至个位数毫秒。

---

### 2.7 修复 SSR 兼容性问题

**问题：** 多处代码在 SSR 上下文中直接访问浏览器 API，会导致 SSR 报错或 hydration 不匹配。

**涉及文件及操作：**

**`plugins/api.ts:71`** — localStorage 访问：

```ts
// 修改前
const refreshToken = localStorage.getItem('refresh-token')

// 修改后
const refreshToken = import.meta.client ? localStorage.getItem('refresh-token') : ''
```

**`stores/user.ts:42-43`** — localStorage 访问：

```ts
// setToken 方法中，已有 import.meta.client 判断，但建议确认所有路径都覆盖
```

**`pages/product/[id].vue`** — `window.location.reload()`：

```ts
// 修改前
watch(() => route.fullPath, () => window.location.reload())

// 修改后
watch(() => route.fullPath, () => {
  if (import.meta.client) window.location.reload()
})
```

**预期收益：** SSR 模式下不再报错，hydration 正常，SSR 输出的 HTML 与客户端一致。

---

## 阶段三：P2 — 中优先级（完善 SEO 体系）

### 3.1 补充结构化数据（JSON-LD）

**问题：** 当前只有 Product、BreadcrumbList、Organization 三种 schema。

**涉及文件：** `composables/useSEO.ts`

**操作：** 在 `meta` computed 中扩展：

**添加 Article schema（文章详情页）：**

```ts
if (options.type === 'article') {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title.value,
    description: description.value,
    image: image.value,
    datePublished: options.publishedTime,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName, logo: { '@type': 'ImageObject', url: siteLogo } },
  }
  baseMeta.push({ type: 'application/ld+json', innerHTML: JSON.stringify(articleSchema) })
}
```

**添加 AggregatedRating（商品评价汇总）：**

```ts
// 在 Product schema 的 offers 同级添加
if (options.reviewCount && options.reviewRating) {
  productSchema.aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: options.reviewRating,
    reviewCount: options.reviewCount,
    bestRating: 5,
  }
}
```

**添加 WebSite + SearchAction（首页）：**

```ts
if (options.type === 'website' || !options.type) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: organizationUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${organizationUrl}/en/product-list?keyword={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
  baseMeta.push({ type: 'application/ld+json', innerHTML: JSON.stringify(websiteSchema) })
}
```

**SEOOptions 接口扩展：**

```ts
interface SEOOptions {
  // ... 现有字段
  publishedTime?: string      // 文章发布时间
  reviewCount?: number        // 评价数量
  reviewRating?: number       // 平均评分
}
```

**预期收益：** Google 搜索结果展示富文本（星标评分、文章摘要、站内搜索框）。

---

### 3.2 Sitemap 补充静态页面

**问题：** Sitemap 只包含动态商品/文章 URL，缺少首页、列表页、促销页。

**涉及文件：** `nuxt.config.ts`（sitemap.urls 函数）

**操作：**

```ts
urls: async () => {
  // ... 现有的动态 URL 获取逻辑 ...

  // 静态页面
  const staticRoutes = [
    { loc: '/en', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
    { loc: '/en/product-list', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.9 },
    { loc: '/en/articles', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
    { loc: '/en/seckill', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.7 },
    { loc: '/en/combination', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.7 },
    { loc: '/en/coupon', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.6 },
  ]

  return [
    ...staticRoutes,
    ...generateRoutes('product', productIds),
    ...generateRoutes('articles', articleIds),
  ]
}
```

同时修改 `generateRoutes` 中的 priority：

```ts
const generateRoutes = (type: string, ids: number[]) =>
  ids.flatMap(id =>
    locales.map(locale => ({
      loc: `/${locale}/${type}/${id}`,
      lastmod: new Date().toISOString(),
      changefreq: type === 'product' ? 'weekly' : 'monthly',
      priority: type === 'product' ? 0.8 : 0.6,  // 不再全部为 1
    })),
  )
```

**预期收益：** 搜索引擎完整发现和收录所有页面。

---

### 3.3 `app.vue` OG 标签补全

**问题：** `app.vue` 中 `useSeoMeta` 的 description/ogDescription/ogImage/twitterCard 被注释。

**涉及文件：** `app.vue`

**操作：**

```ts
useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: t('seo.home.description'),
  ogDescription: t('seo.home.description'),
  ogImage: defaultOgImage,
  twitterCard: 'summary_large_image',
})
```

> 此处作为兜底 fallback，各页面通过 `useSEO` 覆盖。

**预期收益：** 社交媒体分享时始终有完整的 OG 信息。

---

### 3.4 `useSEO` 修复响应式问题

**问题：** `useHead` 传入 `.value`（已解包），数据变化时 meta 不会更新。

**涉及文件：** `composables/useSEO.ts`

**操作：**

```ts
// 修改前（非响应式）
useHead({
  title: title.value,
  link: [
    { rel: 'canonical', href: canonical.value },
    ...alternateLinks.value,
  ],
  meta: meta.value,
})

// 修改后（响应式）
useHead({
  title: () => title.value,
  link: () => [
    { rel: 'canonical', href: canonical.value },
    ...alternateLinks.value,
  ],
  meta: () => meta.value,
})
```

> 或者直接传入 computed ref，Nuxt 的 `useHead` 支持 ref 类型。

**预期收益：** 动态页面的 meta 标签随数据加载正确更新。

---

### 3.5 补全缺失页面的 SEO 调用

**问题：** `pages/bargin/[id].vue` 完全没有 SEO 调用；`pages/login/index.vue`、`pages/forgetPassword/index.vue` 仅使用裸 `useHead`。

**涉及文件：**

| 文件 | 操作 |
|---|---|
| `pages/bargin/[id].vue` | 添加 `useSEO({ routeKey: 'bargin', type: 'product', product: data })` |
| `pages/bargin/index.vue` | 将 `useHead` 改为 `useSEO` |
| `pages/login/index.vue` | 添加 `useSEO({ noIndex: true })` |
| `pages/forgetPassword/index.vue` | 添加 `useSEO({ noIndex: true })` |

同时在 `config/seo.config.ts` 的 `customRoutes` 中补充砍价路由配置。

**预期收益：** 全站 SEO 信息完整覆盖。

---

### 3.6 添加 preconnect / dns-prefetch

**问题：** 没有对关键外部资源做预连接。

**涉及文件：** `nuxt.config.ts`

**操作：** 在 `app.head.link` 中添加：

```ts
app: {
  head: {
    // ... 现有配置
    link: [
      { rel: 'preconnect', href: 'https://api.iswink.com' },
      { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    ],
  },
},
```

> 生产环境的 API 域名从 `.env.production` 读取，也可改为动态引用 `process.env.NUXT_API_TARGET_URL`。

**预期收益：** 减少第三方资源连接时间 50-200ms。

---

### 3.7 robots.txt 补全 disallow 路径

**涉及文件：** `nuxt.config.ts`

**操作：**

```ts
robots: {
  userAgent: '*',
  allow: '/',
  disallow: ['/admin', '/components', '/user', '/login', '/checkout', '/cart', '/forgetPassword'],
  sitemap: `${process.env.DOMAIN_URL}/sitemap.xml`,
},
```

**预期收益：** 阻止搜索引擎抓取无价值的结算/登录流程页面。

---

## 阶段四：P3 — 低优先级（锦上添花）

### 4.1 启用构建分析

**问题：** `nuxt.config.ts` 中 build.analyze 被注释，无法定位 bundle 瓶颈。

**操作：** 开发时临时启用：

```ts
build: {
  analyze: {
    filename: 'static.html',
  },
},
```

运行 `pnpm build:dev` 后查看 `.output/static.html`，定位大 chunk 并针对性优化。

---

### 4.2 移除冗余依赖

| 依赖 | 问题 | 操作 |
|---|---|---|
| `@nuxtjs/google-gtag` | 与 `nuxt-gtag` 重复，已弃用 | `pnpm remove @nuxtjs/google-gtag` |
| `app.vue` 中 `zh` locale | `import zh from 'element-plus/es/locale/lang/zh-cn'` 未使用 | 删除此 import |

---

### 4.3 评估移除一套 UI 库

**问题：** `element-plus` 和 `@nuxt/ui` 并存，增加大量 JS + CSS 体积。

**操作：**
1. 运行构建分析（4.1）量化两套库的体积占比
2. 排查哪些组件使用了 `@nuxt/ui`（如 `<UButton>`、`<UDropdown>` 等）
3. 将 `@nuxt/ui` 组件迁移到 Element Plus 对应组件，或反之
4. 移除不用的那套

> 这是一项较大的重构工作，建议独立分支执行。

---

### 4.4 图标字体 → SVG 统一

**问题：** `assets/css/fonts/iconfont.css` 内嵌 58KB+ base64 字体，与 `@nuxt/icon` SVG 模式重复。

**操作：**
1. 排查 `iconfont` 中实际使用的图标名称
2. 将这些图标转为 SVG 文件放入 `assets/icons/`
3. 替换模板中的 `<i class="iconfont icon-xxx">` 为 `<Icon name="icon-xxx" />`
4. 移除 `iconfont.css` 引用

---

### 4.5 Swiper 懒加载

**问题：** 7 个文件同步引入 Swiper，非首屏 Swiper 组件应懒加载。

**涉及文件：** 所有使用 `<AppSwiper>` 的非首屏组件

**操作：** 使用 Nuxt 的 `Lazy` 前缀：

```vue
<!-- 修改前 -->
<AppSwiper :items="banners" />

<!-- 修改后（非首屏） -->
<LazyAppSwiper :items="banners" />
```

---

### 4.6 `useAPI` 添加默认缓存策略

**涉及文件：** `composables/useAPI.ts`

**操作：**

```ts
export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const nuxtApp = useNuxtApp()
  return useFetch(url, {
    ...options,
    server: true,
    $fetch: nuxtApp.$api,
    dedupe: options?.dedupe || 'defer',  // 默认去重
  })
}
```

---

### 4.7 修复 `<noscript>` 中文问题

**涉及文件：** `layouts/default.vue:9-11`

**操作：**

```html
<!-- 修改前 -->
<noscript>我们发现此浏览器中的 JavaScript 已停用。请启用 JavaScript 或切换至受支持的浏览器。</noscript>

<!-- 修改后 -->
<noscript>JavaScript is disabled in your browser. Please enable JavaScript or switch to a supported browser.</noscript>
```

---

### 4.8 移除 `app.vue` 内联 SVG

**问题：** `app.vue:53-59` 在每个页面的 `<body>` 中内联了 SVG sprite（~2KB），用于圆角裁剪。增加首屏 DOM 大小。

**操作：** 将此 SVG 移入独立组件，按需加载；或通过 CSS `clip-path` / `border-radius` 替代。

---

## 执行建议

1. **阶段一** 可在 1-2 天内完成，无需改动大量文件，收益最大
2. **阶段二** 需要 3-5 天，建议逐项推进，每项完成后用 Lighthouse 对比前后分数
3. **阶段三** 需要 2-3 天，主要完善 SEO 体系，上线后需等待搜索引擎重新抓取
4. **阶段四** 可安排在迭代间隙逐步执行

**验证工具：**
- [PageSpeed Insights](https://pagespeed.web.dev/) — 跑分对比
- [Google Rich Results Test](https://search.google.com/test/rich-results) — 结构化数据验证
- [Google Search Console](https://search.google.com/search-console) — 索引覆盖率、Sitemap 状态
- `nuxt.config.ts` 中 `build.analyze` — bundle 体积分析
