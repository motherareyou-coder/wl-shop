import en from './en'
import zh from './zh'

export default defineI18nConfig(() => ({
	legacy: false,
	locale: 'zh',
	messages: {
		en,
		zh,
	},
}))
