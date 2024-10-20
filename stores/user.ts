import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
	state: () => {
		return {
			username: 'test',
			avatar: '/imgs/5.png',
		}
	},
})
