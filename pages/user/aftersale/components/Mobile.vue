<script setup lang="ts">
import type { AfterSale } from '~/types'

const { t } = useI18n()
const { data, load, loading, pagination, total } = useInfiteLoad<AfterSale>(params =>
	$api('trade/after-sale/page', {
		params: { ...params, needLogin: true },
	}),
)

const statusClass = {
	10: 'paying',
	20: 'ship',
	30: 'ship',
	40: 'ship',
	50: 'done',
	61: 'close',
	62: 'close',
	63: 'close',
}
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
			.then(() => {
				pagination.value.pageNo = Math.max(
					1,
					pagination.value.pageNo - 1,
				)
				load()
			})
			.finally(() => {
				loading1.value = false
			})
	})
}
</script>

<template>
	<div class="aftersale-orders order-list-wrapper--mobile">
		<el-empty v-if="!loading && total === 0" :description="$t('No data')" />
		<div
			v-else
			v-infinite-scroll="load"
			class="infinite-scroll infinite-scroll--mobile"
		>
			<ul class="order-list">
				<li
					v-for="item in data"
					:key="item.id"
					class="order-item"
					:class="[
						`order--${statusClass[item.status]}`,
					]"
				>
					<div class="order-item__header">
						<div class="order-item__header__left">
							<span class="order-item__time">{{ item.no }}</span>
						</div>
						<div class="order-item__header__right">
							<span class="order-item__status">{{ formatAfterStatusDescription(item) }}</span>
						</div>
					</div>
					<div class="order-item__content">
						<nuxt-link class="order-item__link" :to="$path(`/user/aftersaleview/${item.id}`)">
							<div
								class="commodity-item"
							>
								<div class="commodity-item__image">
									<app-image class="mr-5 h-20 w-20" :src="item.picUrl" :alt="item.spuName" />
								</div>
								<div class="commodity-item__info">
									<p style="color: #000">
										{{ item.spuName }} {{ item.properties?.length > 0 ? item.properties?.map(p => p.valueName).join(' ') : '' }}
									</p>
									<p>
										<span style="color: #b4b4be">
											{{ ` x ${item.count}` }}
										</span>
									</p>
								</div>
							</div>
						</nuxt-link>
					</div>
					<div class="order-item__footer">
						<div class="order-item__footer__left">
							<span class="whitespace-nowrap">
								<span v-if="wayText[item.way]" class="mr-2">{{ wayText[item.way] }}</span>
								<span style="color: var(--title-light)">
									<!-- {{ item.applyReason }} -->
									{{ formatAfterStatusDescription(item) }}
								</span>
							</span>
						</div>
						<div class="order-item__footer__right">
							<el-button
								v-if="cancelBtnShow(item)"
								type="info"
								style="font-size: 12px"
								:disabled="loading1"
								@click="handleCancel(item)"
							>
								{{ $t('Cancel') }}
							</el-button>
						</div>
					</div>
				</li>
			</ul>
			<div v-loading="loading"></div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./Mobile.scss');
</style>
