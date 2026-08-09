<script setup lang="ts">
defineOptions({ name: 'UserBreadcrumb' })

/**
 * 全局面包屑组件（layouts/default.vue 引用）
 *
 * 渲染优先级：
 * 1. route.meta.breadcrumb（数据驱动，内容详情页用）—— 自定义层级
 * 2. route.meta.showBread（用户中心页用）—— 固定层级 首页 > My account > [title]
 *
 * 内容详情页（/case/[id]、/staff/[id]、/packages/[id]）通过 definePageMeta 声明：
 *   definePageMeta({
 *     breadcrumb: [
 *       { label: '客户案例', to: '/case' },
 *       { label: '张先生的故事' },  // 最后一项无 to，为当前页
 *     ]
 *   })
 */

interface BreadcrumbItem {
	label: string
	to?: string
}

const route = useRoute()
const router = useRouter()

// 用户中心页：沿用原有逻辑（首页 > My account > title）
const userTitle = computed(() => {
	// TODO: Pref过滤route
	router.getRoutes().forEach((r) => {
		if (r.path.includes('components'))
			router.removeRoute(r.name)
	})
	if (route.meta.showBread)
		return route.meta.title as string
	return ''
})

// 数据驱动面包屑（内容详情页用）
const customBreadcrumb = computed<BreadcrumbItem[] | undefined>(() => {
	return route.meta.breadcrumb as BreadcrumbItem[] | undefined
})

// 最终是否显示面包屑
const showBreadcrumb = computed(() => !!customBreadcrumb.value || !!userTitle.value)

// 用户中心页特殊层级（orderview 显示 My orders）
const isOrderView = computed(() => route.path.includes('orderview'))
</script>

<template>
	<div
		v-if="showBreadcrumb"
		class="site-container-1400 user-layout__breadcrumb-wrap mx-auto w-full"
		style="flex-grow: 0"
	>
		<el-breadcrumb class="user-layout__breadcrumbs" separator="/">
			<!-- 首页（通用） -->
			<el-breadcrumb-item :to="{ path: '/' }">
				{{ $t('home') }}
			</el-breadcrumb-item>

			<!-- 方式1：数据驱动面包屑（内容详情页） -->
			<template v-if="customBreadcrumb">
				<el-breadcrumb-item
					v-for="(item, i) in customBreadcrumb"
					:key="i"
					:to="item.to ? { path: $path(item.to) } : undefined"
				>
					{{ item.label }}
				</el-breadcrumb-item>
			</template>

			<!-- 方式2：用户中心默认层级 -->
			<template v-else>
				<el-breadcrumb-item :to="$path('/user')">
					{{ $t('My account') }}
				</el-breadcrumb-item>
				<el-breadcrumb-item v-if="isOrderView" :to="$path('/user/orderlist')">
					{{ $t('My orders') }}
				</el-breadcrumb-item>
				<el-breadcrumb-item>
					{{ $t(userTitle) }}
				</el-breadcrumb-item>
			</template>
		</el-breadcrumb>
	</div>
</template>

<style lang="scss">
.user-layout__breadcrumb-wrap {
	/* 左间距与下方 .user-main（padding:50px）对齐，使面包屑文字与 My Orders 等标题左对齐 */
	box-sizing: border-box;
	padding: 0 50px;
	@media screen and (max-width: 720px) {
		padding: 0 16px;
	}
	@media screen and (min-width: 721px) and (max-width: 1024px) {
		padding: 0 24px;
	}
}
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
	/* 移动端：更紧凑，避免与顶部 header 间距过大 */
	@media screen and (max-width: 720px) {
		height: 36px;
		line-height: 36px;
		.mi-breadcrumb-item {
			font-size: 13px;
			height: 36px;
			line-height: 36px;
		}
		/* 超长时允许横向滚动，不挤压 */
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden;
		&::-webkit-scrollbar {
			display: none;
		}
	}
}
</style>
