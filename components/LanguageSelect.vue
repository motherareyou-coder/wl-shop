<script setup>
const items = [
	{ label: '中文', value: 'zh' },
	{ label: 'English', value: 'en' },
]
</script>

<template>
	<ElDropdown :popper="{ placement: 'bottom-start' }">
		<Icon name="icon:language" style="outline: none" />
		<template #dropdown>
			<ElDropdownMenu>
				<ElDropdownItem v-for="o in items" :key="o.value">
					{{ o.label }}
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>
</template>
