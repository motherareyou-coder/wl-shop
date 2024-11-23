<script setup lang="ts">
import type { Review } from '~/types'

const props = defineProps({
	data: { type: Array as () => Review[] },
})
</script>

<template>
	<div class="user-review-container">
		<div v-for="r in props.data" :key="r.id" class="comment">
			<div class="comment-info">
				<div class="comment-info-top">
					<el-rate
						:model-value="r.scores"
						class="star-list"
						allow-half
						disabled
					/>
					<div class="comment-time">
						<app-time :data="r.createTime" />
					</div>
				</div>
				<p class="comment-goods">
					{{ r.spuName }}
					{{ r.skuProperties.map(d => d.valueName).join(' ') }}
				</p>
				<div class="comment-content">
					{{ r.content }}
				</div>
				<div class="comment-multimedia hasBorder">
					<div v-for="(img, index) in r.picUrls" :key="img" class="comment-image">
						<app-image :src="img" :preview-src-list="r.picUrls" :initial-index="index" />
					</div>
				</div>
				<div v-if="r.replyContent" class="comment-additional pl-6">
					<div class="comment-info-top">
						<p>{{ $t('Merchants reply') }}:</p>
						<app-time class="comment-additional-time" :data="r.replyTime" />
					</div>
					<div class="comment-additional-content">
						{{ r.replyContent }}
					</div>
				</div>
				<!-- <div class="comment-middle">
					<div class="comment-like">
						<el-icon>
							<Icon name="icon:like" />
						</el-icon>
						{{ $t('Likes') }}({{ r.up_num }})
					</div>
				</div> -->
			</div>
			<div class="commenter-info">
				<div class="commenter-info-private">
					<img class="commenter-info-image" :src="r.userAvatar">
					<h4 class="commenter-info-name">
						{{ r.userNickname }}
					</h4>
				</div>
				<ul class="commenter-info-review">
					<li class="commenter-review">
						<span class="commenter-review-title">{{ $t('Active Since') }}:</span>
						<app-time :data="r.createTime" class="commenter-review-content" />
					</li>
					<!-- <li class="commenter-review"> -->
					<!--	<span class="commenter-review-title">{{ $t('My Reviews') }}:</span> -->
					<!--	<span class="commenter-review-content"> 2 review</span> -->
					<!-- </li> -->
					<!-- <li class="commenter-review"> -->
					<!--	<span class="commenter-review-title">{{ $t('Helpful Votes') }}:</span> -->
					<!--	<span class="commenter-review-content">November 9,2018</span> -->
					<!-- </li> -->
					<li class="commenter-review">
						<span class="commenter-review-title">{{ $t('Most Recent Review') }}:</span>
						<span class="commenter-review-content">
							{{ r.spuName }}
						</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
