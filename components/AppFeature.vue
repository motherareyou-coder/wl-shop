<script setup>
defineOptions({ name: 'AppFeature' })

const children = [
	{
		img: '/imgs/1.jpg',
		subImg: '/imgs/1-1.svg',
		desc: 'Buy 12GB+256GB/512GB, get free Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
	},
	{
		img: '/imgs/2.jpg',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		img: '/imgs/3.jpg',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		img: '/imgs/4.jpg',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
	{
		img: '/imgs/4.jpg',
		desc: 'Xiaomi Pad 6',
		url: 'https://www.mi.com/uk/product/xiaomi-14t-pro/',
		price: 29.99,
	},
]

const list = ref([
	{ label: 'Recommended', children },
	{ label: 'Autumn Sale Round 1', children: [...children].reverse() },
])

const selected = ref()
watchEffect(() => {
	selected.value = list.value[0]
})
const unit = ref('$')
</script>

<template>
	<div class="app-feature">
		<div class="app-feature-title">
			{{ $t('Featured Products') }}
		</div>
		<div class="app-feature-container">
			<div class="app-feature-tab">
				<div
					v-for="item in list"
					:key="item.label"
					:class="{ active: selected === item }"
					class="app-feature-tab-item"
					@click="selected = item"
				>
					{{ item.label }}
				</div>
			</div>
			<div class="app-feature-pane-wrapper">
				<div
					v-for="item in list"
					v-show="selected === item"
					:key="item.label"
					:name="item.label"
					:label="item.label"
					class="app-feature-pane"
				>
					<nuxt-link
						v-for="(c, i) in item.children"
						:key="c.img"
						:to="c.url"
						class="app-feature-item"
					>
						<img :src="c.img" alt="" />
						<div class="item-info">
							<img v-if="i === 0" :src="c.subImg" />
							<span>
								{{ c.desc }}
							</span>
							<div class="item-info__translate">
								<strong v-if="i !== 0" class="price">
									<small>{{ unit }}</small>
									{{ c.price }}
								</strong>
								<div class="item-info__button-wrapper">
									<button>Learn More</button>
								</div>
							</div>
						</div>
					</nuxt-link>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.app-feature {
	@media screen and (max-width: 720px) {
		--grid-gap: 12px;
		--grid-content-height: auto;
		--grid-main-row-height: 186px;
		background-color: #fff;
		background-color: var(--background-white);
		padding: 0 var(--app-horizontal-padding);
		width: unset;
	}

	@media screen and (min-width: 721px) and (max-width: 1024px) {
		--grid-gap: 16px;
		--grid-content-height: 536px;
		--grid-main-row-height: 260px;
	}

	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		--grid-gap: 24px;
		--grid-content-height: 684px;
		--grid-main-row-height: 330px;
	}

	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		--grid-gap: 24px;
		--grid-content-height: 684px;
		--grid-main-row-height: 330px;
	}

	@media screen and (min-width: 1921px) {
		--grid-gap: 24px;
		--grid-content-height: 684px;
		--grid-main-row-height: 330px;
	}
	.app-feature-title {
		font-weight: 700;
		margin-bottom: var(--title-content-gap);
		text-align: center;
		@media screen and (min-width: 1025px) {
			font-size: 32px;
		}
		@media screen and (min-width: 721px) and (max-width: 1024px) {
			font-size: 24px;
		}
	}
	.app-feature-container {
		.app-feature-tab {
			display: flex;
			justify-content: center;
			width: 100%;
			.app-feature-tab-item {
				margin: 0 28px;
				height: 40px;
				cursor: pointer;
				--brand-orange: #ff6900;
				&.active {
					color: var(--brand-orange);
					border-bottom: 2px solid var(--brand-orange);
				}
			}
		}
		.app-feature-pane-wrapper {
			border-radius: 10px;
			padding: 24px;
			background-color: #fff;
			background-color: var(--background-white);
			overflow: hidden;
			display: flex;
			flex-wrap: wrap;
			.app-feature-pane {
				width: 100%;
				overflow: hidden;
				grid-template-columns: repeat(4, minmax(0, 1fr));
				grid-gap: var(--grid-gap,);
				display: grid;
				height: var(--grid-content-height);
				.app-feature-item {
					background-color: #fafafa;
					position: relative;
					overflow: hidden;
					box-sizing: border-box;
					&:first-child {
						grid-column: span 4;
						grid-gap: var(--grid-gap,);
						border-radius: 6px;
						display: grid;
						align-items: center;
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
						height: var(--grid-main-row-height);
						overflow: hidden;
						--img-width: 330px;
						box-sizing: border-box;
						> * {
							width: 100%;
						}
						.item-info {
							margin: 0;
							justify-content: space-between;
							img {
								max-width: 400px;
							}
							span {
								font-size: 14px;
								margin-top: 20px;
								font-weight: 300;
							}
							@media screen and (min-width: 1441px) and (max-width: 1920px) {
								padding: 16px 140px;
							}
							@media screen and (min-width: 1025px) and (max-width: 1440px) {
								padding: 12px 66px;
							}
							@media screen and (min-width: 721px) and (max-width: 1024px) {
								padding: 10px 24px;
							}
							@media screen and (min-width: 1921px) {
								padding: 16px 148px;
							}
							.item-info__translate {
								height: 40px;
							}
						}
					}
					&:not(:first-child) {
						padding: 24px 30px;
						--img-width: 160px;
						align-items: center;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						height: var(--grid-main-row-height);
						@media screen and (min-width: 721px) and (max-width: 1024px) {
							--img-width: 110px;
							padding: 16px 20px;
						}
					}
					> img {
						height: var(--img-width, 160px);
						object-fit: cover;
						object-position: center;
						width: 100%;
					}
					.item-info {
						margin-top: 12px;
						text-align: center;
						display: flex;
						flex-direction: column;
						justify-content: center;
						position: relative;
						width: 100%;
						align-items: center;
						box-sizing: border-box;
						grid-column: span 1;
						flex: 1;
						span {
							margin-top: 12px;
							font-weight: 700;
						}
					}
					.item-info__translate {
						margin-top: 12px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						position: relative;
						width: 100%;
						text-align: center;
						align-items: center;
					}
					.item-info__button-wrapper {
						left: 0;
						opacity: 0;
						position: absolute;
						top: 100%;
						transition: all 0.3s;
						width: 100%;
						button {
							background-color: #191919;
							border-radius: 8px;
							color: #fff;
							font-size: 12px;
							padding: 4px 12px;
							cursor: pointer;
							overflow: hidden;
							text-overflow: ellipsis;
							word-break: break-word;
							font-size: 12px;
							width: fit-content;
						}
					}
					.price {
						transition: all 0.3s;
					}
					&:hover {
						.item-info__button-wrapper {
							opacity: 1;
							top: 50%;
							transform: translateY(-50%);
							transition-delay: 0.2s;
						}
						.price {
							opacity: 0;
							transform: translateY(-20%);
						}
					}
				}
			}
		}
	}
}
</style>
