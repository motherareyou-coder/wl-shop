export default defineNuxtPlugin(() => {
	// const { session } = useUserSession()
	const token = localStorage.getItem('access-token')
	const { baseURL, tenantId } = useRuntimeConfig().public
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
			if (token) {
				options.headers = new Headers(options.headers)
				// note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
				options.headers.set('Authorization', `Bearer ${token}`)
				options.headers.set('tenant-id', `${tenantId}`)
			}
		},
		onResponse({ response }) {
			if (response._data?.data)
				response._data = response._data?.data
			refreshToken()
		},
		async onResponseError({ request, response }) {
			if (response.status === 401) {
				await nuxtApp.runWithContext(() => navigateTo('/login'))
			}
			else {
				ElMessage.error(
					response._data?.data?.msg || response.statusText,
				)
			}
		},
	})

	let refreshing = false
	function refreshToken() {
		if (refreshing)
			return
		const { refreshToken, expiresTime } = userStore.$state
		if (expiresTime > new Date().getTime() + 3600 * 1000)
			return
		if (refreshToken) {
			refreshing = true
			api(
				'member/auth/refresh-token?apifoxApiId=221136003',
				{ method: 'post', params: { refreshToken } },
			).then((res) => {
				userStore.setToken(res as AuthToken)
			}).finally(() => {
				refreshing = false
			})
		}
	}

	// Expose to useNuxtApp().$api
	return {
		provide: {
			api,
		},
	}
})
