<script setup>
const steps = [
	{
		label: 'ShoppingCart',
		path: '/cart',
		value: 0,
	},
	{
		label: 'Checkout',
		path: '/checkout',
		value: 1,
	},
	{
		label: 'Review',
		path: '/review',
		value: 2,
	},
]
const route = useRoute()
const activeStep = ref(0)
watchEffect(() => {
	console.log(route)

	activeStep.value = steps.find(s => route.path.includes(s.path))?.value || 0
})
</script>

<template>
	<nav class="shopping-nav">
		<div class="shopping-nav__wrapper">
			<div
				v-for="s in steps"
				:key="s.value"
				class="shopping-nav__step"
				:class="{ active: activeStep >= s.value }"
			>
				<strong>{{ s.value + 1 }}</strong>
				<span>{{ s.label }}</span>
			</div>
		</div>
	</nav>
</template>

<style lang="scss" scoped>
.shopping-nav {
	background-color: #fff;
	@media screen and (min-width: 721px) and (max-width: 1024px) {
		font-size: 12px;
		--font-size: 12px;
	}

	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		font-size: 16px;
		--font-size: 16px;
	}

	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		font-size: 18px;
		--font-size: 18px;
	}

	@media screen and (min-width: 1921px) {
		font-size: 18px;
		--font-size: 18px;
	}

	@media screen and (max-width: 720px) {
		display: none !important;
	}
	.shopping-nav__wrapper {
		align-items: center;
		display: flex;
		justify-content: center;
		margin-top: 1px;
		position: relative;
		width: 100%;
		.shopping-nav__step {
			color: var(--brand-grey-40);
			display: flex;
			align-items: center;
			@media screen and (min-width: 721px) and (max-width: 1024px) {
				height: 70px;
			}

			@media screen and (min-width: 1025px) and (max-width: 1440px) {
				height: 82px;
			}

			@media screen and (min-width: 1441px) and (max-width: 1920px) {
				height: 110px;
			}

			@media screen and (min-width: 1921px) {
				height: 110px;
			}
			strong {
				background-color: var(--color-white, #fff);
				color: var(--brand-grey-40);
				font-weight: 500;
				border-radius: 10px;
				border: 3.5px solid var(--brand-grey-40);
				width: calc(var(--font-size) * 2);
				height: calc(var(--font-size) * 2);
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
				height: 1px;
				@media screen and (min-width: 721px) and (max-width: 1024px) {
					margin: 0 10px;
					width: 80px;
				}

				@media screen and (min-width: 1025px) and (max-width: 1440px) {
					margin: 0 14px;
					width: 192px;
				}

				@media screen and (min-width: 1441px) and (max-width: 1920px) {
					margin: 0 18px;
					width: 257px;
				}

				@media screen and (min-width: 1921px) {
					margin: 0 18px;
					width: 257px;
				}
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
</style>
