// 0.待支付 10.待发货 20.已发货 30.已完成 40.已取消

export const statusOptions = [
	{ value: '', label: 'All Order' },
	{ value: 0, label: 'Awaiting payment' },
	{ value: 10, label: 'Awaiting ship' },
	{ value: 20, label: 'Shipping' },
	{ value: 30, label: 'Done' },
	{ value: 40, label: 'Cancel' },
]

export const statusText = statusOptions.reduce((o, c) => {
	o[c.value] = c.label
	return o
}, {} as Record<number | string, string>)
