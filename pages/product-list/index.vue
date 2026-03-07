<script setup lang="ts">
import type { Category } from '~/types'
import Mobile from './components/Mobile.vue'
import PC from './components/PC.vue'

defineOptions({ name: 'ProductListCache' })
const route = useRoute()
const productScopeValues = ref([])
const categoryId = ref<number | string | null>(null)
const query = ref(route.query.query)
const keyword = ref()
const { shortDomain, domain } = useRuntimeConfig().public
const { gtag } = useGtag()
// 商品列表页面埋点
gtag('event', 'screen_view', {
	app_name: shortDomain,
	screen_name: 'product-list',
})
watchEffect(() => {
	query.value = route.query.query
	keyword.value = route.query.query
})

// SEO 优化
useSEO({
	routeKey: 'productList',
	categoryData: curCat.value || undefined,
	searchQuery: keyword.value || undefined,
	breadcrumbs: [
		{ name: 'Home', url: domain },
		{ name: curCat.value?.name || 'Product List', url: `${domain}${route.path}` },
	],
})

const appStore = useAppStore()
const { data: categories, refresh: refreshCategories } = await useAPI<Category[]>('product/category/list/top', {
	params: { ids: productScopeValues.value, num: 5 },
})
const curCat = ref<Category | null>(null)
const curCat1 = ref<Category | null>(null)
const expanded = ref(false)

watch(expanded, (v) => {
	if (appStore.isMobile) {
		document.body.style.overflow = v ? 'hidden' : 'auto'
	}
})

watch(
	() => route.fullPath,
	() => {
		categoryId.value = route.query.categoryId || ''
		query.value = route.query.query
		productScopeValues.value
			= route.query.productScopeValues?.split(',') || []

		if (categoryId.value) {
			curCat.value = categories.value?.find(c => c.childCategory.find(cc => cc.id == categoryId.value))
			// console.log(curCat.value)
			expanded.value = appStore.isPC && !!curCat.value
		}
	},
	{ immediate: true },
)

watch(productScopeValues, refreshCategories)

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

function handleClick(item = null) {
	categoryId.value = item?.id
	if (!item)
		curCat.value = item
	curCat1.value = item
	expanded.value = false
}

const activeNames = ref(categories.value?.map(d => d.id))
</script>

<template>
	<main class="product-catalogue-main" :class="[appStore.isMobile ? 'bg-white' : '']">
		<div class="product-catalogue site-container-1400 w-full mx-auto">
			<div v-if="appStore.isMobile" class="product-catalogue__filter product-catalogue__filter--mobile" :class="{ 'product-catalogue__filter--expand': expanded }">
				<div class="condition-title">
					<div class="select-entry" :class="{ 'select-entry--expand': expanded }" @click="expanded = !expanded">
						{{ curCat1?.name || curCat?.name || $t('All Products') }}
						<i class="micon micon-up"></i>
					</div>
					<div class="select-entry ">
						<li class="">
							<el-input
								v-model="query"
								clearable
								@keydown.enter="keyword = query"
							/>
						</li>
					</div>
				</div>
				<div class="condition-title">
					<template v-for="(f, i) in fileds" :key="f.value">
						<li
							class="select-entry sort-item"
							:class="{ 'sort-item--active': sortField === f.value }"
							@click="setSort(f.value)"
						>
							{{ f.label }}
							<i
								v-if="f.value === 'price'"
								class="micon micon-arrow-up condition-list__icon"
								:class="{ down: !sortAsc }"
							></i>
						</li>
						<li
							v-if="i !== fileds.length - 1"
							class="condition-list__separator"
						></li>
					</template>
				</div>
				<div class="condition-content">
					<el-collapse v-model="activeNames" class="mi-accordion filter-accordion">
						<button class="mi-collapse-item__header is-active" :aria-label="$t('All products')" @click="handleClick()">
							{{ $t('All products') }}
						</button>
						<el-collapse-item v-for="cat in categories" :key="cat.id" :title="cat.name" :name="cat.id">
							<div class="group__body" style="color:var(--text-secondary);padding-left: 1.25rem">
								<div v-for="item in cat.childCategory" :key="item.id" class="accordion__item" :class="{ 'accordion__item--selected': categoryId == item.id }" @click="handleClick(item)">
									<span class="item__content">{{ item.name }}</span>
								</div>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
			<div v-if="appStore.isPC" class="product-catalogue__filter">
				<ul class="condition-list">
					<li class="category-filter inline-flex items-center" @click="expanded = !expanded">
						{{ $t('Categories') }}
						<i class="micon micon-up condition-list__icon" :class="{ expand: expanded }"></i>
					</li>
					<template v-for="(f, i) in fileds" :key="f.value">
						<li
							class="sort-item"
							:class="{ 'sort-item--active': sortField === f.value }"
							@click="setSort(f.value)"
						>
							{{ f.label }}
							<i
								v-if="f.value === 'price'"
								class="micon micon-arrow-up condition-list__icon"
								:class="{ down: !sortAsc }"
							></i>
						</li>
						<li
							v-if="i !== fileds.length - 1"
							class="condition-list__separator"
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
				<div v-if="appStore.isPC" class="cat-list cat-list--style-two bg-white" :class="{ 'cat-list--expand': expanded }">
					<div class="cat-list__primary">
						<div class="primary__item" @click="curCat = null;categoryId = null">
							<span class="cat-list__item cat-list__item--prominent" :class="{ 'cat-list__item--current': curCat === null }">
								{{ $t('All Products') }}
							</span>
						</div>
						<div v-for="cat in categories" :key="cat.id" class="primary__item" @click="curCat = cat">
							<span class="cat-list__item cat-list__item--prominent" :class="{ 'cat-list__item--current': curCat?.id == cat.id }">
								{{ cat.name }}
							</span>
						</div>
					</div>
					<div v-if="curCat" class="cat-list__group">
						<div class="group__secondary">
							<div class="group__tertiary">
								<el-radio
									v-for="item in curCat.childCategory" :key="item.id" v-model="categoryId" :value="`${item.id}`"
								>
									{{ item.name }}
								</el-radio>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="product-catalogue__container">
				<component
					:is="{ pc: PC, mobile: Mobile }[appStore.deviceType as string]"
					:params="params"
					:scope-values="productScopeValues"
				/>
				<div v-if="appStore.isMobile && expanded" class="product-catalogue__mask" @click="expanded = false"></div>
			</div>
		</div>
	</main>
</template>

<style lang="scss">
@import url('./index.scss');
</style>
