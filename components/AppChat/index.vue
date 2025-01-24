<script setup lang="ts">
import dayjs from 'dayjs'
import { isString } from 'lodash-es'
import type { OrderDetail, ProductDetail } from '~/types'
import MessageInput from './components/MessageInput.vue'
import MessageItem, { type Message, MessageType } from './components/MessageItem.vue'
import { emojiList } from './utils/emoji'
import './index.scss'

defineOptions({
	name: 'AppChat',
})

const {shortDomain,kefuWsUrl} = useRuntimeConfig().public
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

// const { status, data, send, open, close } = useWebSocket(`ws://122.190.56.101:6060/shop-server/infra/ws?token=${userStore.accessToken}`, {
const { status, data, send, open, close } = useWebSocket(`${kefuWsUrl}?token=${userStore.accessToken}`, {
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
  console.log("handleSend:",type,value)
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
  // todo-wl 消息列表是否从后台获取
	// send(JSON.stringify(obj))
  //发送消息
  // await KeFuApi.sendKefuMessage(data);
  // //刷新消息
  // await messageListRef.value.refreshMessageList();
}
//接收消息
function handleReceive(data: string | Message) {
	console.log('handleReceive', data)
	if (!data)
		return
  if (data == 'pong') {
    console.log("连接心跳...")
    return
  }
	const m = isString(data) ? JSON.parse(data) : data;
  if(m.type === 'kefu_message_read_status_change'){
    console.log("The administrator has read the message");
    return
  }
  receiveHandlerMsg(m)
}

//接收消息后处理，只能接收两种消息,文字+文字表情，图片
async function receiveHandlerMsg(data: string) {
  console.log("receiveHandlerMsg:", data)
  let msgDataTemp = {};
  switch (data.type) {
    case 'kefu_message_type':
      //接收到消息,消息三种类型，contentType.1 表情,文字 2.图片
      let messageTemp = JSON.parse(data.content);
      if (messageTemp.contentType === MessageType.Text || messageTemp.contentType === MessageType.Emoji) {
        let textObj = replaceEmoji(messageTemp.content)
        msgDataTemp.type = textObj.contentType
        msgDataTemp.value = textObj.content
      }
      if (messageTemp.contentType === MessageType.Image) {
        msgDataTemp.type = MessageType.Image
        msgDataTemp.value = messageTemp.content
      }
      break
  }
  msgDataTemp.sender = shortDomain
  msgDataTemp.senderAvatar = new URL('@/assets/emoji/iswink.png', import.meta.url).href
  msgDataTemp.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss');// 将时间戳格式化为指定格式
  console.log("接收消息，加入列表", msgDataTemp);
  msgList.value.push(msgDataTemp)
}
//将文本中的表情转换为图片
const replaceEmoji = (content: string) => {
  let newData = content
  if (typeof newData !== 'object') {
    const reg = /\[(.+?)]/g // [] 中括号
    const zhEmojiName = newData.match(reg)
    if (zhEmojiName) {
      //后台发送多个表情时,只取一个表情
      if (zhEmojiName.length > 1) {
          newData = emojiList.find((emoji) => emoji.name === zhEmojiName[0])?.name;
      } else {
        zhEmojiName.forEach((item) => {
          newData = emojiList.find((emoji) => emoji.name === item)?.name
        });
      }
    }
  }
  if (newData !== content) {
    return {
      contentType: MessageType.Emoji,
      content: newData
    };
  } else {
    return {
      contentType: MessageType.Text,
      content: newData
    }
  }
}

//发送消息
  async function pushMsg(data: Message) {
    console.log("pushMsg:", data)
    switch (data.type) {
      case MessageType.Order:
        data.value = JSON.stringify((await $api<OrderDetail>(
            'trade/order/get-detail',
            {params: {id: data.value}},
        )))
        break
      case MessageType.Product:
        data.value = JSON.stringify((await $api<ProductDetail>(
            'product/spu/get-detail',
            {params: {id: data.value}},
        )))
        break
    }
    $api('/promotion/kefu-message/send', {
      method: 'post',
      body: {
        contentType:data.type,
        content:data.value,
      },
    })
    msgList.value.push(data)
    console.log("加入msgList之后数据为：", msgList)
  }

  watch(data, handleReceive, {immediate: true})
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
