<script setup>
defineOptions({ name: 'ProductPrice' })

const unit = ref('$')
const data = defineModel('data')
</script>

<template>
	<strong class="price">
		<small>{{ unit }}</small>
		{{ data }}
	</strong>
</template>

<style lang="scss" scoped>
strong {
	display: inline-block;
	margin-inline-end: 4px;
	font-size: 16px;
	display: inline-block;
	font-weight: 400;
	white-space: nowrap;
	small {
		font-size: inherit;
		display: inline-block;
		font-weight: 400;
		white-space: nowrap;
	}
}
</style>
