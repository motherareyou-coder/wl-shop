<script setup lang="ts">
import type { CartItem, Category } from '~/types'
import './AppHeader.scss'

defineOptions({ name: 'AppHeader' })

const appStore = useAppStore()
const userStore = useUserStore()
const sideShow = ref(false)
const searchShow = ref(false)

userStore.getInfo()

const { data: categories } = await useAPI<Category[]>(
	'product/category/list/top',
	{ params: { num: 5 } },
)

const paramsStore = useParamsStore()
const cartCount = computed(() => paramsStore.$state.cartCount)
paramsStore.getCartCount()

watch(
	categories,
	(v) => {
		v?.forEach?.((c, i) =>
			$api('product/spu/page', {
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
const showMobileMenu = computed(
	() => appStore.bodyWidth && appStore.bodyWidth <= 1024,
)
const route = useRoute()
const router = useRouter()
function logout() {
	userStore.logout().then(() => {
		if (route.path.includes('user'))
			router.replace($path('/'))
	})
}

const isCart = computed(
	() => route.path.includes('cart') || route.path.includes('checkout'),
)
const validList = ref<CartItem[]>([])
const loading = ref(false)
watch(
	() => userStore.accessToken,
	(v) => {
		if (!v)
			validList.value = []
	},
)
function getCartList() {
	if (!userStore.accessToken)
		return (validList.value = [])
	loading.value = true
	$api('trade/cart/list')
		.then((res) => {
			validList.value = res.validList as CartItem[]
			paramsStore.setCartCount(validList.value?.length)
		})
		.finally(() => {
			loading.value = false
		})
}
function handleDelete(p: CartItem) {
	loading.value = true
	$api('trade/cart/delete', {
		method: 'delete',
		params: { ids: [p.id] },
	})
		.then(() => {
			validList.value = validList.value.filter(g => g.id !== p.id)
			paramsStore.setCartCount(cartCount.value - 1)
		})
		.finally(() => {
			loading.value = false
		})
}
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
				<li v-if="appStore.isPC" class="navigation__item shortcut__item">
					<nuxt-link class="navigation__link" :to="$path('/articles')">
						{{ $t('Discover') }}
					</nuxt-link>
				</li>
				<li class="navigation__item shortcut__item">
					<LanguageSelect class="navigation__link" />
				</li>
				<li class="navigation__item shortcut__item">
					<i class="navigation__link" @click="searchShow = true">
						<Icon name="icon:search" />
					</i>
				</li>
				<li class="navigation__item shortcut__item">
					<el-popover
						placement="top-end"
						popper-class="shortcut__view shortcut__view-cart"
						:disabled="appStore.isMobile || isCart"
						:show-arrow="false"
						:offset="0"
						@show="getCartList"
					>
						<div v-if="cartCount" v-loading="loading">
							<ul class="cart__list">
								<li v-for="p in validList" :key="p.id" class="cart__item">
									<nuxt-link
										:to="$path(`/product/${p.spu.id}`)"
										class="cart__item-link"
									>
										<app-image
											class="cart__item-image"
											:src="p.spu.picUrl"
											alt=""
										/>
										<div class="cart__item-info">
											<span class="cart__item-detail cart__item-name">{{
												p.spu.name
											}}</span>
											<span
												class="cart__item-detail cart__font--muted cart__item-price notranslate"
											>{{ p.sku.price }}</span>
											<span
												class="cart__item-detail cart__font--muted cart__item-quantity"
											>{{ $t('Quantity') }}: {{ p.count }}</span>
										</div>
										<el-icon
											class="micon micon-delete cart__font--muted cart__item-delete"
											@click.prevent.stop="handleDelete(p)"
										>
											<ElIconDelete />
										</el-icon>
									</nuxt-link>
								</li>
							</ul>
							<div class="cart__summary">
								<div class="cart__summary-info">
									<span class="cart__font--muted cart__summary-count">
										{{
											`${$t('Subtotal')} (${validList.length}${$t('items')})`
										}}
									</span>
								</div>
								<nuxt-link
									:to="$path('/user/cart')"
									class="mi-button mi-btn mi-btn--primary cart-footer__submit cart__jump-cart w-full"
								>
									{{ $t('Checkout') }}
								</nuxt-link>
							</div>
						</div>
						<span v-else>{{ $t('Your cart is empty') }}</span>
						<template #reference>
							<nuxt-link class="navigation__link" :to="$path('/user/cart')">
								<el-badge
									:show-zero="false"
									:is-dot="appStore.isMobile"
									:value="cartCount"
									color="#ff6700"
								>
									<Icon name="icon:cart" style="margin-bottom: -2px" />
								</el-badge>
							</nuxt-link>
						</template>
					</el-popover>
				</li>
				<el-dropdown
					v-if="appStore.isPC"
					class="navigation__item shortcut__item"
				>
					<nuxt-link class="navigation__link outline-none" :to="$path('/user')">
						<Icon name="icon:user" />
					</nuxt-link>
					<template #dropdown>
						<el-dropdown-menu>
							<template v-if="userStore.nickname">
								<nuxt-link :to="$path('/user')">
									<el-dropdown-item>
										{{ $t('My account') }}
									</el-dropdown-item>
								</nuxt-link>
								<nuxt-link :to="$path('/user/orderlist')">
									<el-dropdown-item>
										{{ $t('My orders') }}
									</el-dropdown-item>
								</nuxt-link>
								<el-dropdown-item @click="logout">
									{{ $t('Log out') }}
								</el-dropdown-item>
							</template>
							<nuxt-link v-else :to="$path('/login')">
								<el-dropdown-item>
									{{ $t('Log in') }}
								</el-dropdown-item>
							</nuxt-link>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
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
