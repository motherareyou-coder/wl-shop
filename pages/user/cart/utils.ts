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
			productId: d.id,
			productPrice: d.sku?.price || d.price,
			categoryId: d.spu?.categoryId,
		})),
	)
	function getInfo() {
		console.log('getInfo', productList.value)
		if (productList.value?.length) {
			$api('trade/order/settlement', {
				params: {
					items: items.value,
					couponId: coupon.value?.id,
					pointStatus: data?.value?.pointStatus || false,
					deliveryType: data?.value?.deliveryType || 1,
					addressId: data?.value?.addressId,
				},
			}).then((res) => {
				info.value = res
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
