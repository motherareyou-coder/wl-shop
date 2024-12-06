<script setup>
import './CartNav.scss'

const props = defineProps({
	value: { type: Number },
})
const steps = [
	{
		label: $t('ShoppingCart'),
		key: 'cart',
		value: 1,
	},
	{
		label: $t('Checkout'),
		key: 'checkout',
		value: 2,
	},
	{
		label: $t('Review'),
		key: 'review',
		value: 3,
	},
]
const activeStep = computed(() => props.value)
</script>

<template>
	<nav class="shopping-nav">
		<div class="shopping-nav__wrapper">
			<div
				v-for="s in steps"
				:key="s.value"
				class="shopping-nav__step "
				:class="{ 'shopping-nav__step--highlight': activeStep >= s.value }"
			>
				<span class="shopping-nav__number " :class="{ 'shopping-nav__number--highlight': activeStep >= s.value }">
					<i v-if="activeStep >= s.value" class="micon micon-step-active"></i>
					<i v-else class="micon micon-step-empty"></i>
					<strong>{{ s.value }}</strong>
				</span>
				<span class="shopping-nav__text">
					{{ s.label }}
				</span>
			</div>
		</div>
	</nav>
</template>
