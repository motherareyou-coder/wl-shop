export function $path(...args: any[]) {
	const localePath = useLocalePath()
	return localePath(...args)
}
