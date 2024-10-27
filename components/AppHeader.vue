<script setup lang="ts">
import './AppHeader.scss'
import type { Category } from '~/types'

defineOptions({ name: 'AppHeader' })

const appStore = useAppStore()
const sideShow = ref(false)
const searchShow = ref(false)

const { data: categories } = await useAPI<Category[]>(
	'product/category/list/top?apifoxApiId=211912811',
)
console.log(categories)

watch(
	categories,
	(v) => {
		v?.forEach((c, i) =>
			$api('product/spu/page?apifoxApiId=211495718', {
				params: {
					categoryId: c.id,
					pageNo: 1,
					pageSize: 5,
				},
			}).then((res) => {
				c.id += i
				c.children = res.list
			}),
		)
	},
	{ immediate: true },
)
const showMobileMenu = computed(() => appStore.bodyWidth <= 1024)
</script>

<template>
	<MobileMenu v-if="showMobileMenu" v-model="sideShow" :data="categories" />
	<header class="site-header site-header--sticky">
		<nav class="site-container site-header__navigation">
			<div class="navigation__logo">
				<nuxt-link class="logo__link" :to="$path('/')">
					<Icon name="icon:shop" size="32px" class="logo__mi" />
				</nuxt-link>
			</div>
			<AppMenu class="navigation__group-wrapper" :data="categories" />
			<div class="navigation__separator"></div>
			<ul class="navigation__group navigation__shortcut">
				<li class="navigation__item shortcut__item">
					<LanguageSelect class="navigation__link" />
				</li>
				<li class="navigation__item shortcut__item">
					<i class="navigation__link" @click="searchShow = true">
						<Icon name="icon:search" />
					</i>
				</li>
				<li class="navigation__item shortcut__item">
					<nuxt-link
						class="navigation__link"
						:to="$path('/cart')"
					>
						<Icon name="icon:cart" style="margin-bottom: -2px" />
					</nuxt-link>
				</li>
				<li class="navigation__item shortcut__item">
					<nuxt-link
						class="navigation__link"
						:to="$path('/user')"
					>
						<Icon name="icon:user" />
					</nuxt-link>
				</li>
				<li
					v-if="showMobileMenu"
					class="navigation__item shortcut__item shortcut__item-menu"
				>
					<i
						class="site-slide-menu__controller navigation__link shortcut__item--wrapper"
						@click="sideShow = true"
					>
						<Icon name="icon:menu" />
					</i>
				</li>
			</ul>
		</nav>
		<AppSearch v-model="searchShow" />
	</header>
</template>
