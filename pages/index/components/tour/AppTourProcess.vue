<script setup lang="ts">
defineOptions({ name: 'AppTourProcess' })

// 定制流程步骤（静态）―― 喂给 HowTo schema，AI 引擎引用率高
const steps = [
	{
		no: '01',
		titleKey: 'tour.process.step1.title',
		titleFallback: '提交需求',
		descKey: 'tour.process.step1.desc',
		descFallback: '在线填写旅行偏好、人数、预算等需求信息',
	},
	{
		no: '02',
		titleKey: 'tour.process.step2.title',
		titleFallback: '匹配方案',
		descKey: 'tour.process.step2.desc',
		descFallback: '资深规划师 24 小时内联系您，定制专属方案',
	},
	{
		no: '03',
		titleKey: 'tour.process.step3.title',
		titleFallback: '确认行程',
		descKey: 'tour.process.step3.desc',
		descFallback: '沟通调整至满意，确认行程细节并预订',
	},
	{
		no: '04',
		titleKey: 'tour.process.step4.title',
		titleFallback: '落地服务',
		descKey: 'tour.process.step4.desc',
		descFallback: '出行后 24 小时管家全程跟进，无忧出行',
	},
]

// HowTo 结构化数据（SEO 规范 §3.1 / §4.2，AI 引擎高引用率）
const stepName = (k: string, fb: string) => ($t(k) !== k ? $t(k) : fb)
const howToJson = {
	'@context': 'https://schema.org',
	'@type': 'HowTo',
	name: stepName('tour.process.schemaName', '如何定制 iswink 私人中国旅行'),
	step: steps.map(s => ({
		'@type': 'HowToStep',
		position: Number(s.no),
		name: stepName(s.titleKey, s.titleFallback),
		text: stepName(s.descKey, s.descFallback),
	})),
}

useHead({
	script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(howToJson) }],
})

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-process site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-process__header">
			<h2 class="tour-process__title">
				{{ tr('tour.process.heading', '四步轻松定制') }}
			</h2>
			<p class="tour-process__subtitle">
				{{ tr('tour.process.subheading', '从需求提交到落地服务，全程无忧') }}
			</p>
		</header>

		<div class="tour-process__grid site-container">
			<article
				v-for="item in steps"
				:key="item.no"
				class="tour-process__step"
			>
				<span class="tour-process__no">{{ item.no }}</span>
				<h3 class="tour-process__step-title">
					{{ tr(item.titleKey, item.titleFallback) }}
				</h3>
				<p class="tour-process__step-desc">
					{{ tr(item.descKey, item.descFallback) }}
				</p>
			</article>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourProcess.scss');
</style>
