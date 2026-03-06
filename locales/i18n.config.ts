import en from './en'

export default defineI18nConfig(() => ({
	legacy: false,
	// locale: 'zh',
	locale: 'en',
	messages: {
		en,
	},
	// messages: {
	// 	en,
	// 	zh,
	// 	pt,
	// 	ru,
	// 	el,
	// 	fr,
	// 	es,
	// 	de,
	// 	it,
	// 	pl,
	// 	ar,
	// 	tr,
	// 	ja,
	// 	id,
	// 	sv,
	// },
}))
