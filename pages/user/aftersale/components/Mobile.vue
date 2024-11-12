<script setup lang="ts">
import type { AfterSale } from '~/types'

const { data, load, loading, pagination } = useInfiteLoad<AfterSale>(params =>
	$api('trade/after-sale/page', {
		params: { ...params },
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
	<div class="aftersale-orders">
		<div
			v-infinite-scroll="load"
			class="infinite-scroll infinite-scroll--mobile"
		>
			<ul>
				<li
					v-for="item in data"
					:key="item.id"
					class="bg-white my-4 p-4"
				>
					<div>
						<span>{{ $t('AfterSale number') }}: {{ item.no }}</span>
						<span>{{ item.status }}</span>
					</div>
					<div class="my-4">
						<nuxt-link
							:to="$path(`/user/aftersaleview/${item.id}`)"
							class="flex"
						>
							<app-image class="mr-5 h-20 w-20" :src="item.picUrl" />
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
						</nuxt-link>
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
							type="info"
							style="font-size: 12px"
							:disabled="loading1"
							@click="handleCancel(item)"
						>
							{{ $t('Cancel') }}
						</el-button>
					</div>
				</li>
			</ul>
			<div v-loading="loading"></div>
		</div>
	</div>
</template>
