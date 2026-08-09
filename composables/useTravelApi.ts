/**
 * 旅行陪侍服务 - API 封装
 * 对齐后台 yudao-module-travel 的 App Controller 接口
 */

/* 旅行诉求 */
export function useTravelInquiryApi() {
	const myList = () => $api<any>('travel/inquiry/my-list', { method: 'get' })
	const get = (id: number) => $api<any>('travel/inquiry/get', { method: 'get', params: { id } })
	return { myList, get }
}

/* 随行诉求 */
export function useEscortInquiryApi() {
	const myPage = (params: any) => $api<any>('travel/escort-inquiry/my-page', { method: 'get', params })
	const get = (id: number) => $api<any>('travel/escort-inquiry/get', { method: 'get', params: { id } })
	return { myPage, get }
}

/* 预订单 */
export function usePreOrderApi() {
	const myPage = (params: any) => $api<any>('travel/pre-order/my-page', { method: 'get', params })
	const get = (id: number) => $api<any>('travel/pre-order/get', { method: 'get', params: { id } })
	const confirm = (data: any) => $api('travel/pre-order/confirm', { method: 'put', body: data })
	const cancel = (id: number) => $api('travel/pre-order/cancel', { method: 'put', params: { id } })
	return { myPage, get, confirm, cancel }
}

/* 订单 */
export function useTravelOrderApi() {
	const myPage = (params: any) => $api<any>('travel/order/my-page', { method: 'get', params })
	const get = (id: number) => $api<any>('travel/order/get', { method: 'get', params: { id } })
	const confirmRemaining = (orderLineId: number, proof?: string) => $api('travel/order/confirm-remaining', { method: 'put', params: { orderLineId, proof } })
	const cancel = (id: number) => $api('travel/order/cancel', { method: 'put', params: { id } })
	return { myPage, get, confirmRemaining, cancel }
}

/* 支付 */
export function useTravelPaymentApi() {
	const create = (preOrderLineId: number) => $api<any>('travel/payment/create', { method: 'post', body: { preOrderLineId } })
	return { create }
}

/* 沟通记录 */
export function useCommunicationLogApi() {
	const listByPreOrder = (preOrderId: number) => $api<any[]>('travel/communication-log/list-by-pre-order', { method: 'get', params: { preOrderId } })
	return { listByPreOrder }
}
