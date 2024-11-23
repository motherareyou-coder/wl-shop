<script setup lang="ts">
defineOptions({ name: 'UserBreadcrumb' })

const route = useRoute()
const router = useRouter()

const showTitle = computed(() => {
	// TODO: Pref过滤route
	router.getRoutes().forEach((r) => {
		if (r.path.includes('components'))
			router.removeRoute(r.name)
	})
	if (route.meta.showBread)
		return route.meta.title as string
	return ''
})

const appStore = useAppStore()
</script>

<template>
	<div
		v-if="appStore.isPC && showTitle"
		class="site-container-1400 mx-auto w-full"
		style="flex-grow: 0"
	>
		<el-breadcrumb class="user-layout__breadcrumbs" separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">
				{{ $t('home') }}
			</el-breadcrumb-item>
			<el-breadcrumb-item :to="$path('/user')">
				{{ $t('My account') }}
			</el-breadcrumb-item>
			<el-breadcrumb-item v-if="route.path.includes('orderview')" :to="$path('/user/orderlist')">
				{{ $t('My orders') }}
			</el-breadcrumb-item>
			<el-breadcrumb-item>
				{{ $t(showTitle) }}
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<style lang="scss">
.user-layout__breadcrumbs.mi-breadcrumb {
    background: #f9f9fa;
	color: #424242;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
	.mi-breadcrumb-item {
		color: var(--title-base);
		font-size: 14px;
		height: 40px;
		line-height: 40px;
		font-weight: 300;
	}
	.mi-breadcrumb__inner.is-link, .mi-breadcrumb__inner a{
		color: #b0b0b0;
		&:hover{
			color: var(--mi-color-primary);
		}
	}
}
</style>
