<script setup>
const recommends = ref([
	{
		id: 1,
		img: '/imgs/5.png',
		price: 849.99,
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 2,
		img: '/imgs/5.png',
		price: 849.99,
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 3,
		img: '/imgs/5.png',
		price: 849.99,
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 4,
		img: '/imgs/5.png',
		price: 849.99,
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 5,
		img: '/imgs/5.png',
		price: 849.99,
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
])
</script>

<template>
	<article class="recommend">
		<h4 class="title">
			You may also like
		</h4>
		<ul class="recommend-list">
			<li v-for="r in recommends" :key="r.id" class="recommend-item">
				<nuxt-link :to="r.src">
					<img :src="r.img" alt="">
				</nuxt-link>
				<div class="info">
					<nuxt-link class="desc" :to="r.src">
						{{ r.desc }}
					</nuxt-link>
					<div class="price">
						<ProductPrice :data="r.price" />
						<button>
							<Icon name="icon:cart" />
						</button>
					</div>
				</div>
			</li>
		</ul>
	</article>
</template>

<style lang="scss" scoped>
.recommend {
	--margin: 15px auto;
	h4::before,
	h4::after {
		content: ' ';
		margin: 0 8px;
		background-color: var(--brand-black-10, #e8e8e8);
		content: '';
		display: inline-block;
		height: 1px;
		width: 20%;
	}
	h4 {
		margin: var(--margin);
		align-items: center;
		color: #bababa;
		display: flex;
		font-size: var(--font-size-medium);
		font-weight: 400;
		justify-content: center;
		margin: var(--margin);
		text-align: center;
	}
}
.recommend-list {
	--columns-num: 4;
	--recommend-gap: 5px;
	grid-gap: var(--margin-gap);
	align-items: start;
	color: #191919;
	color: var(--text-base);
	display: grid;
	gap: var(--margin-gap);
	grid-template-columns: repeat(var(--columns-num), 1fr);
	justify-content: space-between;
	li {
		--image-width: 140px;
		--image-height: 140px;
		--text-height: calc(var(--font-size-large) * var(--line-height));
		grid-gap: var(--recommend-gap);
		align-self: stretch;
		background-color: #fff;
		background-color: var(--background-white);
		border-radius: var(--border-radius);
		display: grid;
		gap: var(--recommend-gap);
		grid-template-rows:
			var(--image-width) calc(var(--text-height) * 2)
			auto;
		padding: var(--margin-gap);
		padding-top: calc(var(--margin-gap) * 2);
		position: relative;
		img {
			width: var(--image-width);
			height: var(--image-height);
			object-fit: cover;
			object-position: center;
		}
		.desc {
			display: flex;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-word;
			color: var(--text-base);
			font-size: 14px;
			line-height: unset;
			cursor: pointer;
			font-weight: 400;
			&:hover {
				text-decoration: underline;
			}
		}
		.price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 4px 0;
			font-weight: 500;
			font-size: 14px;
			button {
				background-color: var(--text-base);
				color: #fff;
				padding: 2px;
				border-radius: 6px;
				box-sizing: border-box;
				--icon-width: 12px;
				--icon-height: 12px;
			}
		}
	}
}
</style>
