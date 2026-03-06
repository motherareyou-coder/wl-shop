import type { Ref } from 'vue'

/**
 * 统一的 SEO 配置 Composable
 * 用于管理页面的 SEO 信息，避免重复配置
 */
export function usePageSEO(options?: {
	title?: string | Ref<string>
	description?: string | Ref<string>
	keywords?: string
	canonicalPath?: string
	noIndex?: boolean
}) {
	const { t } = useI18n()
	const route = useRoute()
	const { domain } = useRuntimeConfig().public

	// 构建完整的标题
	const fullTitle = computed(() => {
		if (!options?.title) {
			return t('appTitle')
		}

		const titleStr = typeof options.title === 'string' ? options.title : options.title.value
		return `${titleStr} | ${t('appTitle')}`
	})

	// 构建描述（自动截断到 160 字符，符合 Google 显示限制）
	const fullDescription = computed(() => {
		let desc = options?.description
			? (typeof options.description === 'string'
					? options.description
					: options.description.value)
			: t('siteDescription') || 'Discover unique surprise gifts at iswink. Perfect for anniversaries, birthdays, and special moments.'

		// 截断到 160 字符（Google SERP 显示限制）
		if (desc && desc.length > 160) {
			desc = `${desc.slice(0, 157)}...`
		}
		return desc
	})

	// 构建关键词
	const fullKeywords = computed(() => {
		if (options?.keywords) {
			return options.keywords
		}
		return 'surprise gifts, love gifts, romantic presents, anniversary gifts, birthday gifts, custom gifts'
	})

	// 规范化链接
	const canonicalUrl = computed(() => {
		if (options?.canonicalPath) {
			return `${domain}${options.canonicalPath}`
		}
		return `${domain}${route.path}`
	})

	// 应用 SEO 配置
	useHead({
		title: fullTitle,
		link: [{
			rel: 'canonical',
			href: canonicalUrl,
		}],
		meta: [
			{
				name: 'keywords',
				content: fullKeywords.value,
			},
			{
				name: 'description',
				content: fullDescription.value,
			},
			...(options?.noIndex
				? [{
						name: 'robots',
						content: 'noindex, nofollow',
					}]
				: []),
		],
	})

	// 同时更新全局 SEO meta
	useSeoMeta({
		title: fullTitle,
		ogTitle: fullTitle,
		description: fullDescription,
		ogDescription: fullDescription,
		twitterCard: 'summary_large_image',
		twitterTitle: fullTitle,
		twitterDescription: fullDescription,
	})

	return {
		title: fullTitle,
		description: fullDescription,
		keywords: fullKeywords,
		canonicalUrl,
	}
}

/**
 * 产品专用 SEO
 */
export function useProductSEO(productInfo: Ref<{
	name?: string
	keyword?: string
	introduction?: string
} | null>) {
	const { t } = useI18n()
	const route = useRoute()
	const { domain } = useRuntimeConfig().public

	const title = computed(() => {
		const name = productInfo.value?.name || ''
		const appTitle = t('appTitle')
		let pageTitle = `${name} ${appTitle}`

		// 根据活动类型添加前缀
		if (route.query.combinationActivityId) {
			pageTitle = `${t('拼团')} ${name} ${appTitle}`
		}
		else if (route.query.seckillActivityId) {
			pageTitle = `${t('秒杀')} ${name} ${appTitle}`
		}
		else if (route.query.bargainActivityId) {
			pageTitle = `${t('砍价')} ${name} ${appTitle}`
		}

		return pageTitle
	})

	const description = computed(() => {
		return productInfo.value?.introduction
			|| `Shop ${productInfo.value?.name || 'this item'} at iswink. High quality surprise gifts with free shipping worldwide.`
	})

	const keywords = computed(() => {
		const baseKeywords = 'surprise gifts, love gifts, romantic presents'
		const productKeywords = productInfo.value?.keyword || ''
		return productKeywords ? `${baseKeywords}, ${productKeywords}` : baseKeywords
	})

	// 规范化 URL - 始终使用 /en/ 路径
	const canonicalUrl = computed(() => {
		const enPath = route.fullPath.replace(/^\/[a-z]{2}\//, '/en/')
		return `${domain}${enPath}`
	})

	useHead({
		title,
		link: [{
			rel: 'canonical',
			href: canonicalUrl,
		}],
		meta: [
			{
				name: 'keywords',
				content: keywords.value,
			},
			{
				name: 'description',
				content: description.value,
			},
		],
	})

	useSeoMeta({
		title,
		ogTitle: title,
		description,
		ogDescription: description,
		twitterCard: 'summary_large_image',
		twitterTitle: title,
		twitterDescription: description,
	})

	return {
		title,
		description,
		keywords,
		canonicalUrl,
	}
}

/**
 * 文章专用 SEO
 */
export function useArticleSEO(articleInfo: Ref<{
	title?: string
	keyWords?: string
	introduction?: string
} | null>) {
	const { t } = useI18n()
	const route = useRoute()
	const { domain } = useRuntimeConfig().public

	const title = computed(() => {
		const articleTitle = articleInfo.value?.title || ''
		return `${articleTitle} | ${t('appTitle')}`
	})

	const description = computed(() => {
		return articleInfo.value?.introduction
			|| 'Read our latest articles about surprise gifts and relationship tips.'
	})

	const keywords = computed(() => {
		return articleInfo.value?.keyWords
			|| 'gift guides, relationship tips, surprise ideas'
	})

	const canonicalUrl = computed(() => {
		return `${domain}${route.path}`
	})

	useHead({
		title,
		link: [{
			rel: 'canonical',
			href: canonicalUrl,
		}],
		meta: [
			{
				name: 'keywords',
				content: keywords.value,
			},
			{
				name: 'description',
				content: description.value,
			},
		],
	})

	useSeoMeta({
		title,
		ogTitle: title,
		description,
		ogDescription: description,
		twitterCard: 'summary_large_image',
		twitterTitle: title,
		twitterDescription: description,
	})

	return {
		title,
		description,
		keywords,
		canonicalUrl,
	}
}
