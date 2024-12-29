<script setup lang="ts">
import type { PayWallet, PayWalletTransaction, PointRecord } from '~/types'

const { data } = await useAPI<PayWallet>('pay/wallet/get')

const route = useRoute()
const router = useRouter()
// eslint-disable-next-line eqeqeq
const isBalance = ref(route.query.type as string == 0 ? 0 : 1)
const status = ref<string | number>('')
const createTime = ref([])
const {
	data: list,
	pagination,
	resetData,
} = useTablePagination<PayWalletTransaction | PointRecord>((p = {}) => {
	if (isBalance.value) {
		p.type = status.value
	}
	else {
		p.addStatus = { 1: true, 2: false }[status.value]
	}
	if (createTime.value?.length)
		p.createTime = createTime.value
	return $api(
		isBalance.value
			? 'pay/wallet-transaction/page'
			: 'member/point/record/page',
		{ params: p },
	)
})
const userStore = useUserStore()
watch(isBalance, (v) => {
	router.replace({ path: route.path, query: { type: v ? 1 : 0 } })
	resetData()
})
watch(status, resetData)
</script>

<template>
	<div class="user-wallet--pc">
		<div
			v-if="data"
			class="site-container-1400 mx-auto w-full bg-white mb-10 p-12"
		>
			<h1 class="mt-0">
				{{ $t('My wallet') }}
			</h1>
			<ul class="nav">
				<li>
					<span
						:class="{ active: isBalance === 1 }"
						@click="isBalance = 1"
					>
						{{ `${$t('Balance')}: ${data.balance}` }}
					</span>
				</li>
				<li>
					<span
						:class="{ active: isBalance === 0 }"
						@click="isBalance = 0"
					>
						{{ `${$t('Points')}: ${userStore.info?.point}` }}
					</span>
				</li>
			</ul>
			<ul class="nav">
				<li>
					<span :class="{ active: status === '' }" @click="status = ''">
						{{ $t('All') }}
					</span>
				</li>
				<li>
					<span :class="{ active: status === 1 }" @click="status = 1">
						{{ $t('Earning') }}
					</span>
				</li>
				<li>
					<span :class="{ active: status === 2 }" @click="status = 2">
						{{ $t('Spend') }}
					</span>
				</li>
				<li>
					<el-date-picker
						v-model="createTime"
						value-format="YYYY-MM-DD HH:mm:ss"
						type="datetimerange"
						@change="resetData"
					/>
				</li>
			</ul>
			<el-table v-if="isBalance" :data="list">
				<el-table-column prop="bizType" width="200" />
				<el-table-column prop="title" />
				<el-table-column prop="createTime" width="200">
					<template #default="{ row }">
						<app-time :data="row.createTime" />
					</template>
				</el-table-column>
				<el-table-column prop="price" width="100">
					<template #default="{ row }">
						<span
							class="price-wrap"
							:class="[
								row.bizType === 1 ? 'increase' : 'decrease',
							]"
						>
							<ProductPrice :data="row.price" />
						</span>
					</template>
				</el-table-column>
			</el-table>
			<el-table v-else :data="list">
				<el-table-column prop="title" width="200" />
				<el-table-column prop="description" />
				<el-table-column prop="createTime" width="200">
					<template #default="{ row }">
						<app-time :data="row.createTime" />
					</template>
				</el-table-column>
				<el-table-column prop="point" width="100">
					<template #default="{ row }">
						<span
							class="price-wrap"
							:class="[
								row.bizType === 1 ? 'increase' : 'decrease',
							]"
						>
							{{ row.point }}
						</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-if="pagination.total"
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:total="pagination.total"
				layout="prev,pager,next,jumper"
				class="mt-5"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-wallet--pc:deep {
	.mi-radio {
		.mi-radio__input {
			display: none;
		}
		.mi-radio__label {
			padding-left: 0;
		}
	}
	ul.nav {
		margin: 0 -20px 20px -20px;
		color: #b0b0b0;
		li {
			display: inline-block;
			padding: 0 20px;
			&:not(:last-of-type) {
				border-right: 1px solid #e0e0e0;
			}
			span {
				cursor: pointer;
			}
		}
		.active {
			color: var(--mi-color-primary);
		}
	}
	.price-wrap {
		font-weight: 900;
		color: #333;
		&.increase {
			color: var(--mi-color-primary);
		}
	}
}
</style>
