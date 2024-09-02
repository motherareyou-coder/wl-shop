import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
	if (to.matched.length === 0) {
		// 404自动重定向到首页
		return navigateTo('/')
	}
})
