import { defineStore } from 'pinia'

export const useAppStore = defineStore('AppStore', {
	state: () => {
		return {
			isPC: true,
			isMobile: false,
		}
	},
	getters: {
		deviceType(state) {
			return state.isPC ? 'pc' : 'mobile'
		},
	},
	actions: {
		listen() {
			console.log(window)
			const onResize = () => {
				if (document?.body?.clientWidth < 720) {
					this.isPC = false
					this.isMobile = true
				}
				else {
					this.isPC = true
					this.isMobile = false
				}
			}
			onResize()

			window?.addEventListener('resize', onResize)
		},
	},
})
