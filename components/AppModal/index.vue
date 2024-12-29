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
		v-bind="$attrs"
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
		v-bind="$attrs"
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

<style lang="scss">
.mi-form-item.is-required:not(.is-no-asterisk).asterisk-right>.mi-form-item__label:after,
.mi-form-item.is-required:not(.is-no-asterisk).asterisk-right>.mi-form-item__label-wrap>.mi-form-item__label:after {
	color: var(--text-secondary)
}
</style>
