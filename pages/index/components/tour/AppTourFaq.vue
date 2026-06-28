<script setup lang="ts">
defineOptions({ name: 'AppTourFaq' })

// FAQ（FAQPage schema・AI 引擎引用率最高，见 SEO 规范 §3.1 / §4.2）
const faqs = [
	{
		qKey: 'tour.faq.q1',
		qFallback: '私人定制旅行怎么收费？',
		aKey: 'tour.faq.a1',
		aFallback: 'iswink 提供免费的行程规划咨询服务，仅在您确认行程后收取实际的服务费用。由于直连本地旅行社，我们的价格通常比市面低 20-30%，且全程透明无隐藏费用。',
	},
	{
		qKey: 'tour.faq.q2',
		qFallback: '定制行程一般需要多久？',
		aKey: 'tour.faq.a2',
		aFallback: '提交需求后，规划师会在 24 小时内联系您。一般 2-3 天内即可完成初版方案，根据您的反馈调整至满意为止，通常 3-7 天可敲定最终行程。',
	},
	{
		qKey: 'tour.faq.q3',
		qFallback: '情感陪伴服务包含什么？',
		aKey: 'tour.faq.a3',
		aFallback: '情感陪伴服务提供专业的陪侍团队，涵盖浪漫时刻策划、商务活动陪同、文化导览、特色体验等。所有服务人员经过严格筛选培训，注重隐私与品质。',
	},
	{
		qKey: 'tour.faq.q4',
		qFallback: '如何保证旅行安全？',
		aKey: 'tour.faq.a4',
		aFallback: '我们提供多重安全保障：资金第三方托管、7×24 小时中文管家支持、持牌正规资质、灵活退改政策。出行期间任何问题都可即时联系管家处理。',
	},
	{
		qKey: 'tour.faq.q5',
		qFallback: '支持哪些目的地？',
		aKey: 'tour.faq.a5',
		aFallback: '目前覆盖中国 200+ 城市，重点目的地包括北京、云南、西藏、丝绸之路沿线、江浙沪、川渝等。我们持续拓展新的本地合作资源，欢迎咨询特定目的地。',
	},
]

const qa = (k: string, fb: string) => ($t(k) !== k ? $t(k) : fb)

// FAQPage 结构化数据
const faqJson = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: faqs.map(f => ({
		'@type': 'Question',
		name: qa(f.qKey, f.qFallback),
		acceptedAnswer: {
			'@type': 'Answer',
			text: qa(f.aKey, f.aFallback),
		},
	})),
}

useHead({
	script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(faqJson) }],
})

const openIndex = ref<number | null>(0)
function toggle(i: number) {
	openIndex.value = openIndex.value === i ? null : i
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}

// 平滑展开/收起：用 scrollHeight 动态设高度，避免固定 max-height 裁剪长答案
function onEnter(el: Element) {
	const target = el as HTMLElement
	target.style.height = '0'
	target.style.opacity = '0'
	// 强制回流后设为目标高度
	target.offsetHeight
	target.style.height = `${target.scrollHeight}px`
	target.style.opacity = '1'
}
function onAfterEnter(el: Element) {
	;(el as HTMLElement).style.height = ''
}
function onLeave(el: Element) {
	const target = el as HTMLElement
	target.style.height = `${target.scrollHeight}px`
	target.offsetHeight
	target.style.height = '0'
	target.style.opacity = '0'
}
</script>

<template>
	<section class="tour-faq site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-faq__header">
			<h2 class="tour-faq__title">
				{{ tr('tour.faq.heading', '常见问题') }}
			</h2>
			<p class="tour-faq__subtitle">
				{{ tr('tour.faq.subheading', '关于私人定制旅行的常见疑问解答') }}
			</p>
		</header>

		<div class="tour-faq__list site-container">
			<div
				v-for="(item, i) in faqs"
				:key="i"
				class="tour-faq__item"
				:class="{ 'tour-faq__item--open': openIndex === i }"
			>
				<button
					class="tour-faq__question"
					:aria-expanded="openIndex === i"
					@click="toggle(i)"
				>
					<span>{{ tr(item.qKey, item.qFallback) }}</span>
					<Icon
						name="icon:up"
						class="tour-faq__arrow"
						:class="{ 'tour-faq__arrow--down': openIndex !== i }"
					/>
				</button>
				<Transition
					name="faq-slide"
					@enter="onEnter"
					@after-enter="onAfterEnter"
					@leave="onLeave"
				>
					<div v-if="openIndex === i" class="tour-faq__answer">
						<p>{{ tr(item.aKey, item.aFallback) }}</p>
					</div>
				</Transition>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourFaq.scss');
</style>
