<script setup lang="ts">
defineOptions({ name: 'AppTime' })

const props = defineProps({
	data: { type: [String, Number] },
	format: { type: String, default: 'YYYY-MM-DD HH:mm:ss' },
})
const dayjs = useDayjs()
const str = computed(() => dayjs(props.data).format(props.format))
</script>

<template>
	<template v-if="props.data">
		{{ str }}
	</template>
</template>
