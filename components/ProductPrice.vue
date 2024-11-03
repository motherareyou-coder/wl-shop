<script setup>
defineOptions({ name: 'ProductPrice' })

const unit = ref('£')
const data = defineModel('data')
</script>

<template>
	<strong class="price">
		<small v-if="data != void 0 && !isNaN(data)">{{ unit }}</small>
		<slot>
			{{ data }}
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
