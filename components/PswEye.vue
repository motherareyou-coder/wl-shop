<script setup lang="ts">
defineOptions({ name: 'PswEye' })

const data = defineModel<boolean>()
</script>

<template>
	<Icon v-if="data" name="icon:eye-open" @click="data = false" />
	<Icon v-else name="icon:eye-close" @click="data = true" />
</template>

<style scoped>

</style>
