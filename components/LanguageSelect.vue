<script setup>
defineOptions({ name: 'LanguageSelect' })

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
					<SwitchLocalePathLink :locale="o.value">
						{{ o.label }}
					</SwitchLocalePathLink>
				</ElDropdownItem>
			</ElDropdownMenu>
		</template>
	</ElDropdown>
</template>
