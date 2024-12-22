<script setup lang="ts">
import type { AfterSale, AfterSaleLog } from '~/types'

definePageMeta({
	showBread: true,
	title: 'AfterSale Detail',
})
useHead({
	title: `${$t('AfterSale Detail')} ${$t('appTitle')}`,
})

const route = useRoute()
const id = route.params.id
const { data, refresh } = await useAPI<AfterSale>(
	'trade/after-sale/get',
	{ params: { id } },
)

const { data: componies } = await useAPI<{ id: number, name: string }[]>(
	'trade/delivery/express/list',
)

const visible = ref(false)
const form = ref({
	id: data.value?.id,
	logisticsId: null,
	logisticsNo: '',
})
const formRef = ref()

function handleShow() {
	if (data.value?.logisticsNo)
		return
	visible.value = true
}

const loading = ref(false)

function handleConfirm() {
	formRef.value?.validate((v) => {
		if (!v)
			return
		loading.value = true
		$api('trade/after-sale/delivery', {
			method: 'put',
			body: form.value,
		})
			.then(() => {
				visible.value = false
				refresh()
			})
			.finally(() => {
				loading.value = false
			})
	})
}

const { t } = useI18n()

function handleCancel() {
	ElMessageBox.confirm(t('Are you confirm to cancel?'), {
		center: true,
		confirmButtonClass: 'mi-button--info',
	}).then(() => {
		loading.value = true
		$api('trade/after-sale/cancel', {
			method: 'delete',
			params: { id },
		})
			.then(refresh)
			.finally(() => {
				loading.value = false
			})
	})
}

const statusText = {
	10: t('申请中,会员申请退款,退款申请待商家处理 '),
	20: t('卖家通过,商家同意退款,请退货并填写物流信息 '),
	30: t('待卖家收货,会员填写退货物流信息,退货退款申请待商家处理 '),
	40: t('等待平台退款,商家收货,无（有赞无该状态）'),
	50: t('完成,商家确认退款,退款成功 '),
	61: t('买家取消售后,会员取消退款,退款关闭 '),
	62: t('卖家拒绝,商家拒绝退款,商家不同意退款申请 '),
	63: t('卖家拒绝收货,商家拒绝收货,商家拒绝收货，不同意退款'),
}
const logVisible = ref(false)
const { data: logs } = await useAPI<AfterSaleLog[]>('trade/after-sale-log/list', { params: { afterSaleId: id } })

const appStore = useAppStore()
</script>

<template>
	<div class="aftersale-detail-contianer">
		<div
			v-if="data"
			:class="[
				appStore.isPC
					? 'site-container-1400 bg-white mb-10 mx-auto w-full p-10'
					: '',
			]"
		>
			<section class="bg-white py-2">
				<div class="my-steps">
					<div class="my-step" :class="{ active: data.status >= 10 }">
						<div class="bar">
							{{ $t('SubmitAfterSale') }}
						</div>
						<div>
							<app-time :data="data?.createTime" />
						</div>
					</div>
					<div class="my-step" :class="{ active: data.status > 10 }">
						<div class="bar">
							{{ $t('Processing') }}
						</div>
						<div>
							<app-time :data="data?.updateTime" />
						</div>
					</div>
					<div class="my-step" :class="{ active: data.status >= 50 }">
						<div class="bar">
							{{ $t('Done') }}
						</div>
						<div>
							<app-time :data="data?.refundTime" />
						</div>
					</div>
				</div>
			</section>
			<section v-if="logs?.length" class="my-2 bg-white p-4">
				<div class="flex items-center cursor-pointer" :class="[appStore.isMobile ? 'w-full justify-between' : 'inline-flex']" @click="logVisible = true">
					<div class="flex flex-col">
						<div>{{ logs[0]?.content }}</div>
						<div class="text-slate-400 text-sm">
							<app-time :data="logs[0]?.createTime " />
						</div>
					</div>
					<i class="micon micon-link-arrow ml-5"></i>
				</div>
			</section>
			<section v-if="data && data.logisticsNo" class="my-2 bg-white p-4">
				<p>{{ $t('AfterSale logisticsNo') }}: {{ data.logisticsNo }}</p>
			</section>
			<section v-if="data && (data.status === 20)" class="my-2 bg-white p-4">
				<div class="flex items-center cursor-pointer" :class="[appStore.isMobile ? 'w-full justify-between' : 'inline-flex']" @click="handleShow">
					<div>
						{{ $t('Please fill in the return logistics information.') }}
					</div>
					<i class="micon micon-link-arrow ml-5"></i>
				</div>
			</section>
			<section v-if="data" class="my-2 bg-white p-4">
				<div class="flex">
					<nuxt-link class="flex mr-5" :to="$path(`/product/${data.id}`)">
						<app-image class="h-20 w-20" :src="data.picUrl" />
					</nuxt-link>
					<div class="flex flex-col justify-between flex-1">
						<span style="color: #000">
							{{ data.spuName }}
						</span>
						<span class="text-xs" style="color: #b4b4be">
							{{
								data.properties
									?.map((p) => p.valueName)
									.join(' ')
							}}
						</span>
						<span class="text-xs">
							<ProductPrice :data="data.payPrice" />
							<span style="color: #b4b4be">
								{{ ` x ${data.count}` }}
							</span>
						</span>
					</div>
				</div>
			</section>
			<section class="my-2 bg-white p-4">
				<div class="mi-descriptions">
					<div class="mi-descriptions__body">
						<table class="mi-descriptions__table">
							<tbody>
								<tr>
									<td class="whitespace-nowrap pr-5">
										{{ $t('Refund price') }}
									</td>
									<td class="w-full" :style="[appStore.isMobile ? 'text-align:right' : '']">
										<ProductPrice :data="data?.refundPrice" />
									</td>
								</tr>
								<tr>
									<td class="whitespace-nowrap pr-5">
										{{ $t('Refund Order No') }}
									</td>
									<td class="w-full" :style="[appStore.isMobile ? 'text-align:right' : '']">
										{{ data?.no }}
									</td>
								</tr>
								<tr>
									<td class="whitespace-nowrap pr-5">
										{{ $t('Apply time') }}
									</td>
									<td class="w-full" :style="[appStore.isMobile ? 'text-align:right' : '']">
										<app-time :data="data?.createTime" />
									</td>
								</tr>
								<tr>
									<td class="whitespace-nowrap pr-5">
										{{ $t('Apply reason') }}
									</td>
									<td class="w-full" :style="[appStore.isMobile ? 'text-align:right' : '']">
										{{ data?.applyReason }}
									</td>
								</tr>
								<tr>
									<td class="whitespace-nowrap pr-5">
										{{ $t('Apply description') }}
									</td>
									<td class="w-full" :style="[appStore.isMobile ? 'text-align:right' : '']">
										{{ data?.applyDescription }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>
			<section
				v-if="data?.status < 2"
				class="py-2 px-4 my-2"
				:class="[appStore.isMobile ? 'order-action-container sticky bottom-0 bg-white' : '']"
			>
				<div class="flex justify-end">
					<el-button
						type="info"
						:style="appStore.isPC ? 'border-radius:0' : ''"
						:disabled="loading"
						@click="handleCancel"
					>
						{{ $t('Cancel') }}
					</el-button>
				</div>
			</section>
		</div>
		<app-modal v-model="visible" direction="btt">
			<el-form
				ref="formRef"
				:model="form"
				:show-message="false"
				hide-required-asterisk
				label-position="top"
			>
				<el-form-item
					prop="logisticsId"
					:label="$t('Logistics company')"
					:rules="{ required: true }"
				>
					<el-select v-model="form.logisticsId">
						<el-option
							v-for="o in componies"
							:key="o.id"
							:label="o.name"
							:value="o.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					prop="logisticsNo"
					:label="$t('Tracking number')"
					:rules="{ required: true }"
				>
					<el-input v-model="form.logisticsNo" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button
					type="info"
					class="w-full"
					:disabled="loading"
					@click="handleConfirm"
				>
					{{ $t('Confirm') }}
				</el-button>
			</template>
		</app-modal>
		<el-drawer
			v-model="logVisible"
			:title="$t('售后日志')"
			append-to-body
			:direction="appStore.isMobile ? 'btt' : 'rtl'"
			style="min-height: 50vh"
		>
			<el-timeline>
				<el-timeline-item
					v-for="(log, i) in logs"
					:key="i"
					:timestamp="log.time"
				>
					<div>
						{{ log.content }}
					</div>
					<div class="text-slate-400 text-sm">
						<app-time :data="log.createTime" />
					</div>
				</el-timeline-item>
			</el-timeline>
		</el-drawer>
	</div>
</template>

<style lang="scss" scoped>
.aftersale-detail-contianer:deep {
	.my-steps {
		display: flex;
		text-align: center;
		--step-width: 200px;
		--step-height: 20px;
		font-size: 14px;
		color: #424242;

		@media screen and (max-width: 720px) {
			overflow-x: auto;
			--step-width: 33%;
			padding: 10px;
			font-size: 12px;
		}

		.my-step {
			display: flex;
			flex-direction: column;
			width: var(--step-width);
			flex-shrink: 0;

			.bar {
				height: var(--step-height);
				line-height: var(--step-height);
				border-top-right-radius: calc(var(--step-height) / 2);
				border-bottom-right-radius: calc(var(--step-height) / 2);
				background-color: #EEEEEE;
				margin-bottom: var(--step-height);
			}
			&:first-child{
				.bar{
					border-radius: calc(var(--step-height) / 2);
				}
			}

			&.active {
				.bar {
					background-color: #6EB655;
					color: #fff;
				}
			}
		}
	}
}

.order-action-container {
	box-shadow: 0 -2px 4px 0 rgba(25, 25, 25, 0.08);
}
</style>
