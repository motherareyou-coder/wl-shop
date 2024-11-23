<script setup>
defineOptions({
	name: 'Empty',
})
</script>

<template>
	<div>
		<noscript>
			我们发现此浏览器中的 JavaScript 已停用。请启用 JavaScript
			或切换至受支持的浏览器。
		</noscript>
		<slot></slot>
	</div>
</template>
