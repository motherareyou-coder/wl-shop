<script setup>
import Big from 'big.js'

defineOptions({ name: 'ProductPrice' })

const { currency } = useRuntimeConfig().public
const unit = ref(currency || '£')
const data = defineModel('data')

const price = computed(() => {
	if (Number.isNaN(data.value) || data.value == void 0)
		return ''
	const b = new Big(data.value).div(100)
	return b.abs().toFixed(2)
})
</script>

<template>
	<strong class="price">
		<small v-if="price">{{ data < 0 ? '-' : '' }}{{ unit }}</small>
		<slot>
			{{ price }}
		</slot>
	</strong>
</template>

<style lang="scss" scoped>
strong {
	display: inline-block;
	// margin-inline-end: 4px;
	white-space: nowrap;
	small {
		font-size: inherit;
		display: inline-block;
		font-weight: 400;
		white-space: nowrap;
	}
}
</style>
