// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },

	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no',
		},
	},
	modules: [
		'@nuxtjs/i18n',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'@nuxt/icon',
		'@element-plus/nuxt',
	],

	i18n: {
		defaultLocale: 'zh',
		vueI18n: './locales/i18n.config.ts',
		detectBrowserLanguage: {
			useCookie: false,
			alwaysRedirect: false,
		},
		locales: [{
			name: '简体中文',
			code: 'zh',
			iso: 'zh-CN',
			language: 'zh-CN',
			file: './locales/zh.json',
		}, {
			name: 'English',
			code: 'en',
			iso: 'en-US',
			language: 'en-US',
			file: './locales/en.json',
		}],
		strategy: 'prefix_except_default',
	},

	css: [
		'@/assets/css/index.scss',
	],

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
	// elementPlus: { /** Options */ }
})
