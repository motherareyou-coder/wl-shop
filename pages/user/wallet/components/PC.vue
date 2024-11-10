<script setup lang="ts">
import type { PayWallet, PayWalletTransaction, PointRecord } from '~/types'

const { data } = await useAPI<PayWallet>('pay/wallet/get?apifoxApiId=228468014')

const isBalance = ref(1)
const type = ref('')
const createTime = ref([])
const {
	data: list,
	pagination,
	resetData,
} = useTablePagination<PayWalletTransaction | PointRecord>((p = {}) => {
	if (isBalance.value) {
		p.type = type.value
	}
	else {
		p.addStatus = { 1: true, 2: false }[type.value]
	}
	if (createTime.value?.length)
		p.createTime = createTime.value
	return $api(
		isBalance.value
			? 'pay/wallet-transaction/page?apifoxApiId=228467010'
			: 'member/point/record/page?apifoxApiId=230297291',
		{ params: p },
	)
})
watch(isBalance, resetData)
watch(type, resetData)
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
						{{ `${$t('Points')}: ${data.balance}` }}
					</span>
				</li>
			</ul>
			<ul class="nav">
				<li>
					<span :class="{ active: type === '' }" @click="type = ''">
						{{ $t('All') }}
					</span>
				</li>
				<li>
					<span :class="{ active: type === 1 }" @click="type = 1">
						{{ $t('Earning') }}
					</span>
				</li>
				<li>
					<span :class="{ active: type === 2 }" @click="type = 2">
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
				<el-table-column prop="bizType" />
				<el-table-column prop="title" />
				<el-table-column prop="createTime" />
				<el-table-column prop="price">
					<template #default="{ row }">
						<span
							class="price-wrap"
							:class="[
								row.bizType === 1 ? 'increase' : 'decrease',
							]"
						>
							{{ row.bizType === 1 ? '+' : '-' }}<ProductPrice :data="row.price" />
						</span>
					</template>
				</el-table-column>
			</el-table>
			<el-table v-else :data="list">
				<el-table-column prop="title" />
				<el-table-column prop="description" />
				<el-table-column prop="createTime" />
				<el-table-column prop="point">
					<template #default="{ row }">
						<span
							class="price-wrap"
							:class="[
								row.bizType === 1 ? 'increase' : 'decrease',
							]"
						>
							{{ (row.bizType === 1 ? '+' : '-') + row.point }}
						</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:total="pagination.total"
				layout="prev,pager,next,jumper"
				center
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
