# SEO & GEO 开发规范

> **强制等级**：本文档所有 **MUST**（必须）条款为硬约束，违反不得提交；**SHOULD**（应该）条款为强建议；**MAY**（可以）为可选。
> **优先级**：SEO 为本项目最高优先级。当 SEO 要求与功能/进度冲突时，**优先 SEO**，并向产品/需求方说明冲突。
> **适用范围**：所有涉及页面、数据、SEO、i18n、性能的前端开发与改动。
> **关系**：本文档是 `CLAUDE.md` 强制约束的具体展开；具体历史问题见 `docs/ISSUES.md`；优化排期见 `OPTIMIZATION_PLAN.md`。

---

## 目录

1. [核心原则](#1-核心原则)
2. [技术 SEO 规范](#2-技术-seo-规范)
3. [结构化数据规范（JSON-LD）](#3-结构化数据规范json-ld)
4. [Generative Engine Optimization（AI 引擎）](#4-generative-engine-optimizationai-引擎)
5. [地理位置优化（Geo-targeting）](#5-地理位置优化geo-targeting)
6. [性能与 Core Web Vitals](#6-性能与-core-web-vitals)
7. [后台数据 SEO 要求](#7-后台数据-seo-要求)
8. [开发流程规范（强制）](#8-开发流程规范强制)
9. [附录](#9-附录)

---

## 1. 核心原则

### 1.1 SEO 优先思维
每个页面/区块在动手写代码前，先回答三个问题：
- 这个页面的**核心关键词**是什么？用户会搜什么词来到这里？
- 搜索引擎/AI **如何理解**这个页面的主题？（靠 `<h1>`、title、结构化数据）
- 这个页面的**内容**是否值得被收录/引用？（不是空壳、不是机翻、不是聚合页）

### 1.2 SSR 优先
- **MUST**：所有可被搜索引擎收录的页面（首页、列表、详情、文章、活动），数据获取走 SSR（`useAPI` 默认 `server: true`）。
- **MUST**：禁止可收录页面使用纯 CSR（`onMounted` 里发请求渲染主要内容）。
- **MUST**：仅非收录页面（`/user/*`、`/login`、`/cart` 等 `noindex` 页面）可用客户端渲染。
- **原因**：爬虫不执行 JS 或执行延迟，CSR 内容抓不到 → SEO 失效。

### 1.3 语义化 HTML
- **MUST**：每个页面**有且仅有一个 `<h1>`**，与 `useSEO` 的 title 呼应。
- **MUST**：heading 层级递进，不跳级（h1 → h2 → h3），不用 heading 控制字号（字号用 CSS）。
- **MUST**：导航用 `<nav>`、页脚用 `<footer>`、主要内容用 `<main>`、独立内容块用 `<article>`/`<section>`。
- **MUST**：列表用 `<ul>`/`<ol>`，不用 `<div>` 模拟列表。

### 1.4 性能即 SEO
- **MUST**：Core Web Vitals 红线：LCP < 2.5s、CLS < 0.1、INP < 200ms。详见 §6。
- **原因**：Google 已将 CWV 纳入排名信号。

---

## 2. 技术 SEO 规范

### 2.1 URL 与路由规范
- **MUST**：i18n 策略为 `prefix`（如 `/en/product/123`），URL 必须包含语言前缀。
- **MUST**：所有内部跳转用 `$path()` composable（自动加语言前缀），禁止手拼 URL。
  ```ts
  // ✅ 正确
  router.push($path(`/product/${id}`))
  // ❌ 错误（缺语言前缀，hreflang 失效）
  router.push(`/product/${id}`)
  ```
- **MUST**：canonical 由 `useSEO` 自动生成（`${domain}${route.path}`），页面无需手写。
- **MUST**：404 必须**返回真实 404 状态码**，禁止软重定向到首页（当前 `redirect-404-to-home.global.ts` 违反，见 ISSUES S-02）。
- **MUST**：301（永久）/302（临时）重定向只在 `nuxt.config.ts` 的 nitro.routeRules 或服务端配置，不在前端硬编码。

### 2.2 Meta 标签规范
- **MUST**：所有可收录页面**必须调用 `useSEO()`**，禁止裸用 `useHead`/`useSeoMeta` 写 title/description。
- **MUST**：title 长度 50-60 字符（中文 30 字以内），含核心关键词，品牌名放末尾。
- **MUST**：description 长度 150-160 字符，自然语言通顺句，含核心关键词，禁止关键词堆砌。
- **MUST**：keywords 现代搜索引擎已基本忽略，仅作为冗余信号，3-5 个即可，勿堆砌。
- **MUST**：`app.vue` 顶层必须有兜底 meta（当前 description/ogImage 被注释，见 ISSUES S-04）。

### 2.3 robots.txt / sitemap.xml 规范
- **MUST**：`noindex` 页面（用户中心、登录、购物车、结算）通过 `seoConfig.noIndexRoutes` 统一管理，自动加 `noindex, nofollow`。
- **MUST**：新增"不收录"路由时，同步更新 `config/seo.config.ts` 的 `noIndexRoutes` 和 `nuxt.config.ts` 的 `robots.disallow` + `sitemap.exclude`（三处必须一致）。
- **MUST**：sitemap 动态接口（商品/文章 ID）必须返回有效数据，接口异常时 catch 返回空数组（当前已实现）。
- **SHOULD**：sitemap 的 `changefreq`/`priority` 按 `seoConfig.customRoutes` 配置，首页 1.0/daily，详情页 0.8/weekly。

### 2.4 `<h1>` 规范（重申）
- **MUST**：每页**唯一** `<h1>`。
- **MUST**：`<h1>` 内容 = 页面主题，含核心关键词，与 `useSEO` 的 title 文案呼应（不必完全相同）。
- **MUST**：当 `<h1>` 文案不适合视觉展示时，用 `sr-only` 类隐藏（视觉隐藏但 SEO 可读），**禁止用 `display:none`**（搜索引擎可能忽略）。
  ```html
  <h1 class="sr-only">Surprise Gifts for Love | iswink</h1>
  ```
- **MUST**：区块标题用 `<h2>`，区块内子标题用 `<h3>`，不跳级。

### 2.5 图片 SEO
- **MUST**：所有 `<NuxtImg>`/`<AppImage>` **必须有 `alt` 属性**，描述图片内容（不是文件名）。
  ```html
  <!-- ✅ 正确 -->
  <NuxtImg :src="p.picUrl" :alt="p.name" preset="product" />
  <!-- ❌ 错误（alt 空） -->
  <NuxtImg :src="p.picUrl" alt="" />
  <!-- ❌ 错误（alt 是文件名） -->
  <NuxtImg :src="p.picUrl" alt="gift3-3.webp" />
  ```
- **MUST**：商品图 alt 用商品名（`p.name`），分类图 alt 用分类名，Banner 图 alt 用 Banner 标题。
- **MUST**：必须声明 `width`/`height`（或通过 preset 隐式声明），防止 CLS（见 §6.2）。
- **MUST**：使用 `preset` 指定尺寸档位（avatar/thumbnail/product/banner），统一 webp 格式。
- **MUST**：非首屏图用 `loading="lazy"`；首屏 LCP 图用 `loading="eager"` + `fetchpriority="high"`（见 §6.1）。
- **MUST**：装饰性图片（无信息）用空 alt（`alt=""`）而非省略，明确告知搜索引擎"这是装饰"。
- **SHOULD**：优先用 `NuxtImg`（自动优化/压缩/格式转换）而非 `AppImage`（基于 el-image，无优化）。

---

## 3. 结构化数据规范（JSON-LD）

### 3.1 Schema 类型选择
- **MUST**：结构化数据统一通过 `useSEO` 注入，**禁止在模板里手写 `<script type="application/ld+json">`**。
- **MUST**：按页面类型选择 schema：

| 页面类型 | routeKey | schema | 触发字段 |
|---|---|---|---|
| 商品详情 | `productDetail` | Product | `type: 'product'` + `product` |
| 文章详情 | `articleDetail` | Article | `type: 'article'` |
| 文章详情 | `articleDetail` | FAQPage | `faqs` 字段（待扩展） |
| 全站 | - | Organization | `type: 'website'`（首页） |
| 全站 | - | WebSite | 待补 |
| 所有页面 | - | BreadcrumbList | `breadcrumbs` 字段 |
| 首页 | `home` | Organization | 自动 |

### 3.2 Product schema 完整性
- **MUST**：商品详情页 Product schema 必须包含：
  - `name`、`description`、`image`、`brand`（✅ 当前已实现）
  - `offers`（price/currency/availability/url）（✅ 当前已实现）
  - `aggregateRating`（reviewCount + reviewRating）❌ **当前缺失，见 ISSUES S-05**
- **MUST**：`useSEO` 扩展 `reviewCount`/`reviewRating` 入参，Product schema 补 aggregateRating。
- **原因**：aggregateRating 是 AI 引擎引用率最高的字段之一（见 §4.2）。

### 3.3 验证
- **MUST**：新增/修改 schema 后，用 Google [Rich Results Test](https://search.google.com/test/rich-results) 验证，确认无错误/警告。

---

## 4. Generative Engine Optimization（AI 引擎）

> 本章针对 ChatGPT、Perplexity、Google AI Overviews、Bing Copilot 等 AI 搜索引擎的优化（GEO 的新兴含义）。

### 4.1 AI 引擎抓取原理
AI 引擎引用你的内容取决于三个条件：
1. **可抓取性**：内容必须在 SSR HTML 里（非 JS 渲染），AI 才能读到（→ §1.2 SSR 优先）
2. **语义清晰度**：内容用语义化 HTML + 结构化数据表达（→ §1.3 + §3）
3. **权威信号**：E-E-A-T（经验/专业/权威/可信）（→ §4.4）

### 4.2 内容可引用性规范
- **MUST**：关键事实/数据用**明确的陈述句**，避免纯营销话术。
  ```html
  <!-- ✅ AI 易引用（事实+数据） -->
  <p>iswink offers free worldwide shipping on orders over $50, with delivery in 7-15 business days.</p>
  <!-- ❌ AI 不引用（空话） -->
  <p>The best gifts for your loved ones, shop now!</p>
  ```
- **MUST**：关键信息放在 `<p>`/`<article>`/`<section>` 里，**不藏在图片、Canvas、JS 渲染**中。
- **MUST**：FAQ 类内容优先用 **FAQPage schema**（AI 引擎引用率最高的类型）。
- **MUST**：商品评分/评价数据喂给 **aggregateRating**（见 §3.2）。
- **SHOULD**：在内容中明确"定义"概念（如 "Surprise gifts are ..."），AI 倾向引用定义性表述。

### 4.3 llms.txt / ai.txt 规范
- **MUST**：`public/llms.txt` 必须存在（当前缺失，见 ISSUES S-08）。
- **MUST**：llms.txt 内容描述站点核心结构、核心内容、联系方式，格式参考 [llmstxt.org](https://llmstxt.org/)。
- **SHOULD**：新增重要内容板块时，同步更新 llms.txt。

### 4.4 E-E-A-T 信号
- **Experience（经验）**：文章标注作者（`Article.author`，当前文章 schema 已有）。
- **Expertise（专业）**：About/FAQ 页面展示专业背景。
- **Authoritativeness（权威）**：外链到权威来源、被权威站引用。
- **Trustworthiness（可信）**：联系信息、退换货政策、隐私政策页面齐全且可被抓取。

### 4.5 内容唯一性与原创性
- **MUST**：禁止生成低质聚合页（只有商品列表无原创内容），Google 会判为 "thin content" 降权。
- **MUST**：文章内容必须原创，禁止机翻堆砌（多语言扩展时尤其注意，见 §5.2）。
- **MUST**：每个页面必须有**独特**的 title/description，禁止全站统一文案。

---

## 5. 地理位置优化（Geo-targeting）

> 本章针对多地区/多语言本地化 SEO（GEO 的传统含义）。

### 5.1 hreflang 规范
- **MUST**：hreflang 由 `useSEO` 自动生成（基于 `i18n.locales`），页面无需手写。
- **MUST**：hreflang 必须**双向自引用**（每个语言版本都引用自己 + 其他语言版本），当前实现已满足。
- **MUST**：必须包含 **`x-default`** 指向默认语言首页 ❌ **当前缺失，见 ISSUES I-02**。
- **MUST**：语言码用 ISO 格式（`en-US`、`zh-CN`），不用裸 `en`/`zh`。
- **MUST**：hreflang URL 必须是**绝对路径**（含 domain），当前用 `${domain}${route.path}` 拼接 ✅。
- **MUST**：i18n.baseUrl 必须正确（当前疑似 `DOMAIN_URl` 拼写错误，见 ISSUES S-03）。

### 5.2 多语言内容策略
- **MUST**：多语言是**本地化**不是**机翻**。每个语言版本要针对该地区用户调整：
  - 关键词本地化（如 "礼物" 在英文是 "gifts"，但美国更搜 "gift ideas"，英国搜 "present ideas"）
  - 货币、日期格式、度量衡本地化
  - 文化适配（节日、习俗）
- **MUST**：每个语言版本的 title/description/keywords 独立配置（i18n 文案 key），不共享一套文案。
- **SHOULD**：启用新语言前，先准备该语言的 `locales/*.ts` 文案文件。

### 5.3 地区结构化数据
- **MUST**：Organization schema 可扩展 `areaServed` 字段声明服务地区。
- **SHOULD**：若有实体店/仓库，补 `LocalBusiness` schema。

### 5.4 URL 策略
- **现状**：采用 `prefix` 策略（`/en/...`），子目录方式。
- **MUST**：保持 `prefix` 策略，不混用子域名/参数。
- **SHOULD**：未来若服务多国家，可考虑 ccTLD（如 `iswink.co.uk`）或按地区分 prefix（`/en-us/`、`/en-gb/`）。

### 5.5 新增语言检查清单
启用新语言时**逐项检查**：
- [ ] `nuxt.config.ts` 的 `i18n.locales` 新增该语言配置（code/iso/language）
- [ ] `locales/` 新增该语言文案文件
- [ ] `dayjs.locales` 新增该语言
- [ ] 该语言的 SEO 文案（title/description/keywords）本地化，非机翻
- [ ] hreflang 自动包含新语言（验证：view-source 检查 alternate 链接）
- [ ] sitemap 自动包含新语言路由
- [ ] Google Search Console 新增该语言版本属性
- [ ] 用 [hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/) 验证

---

## 6. 性能与 Core Web Vitals

### 6.1 LCP < 2.5s
- **MUST**：首屏 LCP 元素（通常是 Banner/主图）必须：
  - `loading="eager"`（非 lazy）
  - `fetchpriority="high"`
  - 声明 `width`/`height`
  - 用 webp 格式（NuxtImg preset 自动）
- **MUST**：首屏关键 CSS 内联，非关键 CSS 延迟加载。
- **SHOULD**：预连接关键域名（图片 CDN、API）。
  ```html
  <link rel="preconnect" href="https://api.iswink.com" />
  ```

### 6.2 CLS < 0.1
- **MUST**：所有 `<NuxtImg>`/`<AppImage>`/`<img>` **必须声明 width/height**（或通过 preset）。
- **MUST**：广告位、嵌入式内容（iframe/embed）预留占位空间。
- **MUST**：动态注入的内容（如懒加载列表）用 `min-height` 占位，防跳动。
- **MUST**：字体加载用 `font-display: swap`（当前 `common.scss` 已注释，建议启用）。

### 6.3 INP < 200ms
- **SHOULD**：长任务（>50ms）拆分，用 `requestIdleCallback` 延迟非关键计算。
- **SHOULD**：避免主线程阻塞，重计算用 Web Worker 或 `useAsyncData`/`lazy`。
- **SHOULD**：事件处理函数保持轻量，重逻辑放 `useAsyncData`/`composable`。

### 6.4 SSR / 缓存
- **MUST**：可收录页面数据走 SSR（`useAPI` 默认 `server: true`）。
- **SHOULD**：高频访问页（首页/列表/详情）配置 SWR 缓存：
  ```ts
  // nuxt.config.ts → nitro.routeRules
  '/en/product/**': { swr: 3600 }, // 1 小时 stale-while-revalidate
  '/': { swr: 3600 },
  ```
  当前未配置（见 ISSUES S-07），按需启用。
- **MUST**：`useAPI` 的 `server: true` 注释已说明用途，禁止随意改为 `false`（会破坏 SSR SEO）。

---

## 7. 后台数据 SEO 要求

> 本章约束**数据录入**质量。代码再规范，数据质量差 SEO 也废。本节数据由开发自行维护，故同时讲"怎么填"和"前端怎么消费"。

### 7.1 数据 SEO 总则
- **核心原则**：**内容质量 > 技术优化**。再好的代码救不了空 alt、机翻描述、占位文案。
- **MUST**：录入任何会被 SEO 消费的数据前，对照本节字段表填写。
- **MUST**：录入后跑 §7.7 自检清单。

### 7.2 商品数据字段要求

| 字段 | 用途（喂给） | 要求 | 示例 | 反例 |
|---|---|---|---|---|
| `name` | `<h1>`/title/Product.name | 含核心关键词，≤60 字符，禁堆砌，英文首字母大写 | "Personalized Star Map Night Light" | "新品"、"product001" |
| `introduction` | meta description | 150-160 字符，自然语言，含关键词 | "Custom star map night light showing the stars on your special date. Perfect anniversary gift." | "很好用的礼物" |
| `description` | Product.description/正文 | 结构化（段落/列表），≥300 字符，原创 | （富文本，含材质/尺寸/用法） | 纯图片无文字 |
| `picUrl` | Product.image/og:image | 高清、方图、背景干净 | - | 模糊图、带水印 |
| 图片 alt | 图片 SEO | = 商品名 | alt="Personalized Star Map" | alt=""、alt="img123" |
| `price`/`marketPrice` | Product.offers.price | 真实价格（单位分），marketPrice ≥ price | - | price=0、虚构原价 |
| 评价（reviewCount/reviewRating） | aggregateRating ❌当前缺 | 真实评价数据，喂给 schema | - | 无评价数据 |
| `categoryName` | 面包屑/关键词 | 准确分类名 | "Custom Gifts" | "其他" |
| `brandName` | Product.brand | 品牌 | "iswink" | 空 |

### 7.3 文章数据字段要求

| 字段 | 用途 | 要求 |
|---|---|---|
| `title` | `<h1>`/Article.name | 含关键词，≤60 字符 |
| `introduction` | meta description/Article.description | 150-160 字符摘要 |
| `content` | Article 正文 | 语义化 HTML，原创，≥300 字，首段含关键词 |
| `keyWords` | meta keywords | 逗号分隔，3-5 个，本地化 |
| `picUrl` | og:image/Article.image | 高清封面 |
| `author` | Article.author | 真实作者名（E-E-A-T） |
| `createTime` | Article.datePublished | ISO 格式时间 |

### 7.4 Banner / 运营位字段要求

| 字段 | 用途 | 要求 |
|---|---|---|
| `title` | 图片 alt | Banner 主题文案 |
| `picUrl` | 首屏 LCP 图 | 高清、声明尺寸（见 §6.1） |
| 跳转 url | 内链 | 用 `$path()`，可收录目标页 |

### 7.5 分类 / 品牌 / 站点信息字段要求

- **分类**：`name`（准确、含关键词）、`description`（分类页 description 来源）、`picUrl`（有 alt）
- **品牌**：`name`（品牌名）、`logo`（高清、方形）
- **站点信息**（`config/seo.config.ts`）：`defaultTitle`/`defaultDescription`/`defaultKeywords` 必须针对核心业务填写，不可空。

### 7.6 数据缺失时的前端降级策略
代码不能因为数据缺失就裸奔，必须有兜底链路：

```ts
// ✅ alt 兜底：商品图 alt 缺失 → 用商品名
<NuxtImg :src="p.picUrl" :alt="p.alt || p.name" />

// ✅ description 兜底：商品描述缺失 → 用 introduction 截断
const desc = product.description || product.introduction?.slice(0, 160) || defaultDescription

// ✅ title 兜底：商品名缺失 → 用分类 + 品牌
const title = product.name || `${product.categoryName} - ${product.brandName}`
```

- **MUST**：所有从后台取的 SEO 消费字段，前端必须有兜底值，禁止直接渲染 `undefined`/空字符串。
- **MUST**：图片 alt 兜底链路：`alt` 字段 → 商品名/分类名 → 默认描述（不允许空 alt，除非是装饰图）。

### 7.7 数据质量自检清单
录入数据后逐项检查：
- [ ] 商品/文章有 name（非"新品"/"test"），含核心关键词
- [ ] description/introduction 非"占位文案"，长度合规
- [ ] 所有图片有 alt（= 商品名/文章标题，非文件名）
- [ ] 价格真实，marketPrice ≥ price
- [ ] 文章内容原创、≥300 字、非机翻
- [ ] 富文本内容是语义化 HTML（h2/h3/p/ul），非纯图片
- [ ] 用 [Rich Results Test](https://search.google.com/test/rich-results) 验证页面结构化数据无错误

---

## 8. 开发流程规范（强制）

### 8.1 新建页面 SEO 检查清单（10 项 must-do）
每个新建的可收录页面，提交前**逐项打勾**：

- [ ] **调用 `useSEO()`**，传 `routeKey`（并在 `seo.config.ts` 的 `customRoutes` 注册）
- [ ] **唯一 `<h1>`**，含核心关键词，与 title 呼应（视觉隐藏用 `sr-only`）
- [ ] **heading 层级**正确（h1→h2→h3，不跳级）
- [ ] **数据走 SSR**（`useAPI`，`server: true`），首屏内容不在 `onMounted` 里取
- [ ] **面包屑**（`breadcrumbs` 字段）传入 useSEO
- [ ] **所有图片有 alt**（= 商品名/标题），声明 width/height
- [ ] **LCP 图** `eager` + `fetchpriority="high"`
- [ ] **schema 类型**正确（商品用 product、文章用 article）
- [ ] **内部跳转**用 `$path()`
- [ ] **noindex 路由**（如适用）已加入 `seoConfig.noIndexRoutes` + robots + sitemap 三处

### 8.2 useSEO 调用模板（按页面类型）

**首页**：
```ts
useSEO({
  routeKey: 'home',
  breadcrumbs: [{ name: 'Home', url: domain }],
})
```

**商品详情**（字段最全）：
```ts
useSEO({
  routeKey: 'productDetail',
  product: productData.value,
  type: 'product',
  price: curSku.value?.price,
  currency,
  availability: curSku.value?.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  brand: info.value?.brandName,
  image: info.value?.picUrl,
  breadcrumbs: [
    { name: 'Home', url: domain },
    { name: info.value?.categoryName, url: `${domain}${$path('/product-list')}` },
    { name: info.value?.name, url: `${domain}${route.path}` },
  ],
})
```

**文章详情**：
```ts
useSEO({
  routeKey: 'articleDetail',
  title: info.value?.title,
  description: info.value?.introduction,
  keywords: info.value?.keyWords?.split(',') || [],
  image: info.value?.picUrl,
  type: 'article',
  breadcrumbs: [...],
})
```

**列表/活动页**：见 `pages/product-list/index.vue`、`pages/seckill/index.vue` 等现有实现。

> **MUST**：先声明响应式变量，**后调用 `useSEO`**（避免 TDZ，见 ISSUES S-06）。

### 8.3 PR / Code Review SEO 检查项
Review 涉及页面/SEO/数据的 PR 时，检查：
- [ ] 是否调用 `useSEO`（非裸 `useHead`）
- [ ] 是否有唯一 `<h1>`
- [ ] 图片是否有 alt + 尺寸
- [ ] 是否破坏 SSR（`server: false`、`onMounted` 取数）
- [ ] schema 是否完整（商品有 aggregateRating 吗）
- [ ] 内部链接是否用 `$path()`
- [ ] noindex 路由三处是否同步

### 8.4 上线前 SEO 验收清单 + 工具
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) — 验证结构化数据
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) — 验证 CWV（LCP/CLS/INP）
- [ ] [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) — 验证移动端友好
- [ ] View Source — 验证 SSR HTML 包含核心内容（非空壳）
- [ ] hreflang 检查 — 验证 alternate 链接正确（含 x-default）
- [ ] Google Search Console — 检查收录状态、手动操作警告

---

## 9. 附录

### A. useSEO 完整参数表

| 字段 | 类型 | 说明 |
|---|---|---|
| `routeKey` | `string` | 匹配 `seoConfig.customRoutes` 的 key，取 i18n title/description/keywords |
| `title` | `string` | 显式 title，覆盖 routeKey 配置 |
| `description` | `string` | 显式 description |
| `keywords` | `string[]` | 显式关键词 |
| `image` | `string` | og:image/Article.image |
| `type` | `'website'\|'product'\|'article'` | 决定 schema 类型 |
| `price` | `number` | Product.offers.price |
| `currency` | `string` | 默认 `$` |
| `availability` | `string` | schema.org URL |
| `brand` | `string` | Product.brand.name |
| `category` | `string` | Product.category |
| `breadcrumbs` | `Array<{name, url}>` | BreadcrumbList schema |
| `noIndex` | `boolean` | 手动 noindex（通常走 noIndexRoutes 自动） |
| `canonical` | `string` | 显式 canonical（通常自动） |
| `product` | `Product` | 商品对象（含 name/introduction/picUrl 等） |
| `categoryData` | `Category` | 分类对象 |
| `searchQuery` | `string` | 搜索关键词（列表页用） |
| `reviewCount` ⏳ | `number` | **待扩展**：aggregateRating 用 |
| `reviewRating` ⏳ | `number` | **待扩展**：aggregateRating 用 |
| `faqs` ⏳ | `Array<{q,a}>` | **待扩展**：FAQPage schema |

> ⏳ 标记的字段需在 `useSEO.ts` 扩展后启用（对应 ISSUES S-05、S-09）。

### B. 各页面 SEO 配置速查表

| 页面 | routeKey | schema | 必传字段 | 备注 |
|---|---|---|---|---|
| 首页 `/` | home | Organization | breadcrumbs | 需补 `<h1>` |
| 商品列表 `/product-list` | productList | - | categoryData/searchQuery | 修 TDZ（S-06） |
| 商品详情 `/product/[id]` | productDetail | Product | product/price/currency/availability/brand/breadcrumbs | 需补 aggregateRating |
| 文章列表 `/articles` | articleList | - | breadcrumbs | - |
| 文章详情 `/articles/[id]` | articleDetail | Article | title/description/keywords/image/breadcrumbs | 需补 FAQ |
| 秒杀 `/seckill` | seckill | - | breadcrumbs | - |
| 拼团 `/combination` | combination | - | breadcrumbs | - |
| 优惠券 `/coupon` | coupon | - | breadcrumbs | - |
| 用户中心 `/user/*` | - | - | noIndex（自动） | - |
| 登录 `/login` | - | - | noIndex（自动） | - |

### C. 反模式清单（从 ISSUES 提炼）

- ❌ 裸用 `useHead`/`useSeoMeta` 写 SEO，不用 `useSEO`
- ❌ 页面无 `<h1>` 或多个 `<h1>`
- ❌ 图片 `alt` 空 / 用文件名 / 缺 width/height
- ❌ 可收录页面用 CSR（`onMounted` 取数）
- ❌ 内部跳转手拼 URL，不用 `$path()`
- ❌ 商品 schema 缺 aggregateRating
- ❌ 404 软重定向首页（soft 404）
- ❌ 内联手写 `<script type="application/ld+json">`，不走 useSEO
- ❌ 用 heading 标签控制字号（应用 CSS）
- ❌ 多语言用机翻、文案全站统一不本地化
- ❌ 录入数据用占位文案（"新品"、"test"、机翻描述）
- ❌ 前端无降级兜底（数据缺失直接渲染 undefined）

### D. 验证工具与官方文档

| 工具/文档 | 用途 |
|---|---|
| [Google Rich Results Test](https://search.google.com/test/rich-results) | 验证结构化数据 |
| [PageSpeed Insights](https://pagespeed.web.dev/) | 验证 Core Web Vitals |
| [Search Console](https://search.google.com/search-console) | 收录状态/排名/手动操作 |
| [Schema.org](https://schema.org/) | 结构化数据规范 |
| [llmstxt.org](https://llmstxt.org/) | llms.txt 规范 |
| [hreflang Tags Testing](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/) | hreflang 验证 |
| [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | 官方 SEO 指南 |
