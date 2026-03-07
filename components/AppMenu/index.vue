<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import type { Category } from '~/types'
import SubMenu from './SubMenu.vue'

defineOptions({ name: 'AppMenu' })
const props = defineProps({
	data: { type: Array as () => Category[] | null, default: () => [] },
})
const data = toRef(props, 'data')

const height = ref('0')
const hoverd = ref()
const isHoveringMenu = ref(false)
const isHoveringSubmenu = ref(false)
function hide() {
	if (!isHoveringMenu.value && !isHoveringSubmenu.value) {
		hoverd.value = null
		height.value = '0'
	}
}
const { start, stop } = useTimeoutFn(hide, 100)
const wrapRef = ref()
function setHoverd(item: any, i: string | number) {
	stop()
	hoverd.value = item
	if (!wrapRef.value)
		return
	const c = wrapRef.value.querySelector('.submenu__product-group')
	height.value = `${c.offsetHeight + 26 + 20}px`
}

function onMenuEnter() {
	isHoveringMenu.value = true
	stop()
}

function onMenuLeave() {
	isHoveringMenu.value = false
	start()
}

function onSubmenuEnter() {
	isHoveringSubmenu.value = true
	stop()
}

function onSubmenuLeave() {
	isHoveringSubmenu.value = false
	start()
}

const appStore = useAppStore()
watch(
	() => appStore.isMobile,
	v => v || hide(),
)
const route = useRoute()
watch(() => route.fullPath, hide)
</script>

<template>
	<div>
		<ul
			class="navigation__group navigation__menu"
			@mouseleave="onMenuLeave"
			@mouseenter="onMenuEnter"
		>
			<li
				v-for="(item, i) in data"
				:key="item.id"
				class="navigation__item"
				:class="{
					'navigation__item--hover': hoverd === item,
				}"
				@mouseenter="setHoverd(item, i)"
			>
				<nuxt-link
					:to="
						$path(`/product-list?categoryId=${item.id}`)
					"
					class="navigation__link navigation__link--border"
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
			@mouseenter="onSubmenuEnter"
			@mouseleave="onSubmenuLeave"
		>
			<SubMenu
				v-for="item in data"
				:key="item.id"
				:data="item.childCategory"
				:show="item === hoverd"
			/>
		</div>
		<div
			class="navigation-submenu__cover"
			:class="{ 'navigation-submenu__cover--show': hoverd }"
		></div>
	</div>
</template>

<style lang="scss">
@import url( './index.scss');
</style>
