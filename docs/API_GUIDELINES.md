# API 请求与错误处理规范

> **强制等级**：**MUST**。统一 API 调用方式与 loading/error 处理模式。
> **触发场景**：任何调用后端接口的场景。
> **总纲入口**：本规范是 `CLAUDE.md` 约束 6 的详细展开。

---

## 1. API 调用方式（统一用 useAPI）

### 1.1 三种调用方式及适用场景

| 方式 | 用法 | 适用场景 | SSR |
|---|---|---|---|
| `useAPI` | `const { data, pending, error, refresh } = await useAPI(url, opts)` | **页面级数据获取**（首选） | ✅ 默认 server:true |
| `$api` | `$api(url, opts)` | store 内、事件回调内（非渲染期）的命令式调用 | ❌ 不自动 SSR |
| `useNuxtApp().$api` | 等价 $api | 同上 | ❌ |

### 1.2 核心规则
- **MUST**：页面/组件的**首屏数据获取**用 `useAPI`（SSR，利于 SEO）。
- **MUST**：禁止组件内裸 `useAsyncData` + `useNuxtApp().$api`（违反见 ISSUES C-01，AppExclusive 是反面教材）。
- **MUST**：store actions 内的接口调用用 `$api`（store 不需要 SSR 数据获取）。
- **MUST**：禁止直接用 `$fetch`（绕过了 plugins/api.ts 的拦截器：token 注入、租户头、401 刷新、错误提示）。

### 1.3 useAPI 用法（页面级）
```ts
const { data, pending, error, refresh } = await useAPI<Category[]>(
  'product/category/list/top',
  {
    params: { num: 5 },
    lazy: false,        // false: 阻塞首屏（SSR 同步，首屏直出）；true: 异步不阻塞
    dedupe: 'defer',    // 去重策略
  }
)
```

- **MUST**：首屏关键数据（影响 LCP/SEO 的）用 `lazy: false`，SSR 同步直出。
- **SHOULD**：非首屏数据用 `lazy: true` 或 `<Suspense>` 异步加载，不拖慢首屏。

### 1.4 $api 用法（命令式）
```ts
// store action 内
getCartList() {
  return $api('trade/cart/list').then(res => { ... })
}

// 事件回调内
function submit() {
  $api('crm/clue/create-email-subscription', {
    method: 'post',
    body: { email: form.value.email },
  }).then(() => { ... })
}
```

---

## 2. Loading / Error / 骨架屏处理（统一模式）

### 2.1 推荐模式（参照 AppExclusive，项目内最佳实践）

**MUST**：每个独立加载的数据区块，必须有 **3 个状态分支**：加载中（骨架屏）、错误（重试）、成功。

```vue
<template>
  <!-- 1. 加载中：骨架屏 -->
  <div v-if="pending" class="skeleton">
    <div v-for="i in 4" :key="i" class="skeleton-card" />
  </div>

  <!-- 2. 错误：提示 + 重试 -->
  <div v-else-if="error" class="error-state">
    <p>{{ $t('Failed to load') }}</p>
    <button @click="refresh()">{{ $t('Retry') }}</button>
  </div>

  <!-- 3. 成功：内容 -->
  <div v-else-if="data?.length">
    <div v-for="item in data" :key="item.id">...</div>
  </div>

  <!-- 4. 空状态（可选） -->
  <div v-else class="empty-state">{{ $t('No data') }}</div>
</template>
```

### 2.2 状态分支规则
- **MUST**：用 `v-if="pending"` / `v-else-if="error"` / `v-else` 三分支，**禁止**只渲染成功态（加载中白屏、错误无反馈）。
- **MUST**：错误分支必须有**重试按钮**（调用 `refresh()`）。
- **MUST**：骨架屏样式与最终内容**结构一致**（占位尺寸接近，防 CLS）。
- **MUST**：文案走 i18n（`$t('Retry')`），禁止硬编码（见 I18N 规范）。

### 2.3 骨架屏复用
- **SHOULD**：抽公共骨架屏组件（当前 4 个首页组件各写一遍，见 ISSUES C-06）。
- **SHOULD**：骨架动画用统一的 `@keyframes loading`（当前重复定义在多处）。

---

## 3. 错误处理层级

项目已有三层错误处理，勿重复：

| 层级 | 位置 | 职责 | 是否需要页面额外处理 |
|---|---|---|---|
| 全局拦截器 | `plugins/api.ts` onResponse | 业务错误（code≠0）弹 ElMessage；401 自动刷新 token | 否（已弹提示） |
| 请求级 catch | `$api().catch()` / useAPI 的 error | 单请求失败的处理（降级、重试） | 是 |
| 页面级 | `v-else-if="error"` 分支 | 展示错误态 + 重试按钮 | 是 |

- **MUST**：业务错误（如 code≠0）由全局拦截器统一弹 ElMessage，**页面层不要再弹**（避免重复提示）。
- **MUST**：网络错误/接口异常，页面层用 error 分支展示重试，**不要静默吞掉**（`catch(() => null)` 如 AppExclusive 的做法是降级，但页面级应展示错误态）。

### AppExclusive 的降级模式（特殊场景）
AppExclusive 用 `Promise.all([...].catch(() => null))` 然后 `filter(item => item !== null)` —— 这是**多接口并发、部分失败可降级**的特殊场景。
- **SHOULD**：只有"部分数据失败不影响整体"时用此模式。
- **MUST**：关键数据失败必须有错误反馈，不能全部静默。

---

## 4. 常用接口模式

### 4.1 并发请求
```ts
const [a, b] = await Promise.all([
  useAPI('api/a'),
  useAPI('api/b'),
])
```
- **SHOULD**：无依赖的多个请求用 `Promise.all` 并发，勿串行。

### 4.2 分页
- **SHOULD**：用项目已有的 `utils/useTablePagination.ts` / `useInfiteLoad.ts`，勿重复造轮子。

### 4.3 请求参数清理
- 全局拦截器已自动清理空参数（`v === '' || null || undefined` 时 delete），**页面层无需手动清理**。

---

## 5. SEO 关联

- **MUST**：可收录页面的数据用 `useAPI`（SSR），保证爬虫能拿到数据（见 SEO 规范 §1.2）。
- **MUST**：禁止可收录页面用 `onMounted` + `$api` 获取首屏数据（CSR，爬虫抓不到）。
- **MUST**：`useAPI` 的 `server: true` 是 SSR 关键，禁止随意改 false。

---

## 6. API 自检清单（提交前打勾）
- [ ] 页面首屏数据用 `useAPI`（非 `$fetch`/裸 useAsyncData）
- [ ] 有 pending（骨架屏）/ error（重试）/ 成功 三分支
- [ ] 错误分支有重试按钮
- [ ] 错误/重试文案走 i18n
- [ ] store/事件回调内用 `$api`
- [ ] 可收录页面数据走 SSR（`lazy: false` 或 server:true）
- [ ] 未重复弹错误提示（全局拦截器已处理）
