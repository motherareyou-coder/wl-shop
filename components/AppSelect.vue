<script setup lang="ts">
defineOptions({ name: 'AppSelect' })

const props = defineProps({
	options: { type: Array as () => Option[], default: () => [] },
	placeholder: { type: String },
})

interface Option {
	label: string
	value: any
}

const select = defineModel<any>()
const appStore = useAppStore()

const visible = ref(false)
const current = computed(() =>
	props.options.find(o => o.value === select.value),
)

function handleClick(o: Option) {
	select.value = o.value
	visible.value = false
}
</script>

<template>
	<el-select v-if="appStore.isPC" v-model="select" style="width:10rem">
		<el-option
			v-for="o in props.options"
			:key="o.value"
			:label="o.label"
			:value="o.value"
		/>
	</el-select>
	<span
		v-if="appStore.isMobile"
		class="flex items-center"
		@click="visible = true"
	>
		<span class="break-all">
			{{ current?.label || props.placeholder || $t('Select') }}
		</span>
		<el-icon><ElIconArrowRight /></el-icon>
	</span>
	<el-drawer
		v-if="appStore.isMobile"
		v-model="visible"
		direction="btt"
		append-to-body
		:with-header="false"
		class="select-drawer"
	>
		<ul class="el-select-dropdown__list">
			<li
				v-for="o in props.options"
				:key="o.value"
				:label="o.label"
				:value="o.value"
				class="el-select-dropdown__item"
				@click="handleClick(o)"
			>
				{{ o.label }}
			</li>
		</ul>
	</el-drawer>
</template>

<style lang="scss">
.select-drawer.mi-drawer.btt {
	height: 200px !important;
	font-size: 16px;
}
</style>
