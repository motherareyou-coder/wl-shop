<script setup>
const props = defineProps({
	id: { type: Number, required: true },
})
const tags = ref(['All', 'Good', 'Bad'])
const reviews = ref([
	{
		id: '1',
		goods: 'Xiaomi 14T Pro Titan Gray 12 GB + 256 GB',
		star: 3.5,
		time: 'September 29,2024',
		content:
			'Screen is a pleasure to look at, camera system simply amazing producing incredible photos and videos. I would say is also very ergonomic and comfortable to use.',
		likes: 5,
		reviewer: {
			avatar: '/imgs/avatar.png',
			name: 'Dave',
		},
	},
	{
		id: '2',
		goods: 'Xiaomi 14T Pro Titan Gray 12 GB + 256 GB',
		star: 3.5,
		time: 'September 29,2024',
		content:
			'Screen is a pleasure to look at, camera system simply amazing producing incredible photos and videos. I would say is also very ergonomic and comfortable to use.',
		likes: 5,
		reviewer: {
			avatar: '/imgs/avatar.png',
			name: 'Dave',
		},
	},
	{
		id: '3',
		goods: 'Xiaomi 14T Pro Titan Gray 12 GB + 256 GB',
		star: 3.5,
		time: 'September 29,2024',
		content:
			'Screen is a pleasure to look at, camera system simply amazing producing incredible photos and videos. I would say is also very ergonomic and comfortable to use.',
		likes: 5,
		reviewer: {
			avatar: '/imgs/avatar.png',
			name: 'Dave',
		},
	},
	{
		id: '4',
		goods: 'Xiaomi 14T Pro Titan Gray 12 GB + 256 GB',
		star: 3.5,
		time: 'September 29,2024',
		content:
			'Screen is a pleasure to look at, camera system simply amazing producing incredible photos and videos. I would say is also very ergonomic and comfortable to use.',
		likes: 5,
		reviewer: {
			avatar: '/imgs/avatar.png',
			name: 'Dave',
		},
	},
])

function load() {
	console.log('load')
}
</script>

<template>
	<div class="product-reviews">
		<ul class="review-tags">
			<li v-for="t in tags" :key="t" class="tag">
				{{ t }}
			</li>
		</ul>
		<div v-infinite-scroll="load">
			<div v-for="r in reviews" :key="r.id" class="review-item" :data="r">
				<div class="comment">
					<div class="top">
						<el-rate
							v-model="r.star"
							class="star"
							allow-half
							disabled
						/>
						<div class="time">
							{{ r.time }}
						</div>
					</div>
					<div class="goods">
						{{ r.goods }}
					</div>
					<div class="content">
						{{ r.content }}
					</div>
					<div class="likes">
						<Icon name="icon:like" />
						<span>Likes({{ r.likes }})</span>
					</div>
				</div>
				<div class="reviewer">
					<div class="top">
						<img :src="r.reviewer?.avatar" alt="" />
						<span class="name">{{ r.reviewer?.name }}</span>
					</div>
					<ul>
						<li>
							<span class="title">Active Since:</span>
							<span class="content">November 9,2018</span>
						</li>
						<li>
							<span class="title">My Reviews:</span>
							<span class="content"> 2 review</span>
						</li>
						<li>
							<span class="title">Helpful Votes:</span>
							<span class="content">November 9,2018</span>
						</li>
						<li>
							<span class="title">Most Recent Review:</span>
							<span class="content">
								Xiaomi Pad 6 Mist blue 6 GB + 128 GB
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.product-reviews {
	.review-tags {
		background-color: #fff;
		padding: 30px 48px;
		margin-bottom: 32px;
		li {
			border: 1px solid #ddd;
			color: #999;
			cursor: pointer;
			display: inline-block;
			font-size: 14px;
			height: 30px;
			line-height: 30px;
			margin-right: 20px;
			padding: 0 15px;
			&.active {
				border-color: #ff6700;
				color: #ff6700;
			}
		}
	}
	.review-item {
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		margin-bottom: 32px;
		.comment {
			margin: 40px;
			color: #b0b0b0;
			font-size: 14px;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.content {
				color: #757575;
				font-size: 16px;
				line-height: 28px;
				margin-top: 10px;
				overflow: hidden;
				word-break: break-word;
			}
			.likes {
				padding-top: 12px;
				border-top: 1px solid #e0e0e0;
				margin-top: 20px;
				text-align: right;
				span {
					vertical-align: middle;
				}
				svg {
					vertical-align: middle;
					margin-right: 12px;
				}
			}
		}
		.reviewer {
			padding: 20px 40px;
			.top {
				display: flex;
				--image-width: 64px;
				--image-height: 64px;
				img {
					width: var(--image-width);
					height: var(--image-height);
					margin-right: 16px;
				}
				.name {
					color: #424242;
					font-size: 18px;
					font-weight: 400;
					margin: 4px 20px;
				}
			}
			li {
				border-bottom: 1px solid #e0e0e0;
				display: flex;
				padding-bottom: 15px;
				padding-top: 14px;
				.title {
					color: #b0b0b0;
					display: inline-block;
					font-size: 14px;
					line-height: 22px;
					width: 120px;
				}
				.content {
					color: #424242;
					font-size: 14px;
					line-height: 22px;
					width: 135px;
				}
			}
		}
	}
}
</style>
