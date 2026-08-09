# 旅行服务前端完善计划

> 创建时间：2026-07-02
> 基于设计文档：travel-system-design-and-verification.md v2.0
> 后台项目：D:\tools\ideaWorkspace\ruoyi-vue-pro
> 后台旅行模块：D:\tools\ideaWorkspace\ruoyi-vue-pro\yudao-module-travel

## 后台项目记录
- **所有后台接口都从 ruoyi-vue-pro 项目提供**
- App 端 API 前缀：`/app-api/travel/`（前端用相对路径 `travel/`，Nitro proxy 加前缀）
- 后台 Controller 目录：`yudao-module-travel/.../controller/app/`

## 开发任务

### 1. 类型定义补全（types/travel.ts）
- [ ] 增加数字枚举映射：LINE_STATUS_MAP / PAYMENT_TYPE_MAP / LINE_TYPE_MAP / TIME_SLOT_MAP / REMAINING_AUDIT_MAP / ORDER_TYPE_MAP
- [ ] 金额辅助函数 fmtYuan(cents)

### 2. 预订单详情完善（pages/user/preorder/[id].vue）
- [ ] 行程详细内容展示（itineraryDetail JSON 按天展示）
- [ ] 第三方收款信息
- [ ] 金额拆分（预付/尾款/比例）
- [ ] 每行 paymentType 中文显示
- [ ] ESCORT 行「去支付」按钮
- [ ] 用户确认时支持上传凭证

### 3. 订单详情完善（pages/user/travel-order/[id].vue）
- [ ] 金额三段（total/online/thirdParty）
- [ ] 每行 lineStatus 中文 + 预付/尾款拆分
- [ ] 尾款确认交互（remainingAuditStatus + 凭证）
- [ ] 随行人员日程表格
- [ ] 行程内容展示
- [ ] 分享按钮

### 4. 支付页完善（pages/user/payment/[lineId].vue）
- [ ] 从预订单获取金额信息
- [ ] 展示支付金额 + 方式说明
- [ ] 发起支付 + 轮询
- [ ] 成功/失败处理

### 5. 重置密码页（pages/user/reset-password.vue + middleware）
- [ ] UI 页面（新密码 + 确认）
- [ ] 中间件检测标记

### 6. 分享落地页（pages/share/travel-order/[id].vue）
- [ ] 行程概览展示
- [ ] 引导注册
