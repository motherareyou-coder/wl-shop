import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore()
	const localePath = useLocalePath()
	if (to.path.includes('user')) {
		if (!userStore.$state.nickname) {
			await userStore.getInfo()
		}
		console.log(userStore.$state.nickname)
		// 重定向到登录页
		if (!userStore.$state.nickname)
			return navigateTo(localePath('/login'))
	}
	else if (to.path.includes('login') && userStore.$state.nickname) {
		return navigateTo('/')
	}
})
