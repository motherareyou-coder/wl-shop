// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: false },
	ssr: process.env.NODE_ENV === 'production',
	app: {
		head: {
			charset: 'utf-8',
			viewport:
				'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no',
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
		'nuxt-gtag'
	],
	gtag: {
		id: 'G-80R453F43Q',
		enable: true
	},
	seo: {
		robots: {
			// 配置 robots.txt
			allow: '/',
			disallow: '/admin'
		},
		sitemap: {
			// 配置 sitemap
			hostname: 'https://iswink.com',
			// exclude: ['/admin/**']
		}
	},
	// id: 'G-80R453F43Q', // 替换为你的 Google Analytics ID
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
	dayjs: {
		locales: ['en', 'zh'],
		plugins: ['relativeTime', 'utc', 'timezone', 'duration'],
		defaultLocale: 'zh',
	},
	i18n: {
		defaultLocale: 'zh',
		vueI18n: './locales/i18n.config.ts',
		detectBrowserLanguage: {
			useCookie: false,
			alwaysRedirect: false,
		},
		locales: [
			{
				name: '简体中文',
				code: 'zh',
				iso: 'zh-CN',
				language: 'zh-CN',
				// file: './locales/zh.ts',
			},
			{
				//英语
				name: 'English',
				code: 'en',
				iso: 'en-US',
				language: 'en-US',
				// file: './locales/en.ts',
			},
			{
				//葡萄牙语
				name: 'Portuguese',
				code: 'pt',
				iso: 'pt-PT',
				language: 'pt-PT',
				// file: './locales/en.ts',
			},
			{
				//俄语
				name: 'Русский',
				code: 'ru',
				iso: 'ru-RU',
				language: 'ru-RU',
				// file: './locales/en.ts',
			},
			{
				//希腊语
				name: 'Ελληνικά',
				code: 'el',
				iso: 'el-GR',
				language: 'el-GR',
				// file: './locales/en.ts',
			},
			{
				//法语
				name: 'Français',
				code: 'fr',
				iso: 'fr-FR',
				language: 'fr-FR',
				// file: './locales/en.ts',
			},
			{
				//西班牙语
				name: 'Español',
				code: 'es',
				iso: 'es-ES',
				language: 'es-ES',
				// file: './locales/en.ts',
			},
			{
				//德语
				name: 'Deutsch',
				code: 'de',
				iso: 'de-DE',
				language: 'de-DE',
				// file: './locales/en.ts',
			},
			{
				//意大利语
				name: 'Italiano',
				code: 'it',
				iso: 'it-IT',
				language: 'it-IT',
				// file: './locales/en.ts',
			},
			{
				//波兰语
				name: 'Polski',
				code: 'pl',
				iso: 'pl-PL',
				language: 'pl-pl',
				// file: './locales/en.ts',
			},
			{
				//阿拉伯语
				name: 'العربية',
				code: 'ar',
				iso: 'ar-SA',
				language: 'ar-SA',
				// file: './locales/en.ts',
			},
			{
				//土耳其语
				name: 'Türkçe',
				code: 'tr',
				iso: 'tr-TR',
				language: 'tr-TR',
				// file: './locales/en.ts',
			},
			{
				//日语
				name: '日本語',
				code: 'jp',
				iso: 'jp-JP',
				language: 'jp-JP',
				// file: './locales/en.ts',
			},
			{
				//印尼语
				name: 'Bahasa Indonesia',
				code: 'id',
				iso: 'id-ID',
				language: 'id-ID',
				// file: './locales/en.ts',
			},
			{
				//瑞典语
				name: 'Svenska',
				code: 'sv',
				iso: 'sv-SE',
				language: 'sv-SE',
				// file: './locales/en.ts',
			},
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
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "@/assets/css/element.scss" as *;`,
				},
			},
		},
		server: {
			proxy: {
				'/api': {
					// target: 'https://api.iswink.com',
					// target: 'http://122.190.56.101:6060/shop-server',
					target: 'http://10.10.10.17:48080',
					changeOrigin: true,
					rewrite: path => path.replace('api', 'app-api'),
				},
			},
		},
	},
	// elementPlus: {
	// 	namespace: 'mi',
	// },
	runtimeConfig: {
		// public中的键也可以在客户端使用
		public: {
			baseURL: process.env.NODE_ENV === 'production' ? '/app-api' : '/api',
			tenantId: 1,
			currency: '$',
			domain: 'https://www.iswink.com',
			shortDomain: 'iswink',
			// kefuWsUrl: 'ws://localhost:48080/infra/ws'
			kefuWsUrl: 'ws://122.190.56.101:6060/infra/ws'
		},
	},
	nitro: {
		// devProxy: {
		// 	'/app-api': {
		// 		target: 'http://127.0.0.1:4523/m1/5098940-4761458-default',
		// 		changeOrigin: true,
		// 	},
		// },
		routeRules: {
			'/app-api**': {
				proxy: 'http://10.10.10.17:48080',
			},
		},
	},
})
