<script setup lang="ts">
import type { PayWallet, PayWalletTransaction, PointRecord } from '~/types'

const { data } = await useAPI<PayWallet>('pay/wallet/get')

const createTime = ref([])
const type = ref('')
const {
	data: list,
	load,
	reset,
} = useInfiteLoad<PayWallet>(
	params =>
		$api('pay/wallet-transaction/page', {
			params: {
				...params,
				createTime: createTime.value || [],
				type: type.value,
			},
		}),
	'',
)
watch(createTime, reset)
watch(type, reset)
</script>

<template>
	<div class="user-wallet--mobile">
		<div class="rounded-lg bg-white flex flex-col p-4 m-2">
			<h2 class="text-xl">
				{{ $t('Balance') }}
			</h2>
			<p class="text-4xl mt-4 mb-2">
				<ProductPrice :data="data?.balance" />
			</p>
		</div>
		<div class="flex">
			<div></div>
			<div class="flex flex-col">
				<span></span>
				<span></span>
			</div>
		</div>
		<div v-infinite-scroll="load" class="bg-white">
			<el-tabs v-model="type" stretch>
				<el-tab-pane :label="$t('All')" name="" />
				<el-tab-pane :label="$t('Earning')" :name="1" />
				<el-tab-pane :label="$t('Spend')" :name="2" />
			</el-tabs>
			<ul>
				<li v-for="item in list" :key="item.id">
					<div>
						<span class="title">{{ item.bizType }}</span>
						<span
							class="price-wrap"
							:class="[
								item.bizType === 1 ? 'increase' : 'decrease',
							]"
						>
							<ProductPrice :data="item.price" />
						</span>
					</div>
					<span class="time">{{ item.createTime }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-wallet--mobile:deep {
	ul {
		padding: 10px;
		padding-top: 0;
	}
	li {
		margin-bottom: 10px;
		div {
			display: flex;
			justify-content: space-between;
		}
		.price-wrap {
			font-weight: 900;
			color: #333;
			&.increase {
				color: var(--mi-color-primary);
			}
		}
		.time {
			font-size: 12px;
			color: var(--title-light);
		}
	}
}
</style>
