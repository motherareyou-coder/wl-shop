<script setup lang="ts">
defineOptions({ name: 'AppModal' })

const visible = defineModel<boolean>()
const appStore = useAppStore()
</script>

<template>
	<el-dialog
		v-if="appStore.isPC"
		v-model="visible"
		class="mi-modal"
		width="40rem"
		center
	>
		<template #header>
			<slot name="header"></slot>
		</template>
		<slot></slot>
		<template #footer>
			<slot name="footer"></slot>
		</template>
	</el-dialog>
	<el-drawer
		v-else-if="appStore.isMobile"
		v-model="visible"
		class="mi-modal"
		direction="btt"
		style="min-height:50vh"
		center
	>
		<template #header>
			<slot name="header"></slot>
		</template>
		<slot></slot>
		<template #footer>
			<slot name="footer"></slot>
		</template>
	</el-drawer>
</template>
