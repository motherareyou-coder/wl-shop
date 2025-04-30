<script setup lang="ts">
import type { CombinationRecord } from '~/types'
import UserGroup from './components/UserGroup.vue'

definePageMeta({
	showBread: true,
	title: '拼团记录',
})

const appStore = useAppStore()
const route = useRoute()
const { shortDomain, domain } = useRuntimeConfig().public

useHead({
	link: [{ rel: 'canonical', href: `${domain}${route.path}` }],
	title: `${$t('拼团记录')} ${$t('appTitle')}`,
})
// 0.进行中 1.拼团成功 2.拼团失败）
const status = ref(0)
const statusOptions = [
	{ value: 0, label: '进行中' },
	{ value: 1, label: '拼团成功' },
	{ value: 2, label: '拼团失败' },
]

function method(p: any) {
	return $api<CombinationRecord[]>('promotion/combination-record/get-head-list', { params: { ...p, status: status.value } })
}

const now = new Date().getTime()
</script>

<template>
	<div class="miv4">
		<div
			:class="[
				appStore.isPC
					? 'site-container-1400 bg-white mb-10 mx-auto w-full p-12'
					: '',
			]"
		>
			<h1 v-if="appStore.isPC" class="user-order-list-container_title">
				{{ $t('拼团记录') }}
			</h1>
			<ul v-if="appStore.isPC" class="order-list__nav">
				<li
					v-for="option in statusOptions"
					:key="option.value"
					class="title"
					@click="status = option.value"
				>
					<span
						:class="{
							'title-active':
								`${status}` === `${option.value}`,
						}"
					>
						{{ $t(option.label) }}
					</span>
				</li>
			</ul>
			<div v-if="appStore.isMobile" class="order-list-header--mobile">
				<ul class="flex my-1">
					<li
						v-for="option in statusOptions"
						:key="option.value"
						class="whitespace-nowrap"
						:class="{ 'is-active': status === option.value }"
						@click="status = option.value"
					>
						{{ $t(option.label) }}
					</li>
				</ul>
			</div>
			<keep-alive>
				<app-list :key="status" :method="method">
					<template #default="{ row }: { row: CombinationRecord }">
						<li>
							<div
								class="bg-white rounded flex items-center"
								:class="[appStore.isPC ? 'mb-5' : 'm-2']"
								:style="appStore.isPC ? 'border: 1px solid rgb(224, 224, 224);' : ''"
							>
								<app-image :src="row.picUrl" :class="[appStore.isPC ? 'w-40 h-40' : 'w-28 h-28']" :alt="row.spuName" />
								<div
									class="flex flex-col justify-between py-2"
									:class="appStore.isPC ? ' leading-8' : ' leading-6'"
								>
									<div>{{ row.spuName }}</div>
									<div>
										<product-price :data="row.combinationPrice" />
									</div>
									<div>
										<UserGroup :id="row.id" class="mr-2" />
										<span v-if="row.userSize != row.userCount">
											{{ $t('还差x人成团', { number: row.userSize - row.userCount }) }}
										</span>
									</div>
									<div>
										<app-count-down
											v-if="row.expireTime > now"
											class="bar-items__num"
											:end-time="row.expireTime"
										/>
										<span v-else>{{ $t('已过期') }}</span>
									</div>
								</div>
							</div>
						</li>
					</template>
				</app-list>
			</keep-alive>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./index.scss');
.order-list-header--mobile {
	position: sticky;
	top: var(--header-height);
	background: #fff;
	z-index: 20;
	margin-top: -2px;

	.mi-tabs__header {
		margin: 0;
		padding: 0 8px;
	}

	.mi-tabs__item {
		padding: 0 20px !important;
	}

	li {
		margin: 10px 16px;
	}

	.is-active {
		color: var(--text-primary);
	}
}

.order-list-wrapper--mobile {
	.status {
		color: #616161;
	}

	.order--paying .status,
	.order--waiting .status {
		color: #ff6700;
	}

	.order--paid .status,
	.order--ship .status {
		color: #83c44e;
	}
}
</style>
