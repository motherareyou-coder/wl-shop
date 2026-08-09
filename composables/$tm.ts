export function $tm(...args: any[]) {
	const { tm } = useI18n()
	return tm(...args)
}
