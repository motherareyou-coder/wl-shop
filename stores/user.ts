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
	expiresTime: string
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

const ONE_DAY = 24 * 3600 * 1000

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			nickname: '',
			avatar: '',
			accessToken: localStorage.getItem('access-token'),
			refreshToken: localStorage.getItem('refresh-token'),
			expiresTime: Number(localStorage.getItem('expires-time')),
		} as unknown as UserInfo
	},
	getters: {},
	actions: {
		getInfo() {
			const nuxtApp = useNuxtApp()
			return nuxtApp
				.$api<UserInfo>('member/user/get?apifoxApiId=221159725')
				.then((res: UserInfo) => {
					if (localStorage.getItem('access-token'))
						this.$patch(res)
					return res
				})
		},
		setToken({ accessToken, refreshToken, expiresTime }: AuthToken) {
			let time = new Date(expiresTime).getTime()
			const onedayafter = new Date().getTime() + ONE_DAY
			if (time < onedayafter) {
				time = onedayafter
			}
			this.accessToken = accessToken
			this.refreshToken = refreshToken
			this.expiresTime = time
			localStorage.setItem('access-token', accessToken)
			localStorage.setItem('refresh-token', refreshToken)
			localStorage.setItem('expires-time', `${time}`)
		},
		logout() {
			this.$reset()
			localStorage.removeItem('access-token')
			localStorage.removeItem('refresh-token')
			localStorage.removeItem('expires-time')
		},
	},
})
