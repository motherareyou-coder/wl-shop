import { defineStore } from 'pinia'
import type { AuthToken, UserInfo } from '~/types'

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			id: null,
			info: null as unknown as UserInfo,
			accessToken: '',
			refreshToken: '',
			// expiresTime: useLocalStorage('expires-time', ''),
			needAddCart: false,
		} as unknown as UserInfo
	},
	getters: {
		user(): UserInfo {
			return this.info || {}
		},
	},
	actions: {
		getInfo() {
			const nuxtApp = useNuxtApp()
			return (this.accessToken
				? nuxtApp
					.$api<UserInfo>('member/user/get')
				: Promise.reject(new Error('未登录')))
				.then((res: UserInfo) => {
					this.info = res
					this.id = res.id
					// 登陆时将临时购物车的数据通过接口加入购物车
					this.needAddCart && useCartStore().addToBackEnd()
					this.needAddCart = false
					return res
				})
				.catch(() => this.reset(false))
		},
		setToken({ accessToken, refreshToken, expiresTime }: AuthToken) {
			this.accessToken = accessToken
			this.refreshToken = refreshToken
			// this.expiresTime = expiresTime
			if (import.meta.client) {
				localStorage.setItem('access-token', accessToken)
				localStorage.setItem('refresh-token', refreshToken)
				// localStorage.setItem('expires-time', `${time}`)
			}
		},
		logout() {
			const nuxtApp = useNuxtApp()
			return nuxtApp
				.$api('member/auth/logout', { method: 'post' })
				.then(() => {
					this.reset()
				})
		},
		reset(b = true) {
			this.$reset()
			b && useCartStore().clearCart()
			this.accessToken = ''
			this.refreshToken = ''
			// this.expiresTime = ''
			if (import.meta.client) {
				localStorage.removeItem('access-token')
				localStorage.removeItem('refresh-token')
			// localStorage.removeItem('expires-time')
			}
		},
	},
	hydrate(state) {
		// 在这种情况下，我们可以完全忽略初始状态
		// 因为我们想从浏览器中读取数值。
		state.accessToken = useLocalStorage('access-token', '').value
		state.refreshToken = useLocalStorage('refresh-token', '').value
	},
	persist: {
		// 必须存到cookie，否则ssr模式下页面重新渲染时accessToken不存在会触发redirect
		pick: ['accessToken'],
		// storage: import.meta.client ? localStorage : undefined,
	},
})
