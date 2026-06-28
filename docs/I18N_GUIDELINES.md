# i18n 国际化文案规范

> **强制等级**：**MUST**。所有用户可见文案必须走 i18n，禁止硬编码。
> **触发场景**：写任何展示给用户的文字（按钮、标题、提示、占位符、错误信息等）。
> **总纲入口**：本规范是 `CLAUDE.md` 约束 4 的详细展开。
> **SEO 关联**：直接关系到 GEO 多语言目标（`docs/SEO_GEO_GUIDELINES.md` §5）。硬编码文案在启用多语言时无法翻译，GEO 失效。

---

## 1. 核心原则

- **MUST**：所有**用户可见文案**必须通过 `$t('key')` 或 `t('key')` 调用 i18n，禁止硬编码。
- **MUST**：新增文案 key 必须同步在 `locales/en.ts`（及未来启用的其他语言文件）添加对应翻译。
- **MUST**：SEO 文案（title/description/keywords）通过 `seoConfig.customRoutes` 的 i18n key 配置，走 `useSEO`。

### 正反例
```vue
<!-- ✅ 正确 -->
<button>{{ $t('Buy Now') }}</button>
<el-input :placeholder="$t('Enter email address')" />
<ElMessage.info(t('订阅成功'))

<!-- ❌ 错误（硬编码） -->
<button>Buy Now</button>
<el-input placeholder="Enter email address" />
<ElMessage.info('订阅成功')
```

---

## 2. 文件结构

```
locales/
├─ i18n.config.ts   # i18n 配置（legacy: false, Composition API 模式）
├─ en.ts            # 英文（当前启用）
├─ zh.ts            # 中文（已存在文件，未启用）
├─ ar.ts / de.ts ... # 其他 14 种语言（已存在文件，未启用）
```

- **现状**：`nuxt.config.ts` 只启用 `en`，但 locales 目录有 16 个语言文件（见 ISSUES I-01）。
- **MUST**：新增 key 时，至少更新 `en.ts`。启用新语言时，该语言的 .ts 文件必须补全所有 key（见 SEO 规范 §5.5）。

---

## 3. 文案 key 命名规范（重要，纠正现状混乱）

> ⚠️ **现状问题**：en.ts 的 key 命名**极不统一**，存在 4 种风格混用：
> - 驼峰：`login`、`home`
> - 带空格：`'All Order'`、`'Buy Now'`
> - **中文 key**：`'秒杀'`、`'砍价'`、`'立即购买'`（严重问题）
> - kebab-case：`'password-required'`

### 新增 key 的规范（MUST）
- **MUST**：新 key 统一用 **PascalCase 或 camelCase 英文**，按"功能模块.用途"语义命名。
  ```ts
  // ✅ 推荐
  'product.buyNow': 'Buy Now'
  'cart.empty': 'Your cart is empty'
  'form.emailInvalid': 'The email address is invalid.'
  'order.status.pending': 'Pending'
  ```
- **MUST**：**禁止用中文作 key**（如 `'秒杀'`）—— 中文 key 无法国际化、难维护、IDE 不友好。新增一律英文 key。
- **MUST**：**禁止用带空格的 key**（如 `'All Order'`）—— 易出错，改用 camelCase（`allOrder`）。
- **MUST**：key 命名见名知意，禁止 `text1`、`tmp`、`aaa` 这类无意义 key。

### 历史遗留 key 处理
- 现有中文 key（`'秒杀'`、`'砍价'` 等）和带空格 key（`'All Order'`）**不强制立即重构**（避免大面积回归），但：
  - **MUST**：新代码**不要复用**这些坏 key，用新规范 key。
  - **SHOULD**：改版/重构涉及到的页面，顺手把坏 key 迁移到新规范 key。

---

## 4. 调用方式

### 4.1 三种调用方式
```ts
// 1. 模板里用 $t（最常用）
<button>{{ $t('Buy Now') }}</button>

// 2. script 里用 t（需先解构 useI18n）
const { t } = useI18n()
ElMessage.info(t('订阅成功'))

// 3. composable 简写 $t（项目自定义）
$t('Buy Now')
```

- **MUST**：模板内用 `$t`，script 内用 `t`（从 `useI18n()` 解构）。两者等价，按上下文选。
- **注意**：`$t` 是项目自定义 composable（`composables/$t.ts`），封装了 `useI18n().t`。

### 4.2 带参数的文案
```ts
// locales/en.ts
'还差x人成团': ({ values }) => `Still needs ${values.number > 1 ? `${values.number} people` : `${values.number} person`} to start a group`

// 调用
$t('还差x人成团', { number: 3 })
```
- **MUST**：带参数文案用 message format（vue-i18n 支持函数或 `{name}` 占位符）。
- **MUST**：新 key 用英文 + 占位符：`'group.stillNeeds': 'Still needs {number} {n | plural: people person} to start'`。

---

## 5. SEO 文案与 i18n

- **MUST**：页面 SEO（title/description/keywords）通过 `useSEO({ routeKey })` → 匹配 `seoConfig.customRoutes[routeKey]` 的 i18n key。
- **现状**：`config/seo.config.ts` 的 customRoutes 用 i18n key（如 `'seo.home.title'`），对应 en.ts 里的 `seo.home.title` 值。
- **MUST**：新增页面时，同步在 seo.config.ts 注册 routeKey + 在 en.ts 添加对应 seo 文案 key。
- **MUST**：SEO 文案必须本地化（非机翻），每个语言独立配置（见 SEO 规范 §5.2）。

---

## 6. 何时不需要 i18n（例外）

以下情况**允许**硬编码：
- 纯技术性字符串（如 console.log 的调试信息）—— 不展示给用户
- 第三方库的配置 key（如 swiper 的 direction: 'horizontal'）
- 代码注释（注释用中文/英文均可，按团队习惯）
- `aria-label` 等 a11y 属性 —— **但建议也走 i18n**（见 A11Y 规范）

---

## 7. i18n 自检清单（提交前打勾）
- [ ] 所有用户可见文案都用 `$t()`/`t()`，无硬编码
- [ ] 新增的 key 已在 `locales/en.ts` 添加
- [ ] 新 key 用英文 camelCase/PascalCase，无中文、无空格
- [ ] 新 key 命名见名知意（如 `cart.empty` 而非 `text1`）
- [ ] 带参数文案用 message format
- [ ] SEO 文案（如适用）在 seo.config.ts 注册 + en.ts 添加
- [ ] 未复用历史坏 key（中文/带空格）
