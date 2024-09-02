<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:04:57
 * @Description: 网站顶部
-->

<script setup lang="ts">
defineOptions({
	name: 'AppHeader',
})

const classifyList = ref([
	{ id: '1', name: 'Store', value: 'store', path: '/store' },
	{ id: '2', name: '手机/平板', value: 'mobilePad', path: '/mobile' },
	{ id: '3', name: '智能穿戴', value: 'smartWearables', path: '/wearables' },
	{ id: '4', name: '智能家电', value: 'smartHomeApp', path: '/smart-home' },
	{ id: '5', name: '潮流生活', value: 'trendylifestyle', path: '/lifestyle' },
	{ id: '6', name: 'POCO', value: 'poco', path: '/poco' },
])
</script>

<template>
	<header class="site-header site-header--sticky is-pc">
		<nav class="site-container site-header__navigation">
			<div class="logo-container">
				<div class="logo">
					SHOP
				</div>
			</div>
			<div class="classify-container">
				<ul class="classify-wrapper">
					<li v-for="item in classifyList" :key="item.id" class="classify-item">
						<NuxtLink :href="item.path" class="classify-link">
							<span class="classify-text">{{ `${$t(item.value)}` }}</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="navigation__separator"></div>
			<ul class="navigation__aside"></ul>
			<ul class="navigation__shortcut"></ul>
		</nav>
	</header>
</template>

<style scoped lang="scss">
.site-header {
	width: var(--app-width);
	height: var(--header-height);
    transition: .3s cubic-bezier(.5,0,0,.75);
	background-color: var(--background-white);
    box-shadow: 0 6px 16px 0 rgba(25, 25, 25, .06);
	position: sticky;
    top: 0;
    z-index: 20;

	.site-header__navigation {
		align-items: center;
		box-sizing: border-box;
		display: flex;
		height: var(--header-height);
		justify-content: space-between;
		margin: 0 auto;
	}
}

@media screen and (min-width: 1921px) {
	#__nuxt .site-container {
		max-width: 1500px;
	}
}
@media screen and (min-width: 1921px) {
	.site-header .site-header__navigation {
		padding: 0 8px;
	}
}
</style>
