export default defineNuxtPlugin(() => {
	// const { session } = useUserSession()
	const { baseURL, tenantId } = useRuntimeConfig().public
	const nuxtApp = useNuxtApp()
	const userStore = useUserStore()
	const localePath = useLocalePath()

	const api = $fetch.create({
		baseURL,
		onRequest({ request, options, error }) {
			options.params = options.params || {}
			Object.entries(options.params).forEach(([k, v]) => {
				if (v === '' || v === null)
					delete options.params![k]
			})
			options.headers = new Headers(options.headers)
			// 租户不论是否登陆，都需要传入
			options.headers.set('tenant-id', `${tenantId}`)
			const token = userStore.accessToken
			if (token) {
				options.headers.set('Authorization', `${token}`)
			}
		},
		onResponse({ response }) {
			const { code, data, msg } = response._data
			if (code === 0) {
				response._data = data
				refreshToken()
			}
			else if (code === 401) {
				if (userStore.accessToken) {
					ElMessage.error(msg)
					nuxtApp.runWithContext(() =>
						navigateTo(localePath('/login')),
					)
				}
				else {
					return Promise.reject(msg)
					// throw new Error(msg)
				}
			}
			else {
				ElMessage.error(msg)
				return Promise.reject(msg)
			}
		},
		onResponseError({ request, response }) {
			if (response.status === 401) {
				nuxtApp.runWithContext(() => navigateTo(localePath('/login')))
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
			api('member/auth/refresh-token', {
				method: 'post',
				params: { refreshToken },
			})
				.then((res) => {
					userStore.setToken(res as AuthToken)
				})
				.finally(() => {
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
