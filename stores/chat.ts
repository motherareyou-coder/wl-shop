import { defineStore } from 'pinia'
import type { Message } from '~/components/AppChat/components/MessageItem.vue'

export const useChatStore = defineStore('ChatStore', {
	state: () => {
		return {
			msgList: [] as Message[],
			// 跨组件触发"打开聊天"的信号（自增计数器，每次触发 +1）
			// 用于首页悬浮咨询按钮触发 AppChat 打开
			openSignal: 0,
		}
	},
	actions: {
		// 请求打开聊天窗口（外部组件调用）
		requestOpen() {
			this.openSignal++
		},
	},
	persist: {
		storage: import.meta.client ? localStorage : undefined,
	},
})
