export function $api(...args: any[]) {
	const nuxtApp = useNuxtApp()
	return nuxtApp.$api(...args)
}
