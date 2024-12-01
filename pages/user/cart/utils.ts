import type { CartItem, Coupon, OrderSettlement } from '~/types'

export function useCheckOut(
	productList: Ref<CartItem[] | null | undefined>,
	coupon: Ref<Coupon | null | undefined>,
	data?: any,
) {
	const info = ref<OrderSettlement>()

	const items = computed(() =>
		(productList.value || []).map(d => ({
			skuId: d.sku?.id || d.skuId,
			count: d.count,
			// productId: d.id,
			cartId: d.id,
			productPrice: d.sku?.price || d.price,
			categoryId: d.spu?.categoryId || d.categoryId,
		})),
	)
	function getInfo(obj = {}) {
		console.log('getInfo', productList.value)
		if (productList.value?.length) {
			const params = {
				couponId: coupon.value?.id,
				pointStatus: data?.value?.pointStatus || false,
				deliveryType: data?.value?.deliveryType || 1,
				addressId: data?.value?.addressId,
				...obj,
			}
			items.value.forEach((item, i) => {
				Object.entries(item).forEach(([k, v]) => {
					params[`items[${i}].${k}`] = v
				})
			})
			$api('trade/order/settlement', {
				params,
			}).then((res) => {
				info.value = res
			}).catch((res) => {
				if (res.code == 1011003006)
					coupon.value = null
			})
			console.log(productList.value)
			const spuIds = productList.value.map((d) => {
				d.skuId = d.sku?.id || d.skuId
				d.spuId = d.spu?.id || d.spuId || d.id
				return d.spuId
			})
			$api('trade/order/settlement-product', { params: { spuIds } }).then((res) => {
				productList.value?.forEach((d) => {
					res.forEach((dd) => {
						if (dd.spuId == d.spuId) {
							dd.skus.forEach((sku) => {
								if (sku.id === d.skuId) {
									d.price = sku.promotionPrice
								}
							})
						}
					})
				})
			})
		}
		else {
			info.value = null
		}
	}

	return {
		info,
		getInfo,
		items,
	}
}
