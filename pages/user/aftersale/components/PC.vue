<script setup lang="ts">
import type { AfterSale } from '~/types'
import './PC.scss'

const { t } = useI18n()
const { data, pagination, getData } = useTablePagination<AfterSale>((p = {}) =>
	$api('trade/after-sale/page', {
		params: { ...p, status: status.value, needLogin: true },
	}),
)

const wayText = {
	10: t('Refund only'),
	20: t('Return and refund'),
}

// 售后取消按钮展示
function cancelBtnShow(item: AfterSale) {
	// 10、20、30 可以取消
	// 10.退款申请待商家处理
	// 20.请退货并填写物流信息
	// 30.退货退款申请待商家处理
	if ([10, 20, 30].includes(item.status)) {
		return true
	}
	else {
		return false
	}
}
function formatAfterStatusDescription(item: AfterSale) {
	// 10.退款申请待商家处理
	if (item.status === 10) {
		return t('Refund requests are pending with the merchant')
	}
	// 20.请退货并填写物流信息
	if (item.status === 20) {
		return t('Please return the goods and fill in the logistics information')
	}
	// 30.退货退款申请待商家处理
	if (item.status === 30) {
		return t('Return refund application to be processed by the merchant')
	}
	// 40.等待退款
	if (item.status === 40) {
		return t('Wait for refund')
	}
	// 50.退款成功
	if (item.status === 50) {
		return t('Refund successful')
	}
	// 61.退款关闭
	if (item.status === 61) {
		return t('Refund close')
	}
	// 62.商家不同意退款申请，拒绝原因
	if (item.status === 62) {
		return t('Merchant does not agree to refund application, refused reason:') + item.auditReason
	}
	// 63.商家拒绝收货，不同意退款，拒绝原因：
	if (item.status === 63) {
		return t('The merchant refused to receive the goods, did not agree to refund, refused reasons:') + item.auditReason
	}
	// 未知状态
	return t('unknown state')
}

const loading1 = ref(false)

function handleCancel({ id }: AfterSale) {
	ElMessageBox.confirm(t('Are you confirm to cancel?'), {
		center: true,
		confirmButtonClass: 'mi-button--info',
	}).then(() => {
		loading1.value = true
		$api('trade/after-sale/cancel', {
			method: 'delete',
			params: { id },
		})
			.then(getData)
			.finally(() => {
				loading1.value = false
			})
	})
}

const router = useRouter()

function goDetail({ id }: AfterSale) {
	router.push($path(`/user/aftersaleview/${id}`))
}
</script>

<template>
	<div class="aftersale-list">
		<div class="site-container-1400 w-full mx-auto mb-8 bg-white p-12">
			<div class="user-order-list-container">
				<h1 class="user-order-list-container_title mt-0">
					{{ $t('AfterSales') }}
				</h1>
				<div class="user-order-list miv4">
					<div class="tag-nav">
						<li>
							<nuxt-link :to="$path('/user/orderlist')">
								{{ $t('My Orders') }}
							</nuxt-link>
						</li>
						<li class="active">
							{{ $t('AfterSales') }}
						</li>
					</div>
				</div>
			</div>
			<ul>
				<li
					v-for="item in data"
					:key="item.id"
					class="mb-5 p-6"
					style="border: 1px solid #e0e0e0"
				>
					<div class="text-xl flex justify-between">
						<span>{{ $t('AfterSale number') }}: {{ item.no }}</span>
						<span>{{ formatAfterStatusDescription(item) }}</span>
					</div>
					<div class="flex my-4">
						<nuxt-link
							:to="$path(`/product/${item.id}`)"
							class="flex mr-2"
						>
							<app-image class="h-20 w-20" :src="item.picUrl" :alt="item.spuName"/>
						</nuxt-link>
						<div class="flex flex-col justify-between flex-1">
							<span style="color: #000">
								{{ item.spuName }} {{ item.properties?.length > 0 ? item.properties?.map(p => p.valueName).join(' ') : '' }}
							</span>
							<span class="text-xs" style="color: #b4b4be">
								{{
									item.properties
										?.map((p) => p.valueName)
										.join(' ')
								}}
							</span>
							<span
								class="text-xs flex justify-between items-center"
							>
								<span>
									<ProductPrice :data="item.payPrice" />
									<span style="color: #b4b4be">
										{{ ` x ${item.count}` }}
									</span>
								</span>
							</span>
						</div>
					</div>
					<div class="my-2">
						<span v-if="wayText[item.way]" class="mr-4">{{ wayText[item.way] }}
						</span>
						<span style="color: var(--title-light)">
							{{ formatAfterStatusDescription(item) }}
						</span>
					</div>
					<div class="flex justify-end pt-2">
						<el-button
							v-if="cancelBtnShow(item)"
							style="border-radius: 0"
							:disabled="loading1"
							@click="handleCancel(item)"
						>
							{{ $t('Cancel') }}
						</el-button>
						<el-button
							type="info"
							style="border-radius: 0"
							@click="goDetail(item)"
						>
							{{ $t('ORDER DETAILS') }}
						</el-button>
					</div>
				</li>
			</ul>
			<div class="">
				<el-pagination
					v-if="pagination.total"
					v-model:page-size="pagination.pageSize"
					v-model:current-page="pagination.currentPage"
					:total="pagination.total"
				/>
			</div>
		</div>
	</div>
</template>
