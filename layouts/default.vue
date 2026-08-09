<script setup lang="ts">
defineOptions({
	name: 'Layout',
})
</script>

<template>
	<div class="app-container">
		<noscript>
			我们发现此浏览器中的 JavaScript 已停用。请启用 JavaScript 或切换至受支持的浏览器。
		</noscript>
		<AppHeader />
		<UserBreadcrumb />
		<main class="app-container__main">
			<slot></slot>
		</main>
		<AppFooter />
		<AppChat />
	</div>
</template>

<style scoped lang="scss">
.app-container {
	display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
}

.app-container__main {
	display: flex;
	flex: 1 1 auto;
	flex-flow: column nowrap;
	width: 100%;
}
</style>
