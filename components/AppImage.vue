<script setup>
defineOptions({ name: 'AppImage' })

const props = defineProps({
	src: { type: String },
})
const src = computed(() => props.src)
</script>

<template>
	<el-image :src="src" class="max-w-full shrink-0" />
</template>
