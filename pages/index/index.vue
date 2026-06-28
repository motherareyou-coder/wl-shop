<script setup lang="ts">
import AppTourAdvantage from './components/tour/AppTourAdvantage.vue'
import AppTourBanner from './components/tour/AppTourBanner.vue'
import AppTourCompanion from './components/tour/AppTourCompanion.vue'
import AppTourCustom from './components/tour/AppTourCustom.vue'
import AppTourFaq from './components/tour/AppTourFaq.vue'
import AppTourFloatCta from './components/tour/AppTourFloatCta.vue'
import AppTourGuide from './components/tour/AppTourGuide.vue'
import AppTourPackages from './components/tour/AppTourPackages.vue'
import AppTourProcess from './components/tour/AppTourProcess.vue'
import AppTourShopEntry from './components/tour/AppTourShopEntry.vue'
import AppTourTrust from './components/tour/AppTourTrust.vue'

defineOptions({ name: 'TourHome' })

const { domain } = useRuntimeConfig().public

// SEO：首页核心关键词围绕「中国私人定制旅行」
useSEO({
	routeKey: 'home',
	breadcrumbs: [{ name: 'Home', url: domain }],
})
</script>

<template>
	<div class="tour-home">
		<!-- 唯一 h1：视觉隐藏，SEO 可读，含核心关键词 -->
		<h1 class="sr-only">
			{{ $t('China Private Custom Travel & Companion Service') }} | iswink
		</h1>

		<!-- ① Banner 轮播（双业务：行程定制 + 情感陪伴） -->
		<AppTourBanner />

		<!-- ② 核心优势（3列·建立信任） -->
		<AppTourAdvantage />

		<!-- ③ 需求定制（左文案+右深黑渐变表单）+ 客户案例（4列网格）
		     保留 site-grid 背景风格，位于原自定义行程块位置 -->
		<AppTourCustom />

		<!-- ④ 业务B：情感陪伴服务 -->
		<AppTourCompanion />

		<!-- ⑤ 特色玩法套餐（3-4卡片） -->
		<AppTourPackages />

		<!-- ⑥ 定制流程（HowTo schema） -->
		<AppTourProcess />

		<!-- ⑦ 信任背书（资质4列） -->
		<AppTourTrust />

		<!-- ⑧ 目的地指南（对接文章体系，SEO长尾） -->
		<AppTourGuide />

		<!-- ⑨ FAQ（FAQPage schema·AI引用率高） -->
		<AppTourFaq />

		<!-- ⑩ 礼物商城入口（附属业务，次要） -->
		<AppTourShopEntry />

		<!-- ⑫ 悬浮"立即定制"按钮（全程常驻） -->
		<AppTourFloatCta />
	</div>
</template>

<style lang="scss">
/* 引入首页专用栅格规则（--full / --special-half-quarter 等），
   原 index.vue 通过 @import url('./index.scss') 引入，改版时误删导致布局失效 */
@import url('./index.scss');
</style>

<style lang="scss" scoped>
.tour-home {
	width: 100%;
	/* Banner 用 100vw 全宽突破父容器，100vw 含垂直滚动条宽度会多出十几像素，
	   这里 overflow-x:hidden 兜底截断，消除底部水平滚动条 */
	overflow-x: hidden;
}
</style>
