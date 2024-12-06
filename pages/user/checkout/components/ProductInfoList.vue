<script setup lang="ts">
import type { CartItem } from '~/types'

const productList = defineModel<CartItem[]>('data')

const drawerShow = ref(false)
const appStore = useAppStore()
</script>

<template>
	<div v-if="productList" class="product-overview__header">
		<h2 class="product-overview__title">
			{{ productList.length }}
			{{ productList.length > 1 ? $t('items') : $t('item') }}
		</h2>
		<div v-if="productList?.length > 2 || appStore.isMobile" class="product-overview__action">
			<el-button text @click="drawerShow = true">
				<u class="text-underline">{{ $t('View shopping cart') }}</u>
			</el-button>
		</div>
	</div>
	<template v-if="productList">
		<ul
			v-if="productList.length > 2 || appStore.isMobile"
			class="product-info__thumb-list"
		>
			<li
				v-for="item in productList"
				:key="item.id"
				class="product-info__thumb-item"
			>
				<app-image :src="item.picUrl || item.sku?.picUrl || item.spu?.picUrl" />
			</li>
		</ul>
		<ul v-else class="product-info__list">
			<li
				v-for="item in productList"
				:key="item.id"
				class="product-info__item"
			>
				<div class="product-info__content">
					<app-image :src="item.picUrl || item.sku?.picUrl || item.spu?.picUrl" />
					<div class="product-other">
						<ul class="product-params">
							<li class="product-params__name">
								{{ item.spu?.name || item.spuName || item.name }}
								{{ item.sku?.properties.map(p => p.valueName).join(' ') }}
							</li>
							<li class="product-params__count">
								{{ $t('Quantity') }} : {{ item.count }}
							</li>
							<li class="product-params__flag"></li>
							<li class="product-params__energy"></li>
						</ul>
						<ul class="product-price">
							<div class="mi-price flex flex-col">
								<template v-if="item.sku">
									<product-price
										:data="item.price"
									/>
									<del>
										<product-price
											:data="item.sku?.price"
											plain
										/>
									</del>
								</template>
								<template v-else>
									<product-price
										:data="item.payPrice"
									/>
									<del>
										<product-price
											:data="item.price"
											plain
										/>
									</del>
								</template>
							</div>
						</ul>
					</div>
				</div>
			</li>
		</ul>
		<el-drawer
			v-model="drawerShow"
			:title="$t('Shopping cart')"
			:direction="appStore.isMobile ? 'btt' : 'rtl'"
			append-to-body
			class="product-list-drawer"
		>
			<h2 class="product-overview__title">
				{{ productList.length }}
				{{ productList.length > 1 ? $t('items') : $t('item') }}
			</h2>
			<ul class="product-info__list">
				<li
					v-for="item in productList"
					:key="item.id"
					class="product-info__item"
				>
					<div class="product-info__content">
						<app-image :src="item.picUrl || item.sku?.picUrl || item.spu?.picUrl" />
						<div class="product-other">
							<ul class="product-params">
								<li class="product-params__name">
									{{ item.spu?.name || item.spuName || item.name }}
									{{ item.sku?.properties.map(p => p.valueName).join(' ') }}
								</li>
								<li class="product-params__count">
									{{ $t('Quantity') }} : {{ item.count }}
								</li>
								<li class="product-params__flag"></li>
								<li class="product-params__energy"></li>
							</ul>
							<ul class="product-price">
								<div class="mi-price" :class="[appStore.isMobile ? '' : 'flex flex-col']">
									<template v-if="item.sku">
										<product-price
											:data="item.price"
										/>
										<del>
											<product-price
												:data="item.sku?.price"
												plain
											/>
										</del>
									</template>
									<template v-else>
										<product-price
											:data="item.payPrice"
										/>
										<del>
											<product-price
												:data="item.price"
												plain
											/>
										</del>
									</template>
								</div>
							</ul>
						</div>
					</div>
				</li>
			</ul>
		</el-drawer>
	</template>
</template>

<style>
.product-list-drawer {
	height: 100% !important;
}
</style>
