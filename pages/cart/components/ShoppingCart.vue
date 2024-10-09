<script setup>
import Coupon from './Coupon.vue'

const goods = ref([
	{
		id: 1,
		img: '/imgs/5.png',
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		price: 849.99,
		qty: 1,
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 2,
		img: '/imgs/5.png',
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		price: 849.99,
		qty: 1,
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 3,
		img: '/imgs/5.png',
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		price: 849.99,
		qty: 1,
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
	{
		id: 4,
		img: '/imgs/5.png',
		desc: 'Xiaomi 14 Black 12 GB + 256 GB',
		price: 849.99,
		qty: 1,
		src: 'https://www.mi.com/uk/product/xiaomi-14/?skupanel=1&gid=4223703657',
	},
])

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

const drawerShow = ref(false)
</script>

<template>
	<div class="shopping-cart">
		<article class="detail">
			<div class="top">
				<ElCheckbox>All</ElCheckbox>
				<button>Delete</button>
			</div>
			<section class="group">
				<div v-for="g in goods" :key="g.id" class="item">
					<ElCheckbox />
					<div>
						<nuxt-link :to="g.src">
							<img :src="g.img" alt="" />
						</nuxt-link>
					</div>
					<div class="info">
						<div class="desc">
							<nuxt-link :to="g.src">
								{{ g.desc }}
							</nuxt-link>
						</div>
						<ProductPrice :data="g.price" />
					</div>
					<div class="qty">
						<el-input-number v-model="g.qty" :min="1" />
						<el-icon><ElIconDelete /></el-icon>
					</div>
				</div>
			</section>
		</article>
		<article class="summary">
			<div class="area">
				<section>
					<div class="total">
						<h3>ToTal</h3>
						<ProductPrice class="orange" :data="2386.99" />
					</div>
					<ul class="list">
						<li>
							<span>Subtotal</span>
							<span>£2,386.99</span>
						</li>
						<li>
							<span>Shipping fee</span>
							<span class="orange">Free</span>
						</li>
						<li>
							<div class="message">
								Pay £99.46/mo. for 24 months at 0.0% interest.
								<nuxt-link
									to="#paypalCreditModal"
									target="_blank"
									class="orange"
								>
									Learn more
								</nuxt-link>
							</div>
						</li>
					</ul>
					<footer>
						<div class="coupon">
							<div>
								<Icon name="icon:coupon" />
								<span class="title">Coupons</span>
								<span class="highlight">
									(Save up to £64.90)
								</span>
							</div>
							<button @click="drawerShow = true">
								<span> 4 optionals </span>
								<el-icon>
									<ElIconArrowRight />
								</el-icon>
							</button>
						</div>
						<div>
							<button
								class="app-button submit-button"
								type="primary"
							>
								Checkout
							</button>
						</div>
					</footer>
				</section>
				<div class="service">
					<el-collapse>
						<el-collapse-item title="Why buy from mi.com">
							<div class="separator" />
							<div class="item">
								<Icon name="icon:shop" />
								<div class="content">
									<div>Fast delivery</div>
									<div>
										2-5 days FREE delivery<br />Door-to-door
										standard delivery
									</div>
								</div>
							</div>
							<div class="item">
								<Icon name="icon:shop" />
								<div class="content">
									<div>Free return</div>
									<div>
										14-day free return<br />30-day
										replacement & return for manufacturing
										problems
									</div>
								</div>
							</div>
							<div class="item">
								<Icon name="icon:shop" />
								<div class="content">
									<div>Secure checkout</div>
									<div>
										Safe & Secure checkout. Easy and Fast
									</div>
									<div>
										<img
											src="@/assets/imgs/visa-logo.png"
											alt="visa"
										/>
										<img
											src="@/assets/imgs/mastercard-logo.png"
											alt="mastercard"
										/>
										<img
											src="@/assets/imgs/american-express-logo.png"
											alt="american-express"
										/>
										<img
											src="@/assets/imgs/paypal-logo.png"
											alt="paypal"
										/>
									</div>
								</div>
							</div>
							<div class="separator" />
							<div class="help">
								Need more help? Chat now or call
								<a href="tel: 0800 021 1888">0800 021 1888</a>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
		</article>
		<article class="recommend">
			<h4 class="title">You may also like</h4>
			<ul class="recommend-list">
				<li v-for="r in recommends" :key="r.id" class="recommend-item">
					<nuxt-link :to="r.src">
						<img :src="r.img" alt="" />
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
		<Coupon v-model="drawerShow" />
	</div>
</template>

<style lang="scss" scoped>
.shopping-cart {
	--margin-gap: 12px;
	--border-radius: 12px;
	--padding: 24px;
	--action-icon: 24px;
	--grid-images-area: 140px;
	--image-width: 140px;
	--image-height: 140px;
	.detail {
		align-content: start;
		display: grid;
		gap: var(--margin-gap);
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px var(--padding);
			font-size: 14px;
			background-color: var(--background-white);
			border-radius: var(--border-radius);
			box-sizing: border-box;
			width: 100%;
			button {
				align-items: center;
				border-radius: initial;
				display: inline-flex;
				line-height: unset;
				padding: 0;
				border: none;
				cursor: pointer;
				background-color: transparent;
			}
		}
		.group {
			align-content: start;
			display: grid;
			gap: var(--margin-gap);
			.item {
				background-color: var(--background-white);
				border-radius: var(--border-radius);
				box-sizing: border-box;
				padding: var(--padding);
				width: 100%;
				display: grid;
				grid-gap: 16px;
				grid-auto-flow: column;
				grid-template-columns: auto auto 1fr auto;
				.el-checkbox {
					align-self: center;
				}
				img {
					object-fit: cover;
					object-position: center;
					width: var(--image-width);
					height: var(--image-height);
				}
				.qty {
					display: flex;
					flex-direction: column;
					align-items: end;
					.el-input-number {
						width: auto;
						border: none;
						--el-fill-color-light: transparent;
						--el-border-color: transparent;
						--el-border: none;
						:deep {
							.el-input__inner {
								background: #f0f0f0 !important;
								border-radius: 5px;
								font-size: 14px;
								width: 30px;
								line-height: 30px;
							}
							.el-input__wrapper {
								box-shadow: none !important;
								padding-left: 32px;
								padding-right: 32px;
							}
						}
					}
					.el-icon {
						font-size: 20px;
						color: #dbdbdb;
						cursor: pointer;
						margin-top: 12px;
						&:hover {
							color: var(--text-base);
						}
					}
				}
			}
		}
	}
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
				--text-height: calc(
					var(--font-size-large) * var(--line-height)
				);
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
					-webkit-box-orient: var(--btn-ellipsis-direction);
					-webkit-line-clamp: var(--btn-ellipsis-lines);
					display: box;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-word;
					color: var(--text-base);
					font-size: var(--link-font-size, 14px);
					line-height: unset;
					cursor: pointer;
					--btn-ellipsis-lines: 2;
					--link-font-size: var(--font-size-large);
					--btn-font-size: var(--font-size-large);
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
	}
	.summary {
		--summary-box-margin: 34px;
		--footnote-font-size: 16px;
		grid-row: span 2;
		.area {
			grid-gap: var(--margin-gap);
			align-content: start;
			display: grid;
			gap: var(--margin-gap);
			grid-template-columns: 1fr;
			position: sticky;
			top: calc(var(--margin-gap) + var(--header-height));
		}
		section {
			background-color: var(--background-white);
			border-radius: var(--border-radius);
			box-sizing: border-box;
			padding: var(--padding);
			width: 100%;
		}
		.total {
			font-size: 20px;
			align-items: center;
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			h3 {
				font-weight: 500;
				margin: 0;
			}
			strong {
				font-size: 20px;
				font-weight: 600;
			}
		}
		.orange {
			color: var(--text-primary);
		}
		.list {
			font-size: 16px;
			gap: 24px;
			display: grid;
			grid-template-columns: 1fr;
			margin-top: var(--summary-box-margin);

			li {
				align-items: center;
				display: flex;
				flex-flow: row nowrap;
				gap: 0 8px;
				justify-content: space-between;
				position: relative;
			}
		}
		.coupon {
			align-items: center;
			background-color: var(--brand-orange-10, #fff0e5);
			border: 1px solid var(--background-white, #fff);
			border-radius: var(--border-radius);
			box-sizing: border-box;
			display: flex;
			flex-flow: row nowrap;
			font-size: var(--font-size);
			justify-content: space-between;
			--font-size: 14px;
			--margin-gap: 8px;
			padding: 10px 16px;
			margin-top: 26px;
			> div {
				align-items: center;
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
				margin-inline-end: var(--margin-gap);
				flex-wrap: nowrap;
				white-space: nowrap;
				font-size: 14px;
				color: var(--text-base);
				> * {
					margin-inline-end: var(--margin-gap);
				}
				.svg-icon {
					color: var(--text-primary);
					font-size: 24px;
				}
				.highlight {
					color: #8c8c8c;
				}
			}
			button {
				font-size: 12px;
				white-space: nowrap;
				border: none;
				cursor: pointer;
				background: transparent;
				align-items: center;
				border-radius: initial;
				display: inline-flex;
				color: #757575;
				padding: 0;
				span {
					color: var(--el-color-warning);
				}
			}
		}
		.submit-button {
			width: 100%;
			margin-top: 12px;
		}
		.service {
			padding: 18px;
			background-color: var(--background-white);
			border-radius: 9px;
			.el-collapse {
				--el-collapse-header-font-size: 18px;
				--el-collapse-border-color: transparent;
				:deep(.el-collapse-item__content) {
					line-height: 1.25;
					padding-bottom: 0;
				}
				.item {
					display: flex;
					font-size: 14px;
					margin-top: 16px;
					.svg-icon {
						font-size: 24px;
						flex-shrink: 0;
					}
					.content {
						margin-left: 16px;
						font-size: 14px;
						font-weight: 400;
						color: var(--text-base);
						> div:first-child {
							font-size: 16px;
							font-weight: 500;
						}
						> div:last-child {
							margin-top: 8px;
							white-space: pre-line;
							hyphens: auto;
						}
						img {
							height: 20px;
							margin-inline-end: 10px;
							margin-top: 8px;
							object-fit: contain;
						}
					}
				}
			}
			.separator {
				border-top: 1px dotted #dbdbdb;
				margin: 15px 0;
				width: 100%;
			}
			.help {
				font-size: 18px;
				a {
					color: var(--el-color-warning);
				}
			}
		}
	}
}
</style>
