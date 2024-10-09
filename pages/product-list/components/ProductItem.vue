<script setup>
const data = defineModel('data')
const unit = ref('$')
</script>

<template>
	<nuxt-link :to="localePath(`/product/${data.id}`, locale)">
		<div class="product-item">
			<img :src="data.img" alt="" />
			<div class="item-info">
				<span>
					{{ data.id }}
				</span>
				<div class="item-info__translate">
					<strong class="price">
						<small>{{ unit }}</small>
						{{ data.price }}
					</strong>
					<div class="item-info__button-wrapper">
						<button>Shop Now</button>
					</div>
				</div>
			</div>
		</div>
	</nuxt-link>
</template>

<style lang="scss" scoped>
.product-item {
	background-color: #fff;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	padding: 24px 30px;
	--img-width: 160px;
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: var(--grid-main-row-height);
	@media screen and (min-width: 721px) and (max-width: 1024px) {
		--img-width: 110px;
		padding: 16px 20px;
	}
	img {
		object-fit: cover;
		object-position: center;
		height: var(--mi-image-height, 300px);
		width: var(--mi-image-width, 300px);
	}

	img {
		font-size: 12px;
		line-height: 1.2;
	}
	.item-info {
		margin-top: 12px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		width: 100%;
		align-items: center;
		box-sizing: border-box;
		grid-column: span 1;
		flex: 1;
		span {
			margin-top: 12px;
			font-weight: 700;
		}
	}
	.item-info__translate {
		margin-top: 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		width: 100%;
		text-align: center;
		align-items: center;
	}
	.item-info__button-wrapper {
		left: 0;
		opacity: 0;
		position: absolute;
		top: 100%;
		transition: all 0.3s;
		width: 100%;
		button {
			background-color: #191919;
			border-radius: 8px;
			color: #fff;
			font-size: 12px;
			padding: 4px 12px;
			cursor: pointer;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-word;
			font-size: 12px;
			width: fit-content;
		}
	}
	.price {
		transition: all 0.3s;
	}
	&:hover {
		.item-info__button-wrapper {
			opacity: 1;
			top: 50%;
			transform: translateY(-50%);
			transition-delay: 0.2s;
		}
		.price {
			opacity: 0;
			transform: translateY(-20%);
		}
	}
}
</style>
