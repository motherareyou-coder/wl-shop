import { defineStore } from 'pinia'
import type { Category } from '~/types'

export const useAppStore = defineStore('AppStore', {
	state: () => {
		return {
			isPC: true,
			isMobile: false,
			bodyWidth: 0,
		}
	},
	getters: {
		deviceType(state) {
			return state.isPC ? 'pc' : 'mobile'
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

			window?.addEventListener('resize', onResize)
		},
	},
})
