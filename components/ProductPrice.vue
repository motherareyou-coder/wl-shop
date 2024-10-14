<script setup>
defineOptions({ name: 'ProductPrice' })

const unit = ref('$')
const data = defineModel('data')
</script>

<template>
	<strong class="price">
		<small v-if="!isNaN(data)">{{ unit }}</small>
		{{ data }}
		<slot></slot>
	</strong>
</template>

<style lang="scss" scoped>
strong {
	display: inline-block;
	margin-inline-end: 4px;
	display: inline-block;
	white-space: nowrap;
	small {
		font-size: inherit;
		display: inline-block;
		font-weight: 400;
		white-space: nowrap;
	}
}
</style>
