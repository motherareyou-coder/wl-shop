import { defineStore } from 'pinia'
import type { AuthToken, UserInfo } from '~/types'

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			id: null,
			nickname: '',
			avatar: '',
			accessToken: useLocalStorage('access-token', ''),
			refreshToken: useLocalStorage('refresh-token', ''),
			// expiresTime: useLocalStorage('expires-time', ''),
			needAddCart: false,
		} as unknown as UserInfo
	},
	getters: {},
	actions: {
		getInfo() {
			const nuxtApp = useNuxtApp()
			return (this.accessToken
				? nuxtApp
					.$api<UserInfo>('member/user/get')
				: Promise.reject(new Error('未登录')))
				.then((res: UserInfo) => {
					if (localStorage.getItem('access-token'))
						this.$patch(res)
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
			localStorage.setItem('access-token', accessToken)
			localStorage.setItem('refresh-token', refreshToken)
			// localStorage.setItem('expires-time', `${time}`)
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
			localStorage.removeItem('access-token')
			localStorage.removeItem('refresh-token')
			// localStorage.removeItem('expires-time')
		},
	},
	persist: {
		storage: import.meta.client ? localStorage : undefined,
	},
})
