<!--
 * @Author: Reg Zhang<rexag.zhang@gmail.com>
 * @Date: 2024-09-02 10:04:57
 * @Description: 网站顶部
-->

<script setup lang="ts">
defineOptions({
	name: 'AppHeader',
})

const { locale } = useI18n()
const localePath = useLocalePath()

const classifyList = ref([
	{ id: '1', value: 'store', path: '/store' },
	{ id: '2', value: 'mobile', path: '/mobile' },
	{ id: '3', value: 'wearables', path: '/wearables' },
	{ id: '4', value: 'smarthome', path: '/smart-home' },
	{ id: '5', value: 'lifestyle', path: '/lifestyle' },
])

const rightNavs = ref([
	{ id: '1', value: 'discover', path: '/discover' },
	{ id: '2', value: 'support', path: '/support' },
])
</script>

<template>
	<header class="header-container">
		<nav class="header-wrapper">
			<div class="logo-container">
				<NuxtLink to="/" class="logo-wrapper">
					<img class="logo-img" src="../assets/imgs/shop.svg" alt="shop">
				</NuxtLink>
			</div>
			<div class="classify-container">
				<ul class="classify-wrapper">
					<li v-for="item in classifyList" :key="item.id" class="classify-item">
						<NuxtLink :href="localePath(item.path, locale)" class="classify-link">
							<span class="classify-text">{{ `${$t(item.value)}` }}</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="navigation__separator"></div>
			<ul class="navigation__aside">
				<li v-for="item in rightNavs" :key="item.id" class="classify-item">
					<NuxtLink :href="localePath(item.path, locale)" class="classify-link">
						<span class="classify-text">{{ `${$t(item.value)}` }}</span>
					</NuxtLink>
				</li>
			</ul>
			<ul class="navigation__shortcut">
				<li class="classify-item">
					<img class="logo-img" src="../assets/imgs/search.svg" alt="shop">
				</li>
				<li class="classify-item">
					<img class="logo-img" src="../assets/imgs/cart.svg" alt="shop">
				</li>
				<li class="classify-item">
					<img class="logo-img" src="../assets/imgs/menu.svg" alt="shop">
				</li>
				<li class="classify-item">
					<NuxtLink :href="localePath('/login', locale)" class="classify-link">
						<img class="logo-img" src="../assets/imgs/user.svg" alt="shop">
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</header>
</template>

<style scoped lang="scss">
.header-container {
	width: 100%;
	height: var(--header-height);
    transition: .3s cubic-bezier(.5,0,0,.75);
	background-color: var(--background-white);
    box-shadow: 0 6px 16px 0 rgba(25, 25, 25, .06);
	position: sticky;
    top: 0;
    z-index: 20;

	.header-wrapper {
		align-items: center;
		box-sizing: border-box;
		display: flex;
		height: var(--header-height);
		justify-content: space-between;
		margin: 0 auto;

		.logo-container {
			height: 32px;
			padding: 0 24px;
			width: 32px;

			.logo-wrapper {
				display: block;
				height: 100%;
				width: 100%;
				color: #000;

				.logo-img {
					display: block;
					height: 100%;
					width: 100%;
				}
			}
		}

		.classify-container {
			height: 100%;

			.classify-wrapper {
				display: flex;

				.classify-item {
					list-style: none;
					color: var(--text-base);
				}
			}
		}

		.navigation__separator {
			flex: 1;
		}

		.navigation__aside {
			display: flex;

			.classify-item {
				list-style: none;
			}
		}

		.navigation__shortcut {
			display: flex;

			.classify-item {
				list-style: none;
				font-size: 14px;

				.logo-img {
					display: block;
					height: 32px;
					width: 32px;
				}
			}
		}
	}
}

@media screen and (min-width: 1441px) and (max-width: 1920px) {
    #__nuxt .header-wrapper {
        max-width: 1500px;
        padding: 0 8px;

		.classify-item {
			margin: 0 16px;
		}
    }
}
</style>
