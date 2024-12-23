export const TerminalEnum = {
	UNKNOWN: 0, // 未知, 目的：在无法解析到 terminal 时，使用它
	WECHAT_MINI_PROGRAM: 10, // 微信小程序
	WECHAT_WAP: 11, // 微信公众号
	H5: 20, // H5 网页
	APP: 31, // 手机 App
	PC: 40, // 手机 App
}

/**
 * UserInfo，用户 APP - 用户个人信息 Response VO
 */
export interface UserInfo {
	/**
	 * 用户头像
	 */
	avatar: string
	/**
	 * 是否成为推广员
	 */
	brokerageEnabled: boolean
	/**
	 * 经验值
	 */
	experience: number
	/**
	 * 用户编号
	 */
	id: number
	level?: Level
	/**
	 * 用户手机号
	 */
	mobile: string
	/**
	 * 用户昵称
	 */
	nickname: string
	/**
	 * 积分
	 */
	point: number
	/**
	 * 用户性别
	 */
	sex: number
	[property: string]: any
}

export interface AuthToken {
	/**
	 * 访问令牌
	 */
	accessToken: string
	/**
	 * 过期时间
	 */
	expiresTime: string
	/**
	 * 社交用户 openid
	 */
	openid?: string
	/**
	 * 刷新令牌
	 */
	refreshToken: string
	/**
	 * 用户编号
	 */
	userId: number
	[property: string]: any
}

/**
 * Level，用户 App - 会员等级
 */
export interface Level {
	/**
	 * 等级图标
	 */
	icon?: string
	/**
	 * 等级编号
	 */
	id: number
	/**
	 * 等级
	 */
	level: number
	/**
	 * 等级名称
	 */
	name: string
	[property: string]: any
}

/**
 * Activity，用户 App - 营销活动 Response VO
 */
export interface Activity {
	/**
	 * 活动结束时间
	 */
	endTime: number | string
	/**
	 * 活动编号
	 */
	id: number
	/**
	 * 活动名称
	 */
	name: string
	/**
	 * spu 编号
	 */
	spuId: number
	/**
	 * 活动开始时间
	 */
	startTime: number | string
	/**
	 * 活动类型
	 * 1.秒杀活动 2.砍价活动 3.拼团活动 4.限时折扣 5.满减送 6.会员折扣 7.优惠劵 8.积分
	 */
	type: number
	[property: string]: any
}

export interface Product {
	id: number
	name: string
	introduction: string
	categoryId: number
	picUrl: string
	sliderPicUrls: string[]
	specType: boolean
	price: number
	marketPrice: number
	vipPrice: number
	stock: number
	salesCount: number
}

export interface Recommend {
	id: number
	picUrl: string
	spuId: number
	spuName: string
	price: number
}

export interface Category {
	id: number
	parentId: number
	name: string
	picUrl: string
	childCategory?: Category[]
	childProduct?: Product[]
}

export interface Property {
	propertyId: number
	propertyName: string
	valueId: number
	valueName: string
}

export interface SKU {
	id: number
	properties: Property[]
	price: number
	marketPrice: number
	vipPrice: number
	picUrl: string
	stock: number
	weight: number
	volume: number
	seckillPrice?: number
	combinationPrice?: number
}

export interface ProductDetail {
	propertyList: {
		id: number
		name: string
		values: {
			id: number
			name: string
		}[]
	}[]
	id: number
	name: string
	introduction: string
	description: string
	categoryId: 1
	picUrl: string
	sliderPicUrls: string[]
	specType: boolean
	price: number
	marketPrice: number
	vipPrice: number
	stock: number
	skus: SKU[]
	salesCount: number
}

export interface Review {
	userId: number
	userNickname: string
	userAvatar: string
	id: number
	anonymous: boolean
	orderId: number
	orderItemId: number
	replyStatus: boolean
	replyUserId: number
	replyContent: string
	replyTime: string
	additionalContent: string
	additionalPicUrls: string[]
	additionalTime: string
	createTime: string
	spuId: number
	spuName: string
	skuId: number
	skuProperties: Property[]
	scores: number
	descriptionScores: number
	benefitScores: number
	content: string
	picUrls: string[]
}

export interface Coupon {
	id: number
	name: string
	status: number
	description: string
	takeLimitCount: number
	usePrice: number
	productScope: number
	productScopeValues: number[]
	validityType: number
	validStartTime: string
	validEndTime: string
	fixedStartTerm: number
	fixedEndTerm: number
	discountType: number
	discountPercent: number
	discountPrice: number
	discountLimitPrice: number
	canTake: boolean
}

export interface CartItem {
	id: number
	count: number
	selected: boolean
	disabled?: boolean
	spu: {
		id: number
		name: string
		picUrl: string
		categoryId: number
	}
	sku: SKU
}
export interface ProductBrowseHistory {
	/**
	 * 编号
	 */
	id: number
	/**
	 * 商品封面图
	 */
	picUrl?: string
	/**
	 * 商品单价
	 */
	price?: number
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 商品 SPU 名称
	 */
	spuName: string
	[property: string]: any
}

/**
 * Address APP - 用户收件地址 Response VO
 */
export interface Address {
	/**
	 * 地区编号
	 */
	areaId: number
	/**
	 * 地区名字
	 */
	areaName: string
	/**
	 * 省份名字
	 */
	stateId: number
	/**
	 * 是否默认地址
	 */
	defaultStatus: boolean
	/**
	 * 收件详细地址
	 */
	detailAddress: string
	/**
	 * 编号
	 */
	id: number
	/**
	 * 手机号
	 */
	mobile: string
	/**
	 * 收件人名称
	 */
	name: string
	[property: string]: any
}

export interface Country {
	name: string
	id: number
	phonecode: string
	currencySymbol: string
}

export interface State {
	name: string
	id: number
	countryCode: Country['phonecode']
	countryId: Country['id']
}

export interface City {
	name: string
	id: 1024
	stateId: State['id']
	countryId: Country['id']
}
/**
 * OrderSettlement App - 交易订单结算信息 Response VO
 */
export interface OrderSettlement {
	address: Address
	/**
	 * 支付应用id
	 */
	appId: number
	/**
	 * 购物项数组
	 */
	items: {
		/**
		 * 产品数量
		 */
		count: number
		/**
		 * 出库项编号
		 */
		id?: number
		/**
		 * 产品编号
		 */
		productId: number
		/**
		 * 产品单价
		 */
		productPrice?: number
		/**
		 * 备注
		 */
		remark?: string
		/**
		 * 仓库编号
		 */
		warehouseId: number
		[property: string]: any
	}[]
	price: Price
	/**
	 * 总积分
	 */
	totalPoint: number
	/**
	 * 交易类型(0.普通订单 1.秒杀订单 2.砍价订单 3.拼团订单)
	 */
	type: number
	/**
	 * 已使用的积分
	 */
	usePoint: number
	[property: string]: any
}

/**
 * PayOrderSubmit，用户 APP - 支付订单提交 Response VO
 */
export interface PayOrderSubmit {
	/**
	 * 展示内容
	 */
	displayContent: string
	/**
	 * 展示模式
	 */
	displayMode: string
	/**
	 * 支付状态
	 */
	status: number
	[property: string]: any
}

/**
 * Price，费用（合计）
 */
export interface Price {
	/**
	 * 优惠劵减免金额，单位：分
	 */
	couponPrice: number
	/**
	 * 运费金额，单位：分
	 */
	deliveryPrice: number
	/**
	 * 订单优惠（总），单位：分
	 */
	discountPrice: number
	/**
	 * 实际支付金额（总），单位：分
	 */
	payPrice: number
	/**
	 * 积分抵扣的金额，单位：分
	 */
	pointPrice: number
	/**
	 * 商品原价（总），单位：分
	 */
	totalPrice: number
	/**
	 * VIP 减免金额，单位：分
	 */
	vipPrice: number
	[property: string]: any
}

export interface OrderDetail {
	/**
	 * 订单调价（总）
	 */
	adjustPrice: number
	/**
	 * 订单取消时间
	 */
	cancelTime?: number | string
	/**
	 * 拼团记录编号
	 */
	combinationRecordId?: number
	/**
	 * 是否评价
	 */
	commentStatus: boolean
	/**
	 * 优惠劵编号
	 */
	couponId?: number
	/**
	 * 优惠劵减免金额
	 */
	couponPrice: number
	/**
	 * 下单时间
	 */
	createTime: number | string
	/**
	 * 运费金额
	 */
	deliveryPrice: number
	/**
	 * 发货时间
	 */
	deliveryTime?: number | string
	/**
	 * 配送方式
	 */
	deliveryType: number
	/**
	 * 订单优惠（总）
	 */
	discountPrice: number
	/**
	 * 订单完成时间
	 */
	finishTime?: number | string
	/**
	 * 订单编号
	 */
	id: number
	items?: OrderItem[]
	/**
	 * 发货物流公司编号
	 */
	logisticsId?: number
	/**
	 * 发货物流名称
	 */
	logisticsName?: string
	/**
	 * 发货物流单号
	 */
	logisticsNo?: string
	/**
	 * 订单流水号
	 */
	no: string
	/**
	 * 支付渠道
	 */
	payChannelCode?: string
	/**
	 * 支付渠道名
	 */
	payChannelName?: string
	/**
	 * 付款超时时间
	 */
	payExpireTime: number | string
	/**
	 * 支付订单编号
	 */
	payOrderId: number
	/**
	 * 应付金额（总）
	 */
	payPrice: number
	/**
	 * 是否已支付
	 */
	payStatus: boolean
	/**
	 * 付款时间
	 */
	payTime?: number | string
	/**
	 * 自提门店编号
	 */
	pickUpStoreId?: number
	/**
	 * 自提核销码
	 */
	pickUpVerifyCode?: string
	/**
	 * 积分抵扣的金额
	 */
	pointPrice: number
	/**
	 * 购买的商品数量
	 */
	productCount: number
	/**
	 * 收件人地区编号
	 */
	receiverAreaId: number
	/**
	 * 收件人地区名字
	 */
	receiverAreaName: string
	/**
	 * 收件人详细地址
	 */
	receiverDetailAddress: string
	/**
	 * 收件人手机
	 */
	receiverMobile: string
	/**
	 * 收件人名称
	 */
	receiverName: string
	/**
	 * 收货时间
	 */
	receiveTime?: number | string
	/**
	 * 退款金额，单位：分
	 */
	refundPrice?: number
	/**
	 * 售后状态
	 * 0.未退款
	 * 10.部分退款
	 * 20.全部退款
	 */
	refundStatus?: number
	/**
	 * 订单状态
	 * 10.申请中,会员申请退款,退款申请待商家处理
	 * 20.卖家通过,商家同意退款,请退货并填写物流信息
	 * 30.待卖家收货,会员填写退货物流信息,退货退款申请待商家处理
	 * 40.等待平台退款,商家收货,无（有赞无该状态）
	 * 50.完成,商家确认退款,退款成功
	 * 61.买家取消售后,会员取消退款,退款关闭
	 * 62.卖家拒绝,商家拒绝退款,商家不同意退款申请
	 * 63.卖家拒绝收货,商家拒绝收货,商家拒绝收货，不同意退款
	 */
	status: number
	/**
	 * 商品原价（总）
	 */
	totalPrice: number
	/**
	 * 订单类型
	 */
	type: number
	/**
	 * 用户备注
	 */
	userRemark: string
	/**
	 * VIP 减免金额
	 */
	vipPrice: number
	[property: string]: any
}

/**
 * AppTradeOrderItemRespVO，用户 App - 订单交易项 Response VO
 */
export interface OrderItem {
	/**
	 * 售后编号
	 */
	afterSaleId?: number
	/**
	 * 售后状态
	 * 0.未退款
	 * 10.部分退款
	 * 20.全部退款
	 */
	afterSaleStatus: number
	/**
	 * 是否评价
	 */
	commentStatus: boolean
	/**
	 * 购买数量
	 */
	count: number
	/**
	 * 编号
	 */
	id: number
	/**
	 * 订单编号
	 */
	orderId: number
	/**
	 * 应付金额（总），单位：分
	 */
	payPrice: number
	/**
	 * 商品图片
	 */
	picUrl: string
	/**
	 * 商品原价（单）
	 */
	price: number
	properties?: AppProductPropertyValueDetailRespVO[]
	/**
	 * 商品 SKU 编号
	 */
	skuId: number
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 商品 SPU 名称
	 */
	spuName: string
	[property: string]: any
}

/**
 * AppProductPropertyValueDetailRespVO，用户 App - 商品属性值的明细 Response VO
 */
export interface AppProductPropertyValueDetailRespVO {
	/**
	 * 属性的编号
	 */
	propertyId: number
	/**
	 * 属性的名称
	 */
	propertyName: string
	/**
	 * 属性值的编号
	 */
	valueId: number
	/**
	 * 属性值的名称
	 */
	valueName: string
	[property: string]: any
}

/**
 * ExpressTrack，用户 App - 快递查询的轨迹 Response VO
 */
export interface ExpressTrack {
	/**
	 * 快递状态
	 */
	content: string
	/**
	 * 发生时间
	 */
	time: string
	[property: string]: any
}

/**
 * TradeConfig，用户 App - 交易配置 Response VO
 */
export interface TradeConfig {
	/**
	 * 售后的退款理由
	 */
	afterSaleRefundReasons: string[]
	/**
	 * 售后的退货理由
	 */
	afterSaleReturnReasons: string[]
	/**
	 * 佣金冻结时间（天）
	 */
	brokerageFrozenDays: number
	/**
	 * 分销海报地址数组
	 */
	brokeragePosterUrls: string[]
	/**
	 * 佣金提现最小金额，单位：分
	 */
	brokerageWithdrawMinPrice: number
	/**
	 * 提现方式
	 */
	brokerageWithdrawTypes: number[]
	/**
	 * 是否开启自提
	 */
	deliveryPickUpEnabled: boolean
	/**
	 * 腾讯地图 KEY
	 */
	tencentLbsKey: string
	[property: string]: any
}

/**
 * AfterSale，用户 App - 交易售后 Response VO
 */
export interface AfterSale {
	/**
	 * 补充描述
	 */
	applyDescription: string
	/**
	 * 补充凭证图片
	 */
	applyPicUrls: string[]
	/**
	 * 申请原因
	 */
	applyReason: string
	/**
	 * 退货商品数量
	 */
	count: number
	/**
	 * 创建时间
	 */
	createTime: number | string
	/**
	 * 退货时间
	 */
	deliveryTime?: number | string
	/**
	 * 售后编号
	 */
	id: number
	/**
	 * 退货物流公司编号
	 */
	logisticsId?: number
	/**
	 * 退货物流单号
	 */
	logisticsNo?: string
	/**
	 * 售后流水号
	 */
	no: string
	/**
	 * 交易订单编号
	 */
	orderId: number
	/**
	 * 交易订单项编号
	 */
	orderItemId: number
	/**
	 * 交易订单流水号
	 */
	orderNo: string
	/**
	 * 商品图片
	 */
	picUrl: string
	properties?: AppProductPropertyValueDetailRespVO[]
	/**
	 * 收货备注
	 */
	receiveReason?: string
	/**
	 * 收货时间
	 */
	receiveTime?: number | string
	/**
	 * 退款金额，单位：分
	 */
	refundPrice?: number
	/**
	 * 退款时间
	 */
	refundTime?: number | string
	/**
	 * 商品 SKU 编号
	 */
	skuId: number
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 商品 SPU 名称
	 */
	spuName: string
	/**
	 * 售后状态(10.申请中,会员申请退款,退款申请待商家处理 20.卖家通过,商家同意退款,请退货并填写物流信息 30.待卖家收货,会员填写退货物流信息,退货退款申请待商家处理 40.等待平台退款,商家收货,无（有赞无该状态）50.完成,商家确认退款,退款成功 61.买家取消售后,会员取消退款,退款关闭 62.卖家拒绝,商家拒绝退款,商家不同意退款申请 63.卖家拒绝收货,商家拒绝收货,商家拒绝收货，不同意退款)
	 */
	status: number
	/**
	 * 售后类型
	 * 10.售中退款(交易完成前买家申请退款)
	 * 20.售后退款(交易完成后买家申请退款)
	 */
	type: number
	/**
	 * 更新时间
	 */
	updateTime: string
	/**
	 * 售后方式
	 * 10.仅退款
	 * 20.退货退款
	 */
	way: number
	[property: string]: any
}

/**
 * PayWallet APP - 用户钱包 Response VO
 */
export interface PayWallet {
	/**
	 * 钱包余额，单位分
	 */
	balance: number
	/**
	 * 累计支出，单位分
	 */
	totalExpense: number
	/**
	 * 累计充值，单位分
	 */
	totalRecharge: number
	[property: string]: any
}

/**
 * PayWalletTransaction，用户 APP - 钱包流水分页 Response VO
 */
export interface PayWalletTransaction {
	/**
	 * 业务分类
	 */
	bizType: number
	/**
	 * 交易时间
	 */
	createTime: number | string
	/**
	 * 交易金额，单位分
	 */
	price: number
	/**
	 * 流水标题
	 */
	title: string
	[property: string]: any
}
/**
 * PointRecord，用户 App - 用户积分记录 Response VO
 */
export interface PointRecord {
	/**
	 * 发生时间
	 */
	createTime: number | string
	/**
	 * 积分描述
	 */
	description?: string
	/**
	 * 自增主键
	 */
	id: number
	/**
	 * 积分
	 */
	point: number
	/**
	 * 积分标题
	 */
	title: string
	[property: string]: any
}

export interface SignInConfig {
	/**
	 * 签到第 x 天
	 */
	day: number
	/**
	 * 奖励积分
	 */
	point: number
	[property: string]: any
}

export interface SignIn {
	/**
	 * 连续签到第 x 天
	 */
	continuousDay: number
	/**
	 * 今天是否已签到
	 */
	todaySignIn: boolean
	/**
	 * 总签到天数
	 */
	totalDay: number
	[property: string]: any
}

export interface MemberLevel {
	/**
	 * 等级背景图
	 */
	backgroundUrl?: string
	/**
	 * 享受折扣
	 */
	discountPercent: number
	/**
	 * 升级经验
	 */
	experience: number
	/**
	 * 等级图标
	 */
	icon?: string
	/**
	 * 等级
	 */
	level: number
	/**
	 * 等级名称
	 */
	name: string
	[property: string]: any
}

/**
 * ExperienceRecord，用户 App - 会员经验记录 Response VO
 */
export interface ExperienceRecord {
	/**
	 * 创建时间
	 */
	createTime: number | string
	/**
	 * 描述
	 */
	description: string
	/**
	 * 经验
	 */
	experience: number
	/**
	 * 标题
	 */
	title: string
	[property: string]: any
}

/**
 * ArticleCategory，应用 App - 文章分类 Response VO
 */
export interface ArticleCategory {
	/**
	 * 分类编号
	 */
	id: number
	/**
	 * 分类名称
	 */
	name: string
	/**
	 * 分类图标
	 */
	picUrl: string
	[property: string]: any
}

/**
 * Article，应用 App - 文章 Response VO
 */
export interface Article {
	/**
	 * 文章作者
	 */
	author: string
	/**
	 * 浏览量
	 */
	browseCount: number
	/**
	 * 分类编号
	 */
	categoryId: number
	/**
	 * 文章内容
	 */
	content: string
	/**
	 * 发布时间
	 */
	createTime: number | string
	/**
	 * 文章编号
	 */
	id: number
	/**
	 * 文章简介
	 */
	introduction: string
	/**
	 * 图文封面
	 */
	picUrl: string
	/**
	 * 关联的商品 SPU 编号
	 */
	spuId?: number
	/**
	 * 文章标题
	 */
	title: string
	[property: string]: any
}

/**
 * ProductSpu，用户 App - 商品 SPU Response VO
 */
export interface ProductSpu {
	/**
	 * 分类编号
	 */
	categoryId: number
	/**
	 * 商品 SPU 编号
	 */
	id: number
	/**
	 * 商品简介
	 */
	introduction: string
	/**
	 * 市场价，单位使用：分
	 */
	marketPrice: number
	/**
	 * 商品名称
	 */
	name: string
	/**
	 * 商品封面图
	 */
	picUrl: string
	/**
	 * 商品价格，单位使用：分
	 */
	price: number
	/**
	 * 商品销量
	 */
	salesCount: number
	/**
	 * 商品轮播图
	 */
	sliderPicUrls: string[]
	/**
	 * 规格类型
	 */
	specType: boolean
	/**
	 * 库存
	 */
	stock: number
	/**
	 * VIP 价格，单位使用：分
	 */
	vipPrice: number
	[property: string]: any
}

/**
 * BargainActivity，用户 App - 砍价活动 Response VO
 */
export interface BargainActivity {
	/**
	 * 砍价最低金额，单位：分
	 */
	bargainMinPrice: number
	/**
	 * 活动结束时间
	 */
	endTime: string
	/**
	 * 砍价活动编号
	 */
	id: number
	/**
	 * 商品市场价，单位：分
	 */
	marketPrice: number
	/**
	 * 砍价活动名称
	 */
	name: string
	/**
	 * 商品图片
	 */
	picUrl: string
	/**
	 * 商品 SKU 编号
	 */
	skuId: number
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 活动开始时间
	 */
	startTime: string
	/**
	 * 砍价库存
	 */
	stock: number
	orderId?: string
	payOrderId?: string
	payStatus?: string
	helpCount?: number
	[property: string]: any
}

/**
 * BargainHelp，用户 App - 砍价助力 Response VO
 */
export interface BargainHelp {
	/**
	 * 助力用户的头像
	 */
	avatar: string
	/**
	 * 创建时间
	 */
	createTime: string | number
	/**
	 * 助力用户的昵称
	 */
	nickname: string
	/**
	 * 助力用户的砍价金额
	 */
	reducePrice: number
	/**
	 * 用户编号
	 */
	userId: number
	[property: string]: any
}

/**
 * SeckillConfig，用户 App - 秒杀时间段 Response VO
 */
export interface SeckillConfig {
	/**
	 * 结束时间点
	 */
	endTime: string
	/**
	 * 秒杀时间段编号
	 */
	id: number
	/**
	 * 轮播图
	 */
	sliderPicUrls: string[]
	/**
	 * 开始时间点
	 */
	startTime: string
	[property: string]: any
}

/**
 * SeckillActivity，用户 App - 秒杀活动 Response VO
 */
export interface SeckillActivity {
	/**
	 * 秒杀活动编号
	 */
	id: number
	/**
	 * 商品市场价，单位：分
	 */
	marketPrice: number
	/**
	 * 秒杀活动名称
	 */
	name: string
	/**
	 * 商品图片
	 */
	picUrl: string
	/**
	 * 秒杀金额，单位：分
	 */
	seckillPrice: number
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 秒杀活动状态
	 */
	status: number
	/**
	 * 秒杀库存（剩余）
	 */
	stock: number
	/**
	 * 秒杀库存（总共）
	 */
	totalStock: number
	products: {
		seckillPrice: number
		skuId: number
		stock: number
	}[]
	[property: string]: any
}

/**
 * CombinationActivity，用户 App - 拼团活动 Response VO
 */
export interface CombinationActivity {
	/**
	 * 拼团金额，单位：分
	 */
	combinationPrice: number
	/**
	 * 拼团活动编号
	 */
	id: number
	/**
	 * 商品市场价，单位：分
	 */
	marketPrice: number
	/**
	 * 拼团活动名称
	 */
	name: string
	/**
	 * 商品图片
	 */
	picUrl: string
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 拼团人数
	 */
	userSize: number
	[property: string]: any
}

/**
 * CombinationActivityDetail，用户 App - 拼团活动明细 Response VO
 */
export interface CombinationActivityDetail {
	/**
	 * 活动结束时间
	 */
	endTime: string | number
	/**
	 * 拼团活动编号
	 */
	id: number
	/**
	 * 拼团活动名称
	 */
	name: string
	/**
	 * 商品信息数组
	 */
	products: {
		combinationPrice: number
		skuId: number
	}[]
	/**
	 * 单次限购数量
	 */
	singleLimitCount?: number
	/**
	 * 商品 SPU 编号
	 */
	spuId: number
	/**
	 * 活动开始时间
	 */
	startTime: string | number
	/**
	 * 活动状态
	 */
	status: number
	/**
	 * 成功的拼团数量
	 */
	successCount: number
	/**
	 * 总共限购数量
	 */
	totalLimitCount?: number
	/**
	 * 拼团人数
	 */
	userSize: number
	[property: string]: any
}

/**
 * CombinationRecord，用户 App - 拼团记录 Response VO
 */
export interface CombinationRecord {
	/**
	 * 拼团活动编号
	 */
	activityId: number
	/**
	 * 用户头像
	 */
	avatar: string
	/**
	 * 拼团金额，单位：分
	 */
	combinationPrice: number
	/**
	 * 购买的商品数量
	 */
	count: number
	/**
	 * 过期时间
	 */
	expireTime: number
	/**
	 * 拼团记录编号
	 */
	id: number
	/**
	 * 用户昵称
	 */
	nickname: string
	/**
	 * 订单编号
	 */
	orderId: number
	/**
	 * 商品图片
	 */
	picUrl: string
	/**
	 * 商品名字
	 */
	spuName: string
	/**
	 * 拼团状态
	 */
	status: number
	/**
	 * 已参团人数
	 */
	userCount: number
	/**
	 * 可参团人数
	 */
	userSize: number
	[property: string]: any
}

/**
 * CombinationRecordDetail，用户 App - 拼团记录详细 Response VO
 */
export interface CombinationRecordDetail {
	headRecord: CombinationRecord
	/**
	 * 成员的拼团记录
	 */
	memberRecords: CombinationRecord[]
	/**
	 * 当前用户参团记录对应的订单编号
	 */
	orderId: number
	[property: string]: any
}

export interface CouponTemplate {
	/**
	 * 是否可以领取
	 */
	canTake: boolean
	/**
	 * 优惠券说明
	 */
	description?: string
	/**
	 * 折扣上限
	 */
	discountLimitPrice?: number
	/**
	 * 折扣百分比
	 */
	discountPercent?: number
	/**
	 * 优惠金额
	 */
	discountPrice?: number
	/**
	 * 优惠类型
	 */
	discountType: number
	/**
	 * 领取日期 - 结束天数
	 */
	fixedEndTerm?: number
	/**
	 * 领取日期 - 开始天数
	 */
	fixedStartTerm?: number
	/**
	 * 优惠劵模板编号
	 */
	id: number
	/**
	 * 优惠劵名
	 */
	name: string
	/**
	 * 商品范围
	 */
	productScope: number
	/**
	 * 商品范围编号的数组
	 */
	productScopeValues: number[]
	/**
	 * 每人限领个数
	 */
	takeLimitCount: number
	/**
	 * 是否设置满多少金额可用
	 */
	usePrice: number
	/**
	 * 固定日期 - 生效结束时间
	 */
	validEndTime?: Date
	/**
	 * 生效日期类型
	 */
	validityType: number
	/**
	 * 固定日期 - 生效开始时间
	 */
	validStartTime?: Date
	[property: string]: any
}

/**
 * AfterSaleLog，管理后台 - App 交易售后日志 Response VO
 */
export interface AfterSaleLog {
	/**
	 * 操作明细
	 */
	content: string
	/**
	 * 创建时间
	 */
	createTime: Date
	/**
	 * 编号
	 */
	id: number
	[property: string]: any
}
