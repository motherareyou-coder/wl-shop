import { defineStore } from 'pinia'
import type { UserInfo } from '~/types'

export interface AuthToken {
	/**
	 * 访问令牌
	 */
	accessToken: string
	/**
	 * 过期时间
	 */
	expiresTime: Date
	/**
	 * 社交用户 openid
	 */
	openid?: string
	/**
	 * 刷新令牌
	 */
	refreshToken: string
	/**
	 * 用户编号
	 */
	userId: number
	[property: string]: any
}

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			nickname: '',
			avatar: '',
		} as UserInfo
	},
	getters: {},
	actions: {
		getInfo() {
			const nuxtApp = useNuxtApp()
			return nuxtApp
				.$api<UserInfo>('member/user/get?apifoxApiId=221159725')
				.then((res: UserInfo) => {
					if (

						localStorage.getItem('access-token')
					)
						this.$patch(res)
					return res
				})
		},
		setToken({ accessToken, refreshToken }: AuthToken) {
			localStorage.setItem('access-token', accessToken)
			localStorage.setItem('refresh-token', refreshToken)
		},
		logout() {
			this.$reset()
			localStorage.removeItem('access-token')
			localStorage.removeItem('refresh-token')
		},
	},
})
