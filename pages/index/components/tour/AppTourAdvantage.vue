<script setup lang="ts">
defineOptions({ name: 'AppTourAdvantage' })

// 静态配置：核心优势用事实陈述句（AI 引擎爱引用，见 SEO 规范 §4.2）
const advantages = [
	{
		icon: 'icon:shop',
		titleKey: 'tour.advantage.local.title',
		titleFallback: '500+ 本地旅行社',
		descKey: 'tour.advantage.local.desc',
		descFallback: '直连中国 200+ 城市的优质本地旅行社，剔除中间环节，价格更透明',
	},
	{
		icon: 'icon:user',
		titleKey: 'tour.advantage.expert.title',
		titleFallback: '资深定制师',
		descKey: 'tour.advantage.expert.desc',
		descFallback: '平均 8 年从业经验的行程规划师，1 对 1 为您量身设计专属路线',
	},
	{
		icon: 'icon:like',
		titleKey: 'tour.advantage.service.title',
		titleFallback: '全程管家服务',
		descKey: 'tour.advantage.service.desc',
		descFallback: '从行前规划到落地接待，24 小时中文管家全程跟进，无忧出行',
	},
]

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<section class="tour-advantage site-grid site-grid--vertical-100 site-grid--full">
		<header class="tour-advantage__header">
			<h2 class="tour-advantage__title">
				{{ tr('tour.advantage.heading', '为什么选择 iswink') }}
			</h2>
			<p class="tour-advantage__subtitle">
				{{ tr('tour.advantage.subheading', '10 年专注中国私人定制旅行，让每一次出行都成为难忘体验') }}
			</p>
		</header>
		<div class="tour-advantage__grid site-container">
			<article
				v-for="item in advantages"
				:key="item.titleFallback"
				class="tour-advantage__card"
			>
				<Icon :name="item.icon" class="tour-advantage__icon" />
				<h3 class="tour-advantage__card-title">
					{{ tr(item.titleKey, item.titleFallback) }}
				</h3>
				<p class="tour-advantage__card-desc">
					{{ tr(item.descKey, item.descFallback) }}
				</p>
			</article>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.tour-advantage {
	text-align: center;

	&__header {
		margin-bottom: var(--title-content-gap);
	}

	&__title {
		font-size: var(--large-font-size);
		font-weight: 700;
		margin: 0 0 var(--small-gap);
		color: var(--text-base);
	}

	&__subtitle {
		font-size: var(--default-font-size);
		color: var(--text-secondary);
		margin: 0;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--large-gap);
	}

	&__card {
		padding: var(--large-gap);
		background: var(--background-white);
		border-radius: 16px;
		text-align: left;
		transition: all 0.3s;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 32px var(--shadow-black-a10);
		}
	}

	&__icon {
		width: 48px;
		height: 48px;
		color: var(--brand-orange);
		margin-bottom: var(--mid-gap);
	}

	&__card-title {
		font-size: var(--mid-font-size);
		font-weight: 600;
		margin: 0 0 var(--small-gap);
		color: var(--text-base);
	}

	&__card-desc {
		font-size: var(--default-font-size);
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0;
	}
}

@media screen and (max-width: 1024px) {
	.tour-advantage {
		&__grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--mid-gap);
		}

		&__card {
			padding: var(--mid-gap);
		}
	}
}

@media screen and (max-width: 720px) {
	.tour-advantage {
		&__grid {
			grid-template-columns: 1fr;
			gap: var(--mid-gap);
		}

		&__card {
			text-align: center;
		}

		&__icon {
			margin-left: auto;
			margin-right: auto;
		}
	}
}
</style>
