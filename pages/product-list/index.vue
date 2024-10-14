<script setup>
import ProductItem from './components/ProductItem.vue'

const data = ref([
	{
		id: 1,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		id: 2,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		id: 3,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		id: 4,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		id: 5,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		id: 6,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		id: 7,
		img: '/imgs/5.png',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
])

const categories = ref([
	{ id: '1', value: 'store' },
	{ id: '2', value: 'mobile' },
	{ id: '3', value: 'wearables' },
	{ id: '4', value: 'smarthome' },
	{ id: '5', value: 'lifestyle' },
])

const category = ref()
const expand = ref(false)
const sort = ref('')
const priceSort = ref(false)
function setSort(t) {
	switch (t) {
		case 'price':
			if (sort.value === t)
				priceSort.value = !priceSort.value
			else sort.value = t
			break
		default:
			sort.value = t
			priceSort.value = false
			break
	}
}
</script>

<template>
	<div class="app-product-list">
		<section class="filter app-grid--vertical-100">
			<div class="condition-list">
				<li class="category-filter" @click="expand = !expand">
					Categoris
					<ElIcon :class="{ expand }">
						<ElIconArrowUp />
					</ElIcon>
				</li>
				<li
					:class="{ active: sort === 'Relevance' }"
					@click="setSort('Relevance')"
				>
					Relevance
				</li>
				<li class="separator"></li>
				<li :class="{ active: sort === 'New' }" @click="setSort('New')">
					New
				</li>
				<li class="separator"></li>
				<li
					class="price"
					:class="{ active: sort === 'price' }"
					@click="setSort('price')"
				>
					Price
					<ElIcon :class="{ expand: priceSort }">
						<Icon name="icon:up" />
					</ElIcon>
				</li>
			</div>
			<div class="category-list" :class="{ expand }">
				<div
					v-for="item in categories"
					:key="item.id"
					class="category-item"
					:class="{ active: category === item.value }"
					@click="category = item.value"
				>
					{{ $t(item.value) }}
				</div>
			</div>
		</section>
		<section class="app-grid--vertical-100">
			<div class="product-list">
				<ProductItem v-for="item in data" :key="item.id" :data="item" />
			</div>
		</section>
		<section class="app-grid--vertical-100">
			<el-pagination />
		</section>
	</div>
</template>

<style lang="scss" scoped>
.app-product-list {
	--margin-vertical: 20px;
	.filter {
		.condition-list {
			padding: 32px;
			background-color: #fff;
			--filter-font-size: 20px;
			--filter-item-margin-right: 40px;
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
				&.category-filter {
					display: inline-flex;
					align-items: center;
				}
				.el-icon {
					margin-inline-start: 8px;
					font-size: var(--filter-font-size);
					display: inline-block;
					transition: all 0.2s;
					transform: rotate(0);
					transform-origin: 50% 50%;
					color: inherit;
					&.expand {
						transform: rotate(180deg);
					}
				}
			}
		}
	}
	.category-list {
		background-color: #fff;
		--border-color: transparent;
		--item-margin-bottom: 24px;
		--item-font-size: 18px;
		--group-margin-bottom: 40px;
		border-top: 2px solid var(--border-color);
		box-sizing: border-box;
		font-size: 18px;
		height: 0;
		max-height: 0;
		overflow: hidden;
		padding: 0 64px;
		transition: all 0.3s;
		&.expand {
			--cat-padding-top: var(--cat-padding-vertical);
			--cat-padding-bottom: var(--cat-padding-vertical);
			--border-color: var(--background-base);
			height: auto;
			max-height: 2000px;
			padding: 32px 64px;
		}
		.category-item {
			display: inline-block;
			cursor: pointer;
			--item-margin-right: 80px;
			flex-shrink: 0;
			margin-inline-end: var(--item-margin-right);
			border-bottom: var(--border-bottom-width) solid transparent;
			padding-bottom: var(--padding-bottom);
			transition: all 0.2s;
			&.active {
				border-bottom-color: var(--brand-orange, #ff6900);
			}
			@media screen and (min-width: 1921px) {
				--padding-bottom: 12px;
				--item-font-size: 24px;
				--border-bottom-width: 4px;
			}
		}
	}
	.product-list {
		--grid-columns: 4;
		--grid-gap: 16px;
		grid-gap: var(--grid-gap);
		display: grid;
		gap: var(--grid-gap);
		grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
	}
}
</style>
