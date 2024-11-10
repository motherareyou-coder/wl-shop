export function $api<T>(...args: any[]) {
	const nuxtApp = useNuxtApp()
	return nuxtApp.$api<T>(...args)
}
