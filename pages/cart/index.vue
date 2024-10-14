<script setup lang="ts">
import Coupon from './components/Coupon.vue'
import Recommends from './components/Recommends.vue'

defineOptions({ name: 'Cart' })
definePageMeta({ layout: 'cart' })

const { t } = useI18n()
useHead({
	title: `${t('cart')} ${t('appTitle')}`,
	meta: [{ name: 'description', content: 'Cart' }],
})

const router = useRouter()
function handleNext() {
	router.push('/checkout')
}

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
const drawerShow = ref(false)
</script>

<template>
	<main class="app-cart app-grid--vertical-100">
		<article class="detail">
			<header class="top">
				<ElCheckbox>All</ElCheckbox>
				<button>Delete</button>
			</header>
			<section class="group">
				<div v-for="g in goods" :key="g.id" class="item">
					<ElCheckbox />
					<div>
						<nuxt-link :to="g.src">
							<img :src="g.img" alt="">
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
			<main class="area">
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
								@click="handleNext"
							>
								Checkout
							</button>
						</div>
					</footer>
				</section>
				<CartService />
			</main>
		</article>
		<Recommends />
	</main>
	<Coupon v-model="drawerShow" />
</template>

<style scoped lang="scss">
.app-cart {
	display: grid;
	width: 100%;
	--margin-vertical: 12px;
	--margin-gap: 12px;
	--border-radius: 12px;
	--padding: 24px;
	--action-icon: 24px;
	--grid-images-area: 140px;
	--image-width: 140px;
	--image-height: 140px;
	@media screen and (max-width: 720px) {
		gap: var(--margin-gap);
		grid-template-columns: 1fr;
	}

	@media screen and (min-width: 721px) and (max-width: 1024px) {
		gap: 0 var(--margin-gap);
		grid-template-columns: 1fr 284px;
	}

	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		gap: 0 var(--margin-gap);
		grid-template-columns: 1fr 388px;
	}

	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		gap: 0 var(--margin-gap);
		grid-template-columns: 1fr 518px;
	}

	@media screen and (min-width: 1921px) {
		gap: 0 var(--margin-gap);
		grid-template-columns: 1fr 518px;
	}
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
	}
}
</style>
