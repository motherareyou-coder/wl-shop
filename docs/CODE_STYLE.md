# 代码风格规范

> **强制等级**：**MUST**。新增/修改代码必须与项目现有风格一致。
> **触发场景**：写任何 .vue / .ts / .scss 文件、改布局结构。
> **总纲入口**：本规范是 `CLAUDE.md` 约束 2 的详细展开。

---

## 1. 代码格式（由 ESLint @antfu 强制，不可违反）

| 项目 | 规则 |
|---|---|
| 缩进 | **Tab**（非空格，eslint 实际强制） |
| 引号 | 单引号 `'` |
| 分号 | **无分号** |
| 大括号 | 同行，`if (x) {` |
| import | 模块导入在前，类型导入用 `import type` |
| 路径别名 | `~/` 或 `@/` 指向项目根 |

```ts
// ✅ 正确
import type { Product } from '~/types'
import { chunk } from 'lodash-es'

const list = computed(() => {
	if (!data.value) return []
	return chunk(data.value, 3)
})

// ❌ 错误（缩进空格、有分号、双引号）
import { chunk } from "lodash-es";
const list = computed(() => {
  if (!data.value) return [];
})
```

---

## 2. 命名约定

### 2.1 组件命名（项目实际规律，非"全部 App 前缀"）

项目组件命名分两类，按**职责**判断：

| 类型 | 命名规则 | 例子 | 判断标准 |
|---|---|---|---|
| **容器/布局类** | `App` 前缀 + PascalCase | AppHeader、AppFooter、AppModal、AppSwiper、AppCountDown | 含布局/状态管理/全局职责 |
| **业务小组件** | 语义命名，**不带 App** | ProductPrice、CartNav、ActivityTag、CodeSender、PswEye | 纯展示/单一功能 |

- **MUST**：新建组件前先判断职责。是容器/布局类 → 加 `App` 前缀；是业务小组件 → 语义命名。
- **MUST**：组件名用 PascalCase，`defineOptions({ name: '组件名' })` 必填且与文件名一致。

### 2.2 目录/文件命名
- 目录：kebab-case（`product-list`、`forgetPassword` 是历史例外，勿新增）
- 组件文件：PascalCase（`AppSwiper.vue`、`ProductPrice.vue`）
- 工具/composable 文件：camelCase（`useAPI.ts`）或 `$` 前缀（`$api.ts`）
- 样式文件：与同名 .vue 一致（`AppExclusive.vue` + `AppExclusive.scss`）

### 2.3 SCSS 类名（BEM）
- **MUST**：BEM 规范 `block__element--modifier`，kebab-case
  ```scss
  .exclusive-offers { }                    // block
  .exclusive-offers__header { }            // element
  .exclusive-offers__header-arrow--left { } // modifier
  ```
- **MUST**：禁止用 `#id` 写样式，用 class。
- **SHOULD**：scoped 样式优先；全局样式（如 `@import url('./xxx.scss')`）只用于需跨组件复用的。

### 2.4 composables / stores / utils 命名
- composables：`useXxx`（useAPI、useSEO）或 `$xxx` 简写（`$api`、`$path`、`$t`）
- stores：`useXxxStore`（useAppStore、useUserStore），**options API 风格**（state/getters/actions）
- utils：camelCase 工具函数

---

## 3. Vue 组件结构约定

### 3.1 标准结构顺序
```vue
<script setup lang="ts">
// 1. 类型导入
import type { Product } from '~/types'
// 2. 第三方库导入
import { chunk } from 'lodash-es'
// 3. defineOptions（必填 name）
defineOptions({ name: 'AppExclusive' })
// 4. props / emits / model
const props = defineProps<{ ... }>()
// 5. composables / store
const appStore = useAppStore()
// 6. 响应式状态
const count = ref(0)
// 7. computed
const list = computed(() => ...)
// 8. 方法
function handleClick() { ... }
// 9. 生命周期 / 数据请求
const { data } = await useAPI(...)
</script>

<template> ... </template>

<style lang="scss" scoped> ... </style>
```

### 3.2 关键约定
- **MUST**：`<script setup lang="ts">`，禁止 options API 写组件（stores 用 options 是另一回事）。
- **MUST**：`defineOptions({ name: '...' })` 必填。
- **MUST**：内部跳转用 `$path()`（自动加 i18n 前缀），禁止手拼 URL。
- **MUST**：访问 `window`/`document`/`localStorage` 必须 `import.meta.client` 守卫。
- **MUST**：禁止组件内裸 `$fetch`/`useAsyncData+$api`，统一用 `useAPI`（详见 `docs/API_GUIDELINES.md`）。

---

## 4. 样式与 CSS 变量

### 4.1 CSS 变量体系（assets/css/var.scss）
- **颜色**：`--brand-orange`（主色 #ff6900）、`--text-*`、`--background-*`、`--border-*`
- **间距**：`--large-gap`/`--mid-gap`/`--small-gap`/`--mini-gap`（已自带 5 档断点响应）
- **字号**：`--large-font-size`/`--default-font-size`/`--small-font-size`（自带断点响应）
- **内边距**：`--app-horizontal-padding`、`--margin-vertical`
- **MUST**：用 CSS 变量而非裸数值，让样式自动响应断点。
- **注意**：var.scss 存在变量重复定义问题（见 ISSUES C-07），优先用 `--brand-*` 命名空间。

### 4.2 布局栅格（必须复用，勿新造）
- 全局栅格：`assets/css/site-grid.scss`（提供 `--full`/`--half`/`--quarter`/`--vertical-100`/`--store-large` 等 modifier）
- 首页专用栅格：`pages/index/index.scss`（`--special-half-quarter` 等）
- 容器：`.site-container`、`.site-grid`
- **MUST**：改布局时优先复用现有 modifier 和栅格系统。

### 4.3 字体
- 主字体：`"MiSans Latin", sans-serif`（已在 common.scss 定义）
- **SHOULD**：启用 `font-display: swap`（common.scss 当前注释，建议开启防 CLS）

---

## 5. TypeScript 规范
- **MUST**：`<script setup lang="ts">`，所有类型定义放 `types.ts`。
- **MUST**：导入类型用 `import type { ... }`。
- **MUST**：禁止 `any`（必要时用泛型或具体 unknown 处理）。
- **MUST**：禁止滥用 `as` 类型断言（除非有明确依据）。
- **MUST**：函数参数、props、emits 必须有类型注解。

---

## 6. 反模式清单（禁止）
- ❌ 组件内写业务逻辑（应放 composable/store）
- ❌ 裸 DOM 操作（`document.getElementById` 等，用 ref）
- ❌ 硬编码（数值/字符串/URL，用常量或 i18n）
- ❌ `any` 类型、滥用 `as`
- ❌ 组件间直接通信（用 props/emits 或 store）
- ❌ 组件内裸 `$fetch`/`useAsyncData+$api`（用 `useAPI`）
- ❌ `#id` 写样式（用 class）
- ❌ options API 写组件
- ❌ 手拼内部 URL（用 `$path()`）
