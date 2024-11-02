<script setup lang="ts">
const props = defineProps({
	min: { type: Number, default: 1 },
	max: { type: Number, default: Infinity },
	disabled: { type: Boolean },
})
const emit = defineEmits(['change'])

const qty = defineModel<number>({ default: () => 0 })
const data = ref(qty.value)

watch(qty, (v) => {
	data.value = v
})

function decrease() {
	if (props.disabled)
		return
	if (data.value > props.min) {
		emit('change', data.value - 1)
	}
}
function increase() {
	if (props.disabled)
		return
	if (data.value < props.max)
		emit('change', data.value + 1)
}
function handleChange() {
	if (props.disabled)
		return
	if (
		Number.isNaN(data.value)
		|| data.value < props.min
		|| data.value > props.max
	) {
		return (data.value = qty.value)
	}
	emit('change', data.value)
}
</script>

<template>
	<div>
		<div
			class="quantity-section__button"
			:class="{ 'quantity-section__button--disabled': data <= 1 }"
			@click="decrease"
		>
			<el-icon class="micon-quantity-decrease">
				<ElIconMinus />
			</el-icon>
		</div>
		<input
			v-model.number="data"
			:min="props.min"
			:max="props.max"
			:step="1"
			class="quantity-section__value"
			:disabled="props.disabled"
			@change="handleChange"
		>
		<div
			class="quantity-section__button"
			:class="{
				'quantity-section__button--disabled': data >= props.max,
			}"
			aria-label="Increase the quantity"
			@click="increase"
		>
			<el-icon class="micon micon-quantity-increase">
				<ElIconPlus />
			</el-icon>
		</div>
	</div>
</template>
