# 首页及全局问题清单

> 本文档记录从首页及全局代码扫描中提炼的问题，按 **SEO 影响** 和 **改动成本** 双维度分级。
> 处理原则：**SEO 最高优先级** —— 凡影响搜索排名的问题优先处理。
> 处理流程：在 `OPTIMIZATION_PLAN.md` 中立项 → 在本表勾选状态 → 提交时遵守 `docs/SEO_GEO_GUIDELINES.md`。
>
> 状态图例：⬜ 待处理 / 🔄 处理中 / ✅ 已完成 / ⏭️ 暂不处理

---

## 一、SEO 类问题（最高优先级，影响搜索排名）

> 这类问题直接损害 Google 收录、AI 引擎引用、Core Web Vitals，**必须优先解决**。

### S-01 首页缺少 `<h1>` 标签 ⬜
- **位置**：`pages/index/index.vue` 全文无 `<h1>`
- **现状**：区块标题用 `<h2>`（AppSpecial/AppFeature），首页无唯一 `<h1>`
- **影响**：SEO P0 级缺陷。搜索引擎无法识别页面主题，排名信号缺失
- **规范引用**：`SEO_GEO_GUIDELINES.md` §2.4（每页唯一 `<h1>`，与 title 呼应）
- **修复方向**：首页新增 `<h1 class="sr-only">` 包含核心关键词（如 "Surprise Gifts for Love | iswink"），与 `useSEO` 的 title 呼应

### S-02 404 软重定向到首页 ⬜
- **位置**：`middleware/redirect-404-to-home.global.ts`
- **现状**：`to.matched.length === 0` 时 `navigateTo('/')`
- **影响**：soft 404。搜索引擎将"404 但返回首页"判为低质页，可能全站降权
- **规范引用**：`SEO_GEO_GUIDELINES.md` §2.1（404 必须返回真实 404 状态码）
- **修复方向**：渲染真实 `error.vue` 并返回 404 状态码，不重定向

### S-03 `DOMAIN_URl` 拼写错误（影响 hreflang）⬜
- **位置**：`nuxt.config.ts:180`（i18n.baseUrl 引用）
- **现状**：环境变量名疑似拼写错误，可能导致 hreflang 基础 URL 不正确
- **影响**：hreflang 失效 → 多语言版本不被搜索引擎正确关联
- **规范引用**：`SEO_GEO_GUIDELINES.md` §5.1（hreflang 双向自引用必须正确）
- **修复方向**：核对环境变量名，统一为 `DOMAIN_URL`

### S-04 `app.vue` 的 `useSeoMeta` description/ogImage 被注释 ⬜
- **位置**：`app.vue`（顶层兜底 SEO）
- **现状**：社交分享兜底 meta 缺失
- **影响**：社交平台分享时无兜底描述/图片，影响社交信号（间接影响 SEO）
- **规范引用**：`SEO_GEO_GUIDELINES.md` §2.2（meta 兜底策略）
- **修复方向**：取消注释，从 `seoConfig` 取默认值兜底

### S-05 商品详情缺 aggregateRating（AI 引擎引用核心）⬜
- **位置**：`pages/product/[id].vue` 的 Product schema
- **现状**：Product JSON-LD 只有 offers，无 aggregateRating
- **影响**：AI 引擎（ChatGPT/Perplexity/Google AI Overviews）极爱引用带评分的商品；缺评分降低被引用率
- **规范引用**：`SEO_GEO_GUIDELINES.md` §3.2 + §4.2（评分数据喂给 aggregateRating）
- **修复方向**：`useSEO` 扩展 `reviewCount`/`reviewRating`，Product schema 补 aggregateRating

### S-06 商品列表页 useSEO 变量 TDZ 隐患 ⬜
- **位置**：`pages/product-list/index.vue:25-39`
- **现状**：`useSEO` 引用 `curCat.value`/`keyword.value`，但这两个 ref 在 useSEO **之后**才声明（TDZ）
- **影响**：SEO meta 可能取到初始空值而非实际分类/关键词 → title/description 不准
- **规范引用**：`SEO_GEO_GUIDELINES.md` §7.3（先声明响应式变量，后调用 useSEO）
- **修复方向**：调整声明顺序，或改用 computed 派生

### S-07 无页面缓存（SWR），每次 SSR 全量渲染 ⬜
- **位置**：`nuxt.config.ts` nitro.routeRules
- **现状**：无 `swr` / `isr` 配置
- **影响**：TTFB 偏高，影响 Core Web Vitals；爬虫频繁触发 SSR 压力大
- **规范引用**：`SEO_GEO_GUIDELINES.md` §6.4（routeRules SWR 配置规范）
- **修复方向**：首页/列表/详情页加 `swr: 3600` 或 ISR

### S-08 缺少 `llms.txt` / `ai.txt`（AI 引擎可读性）⬜
- **位置**：`public/` 根目录
- **现状**：无 AI 引擎专用入口文件
- **影响**：部分 AI 引擎（2025 起）读取 llms.txt 获取站点结构，缺失降低 AI 可发现性
- **规范引用**：`SEO_GEO_GUIDELINES.md` §4.3（llms.txt 规范）
- **修复方向**：生成 `public/llms.txt`，描述站点核心内容与结构

### S-09 缺少 FAQ/HowTo 结构化数据（AI 引擎高引用率）⬜
- **位置**：首页/文章页
- **现状**：仅有 Product/Article/Organization/Breadcrumb schema，无 FAQPage/HowTo
- **影响**：FAQ 是 AI 引擎引用率最高的 schema 类型之一
- **规范引用**：`SEO_GEO_GUIDELINES.md` §3.1 + §4.2（FAQ/HowTo schema）
- **修复方向**：文章页/帮助页补 FAQ schema；`useSEO` 扩展 FAQ 入参

---

## 二、代码规范类问题（中等优先级，影响可维护性）

### C-01 AppExclusive 不用 `useAPI`（违反 API 规范）⬜
- **位置**：`pages/index/components/AppExclusive.vue:21`
- **现状**：裸 `useAsyncData` + `useNuxtApp().$api`，4 个区块里唯一不规范
- **影响**：API 调用方式不统一，SSR 一致性无保障
- **规范引用**：`CLAUDE.md` 风格基线（API 调用统一用 useAPI）
- **修复方向**：改用 `useAPI`

### C-02 AppExclusive `goDetail` 路径拼写错误 `/produtct/` ⬜
- **位置**：`pages/index/components/AppExclusive.vue:134`
- **现状**：`router.push($path('/produtct/...'))` 多了一个 `t`
- **影响**：秒杀类商品的点击跳转永远是 404 → 软重定向首页（叠加 S-02 问题）
- **修复方向**：改为 `/product/`

### C-03 AppExclusive `next()`/`prev()` 硬编码 3 次翻页 ⬜
- **位置**：`pages/index/components/AppExclusive.vue:112-128`
- **现状**：连调 3 次 `slideNext()` 实现"一次翻 3 格"，若数据不是 3 的倍数会越界
- **影响**：边界 bug，数据量变化时翻页错乱
- **修复方向**：用 `slidesPerGroup: 3` 配置或基于实际分组数计算

### C-04 `index.scss` 739 行栅格 modifier 重复严重 ⬜
- **位置**：`pages/index/index.scss`
- **现状**：每个 modifier × 5 个断点媒体查询，大量重复
- **影响**：布局改动成本极高，维护困难
- **修复方向**：迁移到全局 `site-grid.scss` 的通用 modifier 体系，或抽 mixin 复用

### C-05 区块标题样式三套不统一 ⬜
- **位置**：AppSpecial 用 `store-title`、AppExclusive 用 `exclusive-offers__header`、AppFeature 用 `feature-tab-title`
- **影响**：视觉不一致，后续统一改样式要改 3 处
- **修复方向**：抽公共 `<AppSectionTitle>` 组件 + 统一 BEM 类名

### C-06 骨架屏样式 4 处重复 ⬜
- **位置**：AppSwiper/AppFeature/AppSpecial/AppExclusive + index.vue 各写一遍 `@keyframes loading`
- **影响**：代码重复，样式不一致
- **修复方向**：抽公共 `<AppSkeleton>` 组件 + 全局 `.skeleton` 类

### C-07 `var.scss` 变量定义重复且冲突 ⬜
- **位置**：`assets/css/var.scss`
- **现状**：`--brand-orange: #ff6900` 与 `--primary-base: #ff6700`、`--background-primary` 同时存在，且部分变量重复定义（如 `--shadow-black-a30` 出现两次）
- **影响**：色彩体系不统一，改主题要改多处
- **修复方向**：统一为一套命名空间（如统一用 `--brand-*` 或 `--primary-*`），删除重复定义

### C-08 AppExclusive `goDetail` 入参无类型 ⬜
- **位置**：`pages/index/components/AppExclusive.vue:132` `function goDetail(item)`
- **现状**：`item` 无类型注解（违反 TypeScript 规范）
- **修复方向**：定义返回类型接口，`item: ExclusiveItem`

---

## 三、性能类问题（中等优先级，影响 Core Web Vitals）

### P-01 `app.vue` 每页注入内联 SVG sprite ⬜
- **位置**：`app.vue`
- **现状**：每个页面 `<body>` 注入 ~2KB SVG sprite（圆角裁剪用）
- **影响**：增加 DOM 节点，微小影响渲染
- **修复方向**：评估是否可用 CSS `clip-path` 替代，或抽成外部 SVG symbol 文件

### P-02 首屏图片未声明 fetchpriority ⬜
- **位置**：AppSwiper 首屏轮播图
- **现状**：用 `loading="lazy"`，无 `fetchpriority="high"`
- **影响**：LCP 元素加载优先级不够，影响 LCP 指标
- **规范引用**：`SEO_GEO_GUIDELINES.md` §6.1（LCP 图片 eager + fetchpriority high）
- **修复方向**：首屏 LCP 图 `loading="eager" fetchpriority="high"`，并声明尺寸

### P-03 图片尺寸声明不全（CLS 隐患）⬜
- **位置**：多处 `NuxtImg`/`AppImage` 未声明 width/height
- **现状**：部分图片无尺寸，加载后布局偏移
- **影响**：CLS 指标超标
- **规范引用**：`SEO_GEO_GUIDELINES.md` §6.2（所有图必须声明 width/height）
- **修复方向**：全局排查补全尺寸；`AppImage` 组件内置尺寸兜底

---

## 四、i18n / 多语言类问题（GEO 相关）

### I-01 仅启用 `en` 一种语言，但代码保留 14 种语言注释 ⬜
- **位置**：`nuxt.config.ts:186-306`
- **现状**：`locales` 数组只保留 `en`，其余 14 种全部注释
- **影响**：当前无多语言 → GEO（地理定位）能力未启用；未来扩展需重启配置
- **规范引用**：`SEO_GEO_GUIDELINES.md` §5（多语言扩展检查清单）
- **修复方向**：按业务需要逐步启用，每次启用跑 §5.5 检查清单

### I-02 hreflang `x-default` 缺失 ⬜
- **位置**：`composables/useSEO.ts:128-135`（alternateLinks）
- **现状**：生成 hreflang 列表但无 `x-default` 兜底
- **影响**：搜索引擎不知道默认语言版本
- **规范引用**：`SEO_GEO_GUIDELINES.md` §5.1（必须含 x-default）
- **修复方向**：alternateLinks 补 `x-default` 指向默认语言首页

---

## 五、响应式 / 多端兼容类问题

### R-01 响应式机制文档化缺失（已通过规范补齐）✅
- **位置**：全项目
- **现状**：项目存在 3 种响应式写法（双组件动态切换 / v-if 分支 / CSS 媒体查询），但无文档说明何时用哪种，易导致新代码风格混乱
- **处理**：已在 `CLAUDE.md` 约束 3 + 响应式开发规范中完整记录三种模式及选择决策
- **状态**：✅ 规范已建立，后续开发遵守

### R-02 SSR 阶段 deviceType 为空，动态组件首屏不渲染 ⬜
- **位置**：`pages/product/[id].vue:388` 等用 `<component :is>` 的页面
- **现状**：`useAppStore().deviceType` 在 SSR 阶段为空字符串（服务端无 window），动态组件不渲染 → 商品详情等页面的 SSR HTML 可能缺少关键内容
- **影响**：SEO 隐患 —— 若 SEO 关键内容（商品标题/价格/描述）只在 PC.vue/Mobile.vue 里，SSR HTML 会缺失，爬虫抓不到
- **规范引用**：`CLAUDE.md` 响应式开发规范（SSR 注意事项）
- **修复方向**：核查商品详情 SSR HTML 是否含关键内容；若有缺失，把 SEO 关键内容提到 SSR 可见层，或用模式 C

### R-03 双组件模式数据请求重复风险 ⬜
- **位置**：各 PC.vue / Mobile.vue 组件
- **现状**：规范要求 PC/Mobile 共享状态用 v-model 传递，但需核查现有双组件是否存在各自重复请求接口的情况
- **影响**：重复请求浪费性能，数据不一致风险
- **规范引用**：`CLAUDE.md` 响应式开发规范 模式 A（禁止子组件各自重复请求）
- **修复方向**：排查双组件，数据请求统一提到父组件，子组件只接收 props

### R-04 CSS 变量断点与 JS 断点阈值需对齐确认 ⬜
- **位置**：`useAppStore()` (720px) vs `var.scss` (720/1024/1440/1920)
- **现状**：JS 断点只有 720 一档（PC/Mobile 二分），CSS 有 5 档。平板（721-1024）在 JS 层被归为 PC，但 CSS 层有独立样式
- **影响**：平板设备的 JS 逻辑（如 isPC=true）与 CSS 表现（平板样式）可能不完全匹配
- **规范引用**：`CLAUDE.md` 响应式开发规范（断点体系）
- **修复方向**：评估是否需要在 JS 层增加平板判断（如 `isTablet`），或明确平板走 PC 逻辑

---

## 五-2、功能完整性类问题（业务闭环相关）

> 这类问题不阻塞主流程，但影响功能可用性或业务闭环，需后端配合或后续迭代处理。

### F-01 旅行订单分享功能失效（后端缺匿名接口）⬜
- **位置**：`pages/share/travel-order/[id].vue:19-25` + 后端 `yudao-module-travel`
- **现状**：
  - 分享页调用 `useTravelOrderApi().get(id)` → `travel/order/get`，这是**用户私域接口**（需登录态 + 归属校验）
  - 但分享场景是**匿名访问**（对方收到链接直接打开，无 token）
  - 代码注释已标注该问题（`[id].vue:23-24`："分享页不要求登录，但后端需要归属校验——匿名访问可能返回空。后续后端需提供匿名可访问的分享详情接口"）
- **影响**：
  - 用户在 `pages/user/travel-order/[id].vue` 点"分享"生成的链接，对方打开后**永远命中 fallback 兜底页**（`[id].vue:35-40` 的"精彩的旅行行程"通用文案），看不到实际行程内容
  - 分享功能实际不可用，影响拉新转化
- **触发路径**：旅行订单详情页 → 点"分享" → 复制 `/share/travel-order/{id}` 链接 → 对方打开 → fallback 页（非真实行程）
- **修复方向**：
  1. **后端**：新增匿名可访问的分享详情接口，如 `GET /travel/order/share-get?id={id}`，返回**脱敏后**的订单信息（行程概览/目的地/日期，**不含**金额/用户隐私/联系方式），需后端 `yudao-module-travel` 开发
  2. **前端**：`pages/share/travel-order/[id].vue` 改调新接口；确认脱敏字段后调整展示
- **临时措施**：暂不处理，分享按钮可保留（不报错），但用户分享出去的链接为兜底页
- **关联文件**：`pages/user/travel-order/[id].vue:69-73`（shareOrder 生成链接）、`pages/share/travel-order/[id].vue`（分享页）

### F-02 客户案例详情接口（当前用静态数据兜底）🔄
- **位置**：`pages/case/[id].vue` + `config/tour-cases.ts` + 后端 `yudao-module-travel`
- **现状**：
  - 详情页 `pages/case/[id].vue` 当前从本地静态数据 `config/tour-cases.ts` 的 `getCaseById(id)` 取数据
  - 首页 `AppTourCustom.vue` 也从同一份静态数据 `tourCases` 渲染卡片列表
  - 代码中已预留 API 调用位（注释 `// const { data: detail } = await useAPI<TourCase>('travel/case/get', { params: { id } })`）
- **影响**：案例内容目前不可后台编辑，需改代码发版才能更新
- **修复方向**：
  1. **后端**：新增案例管理接口，建议复用 `promotion/article` 文章体系（新增"客户案例"分类 categoryId），或独立 `travel/case` 模块：
     - `GET /travel/case/page`（列表，首页用）
     - `GET /travel/case/get?id={id}`（详情，详情页用）
  2. **前端**：`AppTourCustom.vue` 和 `pages/case/[id].vue` 改调新接口，`config/tour-cases.ts` 保留作 SSR 兜底
- **关联文件**：`pages/case/[id].vue`、`pages/index/components/tour/AppTourCustom.vue`、`config/tour-cases.ts`

### F-03 服务团队详情接口（当前用静态数据兜底）🔄
- **位置**：`pages/staff/[id].vue` + `config/tour-staff.ts` + 后端 `yudao-module-travel`
- **现状**：
  - 详情页 `pages/staff/[id].vue` 当前从本地静态数据 `config/tour-staff.ts` 的 `getStaffById(id)` 取数据
  - 首页 `AppTourCompanion.vue` 也从同一份静态数据 `tourStaff` 渲染卡片列表
  - 代码中已预留 API 调用位（注释 `// const { data: detail } = await useAPI<TourStaff>('travel/staff/get', { params: { id } })`）
- **影响**：团队成员信息目前不可后台编辑，需改代码发版才能更新
- **修复方向**：
  1. **后端**：新增服务团队管理接口，建议独立 `travel/staff` 模块（团队成员有 rating/orders/skills 等专属字段，不适合复用 article）：
     - `GET /travel/staff/page`（列表，首页用）
     - `GET /travel/staff/get?id={id}`（详情，详情页用）
  2. **前端**：`AppTourCompanion.vue` 和 `pages/staff/[id].vue` 改调新接口，`config/tour-staff.ts` 保留作 SSR 兜底
- **关联文件**：`pages/staff/[id].vue`、`pages/index/components/tour/AppTourCompanion.vue`、`config/tour-staff.ts`

---

## 六、待处理优先级建议

按 **SEO 影响 × 改动成本** 排序，建议处理顺序：

| 优先级 | 问题编号 | 理由 |
|---|---|---|
| 🔴 立即 | S-01, S-02, C-02 | SEO P0 + 简单修复，收益最大 |
| 🔴 立即 | S-03, S-04 | 配置类修复，成本极低 |
| 🔴 立即 | R-02 | SSR 关键内容缺失，直接影响 SEO 收录 |
| 🟠 本期 | S-05, S-06, S-08, S-09 | GEO/AI 引擎核心能力 |
| 🟠 本期 | I-02 | hreflang 完整性 |
| 🟠 本期 | R-03, R-04 | 响应式数据一致性、平板断点对齐 |
| 🟡 后续 | S-07, P-01, P-02, P-03 | 性能优化 |
| 🟡 后续 | C-01, C-03 ~ C-08 | 代码规范，改版时顺带处理 |
| 🔵 待后端 | F-01 | 旅行订单分享功能，需后端新增匿名分享接口，前端无法单独修复 |
| 🔵 待后端 | F-02, F-03 | 案例/团队详情接口，当前前端已用静态数据兜底，接口就绪后切换 |
| 🟢 按需 | I-01 | 业务驱动，需业务决策 |
| ✅ 已完成 | R-01 | 响应式规范已建立 |

---

## 七、问题登记规范

后续开发中发现的新问题，按以下格式追加到对应分类：

```markdown
### [编号] 简短标题 状态
- **位置**：`文件路径:行号`
- **现状**：当前代码怎么写的
- **影响**：为什么是个问题（SEO/可维护性/性能）
- **规范引用**：`SEO_GEO_GUIDELINES.md` §X.X 或 `CLAUDE.md`
- **修复方向**：怎么改
```

编号规则：`S-XX`（SEO）/ `C-XX`（代码规范）/ `P-XX`（性能）/ `I-XX`（i18n）/ `R-XX`（响应式）/ `F-XX`（功能完整性，业务闭环相关）。
