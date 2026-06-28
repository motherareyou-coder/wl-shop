/**
 * 服务端插件：SSR 阶段通过请求头 user-agent 判断设备类型
 *
 * 目的：消除 hydration mismatch
 * 原问题：appStore 初始 isPC=false/isMobile=false，SSR 输出基于 false，
 *         客户端 ready.client.ts 才改成真实值 → SSR HTML ≠ 客户端 DOM → mismatch
 *         → Vue 丢弃 SSR DOM 重渲染 → CSS 闪失 → 页面像裸 HTML
 *
 * 修复：SSR 阶段就用 user-agent 判断设备，让 SSR 输出与客户端首次渲染一致
 */
export default defineNuxtPlugin(() => {
	// 仅服务端执行
	if (import.meta.server) {
		const headers = useRequestHeaders(['user-agent'])
		const ua = headers['user-agent']?.toLowerCase() || ''

		// 移动端 UA 特征（覆盖 iOS/Android/平板）
		const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)

		const appStore = useAppStore()
		// SSR 阶段设置设备状态，使 SSR 输出与客户端 onNuxtReady 后一致
		appStore.isPC = !isMobileUA
		appStore.isMobile = isMobileUA
		appStore.bodyWidth = isMobileUA ? 375 : 1440
	}
})
