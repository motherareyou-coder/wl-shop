<script setup>
defineOptions({ name: 'AppImage' })

const props = defineProps({
	src: { type: String },
})
const src = computed(() => '/imgs/product.png' || props.src)
</script>

<template>
	<el-image :src="src" />
</template>
