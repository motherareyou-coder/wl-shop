import { defineStore } from 'pinia'
import type { Country } from '~/types'

interface Options {
	label: any
	value: any
}

export const useParamsStore = defineStore('ParamsStore', {
	state: () => {
		return {
			cartCount: 0,
			countries: [] as unknown as (Country & Options)[],
		}
	},
	actions: {
		getCartCount() {
			const nuxtApp = useNuxtApp()
			return nuxtApp
				.$api<number>('trade/cart/get-count')
				.then((res: number) => {
					this.cartCount = res
				})
				.catch(() => {
					this.cartCount = 0
				})
		},
		setCartCount(qty: number) {
			this.cartCount = qty
		},
		getCountries() {
			if (this.countries.length)
				return this.countries
			const nuxtApp = useNuxtApp()
			return nuxtApp
				.$api<Country[]>('system/area/getAreaCountry')
				.then((res: Country[]) => {
					this.countries.length = 0
					if (res.length) {
						this.countries.push(
							...res.map(d => ({
								...d,
								label: d.name,
								value: `${d.id}`,
							})),
						)
					}
				})
				.catch(() => {
					this.countries.length = 0
				})
		},
	},
})
