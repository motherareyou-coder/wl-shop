<script setup>
defineOptions({ name: 'LanguageSelect' })

const items = [
	// { label: '中文', value: 'zh' },
	{ label: 'English', value: 'en' },
  //   //葡萄牙语
	// { label: 'Portugal', value: 'pt' },
  //   //俄语
	// { label: 'Русский', value: 'ru' },
  //   //希腊语
	// { label: 'Ελληνικά', value: 'el' },
  //   //法语
	// { label: 'Français', value: 'fr' },
  //   //西班牙语
	// { label: 'Español', value: 'es' },
  //   //德语
	// { label: 'Deutsch', value: 'de' },
  //   //意大利语
	// { label: 'Italiano', value: 'it' },
  //   //波兰
	// { label: 'Polski', value: 'pl' },
  //   //阿拉伯语
	// { label: 'العربية', value: 'ar' },
  //   //土耳其语
	// { label: 'Türkçe', value: 'tr' },
  //   //日语
	// { label: '日本語', value: 'ja' },
  //   //印尼语
	// { label: 'Bahasa Indonesia', value: 'id' },
  //   //瑞典语
	// { label: 'Svenska', value: 'sv' },
]
</script>

<template>
	<el-dropdown :popper="{ placement: 'bottom-start' }" :hide-on-click="true">
		<i class="micon micon-language-earth" v-bind="$attrs" :title="$t('language')"></i>
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
