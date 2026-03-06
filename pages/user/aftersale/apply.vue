<script setup lang="ts">
import type { UploadFile } from 'element-plus'
import type { OrderDetail, OrderItem, TradeConfig } from '~/types'
import { isArray } from 'lodash-es'

const route = useRoute()
const router = useRouter()
const info = useLocalStorage('after-sale-apply', {}) as unknown as Ref<OrderDetail>
const item = (info.value.items?.find(d => `${d.id}` === route.query.item) || {}) as OrderItem

const { data: config } = await useAPI<TradeConfig>(
	'trade/config/get',
)

const data = ref({
	way: 10,
	applyReason: null,
	applyDescription: '',
	refundPrice: item.payPrice,
	applyPicUrls: [] as string[],
})
const images = ref<UploadFile[]>([])

const options = (info.value.status === 20
	? config.value?.afterSaleReturnReasons
	: config.value?.afterSaleRefundReasons
)?.map(v => ({ label: v, value: v })) || [
	{ label: $t('Don\'t want it anymore'), value: 1 },
	{ label: $t('Dislike'), value: 2 },
]

const loading = ref(false)
function submit() {
	$api('trade/after-sale/create', {
		method: 'post',
		body: {
			orderItemId: item.id,
			refundPrice: data.value.refundPrice,
			way: data.value.way,
			applyReason: data.value.applyReason,
			applyDescription: data.value.applyDescription,
			applyPicUrls: data.value.applyPicUrls,
		},
	})
		.then((res) => {
			router.replace($path(`/user/aftersaleview/${res}`))
		})
		.finally(() => {
			loading.value = false
		})
}
const formRef = ref()
function handleSubmit() {
	formRef.value?.validate((v) => {
		if (!v)
			return
		loading.value = true
		if (images.value.length) {
			const form = new FormData()
			images.value.forEach((f) => {
				form.append('file', f.raw)
			})
			$api<string>('infra/file/upload', {
				method: 'post',
				body: form,
			}).then((res) => {
				data.value.applyPicUrls = isArray(res) ? res : [res]
				submit()
			})
		}
		else {
			submit()
		}
	})
}

function handleRemove(file: UploadFile) {
	images.value = images.value.filter(f => f != file)
}

const appStore = useAppStore()
</script>

<template>
	<div class="aftersale-apply-wrapper">
		<div
			:class="[
				appStore.isPC
					? 'site-container-1400 bg-white my-10 mx-auto w-full p-10'
					: '',
			]"
		>
			<section class="bg-white p-4 my-2">
				<p v-if="appStore.isPC" class="text-3xl mb-5">
					{{ $t('After Sale') }}
				</p>
				<p v-if="appStore.isPC" class="text-2xl mb-5">
					{{ $t('Order items') }}
				</p>
				<div class="flex">
					<nuxt-link
						:to="$path(`/product/${item.spuId}`)"
						class="flex mr-5"
					>
						<app-image class="h-20 w-20" :src="item.picUrl" :alt="item.spuName" />
					</nuxt-link>
					<div class="flex flex-col justify-between flex-1">
						<span style="color: #000">{{ item.spuName }} </span>
						<span class="text-xs" style="color: #b4b4be">{{
							item.properties
								?.map((p) => p.valueName)
								.join(' ')
						}}
						</span>
						<span class="text-xs">
							<ProductPrice :data="item.payPrice" />
							<span style="color: #b4b4be">
								{{ ` x ${item.count}` }}
							</span>
						</span>
					</div>
				</div>
			</section>
			<section class="bg-white p-4 my-2">
				<p>
					{{ $t('After sale type') }}
				</p>
				<el-form
					ref="formRef"
					:model="data"
					:show-message="false"
					:hide-required-asterisk="true"
				>
					<div class="mi-descriptions">
						<div class="mi-descriptions__body">
							<table class="mi-descriptions__table">
								<tbody>
									<tr>
										<td colspan="2" class="py-2">
											<el-radio-group v-model="data.way">
												<el-radio :value="10">
													{{ $t('Refund only') }}
												</el-radio>
												<el-radio v-if="info.status === 30" :value="20">
													{{ $t('Return and refund') }}
												</el-radio>
											</el-radio-group>
										</td>
									</tr>
									<tr>
										<td class="whitespace-nowrap pr-2 py-2">
											{{ $t('Refund price') }}
										</td>
										<td class="w-full py-2" :class="[appStore.isMobile ? 'text-right' : '']">
											<ProductPrice :data="data.refundPrice" />
										</td>
									</tr>
									<tr>
										<td class="whitespace-nowrap pr-2 py-2">
											{{ $t('Apply reason') }}
										</td>
										<td class="w-full py-2" :class="[appStore.isMobile ? 'text-right' : '']">
											<el-form-item
												prop="applyReason"
												:rules="{ required: true }"
												style="margin-bottom: 0;height: auto;display: inline-block;"
											>
												<app-select
													v-model="data.applyReason"
													:options="options"
												/>
											</el-form-item>
										</td>
									</tr>
									<tr v-if="appStore.isMobile">
										<td colspan="2" class="py-2">
											{{ $t('Apply description') }}
										</td>
									</tr>
									<tr>
										<td v-if="appStore.isPC" class="whitespace-nowrap pr-2 py-2" style="vertical-align: text-bottom;">
											{{ $t('Apply description') }}
										</td>
										<td :colspan="appStore.isMobile ? 2 : 1" class="py-2">
											<div class="refund-description flex flex-col w-full">
												<el-input
													v-model="data.applyDescription"
													:rows="5"
													type="textarea"
												/>
												<el-upload
													v-model:file-list="images"
													action="#"
													list-type="picture-card"
													:auto-upload="false"
													class="m-1"
													:limit="3"
													multiple
													:disabled="images.length >= 3"
												>
													<el-icon>
														<ElIconPlus />
													</el-icon>
													<template #file="{ file }">
														<div class="upload-list__item-thumbnail">
															<img :src="file.url">
															<span class="upload-list__item-actions">
																<el-icon
																	class="cursor-pointer"
																	@click="handleRemove(file)"
																><ElIconDelete /></el-icon>
															</span>
														</div>
													</template>
												</el-upload>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</el-form>
			</section>
			<section
				class="py-2 px-4 my-2"
				:class="[
					appStore.isMobile
						? 'order-action-container sticky bottom-0 bg-white'
						: '',
				]"
			>
				<div class="flex justify-end">
					<el-button
						type="info"
						:disabled="loading"
						@click="handleSubmit"
					>
						{{ $t('Submit') }}
					</el-button>
				</div>
			</section>
		</div>
	</div>
</template>

<style lang="scss">
.aftersale-apply-wrapper {
	.refund-description {
		background-color: #f9fafb;
		.mi-textarea {
			--mi-input-bg-color: #f9fafb;
			--mi-input-border-color: transparent;
			--mi-input-focus-border-color: transparent;
		}
		--size: 80px;
		.mi-upload--picture-card {
			--mi-upload-picture-card-size: var(--size);
		}
		.mi-upload-list--picture-card .mi-upload-list__item {
			--mi-upload-list-picture-card-size: var(--size);
			position: relative;
		}
		.mi-upload.is-disabled {
			display: none;
		}
		.upload-list__item-thumbnail {
			position: relative;
			width: var(--mi-upload-picture-card-size);
			height: var(--mi-upload-picture-card-size);
			img {
			width: var(--mi-upload-picture-card-size);
			height: var(--mi-upload-picture-card-size);
			}
		}
		.upload-list__item-actions {
			width: 100%;
			display: flex;
			justify-content: center;
			position: absolute;
			bottom: 0;
			background-color: var(--el-overlay-color-lighter);
			padding: 4px 0;
			.mi-icon {
				--color: #fff;
			}
		}
		textarea{
			box-shadow: none !important;
		}
	}
	.mi-form-item__content {
		line-height: inherit !important;
	}
	.is-error {
		color: var(--mi-color-error);
	}
}
.order-action-container {
	box-shadow: 0 -2px 4px 0 rgba(25, 25, 25, 0.08);
}
</style>
