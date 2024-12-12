import { remove } from 'lodash-es'
import { defineStore } from 'pinia'
import type { CartItem, ProductDetail, SKU } from '~/types'

const getCartListFromLocalStorage = () => useLocalStorage('cart-list', []) as unknown as CartItem[]

export const useCartStore = defineStore('CartStore', {
	state: () => {
		return {
			validList: getCartListFromLocalStorage(),
			invalidList: [] as CartItem[],
		}
	},
	getters: {
		cartCount(state) {
			return state.validList.length
		},
	},
	actions: {
		clearCart() {
			this.validList = []
			this.invalidList = []
		},
		addToBackEnd() {
			Promise.all(
				this.validList.map((c) => {
					const skuId = c.sku?.id || c.skuId
					return skuId
						? $api('trade/cart/add', {
							method: 'post',
							body: { count: c.count || 1, skuId },
						})
						: Promise.resolve()
				}),
			).finally(this.getCartList)
		},
		getCartList() {
			if (useUserStore().nickname) {
				return $api('trade/cart/list').then((res) => {
					this.validList = (res?.validList || []) as CartItem[]
					this.invalidList = (res?.invalidList || []) as CartItem[]
					this.invalidList.forEach((d) => {
						d.disabled = true
						d.selected = false
					})
					this.setItem()
				})
			}
			else {
				this.validList = getCartListFromLocalStorage()
				this.invalidList = []
				this.setItem()
				return Promise.resolve()
			}
		},
		addCart(info: ProductDetail, sku: SKU, count: number) {
			if (useUserStore().nickname) {
				return $api('trade/cart/add', {
					method: 'post',
					body: { count, skuId: sku?.id },
				}).then(this.getCartList)
			}
			else {
				this.validList.unshift({
					id: info.id,
					selected: true,
					count,
					sku: sku || { id: info.skuId },
					spu: {
						id: info.id,
						name: info.name,
						picUrl: info.picUrl,
						categoryId: info.categoryId,
					},

				})
				this.setItem()
				return Promise.resolve()
			}
		},
		removeCart(ids: number[]) {
			if (useUserStore().nickname) {
				return $api('trade/cart/delete', {
					method: 'delete',
					params: { ids },
				}).then(this.getCartList)
			}
			else {
				remove(this.validList, d => ids.includes(d.id))
				this.setItem()
				return Promise.resolve()
			}
		},
		updateCartCount({ id, count }: { id: number, count: number }) {
			if (useUserStore().nickname) {
				return $api('trade/cart/update-count', {
					method: 'put',
					body: { id, count },
				}).then(() => {
					this.validList.forEach((c) => {
						if (c.id === id)
							c.count = count
					})
					this.setItem()
				})
			}
			else {
				this.validList.forEach((c) => {
					if (c.id === id)
						c.count = count
				})
				this.setItem()
				return Promise.resolve()
			}
		},
		updateSelected({ ids, selected }: { ids: number[], selected: boolean }) {
			if (useUserStore().nickname) {
				return $api('trade/cart/update-selected', {
					method: 'put',
					body: { ids, selected },
				}).then(() => {
					this.validList.forEach((d) => {
						if (ids.includes(d.id))
							d.selected = selected
					})
					this.setItem()
				})
			}
			else {
				this.validList.forEach((c) => {
					if (ids.includes(c.id))
						c.selected = selected
				})
				this.setItem()
				return Promise.resolve()
			}
		},
		setItem() {
			localStorage.setItem('cart-list', JSON.stringify(this.validList))
		},
	},
})
