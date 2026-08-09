/**
 * 旅行陪侍服务 - 类型定义
 * 对齐后台 yudao-module-travel 的 App Controller 接口
 */

/* ===== 旅行诉求 ===== */
export interface TravelInquiry {
	id: number
	email?: string
	mobile?: string
	destination: string
	startDate: string
	endDate?: string
	travelerCount?: number
	budget?: string
	preferences?: string // JSON 数组
	specialRequirements?: string
	needEscort?: boolean
	status?: string // CRM 线索状态
	memberUserId?: number
	createTime?: string
}

export interface TravelInquiryCreateReq {
	email: string // 必填
	mobile?: string
	destination: string // 必填
	startDate: string // 必填 YYYY-MM-DD
	endDate?: string
	travelerCount?: number
	budget?: string
	preferences?: string // JSON 数组字符串
	specialRequirements?: string
	needEscort?: boolean
}

/* ===== 随行服务诉求 ===== */
export interface EscortInquiry {
	id: number
	travelInquiryId?: number
	preOrderId?: number
	destination: string
	startDate: string
	endDate: string
	languageNeeds?: string // JSON 数组
	serviceTypes?: string // JSON 数组
	travelerCount?: number
	specialRequirements?: string
	isOwnItinerary?: boolean
	ownItineraryDesc?: string
	status?: string
	memberUserId?: number
	createTime?: string
}

export interface EscortInquiryCreateReq {
	travelInquiryId?: number
	preOrderId?: number
	destination: string // 必填
	startDate: string // 必填
	endDate: string // 必填
	languageNeeds?: string
	serviceTypes?: string
	travelerCount?: number
	specialRequirements?: string
	isOwnItinerary?: boolean
	ownItineraryDesc?: string
}

/* ===== 预订单 ===== */
export interface PreOrder {
	id: number
	orderNo?: string
	status: PreOrderStatus
	memberUserId?: number
	travelInquiryId?: number
	escortInquiryId?: number
	totalAmount?: number
	lines?: PreOrderLine[]
	createTime?: string
}

export interface PreOrderLine {
	id: number
	preOrderId: number
	lineType: 'TRAVEL' | 'ESCORT'
	title?: string
	amount?: number
	assignments?: PreOrderLineAssignment[]
}

export interface PreOrderLineAssignment {
	id: number
	preOrderLineId: number
	serviceMemberId?: number
	serviceMemberName?: string
	assignDate: string
	timeSlot: 'FULL_DAY' | 'HALF_DAY'
	price?: number
}

export type PreOrderStatus =
	| 'DRAFT'
	| 'SENT'
	| 'USER_CONFIRMED'
	| 'ADMIN_CONFIRMED'
	| 'ORDER_CREATED'
	| 'CANCELLED'

export interface PreOrderConfirmReq {
	id: number
	userRemark?: string
	paymentProof?: string // JSON 图片 URL 数组
}

/* ===== 订单 ===== */
export interface TravelOrder {
	id: number
	orderNo?: string
	status: OrderStatus
	orderType?: string
	memberUserId?: number
	totalAmount?: number
	lines?: OrderLine[]
	payment?: OrderPayment
	createTime?: string
}

export interface OrderLine {
	id: number
	orderId: number
	lineType: 'TRAVEL' | 'ESCORT'
	title?: string
	amount?: number
	status?: string
	assignments?: OrderLineAssignment[]
}

export interface OrderLineAssignment {
	id: number
	orderLineId: number
	serviceMemberId?: number
	serviceMemberName?: string
	assignDate: string
	timeSlot: 'FULL_DAY' | 'HALF_DAY'
	price?: number
}

export interface OrderPayment {
	totalAmount?: number
	prepaymentAmount?: number
	prepaymentRatio?: number
	prepaymentStatus?: 'PAID' | 'UNPAID'
	prepaymentTime?: string
	remainingAmount?: number
	remainingType?: 'ONLINE' | 'OFFLINE' | 'NONE'
	remainingStatus?: 'PAID' | 'UNPAID' | 'NOT_REQUIRED'
	remainingTime?: string
	paymentType?: 'PARTIAL_ONLINE' | 'FULL_ONLINE' | 'THIRD_PARTY'
	thirdPartyInfo?: string
}

export type OrderStatus = 'CREATED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED'

/* ===== 支付 ===== */
export interface PaymentCreateReq {
	preOrderLineId: number
}

export interface PaymentCreateResp {
	payOrderId: number
	payPrice: number // 分
	appKey: string
}

/* ===== 沟通记录 ===== */
export interface CommunicationLog {
	id: number
	relatedType: 'CLUE' | 'PRE_ORDER' | 'ORDER'
	relatedId: number
	type: 'AUTO_EMAIL' | 'MANUAL_EMAIL' | 'MANUAL_INPUT' | 'SYSTEM'
	direction: 'OUTGOING' | 'INCOMING'
	source?: string
	content: string
	attachments?: string
	operator?: string
	createTime: string
}

/* ===== 状态中文映射 ===== */
export const PRE_ORDER_STATUS_MAP: Record<PreOrderStatus, { label: string; color: string }> = {
	DRAFT: { label: '草稿', color: '#898989' },
	SENT: { label: '待确认', color: '#A16207' },
	USER_CONFIRMED: { label: '已确认', color: '#2563eb' },
	ADMIN_CONFIRMED: { label: '已核实', color: '#2563eb' },
	ORDER_CREATED: { label: '已转订单', color: '#16a34a' },
	CANCELLED: { label: '已取消', color: '#dc2626' },
}

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
	CREATED: { label: '已创建', color: '#898989' },
	IN_SERVICE: { label: '服务中', color: '#A16207' },
	COMPLETED: { label: '已完成', color: '#16a34a' },
	CANCELLED: { label: '已取消', color: '#dc2626' },
}

/* ===== 后端数字枚举映射（后端返回数字，前端展示中文）===== */

// 预订单状态（后端 0-5）
export const PRE_ORDER_STATUS_NUM_MAP: Record<number, { label: string; color: string }> = {
	0: { label: '草稿', color: '#898989' },
	1: { label: '待确认', color: '#A16207' },
	2: { label: '已确认', color: '#2563eb' },
	3: { label: '已核实', color: '#2563eb' },
	4: { label: '已转订单', color: '#16a34a' },
	5: { label: '已取消', color: '#dc2626' },
}

// 订单状态（后端 0-3）
export const ORDER_STATUS_NUM_MAP: Record<number, { label: string; color: string }> = {
	0: { label: '已创建', color: '#898989' },
	1: { label: '服务中', color: '#A16207' },
	2: { label: '已完成', color: '#16a34a' },
	3: { label: '已取消', color: '#dc2626' },
}

// 订单行状态（后端 0-8）
export const LINE_STATUS_MAP: Record<number, { label: string; color: string }> = {
	0: { label: '待处理', color: '#898989' },
	1: { label: '已分配', color: '#2563eb' },
	2: { label: '用户已确认', color: '#2563eb' },
	3: { label: '支付中', color: '#A16207' },
	4: { label: '预付已付', color: '#16a34a' },
	5: { label: '等待尾款', color: '#A16207' },
	6: { label: '全款已付', color: '#16a34a' },
	7: { label: '服务中', color: '#A16207' },
	8: { label: '已完成', color: '#16a34a' },
}

// 支付方式（后端 1-3）
export const PAYMENT_TYPE_MAP: Record<number, string> = {
	1: '第三方收款',
	2: '线上预付',
	3: '线上全款',
}

// 订单行类型（后端 1-3）
export const LINE_TYPE_MAP: Record<number, string> = {
	1: '旅行安排',
	2: '随行服务',
	3: '随行服务（自有行程）',
}

// 时段（后端 1-3）
export const TIME_SLOT_MAP: Record<number, string> = {
	1: '全天',
	2: '上午',
	3: '下午',
}

// 尾款审核状态（后端 0-2）
export const REMAINING_AUDIT_MAP: Record<number, { label: string; color: string }> = {
	0: { label: '待审核', color: '#A16207' },
	1: { label: '已通过', color: '#16a34a' },
	2: { label: '已拒绝', color: '#dc2626' },
}

// 订单类型（后端 1-3）
export const ORDER_TYPE_MAP: Record<number, string> = {
	1: '旅行安排',
	2: '随行服务',
	3: '组合服务',
}

// 沟通记录类型（后端数字）
export const COMM_LOG_TYPE_MAP: Record<number, { icon: string; label: string }> = {
	1: { icon: '📧', label: '自动邮件' },
	2: { icon: '📧', label: '人工邮件' },
	3: { icon: '✏️', label: '人工录入' },
	4: { icon: '🔧', label: '系统' },
}

// 沟通记录方向（后端数字）
export const COMM_LOG_DIR_MAP: Record<number, string> = {
	1: 'OUTGOING', // 发出
	2: 'INCOMING', // 收到
}

/* ===== 辅助函数 ===== */

/** 分转元 */
export function fmtYuan(cents?: number | null): string {
	if (cents == null) return '--'
	return `¥${(cents / 100).toFixed(2)}`
}

/** 解析行程 JSON（itineraryDetail 字段） */
export function parseItinerary(json?: string): Array<{ day?: number; title?: string; desc?: string }> {
	if (!json) return []
	try {
		const parsed = JSON.parse(json)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

/** 解析 JSON 数组字符串（preferences/languageNeeds/serviceTypes） */
export function parseJsonArray(json?: string): string[] {
	if (!json) return []
	try {
		const parsed = JSON.parse(json)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}
