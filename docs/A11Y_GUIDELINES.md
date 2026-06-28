# 可访问性（a11y）开发规范

> **强制等级**：**SHOULD**（强烈建议，部分条款 MUST）。a11y 与 SEO 高度重合 —— 搜索引擎就是最大的"残障用户"。
> **触发场景**：写任何交互元素、表单、图片、动态内容。
> **总纲入口**：本规范是 `CLAUDE.md` 约束 5 的详细展开。
> **SEO 关联**：良好 a11y 直接提升 SEO（语义化、alt、键盘可访问都是 Google 排名信号）。

---

## 1. 核心原则

- a11y 不是额外负担，而是**写出语义化、可机器理解代码**的副产品。
- 本规范与 SEO 规范重叠部分（alt、语义化）以 SEO 规范为准；a11y 专有部分（键盘、焦点、ARIA）在本规范。

---

## 2. 语义化 HTML（与 SEO 规范 §1.3 一致，重申 MUST）

- **MUST**：导航用 `<nav>`、页脚用 `<footer>`、主内容用 `<main>`、独立内容用 `<article>`/`<section>`。
- **MUST**：列表用 `<ul>`/`<ol>`，不用 `<div>` 模拟列表。
- **MUST**：每页唯一 `<h1>`，heading 层级递进不跳级（见 SEO 规范 §2.4）。

---

## 3. 交互元素（MUST，最易违反）

### 3.1 用正确的元素
- **MUST**：可点击触发动作的元素用 `<button>`，**禁止用 `<div>`/`<span>` 模拟按钮**。
  ```html
  <!-- ✅ 正确 -->
  <button @click="submit">Submit</button>
  <!-- ❌ 错误（div 当按钮，键盘不可访问） -->
  <div @click="submit">Submit</div>
  ```
- **MUST**：跳转用 `<a>` / `<nuxt-link>`，**禁止用 `<div>` + click 跳转**。
- **MUST**：`<button>` 若纯图标，必须有 `aria-label`。
  ```html
  <button @click="close" aria-label="Close dialog">
    <Icon name="icon:close" />
  </button>
  ```

### 3.2 项目现状参考
- AppHeader 用了 `aria-label="loginLink"`、`aria-label="userCart"` 等（✅ 正面样例）。
- AppExclusive 的 `.activity-customize` 用 `<div @click>` 模拟可点击区域（⚠️ 应考虑加 button/role，见 ISSUES）。

---

## 4. 图片（与 SEO 规范 §2.5 一致）

- **MUST**：所有 `<NuxtImg>`/`<AppImage>`/`<img>` 必须有 `alt`。
- **MUST**：信息性图片 alt = 描述（如商品名）；装饰性图片 `alt=""`（明确标记为装饰）。
- 详见 `docs/SEO_GEO_GUIDELINES.md` §2.5。

---

## 5. ARIA 属性（SHOULD）

### 5.1 何时用 ARIA
- **SHOULD**：原生 HTML 无法表达语义时才用 ARIA（如动态弹窗、自定义控件）。
- **原则**："No ARIA is better than bad ARIA"。能用原生 HTML（button/nav/main）就别用 ARIA。

### 5.2 常用 ARIA
| 场景 | 属性 |
|---|---|
| 图标按钮 | `aria-label="动作描述"` |
| 弹窗/对话框 | `role="dialog"` + `aria-modal="true"` |
| 加载状态 | `aria-busy="true"` 或 `role="status"` |
| 动态提示 | `role="alert"`（错误）/ `role="status"`（信息） |
| 隐藏内容（视觉） | `sr-only` 类（非 `display:none`） |
| 当前页/选中态 | `aria-current="page"` / `aria-selected="true"` |

### 5.3 sr-only（视觉隐藏但可读）
- **MUST**：视觉隐藏文案但需 SEO/屏幕阅读器可读时，用 `sr-only` 类，**禁止 `display:none`**（搜索引擎可能忽略）。
- 用法：首页 `<h1 class="sr-only">Surprise Gifts for Love</h1>`（见 SEO 规范 §2.4）。
- `.sr-only` 工具类已定义在 `assets/css/common.scss`（全局可用），无需重复定义。

---

## 6. 键盘可访问（SHOULD）

- **SHOULD**：所有交互元素可用 Tab 键聚焦、Enter/Space 触发（原生 button/a 天然支持）。
- **SHOULD**：自定义控件（如自定义下拉、轮播）需实现键盘操作（方向键、Enter）。
- **SHOULD**：可见的焦点样式（`:focus-visible`），勿全局 `outline: none`。
- **MUST**：禁止用 `<div tabindex="0" @click>` 模拟按钮（用 `<button>`）。

---

## 7. 表单可访问性（SHOULD）

- **SHOULD**：每个表单控件有关联的 `<label>`（`for` + `id`，或包裹式 label）。
- **SHOULD**：必填字段用 `aria-required="true"` 或 label 标注 `*`。
- **SHOULD**：错误提示用 `aria-describedby` 关联，`role="alert"`。
- **项目现状**：AppFooter 的邮箱订阅用 `<input id="email">` 但无 `<label>`（⚠️ 可改进）。

---

## 8. 颜色对比度（SHOULD）

- **SHOULD**：文字与背景对比度满足 WCAG AA：正文 ≥4.5:1，大字 ≥3:1。
- **项目现状**：var.scss 的 `--text-secondary: #898989` 在白底对比度约 3.5:1（⚠️ 边缘，大字可用正文慎用）。

---

## 9. a11y 自检清单（提交前打勾）
- [ ] 可点击元素用 `<button>`/`<a>`，非 `<div @click>`
- [ ] 图标按钮有 `aria-label`
- [ ] 所有图片有 alt（信息性描述 / 装饰性空 alt）
- [ ] 弹窗有 `role="dialog"` + `aria-modal`
- [ ] 视觉隐藏内容用 `sr-only`，非 `display:none`
- [ ] 可 Tab 聚焦，有焦点样式
- [ ] 表单控件有 label
- [ ] 文字对比度达标
