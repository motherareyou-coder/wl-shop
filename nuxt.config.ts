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
	],
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
				name: 'English',
				code: 'en',
				iso: 'en-US',
				language: 'en-US',
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
					// target: 'http://127.0.0.1:4523/m1/5098940-4761458-default',
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
			shortDomain: 'iswink'
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
