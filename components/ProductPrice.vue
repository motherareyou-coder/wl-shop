<script setup>
import Big from 'big.js'

defineOptions({ name: 'ProductPrice' })

const props = defineProps({
	plain: { type: Boolean, default: () => false },
	unit: { type: String },
})

const { currency } = useRuntimeConfig().public
const unit = ref((currency || '£'))
const data = defineModel('data')
watchEffect(() => {
	unit.value = props.unit ?? unit.value
})

const isNumber = ref(true)
const price = computed(() => {
	if (Number.isNaN(Number(data.value)) || data.value == void 0) {
		// eslint-disable-next-line vue/no-side-effects-in-computed-properties
		isNumber.value = false
		return data.value ?? ''
	}
	else {
		// eslint-disable-next-line vue/no-side-effects-in-computed-properties
		isNumber.value = true
		const b = new Big(data.value).div(100)
		return b.abs().toFixed(2)
	}
})
</script>

<template>
	<template v-if="props.plain">
		{{ unit + price }}
	</template>
	<strong v-else class="price notranslate">
		<small v-if="isNumber">{{ data < 0 ? '-' : '' }}{{ unit }}</small>
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
