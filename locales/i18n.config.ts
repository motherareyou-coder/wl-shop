import en from './en'
import zh from './zh'
import pt from './pt'
import ru from './ru'
import el from './el'
import fr from './fr'
import es from './es'
import de from './de'
import it from './it'
import pl from './pl'
import ar from './ar'
import tr from './tr'
import ja from './ja'
import id from './id'
import sv from './sv'

export default defineI18nConfig(() => ({
	legacy: false,
	// locale: 'zh',
	locale: 'en',
	messages: {
		en
	}
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
