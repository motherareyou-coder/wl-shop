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
				<NuxtLink :to="localePath('/', locale)" class="logo-wrapper">
					<Icon name="icon:shop" size="32px" />
				</NuxtLink>
			</div>
			<div class="classify-container">
				<ul class="classify-wrapper">
					<li v-for="item in classifyList" :key="item.id" class="classify-item">
						<NuxtLink :to="localePath(item.path, locale)" class="classify-link">
							<span class="classify-text">{{ `${$t(item.value)}` }}</span>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="navigation__separator"></div>
			<ul class="navigation__aside">
				<li v-for="item in rightNavs" :key="item.id" class="classify-item">
					<NuxtLink :to="localePath(item.path, locale)" class="classify-link">
						<span class="classify-text">{{ `${$t(item.value)}` }}</span>
					</NuxtLink>
				</li>
			</ul>
			<ul class="navigation__shortcut">
				<li class="icon-item">
					<Icon name="icon:search" />
				</li>
				<li class="icon-item">
					<NuxtLink :to="localePath('/cart', locale)">
						<Icon name="icon:cart" style="margin-bottom: -2px;" />
					</NuxtLink>
				</li>
				<li class="icon-item show-small">
					<Icon name="icon:class" />
				</li>
				<li class="icon-item show-large">
					<NuxtLink :to="localePath('/login', locale)">
						<Icon name="icon:user" />
					</NuxtLink>
				</li>
				<li class="icon-item show-small">
					<Icon name="icon:menu" />
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
			width: var(--logo-width);
			height: var(--logo-height);
			padding: 0 var(--mid-gap);

			.logo-wrapper {
				height: 100%;
				width: 100%;
				font-size: var(--logo-width);
				display: block;
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
				height: 100%;
			}
		}

		.navigation__separator {
			flex: 1;
		}

		.navigation__aside {
			height: 100%;
		}

		.navigation__shortcut {
			display: flex;
			height: 100%;

			.icon-item {
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 var(--mini-gap);
			}
		}
	}

	.classify-item {
		font-size: var(--small-font-size);
		list-style: none;
		color: var(--text-base);

		.classify-link {
			align-items: center;
			cursor: pointer;
			display: flex;
			font-size: var(--small-font-size);
			height: 100%;
			padding: 0 var(--mini-gap);
		}
	}

	.classify-item:hover {
		color: var(--text-primary);

		.classify-link {
			border-bottom: 3px solid var(--border-primary);
		}
	}
}
</style>
