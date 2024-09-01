<script setup lang="ts">
defineOptions({
	name: 'AppHeader',
})
</script>

<template>
	<header class="site-header site-header--sticky is-pc">
		<nav class="site-container site-header__navigation">
			<div class="navigation__logo"></div>
			<div></div>
			<div></div>
			<ul></ul>
			<ul></ul>
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
