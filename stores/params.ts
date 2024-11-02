import { defineStore } from 'pinia'

export const useParamsStore = defineStore('ParamsStore', {
	state: () => {
		return {
			cartCount: 0,
		}
	},
	actions: {
		getCartCount() {
			const nuxtApp = useNuxtApp()
			return nuxtApp
				.$api<number>('trade/cart/get-count?apifoxApiId=218995480')
				.then((res: number) => {
					this.cartCount = res
				})
		},
		setCartCount(qty: number) {
			this.cartCount = qty
		},
	},
})
