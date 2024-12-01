<script setup>
import './CartNav.scss'

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
const route = useRoute()
const activeStep = ref(0)
watchEffect(() => {
	activeStep.value = steps.find(s => route.path.includes(s.key))?.value
})
</script>

<template>
	<nav v-if="activeStep && !route.query.bargainRecordId" class="shopping-nav">
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
