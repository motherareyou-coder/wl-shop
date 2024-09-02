<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:06:32
 * @Description: 默认模板
-->

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
		<slot></slot>
		<AppFooter />
	</div>
</template>

<style scoped lang="scss">
.app-container {
	display: flex;
    flex-flow: column nowrap;
    min-height: 100%;
}
</style>
