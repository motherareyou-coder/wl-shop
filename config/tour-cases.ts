/**
 * 客户真实案例数据（首页 + 详情页共用）
 * 后续接口就绪后，改为从 API 加载，此处作为静态兜底
 */

export interface TourCase {
	id: number
	avatar: string
	avatarCls: string
	name: string
	meta: string
	route: string
	sharing: string // 摘要（卡片列表展示）
	date: string
	// 🆕 扩展字段
	type: 'business' | 'family' | 'romantic' | 'culture' | 'special' | 'team'
	beforeSharing: string // 定制前的痛点描述
	afterSharing: string // 定制后的体验（完整故事正文）
	days: number // 行程天数
	people: string // 出行人数描述
	budget: string // 预算范围
	highlights: string[] // 旅行亮点标签
	featured: boolean // 是否精选（首页大卡片展示）
	rating: number // 评分
}

export const tourCases: TourCase[] = [
	{
		id: 1,
		avatar: '张',
		avatarCls: 'tour-custom__case-avatar--1',
		name: '张先生',
		meta: '来自上海 · 家庭出行',
		route: '丝绸之路 · 西安到敦煌 · 12天',
		sharing: '从西安兵马俑到敦煌莫高窟，规划师安排的本地向导特别专业，孩子全程听得津津有味。最惊喜的是参加了壁画画坊，亲手体验了千年技艺。全程专车接送，比跟团游深度太多。',
		date: '2024年10月',
		type: 'family',
		beforeSharing: '之前每次出行都自己查攻略，花了两周时间还是担心安排不到位。跟团游又不自由，孩子听不进去那些千篇一律的讲解。',
		afterSharing: '规划师安排的本地向导特别专业，专门针对孩子的兴趣设计了"文化慢线"——兵马俑深度讲解、壁画画坊亲手体验千年技艺、鸣沙山骑骆驼看日落。全程专车接送，司机师傅还帮我们找到了当地人才知道的小馆子。孩子在回来的路上说："爸爸，明年还要来！"',
		days: 12,
		people: '2大1小',
		budget: '¥15,000 - ¥20,000',
		highlights: ['兵马俑深度讲解', '壁画体验工坊', '鸣沙山日落', '特色小馆子'],
		featured: true,
		rating: 5.0,
	},
	{
		id: 2,
		avatar: 'L',
		avatarCls: 'tour-custom__case-avatar--2',
		name: 'Linda Chen',
		meta: '来自新加坡 · 情侣出行',
		route: '云南秘境 · 昆明大理丽江 · 8天',
		sharing: 'The trip was perfectly customized for us. We stayed in a Bai minority courtyard home, learned traditional tie-dye, and visited a Pu\'er tea farm. Our concierge handled everything — even last-minute changes.',
		date: '2024年9月',
		type: 'romantic',
		beforeSharing: 'We usually book everything ourselves on booking.com, but China is different — language barriers, unfamiliar booking platforms, and so many options. We were overwhelmed.',
		afterSharing: 'The trip was perfectly customized for us. From the moment we landed, a bilingual concierge was available on WeChat. We stayed in a Bai minority courtyard home in Dali (not on any booking platform!), learned traditional tie-dye from a local artisan, and visited a Pu\'er tea farm in Jingmai Mountain. When we wanted to change our Lijiang itinerary last minute, the planner rearranged everything within 2 hours.',
		days: 8,
		people: '2人情侣',
		budget: '¥12,000 - ¥18,000',
		highlights: ['白族院落住宿', '扎染体验', '普洱茶山', '双语管家'],
		featured: true,
		rating: 5.0,
	},
	{
		id: 3,
		avatar: '王',
		avatarCls: 'tour-custom__case-avatar--3',
		name: '王先生夫妇',
		meta: '来自北京 · 夫妻出行',
		route: '西藏朝圣 · 拉萨林芝 · 10天',
		sharing: '最担心的高反问题，规划师提前安排了氧气瓶随车和预防方案。持牌导游对藏传佛教文化讲解深入，布达拉宫的清晨参观完全没人挤。林芝的桃花和南迦巴瓦峰，这一趟值了。',
		date: '2024年4月',
		type: 'culture',
		beforeSharing: '一直想去西藏但特别担心高反，查了无数攻略越看越怕。也担心导游不专业，讲解太浅。市面上大部分线路都是走马观花，我们想要深度的文化体验。',
		afterSharing: '规划师提前一周就发来了高反预防指南，车上备了氧气瓶和常用药品。持牌导游对藏传佛教文化了解深入，在布达拉宫安排了清晨参观时段，几乎没人挤。最惊喜的是林芝的桃花季，南迦巴瓦峰日照金山的时刻，我觉得这辈子都忘不了。',
		days: 10,
		people: '2人夫妻',
		budget: '¥18,000 - ¥25,000',
		highlights: ['布达拉宫清晨专场', '南迦巴瓦日照金山', '藏文化深度体验', '林芝桃花'],
		featured: true,
		rating: 4.9,
	},
	{
		id: 4,
		avatar: 'M',
		avatarCls: 'tour-custom__case-avatar--4',
		name: 'Michael Wang',
		meta: '某科技公司 · 商务出行',
		route: '企业团建 · 上海及周边 · 5天',
		sharing: '为 30 人年会团队定制，从专车接送到高端餐饮、会议场地全部安排妥当。特别赞的是朱家角古镇的团建活动设计，融合了江南文化体验，团队反馈非常好。报价透明无隐藏费用。',
		date: '2024年11月',
		type: 'team',
		beforeSharing: '公司年会团建每年都是头疼的事——大团组协调太难，之前找的旅行社要么行程太水，要么临时加各种费用。30个人的安排需要非常精细。',
		afterSharing: '从浦东机场的商务大巴接机开始，一切都在计划之内。高端餐饮的菜单提前确认，会议场地的AV设备测试到位。特别赞的是朱家角古镇的团建活动设计——团队分组完成"江南文化寻宝"，融合了古镇探索和传统手作体验，同事们都说这是历年最好的一次团建。最重要的是报价透明，没有任何隐藏费用。',
		days: 5,
		people: '30人团体',
		budget: '¥8,000 - ¥12,000/人',
		highlights: ['商务大巴接送', '高端餐饮安排', '朱家角团建', '透明报价'],
		featured: false,
		rating: 4.8,
	},
	{
		id: 5,
		avatar: '李',
		avatarCls: 'tour-custom__case-avatar--5',
		name: '李女士',
		meta: '来自广州 · 闺蜜出行',
		route: '江南水乡 · 苏州杭州乌镇 · 6天',
		sharing: '三个闺蜜的毕业旅行，规划师帮我们找到了一家临河的精品民宿，推窗就是小桥流水。还安排了苏绣体验和私房菜烹饪课，完全不是那种走马观花的团。',
		date: '2024年6月',
		type: 'special',
		beforeSharing: '三个闺蜜想一起旅行，但大家的兴趣点不一样——有人爱拍照，有人爱吃，有人爱手工。自己协调太累了，跟团又不自由。',
		afterSharing: '规划师根据我们三个人的不同兴趣，巧妙地安排了每天的主题。在苏州安排了苏绣体验（手工控超开心），在杭州私房菜馆学了做叫花鸡（吃货满足了），乌镇安排了汉服旅拍（拍照达人出大片）。最绝的是那家临河民宿，推窗就是小桥流水，晚上在露台喝茶聊到凌晨。',
		days: 6,
		people: '3人闺蜜',
		budget: '¥6,000 - ¥10,000',
		highlights: ['临河精品民宿', '苏绣体验', '私房菜烹饪课', '汉服旅拍'],
		featured: false,
		rating: 4.9,
	},
	{
		id: 6,
		avatar: '赵',
		avatarCls: 'tour-custom__case-avatar--6',
		name: '赵先生',
		meta: '来自成都 · 家庭出行',
		route: '亲子探索 · 成都重庆 · 5天',
		sharing: '带孩子体验了川菜烹饪、大熊猫保育志愿者活动，比普通观光有意义太多了。酒店安排了亲子房，有儿童乐园，大人也能休息。全程无购物点，节奏舒适。',
		date: '2024年7月',
		type: 'family',
		beforeSharing: '带5岁的孩子出行最怕节奏太快孩子扛不住，或者安排太无聊孩子闹腾。之前跟团被拉去购物店，体验很差。',
		afterSharing: '规划师特别懂亲子出行的节奏——每天最多安排两个主要活动，中间留足休息时间。最惊喜的是大熊猫保育志愿者活动（不是普通观光！），孩子亲手给熊猫准备了窝窝头，穿上工作服跟着饲养员打扫圈舍。川菜烹饪课也很棒，孩子做出了人生第一道宫保鸡丁。全程无购物点，节奏舒适，酒店还安排了亲子主题房。',
		days: 5,
		people: '2大1小',
		budget: '¥8,000 - ¥12,000',
		highlights: ['大熊猫保育志愿者', '川菜亲子烹饪', '无购物纯玩', '亲子主题酒店'],
		featured: false,
		rating: 5.0,
	},
	{
		id: 7,
		avatar: 'C',
		avatarCls: 'tour-custom__case-avatar--7',
		name: '陈女士',
		meta: '来自上海 · 情侣出行',
		route: '浪漫蜜月 · 三亚+万宁 · 7天',
		sharing: '蜜月旅行不想去人挤人的地方，规划师推荐了万宁的石梅湾，安排了海边烛光晚餐和冲浪体验。还帮我们预定了日月湾的冲浪课程，每天都是惊喜。',
		date: '2024年12月',
		type: 'romantic',
		beforeSharing: '蜜月旅行不想去三亚人挤人的海滩，但又想要海景和浪漫氛围。自己找的酒店要么太贵要么评价虚高，婚礼之后已经精疲力尽不想再折腾。',
		afterSharing: '规划师推荐了万宁石梅湾——人少景美，比三亚清净太多。第一天入住就有惊喜：房间布置了花瓣和香槟（规划师提前沟通了蜜月信息）。接下来的安排完美：日月湾冲浪课程（超刺激！）、海边烛光晚餐（伴着海浪声）、兴隆咖啡园体验。最感动的是最后一天，酒店经理送了一份手写的祝福卡片。',
		days: 7,
		people: '2人情侣',
		budget: '¥15,000 - ¥22,000',
		highlights: ['石梅湾私密海滩', '烛光晚餐', '冲浪体验', '兴隆咖啡园'],
		featured: false,
		rating: 5.0,
	},
	{
		id: 8,
		avatar: '吴',
		avatarCls: 'tour-custom__case-avatar--8',
		name: '吴先生',
		meta: '来自杭州 · 商务出行',
		route: '商务考察 · 北京+天津 · 4天',
		sharing: '为公司的北方市场拓展做商务考察行程，规划师安排了中关村科技园区参观和当地企业家交流晚宴，还顺带逛了故宫和胡同。高效又不失文化体验。',
		date: '2024年8月',
		type: 'business',
		beforeSharing: '商务出行通常是展会+酒店两点一线，无聊透顶。想在紧张的商务行程中穿插一些文化体验，但不想占用太多工作时间。',
		afterSharing: '规划师在4天中巧妙平衡了商务和文化——白天安排了中关村科技园区参观、与3家当地企业的交流会、产业园区考察，晚上则安排了胡同私房菜晚宴（跟当地企业家一起，边吃边聊）、故宫VIP导览、什刹海游船。商务效率一点没降，还让同事们直呼"这才是出差该有的样子"。',
		days: 4,
		people: '5人商务团',
		budget: '¥6,000 - ¥10,000/人',
		highlights: ['中关村科技园区', '企业家交流晚宴', '故宫VIP导览', '胡同私房菜'],
		featured: false,
		rating: 4.8,
	},
]

/** 按 id 获取案例（详情页用，后续可替换为 API） */
export function getCaseById(id: number): TourCase | undefined {
	return tourCases.find(c => c.id === id)
}

/** 按类型筛选案例（列表页用） */
export function getCasesByType(type?: string): TourCase[] {
	if (!type || type === 'all') return tourCases
	return tourCases.filter(c => c.type === type)
}

/** 获取精选案例（列表页大卡片用） */
export function getFeaturedCases(): TourCase[] {
	return tourCases.filter(c => c.featured)
}
