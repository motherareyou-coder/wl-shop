export function $t(...args: any[]) {
	const { t } = useI18n()
	return t(...args)
}
