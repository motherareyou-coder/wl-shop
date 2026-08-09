<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { tourCases } from '~/config/tour-cases'

definePageMeta({
	title: 'Custom Trip',
})

// SEO
const route = useRoute()
const { domain } = useRuntimeConfig().public
useSEO({
	routeKey: 'custom',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Custom Trip', url: `${domain}${route.path}` },
	],
})

// 埋点
const { gtag } = useGtag()
gtag('event', 'screen_view', { screen_name: 'custom-trip' })

// ===== ④ 旅行风格探索器状态 =====
const explorerStyle = ref('')
const explorerPeople = ref('')
const explorerDays = ref('')

const styleOptions = [
	{ key: 'explore', label: '🎒 深度探索' },
	{ key: 'relax', label: '🏖️ 休闲度假' },
	{ key: 'culture', label: '🏛️ 文化艺术' },
	{ key: 'food', label: '🍜 美食之旅' },
	{ key: 'romantic', label: '❤️ 浪漫蜜月' },
	{ key: 'family', label: '👨‍👩‍👧 亲子时光' },
	{ key: 'business', label: '💼 商务出行' },
	{ key: 'theme', label: '🎯 主题定制' },
]
const peopleOptions = ['1人', '情侣', '家庭2-3人', '家庭4+人', '团体']
const daysOptions = ['3-5天', '6-8天', '9-12天', '12天以上']

const explorerResult = computed(() => {
	if (!explorerStyle.value || !explorerPeople.value || !explorerDays.value) return null
	// 简单匹配逻辑
	const styleMap: Record<string, string> = {
		explore: '西藏、丝绸之路 — 深度文化探索路线',
		relax: '海南三亚、云南大理 — 休闲度假路线',
		culture: '北京、西安、洛阳 — 历史文化路线',
		food: '成都、广州、西安 — 美食之旅路线',
		romantic: '三亚、大理、桂林 — 浪漫蜜月路线',
		family: '成都、桂林、海南 — 亲子友好路线',
		business: '上海、北京、深圳 — 商务出行路线',
		theme: '根据您的主题偏好，为您量身定制专属路线',
	}
	return styleMap[explorerStyle.value] || '为您量身定制专属路线'
})

function scrollToForm() {
	document.querySelector('.custom-form-section')?.scrollIntoView({ behavior: 'smooth' })
}

// ===== ⑤ 目的地灵感数据 =====
const destFilters = ['全部', '文化古迹', '自然风光', '美食之旅', '小众秘境', '亲子友好']
const activeDestFilter = ref('全部')

const destinations = [
	{ name: '北京', desc: '皇家古都·长城故宫', days: '5天起', price: '¥4,000起', filter: '文化古迹' },
	{ name: '云南', desc: '少数民族·风花雪月', days: '8天起', price: '¥6,000起', filter: '自然风光' },
	{ name: '西藏', desc: '高原圣境·心灵朝圣', days: '10天起', price: '¥10,000起', filter: '自然风光' },
	{ name: '丝绸之路', desc: '千年文明·西安敦煌', days: '12天起', price: '¥8,000起', filter: '文化古迹' },
	{ name: '上海', desc: '魔都风情·江南门户', days: '4天起', price: '¥4,500起', filter: '美食之旅' },
	{ name: '成都', desc: '天府之国·熊猫美食', days: '4天起', price: '¥4,500起', filter: '美食之旅' },
	{ name: '西安', desc: '十三朝古都·兵马俑', days: '4天起', price: '¥3,500起', filter: '文化古迹' },
	{ name: '桂林', desc: '山水甲天下·漓江竹筏', days: '5天起', price: '¥5,000起', filter: '自然风光' },
	{ name: '杭州', desc: '人间天堂·西湖龙井', days: '4天起', price: '¥4,000起', filter: '自然风光' },
	{ name: '哈尔滨', desc: '冰城雪韵·俄式风情', days: '5天起', price: '¥5,500起', filter: '小众秘境' },
	{ name: '新疆', desc: '大漠丝路·天山秘境', days: '10天起', price: '¥9,000起', filter: '小众秘境' },
	{ name: '海南', desc: '热带海岛·阳光沙滩', days: '5天起', price: '¥5,500起', filter: '亲子友好' },
]

const filteredDests = computed(() => {
	if (activeDestFilter.value === '全部') return destinations
	return destinations.filter(d => d.filter === activeDestFilter.value)
})

function selectDestination(name: string) {
	form.destination = name
	scrollToForm()
}

// ===== ⑥ 行程类型数据 =====
const tripTypes = [
	{
		icon: 'icon:shop',
		title: '商务出行',
		desc: '高端商务接待与会议行程安排',
		includes: ['VIP接机', '会议场地', '商务翻译'],
		suitable: '适合：企业团建、高管出行',
	},
	{
		icon: 'icon:user',
		title: '家庭旅行',
		desc: '亲子友好的全家定制路线',
		includes: ['亲子酒店', '儿童友好活动', '安全考量'],
		suitable: '适合：2大1小起、祖孙三代',
	},
	{
		icon: 'icon:like',
		title: '文化深度游',
		desc: '深入体验中国传统文化与历史',
		includes: ['非遗体验', '专业文化向导', '小众景点'],
		suitable: '适合：文化爱好者、历史迷',
	},
	{
		icon: 'icon:menu',
		title: '主题定制',
		desc: '摄影、美食、养生、婚拍等主题专享',
		includes: ['主题路线设计', '专业器材/场地', '专属体验'],
		suitable: '适合：摄影爱好者、美食家',
	},
]

// ===== ⑦ 定制师数据 =====
const planners = [
	{ avatar: '王', name: '王规划师', years: '8年经验', specialty: '擅长: 丝绸之路', orders: '服务800+', rating: '4.9' },
	{ avatar: '李', name: '李规划师', years: '6年经验', specialty: '擅长: 云南', orders: '服务560+', rating: '4.8' },
	{ avatar: '张', name: '张规划师', years: '10年经验', specialty: '擅长: 西藏', orders: '服务1200+', rating: '5.0' },
]

// ===== ⑨ 客户评价轮播 =====
const reviews = computed(() => tourCases.slice(0, 4).map(c => ({
	text: c.sharing,
	author: c.name,
	route: c.route,
	rating: c.rating,
})))
const activeReview = ref(0)

function nextReview() {
	activeReview.value = (activeReview.value + 1) % reviews.value.length
}

let reviewTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
	reviewTimer = setInterval(nextReview, 5000)
})
onBeforeUnmount(() => {
	if (reviewTimer) clearInterval(reviewTimer)
})

// ===== ⑧ 表单 =====
const themes = [
	{ key: 'business', icon: 'icon:shop' },
	{ key: 'family', icon: 'icon:user' },
	{ key: 'culture', icon: 'icon:like' },
	{ key: 'theme', icon: 'icon:menu' },
]
const budgets = [
	{ key: 'economy', range: '¥3,000-6,000' },
	{ key: 'comfort', range: '¥6,000-12,000' },
	{ key: 'luxury', range: '¥12,000+' },
]
const destinationKeys = ['beijing', 'yunnan', 'tibet', 'silkRoad', 'shanghai', 'chengdu', 'xian', 'guilin', 'hangzhou', 'harbin', 'xinjiang', 'hainan']
const addonKeys = ['car', 'translation', 'photography', 'insurance', 'visa', 'meal']

const formRef = ref<FormInstance>()
const form = reactive({
	email: '',
	mobile: '',
	destination: '',
	startDate: '',
	endDate: '',
	travelerCount: 2,
	budget: '',
	preferences: [] as string[],
	specialRequirements: '',
	needEscort: false,
})
const selectedAddons = ref<string[]>([])

const rules = computed<FormRules>(() => ({
	email: [
		{ required: true, message: $t('travel.custom.v.emailRequired'), trigger: 'blur' },
		{ type: 'email', message: $t('travel.custom.v.emailFormat'), trigger: 'blur' },
	],
	destination: [{ required: true, message: $t('travel.custom.v.destinationRequired'), trigger: 'change' }],
	startDate: [{ required: true, message: $t('travel.custom.v.startDateRequired'), trigger: 'change' }],
}))

const submitting = ref(false)
const submitted = ref(false)
const submittedInquiryId = ref<number | null>(null)

async function submit() {
	if (!formRef.value) return
	await formRef.value.validate(async (valid) => {
		if (!valid) {
			ElMessage.info($t('Please fill in the required fields'))
			return
		}
		submitting.value = true
		try {
			const addonLabels = selectedAddons.value.map(k => $t(`travel.custom.addonsList.${k}`))
			const result = await $api<number>('travel/inquiry/create', {
				method: 'post',
				body: {
					email: form.email,
					mobile: form.mobile || undefined,
					destination: form.destination,
					startDate: form.startDate,
					endDate: form.endDate || undefined,
					travelerCount: form.travelerCount || undefined,
					budget: form.budget || undefined,
					preferences: JSON.stringify([...form.preferences, ...addonLabels]),
					specialRequirements: [
						form.specialRequirements,
						form.needEscort ? $t('travel.custom.needEscortFlag') : '',
					].filter(Boolean).join('\n') || undefined,
					needEscort: form.needEscort,
				},
			})
			submittedInquiryId.value = result
			submitted.value = true
			ElMessage.success($t('Submitted successfully, a planner will contact you soon!'))
			gtag('event', 'generate_lead', { source: 'custom-trip-page' })
		}
		catch {
			// 全局拦截器已弹错误提示
		}
		finally {
			submitting.value = false
		}
	})
}

function resetForm() {
	submitted.value = false
	formRef.value?.resetFields()
	form.preferences = []
	selectedAddons.value = []
	form.needEscort = false
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<div class="custom-page">
		<!-- ① Hero 区 -->
		<section class="custom-hero site-grid site-grid--vertical-100 site-grid--full">
			<div class="custom-hero__bg"></div>
			<div class="custom-hero__inner site-container">
				<h1 class="custom-hero__title">
					{{ tr('tour.customPage.heroTitle', '开启您的专属中国之旅') }}
				</h1>
				<p class="custom-hero__subtitle">
					{{ tr('tour.customPage.heroSub', '资深规划师1对1服务，从灵感探索到落地全程跟进') }}
				</p>
				<div class="custom-hero__badges">
					<div class="custom-hero__badge">
						<span class="custom-hero__badge-num">500+</span>
						<span class="custom-hero__badge-label">{{ $t('travel.custom.localAgencies') }}</span>
					</div>
					<div class="custom-hero__badge">
						<span class="custom-hero__badge-num">{{ $t('travel.custom.experienceYears') }}</span>
						<span class="custom-hero__badge-label">{{ $t('travel.custom.experience') }}</span>
					</div>
					<div class="custom-hero__badge">
						<span class="custom-hero__badge-num">4.9</span>
						<span class="custom-hero__badge-label">{{ $t('travel.custom.rating') }}</span>
					</div>
					<div class="custom-hero__badge">
						<span class="custom-hero__badge-num">30万+</span>
						<span class="custom-hero__badge-label">精英家庭</span>
					</div>
				</div>
				<button class="custom-hero__cta" @click="scrollToForm">
					{{ tr('tour.customPage.heroCta', '免费定制咨询') }}
				</button>
			</div>
		</section>

		<!-- ② 定制 vs 跟团 vs 自助 对比条 -->
		<section class="custom-compare">
			<div class="custom-compare__inner">
				<h2 class="custom-compare__heading">
					{{ tr('tour.customPage.compareHeading', '为什么选择定制旅行') }}
				</h2>
				<div class="custom-compare__grid">
					<!-- 传统跟团游 -->
					<div class="custom-compare__col">
						<h3 class="custom-compare__col-title">
							{{ tr('tour.customPage.compareGroup', '传统跟团游') }}
						</h3>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>固定路线，无法个性化</span>
						</div>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>购物陷阱，隐性消费多</span>
						</div>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>走马观花，体验浅</span>
						</div>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>无个性化服务</span>
						</div>
					</div>
					<!-- 自由行 -->
					<div class="custom-compare__col">
						<h3 class="custom-compare__col-title">
							{{ tr('tour.customPage.compareSelf', '自由行') }}
						</h3>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>自己做攻略，耗时耗力</span>
						</div>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>信息过载，难以决策</span>
						</div>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>突发情况难处理</span>
						</div>
						<div class="custom-compare__item custom-compare__item--bad">
							<span class="custom-compare__icon custom-compare__icon--bad">✗</span>
							<span>预订不确定，语言障碍</span>
						</div>
					</div>
					<!-- iswink定制 -->
					<div class="custom-compare__col custom-compare__col--highlight">
						<h3 class="custom-compare__col-title custom-compare__col-title--highlight">
							{{ tr('tour.customPage.compareCustom', '★ iswink定制') }}
						</h3>
						<div class="custom-compare__item custom-compare__item--good">
							<span class="custom-compare__icon custom-compare__icon--good">✓</span>
							<span>专业规划师量身打造</span>
						</div>
						<div class="custom-compare__item custom-compare__item--good">
							<span class="custom-compare__icon custom-compare__icon--good">✓</span>
							<span>本地直连，价格透明</span>
						</div>
						<div class="custom-compare__item custom-compare__item--good">
							<span class="custom-compare__icon custom-compare__icon--good">✓</span>
							<span>灵活自由，深度体验</span>
						</div>
						<div class="custom-compare__item custom-compare__item--good">
							<span class="custom-compare__icon custom-compare__icon--good">✓</span>
							<span>一价全包，无隐藏费用</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ③ 服务流程透明化 -->
		<section class="custom-process">
			<div class="custom-process__inner">
				<h2 class="custom-process__heading">
					{{ tr('tour.customPage.processHeading', '定制流程 · 全程透明') }}
				</h2>
				<div class="custom-process__timeline">
					<div class="custom-process__step">
						<div class="custom-process__step-num">1</div>
						<h3 class="custom-process__step-title">需求沟通</h3>
						<p class="custom-process__step-desc">免费咨询，无任何规划费用</p>
					</div>
					<div class="custom-process__step">
						<div class="custom-process__step-num">2</div>
						<h3 class="custom-process__step-title">方案设计</h3>
						<p class="custom-process__step-desc">规划师1对1定制</p>
					</div>
					<div class="custom-process__step">
						<div class="custom-process__step-num">3</div>
						<h3 class="custom-process__step-title">满意确认</h3>
						<p class="custom-process__step-desc">无限修改至您满意</p>
					</div>
					<div class="custom-process__step">
						<div class="custom-process__step-num">4</div>
						<h3 class="custom-process__step-title">签约支付</h3>
						<p class="custom-process__step-desc">第三方资金托管</p>
					</div>
				</div>
				<div class="custom-process__timeline custom-process__row2">
					<div class="custom-process__step">
						<div class="custom-process__step-num">5</div>
						<h3 class="custom-process__step-title">行前准备</h3>
						<p class="custom-process__step-desc">电子路书+行前提醒</p>
					</div>
					<div class="custom-process__step">
						<div class="custom-process__step-num">6</div>
						<h3 class="custom-process__step-title">全程服务</h3>
						<p class="custom-process__step-desc">7×24管家+应急响应</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ④ 旅行风格探索器 -->
		<section class="custom-explorer">
			<div class="custom-explorer__inner">
				<h2 class="custom-explorer__heading">
					{{ tr('tour.customPage.explorerHeading', '2分钟找到你的理想旅行') }}
				</h2>
				<p class="custom-explorer__question">
					{{ tr('tour.customPage.explorerStyle', '你的旅行风格是？') }}
				</p>
				<div class="custom-explorer__options">
					<button
						v-for="opt in styleOptions"
						:key="opt.key"
						class="custom-explorer__option"
						:class="{ 'custom-explorer__option--active': explorerStyle === opt.key }"
						@click="explorerStyle = opt.key"
					>
						{{ opt.label }}
					</button>
				</div>
				<p class="custom-explorer__question">
					{{ tr('tour.customPage.explorerPeople', '出行人数？') }}
				</p>
				<div class="custom-explorer__options">
					<button
						v-for="opt in peopleOptions"
						:key="opt"
						class="custom-explorer__option"
						:class="{ 'custom-explorer__option--active': explorerPeople === opt }"
						@click="explorerPeople = opt"
					>
						{{ opt }}
					</button>
				</div>
				<p class="custom-explorer__question">
					{{ tr('tour.customPage.explorerDays', '理想天数？') }}
				</p>
				<div class="custom-explorer__options">
					<button
						v-for="opt in daysOptions"
						:key="opt"
						class="custom-explorer__option"
						:class="{ 'custom-explorer__option--active': explorerDays === opt }"
						@click="explorerDays = opt"
					>
						{{ opt }}
					</button>
				</div>
				<div v-if="explorerResult" class="custom-explorer__result">
					<h3 class="custom-explorer__result-title">
						✨ 推荐目的地
					</h3>
					<p class="custom-explorer__result-desc">
						{{ explorerResult }}
					</p>
					<button class="custom-explorer__result-btn" @click="scrollToForm">
						{{ tr('tour.customPage.explorerResult', '获取专属方案') }}
					</button>
				</div>
			</div>
		</section>

		<!-- ⑤ 精选目的地灵感 -->
		<section class="custom-destinations">
			<div class="custom-destinations__inner">
				<h2 class="custom-destinations__heading">
					{{ tr('tour.customPage.destHeading', '精选目的地灵感') }}
				</h2>
				<div class="custom-destinations__filters">
					<button
						v-for="f in destFilters"
						:key="f"
						class="custom-destinations__filter"
						:class="{ 'custom-destinations__filter--active': activeDestFilter === f }"
						@click="activeDestFilter = f"
					>
						{{ f }}
					</button>
				</div>
				<div class="custom-destinations__grid">
					<article
						v-for="dest in filteredDests"
						:key="dest.name"
						class="custom-destinations__card"
						@click="selectDestination(dest.name)"
					>
						<div class="custom-destinations__card-img">
							<span class="custom-destinations__card-name">{{ dest.name }}</span>
						</div>
						<div class="custom-destinations__card-info">
							<p class="custom-destinations__card-desc">{{ dest.desc }}</p>
							<div class="custom-destinations__card-meta">
								<span class="custom-destinations__card-days">{{ dest.days }}</span>
								<span class="custom-destinations__card-price">{{ dest.price }}</span>
							</div>
							<span class="custom-destinations__card-link">{{ tr('tour.packages.customize', '定制此路线') }} →</span>
						</div>
					</article>
				</div>
			</div>
		</section>

		<!-- ⑥ 行程类型深度展示 -->
		<section class="custom-types">
			<div class="custom-types__inner">
				<h2 class="custom-types__heading">
					{{ tr('tour.customPage.typeHeading', '行程类型深度展示') }}
				</h2>
				<div class="custom-types__grid">
					<article
						v-for="item in tripTypes"
						:key="item.title"
						class="custom-types__card"
						@click="scrollToForm"
					>
						<div class="custom-types__card-header">
							<Icon :name="item.icon" class="custom-types__card-icon" />
							<h3 class="custom-types__card-title">{{ item.title }}</h3>
						</div>
						<p class="custom-types__card-desc">{{ item.desc }}</p>
						<ul class="custom-types__card-includes">
							<li v-for="inc in item.includes" :key="inc">{{ inc }}</li>
						</ul>
						<p class="custom-types__card-suitable">{{ item.suitable }}</p>
						<NuxtLink :to="$path('/case')" class="custom-types__card-link">查看案例 →</NuxtLink>
					</article>
				</div>
			</div>
		</section>

		<!-- ⑦ 定制师介绍 -->
		<section class="custom-planners">
			<div class="custom-planners__inner">
				<h2 class="custom-planners__heading">
					{{ tr('tour.customPage.plannerHeading', '为您匹配资深定制师') }}
				</h2>
				<div class="custom-planners__grid">
					<div v-for="p in planners" :key="p.name" class="custom-planners__card">
						<div class="custom-planners__avatar">{{ p.avatar }}</div>
						<h3 class="custom-planners__name">{{ p.name }}</h3>
						<p class="custom-planners__meta">{{ p.years }}</p>
						<p class="custom-planners__specialty">{{ p.specialty }}</p>
						<div class="custom-planners__stats">
							<span class="custom-planners__rating">★ {{ p.rating }}</span>
							<span>{{ p.orders }}</span>
						</div>
					</div>
				</div>
				<p class="custom-planners__sub">
					{{ tr('tour.customPage.plannerSub', '提交需求后24小时内，我们将为您匹配最合适的资深规划师') }}
				</p>
			</div>
		</section>

		<!-- ⑧ 定制需求表单 -->
		<section class="custom-form-section site-grid site-grid--vertical-100 site-grid--full">
			<div class="custom-form-section__inner site-container">
				<div v-if="submitted" class="custom-success">
					<div class="custom-success__icon">✓</div>
					<h2 class="custom-success__title">{{ $t('travel.custom.successTitle') }}</h2>
					<p class="custom-success__desc">
						{{ $t('travel.custom.successDesc1') }}<br>
						{{ $t('travel.custom.successDesc2') }}
					</p>
					<NuxtLink v-if="submittedInquiryId" :to="$path('/user/my-travel?tab=travel')" class="custom-success__btn custom-success__btn--primary">
						{{ $t('travel.custom.viewMyRequest') }}
					</NuxtLink>
					<button class="custom-success__btn custom-success__btn--secondary" @click="resetForm">
						{{ $t('travel.custom.submitAnother') }}
					</button>
				</div>
				<el-form
					v-else
					ref="formRef"
					:model="form"
					:rules="rules"
					class="custom-form"
					label-position="top"
				>
					<h2 class="custom-form__heading">
						{{ tr('tour.customPage.formHeading', '免费定制行程') }}
					</h2>

					<!-- 基本信息 -->
					<div class="custom-form__group">
						<h3 class="custom-form__group-title">{{ $t('travel.custom.basicInfo') }}</h3>
						<div class="custom-form__row">
							<el-form-item :label="`${$t('travel.custom.email')} *`" prop="email">
								<el-input v-model="form.email" :placeholder="$t('travel.custom.emailPlaceholder')" />
							</el-form-item>
							<el-form-item :label="$t('travel.custom.phone')">
								<el-input v-model="form.mobile" :placeholder="$t('travel.custom.phonePlaceholder')" />
							</el-form-item>
						</div>
						<div class="custom-form__row">
							<el-form-item :label="`${$t('travel.custom.startDate')} *`" prop="startDate">
								<el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" :placeholder="$t('travel.custom.startDatePlaceholder')" style="width:100%" />
							</el-form-item>
							<el-form-item :label="$t('travel.custom.endDate')">
								<el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" :placeholder="$t('travel.custom.endDatePlaceholder')" style="width:100%" />
							</el-form-item>
						</div>
						<div class="custom-form__row">
							<el-form-item :label="$t('travel.custom.travelerCount')">
								<el-input-number v-model="form.travelerCount" :min="1" :max="50" />
							</el-form-item>
							<el-form-item :label="$t('travel.custom.budget')">
								<el-select v-model="form.budget" :placeholder="$t('travel.custom.budgetPlaceholder')" clearable style="width:100%">
									<el-option v-for="b in budgets" :key="b.key" :label="`${$t(`travel.custom.budgets.${b.key}.label`)} ${b.range}${$t('travel.custom.budgetPerPerson')}`" :value="`${b.range}${$t('travel.custom.budgetPerPerson')}`" />
								</el-select>
							</el-form-item>
						</div>
					</div>

					<!-- 目的地偏好 -->
					<div class="custom-form__group">
						<h3 class="custom-form__group-title">{{ $t('travel.custom.destPref') }} *</h3>
						<div class="custom-form__tags">
							<button
								v-for="dk in destinationKeys"
								:key="dk"
								type="button"
								class="custom-form__tag"
								:class="{ 'custom-form__tag--active': form.destination === $t(`travel.custom.destinations.${dk}`) }"
								@click="form.destination = form.destination === $t(`travel.custom.destinations.${dk}`) ? '' : $t(`travel.custom.destinations.${dk}`)"
							>
								{{ $t(`travel.custom.destinations.${dk}`) }}
							</button>
						</div>
					</div>

					<!-- 旅行风格 -->
					<div class="custom-form__group">
						<h3 class="custom-form__group-title">{{ $t('travel.custom.themePref') }}</h3>
						<div class="custom-form__themes">
							<div
								v-for="item in themes"
								:key="item.key"
								class="custom-form__theme-card"
								:class="{ 'custom-form__theme-card--active': form.preferences.includes($t(`travel.custom.theme.${item.key}.label`)) }"
								@click="form.preferences.includes($t(`travel.custom.theme.${item.key}.label`)) ? form.preferences.splice(form.preferences.indexOf($t(`travel.custom.theme.${item.key}.label`)), 1) : form.preferences.push($t(`travel.custom.theme.${item.key}.label`))"
							>
								<Icon :name="item.icon" class="custom-form__theme-icon" />
								<div class="custom-form__theme-label">{{ $t(`travel.custom.theme.${item.key}.label`) }}</div>
							</div>
						</div>
					</div>

					<!-- 附加服务 -->
					<div class="custom-form__group">
						<h3 class="custom-form__group-title">{{ $t('travel.custom.addons') }}</h3>
						<div class="custom-form__addons">
							<label
								v-for="ak in addonKeys"
								:key="ak"
								class="custom-form__addon"
								:class="{ 'custom-form__addon--active': selectedAddons.includes(ak) }"
							>
								<input
									type="checkbox"
									:checked="selectedAddons.includes(ak)"
									@change="selectedAddons.includes(ak) ? selectedAddons.splice(selectedAddons.indexOf(ak), 1) : selectedAddons.push(ak)"
								>
								{{ $t(`travel.custom.addonsList.${ak}`) }}
							</label>
						</div>
					</div>

					<!-- 随行服务 -->
					<div class="custom-form__group">
						<h3 class="custom-form__group-title">{{ $t('travel.custom.escortService') }}</h3>
						<label class="custom-form__addon custom-form__addon--active" style="display:inline-flex;">
							<input v-model="form.needEscort" type="checkbox">
							{{ $t('travel.custom.needEscort') }}
						</label>
					</div>

					<!-- 特殊需求 -->
					<div class="custom-form__group">
						<h3 class="custom-form__group-title">{{ $t('travel.custom.specialNeeds') }}</h3>
						<el-form-item>
							<el-input
								v-model="form.specialRequirements"
								type="textarea"
								:rows="4"
								:placeholder="$t('travel.custom.specialNeedsPlaceholder')"
							/>
						</el-form-item>
					</div>

					<button
						type="button"
						class="custom-form__submit"
						:disabled="submitting"
						@click="submit"
					>
						{{ submitting ? $t('travel.custom.submitting') : tr('tour.cta.submit', '免费定制行程') }}
					</button>
					<p class="custom-form__tip">
						✓ {{ $t('travel.custom.freeConsult') }} &nbsp;&nbsp; ✓ {{ $t('travel.custom.noHiddenFee') }} &nbsp;&nbsp; ✓ {{ $t('travel.custom.replyIn24h') }}<br>
						✓ 方案不满意全额退款
					</p>
				</el-form>
			</div>
		</section>

		<!-- ⑨ 客户评价轮播 -->
		<section class="custom-reviews">
			<div class="custom-reviews__inner">
				<h2 class="custom-reviews__heading">
					{{ tr('tour.customPage.reviewHeading', '真实客户评价') }}
				</h2>
				<div class="custom-reviews__carousel">
					<div class="custom-reviews__track" :style="{ transform: `translateX(-${activeReview * 100}%)` }">
						<div v-for="(r, i) in reviews" :key="i" class="custom-reviews__item">
							<div class="custom-reviews__quote">
								<p class="custom-reviews__quote-text">"{{ r.text }}"</p>
								<p class="custom-reviews__quote-author">
									<strong>{{ r.author }}</strong>
									{{ r.route }}
									<span class="custom-reviews__quote-verified">★{{ r.rating }} ✓ {{ $t('tour.caseDetail.verifiedOrder') }}</span>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="custom-reviews__dots">
					<button
						v-for="(_, i) in reviews"
						:key="i"
						class="custom-reviews__dot"
						:class="{ 'custom-reviews__dot--active': i === activeReview }"
						@click="activeReview = i"
					/>
				</div>
			</div>
		</section>

		<!-- ⑩ 服务保障矩阵 -->
		<section class="custom-trust">
			<div class="custom-trust__inner">
				<h2 class="custom-trust__heading">
					{{ tr('tour.customPage.trustHeading', '安心出行保障') }}
				</h2>
				<div class="custom-trust__grid">
					<div class="custom-trust__item">
						<div class="custom-trust__icon"><Icon name="icon:shop" /></div>
						<h3 class="custom-trust__item-title">{{ tr('tour.trust.licensed', '正规资质') }}</h3>
						<p class="custom-trust__item-desc">持牌旅行社经营许可，合规合法</p>
					</div>
					<div class="custom-trust__item">
						<div class="custom-trust__icon"><Icon name="icon:user" /></div>
						<h3 class="custom-trust__item-title">{{ tr('tour.trust.payment', '资金安全') }}</h3>
						<p class="custom-trust__item-desc">第三方资金托管，满意才付款</p>
					</div>
					<div class="custom-trust__item">
						<div class="custom-trust__icon"><Icon name="icon:like" /></div>
						<h3 class="custom-trust__item-title">{{ tr('tour.trust.refund', '灵活退改') }}</h3>
						<p class="custom-trust__item-desc">行前无忧退改，方案不满意全额退款</p>
					</div>
					<div class="custom-trust__item">
						<div class="custom-trust__icon"><Icon name="icon:menu" /></div>
						<h3 class="custom-trust__item-title">{{ tr('tour.trust.support', '7×24管家') }}</h3>
						<p class="custom-trust__item-desc">全程中文管家，紧急情况即时响应</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑪ 底部CTA -->
		<section class="custom-bottom-cta">
			<div class="custom-bottom-cta__inner">
				<h2 class="custom-bottom-cta__title">
					{{ tr('tour.customPage.bottomCtaTitle', '还在犹豫？前期咨询完全免费') }}
				</h2>
				<p class="custom-bottom-cta__desc">
					{{ tr('tour.customPage.bottomCtaDesc', '提交需求，规划师24小时内为您量身打造专属方案') }}
				</p>
				<button class="custom-bottom-cta__btn" @click="scrollToForm">
					{{ tr('tour.customPage.heroCta', '免费咨询') }}
				</button>
				<p class="custom-bottom-cta__wechat">
					{{ tr('tour.customPage.wechat', '或添加微信 iswink_travel 1对1咨询') }}
				</p>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import url('./custom.scss');
</style>
