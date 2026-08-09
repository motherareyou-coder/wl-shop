/**
 * 专属服务团队数据（首页 + 详情页共用）
 * 后续接口就绪后，改为从 API 加载，此处作为静态兜底
 */

export interface TourStaff {
	id: number
	name: string
	role: string
	skills: string[]
	rating: number
	orders: number
	bio: string
	// 🆕 扩展字段
	years: number // 从业年限
	languages: string[] // 语言能力
	specialties: string[] // 擅长场景
	category: string // 分类标签 (business/culture/special/multilingual/etiquette)
	cities: string[] // 擅长目的地城市
	reviews: Array<{
		text: string
		rating: number
		date: string
		author: string
		type: string
	}>
	avatarCls: string // 头像样式类
}

export const tourStaff: TourStaff[] = [
	{
		id: 1,
		name: '王晓雯',
		role: '高级旅行陪伴师 · 8年经验',
		skills: ['商务陪同', '多语种'],
		rating: 4.9,
		orders: 126,
		bio: '精通英语日语，擅长高端商务接待与文化深度游，服务过百余位国际客户。注重细节与礼仪，每次服务前都会深入了解客户背景和偏好，确保提供量身定制的陪伴体验。',
		years: 8,
		languages: ['中文', '英语', '日语'],
		specialties: ['商务陪同', '国际接待', '文化体验'],
		category: 'business',
		cities: ['上海', '北京', '西安', '杭州'],
		reviews: [
			{
				text: '非常专业，让我们的商务考察非常顺利。与日本客户的沟通完全无缝衔接。',
				rating: 5,
				date: '2024年10月',
				author: 'Michael Wang',
				type: 'business',
			},
			{
				text: '对上海的小众景点了如指掌，带我们去了很多旅行团去不到的地方。',
				rating: 5,
				date: '2024年8月',
				author: 'Linda Chen',
				type: 'culture',
			},
		],
		avatarCls: 'tour-custom__case-avatar--1',
	},
	{
		id: 2,
		name: '陈思远',
		role: '资深文化向导 · 6年经验',
		skills: ['文化导览', '非遗体验'],
		rating: 4.8,
		orders: 98,
		bio: '历史系硕士出身，对中国传统文化有深入研究，擅长设计沉浸式文化体验路线。善于将枯燥的历史知识转化为生动的故事，让文化之旅变得引人入胜。',
		years: 6,
		languages: ['中文', '英语'],
		specialties: ['文化导览', '非遗体验', '历史讲解'],
		category: 'culture',
		cities: ['北京', '西安', '洛阳', '南京'],
		reviews: [
			{
				text: '对历史文化了解深入，讲解引人入胜。兵马俑那一站我们听了整整两小时还意犹未尽。',
				rating: 5,
				date: '2024年9月',
				author: '张先生',
				type: 'culture',
			},
			{
				text: '在故宫的讲解太精彩了，比任何音频导览都好。连孩子都被吸引了。',
				rating: 5,
				date: '2024年7月',
				author: '赵先生',
				type: 'family',
			},
		],
		avatarCls: 'tour-custom__case-avatar--3',
	},
	{
		id: 3,
		name: '林雅婷',
		role: '特色体验策划师 · 5年经验',
		skills: ['惊喜策划', '主题定制'],
		rating: 5.0,
		orders: 87,
		bio: '曾策划百余场生日惊喜与纪念日庆祝，注重细节与情感表达，深受家庭客户好评。擅长将当地文化元素融入庆祝活动中，创造独一无二的美好回忆。',
		years: 5,
		languages: ['中文', '英语'],
		specialties: ['惊喜策划', '生日庆祝', '纪念日定制'],
		category: 'special',
		cities: ['杭州', '成都', '三亚', '大理'],
		reviews: [
			{
				text: '生日惊喜安排得太好了！海边的烛光晚餐和手写祝福卡片，全家都感动了。',
				rating: 5,
				date: '2024年12月',
				author: '陈女士',
				type: 'romantic',
			},
			{
				text: '闺蜜旅行的每个环节都精心设计，苏绣体验和汉服旅拍是最棒的回忆。',
				rating: 5,
				date: '2024年6月',
				author: '李女士',
				type: 'special',
			},
		],
		avatarCls: 'tour-custom__case-avatar--2',
	},
	{
		id: 4,
		name: '张明辉',
		role: '专业商务陪同 · 7年经验',
		skills: ['商务礼仪', '英语韩语'],
		rating: 4.9,
		orders: 112,
		bio: '熟悉跨国商务礼仪，精通英语韩语，多次服务于世界500强企业高管接待。沉稳专业，应变能力强，是商务出行最可靠的伙伴。',
		years: 7,
		languages: ['中文', '英语', '韩语'],
		specialties: ['商务礼仪', '会议翻译', '企业接待'],
		category: 'business',
		cities: ['北京', '上海', '深圳', '广州'],
		reviews: [
			{
				text: '为我们的30人团建安排得井井有条，所有商务接待环节都非常专业。',
				rating: 5,
				date: '2024年11月',
				author: '吴先生',
				type: 'business',
			},
			{
				text: '韩语翻译非常准确，帮助我们的商务谈判顺利达成合作。',
				rating: 5,
				date: '2024年9月',
				author: '金先生',
				type: 'business',
			},
		],
		avatarCls: 'tour-custom__case-avatar--4',
	},
	{
		id: 5,
		name: '刘诗雨',
		role: '亲子旅行策划师 · 4年经验',
		skills: ['亲子规划', '自然探索'],
		rating: 4.9,
		orders: 65,
		bio: '教育学背景出身，深谙亲子旅行的节奏把控与安全考量。擅长设计寓教于乐的旅行路线，让孩子在玩乐中学习，让家长在旅途中放松。',
		years: 4,
		languages: ['中文', '英语'],
		specialties: ['亲子规划', '自然探索', '寓教于乐'],
		category: 'culture',
		cities: ['成都', '重庆', '昆明', '桂林'],
		reviews: [
			{
				text: '带孩子参加大熊猫保育志愿者活动，比任何观光都有意义，孩子到现在还天天说想去。',
				rating: 5,
				date: '2024年7月',
				author: '赵先生',
				type: 'family',
			},
		],
		avatarCls: 'tour-custom__case-avatar--5',
	},
	{
		id: 6,
		name: '杨浩然',
		role: '户外探险向导 · 6年经验',
		skills: ['户外探险', '摄影领队'],
		rating: 4.8,
		orders: 73,
		bio: '户外运动专业出身，持有国际急救认证。精通西藏、新疆等高海拔地区的深度探险路线安排，同时也是资深风光摄影师，能为客户记录旅途中的精彩瞬间。',
		years: 6,
		languages: ['中文'],
		specialties: ['高海拔探险', '风光摄影', '户外安全'],
		category: 'culture',
		cities: ['拉萨', '林芝', '乌鲁木齐', '喀什'],
		reviews: [
			{
				text: '高海拔旅行安排得非常合理，循序渐进的节奏让我们完全没有高反。南迦巴瓦的日照金山是永生难忘的。',
				rating: 5,
				date: '2024年4月',
				author: '王先生',
				type: 'culture',
			},
		],
		avatarCls: 'tour-custom__case-avatar--6',
	},
]

/** 按 id 获取团队成员（详情页用，后续可替换为 API） */
export function getStaffById(id: number): TourStaff | undefined {
	return tourStaff.find(s => s.id === id)
}

/** 按分类筛选（列表页用） */
export function getStaffByCategory(category?: string): TourStaff[] {
	if (!category || category === 'all') return tourStaff
	return tourStaff.filter(s => s.category === category)
}

/** 按语言筛选 */
export function getStaffByLanguage(lang: string): TourStaff[] {
	return tourStaff.filter(s => s.languages.includes(lang))
}

/** 多维筛选（类别+语言+搜索） */
export function filterStaff(options: {
	category?: string
	language?: string
	search?: string
}): TourStaff[] {
	let result = [...tourStaff]
	if (options.category && options.category !== 'all') {
		result = result.filter(s => s.category === options.category)
	}
	if (options.language && options.language !== 'all') {
		result = result.filter(s => s.languages.includes(options.language!))
	}
	if (options.search) {
		const q = options.search.toLowerCase()
		result = result.filter(s =>
			s.name.toLowerCase().includes(q)
			|| s.role.toLowerCase().includes(q)
			|| s.specialties.some(sp => sp.toLowerCase().includes(q))
			|| s.cities.some(c => c.toLowerCase().includes(q))
			|| s.skills.some(sk => sk.toLowerCase().includes(q))
		)
	}
	return result
}
