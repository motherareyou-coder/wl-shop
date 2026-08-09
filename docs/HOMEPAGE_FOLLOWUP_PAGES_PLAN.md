# 首页后续页面规划

> 创建时间：2026-06-28
> 分支：feature/tour-homepage-redesign
> 状态：执行中

## 一、现状总结

首页跳转目标中，**2 个核心页面缺失（404）**，1 个错误页缺失：

| 跳转目标 | 是否存在 | 来源组件 |
|----------|---------|---------|
| `/custom` | ❌ 缺失 | Banner、FloatCta、Packages（最高频 CTA） |
| `/companion` | ❌ 缺失 | Banner、Companion（第二高频 CTA） |
| `/articles` `/articles/{id}` | ✅ | Guide |
| `/product-list` `/seckill` `/combination` `/coupon` | ✅ | ShopEntry |
| `/login` `/user/*` | ✅ | Header/FloatCta |
| 404 错误页 | ❌ 缺失 | 全局（当前用 Nuxt 默认白页） |

## 二、开发任务清单

### 任务 1：404 错误页（error.vue）✅
- [x] 创建 `error.vue`（Nuxt 根目录约定）
- [x] 黑金品牌化设计（深黑渐变 + 金色 404 + CTA 按钮）
- [x] 热门链接（首页/定制/文章/商城）
- [x] 响应式 + SSR

### 任务 2：定制行程页（pages/custom/index.vue）
- [ ] Hero 区（黑金渐变 + 数据徽章）
- [ ] 需求表单（4 分区：基本信息/目的地/预算/特殊需求）
- [ ] 服务保障（3 列）
- [ ] 定制流程（复用首页 process）
- [ ] 客户案例（复用首页 case 卡片）
- [ ] FAQ（复用首页 FAQ）
- [ ] 表单提交（$api crm/clue/create-email-subscription）
- [ ] useSEO + JSON-LD + i18n

### 任务 3：情感陪伴服务页（pages/companion/index.vue）
- [ ] Hero 区
- [ ] 服务类型详情（4 tab 联动）
- [ ] 服务流程（复用聊天轮播）
- [ ] 陪侍师团队（复用 staff 卡片 + 筛选）
- [ ] 预约表单
- [ ] 隐私安全承诺（3 列）
- [ ] 客户评价（复用 case 卡片）
- [ ] 陪侍专属 FAQ
- [ ] 表单提交 + useSEO + i18n

### 任务 4（P1 后续）：套餐详情页 pages/packages/[id].vue
### 任务 5（P1 后续）：关于我们 pages/about/index.vue

## 三、技术约束
- 路由跳转用 `$path('/custom')`（自动加 /en 前缀）
- SSR 渲染（ENABLE_SSR=true）
- i18n key 放 tour.* 命名空间（en.ts + zh.ts 同步）
- SEO 用 useSEO composable + JSON-LD
- 黑金配色，复用 CSS 变量
- 响应式（PC 1440 / 平板 1024 / 移动 375）
- 表单提交走 $api，禁止裸 $fetch
- 复用首页已有组件（案例卡、staff 卡、FAQ、流程、信任）

## 四、设计风格（ui-ux-pro-max）
- Modern Dark + Liquid Glass
- 配色：#1C1917（深黑）/ #A16207（金）/ #FAF2E0（浅金底）
- 字体：MiSans Latin
- 卡片：白底圆角 + 柔和阴影 + hover 上浮
- 表单：深黑渐变卡 + 金色光晕
- 交互：tab 联动 / 手风琴 FAQ / 表单分步
