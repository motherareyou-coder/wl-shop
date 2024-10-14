<script setup lang="ts">
defineOptions({ name: 'AppHeader' })

const { locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
	<header class="header-container">
		<nav class="header-wrapper">
			<div class="logo-container">
				<nuxt-link :to="localePath('/', locale)" class="logo-wrapper">
					<Icon name="icon:shop" size="32px" />
				</nuxt-link>
			</div>
			<div class="classify-container">
				<AppMenu />
			</div>
			<div class="navigation__separator"></div>
			<ul class="navigation__shortcut">
				<li class="icon-item">
					<LanguageSelect />
				</li>
				<li class="icon-item">
					<Icon name="icon:search" />
				</li>
				<li class="icon-item">
					<nuxt-link :to="localePath('/cart', locale)">
						<Icon name="icon:cart" style="margin-bottom: -2px" />
					</nuxt-link>
				</li>
				<li class="icon-item show-small">
					<Icon name="icon:class" />
				</li>
				<li class="icon-item show-large">
					<nuxt-link :to="localePath('/user', locale)">
						<Icon name="icon:user" />
					</nuxt-link>
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
	transition: 0.3s cubic-bezier(0.5, 0, 0, 0.75);
	background-color: var(--background-white);
	box-shadow: 0 6px 16px 0 rgba(25, 25, 25, 0.06);
	position: sticky;
	top: 0;
	z-index: 20;

	.header-wrapper {
		align-items: center;
		box-sizing: border-box;
		display: flex;
		height: var(--header-height);
		max-width: var(--app-body-width);
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
}
</style>
