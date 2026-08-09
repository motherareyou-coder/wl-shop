<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { tourStaff } from '~/config/tour-staff'

definePageMeta({
	title: 'Companion Service',
})

// SEO
const route = useRoute()
const { domain } = useRuntimeConfig().public
useSEO({
	routeKey: 'companion',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Companion Service', url: `${domain}${route.path}` },
	],
})

const { gtag } = useGtag()
gtag('event', 'screen_view', { screen_name: 'companion-service' })

// 登录拦截：companion 表单需登录（travel/escort-inquiry/create 需登录态）
const userStore = useUserStore()
const router = useRouter()
onMounted(() => {
	if (!userStore.accessToken) {
		ElMessage.info($t('Please sign in first'))
		router.push(`${$path('/login')}?redirect=${encodeURIComponent(route.fullPath)}`)
	}
})

function scrollToForm() {
	document.querySelector('.comp-form-section')?.scrollIntoView({ behavior: 'smooth' })
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}

// ===== Section 3：一天的生活场景叙事 =====
const scenarios = [
	{ key: 'romance', icon: 'icon:like', labelKey: 'tour.companion.service.romance', label: '浪漫时刻' },
	{ key: 'business', icon: 'icon:shop', labelKey: 'tour.companion.service.business', label: '商务陪同' },
	{ key: 'culture', icon: 'icon:menu', labelKey: 'tour.companion.service.culture', label: '文化导览' },
	{ key: 'special', icon: 'icon:user', labelKey: 'tour.companion.service.special', label: '特色体验' },
]
const activeScenario = ref(0)

// 每场景对应一天的 6 节点时间线
const scenarioTimeline: Record<string, Array<{ time: string, icon: string, activity: string }>> = {
	romance: [
		{ time: '7:00', icon: 'icon:shop', activity: '确认行程 · 专属陪伴师就位' },
		{ time: '9:00', icon: 'icon:like', activity: '私密景观早餐 · 鲜花氛围布置' },
		{ time: '10:30', icon: 'icon:menu', activity: '双人文化讲解 · 漫步老城' },
		{ time: '12:00', icon: 'icon:like', activity: '特色情侣午餐 · 私密包间' },
		{ time: '14:00', icon: 'icon:menu', activity: '非遗手作体验 · 共制纪念' },
		{ time: '20:00', icon: 'icon:like', activity: '浪漫惊喜环节 · 专业摄影记录' },
	],
	business: [
		{ time: '7:00', icon: 'icon:shop', activity: '确认行程 · 商务陪同师对接' },
		{ time: '9:00', icon: 'icon:shop', activity: 'VIP 接机 · 专车送达酒店' },
		{ time: '10:30', icon: 'icon:user', activity: '会议翻译 · 商务礼仪全程陪同' },
		{ time: '12:00', icon: 'icon:shop', activity: '商务宴请安排 · 高端餐饮' },
		{ time: '14:00', icon: 'icon:shop', activity: '考察陪同 · 日程无缝协调' },
		{ time: '20:00', icon: 'icon:shop', activity: '总结复盘 · 次日行程确认' },
	],
	culture: [
		{ time: '7:00', icon: 'icon:shop', activity: '确认行程 · 文化向导就位' },
		{ time: '9:00', icon: 'icon:menu', activity: '特色早茶 · 在地文化开场' },
		{ time: '10:30', icon: 'icon:menu', activity: '深度文化讲解 · 历史故事' },
		{ time: '12:00', icon: 'icon:menu', activity: '在地特色午餐 · 私藏餐厅' },
		{ time: '14:00', icon: 'icon:menu', activity: '非遗工坊体验 · 大师面对面' },
		{ time: '20:00', icon: 'icon:menu', activity: '文化夜话 · 私人定制路线总结' },
	],
	special: [
		{ time: '7:00', icon: 'icon:shop', activity: '确认行程 · 专属策划师就位' },
		{ time: '9:00', icon: 'icon:user', activity: '主题早餐布置 · 惊喜开场' },
		{ time: '10:30', icon: 'icon:user', activity: '主题活动安排 · 个性化体验' },
		{ time: '12:00', icon: 'icon:like', activity: '庆祝午餐 · 专属布置' },
		{ time: '14:00', icon: 'icon:menu', activity: '特色体验环节 · 主题定制' },
		{ time: '20:00', icon: 'icon:like', activity: '惊喜高潮 · 全程影像记录' },
	],
}
const currentTimeline = computed(() => scenarioTimeline[scenarios[activeScenario.value].key] || scenarioTimeline.romance)

// ===== Section 4：四大服务场景详细卡片 =====
const serviceCards = computed(() => [
	{
		key: 'romance', icon: 'icon:like',
		name: $t('travel.companion.services.romance.name'),
		desc: $t('travel.companion.services.romance.desc'),
		features: $tm('travel.companion.services.romance.features') as string[],
		scenarios: $tm('travel.companion.services.romance.scenarios') as string[],
		price: $t('travel.companion.services.romance.price'),
	},
	{
		key: 'business', icon: 'icon:shop',
		name: $t('travel.companion.services.business.name'),
		desc: $t('travel.companion.services.business.desc'),
		features: $tm('travel.companion.services.business.features') as string[],
		scenarios: $tm('travel.companion.services.business.scenarios') as string[],
		price: $t('travel.companion.services.business.price'),
	},
	{
		key: 'culture', icon: 'icon:menu',
		name: $t('travel.companion.services.culture.name'),
		desc: $t('travel.companion.services.culture.desc'),
		features: $tm('travel.companion.services.culture.features') as string[],
		scenarios: $tm('travel.companion.services.culture.scenarios') as string[],
		price: $t('travel.companion.services.culture.price'),
	},
	{
		key: 'special', icon: 'icon:user',
		name: $t('travel.companion.services.special.name'),
		desc: $t('travel.companion.services.special.desc'),
		features: $tm('travel.companion.services.special.features') as string[],
		scenarios: $tm('travel.companion.services.special.scenarios') as string[],
		price: $t('travel.companion.services.special.price'),
	},
])

// ===== Section 5：动态聊天回放引擎（完整保留）=====
const conversations = [
	{
		scenario: '浪漫时刻',
		messages: [
			{ from: 'user', text: '你好，我是 Linda，想安排结婚纪念日的陪伴服务' },
			{ from: 'user', text: '希望浪漫一点，有鲜花、私密餐厅和拍照' },
			{ from: 'agent', text: 'Linda 您好！为您匹配「浪漫时刻」专属服务' },
			{ from: 'agent', text: '安排资深陪伴师 + 私密景观餐厅 + 鲜花布置 + 专业摄影记录' },
		],
	},
	{
		scenario: '商务陪同',
		messages: [
			{ from: 'user', text: '我是 Michael，下周有商务考察，需要随行翻译' },
			{ from: 'user', text: '英语和日语，3 天行程' },
			{ from: 'agent', text: 'Michael 您好！为您安排「商务陪同」专业服务' },
			{ from: 'agent', text: '匹配英日双语陪同 + 商务礼仪 + 专车接送 + 日程协调' },
		],
	},
	{
		scenario: '文化导览',
		messages: [
			{ from: 'user', text: '想深度体验当地文化，不想走马观花' },
			{ from: 'user', text: '对非遗和手工艺特别感兴趣' },
			{ from: 'agent', text: '为您匹配「文化导览」私人向导' },
			{ from: 'agent', text: '安排本地文化向导 + 非遗工坊体验 + 私人定制路线' },
		],
	},
	{
		scenario: '特色体验',
		messages: [
			{ from: 'user', text: '想给妈妈安排一个特别的 60 岁生日惊喜' },
			{ from: 'user', text: '在旅行中，希望有惊喜环节' },
			{ from: 'agent', text: '为您匹配「特色体验」定制服务' },
			{ from: 'agent', text: '安排惊喜策划 + 主题布置 + 专属庆祝活动 + 影像记录' },
		],
	},
]

const activeIndex = ref(0)
const visibleCount = ref(0)
const isTyping = ref(false)

function playConversation() {
	const conv = conversations[activeIndex.value]
	// 已显示完当前场景所有消息 → 停留后切换下一个场景
	if (visibleCount.value >= conv.messages.length) {
		setTimeout(() => {
			activeIndex.value = (activeIndex.value + 1) % conversations.length
			visibleCount.value = 0
			playConversation()
		}, 3000)
		return
	}

	const nextMsg = conv.messages[visibleCount.value]
	// 平台回复前显示"正在输入"（模拟打字等待）
	if (nextMsg.from === 'agent' && visibleCount.value > 0) {
		isTyping.value = true
		setTimeout(() => {
			isTyping.value = false
			visibleCount.value++
			const delay = nextMsg.from === 'user' ? 1200 : 1600
			setTimeout(playConversation, delay)
		}, 1400)
	}
	else {
		visibleCount.value++
		const delay = nextMsg.from === 'user' ? 1000 : 1600
		setTimeout(playConversation, delay)
	}
}

onMounted(() => {
	playConversation()
})

// 点击场景标签时重置回放
function switchScenario(i: number) {
	activeIndex.value = i
	visibleCount.value = 0
	isTyping.value = false
	playConversation()
}

// ===== Section 6：服务标准与承诺 =====
const standardIncluded = computed(() => $tm('travel.companion.services.romance.features') as string[])
const includedList = ['专属陪伴师', '行程协调', '文化讲解', '翻译服务', '紧急响应']
const excludedList = ['机票高铁', '酒店住宿', '景点门票', '餐饮费用', '个人购物']
const upgradeList = ['摄影跟拍', '花艺布置', '惊喜策划', '专车升级', '多语种翻译']

// ===== Section 7：专属服务团队（从 ~/config/tour-staff 导入）=====
const staffList = computed(() => tourStaff.slice(0, 3))

// ===== Section 8：安全保障 =====
const securityList = [
	{ icon: 'icon:shop', title: '严格背景调查', desc: '所有陪伴师经身份核验、资质审查、面试三轮筛选，持证上岗。' },
	{ icon: 'icon:user', title: '信息加密全程不记录', desc: '签署保密协议，客户信息端到端加密，服务过程绝对私密。' },
	{ icon: 'icon:menu', title: '明确服务协议', desc: '服务前签订正式协议，内容、时长、礼仪规范清晰透明。' },
	{ icon: 'icon:like', title: '24h 应急联系人', desc: '全程平台跟踪，紧急情况一键直达客服，7×24 即时响应。' },
]

// ===== Section 9：预约表单 =====
const langOptList = computed(() => $tm('travel.companion.langOpts') as string[])
const svcTypeOptList = computed(() => $tm('travel.companion.svcTypeOpts') as string[])

const formRef = ref<FormInstance>()
const form = reactive({
	destination: '', // 必填
	startDate: '', // 必填
	endDate: '', // 必填
	languageNeeds: [] as string[],
	serviceTypes: [] as string[],
	travelerCount: 1,
	specialRequirements: '',
	isOwnItinerary: false,
	ownItineraryDesc: '',
})

const rules = computed<FormRules>(() => ({
	destination: [{ required: true, message: $t('travel.companion.v.destinationRequired'), trigger: 'blur' }],
	startDate: [{ required: true, message: $t('travel.companion.v.startDateRequired'), trigger: 'change' }],
	endDate: [{ required: true, message: $t('travel.companion.v.endDateRequired'), trigger: 'change' }],
}))
const submitting = ref(false)
const submitted = ref(false)
const submittedInquiryId = ref<number | null>(null)

async function submit() {
	if (!formRef.value)
		return
	await formRef.value.validate(async (valid) => {
		if (!valid) {
			ElMessage.info($t('Please fill in the required fields'))
			return
		}
		submitting.value = true
		try {
			// 对接 /travel/escort-inquiry/create（需登录）
			const result = await $api<number>('travel/escort-inquiry/create', {
				method: 'post',
				body: {
					destination: form.destination,
					startDate: form.startDate,
					endDate: form.endDate,
					languageNeeds: form.languageNeeds.length ? JSON.stringify(form.languageNeeds) : undefined,
					serviceTypes: form.serviceTypes.length ? JSON.stringify(form.serviceTypes) : undefined,
					travelerCount: form.travelerCount || undefined,
					specialRequirements: form.specialRequirements || undefined,
					isOwnItinerary: form.isOwnItinerary,
					ownItineraryDesc: form.isOwnItinerary ? form.ownItineraryDesc : undefined,
				},
			})
			submittedInquiryId.value = result
			submitted.value = true
			gtag('event', 'generate_lead', { source: 'companion-page' })
		}
		catch {}
		finally { submitting.value = false }
	})
}

// ===== Section 10：FAQ =====
const faqList = computed(() => $tm('travel.companion.faqs') as Array<Record<string, any>>)
const openFaq = ref<number | null>(0)
function toggleFaq(i: number) {
	openFaq.value = openFaq.value === i ? null : i
}
</script>

<template>
	<div class="companion-page">
		<!-- ① Hero 区 -->
		<section class="comp-hero">
			<div class="comp-hero__bg"></div>
			<div class="comp-hero__inner">
				<h1 class="comp-hero__title">
					{{ tr('tour.companion.heading', '情感陪伴服务') }}
				</h1>
				<p class="comp-hero__subtitle">
					{{ tr('tour.companion.hero.sub', '让每段旅程都充满温度与专属关怀') }}
				</p>
				<div class="comp-hero__tags">
					<span class="comp-hero__tag">✓ {{ tr('travel.companion.tags.screening', '严格筛选') }}</span>
					<span class="comp-hero__tag">✓ {{ tr('travel.companion.tags.privacy', '隐私保护') }}</span>
					<span class="comp-hero__tag">✓ {{ tr('travel.companion.tags.guarantee', '品质保证') }}</span>
					<span class="comp-hero__tag">✓ 24h 响应</span>
				</div>
				<button class="comp-hero__cta" @click="scrollToForm">
					{{ tr('tour.companion.form.cta', '立即预约咨询') }}
				</button>
			</div>
		</section>

		<!-- ② 服务理念 -->
		<section class="comp-philosophy">
			<div class="comp-philosophy__inner">
				<h2 class="comp-philosophy__heading">
					{{ tr('tour.companion.philosophy.title', '不只是陪伴，更是一段有温度的旅程') }}
				</h2>
				<div class="comp-philosophy__lines">
					<p class="comp-philosophy__line">
						{{ tr('tour.companion.philosophy.line1', '我们相信，真正难忘的旅程，不在于去过多少地方，而在于陪伴在身边的人。') }}
					</p>
					<p class="comp-philosophy__line">
						{{ tr('tour.companion.philosophy.line2', '每一位陪伴师都经过严格筛选与专业培训，懂得在恰当的时刻给予恰当的关怀，让每个特殊时刻都被温柔以待。') }}
					</p>
					<p class="comp-philosophy__line">
						{{ tr('tour.companion.philosophy.line3', '从浪漫纪念日到深度文化体验，从重要商务场合到专属惊喜策划，我们用专业与温度，为您的旅程增添不可复制的美好回忆。') }}
					</p>
				</div>
			</div>
		</section>

		<!-- ③ 「一天的生活」场景叙事 -->
		<section class="comp-day">
			<div class="comp-day__inner">
				<h2 class="comp-day__heading">
					{{ tr('tour.companion.day.title', '一天的生活 · 场景叙事') }}
				</h2>
				<p class="comp-day__subheading">
					{{ tr('tour.companion.day.sub', '不同场景下，陪伴师如何为您安排完美的一天') }}
				</p>
				<!-- 4 场景切换 -->
				<div class="comp-day__scenarios">
					<button
						v-for="(s, i) in scenarios"
						:key="s.key"
						class="comp-day__scenario"
						:class="{ 'comp-day__scenario--active': i === activeScenario }"
						@click="activeScenario = i"
					>
						<Icon :name="s.icon" class="comp-day__scenario-icon" />
						{{ tr(s.labelKey, s.label) }}
					</button>
				</div>
				<!-- 横向 6 节点时间线 -->
				<Transition name="comp-fade" mode="out-in">
					<div :key="activeScenario" class="comp-day__timeline">
						<div
							v-for="(node, ni) in currentTimeline"
							:key="ni"
							class="comp-day__node"
							:class="{ 'comp-day__node--last': ni === currentTimeline.length - 1 }"
						>
							<div class="comp-day__node-icon">
								<Icon :name="node.icon" />
							</div>
							<div class="comp-day__node-time">{{ node.time }}</div>
							<div class="comp-day__node-activity">{{ node.activity }}</div>
						</div>
					</div>
				</Transition>
			</div>
		</section>

		<!-- ④ 四大服务场景详细卡片 -->
		<section class="comp-services">
			<div class="comp-services__inner">
				<h2 class="comp-services__heading">
					{{ tr('tour.companion.services.title', '四大服务场景') }}
				</h2>
				<div class="comp-services__grid">
					<article v-for="(svc, si) in serviceCards" :key="si" class="comp-services__card">
						<div class="comp-services__card-header">
							<div class="comp-services__card-icon">
								<Icon :name="svc.icon" />
							</div>
							<h3 class="comp-services__card-title">{{ svc.name }}</h3>
						</div>
						<p class="comp-services__card-desc">{{ svc.desc }}</p>
						<ul class="comp-services__card-includes">
							<li v-for="(f, fi) in svc.features" :key="fi">✓ {{ f }}</li>
						</ul>
						<div class="comp-services__card-scenarios">
							<span v-for="(s, sci) in svc.scenarios" :key="sci" class="comp-services__card-tag">{{ s }}</span>
						</div>
						<div class="comp-services__card-footer">
							<span class="comp-services__card-price">{{ svc.price }}</span>
							<button class="comp-services__card-link" @click="scrollToForm">
								{{ tr('tour.companion.services.book', '预约咨询') }} →
							</button>
						</div>
					</article>
				</div>
			</div>
		</section>

		<!-- ⑤ 聊天咨询模拟（动态聊天回放引擎）-->
		<section class="comp-chat">
			<div class="comp-chat__inner">
				<h2 class="comp-chat__heading">
					{{ tr('tour.companion.chat.title', '真实咨询场景模拟') }}
				</h2>
				<div class="comp-chat__body">
					<!-- 左：聊天窗口 -->
					<div class="comp-chat__window">
						<div class="comp-chat__head">
							<div class="comp-chat__agent">
								<div class="comp-chat__avatar">
									<Icon name="icon:user" />
								</div>
								<div>
									<div class="comp-chat__name">iswink 专属顾问</div>
									<div class="comp-chat__status">
										<span class="comp-chat__dot"></span> 在线 · 24h 响应
									</div>
								</div>
							</div>
						</div>
						<div :key="activeIndex" class="comp-chat__msg-area">
							<TransitionGroup name="bubble">
								<div
									v-for="i in visibleCount"
									:key="`${activeIndex}-${i}`"
									class="comp-chat__msg"
									:class="conversations[activeIndex].messages[i - 1].from === 'user' ? 'comp-chat__msg--user' : 'comp-chat__msg--agent'"
								>
									<div class="comp-chat__msg-avatar" :class="conversations[activeIndex].messages[i - 1].from === 'user' ? 'comp-chat__msg-avatar--user' : 'comp-chat__msg-avatar--agent'">
										{{ conversations[activeIndex].messages[i - 1].from === 'user' ? '我' : 'i' }}
									</div>
									<div class="comp-chat__bubble" :class="conversations[activeIndex].messages[i - 1].from === 'user' ? 'comp-chat__bubble--user' : 'comp-chat__bubble--agent'">
										{{ conversations[activeIndex].messages[i - 1].text }}
									</div>
								</div>
							</TransitionGroup>
							<div v-if="isTyping" class="comp-chat__msg comp-chat__msg--agent">
								<div class="comp-chat__msg-avatar comp-chat__msg-avatar--agent">i</div>
								<div class="comp-chat__typing">
									<span class="comp-chat__typing-dot"></span>
									<span class="comp-chat__typing-dot"></span>
									<span class="comp-chat__typing-dot"></span>
								</div>
							</div>
						</div>
						<div class="comp-chat__dots">
							<button
								v-for="(conv, i) in conversations"
								:key="i"
								class="comp-chat__dot-btn"
								:class="{ 'comp-chat__dot-btn--active': i === activeIndex }"
								@click="switchScenario(i)"
							>
								{{ conv.scenario }}
							</button>
						</div>
					</div>
					<!-- 右：场景切换 + 引导文案 -->
					<div class="comp-chat__intro">
						<h3 class="comp-chat__intro-title">
							{{ tr('tour.companion.chat.introTitle', '从咨询到匹配，只需一步') }}
						</h3>
						<p class="comp-chat__intro-desc">
							{{ tr('tour.companion.chat.introDesc', '描述您的场景与需求，专属顾问将为您匹配最合适的陪伴师与服务方案。') }}
						</p>
						<ul class="comp-chat__points">
							<li>{{ tr('tour.companion.chat.point1', '4 大场景，精准匹配专属陪伴师') }}</li>
							<li>{{ tr('tour.companion.chat.point2', '隐私加密，全程无忧') }}</li>
							<li>{{ tr('tour.companion.chat.point3', '不满意全额退款，品质有保障') }}</li>
						</ul>
						<button class="comp-chat__cta" @click="scrollToForm">
							{{ tr('tour.companion.form.cta', '立即预约咨询') }}
						</button>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑥ 服务标准与承诺 -->
		<section class="comp-standard">
			<div class="comp-standard__inner">
				<h2 class="comp-standard__heading">
					{{ tr('tour.companion.standard.title', '服务标准与承诺') }}
				</h2>
				<div class="comp-standard__grid">
					<div class="comp-standard__col comp-standard__col--included">
						<div class="comp-standard__col-head">
							<span class="comp-standard__col-icon comp-standard__col-icon--check">✓</span>
							<h3>{{ tr('tour.companion.standard.included', '服务包含') }}</h3>
						</div>
						<ul class="comp-standard__list">
							<li v-for="(item, ii) in includedList" :key="ii">{{ item }}</li>
						</ul>
					</div>
					<div class="comp-standard__col comp-standard__col--excluded">
						<div class="comp-standard__col-head">
							<span class="comp-standard__col-icon comp-standard__col-icon--cross">✗</span>
							<h3>{{ tr('tour.companion.standard.excluded', '服务不包含') }}</h3>
						</div>
						<ul class="comp-standard__list comp-standard__list--muted">
							<li v-for="(item, ei) in excludedList" :key="ei">{{ item }}</li>
						</ul>
					</div>
					<div class="comp-standard__col comp-standard__col--upgrade">
						<div class="comp-standard__col-head">
							<span class="comp-standard__col-icon comp-standard__col-icon--refresh">🔄</span>
							<h3>{{ tr('tour.companion.standard.upgrade', '可选升级') }}</h3>
						</div>
						<ul class="comp-standard__list">
							<li v-for="(item, ui) in upgradeList" :key="ui">{{ item }}</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑦ 专属服务团队 -->
		<section class="comp-staff">
			<div class="comp-staff__inner">
				<h2 class="comp-staff__heading">
					{{ tr('tour.companion.staff.heading', '专属服务团队') }}
				</h2>
				<p class="comp-staff__subheading">
					{{ tr('tour.companion.staff.subheading', '— 经过严格筛选的专业陪伴师') }}
				</p>
				<div class="comp-staff__grid">
					<article v-for="staff in staffList" :key="staff.id" class="comp-staff__card">
						<div class="comp-staff__photo">
							<Icon name="icon:user" class="comp-staff__photo-icon" />
							<span class="comp-staff__rating-badge">★ {{ staff.rating }}</span>
						</div>
						<div class="comp-staff__body">
							<h3 class="comp-staff__name">{{ staff.name }}</h3>
							<div class="comp-staff__role">{{ staff.role }}</div>
							<div class="comp-staff__stats">
								<span class="comp-staff__stars">★★★★★</span>
								<span class="comp-staff__rating-num">{{ staff.rating }}</span>
								<span class="comp-staff__orders">({{ staff.orders }}{{ tr('travel.companion.orders', '单') }})</span>
							</div>
							<div class="comp-staff__skills">
								<span v-for="(s, si) in staff.skills" :key="si" class="comp-staff__skill">{{ s }}</span>
							</div>
							<p class="comp-staff__bio">{{ staff.bio }}</p>
							<div v-if="staff.reviews && staff.reviews.length" class="comp-staff__review">
								<p class="comp-staff__review-text">"{{ staff.reviews[0].text }}"</p>
								<p class="comp-staff__review-author">— {{ staff.reviews[0].author }}</p>
							</div>
							<div class="comp-staff__actions">
								<NuxtLink :to="$path(`/staff/${staff.id}`)" class="comp-staff__detail">
									{{ tr('tour.companion.staff.viewDetail', '查看详情') }}
								</NuxtLink>
								<button class="comp-staff__book" @click="scrollToForm">
									{{ tr('tour.companion.staff.book', '预约') }}
								</button>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<!-- ⑧ 安全保障 -->
		<section class="comp-security">
			<div class="comp-security__inner">
				<h2 class="comp-security__heading">
					{{ tr('tour.companion.security.title', '安全保障') }}
				</h2>
				<div class="comp-security__grid">
					<div v-for="(item, i) in securityList" :key="i" class="comp-security__item">
						<div class="comp-security__icon">
							<Icon :name="item.icon" />
						</div>
						<h3 class="comp-security__item-title">{{ item.title }}</h3>
						<p class="comp-security__item-desc">{{ item.desc }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑨ 预约表单 -->
		<section class="comp-form-section">
			<div class="comp-form-section__inner">
				<div v-if="submitted" class="comp-success">
					<div class="comp-success__icon">✓</div>
					<h2 class="comp-success__title">{{ $t('travel.companion.successTitle') }}</h2>
					<p class="comp-success__desc">
						{{ $t('travel.companion.successDesc1') }}<br>
						{{ $t('travel.companion.successDesc2') }}
					</p>
					<NuxtLink :to="$path('/user/my-travel?tab=escort')" class="comp-form__submit" style="text-decoration:none;display:inline-flex;">
						{{ $t('travel.companion.viewMyBooking') }}
					</NuxtLink>
				</div>
				<el-form v-else ref="formRef" :model="form" :rules="rules" class="comp-form" label-position="top">
					<h2 class="comp-form__heading">
						{{ tr('tour.companion.form.title', '预约陪侍服务') }}
					</h2>
					<div class="comp-form__row">
						<el-form-item :label="`${$t('travel.companion.destination')} *`" prop="destination">
							<el-input v-model="form.destination" :placeholder="$t('travel.companion.destinationPlaceholder')" />
						</el-form-item>
						<el-form-item :label="$t('travel.companion.travelerCount')">
							<el-input-number v-model="form.travelerCount" :min="1" :max="50" />
						</el-form-item>
					</div>
					<div class="comp-form__row">
						<el-form-item :label="`${$t('travel.companion.startDate')} *`" prop="startDate">
							<el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" :placeholder="$t('travel.companion.startDatePlaceholder')" style="width:100%" />
						</el-form-item>
						<el-form-item :label="`${$t('travel.companion.endDate')} *`" prop="endDate">
							<el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" :placeholder="$t('travel.companion.endDatePlaceholder')" style="width:100%" />
						</el-form-item>
					</div>
					<el-form-item :label="$t('travel.companion.language')">
						<div class="comp-form__tags">
							<button
								v-for="(lang, li) in langOptList" :key="li" type="button"
								class="comp-form__tag" :class="{ 'comp-form__tag--active': form.languageNeeds.includes(lang) }"
								@click="form.languageNeeds.includes(lang) ? form.languageNeeds.splice(form.languageNeeds.indexOf(lang), 1) : form.languageNeeds.push(lang)"
							>
								{{ lang }}
							</button>
						</div>
					</el-form-item>
					<el-form-item :label="$t('travel.companion.serviceType')">
						<div class="comp-form__tags">
							<button
								v-for="(svc, si) in svcTypeOptList" :key="si" type="button"
								class="comp-form__tag" :class="{ 'comp-form__tag--active': form.serviceTypes.includes(svc) }"
								@click="form.serviceTypes.includes(svc) ? form.serviceTypes.splice(form.serviceTypes.indexOf(svc), 1) : form.serviceTypes.push(svc)"
							>
								{{ svc }}
							</button>
						</div>
					</el-form-item>
					<el-form-item :label="$t('travel.companion.ownItinerary')">
						<el-checkbox v-model="form.isOwnItinerary">
							{{ $t('travel.companion.ownItineraryDesc') }}
						</el-checkbox>
					</el-form-item>
					<el-form-item v-if="form.isOwnItinerary" :label="$t('travel.companion.itineraryDesc')">
						<el-input v-model="form.ownItineraryDesc" type="textarea" :rows="2" :placeholder="$t('travel.companion.itineraryDescPlaceholder')" />
					</el-form-item>
					<el-form-item :label="$t('travel.companion.specialReq')">
						<el-input
							v-model="form.specialRequirements" type="textarea" :rows="3"
							:placeholder="$t('travel.companion.specialReqPlaceholder')"
						/>
					</el-form-item>
					<button
						type="button" class="comp-form__submit"
						:disabled="submitting" @click="submit"
					>
						{{ submitting ? $t('travel.companion.submitting') : tr('tour.companion.form.cta', '立即预约咨询') }}
					</button>
				</el-form>
			</div>
		</section>

		<!-- ⑩ FAQ -->
		<section class="comp-faq">
			<div class="comp-faq__inner">
				<h2 class="comp-faq__heading">
					{{ $t('travel.companion.faqTitle') }}
				</h2>
				<div class="comp-faq__list">
					<div v-for="(faq, i) in faqList" :key="i" class="comp-faq__item">
						<button class="comp-faq__question" @click="toggleFaq(i)">
							<span>{{ faq.q }}</span>
							<span class="comp-faq__arrow" :class="{ 'comp-faq__arrow--up': openFaq === i }">›</span>
						</button>
						<Transition name="faq-slide">
							<div v-if="openFaq === i" class="comp-faq__answer">
								<p>{{ faq.a }}</p>
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</section>

		<!-- ⑪ 底部 CTA -->
		<section class="comp-bottom-cta">
			<div class="comp-bottom-cta__inner">
				<h2 class="comp-bottom-cta__title">
					{{ tr('tour.companion.bottom.title', '让每段旅程都充满温度') }}
				</h2>
				<p class="comp-bottom-cta__desc">
					{{ tr('tour.companion.bottom.desc', '提交需求，专属顾问 2 小时内为您匹配最合适的陪伴师') }}
				</p>
				<button class="comp-bottom-cta__btn" @click="scrollToForm">
					{{ tr('tour.companion.form.cta', '立即预约咨询') }}
				</button>
				<p class="comp-bottom-cta__wechat">
					{{ tr('tour.companion.bottom.wechat', '或添加微信 iswink_travel 1对1咨询') }}
				</p>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import url('./companion.scss');
</style>
