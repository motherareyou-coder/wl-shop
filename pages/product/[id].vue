<script setup>
import ProductReview from './components/ProductReview.vue'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const info = ref({
	name: 'Xiaomi 14T Pro',
	reviews: 13,
	img: '/imgs/5.png',
	price: 2.99,
	unit: '$',
	desc: 'Titan Black, 12 GB + 256 GB',
	coupon: 'Coupon: 10%off',
	images: ['/imgs/1.jpg', '/imgs/2.jpg'],
})

const tab = ref(1)

const skus = ref([
	{
		label: 'Colour',
		children: [
			{ label: 'Black', value: 1, img: '/imgs/5.png' },
			{ label: 'Blue', value: 2, img: '/imgs/5.png' },
		],
	},
	{
		label: 'Storage',
		children: [
			{ label: '12 GB + 128 GB', value: 1 },
			{ label: '12 GB + 256 GB', value: 2 },
		],
	},
])

const data = ref({
	qty: 1,
})

function handleStar() {}

function goCart() {
	router.push('/cart')
}
</script>

<template>
	<div class="product">
		<div class="navbar">
			<div class="container app-grid--vertical-100">
				<div class="title">
					<h4>
						{{ info.name || id }}
					</h4>
				</div>
				<div class="nav">
					<ul>
						<li :class="{ active: tab === 0 }" @click="tab = 0">
							<div>Overview</div>
						</li>
						<li :class="{ active: tab === 1 }" @click="tab = 1">
							<div>Review({{ info.reviews }}})</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="product__main">
			<div class="product__container app-grid--vertical-100">
				<div class="product__aside">
					<img :src="info.img" alt="">
				</div>
				<div class="product__article">
					<section>
						<h2 class="title">
							<span>{{ info.name }}</span>
							<el-icon @click="handleStar">
								<ElIconStar />
							</el-icon>
						</h2>
						<div class="info">
							<div class="desc">
								{{ info.desc }}
							</div>
							<div class="price">
								{{ info.unit }}
								{{ info.price }}
							</div>
						</div>
					</section>
					<section>
						<div class="coupon">
							<div class="reward">
								<span>
									{{ info.coupon }}
								</span>
							</div>
							<button>Get Coupons ></button>
						</div>
					</section>
					<section>
						<div class="sku">
							<template v-for="item in skus" :key="item.label">
								<h3 class="title">
									{{ item.label }}
								</h3>
								<ul class="list">
									<li
										v-for="c in item.children"
										:key="c.value"
									>
										<button
											:class="{
												active:
													data[item.label]
													=== c.value,
											}"
											@click="data[item.label] = c.value"
										>
											<img v-if="c.img" :src="c.img">
											{{ c.label }}
										</button>
									</li>
								</ul>
							</template>
							<h3>Quantity</h3>
							<div>
								<el-input-number
									v-model="data.qty"
									:step="1"
									:min="1"
									size="small"
								/>
							</div>
						</div>
					</section>
					<section>
						<div class="order-list">
							<ul>
								<li>
									<span>{{ info.name }}* {{ data.qty }}</span>
									<span>{{ info.price * data.qty }}</span>
								</li>
								<li>
									<span>Total:</span>
									<span>{{ info.price * data.qty }}</span>
								</li>
							</ul>
						</div>
					</section>
					<section>
						<button class="add-button" @click="goCart">
							Buy Now
						</button>
					</section>
				</div>
			</div>
		</div>
		<div class="content">
			<div v-show="tab === 0" class="specs-con">
				<img
					v-for="img in info.images"
					:key="img"
					:src="img"
					lazy
					style="width: 100%"
				>
			</div>
			<ProductReview
				v-show="tab === 1"
				:id="id"
				class="app-grid--vertical-100"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.product {
	.navbar {
		background-color: #fff;
		.container {
			margin-top: 0;
			height: 60px;
			min-width: 1024px;
			width: auto;
			align-items: center;
			display: flex;
			justify-content: space-between;
			.title {
				font-size: 24px;
				align-items: baseline;
				color: #333;
				display: flex;
				font-size: 24px;
				line-height: 60px;
				overflow: hidden;
				white-space: nowrap;
			}
			.nav {
				align-items: center;
				display: flex;
				flex-shrink: 0;
				height: 100%;
				position: relative;
				li {
					cursor: pointer;
					display: inline-block;
					margin: 0 16px;
					color: #898989;
					font-size: 16px;
					font-weight: 400;
					height: 17px;
					line-height: 17px;
					&.active {
						color: #191919;
						font-weight: 700;
					}
				}
			}
		}
	}
	.product__container {
		display: flex;
		font-size: 16px;
		justify-content: center;
		margin: 0 auto;
		width: auto;
		section {
			&:nth-child(1) {
				padding-bottom: 20px;
			}
			&:nth-child(2) {
				border-bottom: 1px solid #eee;
				border-top: 1px solid #eee;
			}
			&:nth-child(3) {
				padding-top: 10px;
			}
			&:nth-child(4) {
				padding: 20px 0;
			}
		}
		.product__aside {
			height: min(calc(100vh - 2.34375vw), 23.4375vw);
			max-height: 600px;
			max-width: 600px;
			width: min(calc(100vh - 2.34375vw), 23.4375vw);
			display: flex;
			flex-direction: column;
			margin-left: 0;
			position: sticky;
			text-align: center;
			top: 60px;
			transition: background-color 0.25s ease;
		}
		.product__article {
			margin-left: 3.515625vw;
			padding: 1.953125vw 2.34375vw;
			background-color: var(--background-white);
			box-sizing: border-box;
			color: #191919;
			height: 100%;
			@media screen and (min-width: 721px) and (max-width: 1024px) {
				margin-left: 6.25vw;
				padding: 2.4305555556vw 3.4722222222vw;
				width: 43.0555555556vw;
			}

			@media screen and (min-width: 1025px) and (max-width: 1440px) {
				margin-left: 6.25vw;
				padding: 2.4305555556vw 3.4722222222vw;
				width: 43.0555555556vw;
			}

			@media screen and (min-width: 1441px) and (max-width: 1920px) {
				margin-left: 3.515625vw;
				padding: 1.953125vw 2.34375vw;
				width: 26.5625vw;
			}

			@media screen and (min-width: 1921px) {
				margin-left: 3.515625vw;
				padding: 1.953125vw 2.34375vw;
				width: 26.5625vw;
			}
			.title {
				font-size: max(1.5625vw, 12px);
				line-height: 1.875vw;
				align-items: center;
				color: #191919;
				display: flex;
				font-weight: 700;
				justify-content: space-between;
				margin: 0 0 5px;
				width: 100%;
				.el-icon {
					cursor: pointer;
					&.active,
					&:hover {
						color: var(--text-primary);
					}
				}
			}
			.info {
				box-sizing: border-box;
				color: #898989;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				overflow: hidden;
				width: 100%;
				.desc {
					color: #898989;
				}
				.price {
					margin-top: 8px;
					color: #191919;
				}
			}
			.coupon {
				display: flex;
				align-items: center;
				padding-bottom: 20px;
				padding-top: 20px;
				.reward {
					color: #ff9e0d;
					overflow: hidden;
					user-select: none;
					display: inline-block;
					width: auto;
					&:last-of-type {
						margin-bottom: 0 !important;
					}
					@media screen and (min-width: 721px) and (max-width: 1024px) {
						font-size: max(0.8333333333vw, 12px);
						margin-bottom: 0.9722222222vw;
					}

					@media screen and (min-width: 1025px) and (max-width: 1440px) {
						font-size: max(0.8333333333vw, 12px);
						margin-bottom: 0.9722222222vw;
					}

					@media screen and (min-width: 1441px) and (max-width: 1920px) {
						font-size: max(0.546875vw, 12px);
						margin-bottom: 0.546875vw;
					}

					@media screen and (min-width: 1921px) {
						font-size: max(0.546875vw, 12px);
						margin-bottom: 0.546875vw;
					}
					span {
						border-radius: 0.5555555556vw;
						padding: 0.3472222222vw 1.3888888889vw;
						align-items: center;
						background: #fff0e6;
						border: 1px solid #ff9e0d;
						box-sizing: border-box;
						cursor: pointer;
						display: inline-flex;
						height: 24px;
						justify-content: center;
						max-width: 100%;
						position: relative;
						white-space: nowrap;
						&::before {
							left: 0;
							transform: translateX(-50%) translateY(-50%);
							background: #fff;
							border: 1px solid #ff9e0d;
							border-radius: 50%;
							box-sizing: border-box;
							content: '';
							height: 8px;
							position: absolute;
							top: 50%;
							width: 8px;
						}
						&::after {
							right: 0;
							transform: translateX(50%) translateY(-50%);
							background: #fff;
							border: 1px solid #ff9e0d;
							border-radius: 50%;
							box-sizing: border-box;
							content: '';
							height: 8px;
							position: absolute;
							top: 50%;
							width: 8px;
						}
					}
				}
				a {
					font-size: max(0.9722222222vw, 12px);
					margin-inline-start: 1.1111111111vw;
					color: #ff6900;
					cursor: pointer;
				}
			}
			.sku {
				.title {
					font-size: max(0.9375vw, 12px);
					line-height: 1.171875vw;
					margin-bottom: 0.8984375vw;
					margin-top: 1.3671875vw;
					color: #191919;
					font-weight: 700;
				}
				.list {
					--image-width: 20px;
					--image-height: 20px;
					li {
						display: inline-block;
						&:not(:last-of-type) {
							margin-right: 12px;
						}
						img {
							width: var(--image-width);
							height: var(--image-height);
							margin-right: 0.625vw;
						}
						button {
							font-size: 12px;
							padding: 12px 16px;
							width: 6.875vw;
							align-items: center;
							background-color: #fff;
							border: 1px solid #e7e7e7;
							border-radius: 4px;
							color: #191919;
							color: #757575;
							display: flex;
							flex-flow: row nowrap;
							height: 100%;
							justify-content: center;
							transition: opacity, border,
								background-color 0.2s linear;
							user-select: none;
							cursor: pointer;
							width: auto;
							&.active {
								border-color: #ff6700;
								color: #424242;
								transition: opacity, border,
									background-color 0.2s linear;
							}
						}
					}
				}
			}
			.order-list {
				background-color: #f7f7f7;
				box-sizing: border-box;
				width: 100%;
				padding: 20px;
				li {
					font-size: 16px;
					align-items: flex-start;
					color: #191919;
					display: flex;
					justify-content: space-between;
					min-height: 20px;
					&:not(:last-child) {
						margin-bottom: 12px;
					}
				}
			}
			.add-button {
				background: #191919;
				border: 1px solid #191919;
				color: #fff;
				overflow: hidden;
				text-transform: uppercase;
				user-select: none;
				cursor: pointer;
				width: 100%;
				border-radius: 12px;
				padding: 12px;
				font-size: 12px;
			}
		}
	}
	.content {
		margin-top: 64px;
		.reviews {
		}
	}
}
</style>
