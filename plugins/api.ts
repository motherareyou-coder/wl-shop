let reconnectattempts = 0

export default defineNuxtPlugin(() => {
	// const { session } = useUserSession()
	const token = localStorage.getItem('access-token')
	const { baseURL, apifoxApiId } = useRuntimeConfig().public
	const nuxtApp = useNuxtApp()
	const userStore = useUserStore()

	const api = $fetch.create({
		baseURL,
		onRequest({ request, options, error }) {
			options.params = options.params || {}
			Object.entries(options.params).forEach(([k, v]) => {
				if (v === '' || v === null)
					delete options.params![k]
			})
			// options.params.apifoxApiId = apifoxApiId
			if (token) {
				options.headers = new Headers(options.headers)
				// note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
				options.headers.set('Authorization', `Bearer ${token}`)
			}
		},
		onResponse({ response }) {
			reconnectattempts = 0
			if (response._data?.data)
				response._data = response._data?.data
		},
		async onResponseError({ request, response }) {
			if (response.status === 401) {
				const refreshToken = localStorage.getItem('refresh-token')
				if (refreshToken) {
					if (reconnectattempts > 5) {
						await nuxtApp.runWithContext(() => navigateTo('/login'))
						return
					}
					const res: AuthToken = await api(
						'member/auth/refresh-token?apifoxApiId=221136003',
						{ method: 'post', params: { refreshToken } },
					)
					userStore.setToken(res)
					await userStore.getInfo()
					reconnectattempts++
					// 重发
					await api(request)
				}
				else {
					await nuxtApp.runWithContext(() => navigateTo('/login'))
				}
			}
			else {
				ElMessage.error(
					response._data?.data?.msg || response.statusText,
				)
			}
		},
	})

	// Expose to useNuxtApp().$api
	return {
		provide: {
			api,
		},
	}
})
