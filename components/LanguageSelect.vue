<script setup>
defineOptions({ name: 'LanguageSelect' })

const items = [
	{ label: '中文', value: 'zh' },
	{ label: 'English', value: 'en' },
]
</script>

<template>
	<el-dropdown :popper="{ placement: 'bottom-start' }" :hide-on-click="true">
		<i class="micon micon-language-earth" v-bind="$attrs"></i>
		<template #dropdown>
			<el-dropdown-menu>
				<SwitchLocalePathLink v-for="o in items" :key="o.value" :locale="o.value" style="width:100%">
					<el-dropdown-item>
						{{ o.label }}
					</el-dropdown-item>
				</SwitchLocalePathLink>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>
