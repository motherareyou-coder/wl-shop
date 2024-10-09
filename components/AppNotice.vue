<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:06:08
 * @Description: 顶部提示
-->

<script setup lang="ts">
defineOptions({ name: 'AppNotice' })
</script>

<template>
	<aside class="app-top-banner notification" />
</template>

<style scoped lang="scss">
.app-top-banner {
	background: var(--background-white);
}
</style>
