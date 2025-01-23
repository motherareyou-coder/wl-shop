<script setup lang="ts">
import dayjs from 'dayjs'
import { isString } from 'lodash-es'
import type { OrderDetail, ProductDetail } from '~/types'
import MessageInput from './components/MessageInput.vue'
import MessageItem, { type Message, MessageType } from './components/MessageItem.vue'
import './index.scss'

defineOptions({
	name: 'AppChat',
})

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const chatStore = useChatStore()
const { t } = useI18n()

const showChat = computed(() => {
	return (route.path.includes('user/cart') || route.path.includes('user/checkout')) && userStore.id
})
const visible = ref(false)
const msgList = computed(() => chatStore.msgList)
const msg = ref('')

const { status, data, send, open, close } = useWebSocket(`ws://122.190.56.101:6060/shop-server/infra/ws?token=${userStore.accessToken}`, {
	autoReconnect: {
		retries: 5,
		delay: 1000,
		onFailed() {
			ElMessage.info(t('连接客服失败'))
		},
	},
	immediate: false,
	heartbeat: true,
})
onBeforeUnmount(close)

// const isOpen = computed(() => true)
const isOpen = computed(() => status.value === 'OPEN')
function handleOpen() {
	visible.value = true
	status.value === 'CONNECTING' || open()
}
function handleSend({ type, value }: Pick<Message, 'type' | 'value'>) {
	const obj = {
		type,
		value,
		sender: userStore.info.nickname,
		senderAvatar: userStore.info.avatar,
		createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
	}
	switch (type) {
		case MessageType.Text:
			if (!msg.value)
				return
			msg.value = ''
			break
		case MessageType.Image:
			break
		case MessageType.Emoji:
			break
		case MessageType.Order:
			break
		case MessageType.Product:
			break
	}
	pushMsg(obj)
	send(JSON.stringify(obj))
}
function handleRecieve(data: string | Message) {
	console.log('handleRecieve', data)
	if (!data)
		return
	const m = isString(data) ? JSON.parse(data) : data as Message
	pushMsg(m)
}
async function pushMsg(data: Message) {
	switch (data.type) {
		case MessageType.Order:
			data.value = (await $api<OrderDetail>(
				'trade/order/get-detail',
				{ params: { id: data.value } },
			))
			break
		case MessageType.Product:
			data.value = (await $api<ProductDetail>(
				'product/spu/get-detail',
				{ params: { id: data.value } },
			))
			break
	}
	msgList.value.push(data)
}
watch(data, handleRecieve, { immediate: true })
const scrollbar = ref()
function scrollToBottom() {
	nextTick(() => {
		scrollbar.value?.wrapRef.scrollTo({
			top: scrollbar.value?.wrapRef.scrollHeight,
			behavior: 'smooth',
		})
	})
}
useResizeObserver(computed(() => scrollbar.value?.wrapRef?.children[0]), scrollToBottom)
</script>

<template>
	<div v-if="showChat" class="mi-livechat mi-livechat--icon-model site-cart__customer-service" @click="handleOpen">
		<div class="support-contact__customer-service">
			<i class="micon micon-customer-service support-contact__customer-service-icon"></i>
		</div>
	</div>
	<app-modal
		v-model="visible" :title="$t('在线客服')" :style="appStore.isMobile ? 'min-height: 100vh' : ''"
		class="customer-service" :class="[appStore.isPC ? 'is-pc' : 'is-mobile']"
	>
		<div class="message-list">
			<el-scrollbar ref="scrollbar">
				<MessageItem
					v-for="item in msgList" :key="item.id" :data="item" class="my-4"
					:current-user="userStore.info.nickname"
				/>
			</el-scrollbar>
		</div>
		<template #footer>
			<MessageInput v-model="msg" :disabled="!isOpen" @send="handleSend" />
		</template>
	</app-modal>
</template>
