// 0.待支付 10.待发货 20.已发货 30.已完成 40.已取消

import type { OrderDetail } from '~/types'

export const statusOptions = [
	{ value: -1, label: 'All Order' },
	{ value: 0, label: '待付款' },
	{ value: 1, label: '待发货' },
	{ value: 2, label: '已发货' },
	{ value: 3, label: '待评价' },
	{ value: 4, label: '已完成' },
	{ value: 5, label: '已关闭' },
]

export function getQueryFromStatusType(type: number) {
	return {
		0: { status: 0 },
		1: { status: 10 },
		2: { status: 20 },
		3: { status: 30, commentStatus: false },
		4: { status: 30, commentStatus: true },
		5: { status: 40 },
	}[type] || {}
}

export function getStatusText(order: OrderDetail) {
	if (order.status === 30) {
		return order.commentStatus ? '已完成' : '待评价'
	}
	return {
		0: '待付款',
		10: '待发货',
		20: '已发货',
		40: '已关闭',
	}[order.status] || ''
}

export const statusClass = {
	0: 'paying',
	10: 'waiting',
	20: 'ship',
	30: 'delivered',
	40: 'close',
}
