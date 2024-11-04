<script setup lang="ts">
import type { UploadFile } from 'element-plus'
import type { OrderDetail, OrderItem, TradeConfig } from '~/types'

const route = useRoute()
const info: OrderDetail = JSON.parse(
	localStorage.getItem('after-sale-apply') || '{}',
)
const item: OrderItem = info.items?.find(d => `${d.id}` === route.query.item)

const { data: config } = await useAPI<TradeConfig>(
	'trade/config/get?apifoxApiId=225575439',
)

const data = ref({
	way: 10,
	applyReason: null,
	applyDescription: '',
	refundPrice: item.payPrice,
	applyPicUrls: [],
})
const images = ref([])

const options = (info.status === 20
	? config.value?.afterSaleReturnReasons
	: config.value?.afterSaleRefundReasons
).map(v => ({ label: v, value: v })) || [
	{ label: $t('Don\'t want it anymore'), value: 1 },
	{ label: $t('Dislike'), value: 2 },
]

const router = useRouter()

function submit() {
	$api('trade/after-sale/create?apifoxApiId=225568599', {
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
			router.push($path(`/user/aftersaleview/${res}`))
		})
		.finally(() => {
			loading.value = false
		})
}
const loading = ref(false)
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
			$api('infra/file/upload?apifoxApiId=225572197', {
				method: 'post',
				body: form,
			}).then((res) => {
				data.value.applyPicUrls = res
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
						:to="$path(`/product/${item.id}`)"
						class="flex mr-5"
					>
						<app-image class="h-20 w-20" :src="item.picUrl" />
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
					<div class="flex justify-between items-center my-2">
						<el-radio-group v-model="data.way">
							<el-radio :value="10">
								{{ $t('Refund only') }}
							</el-radio>
							<el-radio v-if="info.status === 20" :value="20">
								{{ $t('Return and refund') }}
							</el-radio>
						</el-radio-group>
					</div>
					<div class="flex justify-between items-center my-2">
						<span class="whitespace-nowrap">{{
							$t('Refund price')
						}}</span>
						<span>
							<ProductPrice :data="data.refundPrice" />
						</span>
					</div>
					<div class="flex justify-between items-center my-2">
						<span class="whitespace-nowrap">{{
							$t('Apply reason')
						}}</span>
						<span
							class="ml-2"
							:class="[appStore.isPC ? 'w-24' : '']"
						>
							<el-form-item
								prop="applyReason"
								:rules="{ required: true }"
								style="
									margin-bottom: 0;
									height: auto;
									display: inline;
								"
							>
								<app-select
									v-model="data.applyReason"
									:options="options"
								/>
							</el-form-item>
						</span>
					</div>
					<div class="my-2">
						<div class="my-2">
							{{ $t('Apply description') }}
						</div>
						<div class="refund-description mt-1 flex flex-col">
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
				width: 100%;
				height: 100%;
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
