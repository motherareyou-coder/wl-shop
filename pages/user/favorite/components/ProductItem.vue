<script setup>
const emit = defineEmits('cancel')
const data = defineModel('data', { default: () => ({}) })
const router = useRouter()
function onClick() {
	router.push($path(`/product/${data.value.id}`))
}

const appStore = useAppStore()
</script>

<template>
	<li class="mi-product__item-wrapper">
		<div class="mi-product__item">
			<div class="item__figure-container">
				<app-image
					class="mi-image item__image"
					:src="data.img"
					@click="onClick"
				/>
			</div>
			<div class="item__info">
				<div class="item__info-section w-full">
					<h3
						class="item__title items-center w-full"
						style="display: flex"
						:class="[
							appStore.isPC
								? 'justify-center'
								: 'justify-between',
						]"
						@click="onClick"
					>
						<span>
							{{ data.id }}
						</span>
						<el-icon
							class="ml-2"
							style="color: #ff6900"
							@click.stop="emit('cancel')"
						>
							<el-icon-star />
						</el-icon>
					</h3>
				</div>
				<div class="item__info-section item__info__translate">
					<product-price
						class="mi-price item__price"
						:data="data.price"
					/>
					<button @click.prevent="onClick">
						{{ $t('Shop Now') }}
					</button>
				</div>
			</div>
		</div>
	</li>
</template>

<style lang="scss" scoped>
.mi-product__item {
	.item__info__translate {
		position: relative;
		button {
			background: #191919;
			border-radius: 10.5px;
			color: #fff;
			font-weight: 700;
			opacity: 0;
			position: absolute;
			white-space: nowrap;
			padding: 6px 12px;
			transition: 0.3s;
			font-size: var(--item-font-size);
			@media screen and (max-width: 720px) {
				display: none;
			}
		}
	}
	.price {
		transition: all 0.3s;
	}
	&:hover {
		button {
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
