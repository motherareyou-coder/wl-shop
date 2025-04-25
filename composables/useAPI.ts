import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
	url: string | (() => string),
	options?: UseFetchOptions<T>,
) {
	const nuxtApp = useNuxtApp()
	return useFetch(url, {
		...options,
		server: true, // 确保ssr在服务器端获取数据 !nuxtApp.payload.serverRendered,
		$fetch: nuxtApp.$api,
	})
}
