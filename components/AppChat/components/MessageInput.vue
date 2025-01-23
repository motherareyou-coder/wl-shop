<script setup lang="ts">
import { emojiList } from '../utils/emoji'
import { type Message, MessageType } from './MessageItem.vue'
import OrderSelect from './OrderSelect.vue'
import ProductSelect from './ProductSelect.vue'

const props = defineProps({
	disabled: { type: Boolean },
})
const emit = defineEmits(['send'])
const msg = defineModel<string>()
const showOrderProduct = ref(false)
const selectType = ref()
function showSelect(type?: MessageType) {
	if (props.disabled)
		return
	if (selectType.value === type)
		return selectType.value = ''
	switch (type) {
		case MessageType.Emoji:
		case MessageType.Order:
		case MessageType.Product:
			selectType.value = type
			showOrderProduct.value = false
			break
		default:
			if (showOrderProduct.value) {
				showOrderProduct.value = false
			}
			else {
				showOrderProduct.value = true
				selectType.value = ''
			}
			break
	}
}

const uploadRef = ref()

function handleImageChange(p: { file: Blob }) {
	const form = new FormData()
	form.append('file', p.file)
	return $api('infra/file/upload', {
		method: 'post',
		body: form,
	}).then((res) => {
		handleSend(MessageType.Image, res as string)
		uploadRef.value?.clearFiles()
	})
}

function handleSend(type: Message['type'], value: Message['value']) {
	emit('send', { type, value })
	if ([MessageType.Product, MessageType.Order].includes(type))
		selectType.value = ''
}
</script>

<template>
	<div class="message-input flex items-center" :class="{ 'is-disabled': props.disabled }">
		<el-input v-model="msg" :disabled="props.disabled" @keydown.enter="msg && handleSend(MessageType.Text, msg)" />
		<i class="micon" @click="showSelect(MessageType.Emoji)">
			<Icon name="icon:emoji" />
		</i>
		<i class="micon micon-quantity-increase" @click="showSelect()"></i>
	</div>
	<div class="select-content">
		<div v-if="selectType === MessageType.Emoji" class="emoji-container">
			<el-scrollbar>
				<app-image
					v-for="item in emojiList" :key="item.name" :title="item.name" class="emoji-img"
					:src="item.url" @click="handleSend(MessageType.Emoji, item.url)"
				/>
			</el-scrollbar>
		</div>
		<div v-if="showOrderProduct" class="select-type">
			<div @click="showSelect(MessageType.Order)">
				<img src="@/assets/chat/order.png" alt="" class="icon">
				<p>{{ $t('订单') }}</p>
			</div>
			<div @click="showSelect(MessageType.Product)">
				<img src="@/assets/chat/goods.png" alt="" class="icon">
				<p>{{ $t('商品') }}</p>
			</div>
			<el-upload
				ref="uploadRef" accept=".jpg,.jpeg,.png,.gif" :show-file-list="false" :limit="1"
				:http-request="handleImageChange"
			>
				<img src="@/assets/chat/image.png" alt="" class="icon">
				<p>{{ $t('图片') }}</p>
			</el-upload>
		</div>
		<OrderSelect v-if="selectType === MessageType.Order" @send="handleSend(MessageType.Order, $event)" />
		<ProductSelect v-if="selectType === MessageType.Product" @send="handleSend(MessageType.Product, $event)" />
	</div>
</template>
