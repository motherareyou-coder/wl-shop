import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
	url: string | (() => string),
	options?: UseFetchOptions<T>,
) {
	const nuxtApp = useNuxtApp()
	return useFetch(url, {
		...options,
		server: !nuxtApp.payload.serverRendered,
		$fetch: nuxtApp.$api,
	})
}
