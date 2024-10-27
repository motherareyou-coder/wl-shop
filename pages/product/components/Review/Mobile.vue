<script setup lang="ts">
import type { Review } from '~/types'

const props = defineProps({
	data: { type: Array as () => Review[] },
})
</script>

<template>
	<div>
		<div v-for="r in props.data" :key="r.id" class="user_review">
			<div class="user_review--review_info">
				<div class="user_review--review_info--user_info">
					<img
						class="user_review--review_info--user_avatar"
						:src="r.userAvatar"
					>
					<div class="user_review--review_info--user_msg">
						<p class="user_review--review_info--user_nickname">
							{{ r.userNickname }}
						</p>
						<p class="user_review--review_info--submit_time">
							{{ r.createTime }}
						</p>
					</div>
				</div>
				<el-rate
					:model-value="r.scores / 20"
					class="star-list user_review--review_info--stars"
					allow-half
					disabled
				/>
			</div>
			<div class="user_review--review_content">
				{{ r.content }}
			</div>
			<div class="user_review--operation">
				<p class="user_review--operation--product_name">
					{{ r.skuProperties.map(d => d.valueName).join(' ') }}
				</p>
				<!-- <div class="user_review--operation--action">
					<div class="user_review--operation--thumb_up">
						<el-icon
							class="icon-like user_review--operation--icon_thumb_up"
						>
							<Icon name="icon:like" />
						</el-icon>
						<span class="user_review--operation--up_num">
							{{ $t('Likes') }}({{ r.up_num }})
						</span>
					</div>
				</div> -->
			</div>
		</div>
	</div>
</template>
