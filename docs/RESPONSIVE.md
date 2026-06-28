# 响应式开发规范

> **强制等级**：**MUST**。所有前端代码必须响应式，兼容手机 H5、平板、PC（含 PC 窄窗口）。
> **触发场景**：写任何页面/组件、改布局、加交互元素。
> **总纲入口**：本规范是 `CLAUDE.md` 约束 3 的详细展开。
> **兼容范围**：iOS Safari、Android Chrome、iPad、PC Chrome（含窗口缩窄至 720px 以下）。

---

## 1. 核心原则

- **MUST**：所有前端代码必须响应式，禁止写死尺寸导致某端布局崩坏。
- **核心关系**：**SEO 与响应式冲突时优先 SEO**（见 `CLAUDE.md` 约束 1）。需要被搜索引擎抓取的首屏内容，用 SSR 可见的模式 C；纯交互性内容可用模式 A/B。

---

## 2. 断点体系（统一标准，勿混用）

### 2.1 JS 断点
`useAppStore()` → `isPC` / `isMobile` / `deviceType`（返回 `'pc'`/`'mobile'`）。
- 阈值：**≤720px = mobile**，>720px = PC
- 初始化：`plugins/ready.client.ts` 的 `onNuxtReady` 里监听 resize

### 2.2 CSS 断点（assets/css/var.scss，5 档）

| 断点 | 范围 | 列数 | 典型设备 |
|---|---|---|---|
| `≤720` | 手机 | 6 栏 | iPhone/Android |
| `721-1024` | 平板竖屏 | 12 栏 | iPad 竖屏 |
| `1025-1440` | 平板横屏/小 PC | 12 栏 | iPad 横屏、小屏笔记本 |
| `1441-1920` | 标准 PC | 12 栏 | 桌面显示器 |
| `≥1921` | 大屏 PC | 12 栏 | 4K/超宽屏 |

- **MUST**：媒体查询写法统一 `@media screen and (max-width: 720px)` 或 `(min-width: 721px) and (max-width: 1024px)`，与 var.scss 一致。
- **已知问题**：JS 断点只有 720 一档（PC/Mobile 二分），CSS 有 5 档。平板（721-1024）在 JS 层被归为 PC，CSS 层有独立样式（见 ISSUES R-04）。

---

## 3. 三种适配模式（按场景选择，勿混用）

项目现有 3 种响应式写法，按 **PC/Mobile 差异程度** 选择：

```
PC/Mobile 是否结构完全不同？
├─ 是 → 模式 A（双组件动态切换）
└─ 否 → 是否部分元素不同？
        ├─ 是 → 模式 B（v-if 分支）
        └─ 否 → 模式 C（CSS 媒体查询）
```

### 模式 A：双组件动态切换（PC/Mobile 差异巨大时）
- **适用**：整页或整块结构、交互、布局完全不同
- **项目实例**：商品详情、订单列表、售后、钱包、收藏（`pages/xxx/components/PC.vue` + `Mobile.vue`）
- **写法**：
  ```vue
  <script setup lang="ts">
  import PC from './components/PC.vue'
  import Mobile from './components/Mobile.vue'
  const appStore = useAppStore()
  </script>
  <template>
    <component
      :is="{ pc: PC, mobile: Mobile }[appStore.deviceType]"
      v-model:count="count"
      :info="info"
      @command="handleCommand"
    />
  </template>
  ```
- **MUST**：PC/Mobile 共享的状态用 `v-model` + props/emits 传递，**禁止**子组件各自重复请求接口。
- **⚠️ SSR 警告**：SSR 阶段 `deviceType` 为空，动态组件不渲染（见 §5）。

### 模式 B：模板内 v-if 分支（同一块但局部元素差异）
- **适用**：主体结构相同，只有部分元素/筛选/交互在两端不同
- **项目实例**：product-list 筛选区
- **写法**：
  ```vue
  <div v-if="appStore.isPC" class="filter filter--pc">...</div>
  <div v-if="appStore.isMobile" class="filter filter--mobile">...</div>
  ```
- **MUST**：共享逻辑（数据请求、计算属性）在父级声明一次，PC/Mobile 分支只复用，不重复。

### 模式 C：单组件 + CSS 媒体查询（结构相同，仅尺寸/布局变）
- **适用**：结构不变，只是间距、字号、栏宽、排列方向变化
- **项目实例**：首页 4 个区块、site-grid 栅格
- **写法**：单组件，样式用 `@media` + CSS 变量
  ```scss
  .block {
    padding: var(--large-gap); // 变量自带断点响应
    @media screen and (max-width: 720px) {
      flex-direction: column;
    }
  }
  ```
- **MUST**：优先用 var.scss 的响应式 CSS 变量（`--large-gap`/`--default-font-size`/`--app-horizontal-padding` 等已自带 5 档断点值），少写裸 `@media`。

---

## 4. 图片/资源响应式
- **MUST**：图片用 `<NuxtImg>` + preset，声明 width/height（防 CLS，见 SEO 规范 §6.2）。
- **SHOULD**：PC/Mobile 用不同尺寸图时，用 `<picture>` + `<source media>` 或 `useAppStore().isPC` 选择不同 preset/图源（如 AppSwiper 的 PC/H5 双图）。

---

## 5. SSR 注意事项（关键，易踩坑）

- **MUST**：`useAppStore()` 的 `isPC/isMobile/deviceType` 在 **SSR 阶段为初始值**（`isPC:false, isMobile:false, deviceType:''`），因为服务端无 `window`。真实值在客户端 `onNuxtReady` 后才设置。
- **MUST**：因此模式 A 的动态组件在 SSR 阶段不渲染（deviceType 为空）。**若该组件承载 SEO 关键内容**（如商品标题/价格/描述），**不能**用模式 A，必须改用模式 C（SSR 可见）或确保内容在 SSR HTML 中（见 ISSUES R-02）。
- **MUST**：涉及 `window`/`document`/`localStorage` 的代码必须 `import.meta.client` 守卫。

---

## 6. 响应式自检清单（提交前打勾）
- [ ] 在 720px 以下（手机）布局不崩坏，文字不溢出
- [ ] 在 721-1024px（平板）布局合理
- [ ] 在 1025px 以上（PC）布局合理
- [ ] PC 窗口缩窄到 720px 以下时正常降级（非模式 A 场景）
- [ ] 没有写死的 `width`/`font-size` 导致某端溢出（用 var.scss 变量或 @media）
- [ ] 触摸目标（按钮/链接）在手机上 ≥44×44px，可点击
- [ ] 横向无溢出滚动条（除非刻意设计）
- [ ] SSR 阶段 SEO 关键内容可见（未被动态组件吞掉）
