<script setup lang="ts">
import Checkout from './components/Checkout.vue'
import Review from './components/Review.vue'
import ShoppingCart from './components/ShoppingCart.vue'

defineOptions({ name: 'Cart' })

const { t } = useI18n()
useHead({
	title: `${t('cart')} ${t('appTitle')}`,
	meta: [{ name: 'description', content: 'Cart' }],
})

const step = ref(0)
const components = [ShoppingCart, Checkout, Review]
const steps = [
	{
		label: 'ShoppingCart',
		value: 0,
	},
	{
		label: 'Checkout',
		value: 1,
	},
	{
		label: 'Review',
		value: 2,
	},
]
</script>

<template>
	<div class="app-cart">
		<div class="nav">
			<div class="steps app-grid--vertical-100">
				<div
					v-for="s in steps"
					:key="s.value"
					class="step"
					:class="{ active: step >= s.value }"
				>
					<strong>{{ s.value + 1 }}</strong>
					<span>{{ s.label }}</span>
				</div>
			</div>
		</div>
		<div class="cart-container app-grid--vertical-100">
			<keep-alive>
				<component :is="components[step]" class="container" />
			</keep-alive>
		</div>
	</div>
</template>

<style scoped lang="scss">
.app-cart {
	--brand-grey-40: #d0d0d0;
	--brand-black: #191919;
	.nav {
		background-color: #fff;
		--margin-vertical: 0;
		.steps {
			height: 110px;
			display: flex;
			justify-content: center;
			align-items: center;
			.step {
				font-size: 18px;
				color: var(--brand-grey-40);
				display: flex;
				align-items: center;
				strong {
					background-color: var(--color-white, #fff);
					color: var(--brand-grey-40);
					font-size: 18px;
					font-weight: 500;
					border-radius: 10px;
					border: 3.5px solid var(--brand-grey-40);
					width: 28px;
					height: 28px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 8px;
					box-sizing: border-box;
				}
				&:not(:first-of-type)::before {
					content: ' ';
					background-color: var(--brand-grey-40);
					margin: 0 18px;
					width: 257px;
					height: 1px;
				}
				&.active {
					color: var(--brand-black);
					strong {
						border-color: var(--brand-black);
						background-color: var(--brand-black);
					}
				}
			}
		}
	}
	.cart-container {
		--margin-vertical: 12px;
		.container {
			display: grid;
			width: 100%;
			@media screen and (max-width: 720px) {
				gap: var(--margin-gap);
				grid-template-columns: 1fr;
			}

			@media screen and (min-width: 721px) and (max-width: 1024px) {
				gap: 0 var(--margin-gap);
				grid-template-columns: 1fr 284px;
			}

			@media screen and (min-width: 1025px) and (max-width: 1440px) {
				gap: 0 var(--margin-gap);
				grid-template-columns: 1fr 388px;
			}

			@media screen and (min-width: 1441px) and (max-width: 1920px) {
				gap: 0 var(--margin-gap);
				grid-template-columns: 1fr 518px;
			}

			@media screen and (min-width: 1921px) {
				gap: 0 var(--margin-gap);
				grid-template-columns: 1fr 518px;
			}
		}
	}
}
</style>
