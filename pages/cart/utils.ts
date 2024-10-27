import { pick } from 'lodash-es'
import type { CartItem, Coupon, OrderSettlement } from '~/types'

export function useCheckOut(
	productList: Ref<CartItem[] | null | undefined>,
	coupon: Ref<Coupon | null | undefined>,
) {
	const info = ref<OrderSettlement>()

	const items = computed(() =>
		(productList.value || []).map(d => ({
			skuId: d.sku.id,
			count: d.count,
			productId: d.id,
			productPrice: d.sku.price,
			categoryId: d.spu.categoryId,
		})),
	)
	function getInfo() {
		console.log('getInfo', productList.value)
		if (productList.value?.length) {
			$api('trade/order/settlement?apifoxApiId=219151428', {
				params: {
					items: items.value,
					couponId: coupon.value?.id,
				},
			}).then((res) => {
				info.value = res
			})
		}
		else {
			info.value = null
		}
	}
	watch(items, getInfo, { immediate: true, deep: true })
	watch(coupon, getInfo, { immediate: true, deep: true })

	return {
		info,
		getInfo,
		items,
	}
}
