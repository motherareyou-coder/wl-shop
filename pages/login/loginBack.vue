<script setup lang="ts">
import type { AuthToken } from '~/types'

defineOptions({ name: 'LoginBack' })

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
	// 获取路由参数中的token
	const accessToken = route.query.accessToken as string
	const refreshToken = route.query.refreshToken as string
	// const redirectUri = route.query.redirectUri as string;

	if (accessToken) {
		const authToken = {
			accessToken,
			refreshToken,
		} as AuthToken
		// 将token存储到store中
		userStore.needAddCart = true
		userStore.setToken(authToken)
		await userStore.getInfo()
		// 跳转到登录后的页面
		// router.push(redirectUri);
		// 确保状态更新后跳转
		nextTick(() => {
			router.push({
				path: route.query.redirectUri as string,
				query: { _t: Date.now() }, // 可选：防止缓存
			})
		})
	}
	else {
		// 如果没有token，可以重定向到登录页面或其他页面
		router.push('/login')
	}
})
</script>

<template>
	<!-- ... existing code ... -->
</template>

<style scoped>
/* ... existing code ... */
</style>
