<script setup lang="ts">
import { getCaseById, getCasesByType, type TourCase } from '~/config/tour-cases'

defineOptions({ name: 'CaseDetail' })
definePageMeta({ title: 'Customer Story' })

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { domain } = useRuntimeConfig().public
const id = Number(route.params.id)

// 数据加载：当前用本地静态数据，后续替换为 API
// const { data: detail } = await useAPI<TourCase>('travel/case/get', { params: { id } })
const detail = ref<TourCase | undefined>(getCaseById(id))

if (!detail.value) {
	// 找不到案例，抛 404
	throw createError({ statusCode: 404, statusMessage: 'Case not found', fatal: true })
}

// 动态面包屑：首页 > 客户案例 > [客户名]
route.meta.breadcrumb = [
	{ label: $t('tour.caseList.heroTitle') !== 'tour.caseList.heroTitle' ? $t('tour.caseList.heroTitle') : '客户案例', to: '/case' },
	{ label: detail.value.name },
]

useSEO({
	routeKey: 'articleDetail',
	title: detail.value.name,
	description: detail.value.sharing.slice(0, 120),
	keywords: [detail.value.route],
	type: 'article',
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: 'Customer Stories', url: `${domain}/case` },
		{ name: detail.value.name, url: `${domain}${route.path}` },
	],
})

const { gtag } = useGtag()
onMounted(() => {
	gtag('event', 'screen_view', { screen_name: 'case-detail' })
})

// ===== 相关案例推荐（同 type 的其他案例，最多 3 个） =====
const relatedCases = computed<TourCase[]>(() => {
	return getCasesByType(detail.value!.type)
		.filter(c => c.id !== detail.value!.id)
		.slice(0, 3)
})

// 行程概要信息网格
const summaryInfo = computed(() => [
	{
		icon: '🗓️',
		labelKey: 'tour.caseDetail.days',
		labelFallback: '行程天数',
		value: `${detail.value!.days} 天`,
	},
	{
		icon: '👥',
		labelKey: 'tour.caseDetail.people',
		labelFallback: '出行人数',
		value: detail.value!.people,
	},
	{
		icon: '📍',
		labelKey: 'tour.caseDetail.destination',
		labelFallback: '目的地',
		value: destinationName(detail.value!.route),
	},
	{
		icon: '💰',
		labelKey: 'tour.caseDetail.budget',
		labelFallback: '预算范围',
		value: detail.value!.budget,
	},
])

// type → 中文标签映射
const typeLabelMap: Record<string, string> = {
	business: '商务出行',
	family: '家庭旅行',
	romantic: '情侣蜜月',
	culture: '文化探索',
	special: '特色体验',
	team: '企业团建',
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}

function destinationName(routeStr: string) {
	return routeStr.split('·')[0].trim() || routeStr
}

// ===== 右侧交流区 =====
interface CaseComment {
	id: number
	avatar: string
	name: string
	date: string
	content: string
	likes: number
	mine?: boolean
}

// 预置交流数据（静态兜底，后续替换为 API）
const comments = ref<CaseComment[]>([
	{
		id: 1,
		avatar: '林',
		name: '林小姐',
		date: '2024-11-05',
		content: '看了这个案例很心动，请问丝绸之路这条线 11 月去天气合适吗？',
		likes: 12,
	},
	{
		id: 2,
		avatar: 'K',
		name: 'Kevin',
		date: '2024-10-28',
		content: '壁画画坊体验太赞了，之前去敦煌没安排上，下次一定要定制！',
		likes: 8,
	},
	{
		id: 3,
		avatar: '赵',
		name: '赵女士',
		date: '2024-10-20',
		content: '请问亲子出行的话，这条路线适合 6 岁小朋友吗？',
		likes: 5,
	},
])

const commentText = ref('')
const submitting = ref(false)
const isLoggedIn = computed(() => !!userStore.accessToken)

// 当前登录用户信息（从 userStore 获取，兜底默认值）
const currentUser = computed(() => ({
	name: userStore.userInfo?.nickname || userStore.userInfo?.username || '我',
	avatar: (userStore.userInfo?.nickname || '我').charAt(0).toUpperCase(),
}))

async function submitComment() {
	if (!isLoggedIn.value) {
		ElMessage.info($t('Please sign in first'))
		router.push(`${$path('/login')}?redirect=${encodeURIComponent(route.fullPath)}`)
		return
	}
	const text = commentText.value.trim()
	if (!text) {
		ElMessage.info('请输入留言内容')
		return
	}
	submitting.value = true
	try {
		// TODO: 后端接口就绪后替换
		// await $api('travel/case-comment/create', {
		// 	method: 'post',
		// 	body: { caseId: id, content: text },
		// })
		await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络请求
		comments.value.unshift({
			id: Date.now(),
			avatar: currentUser.value.avatar,
			name: currentUser.value.name,
			date: new Date().toISOString().split('T')[0],
			content: text,
			likes: 0,
			mine: true,
		})
		commentText.value = ''
		ElMessage.success('发表成功')
	}
	catch {
		// 全局拦截器已弹错误提示
	}
	finally {
		submitting.value = false
	}
}

function likeComment(comment: CaseComment) {
	if (!isLoggedIn.value) {
		ElMessage.info($t('Please sign in first'))
		return
	}
	comment.likes++
}

// 交流总数
const commentCount = computed(() => comments.value.length)
</script>

<template>
	<div class="case-detail-page">
		<div class="case-detail__container">
			<!-- 双栏布局：左主内容 + 右交流区 -->
			<div class="case-detail__layout">
				<!-- ========== 左侧：主要内容 ========== -->
				<main class="case-detail__main">
					<!-- ① 案例头部（白色大卡片） -->
					<header class="case-detail__header">
						<div class="case-detail__header-top">
							<div class="case-detail__avatar" :class="detail!.avatarCls">
								{{ detail!.avatar }}
							</div>
							<div class="case-detail__info">
								<h1 class="case-detail__name">
									{{ detail!.name }}
								</h1>
								<p class="case-detail__meta">
									{{ detail!.meta }}
								</p>
								<p class="case-detail__route">
									{{ detail!.route }}
								</p>
							</div>
							<div class="case-detail__date">
								<span class="case-detail__type-tag">{{ typeLabelMap[detail!.type] }}</span>
								<span class="case-detail__badge">
									✓ {{ $t('tour.caseDetail.verifiedOrder') }}
								</span>
								<span class="case-detail__date-text">{{ detail!.date }}</span>
							</div>
						</div>
						<div class="case-detail__rating-row">
							<span class="case-detail__stars">★★★★★</span>
							<span class="case-detail__rating-num">{{ detail!.rating.toFixed(1) }}</span>
							<span class="case-detail__rating-label">{{ tr('tour.caseDetail.ratingLabel', '客户评分') }}</span>
						</div>
					</header>

					<!-- ② Before/After 完整叙事 + 旅行亮点 -->
					<article class="case-detail__story">
						<!-- Before -->
						<div class="case-detail__story-block case-detail__story-block--before">
							<span class="case-detail__story-label">
								{{ tr('tour.caseList.beforeLabel', 'Before 定制前') }}
							</span>
							<p class="case-detail__story-text">
								{{ detail!.beforeSharing }}
							</p>
						</div>
						<!-- After -->
						<div class="case-detail__story-block case-detail__story-block--after">
							<span class="case-detail__story-label">
								{{ tr('tour.caseList.afterLabel', 'After 定制后') }}
							</span>
							<p class="case-detail__story-text">
								{{ detail!.afterSharing }}
							</p>
						</div>

						<!-- 旅行亮点标签 -->
						<div v-if="detail!.highlights?.length" class="case-detail__highlights">
							<h3 class="case-detail__highlights-title">
								{{ tr('tour.caseDetail.highlightsTitle', '旅行亮点') }}
							</h3>
							<div class="case-detail__highlight-tags">
								<span
									v-for="h in detail!.highlights"
									:key="h"
									class="case-detail__highlight-tag"
								>
									✓ {{ h }}
								</span>
							</div>
						</div>
					</article>

					<!-- ③ 行程概要信息网格 -->
					<section class="case-detail__summary">
						<h2 class="case-detail__summary-heading">
							{{ tr('tour.caseDetail.summaryTitle', '行程概要') }}
						</h2>
						<div class="case-detail__summary-grid">
							<div v-for="item in summaryInfo" :key="item.labelKey" class="case-detail__summary-item">
								<span class="case-detail__summary-icon">{{ item.icon }}</span>
								<span class="case-detail__summary-label">{{ tr(item.labelKey, item.labelFallback) }}</span>
								<span class="case-detail__summary-value">{{ item.value }}</span>
							</div>
						</div>
					</section>

					<!-- ④ 相关案例推荐 -->
					<section v-if="relatedCases.length" class="case-detail__related">
						<h2 class="case-detail__related-heading">
							{{ tr('tour.caseDetail.relatedTitle', '相关案例推荐') }}
						</h2>
						<div class="case-detail__related-grid">
							<NuxtLink
								v-for="c in relatedCases"
								:key="c.id"
								:to="$path(`/case/${c.id}`)"
								class="case-detail__related-card"
							>
								<div class="case-detail__related-media">
									<span class="case-detail__related-name">{{ destinationName(c.route) }}</span>
								</div>
								<div class="case-detail__related-body">
									<div class="case-detail__related-author">
										<span class="case-detail__related-avatar" :class="c.avatarCls">{{ c.avatar }}</span>
										<div>
											<p class="case-detail__related-name-text">
												{{ c.name }}
											</p>
											<p class="case-detail__related-route">
												{{ destinationName(c.route) }} · {{ c.days }}天
											</p>
										</div>
									</div>
									<p class="case-detail__related-sharing">
										{{ c.sharing }}
									</p>
									<div class="case-detail__related-footer">
										<span class="case-detail__related-rating">★ {{ c.rating.toFixed(1) }}</span>
										<span class="case-detail__related-link">{{ tr('tour.caseList.viewStory', '查看') }} →</span>
									</div>
								</div>
							</NuxtLink>
						</div>
					</section>

					<!-- ⑤ CTA -->
					<section class="case-detail__cta">
						<h2 class="case-detail__cta-title">
							{{ tr('tour.caseDetail.ctaTitle', '定制类似的行程') }}
						</h2>
						<p class="case-detail__cta-desc">
							{{ tr('tour.caseDetail.ctaDesc', 'iswink 专业定制您的专属中国之旅') }}
						</p>
						<NuxtLink class="case-detail__cta-btn" :to="$path('/custom')">
							{{ tr('tour.caseDetail.ctaBtn', '免费定制行程') }} →
						</NuxtLink>
					</section>
				</main>

				<!-- ========== 右侧：交流区（sticky） ========== -->
				<aside class="case-detail__aside">
					<div class="case-detail__comments">
						<!-- 交流区标题 -->
						<div class="case-detail__comments-header">
							<h3 class="case-detail__comments-title">
								💬 {{ tr('tour.caseDetail.discussionTitle', '用户交流') }}
							</h3>
							<span class="case-detail__comments-count">{{ commentCount }}</span>
						</div>

						<!-- 输入区 -->
						<div class="case-detail__comment-input">
							<div v-if="!isLoggedIn" class="case-detail__login-hint">
								<p>{{ tr('tour.caseDetail.loginToComment', '登录后参与交流') }}</p>
								<NuxtLink :to="`${$path('/login')}?redirect=${encodeURIComponent(route.fullPath)}`" class="case-detail__login-btn">
									{{ $t('Please sign in first') }}
								</NuxtLink>
							</div>
							<template v-else>
								<div class="case-detail__input-user">
									<span class="case-detail__input-avatar">{{ currentUser.avatar }}</span>
									<span class="case-detail__input-name">{{ currentUser.name }}</span>
								</div>
								<el-input
									v-model="commentText"
									type="textarea"
									:rows="3"
									:placeholder="tr('tour.caseDetail.commentPlaceholder', '分享你的看法或提问...')"
									:maxlength="500"
									show-word-limit
									class="case-detail__textarea"
								/>
								<button
									type="button"
									class="case-detail__submit-btn"
									:disabled="submitting || !commentText.trim()"
									@click="submitComment"
								>
									{{ submitting ? '发表中...' : tr('tour.caseDetail.submitComment', '发表') }}
								</button>
							</template>
						</div>

						<!-- 交流列表 -->
						<div class="case-detail__comment-list">
							<div v-if="!comments.length" class="case-detail__comment-empty">
								{{ tr('tour.caseDetail.noComments', '还没有人交流，来说点什么吧') }}
							</div>
							<div
								v-for="comment in comments"
								:key="comment.id"
								class="case-detail__comment-item"
								:class="{ 'case-detail__comment-item--mine': comment.mine }"
							>
								<div class="case-detail__comment-avatar">{{ comment.avatar }}</div>
								<div class="case-detail__comment-body">
									<div class="case-detail__comment-meta">
										<span class="case-detail__comment-name">{{ comment.name }}</span>
										<span v-if="comment.mine" class="case-detail__comment-tag">我</span>
										<span class="case-detail__comment-date">{{ comment.date }}</span>
									</div>
									<p class="case-detail__comment-text">{{ comment.content }}</p>
									<button class="case-detail__comment-like" @click="likeComment(comment)">
										👍 {{ comment.likes || '' }}
									</button>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
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

.case-detail-page {
	background: $bg-light-grey;
	min-height: 100vh;
}

.case-detail__container {
	max-width: var(--max-width-1400);
	margin: 0 auto;
	padding: 24px 24px 80px;

	@media (max-width: 720px) {
		padding: 16px 16px 60px;
	}
}

/* ===== 双栏布局 ===== */
.case-detail__layout {
	display: grid;
	grid-template-columns: 1fr 380px;
	gap: 24px;
	align-items: start;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
	}
}

/* ========== 左侧主内容 ========== */
.case-detail__main {
	min-width: 0; /* 防止 grid 子元素溢出 */
}

/* ① 案例头部 */
.case-detail {
	&__header {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
	}

	&__header-top {
		display: flex;
		gap: 20px;
		align-items: flex-start;
	}

	&__avatar {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: linear-gradient(135deg, $gold, $gold-light);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		font-weight: 700;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(161, 98, 7, 0.25);
	}

	&__info {
		flex: 1;
		min-width: 0;
	}

	&__name {
		font-size: 24px;
		font-weight: 800;
		margin: 0 0 6px;
		color: $text-base;
	}

	&__meta {
		font-size: 14px;
		color: $text-secondary;
		margin: 0 0 8px;
	}

	&__route {
		font-size: 15px;
		font-weight: 600;
		color: $gold;
		margin: 0;
		padding: 8px 14px;
		background: $gold-bg;
		border-radius: 8px;
		display: inline-block;
	}

	&__date {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		flex-shrink: 0;
	}

	&__type-tag {
		background: linear-gradient(135deg, $gold, $gold-light);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		padding: 4px 12px;
		border-radius: 999px;
	}

	&__badge {
		background: $gold-bg;
		color: $gold;
		font-size: 12px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 4px;
		border: 1px solid $gold;
	}

	&__date-text {
		font-size: 13px;
		color: $text-tertiary;
	}

	&__rating-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid $border-warm;
	}

	&__stars {
		color: $gold-light;
		font-size: 18px;
		letter-spacing: 2px;
	}

	&__rating-num {
		font-size: 20px;
		font-weight: 800;
		color: $text-base;
	}

	&__rating-label {
		font-size: 13px;
		color: $text-tertiary;
	}

	/* ② Before/After 叙事 */
	&__story {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 36px;
		margin-bottom: 24px;
	}

	&__story-block {
		position: relative;
		padding: 24px 24px 24px 28px;
		border-radius: 12px;
		margin-bottom: 20px;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 16px;
			bottom: 16px;
			width: 4px;
			border-radius: 2px;
		}

		&--before {
			background: $bg-light-grey;

			&::before {
				background: $text-tertiary;
			}
		}

		&--after {
			background: $gold-bg;

			&::before {
				background: $gold;
			}
		}

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	&__story-label {
		display: inline-block;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: $gold;
		margin-bottom: 10px;
	}

	&__story-text {
		font-size: 15px;
		line-height: 1.9;
		color: $text-base;
		margin: 0;
		white-space: pre-wrap;
	}

	&__highlights {
		margin-top: 28px;
		padding-top: 24px;
		border-top: 1px solid $border-warm;
	}

	&__highlights-title {
		font-size: 16px;
		font-weight: 700;
		color: $text-base;
		margin: 0 0 14px;
		padding-left: 12px;
		border-left: 3px solid $gold;
	}

	&__highlight-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	&__highlight-tag {
		padding: 6px 14px;
		background: $gold-bg;
		border: 1px solid $gold;
		border-radius: 999px;
		font-size: 13px;
		color: $gold;
		font-weight: 500;
	}

	/* ③ 行程概要 */
	&__summary {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 24px;
	}

	&__summary-heading {
		font-size: 20px;
		font-weight: 700;
		color: $text-base;
		margin: 0 0 24px;
		text-align: center;
	}

	&__summary-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	&__summary-item {
		text-align: center;
		padding: 20px 12px;
		background: $bg-light-grey;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__summary-icon {
		font-size: 28px;
		line-height: 1;
		margin-bottom: 4px;
	}

	&__summary-label {
		font-size: 12px;
		color: $text-tertiary;
	}

	&__summary-value {
		font-size: 15px;
		font-weight: 700;
		color: $text-base;
	}

	/* ④ 相关案例 */
	&__related {
		margin-bottom: 24px;
	}

	&__related-heading {
		font-size: 22px;
		font-weight: 700;
		color: $text-base;
		margin: 0 0 24px;
		text-align: center;
	}

	&__related-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	&__related-card {
		background: #fff;
		border: 1px solid $border-warm;
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		transition: transform 0.3s, box-shadow 0.3s;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
		}
	}

	&__related-media {
		position: relative;
		aspect-ratio: 16 / 9;
		background: linear-gradient(135deg, #44403C, #1C1917);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(circle at 50% 50%, rgba(161, 98, 7, 0.3), transparent 60%);
		}
	}

	&__related-name {
		position: relative;
		z-index: 1;
		font-size: 20px;
		font-weight: 700;
		color: #fff;
	}

	&__related-body {
		padding: 16px 18px 18px;
	}

	&__related-author {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	&__related-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: linear-gradient(135deg, $gold, $gold-light);
		color: #fff;
		font-size: 14px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	&__related-name-text {
		font-size: 14px;
		font-weight: 700;
		color: $text-base;
		margin: 0;
	}

	&__related-route {
		font-size: 12px;
		color: $gold;
		margin: 0;
		font-weight: 500;
	}

	&__related-sharing {
		font-size: 13px;
		line-height: 1.6;
		color: $text-secondary;
		margin: 0 0 12px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	&__related-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 10px;
		border-top: 1px solid $border-warm;
	}

	&__related-rating {
		font-size: 13px;
		font-weight: 700;
		color: $gold;
	}

	&__related-link {
		font-size: 12px;
		font-weight: 600;
		color: $gold;
	}

	/* ⑤ CTA */
	&__cta {
		background: linear-gradient(135deg, $dark-bg, $dark-bg-2);
		border-radius: 16px;
		padding: 48px 32px;
		text-align: center;
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(circle at 50% 50%, rgba(161, 98, 7, 0.2), transparent 50%);
		}
	}

	&__cta-title {
		position: relative;
		z-index: 1;
		color: #fff;
		font-size: clamp(22px, 3.5vw, 28px);
		font-weight: 700;
		margin: 0 0 10px;
	}

	&__cta-desc {
		position: relative;
		z-index: 1;
		color: rgba(255, 255, 255, 0.7);
		font-size: 15px;
		margin: 0 0 24px;
		line-height: 1.6;
	}

	&__cta-btn {
		position: relative;
		z-index: 1;
		display: inline-block;
		background: linear-gradient(135deg, $gold, $gold-light);
		border-radius: 999px;
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		padding: 14px 40px;
		text-decoration: none;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(161, 98, 7, 0.4);
		}
	}
}

/* ========== 右侧交流区 ========== */
.case-detail__aside {
	position: sticky;
	top: 80px; /* 避开 sticky header */

	@media (max-width: 1024px) {
		position: static;
	}
}

.case-detail__comments {
	background: #fff;
	border: 1px solid $border-warm;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);

	&-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid $border-warm;
		background: linear-gradient(135deg, rgba(250, 242, 224, 0.5), transparent);
	}

	&-title {
		font-size: 16px;
		font-weight: 700;
		color: $text-base;
		margin: 0;
	}

	&-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 24px;
		height: 24px;
		padding: 0 8px;
		border-radius: 999px;
		background: $gold-bg;
		color: $gold;
		font-size: 12px;
		font-weight: 700;
	}
}

/* 输入区 */
.case-detail__comment-input {
	padding: 20px 24px;
	border-bottom: 1px solid $border-warm;
}

.case-detail__login-hint {
	text-align: center;
	padding: 8px 0;

	p {
		font-size: 14px;
		color: $text-secondary;
		margin: 0 0 12px;
	}
}

.case-detail__login-btn {
	display: inline-block;
	padding: 8px 24px;
	font-size: 14px;
	font-weight: 600;
	border-radius: 999px;
	background: linear-gradient(135deg, $gold, $gold-light);
	color: #fff;
	text-decoration: none;
	transition: transform 0.2s, box-shadow 0.2s;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(161, 98, 7, 0.3);
	}
}

.case-detail__input-user {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 10px;
}

.case-detail__input-avatar {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: linear-gradient(135deg, $gold, $gold-light);
	color: #fff;
	font-size: 13px;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
}

.case-detail__input-name {
	font-size: 13px;
	font-weight: 600;
	color: $text-base;
}

.case-detail__textarea {
	margin-bottom: 10px;

	:deep(.mi-textarea__inner) {
		border-radius: 8px;
		border-color: $border-warm;
		font-size: 14px;
		resize: none;

		&:focus {
			border-color: $gold;
		}
	}
}

.case-detail__submit-btn {
	width: 100%;
	padding: 10px;
	font-size: 14px;
	font-weight: 600;
	border-radius: 999px;
	background: linear-gradient(135deg, $gold, $gold-light);
	color: #fff;
	border: none;
	cursor: pointer;
	transition: all 0.3s;

	&:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(161, 98, 7, 0.3);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
}

/* 交流列表 */
.case-detail__comment-list {
	max-height: 600px;
	overflow-y: auto;
	padding: 8px 0;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: #d6d0c0;
		border-radius: 2px;
	}
}

.case-detail__comment-empty {
	padding: 32px 24px;
	text-align: center;
	font-size: 14px;
	color: $text-tertiary;
}

.case-detail__comment-item {
	display: flex;
	gap: 12px;
	padding: 16px 24px;
	transition: background 0.2s;

	&:hover {
		background: rgba(250, 242, 224, 0.3);
	}

	&--mine {
		background: rgba(250, 242, 224, 0.4);
	}
}

.case-detail__comment-avatar {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: linear-gradient(135deg, #898989, #6b6b6b);
	color: #fff;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.case-detail__comment-item--mine .case-detail__comment-avatar {
	background: linear-gradient(135deg, $gold, $gold-light);
}

.case-detail__comment-body {
	flex: 1;
	min-width: 0;
}

.case-detail__comment-meta {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-bottom: 6px;
}

.case-detail__comment-name {
	font-size: 13px;
	font-weight: 600;
	color: $text-base;
}

.case-detail__comment-tag {
	font-size: 10px;
	font-weight: 700;
	padding: 1px 6px;
	border-radius: 4px;
	background: $gold;
	color: #fff;
}

.case-detail__comment-date {
	font-size: 12px;
	color: $text-tertiary;
	margin-left: auto;
}

.case-detail__comment-text {
	font-size: 14px;
	line-height: 1.7;
	color: $text-base;
	margin: 0 0 8px;
	word-break: break-word;
}

.case-detail__comment-like {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: $text-tertiary;
	background: none;
	border: none;
	cursor: pointer;
	padding: 2px 8px;
	border-radius: 999px;
	transition: all 0.2s;

	&:hover {
		color: $gold;
		background: $gold-bg;
	}
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
	.case-detail {
		&__summary-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		&__related-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
}

@media (max-width: 720px) {
	.case-detail {
		&__header {
			padding: 24px 20px;
		}

		&__header-top {
			flex-direction: column;
			gap: 16px;
		}

		&__date {
			align-items: flex-start;
			flex-direction: row;
			flex-wrap: wrap;
		}

		&__story {
			padding: 24px 20px;
		}

		&__story-block {
			padding: 20px;
		}

		&__story-text {
			font-size: 14px;
		}

		&__summary {
			padding: 24px 20px;
		}

		&__summary-grid {
			grid-template-columns: 1fr;
		}

		&__related-grid {
			grid-template-columns: 1fr;
		}

		&__cta {
			padding: 36px 24px;
		}
	}
}
</style>
