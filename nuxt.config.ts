// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
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
		'@nuxt/ui',
		'@nuxt/icon',
		'@element-plus/nuxt',
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
				file: './locales/zh.json',
			},
			{
				name: 'English',
				code: 'en',
				iso: 'en-US',
				language: 'en-US',
				file: './locales/en.json',
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
					target: 'http://127.0.0.1:4523/m1/5098940-4761458-default',
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
		public: {
			baseURL: '/api',
			// apifoxApiId: '211912811',
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
			'/app-api': {
				proxy: 'http://127.0.0.1:4523/m1/5098940-4761458-default',
			},
		},
	},
})
