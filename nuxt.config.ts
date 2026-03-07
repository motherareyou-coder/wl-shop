// https://nuxt.com/docs/api/configuration/nuxt-config
console.log('🔍 环境变量检查:')
console.log('NUXT_API_TARGET_URL:', process.env.NUXT_API_TARGET_URL)
console.log('DOMAIN_URL:', process.env.DOMAIN_URL)
console.log('NODE_ENV:', process.env.NODE_ENV)
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	ssr: process.env.NODE_ENV === 'production',
	// 开发环境检查seo时开启
	// ssr: true,
	// build: {
	// 	analyze: {
	// 		filename: 'static.html'
	// 	}
	// },
	app: {
		head: {
			title: process.env.NUXT_APP_TITLE || 'iswink - Surprise Gifts for Love',
			charset: 'utf-8',
			viewport:
				'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no',
			meta: [
				{
					name: 'keywords',
					content: 'iswink, surprise gifts, love gifts, relationship gifts, romantic presents, anniversary gifts, birthday gifts, custom gifts',
				},
				{
					name: 'description',
					content: 'Discover unique surprise gifts at iswink. Perfect for anniversaries, birthdays, and special moments. Free shipping worldwide. Shop now for memorable presents.',
				},
				{ name: 'author', content: process.env.DOMAIN },
				{ name: 'robots', content: 'index, follow' },
			],
		},
	},
	modules: [
		'@nuxtjs/i18n',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxt/ui',
		'@nuxt/icon',
		'@element-plus/nuxt',
		'dayjs-nuxt',
		'@nuxtjs/seo',
		'nuxt-gtag',
		'@nuxt/image',
	],
	gtag: {
		// id: 'G-80R453F43Q', // 替换为你的 Google Analytics ID
		id: 'G-80R453F43Q',
		// 关键异步参数
		loadingStrategy: 'async', // 启用模块级异步加载[1](@ref)
	},
	robots: {
		// 允许被哪个搜索引擎抓取
		userAgent: '*',
		// 配置 robots.txt
		allow: '/',
		// 不允许抓取的页面
		disallow: ['/admin', '/components', '/user', '/login'],
		// 声明站点地图位置（推荐添加）
		sitemap: process.env.DOMAIN_URL + '/sitemap.xml',
	},
	sitemap: {
		// 开发环境不生成 sitemap，加快启动速度
		enabled: process.env.NODE_ENV === 'production',
		gzip: true,
		cacheTime: 86400, // 缓存时间（秒）
		// 配置 sitemap
		hostname: process.env.DOMAIN_URL,
		exclude: [
			'/components/**',
			'/admin/**',
			'/user/**',
			'/login/**',
		],
		urls: async () => {
			console.log('🔔 Sitemap生成器开始执行') // 添加初始日志
			try {
				const apiTargetUrl = process.env.NUXT_API_TARGET_URL
				// 1. 获取数据并解析结构
				const tenantId = process.env.NUXT_PUBLIC_TENANT_ID // 使用 process.env 获取 tenantId
				const [productsRes, articlesRes] = await Promise.all([
					fetch(`${apiTargetUrl}/product/spu/get-spu-all-id`, {
						headers: {
							'tenant-id': tenantId, // 添加 tenantId 到请求头
						},
					}).then(res => res.json()).catch((e) => {
						console.error('【Sitemap】商品 ID 接口错误:', e.message)
						return { code: -1, data: [] }
					}),
					fetch(`${apiTargetUrl}/promotion/article/get-article-all-id`, {
						headers: {
							'tenant-id': tenantId, // 添加 tenantId 到请求头
						},
					}).then(res => res.json()).catch((e) => {
						console.error('【Sitemap】文章 ID 接口错误:', e.message)
						return { code: -1, data: [] }
					}),
				])
				// 2. 验证接口响应结构

				// 3. 提取有效数据
				const productIds = productsRes?.code === 0 ? productsRes.data : []
				const articleIds = articlesRes?.code === 0 ? articlesRes.data : []
				console.log('【Sitemap】商品ID:', productIds, '文章ID:', articleIds)
				// 3. 使用i18n.locales生成多语言路由
				// const locales = ['zh', 'en', 'pt', 'ru', 'el', 'fr', 'es', 'de', 'it', 'pl', 'ar', 'tr', 'ja', 'id', 'sv']
				const locales = ['en']
				const generateRoutes = (type: string, ids: number[]) =>
					ids.flatMap(id =>
						locales.map(locale => ({
							loc: `/${locale}/${type}/${id}`, // 使用code而非iso
							lastmod: new Date().toISOString(),
							changefreq: 'daily', // 确保是有效的类型
							priority: 1, // 网页的权重  1是100%最高，一般给最重要的页面，不重要的页面0.7-0.9之间
						})),
					)

				return [
					...generateRoutes('product', productIds),
					...generateRoutes('articles', articleIds),
				]
			}
			catch (e) {
				console.error('Sitemap generation error:', e)
				return []
			}
		},
	},
	imports: {
		presets: [
			{
				from: 'lodash-es',
				imports: ['cloneDeep'],
			},
		],
	},
	// @nuxt/ui
	colorMode: {
		preference: 'light',
	},
	image: {
		domains: ['www.iswink.com', 'api.iswink.com'],
		presets: {
			avatar: {
				width: 50,
				height: 50,
				format: 'webp',
			},
			thumbnail: {
				width: 200,
				height: 200,
				format: 'webp',
			},
			product: {
				width: 400,
				height: 400,
				format: 'webp',
			},
			banner: {
				width: 1200,
				height: 400,
				format: 'webp',
			},
		},
	},
	dayjs: {
		// locales: ['en', 'zh'],
		locales: ['en'],
		plugins: ['relativeTime', 'utc', 'timezone', 'duration'],
		// defaultLocale: 'zh',
		defaultLocale: 'en',
	},
	i18n: {
		seo: true, // 启用自动 hreflang
		defaultLocale: 'en',
		baseUrl: process.env.DOMAIN_URl, // 启用自动 hreflang 路由生成绝对路径
		vueI18n: './locales/i18n.config.ts',
		detectBrowserLanguage: {
			useCookie: false,
			alwaysRedirect: false,
		},
		locales: [
			// {
			//     name: '简体中文',
			//     code: 'zh',
			//     iso: 'zh-CN',
			//     language: 'zh-CN',
			//     // file: './locales/zh.ts',
			// },
			{
				// 英语
				name: 'English',
				code: 'en',
				iso: 'en-US',
				language: 'en-US',
				// file: './locales/en.ts',
			},
			// ,{
			//     // 葡萄牙语
			//     name: 'Portuguese',
			//     code: 'pt',
			//     iso: 'pt-PT',
			//     language: 'pt-PT',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 俄语
			//     name: 'Русский',
			//     code: 'ru',
			//     iso: 'ru-RU',
			//     language: 'ru-RU',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 希腊语
			//     name: 'Ελληνικά',
			//     code: 'el',
			//     iso: 'el-GR',
			//     language: 'el-GR',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 法语
			//     name: 'Français',
			//     code: 'fr',
			//     iso: 'fr-FR',
			//     language: 'fr-FR',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 西班牙语
			//     name: 'Español',
			//     code: 'es',
			//     iso: 'es-ES',
			//     language: 'es-ES',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 德语
			//     name: 'Deutsch',
			//     code: 'de',
			//     iso: 'de-DE',
			//     language: 'de-DE',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 意大利语
			//     name: 'Italiano',
			//     code: 'it',
			//     iso: 'it-IT',
			//     language: 'it-IT',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 波兰语
			//     name: 'Polski',
			//     code: 'pl',
			//     iso: 'pl-PL',
			//     language: 'pl-pl',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 阿拉伯语
			//     name: 'العربية',
			//     code: 'ar',
			//     iso: 'ar-SA',
			//     language: 'ar-SA',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 土耳其语
			//     name: 'Türkçe',
			//     code: 'tr',
			//     iso: 'tr-TR',
			//     language: 'tr-TR',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 日语
			//     name: '日本語',
			//     code: 'ja',
			//     iso: 'ja-JP',
			//     language: 'ja-JP',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 印尼语
			//     name: 'Bahasa Indonesia',
			//     code: 'id',
			//     iso: 'id-ID',
			//     language: 'id-ID',
			//     // file: './locales/en.ts',
			// },
			// {
			//     // 瑞典语
			//     name: 'Svenska',
			//     code: 'sv',
			//     iso: 'sv-SE',
			//     language: 'sv-SE',
			//     // file: './locales/en.ts',
			// },
		],
		strategy: 'prefix',
	},

	css: ['@/assets/css/index.scss'],

	icon: {
		class: 'svg-icon',
		mode: 'svg', // SVG | CSS
		customCollections: [
			{
				prefix: 'icon',
				dir: './assets/icons',
			},
		],
	},
	vite: {
		optimizeDeps: {
			include: ['vue', 'vue-router', 'pinia'], // Pre-bundle common dependencies
		},
		build: {
			minify: 'esbuild', // Use esbuild for faster minification
			target: 'esnext', // Use modern JavaScript
			rollupOptions: {
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							if (id.includes('element-plus')) {
								return 'element-plus'
							} else if (id.includes('swiper')) {
								return 'swiper'
							} else if (id.includes('lodash')) {
								return 'lodash'
							} else if (id.includes('dayjs')) {
								return 'dayjs'
							}
						}
					},
				},
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "@/assets/css/element.scss" as *;`,
				},
			},
		},
		// build: {
		//     rollupOptions: {
		//         output: {
		//             manualChunks: (id) => {
		//                 if (id.includes('element-plugin')) {
		//                     return 'componentUi'
		//                 } else if (id.includes('axios')) {
		//                     return 'axios'
		//                 } else if (id.includes('lodash')) {
		//                     return 'lodash'
		//                 }
		//             },
		//         },
		//     },
		// },
		server: {
			proxy: {
				'/api': {
					// target: 'https://api.iswink.com',
					// target: 'http://122.190.56.101:6060/shop-server',
					target: process.env.NUXT_API_TARGET_URL,
					// target: 'http://10.10.10.17:48080',
					// target: 'http://192.168.1.3:48080',
					changeOrigin: true,
					rewrite: path => path.replace('api', 'app-api'),
				},
			},
		},
	},
	runtimeConfig: {
		// public中的键也可以在客户端使用
		public: {
			// API 请求基础路径 - 统一使用相对路径，走 Nitro Proxy
			// 非生产环境走 vite.server.proxy 将 /api 请求代理到后端服务器
			apiBaseProxyPath: process.env.NODE_ENV === 'production' ? process.env.NUXT_API_PROXY_PATH : '/api',
			tenantId: process.env.NUXT_PUBLIC_TENANT_ID || '1',
			currency: '$',
			domain: process.env.DOMAIN_URL,
			shortDomain: process.env.DOMAIN,
			kefuWsUrl: process.env.NUXT_PUBLIC_KEFU_WS_URL,
		},
	},
	nitro: {
		// 开启gzip压缩
		compressPublicAssets: true,
		// 配置缓存策略
		routeRules: {
			'/app-api/**': {
				proxy: process.env.NUXT_API_TARGET_URL,
			},
			// 静态资源缓存
			'/**/*.{js,css,svg,png,jpg,jpeg,webp}': {
				headers: {
					'Cache-Control': 'max-age=31536000, immutable',
				},
			},
			// API缓存
			'/api/**': {
				headers: {
					'Cache-Control': 'max-age=60, stale-while-revalidate=300',
				},
			},
		},
	},
})
