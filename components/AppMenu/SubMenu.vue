<script setup>
const props = defineProps({
	type: { type: String },
})
const emit = defineEmits(['mouseenter', 'mouseleave'])
const list = ref([
	{ label: '商品1', img: 'imgs/test.webp', id: 1 },
	{ label: '商品2', img: 'imgs/test.webp', id: 2 },
	{ label: '商品3', img: 'imgs/test.webp', id: 3 },
	{ label: '商品4', img: 'imgs/test.webp', id: 4 },
	{ label: '商品5', img: 'imgs/test.webp', id: 5 },
])
const { locale } = useI18n()
const localePath = useLocalePath()

const onmouseenter = () => emit('mouseenter')
const onmouseleave = () => emit('mouseleave')
</script>

<template>
	<div
		class="submenu__wrapper"
		@mouseenter="onmouseenter"
		@mouseleave="onmouseleave"
	>
		<div class="submenu__content site-container">
			<div class="submenu__product-group-list">
				<nuxt-link
					v-for="item in list"
					:key="item.id"
					:to="localePath(`/product/${item.id}`, locale)"
					class="product-item"
				>
					<picture>
						<img :src="item.img">
					</picture>
					<div class="item-info">
						<div class="title">
							{{ item.label }}
						</div>
					</div>
				</nuxt-link>
			</div>
			<div class="submenu-footer">
				<nuxt-link :to="localePath('/product-list', locale)">
					All Products
					<ElIconArrowRight />
				</nuxt-link>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.submenu__wrapper {
	width: 100%;
	background-color: var(--background-white);
	position: absolute;
	transition: all 0.2s ease;
	opacity: 0;
	z-index: 0;
	--margin-vertical: 0;
	&.show {
		opacity: 1;
		z-index: 1;
	}
	.submenu__content {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 20px var(--app-horizontal-padding);
	}
	.submenu__product-group-list {
		grid-column-gap: 20px;
		-moz-column-gap: 20px;
		column-gap: 20px;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		flex: 1 1;
		margin-inline-start: 22px;
		margin-top: 26px;
		position: relative;
		.product-item {
			background: hsla(0, 0%, 97%, 0.9);
			border-radius: 12px;
			color: #191919;
			color: var(--text-base);
			display: flex;
			flex-direction: column;
			font-size: 12px;
			position: relative;
			text-align: center;
			.picture {
				@media screen and (min-width: 1025px) and (max-width: 1440px) {
					padding: 40px 30px 24px;
				}
			}
		}
	}
	picture {
		--mi-image-width: 100%;
		--mi-image-height: 100%;
		display: flex;
		@media screen and (min-width: 1025px) and (max-width: 1440px) {
			padding: 40px 30px 24px;
		}

		@media screen and (min-width: 1441px) and (max-width: 1920px) {
			padding: 40px 34px 24px;
		}

		@media screen and (min-width: 1921px) {
			padding: 40px 54px 24px;
		}
	}
	img {
		height: var(--mi-image-height, 100%);
		object-fit: cover;
		object-position: center;
		width: var(--mi-image-width, 100%);
		aspect-ratio: 1 / 1;
		object-fit: cover;
		width: 100%;
	}
	.item-info {
		color: var(--text-base);
		font-size: 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-inline-start: 0;
		.title {
			margin: 0 14px 40px;
		}
	}
	.submenu-footer {
		color: var(--text-base);
		display: flex;
		font-size: 14px;
		justify-content: flex-end;
		padding: 40px 0 64px;
		text-align: right;
		a {
			display: flex;
			align-items: center;
			white-space: nowrap;
			svg {
				color: #898989;
				color: var(--text-secondary);
				margin-inline-start: 4px;
				width: 14px;
				height: 14px;
			}
		}
	}
}
</style>
