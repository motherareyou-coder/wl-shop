import { defineStore } from 'pinia'
import type { Message } from '~/components/AppChat/components/MessageItem.vue'

export const useChatStore = defineStore('ChatStore', {
	state: () => {
		return {
			msgList: [] as Message[],
		}
	},
	persist: {
		storage: import.meta.client ? localStorage : undefined,
	},
})
