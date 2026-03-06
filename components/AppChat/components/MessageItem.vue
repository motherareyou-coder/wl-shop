<script setup lang="ts">
import type { OrderDetail, ProductDetail } from '~/types'
import { emojiList } from '../utils/emoji'
import OrderItem from './OrderItem.vue'
import ProductItem from './ProductItem.vue'

const props = defineProps({
	currentUser: { type: String },
})
const data = defineModel<Message>('data', { required: true })
const isCurrent = computed(() =>
	data.value.sender === props.currentUser,
)
</script>

<script lang="ts">
export enum MessageType {
	Image = 1,
	Product = 2,
	Order = 3,
	Emoji = 4,
	Text = 5,
}

export interface Message {
	type: MessageType
	id?: number
	sender: string
	senderAvatar: string
	createTime: string
	value: string | number
}
</script>

<template>
	<div class="message-item flex justify-end" :class="[isCurrent ? '' : 'flex-row-reverse']">
		<div class="flex flex-col" :class="[isCurrent ? 'items-end ml-10' : 'mr-10']">
			<div style="color: var(--title-light);">
				{{ data.createTime }}
			</div>
			<p v-if="data.type === MessageType.Text" v-html="data.value as string"></p>
			<app-image v-if="data.type === MessageType.Emoji" :src="emojiList.find(item => item.name === data.value)?.url as string" class="w-10 h-10" />
			<app-image v-if="data.type === MessageType.Image" :src="data.value as string" class="max-h-80 rounded-lg" :preview-src-list="[data.value]" />
			<div v-if="data.type === MessageType.Order">
				<OrderItem v-model="data.value as OrderDetail" />
			</div>
			<div v-if="data.type === MessageType.Product">
				<ProductItem v-model="data.value as ProductDetail" />
			</div>
		</div>
		<app-image :src="data.senderAvatar" class="mx-2 w-12 h-12" style="border-radius: 50%" />
	</div>
</template>
