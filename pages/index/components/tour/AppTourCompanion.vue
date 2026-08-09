<script setup lang="ts">
defineOptions({ name: 'AppTourCompanion' })

// 情感陪伴服务系列（静态）—— 右侧类型卡
const services = [
	{
		icon: 'icon:like',
		titleKey: 'tour.companion.service.romance',
		titleFallback: '浪漫时刻',
		descKey: 'tour.companion.service.romanceDesc',
		descFallback: '纪念日、求婚、蜜月的专属陪伴策划',
	},
	{
		icon: 'icon:user',
		titleKey: 'tour.companion.service.business',
		titleFallback: '商务陪同',
		descKey: 'tour.companion.service.businessDesc',
		descFallback: '高端商务活动的专业陪同服务',
	},
	{
		icon: 'icon:menu',
		titleKey: 'tour.companion.service.culture',
		titleFallback: '文化导览',
		descKey: 'tour.companion.service.cultureDesc',
		descFallback: '深度本地文化体验的私人向导',
	},
	{
		icon: 'icon:shop',
		titleKey: 'tour.companion.service.special',
		titleFallback: '特色体验',
		descKey: 'tour.companion.service.specialDesc',
		descFallback: '为特殊时刻定制的个性化服务',
	},
]

// 左侧聊天轮播：4 个场景对话（用户咨询 → 平台匹配）
// 模拟真实聊天过程：消息逐条动态出现，平台回复前有"正在输入"等待
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

// 服务人员展示（静态，4 位）—— 侧重人物形象、技能、评分、简介
const staff = [
	{
		name: '王晓雯',
		role: '高级旅行陪伴师 · 8年经验',
		skills: ['商务陪同', '多语种'],
		rating: 4.9,
		orders: 126,
		bio: '精通英语日语，擅长高端商务接待与文化深度游，服务过百余位国际客户。',
	},
	{
		name: '陈思远',
		role: '资深文化向导 · 6年经验',
		skills: ['文化导览', '非遗体验'],
		rating: 4.8,
		orders: 98,
		bio: '历史系硕士出身，对中国传统文化有深入研究，擅长设计沉浸式文化体验路线。',
	},
	{
		name: '林雅婷',
		role: '特色体验策划师 · 5年经验',
		skills: ['惊喜策划', '主题定制'],
		rating: 5.0,
		orders: 87,
		bio: '曾策划百余场生日惊喜与纪念日庆祝，注重细节与情感表达，深受家庭客户好评。',
	},
	{
		name: '张明辉',
		role: '专业商务陪同 · 7年经验',
		skills: ['商务礼仪', '英语韩语'],
		rating: 4.9,
		orders: 112,
		bio: '熟悉跨国商务礼仪，精通英语韩语，多次服务于世界500强企业高管接待。',
	},
]

// 灵活订购：3 种业务套餐，每个含 4 步服务流程（点击左侧选项，右侧联动切换）
const packages = [
	{
		titleKey: 'tour.companion.packages.trip',
		titleFallback: '仅定制私人行程',
		descKey: 'tour.companion.packages.tripDesc',
		descFallback: '不含陪侍，专注行程规划与本地资源对接',
		steps: [
			{ title: '提交行程需求', desc: '在线填写目的地、人数、预算、出行偏好' },
			{ title: '匹配本地旅行社', desc: '24h 内匹配最佳本地合作伙伴，报价透明' },
			{ title: '确认行程方案', desc: '规划师细化路线与安排，调整至您满意' },
			{ title: '落地出行', desc: '提供电子路书全程指引，您可自主灵活出行' },
		],
	},
	{
		titleKey: 'tour.companion.packages.assistant',
		titleFallback: '仅需私人情感助理',
		descKey: 'tour.companion.packages.assistantDesc',
		descFallback: '不含行程，专注专属陪侍与情感陪伴服务',
		steps: [
			{ title: '提交陪侍需求', desc: '说明使用场景、时间安排、特殊要求与偏好' },
			{ title: '匹配专属助理', desc: '根据需求匹配最合适的陪侍师，严格筛选' },
			{ title: '确认服务方案', desc: '沟通服务细节，确认内容与礼仪规范' },
			{ title: '上门服务', desc: '专属陪侍师按约定时间准时提供专业服务' },
		],
	},
	{
		titleKey: 'tour.companion.packages.full',
		titleFallback: '全套尊享服务',
		descKey: 'tour.companion.packages.fullDesc',
		descFallback: '行程定制 + 陪侍服务一站式，全程无忧',
		steps: [
			{ title: '提交综合需求', desc: '行程偏好与陪侍需求一次提交，无需分步' },
			{ title: '匹配专业团队', desc: '本地旅行社与陪侍师双重匹配，协同安排' },
			{ title: '确认全程方案', desc: '行程与陪侍无缝衔接，每个细节确认到位' },
			{ title: '全程管家服务', desc: '出发到返回，7×24 中文管家全程跟进' },
		],
	},
]

// 灵活订购：当前激活的业务索引（默认第一个）
const activePackage = ref(0)

function switchPackage(i: number) {
	activePackage.value = i
}

// 动态聊天回放引擎：逐条显示消息，模拟真实聊天节奏
const activeIndex = ref(0) // 当前场景
const visibleCount = ref(0) // 当前已显示几条消息
const isTyping = ref(false) // 平台是否"正在输入"

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
			// 用户消息快一点，平台回复慢一点（模拟真实节奏）
			const delay = nextMsg.from === 'user' ? 1200 : 1600
			setTimeout(playConversation, delay)
		}, 1400)
	}
	else {
		// 用户消息直接出现
		visibleCount.value++
		const delay = nextMsg.from === 'user' ? 1000 : 1600
		setTimeout(playConversation, delay)
	}
}

onMounted(() => {
	playConversation()
})

onBeforeUnmount(() => {
	// 清理所有定时器（setTimeout 无法直接 clear，组件卸载后回调不应再触发）
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

function goToForm() {
	// 未登录先跳登录页，登录后跳回陪侍服务页
	if (!userStore.accessToken) {
		router.push($path(`/login?redirect=${encodeURIComponent(route.fullPath)}`))
		return
	}
	router.push($path('/companion'))
}

// 点击场景标签时重置回放
function switchScenario(i: number) {
	activeIndex.value = i
	visibleCount.value = 0
	isTyping.value = false
	playConversation()
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-companion site-grid site-grid--vertical-100 site-grid--full">
		<div class="tour-companion__module site-container">
			<div class="tour-companion__custom">
				<!-- ===== 左侧：聊天咨询轮播 ===== -->
				<div class="tour-companion__chat">
					<!-- 聊天窗口标题栏 -->
					<div class="tour-companion__chat-head">
						<div class="tour-companion__chat-agent">
							<div class="tour-companion__chat-avatar">
								<Icon name="icon:user" />
							</div>
							<div>
								<div class="tour-companion__chat-name">
									iswink 专属顾问
								</div>
								<div class="tour-companion__chat-status">
									<span class="tour-companion__chat-dot" /> 在线 · 24h 响应
								</div>
							</div>
						</div>
					</div>
					<!-- 对话气泡区（逐条动态出现，模拟真实聊天） -->
					<div class="tour-companion__chat-body" :key="activeIndex">
						<TransitionGroup name="bubble">
							<div
								v-for="i in visibleCount"
								:key="`${activeIndex}-${i}`"
								class="tour-companion__msg"
								:class="conversations[activeIndex].messages[i - 1].from === 'user' ? 'tour-companion__msg--user' : 'tour-companion__msg--agent'"
							>
								<div class="tour-companion__msg-avatar" :class="conversations[activeIndex].messages[i - 1].from === 'user' ? 'tour-companion__msg-avatar--user' : 'tour-companion__msg-avatar--agent'">
									{{ conversations[activeIndex].messages[i - 1].from === 'user' ? '我' : 'i' }}
								</div>
								<div class="tour-companion__bubble" :class="conversations[activeIndex].messages[i - 1].from === 'user' ? 'tour-companion__bubble--user' : 'tour-companion__bubble--agent'">
									{{ conversations[activeIndex].messages[i - 1].text }}
								</div>
							</div>
						</TransitionGroup>
						<!-- 平台"正在输入"指示器 -->
						<div v-if="isTyping" class="tour-companion__msg tour-companion__msg--agent">
							<div class="tour-companion__msg-avatar tour-companion__msg-avatar--agent">
								i
							</div>
							<div class="tour-companion__typing">
								<span class="tour-companion__typing-dot" />
								<span class="tour-companion__typing-dot" />
								<span class="tour-companion__typing-dot" />
							</div>
						</div>
					</div>
					<!-- 场景指示器 -->
					<div class="tour-companion__chat-dots">
						<button
							v-for="(conv, i) in conversations"
							:key="i"
							class="tour-companion__chat-dot-btn"
							:class="{ 'tour-companion__chat-dot-btn--active': i === activeIndex }"
							@click="switchScenario(i)"
						>
							{{ conv.scenario }}
						</button>
					</div>
				</div>

				<!-- ===== 右侧：文案 + 服务卡 + CTA ===== -->
				<div class="tour-companion__intro">
					<h2 class="tour-companion__title">
						{{ tr('tour.companion.heading', '情感陪伴服务') }}
					</h2>
					<p class="tour-companion__desc">
						{{ tr('tour.companion.subheading', '专业陪侍团队，让您的旅程更有温度') }}
					</p>
					<ul class="tour-companion__points">
						<li>{{ tr('tour.companion.intro.point1', '严格筛选的专业服务团队') }}</li>
						<li>{{ tr('tour.companion.intro.point2', '注重隐私与品质的尊享体验') }}</li>
						<li>{{ tr('tour.companion.intro.point3', '灵活定制的个性化服务方案') }}</li>
					</ul>
					<!-- 4 服务类型卡 -->
					<div class="tour-companion__types">
						<article
							v-for="item in services"
							:key="item.titleFallback"
							class="tour-companion__type-card"
							@click="goToForm"
						>
							<Icon :name="item.icon" class="tour-companion__type-icon" />
							<div class="tour-companion__type-text">
								<h4 class="tour-companion__type-title">
									{{ tr(item.titleKey, item.titleFallback) }}
								</h4>
								<p class="tour-companion__type-desc">
									{{ tr(item.descKey, item.descFallback) }}
								</p>
							</div>
						</article>
					</div>
					<!-- 预约 CTA -->
					<button
						class="tour-companion__cta mi-button mi-btn mi-btn--primary"
						@click="goToForm"
					>
						{{ tr('tour.companion.form.cta', '立即预约咨询') }}
					</button>
				</div>
				</div>

				<!-- ===== 下：服务人员展示（4 列网格，紧贴白卡，证明专业性）===== -->
				<div class="tour-companion__staff">
					<h3 class="tour-companion__staff-title">
						专属<em>服务团队</em>
						<span class="tour-companion__staff-subtitle">— 经过严格筛选的专业陪伴师</span>
						<NuxtLink :to="$path('/staff')" class="tour-companion__staff-more">
							{{ tr('tour.guide.viewAll', '查看全部') }} →
						</NuxtLink>
					</h3>
					<div class="tour-companion__staff-grid">
						<NuxtLink
							v-for="item in staff"
							:key="item.id"
							:to="$path(`/staff/${item.id}`)"
							class="tour-companion__staff-card"
						>
							<!-- 图片占位区域（后续接入真实照片） -->
							<div class="tour-companion__staff-photo">
								<Icon name="icon:user" class="tour-companion__staff-photo-icon" />
								<span class="tour-companion__staff-rating-badge">
									★ {{ item.rating }}
								</span>
							</div>
							<div class="tour-companion__staff-body">
								<h4 class="tour-companion__staff-name">
									{{ item.name }}
								</h4>
								<div class="tour-companion__staff-role">
									{{ item.role }}
								</div>
								<div class="tour-companion__staff-stats">
									<span class="tour-companion__staff-stars">★★★★★</span>
									<span class="tour-companion__staff-rating-num">{{ item.rating }}</span>
									<span class="tour-companion__staff-orders">({{ item.orders }}单)</span>
								</div>
								<div class="tour-companion__staff-skills">
									<span
										v-for="skill in item.skills"
										:key="skill"
										class="tour-companion__staff-skill"
									>
										{{ skill }}
									</span>
								</div>
								<p class="tour-companion__staff-bio">
									{{ item.bio }}
								</p>
							</div>
						</NuxtLink>
						</div>
					</div>
				</div>
		</section>

		<!-- ===== 灵活订购（独立 section，左业务选项 + 右联动流程步骤）===== -->
		<section class="tour-companion tour-companion__packages site-grid site-grid--vertical-100 site-grid--full">
			<div class="tour-companion__packages-inner site-container">
				<div class="tour-companion__packages-head">
					<h3 class="tour-companion__packages-title">
						{{ tr('tour.companion.packages.heading', '灵活订购') }}<em> · {{ tr('tour.companion.packages.subheading', '按需选择') }}</em>
					</h3>
					<p class="tour-companion__packages-desc">
						{{ tr('tour.companion.packages.desc', '根据您的实际需求自由组合服务模块，拒绝捆绑销售，所有开支透明清晰。') }}
					</p>
				</div>
					<div class="tour-companion__packages-body">
						<!-- 左侧：3 个业务选项卡 -->
						<div class="tour-companion__pkg-options">
							<div
								v-for="(pkg, i) in packages"
								:key="i"
								class="tour-companion__pkg-option"
								:class="{ 'tour-companion__pkg-option--active': i === activePackage }"
								@click="switchPackage(i)"
							>
								<div class="tour-companion__pkg-name">
									{{ tr(pkg.titleKey, pkg.titleFallback) }}
								</div>
								<div class="tour-companion__pkg-desc">
									{{ tr(pkg.descKey, pkg.descFallback) }}
								</div>
							</div>
						</div>
						<!-- 右侧：服务流程步骤（联动切换）+ 立即定制按钮 -->
						<div class="tour-companion__pkg-steps">
							<Transition name="pkg-fade" mode="out-in">
								<ol :key="activePackage" class="tour-companion__step-list">
									<li
										v-for="(step, si) in packages[activePackage].steps"
										:key="si"
										class="tour-companion__step"
									>
										<div class="tour-companion__step-num">
											{{ String(si + 1).padStart(2, '0') }}
										</div>
										<div class="tour-companion__step-content">
											<h4 class="tour-companion__step-title">
												{{ step.title }}
											</h4>
											<p class="tour-companion__step-desc">
												{{ step.desc }}
											</p>
										</div>
									</li>
								</ol>
							</Transition>
							<button class="tour-companion__pkg-cta" @click="goToForm">
								{{ tr('tour.companion.packages.cta', '立即定制') }} →
							</button>
						</div>
				</div>
			</div>
		</section>
</template>

<style lang="scss">
@import url('./AppTourCompanion.scss');
</style>
