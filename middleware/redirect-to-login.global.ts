import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore()
	const localePath = useLocalePath()
	if (to.path.includes('user')) {
		if (to.meta.needLogin === false) {
			// 明确定义无需登录
		}
		else if (!userStore.$state.accessToken) {
			// 重定向到登录页
			return navigateTo(localePath('/login'))
		}
		else if (!userStore.$state.nickname) {
			await userStore.getInfo()
		}
	}
	else if (to.path.includes('login') && userStore.$state.accessToken) {
		return navigateTo(localePath('/'))
	}
})
