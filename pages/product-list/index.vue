<script setup lang="ts">
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'
import type { Category } from '~/types'
import './index.scss'

defineOptions({ name: 'ProductListCache' })
const route = useRoute()
const productScopeValues = ref([])
const categoryId = ref(route.query.categoryId)
const query = ref(route.query.query)
watch(
	() => route.fullPath,
	() => {
		categoryId.value = route.query.categoryId
		query.value = route.query.query
		productScopeValues.value
			= route.query.productScopeValues?.split(',') || []
	},
	{ immediate: true },
)
useHead({
	title: `${$t('Product List')} ${$t('appTitle')}`,
})

const appStore = useAppStore()
const categories = ref<Category[]>([])
function refreshCategories() {
	$api('product/category/list?apifoxApiId=217665537', {
		params: { ids: productScopeValues.value },
	}).then((res) => {
		categories.value.splice(0, categories.value.length, ...res)
		// if (!categories.value.find(c => c.id === categoryId.value))
		// 	categoryId.value = null
	})
}
refreshCategories()

watch(productScopeValues, refreshCategories)

const keyword = ref()
const sortField = ref('Relevance')
const sortAsc = ref(true)

const params = computed(() => {
	const obj = {
		categoryId: categoryId.value,
		keyword: keyword.value,
	}
	switch (sortField.value) {
		case 'Relevance':
			break
		case 'new':
			obj.sortAsc = false
			break
		case 'price':
			obj.sortField = sortField.value
			obj.sortAsc = sortAsc.value
			break
		case 'salesCount':
			obj.sortField = sortField.value
			obj.sortAsc = false
			break
	}
	return obj
})

const fileds = [
	{ label: $t('Relevance'), value: 'Relevance' },
	{ label: $t('New'), value: 'new' },
	{ label: $t('Price'), value: 'price' },
	{ label: $t('Sales'), value: 'salesCount' },
]

function setSort(t: string) {
	if (sortField.value === t && t === 'price') {
		sortAsc.value = !sortAsc.value
	}
	else {
		sortField.value = t
		sortAsc.value = true
	}
}
</script>

<template>
	<main class="product-list">
		<div class="product-list__container site-container-1400">
			<div class="product-filter">
				<ul class="condition-list">
					<li class="category-filter">
						<el-select
							v-model="categoryId"
							:placeholder="$t('Categoris')"
						>
							<el-option
								v-for="c in categories"
								:key="c.id"
								:label="c.name"
								:value="c.id"
							/>
						</el-select>
					</li>
					<template v-for="(f, i) in fileds" :key="f.value">
						<li
							class="price"
							:class="{ active: sortField === f.value }"
							@click="setSort(f.value)"
						>
							{{ f.label }}
							<i
								v-if="f.value === 'price'"
								class="micon micon-arrow-up condition-list__icon"
								:class="{ expand: sortAsc }"
							></i>
						</li>
						<li
							v-if="i !== fileds.length - 1"
							class="separator"
						></li>
					</template>
					<li class="">
						<el-input
							v-model="query"
							clearable
							@keydown.enter="keyword = query"
						/>
					</li>
				</ul>
			</div>
			<component
				:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
				:params="params"
				:scope-values="productScopeValues"
			/>
		</div>
	</main>
</template>

<style lang="scss" scoped>
.product-list {
	@media screen and (max-width: 720px) {
		--grid-columns: 1;
		--grid-gap: 16px;
		--category-filter-width: 100px;
		--filter-font-size: 12px;
		--filter-item-margin-right: 8px;
		--cat-padding-horizontal: 6px;
	}
	@media screen and (min-width: 721px) and (max-width: 1024px) {
		--grid-columns: 3;
		--grid-gap: 8px;
		--category-filter-width: 100px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 8px;
	}
	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		--grid-columns: 4;
		--grid-gap: 12px;
		--category-filter-width: 120px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 8px;
	}
	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		--grid-columns: 4;
		--grid-gap: 12px;
		--category-filter-width: 150px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 10px;
	}
	@media screen and (min-width: 1921px) {
		--grid-columns: 4;
		--grid-gap: 16px;
		--category-filter-width: 180px;
		--filter-font-size: 18px;
		--filter-item-margin-right: 24px;
		--cat-padding-horizontal: 14px;
	}
	.product-list__container {
		margin: var(--grid-gap) auto;
		position: relative;
		@media screen and (max-width: 720px) {
			margin: 0 auto;
		}
	}
	.product-filter {
		padding: var(--grid-gap);
		box-sizing: border-box;
		@media screen and (max-width: 720px) {
			padding: 0;
			position: sticky;
		}
		.condition-list {
			padding: var(--cat-padding-horizontal);
			background-color: #fff;
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			font-size: var(--filter-font-size);
			margin-bottom: var(--common-distance);
			font-weight: 400;
			li {
				color: #898989;
				color: var(--text-secondary);
				cursor: pointer;
				margin-top: calc(var(--filter-item-margin-right) / 4);
				margin-bottom: calc(var(--filter-item-margin-right) / 4);
				margin-inline-end: var(--filter-item-margin-right);
				&:hover,
				&.active {
					color: var(--text-primary);
				}
				&.separator {
					background: #191919;
					background: var(--background-black);
					height: 20px;
					width: 1px;
					cursor: unset;
				}
				&.price {
					display: inline-flex;
					align-items: center;
				}
				&.category-filter .mi-select {
					width: var(--category-filter-width) !important;
				}
				.mi-icon {
					margin-inline-start: 8px;
					font-size: var(--filter-font-size);
					display: inline-block;
					transition: all 0.2s;
					transform: rotate(180deg);
					transform-origin: 50% 50%;
					color: inherit;
					&.expand {
						transform: rotate(0);
					}
				}
			}
		}
	}
}
</style>
