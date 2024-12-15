<script setup lang="ts">
defineOptions({
	name: 'AppCheckbox',
})
const props = defineProps({
	label: { type: String },
})
const emit = defineEmits(['change'])

const selected = defineModel<boolean>()

function handleClick() {
	selected.value = !selected.value
	emit('change', selected.value)
}
</script>

<template>
	<div class="mi-checkbox__item" role="button" @click="handleClick">
		<input v-show="false" type="checkbox" class="checkbox__input" :checked="selected">
		<div class="checkbox-wrapper mi-checkbox__item--default mi-checkbox__item--left flex items-center">
			<i class="checkbox__icon micon" :class="[selected ? 'micon-checkbox-checked' : 'micon-checkbox-unchecked']" style="color:var(--text-base);"></i>
			<span v-if="props.label" class="checkbox__content">
				{{ props.label }}
			</span>
		</div>
	</div>
</template>
