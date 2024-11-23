export default defineNuxtPlugin(() => {
	// const { session } = useUserSession()
	const { baseURL, tenantId } = useRuntimeConfig().public
	const userStore = useUserStore()
	const nuxtApp = useNuxtApp()

	const api = $fetch.create({
		baseURL,
		onRequest({ request, options, error }) {
			options.params = options.params || {}
			Object.entries(options.params).forEach(([k, v]) => {
				if (v === '' || v === null || v === undefined)
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
		onResponse({ request: url, options, response }) {
			const { code, data, msg } = response._data
			if (code === 0) {
				response._data = data
				if ((url as string)?.includes?.('member/auth/refresh-token'))
					return response
			}
			else if (code === 401) {
				// eslint-disable-next-line ts/no-use-before-define
				const p = refreshToken(url, options)
				console.log(url, p)

				return p
			}
			else {
				ElMessage.error(msg)
				return Promise.reject(response._data)
			}
		},
		onResponseError({ response }) {
			ElMessage.error(
				response._data?.data?.msg || response.statusText,
			)
		},
	})

	const handleAuthorized = () => {
		console.log(userStore.nickname)
		userStore.nickname && userStore.logout()
		// 登录超时
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject({ code: 401, msg: userStore.nickname ? nuxtApp.$i18n.t('Your login has expired') : nuxtApp.$i18n.t('Please sign in first') })
	}

	// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
	let requestList: (() => void)[] = [] // 请求队列
	let isRefreshToken = false // 是否正在刷新中
	const refreshToken = async (url: string, config: any): Promise<any> => {
		const refreshToken = localStorage.getItem('refresh-token')
		// 如果当前已经是 refresh-token 的 URL 地址，并且还是 401 错误，说明是刷新令牌失败了，直接返回 Promise.reject(error)
		if (url.includes('member/auth/refresh-token')) {
			return Promise.reject(new Error('error'))
		}

		// 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
		if (!isRefreshToken) {
			// 1. 如果获取不到刷新令牌，则只能执行登出操作
			if (!refreshToken) {
				return handleAuthorized()
			}
			isRefreshToken = true
			// 2. 进行刷新访问令牌
			try {
				const refreshTokenResult: AuthToken = await api('member/auth/refresh-token', {
					method: 'post',
					params: { refreshToken },
				})
				if (!refreshTokenResult?.accessToken) {
					// 如果刷新不成功，直接抛出 e 触发 2.2 的逻辑
					// noinspection ExceptionCaughtLocallyJS
					throw new Error('刷新令牌失败')
				}
				userStore.setToken(refreshTokenResult)
				// 2.1 刷新成功，则回放队列的请求 + 当前请求
				config.headers.set('Authorization', `${userStore.accessToken}`)
				requestList.forEach((cb) => {
					cb()
				})
				requestList = []
				return api(url, config)
			}
			catch (e) {
				// 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
				// 2.2 刷新失败，只回放队列的请求
				requestList.forEach((cb) => {
					cb()
				})
				// 提示是否要登出。即不回放当前请求！不然会形成递归
				return handleAuthorized()
			}
			finally {
				requestList = []
				isRefreshToken = false
			}
		}
		else {
			// 添加到队列，等待刷新获取到新的令牌
			return new Promise((resolve) => {
				requestList.push(() => {
					config.headers.set('Authorization', `${userStore.accessToken}`) // 让每个请求携带自定义token 请根据实际情况自行修改
					resolve(api(url, config))
				})
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
