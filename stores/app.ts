import { defineStore } from 'pinia'

export const useAppStore = defineStore('AppStore', {
	state: () => {
		return {
			isPC: false,
			isMobile: false,
			bodyWidth: 0,
		}
	},
	getters: {
		deviceType(state) {
			return state.isPC ? 'pc' : state.isMobile ? 'mobile' : ''
		},
	},
	actions: {
		listen() {
			const onResize = () => {
				this.bodyWidth = document?.body?.clientWidth
				if (document?.body?.clientWidth <= 720) {
					this.isPC = false
					this.isMobile = true
				}
				else {
					this.isPC = true
					this.isMobile = false
				}
			}
			onResize()
			if (import.meta.client)
				window?.addEventListener('resize', onResize)
		},
	},
})
