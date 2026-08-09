# 旅行陪侍服务前端完整功能规划

> 创建时间：2026-06-29
> 分支：feature/tour-homepage-redesign
> 状态：执行中

## 一、业务闭环

```
用户提交诉求 → Admin邮件沟通 → Admin创建预订单 → 用户确认预订单 → 支付(预付/全款) → 订单生成
     ↓                                                                              ↓
 诉求列表                                                                      订单列表/详情
     ↓                                                                              ↓
 沟通记录 ←───────────────────────────────────────────── 尾款确认/订单管理
```

## 二、后台 API 清单（已实现 7 个 Controller）

| 模块 | 接口 | 方法 | 说明 |
|------|------|------|------|
| 旅行诉求 | `/travel/inquiry/create` | POST | 创建旅行诉求（匿名可提交） |
| | `/travel/inquiry/my-list` | GET | 我的旅行诉求列表 |
| | `/travel/inquiry/get` | GET | 旅行诉求详情 |
| | `/travel/inquiry/bind-email` | POST | 绑定邮箱归集匿名诉求 |
| 随行诉求 | `/travel/escort-inquiry/create` | POST | 创建随行诉求（需登录） |
| | `/travel/escort-inquiry/my-page` | GET | 我的随行诉求分页 |
| | `/travel/escort-inquiry/get` | GET | 随行诉求详情 |
| 预订单 | `/travel/pre-order/my-page` | GET | 我的预订单分页 |
| | `/travel/pre-order/get` | GET | 预订单详情 |
| | `/travel/pre-order/confirm` | PUT | 用户确认预订单 |
| | `/travel/pre-order/cancel` | PUT | 用户取消预订单 |
| 订单 | `/travel/order/my-page` | GET | 我的订单分页 |
| | `/travel/order/get` | GET | 订单详情 |
| | `/travel/order/confirm-remaining` | PUT | 用户确认线下尾款已支付 |
| | `/travel/order/cancel` | PUT | 用户取消订单 |
| 支付 | `/travel/payment/create` | POST | 发起支付（预付款或全款） |
| 沟通 | `/travel/communication-log/list-by-pre-order` | GET | 按预订单查沟通记录 |

## 三、前端页面清单

### 阶段1：诉求提交改造
- [ ] pages/custom/index.vue — 表单对接 /travel/inquiry/create
- [ ] pages/companion/index.vue — 表单对接 /travel/escort-inquiry/create

### 阶段2：诉求管理
- [ ] types/travel.ts — 类型定义
- [ ] composables/useTravelInquiry.ts — 旅行诉求 API 封装
- [ ] pages/user/travel/index.vue — 我的旅行诉求列表
- [ ] pages/user/travel/[id].vue — 旅行诉求详情
- [ ] pages/user/escort/index.vue — 我的随行诉求列表
- [ ] pages/user/escort/[id].vue — 随行诉求详情
- [ ] components/TravelTimeline.vue — 沟通时间线组件

### 阶段3：预订单管理
- [ ] composables/useTravelPreOrder.ts
- [ ] pages/user/preorder/index.vue — 预订单列表
- [ ] pages/user/preorder/[id].vue — 预订单详情（确认/取消）

### 阶段4：支付
- [ ] composables/useTravelPayment.ts
- [ ] pages/user/payment/[lineId].vue — 支付页（预付/全款）

### 阶段5：订单管理
- [ ] composables/useTravelOrder.ts
- [ ] pages/user/travel-order/index.vue — 订单列表
- [ ] pages/user/travel-order/[id].vue — 订单详情（尾款确认/追加/取消）

### 阶段6：集成
- [ ] pages/user/index.vue — 用户中心增加旅行菜单入口

## 四、状态映射

### 预订单状态
| 英文 | 中文 | 颜色 |
|------|------|------|
| DRAFT | 草稿 | 灰色 |
| SENT | 待确认 | 橙色 |
| USER_CONFIRMED | 已确认 | 蓝色 |
| ADMIN_CONFIRMED | 已核实 | 蓝色 |
| ORDER_CREATED | 已转订单 | 绿色 |
| CANCELLED | 已取消 | 红色 |

### 订单状态
| 英文 | 中文 | 颜色 |
|------|------|------|
| CREATED | 已创建 | 灰色 |
| IN_SERVICE | 服务中 | 橙色 |
| COMPLETED | 已完成 | 绿色 |
| CANCELLED | 已取消 | 红色 |

### 支付状态
| 英文 | 中文 |
|------|------|
| UNPAID | 待支付 |
| PAID | 已支付 |
| NOT_REQUIRED | 无需支付 |

## 五、技术约束
- 路由跳转用 `$path('/user/travel')`（自动加 /en 前缀）
- SSR 渲染
- 表单提交走 `$api`
- 复用用户中心布局（PC/Mobile 双端）
- 黑金配色
