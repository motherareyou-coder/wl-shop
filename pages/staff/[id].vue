<script setup lang="ts">
import { getStaffById, type TourStaff } from '~/config/tour-staff'

defineOptions({ name: 'StaffDetail' })
definePageMeta({ title: 'Service Team' })

const route = useRoute()
const { domain } = useRuntimeConfig().public
const id = Number(route.params.id)

// 数据加载：当前用本地静态数据，后续替换为 API
// const { data: detail } = await useAPI<TourStaff>('travel/staff/get', { params: { id } })
const detail = ref<TourStaff | undefined>(getStaffById(id))

if (!detail.value) {
	throw createError({ statusCode: 404, statusMessage: 'Staff not found', fatal: true })
}

// 动态面包屑：首页 > 服务团队 > [成员名]
route.meta.breadcrumb = [
	{ label: $t('tour.staffList.heroTitle') !== 'tour.staffList.heroTitle' ? $t('tour.staffList.heroTitle') : '服务团队', to: '/staff' },
	{ label: detail.value.name },
]

useSEO({
	routeKey: 'articleDetail',
	title: detail.value.name,
	description: detail.value.bio,
	keywords: detail.value.skills,
	type: 'article',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Service Team', url: `${domain}${route.path}` },
	],
})

const { gtag } = useGtag()
onMounted(() => {
	gtag('event', 'screen_view', { screen_name: 'staff-detail' })
})

// 服务特色（综合 skills + specialties 去重）
const serviceFeatures = computed(() => {
	const all = [...(detail.value?.specialties || []), ...(detail.value?.skills || [])]
	return Array.from(new Set(all))
})

// 服务项目分组
const serviceItems = computed(() => {
	if (!detail.value) return []
	return [
		{
			icon: '🎯',
			label: '擅长场景',
			items: detail.value.specialties,
		},
		{
			icon: '🗣️',
			label: '语言能力',
			items: detail.value.languages,
		},
		{
			icon: '✨',
			label: '服务特色',
			items: serviceFeatures.value,
		},
	]
})

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<div v-if="detail" class="site-container-1400 mx-auto staff-detail">
		<!-- 1. 返回链接 -->
		<NuxtLink class="staff-detail__back" :to="$path('/staff')">
			<i class="micon micon-link-arrow" /> {{ tr('tour.staffDetail.backToList', '返回服务团队') }}
		</NuxtLink>

		<!-- 2. 头部（白色大卡片） -->
		<header class="staff-detail__header">
			<div class="staff-detail__photo">
				<Icon name="icon:user" class="staff-detail__photo-icon" />
				<span class="staff-detail__rating-badge">★ {{ detail.rating }}</span>
			</div>
			<div class="staff-detail__info">
				<h1 class="staff-detail__name">
					{{ detail.name }}
				</h1>
				<p class="staff-detail__role">
					{{ detail.role }}
				</p>
				<div class="staff-detail__stats">
					<div class="staff-detail__stat">
						<span class="staff-detail__stat-stars">★★★★★</span>
						<span class="staff-detail__stat-num">{{ detail.rating }}</span>
					</div>
					<div class="staff-detail__stat">
						<span class="staff-detail__stat-label">{{ tr('tour.staffDetail.orders', '服务单数') }}</span>
						<span class="staff-detail__stat-num staff-detail__stat-num--gold">{{ detail.orders }}单</span>
					</div>
					<div class="staff-detail__stat">
						<span class="staff-detail__stat-label">{{ tr('tour.staffDetail.experience', '从业年限') }}</span>
						<span class="staff-detail__stat-num staff-detail__stat-num--gold">{{ detail.years }}年</span>
					</div>
				</div>
			</div>
		</header>

		<!-- 3. 技能标签 + 擅长城市 + 语言能力 -->
		<section class="staff-detail__section">
			<h2 class="staff-detail__section-title">
				{{ tr('tour.staffDetail.skillsTitle', '专业能力') }}
			</h2>
			<div class="staff-detail__skills">
				<span v-for="skill in detail.skills" :key="skill" class="staff-detail__skill">{{ skill }}</span>
			</div>
			<div class="staff-detail__cap-row">
				<div class="staff-detail__cap-item">
					<span class="staff-detail__cap-icon">📍</span>
					<span class="staff-detail__cap-label">{{ tr('tour.staffDetail.cities', '擅长目的地') }}</span>
					<span class="staff-detail__cap-value">{{ detail.cities.join('、') }}</span>
				</div>
			</div>
			<div class="staff-detail__cap-row">
				<div class="staff-detail__cap-item">
					<span class="staff-detail__cap-icon">🗣️</span>
					<span class="staff-detail__cap-label">{{ tr('tour.staffDetail.languages', '语言能力') }}</span>
					<span class="staff-detail__cap-value">{{ detail.languages.join('、') }}</span>
				</div>
			</div>
		</section>

		<!-- 4. 个人简介 -->
		<section class="staff-detail__section">
			<h2 class="staff-detail__section-title">
				{{ tr('tour.staffDetail.about', '关于我') }}
			</h2>
			<p class="staff-detail__bio">
				{{ detail.bio }}
			</p>
		</section>

		<!-- 5. 服务项目 -->
		<section class="staff-detail__section">
			<h2 class="staff-detail__section-title">
				{{ tr('tour.staffDetail.services', '服务项目') }}
			</h2>
			<div class="staff-detail__services">
				<div
					v-for="group in serviceItems"
					:key="group.label"
					class="staff-detail__service-group"
				>
					<h3 class="staff-detail__service-label">
						<span class="staff-detail__service-icon">{{ group.icon }}</span>
						{{ group.label }}
					</h3>
					<div class="staff-detail__service-tags">
						<span
							v-for="item in group.items"
							:key="item"
							class="staff-detail__service-tag"
						>{{ item }}</span>
					</div>
				</div>
			</div>
		</section>

		<!-- 6. 客户评价 -->
		<section v-if="detail.reviews.length" class="staff-detail__section">
			<h2 class="staff-detail__section-title">
				{{ tr('tour.staffDetail.reviews', '客户评价') }}
			</h2>
			<div class="staff-detail__reviews">
				<div
					v-for="(review, i) in detail.reviews"
					:key="i"
					class="staff-detail__review"
				>
					<div class="staff-detail__review-quote">"</div>
					<p class="staff-detail__review-text">
						{{ review.text }}
					</p>
					<div class="staff-detail__review-meta">
						<span class="staff-detail__review-author">{{ review.author }}</span>
						<span class="staff-detail__review-stars">★{{ review.rating }}</span>
						<span class="staff-detail__review-date">{{ review.date }}</span>
					</div>
				</div>
			</div>
		</section>

		<!-- 7. CTA（深色渐变） -->
		<section class="staff-detail__cta">
			<h2 class="staff-detail__cta-title">
				{{ tr('tour.staffDetail.ctaTitlePrefix', '预约') }} {{ detail.name }} {{ tr('tour.staffDetail.ctaTitleSuffix', '的服务') }}
			</h2>
			<p class="staff-detail__cta-desc">
				{{ tr('tour.staffDetail.ctaDesc', '立即提交需求，我们将为您安排专属沟通，让专业的人陪伴您的每一段旅程') }}
			</p>
			<NuxtLink class="staff-detail__cta-btn" :to="$path('/companion')">
				{{ tr('tour.staffDetail.ctaBtn', '立即预约咨询') }} →
			</NuxtLink>
		</section>
	</div>
</template>

<style lang="scss" scoped>
/* ===== 通用变量 ===== */
$gold: #A16207;
$gold-light: #CA8A04;
$gold-lighter: #D4A437;
$gold-bg: #FAF2E0;
$dark-bg: #1C1917;
$dark-bg-2: #292524;
$text-base: #191919;
$text-secondary: #6b6b6b;
$text-tertiary: #898989;
$border-warm: #f0ebe0;
$bg-light-grey: #f5f5f5;

.staff-detail {
	padding: 32px 24px 80px;

	/* ===== 1. 返回 ===== */
	&__back {
		display: inline-flex;
		align-items: center;
		color: $text-secondary;
		font-size: 14px;
		text-decoration: none;
		transition: color 0.3s;

		&:hover {
			color: $gold;
		}

		i {
			transform: rotate(180deg);
			margin-right: 6px;
		}
	}

	/* ===== 2. 头部大卡片 ===== */
	&__header {
		align-items: center;
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
		display: flex;
		gap: 32px;
		margin: 24px 0;
		padding: 36px 32px;
	}

	&__photo {
		align-items: center;
		background: linear-gradient(135deg, $dark-bg-2, $dark-bg);
		border-radius: 50%;
		display: flex;
		height: 120px;
		justify-content: center;
		position: relative;
		width: 120px;
		flex-shrink: 0;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

		&::before {
			content: '';
			position: absolute;
			inset: 4px;
			border-radius: 50%;
			background: radial-gradient(circle at 50% 30%, rgba(161, 98, 7, 0.35), transparent 60%);
		}
	}

	&__photo-icon {
		position: relative;
		z-index: 1;
		color: $gold-lighter;
		font-size: 56px;
	}

	&__rating-badge {
		background: linear-gradient(135deg, $gold, $gold-light);
		border-radius: 999px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
		color: #fff;
		font-size: 14px;
		font-weight: 700;
		padding: 3px 12px;
		position: absolute;
		right: -8px;
		top: -4px;
	}

	&__info {
		flex: 1;
	}

	&__name {
		color: $text-base;
		font-size: 28px;
		font-weight: 800;
		margin: 0 0 8px;
	}

	&__role {
		color: $gold;
		font-size: 15px;
		font-weight: 500;
		margin: 0 0 16px;
	}

	&__stats {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 32px;
	}

	&__stat {
		align-items: center;
		display: flex;
		gap: 8px;

		&-stars {
			color: $gold;
			font-size: 14px;
			letter-spacing: 1px;
		}

		&-label {
			color: $text-tertiary;
			font-size: 13px;
		}

		&-num {
			color: $text-base;
			font-size: 16px;
			font-weight: 700;

			&--gold {
				color: $gold;
			}
		}
	}

	/* ===== 通用 section ===== */
	&__section {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
		margin-bottom: 20px;
		padding: 28px 32px;
	}

	&__section-title {
		border-left: 3px solid $gold;
		color: $gold;
		font-size: 17px;
		font-weight: 600;
		margin: 0 0 20px;
		padding-left: 12px;
	}

	/* ===== 3. 技能 + 擅长 + 语言 ===== */
	&__skills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}

	&__skill {
		background: $gold-bg;
		border: 1px solid rgba(161, 98, 7, 0.3);
		border-radius: 999px;
		color: $gold;
		font-size: 13px;
		font-weight: 500;
		padding: 5px 16px;
	}

	&__cap-row {
		margin-bottom: 12px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	&__cap-item {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		font-size: 14px;
		line-height: 1.7;
	}

	&__cap-icon {
		flex-shrink: 0;
	}

	&__cap-label {
		color: $text-tertiary;
		font-weight: 600;
		flex-shrink: 0;
	}

	&__cap-value {
		color: $text-base;
	}

	/* ===== 4. 简介 ===== */
	&__bio {
		color: $text-base;
		font-size: 17px;
		line-height: 1.9;
		margin: 0;
		font-weight: 400;
	}

	/* ===== 5. 服务项目 ===== */
	&__services {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__service-group {
		padding: 16px 20px;
		background: $bg-light-grey;
		border-radius: 10px;
	}

	&__service-label {
		align-items: center;
		display: flex;
		font-size: 15px;
		font-weight: 600;
		color: $text-base;
		gap: 8px;
		margin: 0 0 12px;
	}

	&__service-icon {
		font-size: 18px;
	}

	&__service-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__service-tag {
		padding: 5px 14px;
		border-radius: 999px;
		background: #fff;
		border: 1px solid $border-warm;
		color: $text-secondary;
		font-size: 13px;
		transition: all 0.3s;

		&:hover {
			border-color: $gold;
			color: $gold;
		}
	}

	/* ===== 6. 客户评价 ===== */
	&__reviews {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	&__review {
		position: relative;
		background: $gold-bg;
		border-radius: 12px;
		padding: 24px 20px 20px;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 4px;
			height: 100%;
			background: linear-gradient(180deg, $gold, $gold-light);
		}
	}

	&__review-quote {
		position: absolute;
		top: -10px;
		right: 16px;
		font-size: 56px;
		color: rgba(161, 98, 7, 0.15);
		font-family: Georgia, serif;
		line-height: 1;
		font-weight: 700;
	}

	&__review-text {
		color: $text-base;
		font-size: 14px;
		font-style: italic;
		line-height: 1.8;
		margin: 0 0 16px;
	}

	&__review-meta {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		font-size: 13px;
	}

	&__review-author {
		color: $text-base;
		font-weight: 600;
	}

	&__review-stars {
		color: $gold;
		font-weight: 600;
	}

	&__review-date {
		color: $text-tertiary;
	}

	/* ===== 7. CTA ===== */
	&__cta {
		background: linear-gradient(135deg, $dark-bg, $dark-bg-2);
		border-radius: 16px;
		margin-top: 32px;
		overflow: hidden;
		padding: 48px 32px;
		position: relative;
		text-align: center;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(circle at 50% 50%, rgba(161, 98, 7, 0.2), transparent 50%);
		}
	}

	&__cta-title {
		color: #fff;
		font-size: clamp(20px, 3vw, 26px);
		font-weight: 700;
		margin: 0 0 12px;
		position: relative;
		z-index: 1;
	}

	&__cta-desc {
		color: rgba(255, 255, 255, 0.7);
		font-size: 15px;
		line-height: 1.6;
		margin: 0 auto 24px;
		max-width: 480px;
		position: relative;
		z-index: 1;
	}

	&__cta-btn {
		background: linear-gradient(135deg, $gold, $gold-light);
		border-radius: 999px;
		color: #fff;
		display: inline-block;
		font-size: 16px;
		font-weight: 600;
		padding: 13px 36px;
		position: relative;
		text-decoration: none;
		transition: all 0.3s;
		z-index: 1;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(161, 98, 7, 0.4);
		}
	}
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
	.staff-detail__reviews {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 720px) {
	.staff-detail {
		padding: 16px 16px 60px;

		&__header {
			flex-direction: column;
			gap: 20px;
			padding: 28px 20px;
			text-align: center;
		}

		&__photo {
			height: 96px;
			width: 96px;
		}

		&__photo-icon {
			font-size: 44px;
		}

		&__stats {
			gap: 16px;
			justify-content: center;
		}

		&__section {
			padding: 22px 18px;
		}

		&__bio {
			font-size: 16px;
		}

		&__reviews {
			grid-template-columns: 1fr;
		}

		&__cta {
			padding: 36px 20px;
		}
	}
}
</style>
