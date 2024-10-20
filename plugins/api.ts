export default defineNuxtPlugin((nuxtApp) => {
	// const { session } = useUserSession()
	const { baseURL, apifoxApiId } = useRuntimeConfig().public

	const api = $fetch.create({
		baseURL,
		onRequest({ request, options, error }) {
			if (!options.params)
				options.params = {}
			// options.params.apifoxApiId = apifoxApiId
			// if (session.value?.token) {
			// note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
			// options.headers.set('Authorization', `Bearer ${session.value?.token}`)
			// }
		},
		onResponse({ response }) {
			if (response._data?.data)
				response._data = response._data?.data
		},
		async onResponseError({ response }) {
			// if (response.status === 401) {
			// 	await nuxtApp.runWithContext(() => navigateTo('/login'))
			// }
		},
	})

	// Expose to useNuxtApp().$api
	return {
		provide: {
			api,
		},
	}
})
