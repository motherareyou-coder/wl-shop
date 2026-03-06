import type { Country } from '~/types'
import { defineStore } from 'pinia'

interface Options {
	label: any
	value: any
}

export const useParamsStore = defineStore('ParamsStore', {
	state: () => {
		return {
			countries: [] as unknown as (Country & Options)[],
		}
	},
	actions: {
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
								value: d.id,
							})),
						)
					}
				})
				.catch(() => {
					this.countries.length = 0
				})
		},
	},
	persist: {
		storage: import.meta.client ? localStorage : undefined,
	},
})
