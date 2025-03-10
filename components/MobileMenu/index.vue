<script setup lang="ts">
import type { Category } from '~/types'

defineOptions({ name: 'MobileMenu' })
const props = defineProps({
	data: { type: Array as () => Category[] | null, default: () => [] },
})
const data = toRef(props, 'data')

const currentCat = ref()
const activeName = ref()
watch(currentCat, (v) => {
	activeName.value = v?.childCategory[0]?.id
})

const userStore = useUserStore()
const appStore = useAppStore()

const show = defineModel()
function hide() {
	show.value = false
	currentCat.value = null
}
const route = useRoute()
watch(() => route.fullPath, hide)
watch(
	() => appStore.isMobile,
	v => v || hide(),
)
</script>

<template>
	<div class="site-slide-menu show">
		<input
			id="site-slide-menu__controller"
			v-model="show"
			type="checkbox"
			class="site-slide-menu__controller"
		>
		<div class="site-slide-menu__wrapper">
			<div class="site-slide-menu__card">
				<div
					class="site-slide-menu__header"
					:class="{
						'site-slide-menu__header--verbose': !!currentCat,
					}"
				>
					<div class="header__content text-2xl">
						<div class="header__back" @click="currentCat = null">
							<el-icon><ElIconArrowLeft /></el-icon>
							<span class="back__content">
								{{ currentCat?.name }}
							</span>
						</div>
						<el-icon
							class="mi-btn mi-btn--icon mi-btn--light header__close"
							@click="hide"
						>
							<ElIconClose />
						</el-icon>
					</div>
				</div>
				<div class="site-slide-menu__content">
					<nuxt-link
						:to="$path('/user')"
						class="content__user"
						@click.stop
					>
						<div
							class="content__user-info content__user-info--logged-in"
						>
							<div class="user-info__avatar-wrapper">
								<app-image
									class="user-info__avatar"
									:src="userStore.info?.avatar || '/avatar.png'"
									alt="userNameAvatar"
								/>
							</div>
							<span class="user-info__nickname">
								{{ userStore.info?.nickname || $t('login') }}
							</span>
						</div>
						<el-icon><ElIconArrowRight /></el-icon>
					</nuxt-link>
					<div class="content__navigation--main">
						<ul class="nav__link-list">
							<li
								v-for="m in data"
								:key="m.id"
								class="nav__link"
								@click="currentCat = m"
							>
								<nuxt-link
									:to="
										$path(
											`/product-list?categoryId=${m.id}`,
										)
									"
									@click.stop
								>
									{{ m.name }}
								</nuxt-link>
								<el-icon><ElIconArrowRight /></el-icon>
							</li>
							<li class="nav__link">
								<nuxt-link
									class="navigation__link"
									:to="$path('/articles')"
								>
									{{ $t('Discover') }}
								</nuxt-link>
							</li>
						</ul>
					</div>
				</div>
				<div
					class="submenu__wrapper site-container submenu-mobile__style "
					:class="{ 'submenu-mobile__show': !!currentCat }"
				>
					<el-collapse v-if="currentCat" v-model="activeName" accordion>
						<el-collapse-item v-for="cat in currentCat.childCategory" :key="cat.id" :title="cat.name" :name="cat.id" class="submenu__item">
							<div class="submenu-product submenu-product-mobile">
								<div class="flex flex-col">
									<nuxt-link v-for="item in cat.childProduct" :key="item.id" :to="$path(`/product/${item.id}`)" class="header-product-item header-product-item-mobile">
										<app-image class="mi-image header-product-item__image" :src="item.picUrl" :alt="item.name" />
										<div class="header-product-item__info">
											<div class="header-product-item__title">
												{{ item.name }}
											</div>
											<div class="mi-price header-product-item__price">
												<ProductPrice :data="item.price" />
											</div>
										</div>
									</nuxt-link>
									<div class="submenu-footer submenu-footer-mobile">
										<nuxt-link class="submenu-footer__item" :to="$path(`/product-list?categoryId=${cat.id}`)">
											{{ $t('All Products') }}
											<el-icon>
												<ElIconArrowRight />
											</el-icon>
										</nuxt-link>
									</div>
								</div>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url( './index.scss');
</style>

<style lang="scss" scoped>
.mi-collapse{
	--mi-collapse-border-color:transparent;
	:deep(.mi-collapse-item__header){
		padding: 8px 20px;
	}
}
</style>
