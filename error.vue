<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
	error: NuxtError
}>()

const is404 = computed(() => props.error?.statusCode === 404)

// error.vue 在 Nuxt app context 之外，composables 自动导入不可用
// 用 useNuxtApp 手动获取 i18n，带 fallback（i18n 未初始化时用中文兜底）
const nuxtApp = useNuxtApp()

// 双语文案（i18n 不可用时用 fallback）
const messages = {
	en: {
		notFoundTitle: 'Page Not Found',
		notFoundDesc: 'The page you are looking for doesn\'t exist or has been removed. Let us get you back on track.',
		errorTitle: 'Something Went Wrong',
		errorDesc: 'The server is having a moment. Please try again later or return to the homepage.',
		goHome: 'Back to Home',
		goCustom: 'Customize Trip',
		popularLinks: 'Popular:',
		home: 'Home',
		custom: 'Custom Trip',
		articles: 'Travel Guide',
		shop: 'Gift Shop',
	},
	zh: {
		notFoundTitle: '页面走丢了',
		notFoundDesc: '您访问的页面不存在或已被移除，让我们带您回到正轨。',
		errorTitle: '出错了',
		errorDesc: '服务器开小差了，请稍后重试或返回首页。',
		goHome: '返回首页',
		goCustom: '定制行程',
		popularLinks: '热门：',
		home: '首页',
		custom: '定制行程',
		articles: '旅行攻略',
		shop: '礼物商城',
	},
}

// 获取当前语言：error.vue 不走 i18n 中间件，从 URL 路径检测（/zh/ → 中文）
const locale = computed(() => {
	// 客户端：从 window.location 检测
	if (import.meta.client) {
		return window.location.pathname.startsWith('/zh') ? 'zh' : 'en'
	}
	// SSR：从 error.url 检测
	const url = props.error?.url || ''
	return url.includes('/zh/') || url.match(/^\/zh([/?]|$)/) ? 'zh' : 'en'
})

const t = computed(() => messages[locale.value as 'en' | 'zh'] || messages.en)

const pageTitle = computed(() => (is404.value ? t.value.notFoundTitle : t.value.errorTitle))
const pageDesc = computed(() => (is404.value ? t.value.notFoundDesc : t.value.errorDesc))

// 热门链接（双语）
const links = computed(() => [
	{ label: t.value.home, path: '/' },
	{ label: t.value.custom, path: '/custom' },
	{ label: t.value.articles, path: '/articles' },
	{ label: t.value.shop, path: '/product-list' },
])

// 跳转：用 localePath 加语言前缀，fallback 到裸路径
function localePath(path: string) {
	try {
		const i18n = nuxtApp.$i18n
		const loc = i18n?.locale?.value || 'en'
		return path === '/' ? `/${loc}` : `/${loc}${path}`
	}
	catch {
		return path
	}
}

function goHome() {
	clearError({ redirect: localePath('/') })
}

function goCustom() {
	clearError({ redirect: localePath('/custom') })
}
</script>

<template>
	<div class="error-page">
		<div class="error-page__bg" />
		<div class="error-page__content">
			<!-- 大号 404 / 错误码 -->
			<div class="error-page__code">
				{{ error?.statusCode || 500 }}
			</div>
			<h1 class="error-page__title">
				{{ pageTitle }}
			</h1>
			<p class="error-page__desc">
				{{ pageDesc }}
			</p>

			<!-- CTA 按钮 -->
			<div class="error-page__actions">
				<button class="error-page__btn error-page__btn--primary" @click="goHome">
					{{ t.goHome }}
				</button>
				<button class="error-page__btn error-page__btn--secondary" @click="goCustom">
					{{ t.goCustom }}
				</button>
			</div>

			<!-- 热门链接 -->
			<div class="error-page__links">
				<span class="error-page__links-label">{{ t.popularLinks }}</span>
				<NuxtLink
					v-for="link in links"
					:key="link.path"
					:to="localePath(link.path)"
					class="error-page__link"
				>
					{{ link.label }}
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.error-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	padding: 40px 20px;
	box-sizing: border-box;
}

.error-page__bg {
	position: absolute;
	inset: 0;
	background: linear-gradient(135deg, #1C1917 0%, #292524 50%, #1C1917 100%);
	z-index: 0;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 30%, rgba(161, 98, 7, 0.2), transparent 50%);
	}
}

.error-page__content {
	position: relative;
	z-index: 1;
	text-align: center;
	max-width: 560px;
}

.error-page__code {
	font-size: clamp(80px, 18vw, 160px);
	font-weight: 800;
	line-height: 1;
	background: linear-gradient(135deg, #A16207, #CA8A04, #D4A437);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: 16px;
	letter-spacing: -4px;
}

.error-page__title {
	font-size: clamp(20px, 4vw, 28px);
	font-weight: 700;
	color: #fff;
	margin: 0 0 12px;
}

.error-page__desc {
	font-size: 15px;
	color: rgba(255, 255, 255, 0.6);
	line-height: 1.7;
	margin: 0 0 32px;
}

.error-page__actions {
	display: flex;
	gap: 14px;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: 40px;
}

.error-page__btn {
	padding: 13px 32px;
	border-radius: 999px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	border: none;
	transition: transform 0.25s, box-shadow 0.25s;
	font-family: inherit;

	&--primary {
		background: linear-gradient(135deg, #A16207, #CA8A04);
		color: #fff;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(161, 98, 7, 0.4);
		}
	}

	&--secondary {
		background: transparent;
		color: #fff;
		border: 1px solid rgba(202, 138, 4, 0.5);

		&:hover {
			border-color: #CA8A04;
			background: rgba(202, 138, 4, 0.1);
		}
	}
}

.error-page__links {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: center;
}

.error-page__links-label {
	font-size: 13px;
	color: rgba(255, 255, 255, 0.4);
}

.error-page__link {
	font-size: 13px;
	color: rgba(202, 138, 4, 0.8);
	text-decoration: none;
	padding: 4px 14px;
	border-radius: 999px;
	border: 1px solid rgba(202, 138, 4, 0.25);
	transition: all 0.2s;

	&:hover {
		border-color: #CA8A04;
		background: rgba(202, 138, 4, 0.1);
		color: #D4A437;
	}
}
</style>
