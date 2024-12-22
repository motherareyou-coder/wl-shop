<script setup lang="ts">
import type { UploadFile } from 'element-plus'
import { isArray } from 'lodash-es'
import type { OrderDetail } from '~/types'

const route = useRoute()
const router = useRouter()
const item = useLocalStorage(`orderItem-${route.params.id}`, {}) as unknown as Ref<OrderDetail>

const data = ref({
	anonymous: true,
	orderItemId: 2312312,
	descriptionScores: '',
	benefitScores: '',
	content: '',
	picUrls: [] as string[],
})
const images = ref<UploadFile[]>([])

const loading = ref(false)
function submit() {
	$api('trade/order/item/create-comment', {
		method: 'post',
		body: {
			anonymous: data.value.anonymous,
			orderItemId: item.value.id,
			descriptionScores: data.value.descriptionScores,
			benefitScores: data.value.benefitScores,
			content: data.value.content,
			picUrls: data.value.picUrls,
		},
	})
		.then(() => {
			router.replace($path(`/user/orderview/${item.value.orderId}`))
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
				data.value.picUrls = isArray(res) ? res : [res]
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
	<div class="order-review-wrapper">
		<div
			:class="[
				appStore.isPC
					? 'site-container-1400 bg-white my-10 mx-auto w-full p-10'
					: '',
			]"
		>
			<section class="bg-white p-4 my-2">
				<p v-if="appStore.isPC" class="text-2xl mb-5">
					{{ $t('商品评价') }}
				</p>
				<div class="flex">
					<nuxt-link
						:to="$path(`/product/${item.spuId}`)"
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
										<td class="whitespace-nowrap pr-2 py-2">
											{{ $t('是否匿名') }}
										</td>
										<td class="w-full py-2" :class="[appStore.isMobile ? 'text-right' : '']">
											<app-checkbox v-model="data.anonymous" />
										</td>
									</tr>
									<tr>
										<td class="whitespace-nowrap pr-2 py-2">
											{{ $t('商品质量') }}
										</td>
										<td class="w-full py-2" :class="[appStore.isMobile ? 'text-right' : '']">
											<el-form-item
												prop="descriptionScores"
												:rules="{ required: true }"
												style="margin-bottom: 0;height: auto;display: inline-block;"
											>
												<el-rate v-model="data.descriptionScores" />
											</el-form-item>
										</td>
									</tr>
									<tr>
										<td class="whitespace-nowrap pr-2 py-2">
											{{ $t('服务态度') }}
										</td>
										<td class="w-full py-2" :class="[appStore.isMobile ? 'text-right' : '']">
											<el-form-item
												prop="benefitScores"
												:rules="{ required: true }"
												style="margin-bottom: 0;height: auto;display: inline-block;"
											>
												<el-rate v-model="data.benefitScores" />
											</el-form-item>
										</td>
									</tr>
									<tr>
										<td :colspan="2" class="py-2">
											<el-form-item
												prop="content"
												:rules="{ required: true }"
												class="w-full"
												style="margin-bottom: 0;"
											>
												<div class="description flex flex-col w-full">
													<el-input
														v-model="data.content"
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
											</el-form-item>
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
.order-review-wrapper {
	.description {
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
