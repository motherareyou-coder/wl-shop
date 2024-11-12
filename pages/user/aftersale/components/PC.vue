<script setup lang="ts">
import type { AfterSale } from '~/types'

const { data, pagination, getData } = useTablePagination<AfterSale>((p = {}) =>
	$api('trade/after-sale/page', {
		params: { ...p, status: status.value },
	}),
)

const wayText = computed(() => ({
	10: $t('Refund only'),
	20: $t('Return and refund'),
}))

const loading1 = ref(false)
const { t } = useI18n()
function handleCancel({ id }: AfterSale) {
	ElMessageBox.confirm(
		t('Are you confirm to cancel?', {
			confirmButtonClass: 'mi-button--info',
		}),
	).then(() => {
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
		<div class="site-container-1400 w-full mx-auto my-8 bg-white p-12">
			<p class="text-3xl mb-4 mt-0">
				{{ $t('AfterSale List') }}
			</p>
			<ul>
				<li
					v-for="item in data"
					:key="item.id"
					class="my-5 p-6"
					style="border: 1px solid #e0e0e0"
				>
					<div class="text-xl">
						<span>{{ $t('AfterSale number') }}: {{ item.no }}</span>
						<span>{{ item.status }}</span>
					</div>
					<div class="flex my-4">
						<nuxt-link
							:to="$path(`/product/${item.id}`)"
							class="flex mr-2"
						>
							<app-image class="h-20 w-20" :src="item.picUrl" />
						</nuxt-link>
						<div class="flex flex-col justify-between flex-1">
							<span style="color: #000">
								{{ item.spuName }}
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
							{{ item.applyReason }}
						</span>
					</div>
					<div class="flex justify-end pt-2">
						<el-button
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
					v-model:page-size="pagination.pageSize"
					v-model:current-page="pagination.currentPage"
					:total="pagination.total"
				/>
			</div>
		</div>
	</div>
</template>
