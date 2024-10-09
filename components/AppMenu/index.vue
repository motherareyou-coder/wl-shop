<script setup lang="jsx">
import { useTimeoutFn } from '@vueuse/core'
import SubMenu from './SubMenu.vue'

defineOptions({ name: 'AppMenu' })

const classifyList = ref([
	{ id: '1', value: 'store', path: '/store' },
	{ id: '2', value: 'mobile', path: '/mobile' },
	{ id: '3', value: 'wearables', path: '/wearables' },
	{ id: '4', value: 'smarthome', path: '/smart-home' },
	{ id: '5', value: 'lifestyle', path: '/lifestyle' },
])
const height = ref(0)
const hoverd = ref()
const { start, stop } = useTimeoutFn(() => {
	hoverd.value = null
	height.value = 0
}, 100)
const wrapRef = ref()
function setHoverd(item, i) {
	stop()
	hoverd.value = item
	if (!wrapRef.value)
		return
	height.value = `${wrapRef.value.children[i].offsetHeight}px`
}
</script>

<template>
	<ul class="classify-wrapper" @mouseleave="start" @mouseenter="stop">
		<li
			v-for="(item, i) in classifyList"
			:key="item.id"
			class="classify-item"
			@mouseenter="setHoverd(item, i)"
		>
			<nuxt-link
				:to="localePath(item.path, locale)"
				class="classify-link"
			>
				<span class="classify-text">{{ $t(item.value) }}</span>
			</nuxt-link>
		</li>
	</ul>
	<div class="navigation-submenu">
		<div class="navigation-submenu__cover" :class="{ show: hoverd }"></div>
		<div
			ref="wrapRef"
			class="navigation-submenu__wrapper"
			:style="{ height }"
			@mouseleave="start"
			@mouseenter="stop"
		>
			<SubMenu
				v-for="(item, i) in classifyList"
				:id="item.id"
				:key="item.id"
				:class="{ show: item === hoverd }"
				:title="i"
				@mouseenter="stop"
				@mouseleave="start"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.classify-wrapper {
	display: flex;
	height: 100%;

	.classify-item {
		font-size: var(--small-font-size);
		list-style: none;
		color: var(--text-base);

		.classify-link {
			white-space: nowrap;
			align-items: center;
			cursor: pointer;
			display: flex;
			font-size: var(--small-font-size);
			height: 100%;
			padding: 0 var(--mini-gap);
			border-bottom: 3px solid transparent;
			border-top: 3px solid transparent;
			box-sizing: border-box;
		}
	}

	.classify-item:hover {
		color: var(--text-primary);

		.classify-link {
			border-bottom: 3px solid var(--border-primary);
		}
	}
}
.navigation-submenu {
	position: absolute;
	left: 0;
	height: 0;
	top: var(--header-height);
	width: 100%;
	.navigation-submenu__cover {
		-webkit-backdrop-filter: blur(10px);
		backdrop-filter: blur(10px);
		background-color: rgba(0, 0, 0, 0.4);
		height: calc(100vh - var(--header-height));
		left: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		transition: 0.35s ease;
		width: 100%;
		transition-delay: 0.15s;
		z-index: 2;

		&.show {
			opacity: 1;
		}
	}
	.navigation-submenu__wrapper {
		width: 100%;
		position: absolute;
		height: 0;
		overflow: hidden;
		transition: 0.3s cubic-bezier(0.5, 0, 0, 0.75);
		background-color: var(--background-white);
		z-index: 4;
	}
}
</style>
