<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps({
	data: { type: Array as () => Product[], default: () => [] },
	show: { tyoe: Boolean, default: false },
})
const emit = defineEmits(['mouseenter', 'mouseleave', 'link-click'])
const data = toRef(props, 'data')

const curCat = ref(data.value[0])
watch(() => props.show, (v) => {
	if (!v)
		curCat.value = data.value[0]
})

const onmouseenter = () => emit('mouseenter')
const onmouseleave = () => emit('mouseleave')
</script>

<template>
	<div
		class="submenu__wrapper site-container"
		:class="{
			[`submenu__wrapper--pc-show`]: props.show,
		}"
		@mouseenter="onmouseenter"
		@mouseleave="onmouseleave"
	>
		<div class="submenu__content">
			<div v-for="cat in props.data" :key="cat.id" class="submenu__item">
				<div class="submenu__item-title" @mouseenter="curCat = cat">
					<span :class="{ 'submenu__item--open': curCat === cat }">
						<nuxt-link :to="$path(`/product-list?categoryId=${cat.id}`)">
							{{ cat.name }}
						</nuxt-link>
					</span>
				</div>
				<div class="submenu__item-content">
				</div>
			</div>
		</div>
		<div class="submenu__product">
			<div v-for="cat in props.data" :key="cat.id" class="submenu__product-group " :class="{ 'submenu__product-group--show': cat === curCat }">
				<div class="submenu__product-group-list">
					<nuxt-link
						v-for="item in cat.childProduct"
						:key="item.id"
						:to="$path(`/product/${item.id}`)"
						class="header-product-item"
					>
						<app-image
							:src="item.picUrl"
							class="header-product-item__image"
						/>
						<div class="header-product-item__info">
							<div class="header-product-item__title">
								{{ item.name }}
							</div>
						</div>
					</nuxt-link>
				</div>
				<div class="submenu-footer">
					<nuxt-link
						class="submenu-footer__item"
						:to="$path(`/product-list?categoryId=${cat.id}`)"
					>
						{{ $t('All Products') }}
						<el-icon>
							<ElIconArrowRight />
						</el-icon>
					</nuxt-link>
				</div>
			</div>
		</div>
	</div>
</template>
