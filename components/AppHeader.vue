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

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.cartCount)
const validList = computed(() => cartStore.validList)

const showMobileMenu = computed(
	() => appStore.bodyWidth && appStore.bodyWidth <= 1024,
)
const route = useRoute()
const router = useRouter()
function logout() {
	userStore.logout().then(() => {
		if (route.path.includes('user') && !route.path.includes('user/cart')) {
			router.push($path('/'))
		}
	})
}

const isCart = computed(
	() => route.path.includes('cart') || route.path.includes('checkout'),
)
const { loading, wrapLoading } = useLoading()

function getCartList() {
	wrapLoading(cartStore.getCartList())
}
function handleDelete(p: CartItem) {
	wrapLoading(cartStore.removeCart([p.id]))
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
					<div class="navigation__link">
						<div class="shortcut__item--wrapper">
							<LanguageSelect class="shortcut__icon" />
						</div>
					</div>
				</li>
				<li class="navigation__item shortcut__item">
					<div class="navigation__link" @click="searchShow = true">
						<div class="shortcut__item--wrapper">
							<i class="micon micon-search-glass shortcut__icon"></i>
						</div>
					</div>
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
										:to="$path(`/product/${p.spu?.id}`)"
										class="cart__item-link"
									>
										<app-image
											class="cart__item-image"
											:src="p.spu?.picUrl"
											alt=""
										/>
										<div class="cart__item-info">
											<span class="cart__item-detail cart__item-name">
												{{ p.spu?.name }}
											</span>
											<span
												class="cart__item-detail cart__font--muted cart__item-price notranslate"
											>
												<ProductPrice :data="p.sku?.price" />
											</span>
											<span
												class="cart__item-detail cart__font--muted cart__item-quantity"
											>{{ $t('Quantity') }}: {{ p.count }}</span>
										</div>
										<el-icon
											class="micon micon-delete cart__font--muted cart__item-delete"
											@click.prevent.stop="handleDelete(p)"
										/>
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
									class="shortcut__item--wrapper"
								>
									<i class="micon micon-shopping-cart shortcut__icon"></i>
								</el-badge>
							</nuxt-link>
						</template>
					</el-popover>
				</li>
				<el-popover
					v-if="appStore.isPC"
					class="navigation__item shortcut__item"
					popper-class="shortcut__view shortcut__view-account view-account"
					:show-arrow="false"
					:offset="0"
					popper-style="padding:0;width: -webkit-max-content;width: -moz-max-content;width: max-content;min-width:0;"
					width="max-content"
				>
					<template #reference>
						<li class="navigation__item shortcut__item">
							<nuxt-link class="navigation__link outline-none" :to="$path('/user')">
								<i class="micon micon-account shortcut__icon"></i>
							</nuxt-link>
						</li>
					</template>
					<ul class="view-account__list">
						<template v-if="userStore.id">
							<li class="view-account__item">
								<a :href="$path('/user')" class="view-account__link">
									{{ $t('My account') }}
								</a>
							</li>
							<li class="view-account__item">
								<a :href="$path('/user/orderlist')" class="view-account__link">
									{{ $t('My orders') }}
								</a>
							</li>
							<li class="view-account__item">
								<a class="view-account__link cursor-pointer" @click="logout">
									{{ $t('Sign out') }}
								</a>
							</li>
						</template>
						<template v-else>
							<li class="view-account__item">
								<a class="view-account__link" :href="`${$path(`/login`)}?redirect=${encodeURIComponent(route.fullPath)}`">
									{{ $t('Sign in') }}
								</a>
							</li>
							<li class="view-account__item">
								<a class="view-account__link" :href="`${$path(`/login?type=1`)}&redirect=${encodeURIComponent(route.fullPath)}`">
									{{ $t('Sign up') }}
								</a>
							</li>
						</template>
					</ul>
				</el-popover>
				<li
					v-if="showMobileMenu"
					class="navigation__item shortcut__item shortcut__item-menu"
				>
					<div class="navigation__link">
						<div class="shortcut__item--wrapper">
							<i
								class="micon micon-menu shortcut__icon"
								@click="sideShow = true"
							></i>
						</div>
					</div>
				</li>
			</ul>
		</nav>
		<AppSearch v-model="searchShow" />
	</header>
</template>

<style lang="scss">
.site-header--sticky {
	.mi-badge__content.is-fixed {
		padding: 2PX 4PX !important;
		line-height: 1;
	}
	.shortcut__item--wrapper  {
		.mi-badge__content:not(.is-dot) {
			border:none;
			height: 16px;
			border-bottom-left-radius: 0;
			right: calc(var(--mi-badge-size) / 2 - 7px);
			top: -2px;
		}
	}
}
</style>
