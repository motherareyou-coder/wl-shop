<script setup>
defineOptions({
	name: 'Login',
})
</script>

<template>
	<div class="login-page">
		<noscript>
			我们发现此浏览器中的 JavaScript 已停用。请启用 JavaScript
			或切换至受支持的浏览器。
		</noscript>
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
.login-page {
	display: flex;
}
</style>
