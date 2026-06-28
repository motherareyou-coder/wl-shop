<script setup lang="ts">
defineOptions({ name: 'AppTourFloatCta' })

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()
const visible = ref(false)

// 滚动超过一屏后显示悬浮按钮（client-only，遵守 RESPONSIVE 规范 §5）
onMounted(() => {
	const onScroll = () => {
		visible.value = window.scrollY > window.innerHeight * 0.8
	}
	window.addEventListener('scroll', onScroll, { passive: true })
	onScroll()
	onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})

// 免费定制：跳转定制表单页
function goCustom() {
	router.push($path('/custom'))
}

// 在线咨询：通过 chatStore 触发全局 AppChat 打开（复用现有客服 WebSocket）
function goChat() {
	// AppChat 依赖登录态（WebSocket 需要 accessToken），未登录引导登录
	if (!userStore.accessToken) {
		router.push($path(`/login?redirect=${encodeURIComponent(route.fullPath)}`))
		return
	}
	chatStore.requestOpen()
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<ClientOnly>
		<Transition name="float-cta">
			<div
				v-if="visible"
				class="tour-float"
				:class="{ 'tour-float--mobile': appStore.isMobile }"
			>
				<!-- 在线咨询：复用 AppChat 客服聊天。默认圆形 logo，hover 展开文字 -->
				<button
					class="tour-float__btn tour-float__btn--chat"
					:aria-label="tr('tour.float.chatLabel', '在线咨询客服')"
					@click="goChat"
				>
					<Icon name="icon:user" class="tour-float__icon" />
					<span class="tour-float__text">
						{{ tr('tour.float.chat', '在线咨询') }}
					</span>
				</button>

				<!-- 免费定制：跳转定制表单。默认圆形 logo，hover 展开文字 -->
				<button
					class="tour-float__btn tour-float__btn--custom"
					:aria-label="tr('tour.float.customLabel', '立即免费定制行程')"
					@click="goCustom"
				>
					<Icon name="icon:like" class="tour-float__icon" />
					<span class="tour-float__text">
						{{ tr('tour.float.custom', '免费定制') }}
					</span>
				</button>
			</div>
		</Transition>
	</ClientOnly>
</template>

<style lang="scss" scoped>
.tour-float {
	position: fixed;
	right: var(--mid-gap);
	bottom: var(--large-gap);
	z-index: 100;
	display: flex;
	flex-direction: column;
	gap: var(--small-gap);
	align-items: flex-end;

	&__btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		/* 默认：圆形 logo（仅图标），width = height */
		padding: 0;
		width: 48px;
		height: 48px;
		border: none;
		border-radius: 999px;
		font-size: var(--default-font-size);
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 8px 24px var(--shadow-black-a20);
		transition: width 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
		overflow: hidden;
		white-space: nowrap;

		/* hover：展开为带文字的胶囊 */
		&:hover {
			width: auto;
			padding: 0 20px;
			gap: var(--small-gap);
			transform: translateY(-2px);
		}
	}

	&__text {
		/* 默认隐藏，hover 时展开 */
		max-width: 0;
		opacity: 0;
		overflow: hidden;
		transition: max-width 0.3s ease, opacity 0.3s ease;

		.tour-float__btn:hover & {
			max-width: 140px;
			opacity: 1;
		}
	}

	// 在线咨询：白底橙边
	&__btn--chat {
		background: var(--background-white);
		color: var(--brand-orange);
		border: 2px solid var(--brand-orange);

		&:hover {
			box-shadow: 0 12px 32px var(--shadow-primary-a30);
		}
	}

	// 免费定制：橙底白字（主 CTA，视觉更重）
	&__btn--custom {
		background: linear-gradient(135deg, var(--brand-orange), var(--brand-orange-80));
		color: #fff;
		color: var(--text-reverse);

		&:hover {
			box-shadow: 0 12px 32px var(--shadow-primary-a50);
		}
	}

	&__icon {
		width: 20px;
		height: 20px;
	}

	// 移动端：无 hover，按钮默认展开显示文字（触屏点按即用）
	&--mobile {
		right: var(--small-gap);
		bottom: var(--mid-gap);

		.tour-float__btn {
			width: auto;
			padding: 0 16px;
			gap: var(--mini-gap);
			height: 44px;
		}

		.tour-float__text {
			max-width: 140px;
			opacity: 1;
			font-size: var(--small-font-size);
		}
	}
}

.float-cta-enter-active,
.float-cta-leave-active {
	transition: all 0.3s ease;
}

.float-cta-enter-from,
.float-cta-leave-to {
	opacity: 0;
	transform: translateY(20px);
}
</style>
