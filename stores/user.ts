import { defineStore } from 'pinia'

export const useStore = defineStore('UserStore', {
	state: () => {
		return {
			username: 'test',
		}
	},
})
