<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 异步加载非首屏组件
const AppExclusive = defineAsyncComponent(() => import('./components/AppExclusive.vue'))
const AppFeature = defineAsyncComponent(() => import('./components/AppFeature.vue'))
const AppSpecial = defineAsyncComponent(() => import('./components/AppSpecial.vue'))
// 首屏组件保持同步加载
import AppSwiper from './components/AppSwiper.vue'

defineOptions({ name: 'Home' })

const { domain } = useRuntimeConfig().public

useSEO({
	routeKey: 'home',
	breadcrumbs: [
		{ name: 'Home', url: domain },
	],
})
</script>

<template>
	<main class="site-main">
		<section class="site-grid site-grid--small-top site-grid--full">
			<AppSwiper />
		</section>
		<section class="site-grid site-grid--vertical-100 site-grid--full">
			<Suspense>
				<template #default>
					<AppFeature />
				</template>
				<template #fallback>
					<div class="skeleton-container">
						<div class="skeleton-title" />
						<div class="skeleton-tabs">
							<div v-for="i in 5" :key="i" class="skeleton-tab" />
						</div>
						<div class="skeleton-content">
							<div class="skeleton-main" />
							<div class="skeleton-items">
								<div v-for="i in 4" :key="i" class="skeleton-item" />
							</div>
						</div>
					</div>
				</template>
			</Suspense>
		</section>
		<Suspense>
			<template #default>
				<AppSpecial />
			</template>
			<template #fallback>
				<div class="skeleton-container">
					<div class="skeleton-title" />
					<div class="skeleton-grid">
						<div v-for="i in 6" :key="i" class="skeleton-card" />
					</div>
				</div>
			</template>
		</Suspense>
		<section class="site-grid site-grid--vertical-100 site-grid--full">
			<Suspense>
				<template #default>
					<AppExclusive />
				</template>
				<template #fallback>
					<div class="skeleton-container">
						<div class="skeleton-title" />
						<div class="skeleton-grid">
							<div v-for="i in 4" :key="i" class="skeleton-card" />
						</div>
					</div>
				</template>
			</Suspense>
		</section>
	</main>
</template>

<style lang="scss">
@import url('./index.scss');
</style>

<style scoped lang="scss">
.site-main {
  margin: 0 auto;
  max-width: 2560px;
  width: 100%;
}

// 骨架屏样式
.skeleton-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.skeleton-title {
  height: 32px;
  width: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin-bottom: 24px;
  border-radius: 4px;
}

.skeleton-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.skeleton-tab {
  height: 40px;
  width: 100px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.skeleton-main {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.skeleton-item {
  height: 190px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.skeleton-card {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
