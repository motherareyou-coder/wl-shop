<script setup lang="ts">
defineOptions({ name: 'UserBreadcrumb' })

const route = useRoute()
const router = useRouter()

const showTitle = computed(() => {
	// TODO: 过滤route
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
		<el-breadcrumb style="height:2.5rem;line-height:2.5rem" separator="/">
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

<style scoped></style>
