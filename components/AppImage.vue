<script setup>
defineOptions({ name: 'AppImage' })

const props = defineProps({
	src: { type: String },
})
const src = computed(() => props.src)
</script>

<template>
	<el-image :src="src" class="max-w-full shrink-0">
		<template #error>
			<div class="mi-image__error">
				<el-icon><el-icon-picture /></el-icon>
			</div>
		</template>
	</el-image>
</template>
