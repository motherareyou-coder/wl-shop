<script setup>
defineOptions({ name: 'AppImage' })

const props = defineProps({
	src: { type: String },
})
const src = computed(() => '/imgs/5.png' || props.src)
</script>

<template>
	<el-image :src="src" />
</template>
