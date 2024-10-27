<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps({
	category: { type: Number },
	data: { type: Array as () => Product[], default: () => [] },
})
const emit = defineEmits(['mouseenter', 'mouseleave', 'link-click'])
const data = toRef(props, 'data')

const onmouseenter = () => emit('mouseenter')
const onmouseleave = () => emit('mouseleave')
</script>

<template>
	<div
		class="submenu__wrapper site-container"
		@mouseenter="onmouseenter"
		@mouseleave="onmouseleave"
	>
		<div class="submenu__product">
			<div class="submenu__product-group submenu__product-group--show">
				<div class="submenu__product-group-list">
					<nuxt-link
						v-for="item in data"
						:key="item.id"
						:to="$path(`/product/${item.id}`)"
						class="header-product-item"
						@click="emit('link-click')"
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
						:to="$path(`/product-list?categoryId=${props.category}`)"
						@click="emit('link-click')"
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
