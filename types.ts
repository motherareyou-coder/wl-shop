export interface Product {
	id: number
	name: string
	introduction: string
	categoryId: number
	picUrl: string
	sliderPicUrls: string[]
	specType: true
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
	children?: Product[]
}

export interface Property {
	propertyId: number
	propertyName: string
	valueId: number
	valueName: string
}

const properties = [
	{
		propertyId: 1,
		propertyName: 'Color',
		options: [
			{ valueId: 1, valueName: 'Red' },
			{ valueId: 2, valueName: 'Blue' },
		],
	},
	{
		propertyId: 2,
		propertyName: 'Storage',
		options: [
			{ valueId: 1, valueName: '12GB + 256GB' },
			{ valueId: 2, valueName: '12GB + 512GB' },
		],
	},
]

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
	selected: true
	disabled?: boolean
	checked?: boolean
	spu: {
		id: number
		name: string
		picUrl: string
		categoryId: number
	}
	sku: {
		id: number
		picUrl: string
		price: number
		stock: number
		properties: number[]
	}
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
	cancelTime?: Date
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
	createTime: Date
	/**
	 * 运费金额
	 */
	deliveryPrice: number
	/**
	 * 发货时间
	 */
	deliveryTime?: Date
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
	finishTime?: Date
	/**
	 * 订单编号
	 */
	id: number
	items?: AppTradeOrderItemRespVO[]
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
	payExpireTime: Date
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
	payTime?: Date
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
	receiveTime?: Date
	/**
	 * 退款金额，单位：分
	 */
	refundPrice?: number
	/**
	 * 售后状态
	 */
	refundStatus?: number
	/**
	 * 订单状态
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
export interface AppTradeOrderItemRespVO {
	/**
	 * 售后编号
	 */
	afterSaleId?: number
	/**
	 * 售后状态
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
