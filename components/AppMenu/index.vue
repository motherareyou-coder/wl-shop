<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import SubMenu from './SubMenu.vue'
import './index.scss'
import type { Category } from '~/types'

defineOptions({ name: 'AppMenu' })
const props = defineProps({
	data: { type: Array as () => Category[] | null, default: () => [] },
})
const data = toRef(props, 'data')

const height = ref('0')
const hoverd = ref()
function hide() {
	hoverd.value = null
	height.value = '0'
}
const { start, stop } = useTimeoutFn(hide, 100)
const wrapRef = ref()
function setHoverd(item: any, i: string | number) {
	stop()
	hoverd.value = item
	if (!wrapRef.value)
		return
	const t = wrapRef.value.children[i]
	height.value = `${
		t.children[0].children[0].offsetHeight + t.offsetHeight
	}px`
}

const deviceType = ref('pc')
const appStore = useAppStore()
watch(
	() => appStore.isMobile,
	v => v || hide(),
)
</script>

<template>
	<div>
		<ul
			class="navigation__group navigation__menu"
			@mouseleave="start"
			@mouseenter="stop"
		>
			<li
				v-for="(item, i) in data"
				:key="item.id"
				class="navigation__item"
				@mouseenter="setHoverd(item, i)"
			>
				<nuxt-link
					:to="
						$path(`/product-list?categoryId=${item.id}`)
					"
					class="navigation__link navigation__link--border"
					@click="hide"
				>
					<span>{{ item.name }}</span>
				</nuxt-link>
			</li>
		</ul>
		<div
			ref="wrapRef"
			class="navigation-submenu"
			:class="{ 'navigation-submenu--open': !!hoverd }"
			:style="{ height }"
		>
			<SubMenu
				v-for="item in data"
				:key="item.id"
				:category="item.id"
				:data="item.children"
				:class="{
					[`submenu__wrapper--${deviceType}-show`]: item === hoverd,
				}"
				@mouseenter="stop"
				@mouseleave="start"
				@link-click="hide"
			/>
		</div>
		<div
			class="navigation-submenu__cover"
			:class="{ 'navigation-submenu__cover--show': hoverd }"
		></div>
	</div>
</template>
