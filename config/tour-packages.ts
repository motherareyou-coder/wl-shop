/**
 * 灵活订购套餐数据（订购页 + 详情页共用）
 * 后续接口就绪后，改为从 API 加载，此处作为静态兜底
 */

export interface TourPackageAddon {
	name: string
	nameKey: string
	nameFallback: string
	price: string
	priceKey: string
	priceFallback: string
	unit: string
	desc: string
	descKey: string
	descFallback: string
}

export interface TourPackageStep {
	title: string
	titleKey: string
	titleFallback: string
	desc: string
	descKey: string
	descFallback: string
}

export interface TourPackagePlan {
	id: string
	name: string
	nameKey: string
	nameFallback: string
	nameEn: string
	subtitle: string
	subtitleKey: string
	subtitleFallback: string
	suitableFor: string
	suitableForKey: string
	suitableForFallback: string
	steps: TourPackageStep[]
	priceFrom: string
	priceKey: string
	priceFallback: string
	priceUnit: string
	priceUnitKey: string
	priceUnitFallback: string
	ctaText: string
	ctaKey: string
	ctaFallback: string
	ctaLink: string
	popular: boolean
}

export interface TourPackageItinerary {
	day: number
	title: string
	titleKey: string
	titleFallback: string
	desc: string
	descKey: string
	descFallback: string
}

export interface TourPackage {
	id: number
	slug: string
	title: string
	titleKey: string
	titleFallback: string
	subtitle: string
	subtitleKey: string
	subtitleFallback: string
	desc: string
	descKey: string
	descFallback: string
	image: string
	days: number
	difficulty: string
	difficultyKey: string
	difficultyFallback: string
	bestSeason: string
	bestSeasonKey: string
	bestSeasonFallback: string
	audience: string[]
	price: string
	priceKey: string
	priceFallback: string
	routeRange: string
	highlights: string[]
	itinerary: TourPackageItinerary[]
	includes: string[]
	excludes: string[]
	addons: string[]
}

// ============= 三大订购模式 =============

export const packagePlans: TourPackagePlan[] = [
	{
		id: 'explorer',
		name: '探索家',
		nameKey: 'tour.packagesPage.plans.explorer.name',
		nameFallback: '探索家',
		nameEn: 'Explorer',
		subtitle: '仅定制私人行程',
		subtitleKey: 'tour.packagesPage.plans.explorer.subtitle',
		subtitleFallback: '不含陪侍，专注行程规划与本地资源对接',
		suitableFor: '适合喜欢自由行、需要专业规划的客户',
		suitableForKey: 'tour.packagesPage.plans.explorer.suitableFor',
		suitableForFallback: '适合喜欢自由行、需要专业规划的客户',
		steps: [
			{
				title: '提交行程需求',
				titleKey: 'tour.packagesPage.plans.explorer.step1',
				titleFallback: '提交行程需求',
				desc: '在线填写目的地、人数、预算、出行偏好',
				descKey: 'tour.packagesPage.plans.explorer.step1Desc',
				descFallback: '在线填写目的地、人数、预算、出行偏好',
			},
			{
				title: '匹配本地旅行社',
				titleKey: 'tour.packagesPage.plans.explorer.step2',
				titleFallback: '匹配本地旅行社',
				desc: '24h 内匹配最佳本地合作伙伴，报价透明',
				descKey: 'tour.packagesPage.plans.explorer.step2Desc',
				descFallback: '24h 内匹配最佳本地合作伙伴，报价透明',
			},
			{
				title: '确认行程方案',
				titleKey: 'tour.packagesPage.plans.explorer.step3',
				titleFallback: '确认行程方案',
				desc: '规划师细化路线与安排，调整至您满意',
				descKey: 'tour.packagesPage.plans.explorer.step3Desc',
				descFallback: '规划师细化路线与安排，调整至您满意',
			},
			{
				title: '落地出行',
				titleKey: 'tour.packagesPage.plans.explorer.step4',
				titleFallback: '落地出行',
				desc: '提供电子路书全程指引，您可自主灵活出行',
				descKey: 'tour.packagesPage.plans.explorer.step4Desc',
				descFallback: '提供电子路书全程指引，您可自主灵活出行',
			},
		],
		priceFrom: '¥3,000',
		priceKey: 'tour.packagesPage.plans.explorer.priceFrom',
		priceFallback: '¥3,000',
		priceUnit: '/人起',
		priceUnitKey: 'tour.packagesPage.pricePerPerson',
		priceFallback: '/人起',
		ctaText: '开始定制',
		ctaKey: 'tour.packagesPage.plans.explorer.cta',
		ctaFallback: '开始定制',
		ctaLink: '/custom',
		popular: false,
	},
	{
		id: 'companion',
		name: '陪伴家',
		nameKey: 'tour.packagesPage.plans.companion.name',
		nameFallback: '陪伴家',
		nameEn: 'Companion',
		subtitle: '仅需私人情感助理',
		subtitleKey: 'tour.packagesPage.plans.companion.subtitle',
		subtitleFallback: '不含行程，专注专属陪侍与情感陪伴服务',
		suitableFor: '适合已有行程安排、需要专属陪伴的客户',
		suitableForKey: 'tour.packagesPage.plans.companion.suitableFor',
		suitableForFallback: '适合已有行程安排、需要专属陪伴的客户',
		steps: [
			{
				title: '提交陪侍需求',
				titleKey: 'tour.packagesPage.plans.companion.step1',
				titleFallback: '提交陪侍需求',
				desc: '说明使用场景、时间安排、特殊要求与偏好',
				descKey: 'tour.packagesPage.plans.companion.step1Desc',
				descFallback: '说明使用场景、时间安排、特殊要求与偏好',
			},
			{
				title: '匹配专属助理',
				titleKey: 'tour.packagesPage.plans.companion.step2',
				titleFallback: '匹配专属助理',
				desc: '根据需求匹配最合适的陪侍师，严格筛选',
				descKey: 'tour.packagesPage.plans.companion.step2Desc',
				descFallback: '根据需求匹配最合适的陪侍师，严格筛选',
			},
			{
				title: '确认服务方案',
				titleKey: 'tour.packagesPage.plans.companion.step3',
				titleFallback: '确认服务方案',
				desc: '沟通服务细节，确认内容与礼仪规范',
				descKey: 'tour.packagesPage.plans.companion.step3Desc',
				descFallback: '沟通服务细节，确认内容与礼仪规范',
			},
			{
				title: '上门服务',
				titleKey: 'tour.packagesPage.plans.companion.step4',
				titleFallback: '上门服务',
				desc: '专属陪侍师按约定时间准时提供专业服务',
				descKey: 'tour.packagesPage.plans.companion.step4Desc',
				descFallback: '专属陪侍师按约定时间准时提供专业服务',
			},
		],
		priceFrom: '¥2,000',
		priceKey: 'tour.packagesPage.plans.companion.priceFrom',
		priceFallback: '¥2,000',
		priceUnit: '/天起',
		priceUnitKey: 'tour.packagesPage.pricePerDay',
		priceFallback: '/天起',
		ctaText: '立即预约',
		ctaKey: 'tour.packagesPage.plans.companion.cta',
		ctaFallback: '立即预约',
		ctaLink: '/companion',
		popular: false,
	},
	{
		id: 'premium',
		name: '尊享家',
		nameKey: 'tour.packagesPage.plans.premium.name',
		nameFallback: '尊享家',
		nameEn: 'Premium',
		subtitle: '全套尊享服务',
		subtitleKey: 'tour.packagesPage.plans.premium.subtitle',
		subtitleFallback: '行程定制 + 陪侍服务一站式，全程无忧',
		suitableFor: '适合想要省心无忧、一站式全包的高端客户',
		suitableForKey: 'tour.packagesPage.plans.premium.suitableFor',
		suitableForFallback: '适合想要省心无忧、一站式全包的高端客户',
		steps: [
			{
				title: '提交综合需求',
				titleKey: 'tour.packagesPage.plans.premium.step1',
				titleFallback: '提交综合需求',
				desc: '行程偏好与陪侍需求一次提交，无需分步',
				descKey: 'tour.packagesPage.plans.premium.step1Desc',
				descFallback: '行程偏好与陪侍需求一次提交，无需分步',
			},
			{
				title: '匹配专业团队',
				titleKey: 'tour.packagesPage.plans.premium.step2',
				titleFallback: '匹配专业团队',
				desc: '本地旅行社与陪侍师双重匹配，协同安排',
				descKey: 'tour.packagesPage.plans.premium.step2Desc',
				descFallback: '本地旅行社与陪侍师双重匹配，协同安排',
			},
			{
				title: '确认全程方案',
				titleKey: 'tour.packagesPage.plans.premium.step3',
				titleFallback: '确认全程方案',
				desc: '行程与陪侍无缝衔接，每个细节确认到位',
				descKey: 'tour.packagesPage.plans.premium.step3Desc',
				descFallback: '行程与陪侍无缝衔接，每个细节确认到位',
			},
			{
				title: '全程管家服务',
				titleKey: 'tour.packagesPage.plans.premium.step4',
				titleFallback: '全程管家服务',
				desc: '出发到返回，7×24 中文管家全程跟进',
				descKey: 'tour.packagesPage.plans.premium.step4Desc',
				descFallback: '出发到返回，7×24 中文管家全程跟进',
			},
		],
		priceFrom: '¥8,000',
		priceKey: 'tour.packagesPage.plans.premium.priceFrom',
		priceFallback: '¥8,000',
		priceUnit: '/人起',
		priceUnitKey: 'tour.packagesPage.pricePerPerson',
		priceFallback: '/人起',
		ctaText: '立即定制',
		ctaKey: 'tour.packagesPage.plans.premium.cta',
		ctaFallback: '立即定制',
		ctaLink: '/custom?full=true',
		popular: true,
	},
]

// ============= 服务对比矩阵 =============

export interface ComparisonItem {
	name: string
	nameKey: string
	nameFallback: string
	explorer: 'yes' | 'no' | 'optional'
	companion: 'yes' | 'no' | 'optional'
	premium: 'yes' | 'no' | 'optional'
	group?: string // 分组标题
}

export const comparisonItems: ComparisonItem[] = [
	// 行程相关
	{ name: '行程规划', nameKey: 'tour.packagesPage.compare.itinerary', nameFallback: '行程规划', explorer: 'yes', companion: 'no', premium: 'yes', group: '行程服务' },
	{ name: '本地向导', nameKey: 'tour.packagesPage.compare.guide', nameFallback: '本地向导', explorer: 'yes', companion: 'no', premium: 'yes' },
	{ name: '住宿预订', nameKey: 'tour.packagesPage.compare.hotel', nameFallback: '住宿预订', explorer: 'yes', companion: 'no', premium: 'yes' },
	{ name: '门票景点', nameKey: 'tour.packagesPage.compare.tickets', nameFallback: '门票景点', explorer: 'yes', companion: 'no', premium: 'yes' },
	// 陪伴相关
	{ name: '陪同服务', nameKey: 'tour.packagesPage.compare.companion', nameFallback: '陪同服务', explorer: 'no', companion: 'yes', premium: 'yes', group: '陪伴服务' },
	{ name: '文化讲解', nameKey: 'tour.packagesPage.compare.culture', nameFallback: '文化讲解', explorer: 'no', companion: 'yes', premium: 'yes' },
	{ name: '翻译服务', nameKey: 'tour.packagesPage.compare.translation', nameFallback: '翻译服务', explorer: 'optional', companion: 'optional', premium: 'yes' },
	{ name: '商务接待', nameKey: 'tour.packagesPage.compare.business', nameFallback: '商务接待', explorer: 'no', companion: 'optional', premium: 'yes' },
	// 增值服务
	{ name: '专车接送', nameKey: 'tour.packagesPage.compare.car', nameFallback: '专车接送', explorer: 'no', companion: 'no', premium: 'yes', group: '增值服务' },
	{ name: '摄影跟拍', nameKey: 'tour.packagesPage.compare.photo', nameFallback: '摄影跟拍', explorer: 'no', companion: 'no', premium: 'optional' },
	{ name: '旅行保险', nameKey: 'tour.packagesPage.compare.insurance', nameFallback: '旅行保险', explorer: 'optional', companion: 'no', premium: 'yes' },
	// 保障
	{ name: '管家跟进', nameKey: 'tour.packagesPage.compare.butler', nameFallback: '管家跟进', explorer: 'yes', companion: 'yes', premium: 'yes', group: '售后保障' },
	{ name: '应急响应', nameKey: 'tour.packagesPage.compare.emergency', nameFallback: '应急响应', explorer: 'phone', companion: 'phone', premium: '24h' },
]

// ============= A la carte 加购模块 =============

export const packageAddons: TourPackageAddon[] = [
	{
		name: '摄影跟拍',
		nameKey: 'tour.packagesPage.addons.photo.name',
		nameFallback: '摄影跟拍',
		price: '¥500',
		priceKey: 'tour.packagesPage.addons.photo.price',
		priceFallback: '¥500',
		unit: '/天',
		desc: '专业摄影师全程跟拍，精修30张',
		descKey: 'tour.packagesPage.addons.photo.desc',
		descFallback: '专业摄影师全程跟拍，精修30张',
	},
	{
		name: '花艺布置',
		nameKey: 'tour.packagesPage.addons.floral.name',
		nameFallback: '花艺布置',
		price: '¥800',
		priceKey: 'tour.packagesPage.addons.floral.price',
		priceFallback: '¥800',
		unit: '/次',
		desc: '鲜花/气球/蜡烛等浪漫氛围营造',
		descKey: 'tour.packagesPage.addons.floral.desc',
		descFallback: '鲜花/气球/蜡烛等浪漫氛围营造',
	},
	{
		name: '专车升级',
		nameKey: 'tour.packagesPage.addons.carUpgrade.name',
		nameFallback: '专车升级',
		price: '¥300',
		priceKey: 'tour.packagesPage.addons.carUpgrade.price',
		priceFallback: '¥300',
		unit: '/天',
		desc: '升级为商务车/GL8/埃尔法',
		descKey: 'tour.packagesPage.addons.carUpgrade.desc',
		descFallback: '升级为商务车/GL8/埃尔法',
	},
	{
		name: '多语种翻译',
		nameKey: 'tour.packagesPage.addons.translator.name',
		nameFallback: '多语种翻译',
		price: '¥400',
		priceKey: 'tour.packagesPage.addons.translator.price',
		priceFallback: '¥400',
		unit: '/天',
		desc: '英语/日语/韩语专业翻译',
		descKey: 'tour.packagesPage.addons.translator.desc',
		descFallback: '英语/日语/韩语专业翻译',
	},
	{
		name: '旅行保险',
		nameKey: 'tour.packagesPage.addons.insurance.name',
		nameFallback: '旅行保险',
		price: '¥50',
		priceKey: 'tour.packagesPage.addons.insurance.price',
		priceFallback: '¥50',
		unit: '/人',
		desc: '含意外+医疗+紧急救援',
		descKey: 'tour.packagesPage.addons.insurance.desc',
		descFallback: '含意外+医疗+紧急救援',
	},
	{
		name: '签证协助',
		nameKey: 'tour.packagesPage.addons.visa.name',
		nameFallback: '签证协助',
		price: '¥200',
		priceKey: 'tour.packagesPage.addons.visa.price',
		priceFallback: '¥200',
		unit: '/人',
		desc: '材料整理+翻译+送签服务',
		descKey: 'tour.packagesPage.addons.visa.desc',
		descFallback: '材料整理+翻译+送签服务',
	},
]

// ============= 热门路线套餐 =============

export const tourPackages: TourPackage[] = [
	{
		id: 1,
		slug: 'silk-road',
		title: '丝绸之路文化之旅',
		titleKey: 'tour.packagesPage.route.silkRoad.title',
		titleFallback: '丝绸之路文化之旅',
		subtitle: '千年丝路，穿越时空的文明之旅',
		subtitleKey: 'tour.packagesPage.route.silkRoad.subtitle',
		subtitleFallback: '千年丝路，穿越时空的文明之旅',
		desc: '从西安出发，沿着古丝绸之路一路向西，途经天水麦积山、张掖丹霞、嘉峪关长城、敦煌莫高窟。每一站都是中华文明的璀璨明珠，搭配深度文化讲解和非遗体验，12天的旅程如同翻开一部活着的历史书。',
		descKey: 'tour.packagesPage.route.silkRoad.desc',
		descFallback: '从西安出发，沿着古丝绸之路一路向西',
		image: '/images/tour/pkg-silkroad.jpg',
		days: 12,
		difficulty: 'medium',
		difficultyKey: 'tour.packagesPage.difficulty.medium',
		difficultyFallback: '中等',
		bestSeason: '5月-10月',
		bestSeasonKey: 'tour.packagesPage.route.silkRoad.bestSeason',
		bestSeasonFallback: '5月-10月',
		audience: ['文化爱好者', '摄影爱好者', '历史迷'],
		price: '¥8,000/人起',
		priceKey: 'tour.packagesPage.route.silkRoad.price',
		priceFallback: '¥8,000/人起',
		routeRange: '西安 → 天水 → 张掖 → 嘉峪关 → 敦煌',
		highlights: ['兵马俑VIP讲解', '麦积山石窟', '张掖七彩丹霞', '莫高窟深度参观', '壁画体验工坊', '鸣沙山日落'],
		itinerary: [
			{ day: 1, title: '西安集合', titleKey: '', titleFallback: '西安集合', desc: '机场接机，入住酒店，欢迎晚宴 + 行程说明会', descKey: '', descFallback: '' },
			{ day: 2, title: '西安深度', titleKey: '', titleFallback: '西安深度', desc: '兵马俑VIP讲解 + 华清宫 + 大唐不夜城夜游', descKey: '', descFallback: '' },
			{ day: 3, title: '西安→天水', titleKey: '', titleFallback: '西安→天水', desc: '高铁前往天水，下午参观麦积山石窟', descKey: '', descFallback: '' },
			{ day: 4, title: '天水→兰州', titleKey: '', titleFallback: '天水→兰州', desc: '伏羲庙 + 黄河铁桥 + 正宗兰州牛肉面体验', descKey: '', descFallback: '' },
			{ day: 5, title: '兰州→张掖', titleKey: '', titleFallback: '兰州→张掖', desc: '动车前往张掖，下午大佛寺', descKey: '', descFallback: '' },
			{ day: 6, title: '张掖丹霞', titleKey: '', titleFallback: '张掖丹霞', desc: '七彩丹霞日出 + 平山湖大峡谷徒步', descKey: '', descFallback: '' },
			{ day: 7, title: '张掖→嘉峪关', titleKey: '', titleFallback: '张掖→嘉峪关', desc: '嘉峪关关城 + 长城第一墩', descKey: '', descFallback: '' },
			{ day: 8, title: '嘉峪关→敦煌', titleKey: '', titleFallback: '嘉峪关→敦煌', desc: '沿途戈壁风光，下午鸣沙山月牙泉骑骆驼', descKey: '', descFallback: '' },
			{ day: 9, title: '莫高窟', titleKey: '', titleFallback: '莫高窟', desc: '莫高窟A类票深度参观 + 壁画体验工坊', descKey: '', descFallback: '' },
			{ day: 10, title: '敦煌西线', titleKey: '', titleFallback: '敦煌西线', desc: '阳关 + 玉门关 + 雅丹魔鬼城日落', descKey: '', descFallback: '' },
			{ day: 11, title: '敦煌自由日', titleKey: '', titleFallback: '敦煌自由日', desc: '自由探索/ optional 沙漠露营体验', descKey: '', descFallback: '' },
			{ day: 12, title: '返程', titleKey: '', titleFallback: '返程', desc: '送机，结束丝绸之路之旅', descKey: '', descFallback: '' },
		],
		includes: ['全程住宿(4星标准)', '全程交通(高铁+专车)', '景区门票(VIP通道)', '持牌导游', '每日早餐+3次特色餐', '旅行保险', '24h管家服务'],
		excludes: ['往返大交通', '午晚餐(部分)', '个人消费', 'optional项目'],
		addons: ['摄影跟拍', '沙漠露营', '多语种翻译'],
	},
	{
		id: 2,
		slug: 'yunnan',
		title: '云南秘境探索之旅',
		titleKey: 'tour.packagesPage.route.yunnan.title',
		titleFallback: '云南秘境探索之旅',
		subtitle: '少数民族风情，彩云之南的慢生活',
		subtitleKey: 'tour.packagesPage.route.yunnan.subtitle',
		subtitleFallback: '少数民族风情，彩云之南的慢生活',
		desc: '从昆明出发，经大理到丽江，融入白族、纳西族的日常生活。住进少数民族院落，学做扎染，逛普洱茶山，在玉龙雪山下看日照金山。8天的慢节奏旅程，让时间在这里停一停。',
		descKey: 'tour.packagesPage.route.yunnan.desc',
		descFallback: '从昆明出发，融入白族纳西族的日常生活',
		image: '/images/tour/pkg-yunnan.jpg',
		days: 8,
		difficulty: 'easy',
		difficultyKey: 'tour.packagesPage.difficulty.easy',
		difficultyFallback: '轻松',
		bestSeason: '3月-5月, 9月-11月',
		bestSeasonKey: 'tour.packagesPage.route.yunnan.bestSeason',
		bestSeasonFallback: '3月-5月, 9月-11月',
		audience: ['情侣', '家庭', '摄影爱好者'],
		price: '¥6,000/人起',
		priceKey: 'tour.packagesPage.route.yunnan.price',
		priceFallback: '¥6,000/人起',
		routeRange: '昆明 → 大理 → 丽江',
		highlights: ['白族院落住宿', '扎染体验', '洱海骑行', '丽江古城漫步', '玉龙雪山', '普洱茶山'],
		itinerary: [
			{ day: 1, title: '昆明集合', titleFallback: '昆明集合', desc: '接机 + 翠湖公园 + 欢迎晚宴', descKey: '', descFallback: '' },
			{ day: 2, title: '昆明→大理', titleFallback: '昆明→大理', desc: '高铁前往大理，下午古城漫步 + 三塔倒影', descKey: '', descFallback: '' },
			{ day: 3, title: '大理深度', titleFallback: '大理深度', desc: '洱海骑行 + 扎染体验 + 品尝白族三道茶', descKey: '', descFallback: '' },
			{ day: 4, title: '大理慢生活', titleFallback: '大理慢生活', desc: '喜洲古镇 + 海舌生态公园 + 苍山徒步', descKey: '', descFallback: '' },
			{ day: 5, title: '大理→丽江', titleFallback: '大理→丽江', desc: '驱车前往丽江，下午束河古镇', descKey: '', descFallback: '' },
			{ day: 6, title: '玉龙雪山', titleFallback: '玉龙雪山', desc: '玉龙雪山大索道 + 蓝月谷 + 《印象丽江》', descKey: '', descFallback: '' },
			{ day: 7, title: '丽江文化', titleFallback: '丽江文化', desc: '纳西族文化体验 + 黑龙潭 + 四方街', descKey: '', descFallback: '' },
			{ day: 8, title: '返程', titleFallback: '返程', desc: '送机/送站，结束云南之旅', descKey: '', descFallback: '' },
		],
		includes: ['全程住宿(特色民宿+4星)', '全程交通', '景区门票', '文化体验活动', '每日早餐+4次特色餐', '旅行保险'],
		excludes: ['往返大交通', '午晚餐(部分)', '个人消费'],
		addons: ['摄影跟拍', '多语种翻译'],
	},
	{
		id: 3,
		slug: 'tibet',
		title: '西藏心灵朝圣之旅',
		titleKey: 'tour.packagesPage.route.tibet.title',
		titleFallback: '西藏心灵朝圣之旅',
		subtitle: '高原圣境，一次净化心灵的旅程',
		subtitleKey: 'tour.packagesPage.route.tibet.subtitle',
		subtitleFallback: '高原圣境，一次净化心灵的旅程',
		desc: '从拉萨到林芝，这条路线海拔由高到低，完美适应高原环境。布达拉宫清晨专场、大昭寺转经、纳木错圣湖、林芝桃花与南迦巴瓦峰——10天的旅程，让身体和灵魂都在路上。',
		descKey: 'tour.packagesPage.route.tibet.desc',
		descFallback: '从拉萨到林芝，完美适应高原环境',
		image: '/images/tour/pkg-tibet.jpg',
		days: 10,
		difficulty: 'hard',
		difficultyKey: 'tour.packagesPage.difficulty.hard',
		difficultyFallback: '较高',
		bestSeason: '4月-6月, 9月-10月',
		bestSeasonKey: 'tour.packagesPage.route.tibet.bestSeason',
		bestSeasonFallback: '4月-6月, 9月-10月',
		audience: ['冒险者', '文化爱好者', '摄影爱好者'],
		price: '¥10,000/人起',
		priceKey: 'tour.packagesPage.route.tibet.price',
		priceFallback: '¥10,000/人起',
		routeRange: '拉萨 → 纳木错 → 林芝',
		highlights: ['布达拉宫清晨专场', '大昭寺转经', '纳木错圣湖', '南迦巴瓦日照金山', '林芝桃花', '藏文化深度体验'],
		itinerary: [
			{ day: 1, title: '拉萨抵达', titleFallback: '拉萨抵达', desc: '接机 + 休息适应海拔 + 高反预防指导', descKey: '', descFallback: '' },
			{ day: 2, title: '拉萨适应日', titleFallback: '拉萨适应日', desc: '慢节奏游览八廓街 + 晒太阳 + 喝甜茶', descKey: '', descFallback: '' },
			{ day: 3, title: '布达拉宫', titleFallback: '布达拉宫', desc: '布达拉宫清晨VIP专场 + 大昭寺', descKey: '', descFallback: '' },
			{ day: 4, title: '拉萨深度', titleFallback: '拉萨深度', desc: '色拉寺辩经 + 罗布林卡 + 藏文化体验', descKey: '', descFallback: '' },
			{ day: 5, title: '拉萨→纳木错', titleFallback: '拉萨→纳木错', desc: '纳木错圣湖 + 念青唐古拉山口', descKey: '', descFallback: '' },
			{ day: 6, title: '纳木错→拉萨', titleFallback: '纳木错→拉萨', desc: '清晨日出 + 返回拉萨休整', descKey: '', descFallback: '' },
			{ day: 7, title: '拉萨→林芝', titleFallback: '拉萨→林芝', desc: '林拉公路 + 巴松措', descKey: '', descFallback: '' },
			{ day: 8, title: '林芝深度', titleFallback: '林芝深度', desc: '雅鲁藏布大峡谷 + 南迦巴瓦峰', descKey: '', descFallback: '' },
			{ day: 9, title: '林芝体验', titleFallback: '林芝体验', desc: '鲁朗林海 + 藏式美食体验', descKey: '', descFallback: '' },
			{ day: 10, title: '返程', titleFallback: '返程', desc: '林芝米林机场送机', descKey: '', descFallback: '' },
		],
		includes: ['全程住宿(供氧酒店)', '全程交通(含供氧专车)', '景区门票(VIP通道)', '持牌导游', '氧气瓶+常用药品', '旅行保险', '24h管家'],
		excludes: ['往返大交通', '午晚餐', '个人消费'],
		addons: ['摄影跟拍', '多语种翻译', '旅行保险'],
	},
	{
		id: 4,
		slug: 'jiangnan',
		title: '江南水乡雅韵之旅',
		titleKey: 'tour.packagesPage.route.jiangnan.title',
		titleFallback: '江南水乡雅韵之旅',
		subtitle: '诗画江南，一段慢下来的雅致时光',
		subtitleKey: 'tour.packagesPage.route.jiangnan.subtitle',
		subtitleFallback: '诗画江南，一段慢下来的雅致时光',
		desc: '苏州的园林精妙、杭州的湖光山色、乌镇的水乡韵味——6天的江南之旅，在茶香与丝绸之间感受中国最精致的生活方式。',
		descKey: 'tour.packagesPage.route.jiangnan.desc',
		descFallback: '在茶香与丝绸之间感受最精致的生活方式',
		image: '/images/tour/pkg-jiangnan.jpg',
		days: 6,
		difficulty: 'easy',
		difficultyKey: 'tour.packagesPage.difficulty.easy',
		difficultyFallback: '轻松',
		bestSeason: '3月-5月, 9月-11月',
		bestSeasonKey: 'tour.packagesPage.route.jiangnan.bestSeason',
		bestSeasonFallback: '3月-5月, 9月-11月',
		audience: ['情侣', '家庭', '文化爱好者', '美食爱好者'],
		price: '¥5,000/人起',
		priceKey: 'tour.packagesPage.route.jiangnan.price',
		priceFallback: '¥5,000/人起',
		routeRange: '苏州 → 杭州 → 乌镇',
		highlights: ['苏州园林VIP', '苏绣体验', '西湖泛舟', '龙井茶园', '乌镇夜游', '私房菜烹饪课'],
		itinerary: [
			{ day: 1, title: '苏州抵达', titleFallback: '苏州抵达', desc: '接站 + 平江路历史街区 + 苏式晚餐', descKey: '', descFallback: '' },
			{ day: 2, title: '苏州园林', titleFallback: '苏州园林', desc: '拙政园VIP讲解 + 苏州博物馆 + 苏绣体验', descKey: '', descFallback: '' },
			{ day: 3, title: '苏州→杭州', titleFallback: '苏州→杭州', desc: '高铁前往杭州 + 西湖泛舟 + 灵隐寺', descKey: '', descFallback: '' },
			{ day: 4, title: '杭州深度', titleFallback: '杭州深度', desc: '龙井茶园采茶 + 私房菜烹饪课 + 西湖夜景', descKey: '', descFallback: '' },
			{ day: 5, title: '杭州→乌镇', titleFallback: '杭州→乌镇', desc: '乌镇西栅入住 + 摇橹船 + 夜游', descKey: '', descFallback: '' },
			{ day: 6, title: '乌镇→返程', titleFallback: '乌镇→返程', desc: '乌镇晨间 + 送站/送机', descKey: '', descFallback: '' },
		],
		includes: ['全程住宿(精品酒店+水乡民宿)', '全程交通', '景区门票', '文化体验活动', '每日早餐+3次特色餐'],
		excludes: ['往返大交通', '午晚餐(部分)', '个人消费'],
		addons: ['摄影跟拍', '汉服旅拍'],
	},
	{
		id: 5,
		slug: 'beijing',
		title: '北京皇都文化之旅',
		titleKey: 'tour.packagesPage.route.beijing.title',
		titleFallback: '北京皇都文化之旅',
		subtitle: '六朝古都，一次读懂中国的历史脉络',
		subtitleKey: 'tour.packagesPage.route.beijing.subtitle',
		subtitleFallback: '六朝古都，一次读懂中国的历史脉络',
		desc: '故宫、长城、胡同、颐和园——北京作为六朝古都，浓缩了中华文明的精华。5天的深度体验，由资深文化向导带领，避开人潮，走进那些旅行团到不了的地方。',
		descKey: 'tour.packagesPage.route.beijing.desc',
		descFallback: '避开人潮，走进旅行团到不了的地方',
		image: '/images/tour/pkg-beijing.jpg',
		days: 5,
		difficulty: 'easy',
		difficultyKey: 'tour.packagesPage.difficulty.easy',
		difficultyFallback: '轻松',
		bestSeason: '4月-6月, 9月-11月',
		bestSeasonKey: 'tour.packagesPage.route.beijing.bestSeason',
		bestSeasonFallback: '4月-6月, 9月-11月',
		audience: ['文化爱好者', '家庭', '历史迷'],
		price: '¥4,000/人起',
		priceKey: 'tour.packagesPage.route.beijing.price',
		priceFallback: '¥4,000/人起',
		routeRange: '北京',
		highlights: ['故宫VIP专场', '长城野长城徒步', '胡同人力车', '颐和园深度游', '京剧体验', '烤鸭私宴'],
		itinerary: [
			{ day: 1, title: '北京抵达', titleFallback: '北京抵达', desc: '接机 + 天坛 + 欢迎烤鸭晚宴', descKey: '', descFallback: '' },
			{ day: 2, title: '皇城核心', titleFallback: '皇城核心', desc: '故宫VIP专场 + 景山公园俯瞰 + 胡同人力车', descKey: '', descFallback: '' },
			{ day: 3, title: '长城+明陵', titleFallback: '长城+明陵', desc: '慕田峪长城徒步 + 定陵地下宫殿', descKey: '', descFallback: '' },
			{ day: 4, title: '皇家园林', titleFallback: '皇家园林', desc: '颐和园深度游 + 圆明园遗址 + 京剧体验', descKey: '', descFallback: '' },
			{ day: 5, title: '返程', titleFallback: '返程', desc: '798艺术区 + 送机', descKey: '', descFallback: '' },
		],
		includes: ['全程住宿(4星)', '全程交通', '景区门票(VIP通道)', '持牌导游', '每日早餐+2次特色餐'],
		excludes: ['往返大交通', '午晚餐(部分)', '个人消费'],
		addons: ['摄影跟拍', '多语种翻译'],
	},
	{
		id: 6,
		slug: 'chengdu',
		title: '成都休闲美食之旅',
		titleKey: 'tour.packagesPage.route.chengdu.title',
		titleFallback: '成都休闲美食之旅',
		subtitle: '天府之国，一座来了就不想走的城市',
		subtitleKey: 'tour.packagesPage.route.chengdu.subtitle',
		subtitleFallback: '天府之国，一座来了就不想走的城市',
		image: '/images/tour/pkg-chengdu.jpg',
		desc: '大熊猫、川菜、茶馆、蜀锦——成都是中国最会享受生活的城市。4天的旅程，吃最地道的火锅，看最萌的大熊猫，体验最悠闲的巴蜀文化。',
		descKey: 'tour.packagesPage.route.chengdu.desc',
		descFallback: '吃最地道的火锅，看最萌的大熊猫',
		days: 4,
		difficulty: 'easy',
		difficultyKey: 'tour.packagesPage.difficulty.easy',
		difficultyFallback: '轻松',
		bestSeason: '全年皆宜',
		bestSeasonKey: 'tour.packagesPage.route.chengdu.bestSeason',
		bestSeasonFallback: '全年皆宜',
		audience: ['美食爱好者', '家庭', '休闲度假'],
		price: '¥4,500/人起',
		priceKey: 'tour.packagesPage.route.chengdu.price',
		priceFallback: '¥4,500/人起',
		routeRange: '成都',
		highlights: ['大熊猫保育志愿者', '川菜烹饪课', '宽窄巷子', '人民公园喝茶', '火锅私宴'],
		itinerary: [
			{ day: 1, title: '成都抵达', titleFallback: '成都抵达', desc: '接机 + 宽窄巷子 + 欢迎火锅晚宴', descKey: '', descFallback: '' },
			{ day: 2, title: '熊猫+文化', titleFallback: '熊猫+文化', desc: '大熊猫保育志愿者体验 + 锦里古街', descKey: '', descFallback: '' },
			{ day: 3, title: '美食体验', titleFallback: '美食体验', desc: '川菜烹饪课 + 人民公园喝茶 + 太古里', descKey: '', descFallback: '' },
			{ day: 4, title: '返程', titleFallback: '返程', desc: '送机', descKey: '', descFallback: '' },
		],
		includes: ['全程住宿', '全程交通', '活动费用', '特色餐饮', '旅行保险'],
		excludes: ['往返大交通', '个人消费'],
		addons: ['摄影跟拍'],
	},
]

/** 按 id 获取套餐（详情页用） */
export function getPackageById(id: number): TourPackage | undefined {
	return tourPackages.find(p => p.id === id)
}

/** 按 slug 获取套餐 */
export function getPackageBySlug(slug: string): TourPackage | undefined {
	return tourPackages.find(p => p.slug === slug)
}
