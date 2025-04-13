import {remove} from 'lodash-es'
import {defineStore} from 'pinia'
import type {CartItem, ProductDetail, SKU} from '~/types'

export const useCartStore = defineStore('CartStore', {
    state: () => {
        return {
            validList: [] as CartItem[],
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
                            body: {count: c.count || 1, skuId},
                        })
                        : Promise.resolve()
                }),
            ).finally(this.getCartList)
        },
        getCartList() {
            if (useUserStore().id) {
                return $api('trade/cart/list').then((res) => {
                    this.validList = (res?.validList || []) as CartItem[]
                    this.invalidList = (res?.invalidList || []) as CartItem[]
                    this.invalidList.forEach((d) => {
                        d.disabled = true
                        d.selected = false
                    })
                })
            } else {
                this.invalidList = []
                return Promise.resolve()
            }
        },
        addCart(info: ProductDetail, sku: SKU, count: number) {
            if (useUserStore().id) {
                return $api('trade/cart/add', {
                    method: 'post',
                    body: {count, skuId: sku?.id},
                }).then(this.getCartList)
            } else {
                const existingItem = this.validList.find(item => item.id === info.id);
                if (existingItem) {
                    // 存在时累加数量
                    existingItem.count += count;
                } else {
                    this.validList.unshift({
                        id: info.id,
                        selected: true,
                        count,
                        sku: sku || {id: info.skuId},
                        spu: {
                            id: info.id,
                            name: info.name,
                            picUrl: info.picUrl,
                            categoryId: info.categoryId,
                        },

                    });
                }
                return Promise.resolve()
            }
        },
        removeCart(ids: number[]) {
            if (useUserStore().id) {
                return $api('trade/cart/delete', {
                    method: 'delete',
                    params: {ids},
                }).then(this.getCartList)
            } else {
                remove(this.validList, d => ids.includes(d.id))
                return Promise.resolve()
            }
        },
        updateCartCount({id, count}: { id: number, count: number }) {
            if (useUserStore().id) {
                return $api('trade/cart/update-count', {
                    method: 'put',
                    body: {id, count},
                }).then(() => {
                    this.validList.forEach((c) => {
                        if (c.id === id)
                            c.count = count
                    })
                })
            } else {
                this.validList.forEach((c) => {
                    if (c.id === id)
                        c.count = count
                })
                return Promise.resolve()
            }
        },
        updateSelected({ids, selected}: { ids: number[], selected: boolean }) {
            if (useUserStore().id) {
                return $api('trade/cart/update-selected', {
                    method: 'put',
                    body: {ids, selected},
                }).then(() => {
                    this.validList.forEach((d) => {
                        if (ids.includes(d.id))
                            d.selected = selected
                    })
                })
            } else {
                this.validList.forEach((c) => {
                    if (ids.includes(c.id))
                        c.selected = selected
                })
                return Promise.resolve()
            }
        },
    },
    persist: {
        storage: import.meta.client ? localStorage : undefined,
    },
})
