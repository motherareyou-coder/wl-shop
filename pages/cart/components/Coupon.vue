<script setup>
const data = defineModel()
const selected = defineModel('coupon', { default: () => [] })

watchEffect(() => {
	selected.value = selected.value?.slice(-1)
})

const list = ref([
	{
		id: 1,
		name: 'Xiaomi 14T Pro Mi Fans',
		price: '10%off',
		timerange: ['06/10/2024 16:15:02', '13/10/2024 16:15:02'],
		desc: 'Apply for Xiaomi 14T Pro on mi.com/uk',
	},
	{
		id: 2,
		name: 'Xiaomi 14T Pro New Users',
		price: '£50',
		timerange: ['06/10/2024 16:15:02', '13/10/2024 16:15:02'],
		desc: 'Apply for Xiaomi 14T Pro on mi.com/uk',
	},
	{
		id: 3,
		name: 'Xiaomi 14T Pro New Users',
		price: '£50',
		timerange: ['06/10/2024 16:15:02', '13/10/2024 16:15:02'],
		desc: 'Apply for Xiaomi 14T Pro on mi.com/uk',
	},
	{
		id: 4,
		name: 'Xiaomi 14T Pro Mi Fans',
		price: '10%off',
		timerange: ['06/10/2024 16:15:02', '13/10/2024 16:15:02'],
		desc: 'Apply for Xiaomi 14T Pro on mi.com/uk',
	},
])

const tab = ref(0)
</script>

<template>
	<el-drawer v-model="data" title="My Coupon" class="coupon-drawer">
		<template #header="{ titleId, titleClass }">
			<div>
				<h2 :id="titleId" :class="titleClass">
					My coupon
				</h2>
				<p class="subtitle">
					Only one coupon can be used per purchase
				</p>
			</div>
		</template>
		<main>
			<div class="tabs">
				<ul class="header">
					<li :class="{ active: tab === 0 }" @click="tab = 0">
						<div class="mi-tabs__item-content">
							Available
							<template v-if="list.length">
								({{ list.length }})
							</template>
						</div>
					</li>
					<li :class="{ active: tab === 1 }" @click="tab = 1">
						<div class="mi-tabs__item-content">
							Unavailable
						</div>
					</li>
				</ul>
				<div v-if="tab === 0" class="pane">
					<ul class="coupons-list">
						<li v-for="item in list" :key="item.id">
							<el-checkbox
								v-model="selected"
								class="coupons-item"
								:value="item"
							>
								<div class="name">
									{{ [item.price, item.name].join(' | ') }}
								</div>
								<div class="price">
									{{ item.price }}
								</div>
								<div class="timerange">
									{{ item.timerange.join(' - ') }}
								</div>
								<div class="desc">
									{{ item.desc }}
								</div>
							</el-checkbox>
						</li>
					</ul>
				</div>
				<div v-if="tab === 1" class="pane">
					<ul class="coupons-list disabled">
						<li v-for="item in list" :key="item.id">
							<el-checkbox
								v-model="selected"
								class="coupons-item"
								:value="item"
								disabled
							>
								<div class="name">
									{{ [item.price, item.name].join(' | ') }}
								</div>
								<div class="price">
									{{ item.price }}
								</div>
								<div class="timerange">
									{{ item.timerange.join(' - ') }}
								</div>
								<div class="desc">
									{{ item.desc }}
								</div>
							</el-checkbox>
						</li>
					</ul>
				</div>
			</div>
		</main>
		<footer class="footer">
			<div class="note">
				<Icon name="icon:coupon" class="highlight" />
				<span v-if="selected.length">{{ selected.length }} selected save <span class="highlight">{{ selected[0].price }}</span></span>
				<span v-else>Select 1 coupon to get discount</span>
			</div>
			<div class="action">
				<button class="app-button">
					Confrim
				</button>
			</div>
		</footer>
	</el-drawer>
</template>

<style lang="scss">
.coupon-drawer {
	--content-padding: var(--drawer-content-padding);
	--modal-footer-padding-horizontal: var(--content-padding);
	--modal-footer-padding-vertical: calc(var(--content-padding) / 2);
	@media screen and (max-width: 720px) {
		width: 100% !important;
		// --content-padding: 16px;
		--drawer-content-padding: 16px;
		--close-button-size: 20px;
		--modal-min-width: 240px;
		--modal-max-width: 80%;
		--font-size-heading: 16px;
		--font-size-subtitle: 12px;
		--font-size-button: 12px;
		--button-padding: 10px;
		--modal-footer-padding-vertical: var(--content-padding);
	}
	@media screen and (min-width: 721px) and (max-width: 1024px) {
		width: 480px !important;
		// --content-padding: 20px;
		--drawer-content-padding: 40px;
		--close-button-size: 20px;
		--modal-min-width: 270px;
		--modal-max-width: 480px;
		--font-size-heading: 16px;
		--font-size-subtitle: 12px;
		--font-size-button: 14px;
		--button-padding: 10px;
	}
	@media screen and (min-width: 1025px) and (max-width: 1440px) {
		width: 520px !important;
		// --content-padding: 24px;
		--drawer-content-padding: 48px;
		--close-button-size: 24px;
		--modal-min-width: 360px;
		--modal-max-width: 560px;
		--font-size-heading: 20px;
		--font-size-subtitle: 16px;
		--font-size-button: 16px;
		--button-padding: 12px;
	}
	@media screen and (min-width: 1441px) and (max-width: 1920px) {
		width: 600px !important;
		// --content-padding: 30px;
		--drawer-content-padding: 60px;
		--close-button-size: 24px;
		--modal-min-width: 420px;
		--modal-max-width: 640px;
		--font-size-heading: 24px;
		--font-size-subtitle: 18px;
		--font-size-button: 18px;
		--button-padding: 12px;
	}
	@media screen and (min-width: 1921px) {
		width: 600px !important;
		// --content-padding: 30px;
		--drawer-content-padding: 60px;
		--close-button-size: 24px;
		--modal-min-width: 420px;
		--modal-max-width: 640px;
		--font-size-heading: 24px;
		--font-size-subtitle: 18px;
		--font-size-button: 18px;
		--button-padding: 12px;
	}
	.el-drawer__title {
		font-size: var(--font-size-heading);
		font-weight: 500;
	}
	header {
		margin: var(--content-padding) var(--content-padding)
			calc(var(--content-padding) / 2);
		align-items: center;
		padding: 0 0 calc(var(--content-padding) / 2);
		border-bottom: 1px solid var(--brand-grey-20, #e7e7e7);
		color: var(--text-base);
		font-size: 20px;
		font-weight: 500;
		.subtitle {
			margin-top: 8px;
			color: #8c8c8c;
			font-size: 12px;
			font-weight: 400;
			hyphens: auto;
		}
	}
	.el-drawer__close-btn {
		background-color: #a3a3a3;
		padding: 3px;
		border-radius: 6px;
		font-size: 12px;
		color: #fff !important;
		&:hover {
			background-color: #8c8c8c;
			i {
				color: #fff !important;
			}
		}
	}
	.el-drawer__body {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		padding: 0;
		main {
			padding: var(--modal-footer-padding-vertical) var(--content-padding);
			margin-top: 0;
			padding-top: 0;
			padding-bottom: 0;
			flex: 1;
			overflow: hidden;
			.tabs {
				display: flex;
				flex-direction: column;
				height: 100%;
				.header {
					background-color: #fff;
					position: sticky;
					top: 0;
					z-index: 2;
					display: flex;
					li {
						padding-inline-start: 0;
						margin-bottom: 24px;
						padding: 0 18px;
						border: 0 solid #e7e7e7;
						border: solid var(--brand-grey-20);
						border-width: 0 1px 0 0;
						flex-shrink: 0;
						padding: 0 20px;
						cursor: pointer;
						&.active {
							color: var(--el-color-warning);
						}
					}
				}
				.pane {
					overflow: auto;
					overscroll-behavior: contain;
					padding: 0 var(--content-padding);
					margin: 0 calc(var(--content-padding) * -1);
					flex-grow: 1;
					height: 100%;
					.coupons-list {
						.coupons-item {
							align-items: center;
							background-color: #fff;
							display: flex;
							box-sizing: border-box;
							margin: 0 auto;
							width: 100%;
							display: flex;
							height: 100%;
							width: 100%;
							@media screen and (max-width: 720px) {
								height: 160px;
								padding: 8px 6px;
							}

							@media screen and (min-width: 721px) and (max-width: 1024px) {
								height: 144px;
								padding: 9px 6px;
							}

							@media screen and (min-width: 1025px) and (max-width: 1440px) {
								height: 144px;
								padding: 10px 6px;
							}

							@media screen and (min-width: 1441px) and (max-width: 1920px) {
								height: 180px;
								padding: 12px 6px;
							}

							@media screen and (min-width: 1921px) {
								height: 180px;
								padding: 12px 6px;
							}
							label {
								height: 100%;
								width: 100%;
								display: flex;
							}
							.el-checkbox__input {
								align-items: center;
								border-radius: 8px;
								box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.08);
								display: flex;
								height: 100%;
								margin-inline-end: 1px;
								@media screen and (max-width: 720px) {
									font-size: 18px;
									padding: 0 12px;
								}

								@media screen and (min-width: 721px) and (max-width: 1024px) {
									font-size: 18px;
									padding: 0 15px;
								}

								@media screen and (min-width: 1025px) and (max-width: 1440px) {
									font-size: 18px;
									padding: 0 15px;
								}

								@media screen and (min-width: 1441px) and (max-width: 1920px) {
									font-size: 24px;
									padding: 0 20px;
								}

								@media screen and (min-width: 1921px) {
									font-size: 24px;
									padding: 0 20px;
								}
							}
							.el-checkbox__label {
								flex: 1;
								background-color: #fff;
								background-color: var(--background-white);
								border-radius: 8px;
								box-shadow: calc(var(--cardinal-number) * 2px)
									1px 6px 0 rgba(0, 0, 0, 0.08);
								box-sizing: border-box;
								color: #757575;
								display: flex;
								flex-direction: column;
								font-size: 12px;
								height: 100%;
								justify-content: center;
								overflow: hidden;
								position: relative;
								@media screen and (max-width: 720px) {
									padding: 16px 18px;
									--margin-bottom: 6px;
								}

								@media screen and (min-width: 721px) and (max-width: 1024px) {
									padding: 16px;
									--margin-bottom: 6px;
								}

								@media screen and (min-width: 1025px) and (max-width: 1440px) {
									padding: 18px 16px;
									--margin-bottom: 6px;
								}

								@media screen and (min-width: 1441px) and (max-width: 1920px) {
									padding: 24px 20px;
									--margin-bottom: 8px;
								}

								@media screen and (min-width: 1921px) {
									padding: 24px 20px;
									--margin-bottom: 8px;
								}
								.name {
									color: #757575;
									color: var(--brand-black-60);
									display: flex;
									flex-direction: column;
									font-size: 12px;
								}
								.price {
									font-size: 22px;
									margin-bottom: calc(
										var(--margin-bottom) * 1.3
									);
									color: #191919;
									color: var(--text-base);
									font-weight: 700;
								}
								.timerange {
									font-size: 12px;
									color: #191919;
									color: var(--text-base);
								}
								.desc {
								}
								> *:not(:last-child) {
									margin-bottom: var(--margin-bottom);
								}
							}
						}
						&.disabled {
						}
					}
				}
			}
		}
	}
	footer {
		background: #fff;
		flex-direction: column-reverse;
		margin: 0 auto;
		padding: 0;
		align-items: center;
		box-sizing: border-box;
		display: flex;
		flex-basis: auto;
		flex-flow: column nowrap;
		justify-content: center;
		width: 100%;
		.note {
			align-items: center;
			color: #191919;
			color: var(--text-base);
			display: flex;
			justify-content: center;
			margin: 0 calc(var(--content-padding) * -1);

			background-color: #fff0e5;
			font-size: 14px;
			padding: 8px 0;
			align-items: center;
			color: #191919;
			color: var(--text-base);
			display: flex;
			justify-content: center;
			margin: 0 calc(var(--content-padding) * -1);
			width: 100%;
			.highlight {
				color: var(--el-color-warning);
			}
			svg {
				color: var(--el-color-warning);
				margin-inline-end: 6px;
				--icon-width: var(--font-size);
				--icon-height: var(--font-size);

				@media screen and (max-width: 720px) {
					--font-size: 20px;
				}

				@media screen and (min-width: 721px) and (max-width: 1024px) {
					--font-size: 12px;
				}

				@media screen and (min-width: 1025px) and (max-width: 1440px) {
					--font-size: 16px;
				}

				@media screen and (min-width: 1441px) and (max-width: 1920px) {
					--font-size: 20px;
				}

				@media screen and (min-width: 1921px) {
					--font-size: 20px;
				}
			}

			@media screen and (max-width: 720px) {
				background-color: #fff;
				font-size: 12px;
			}

			@media screen and (min-width: 721px) and (max-width: 1024px) {
				font-size: 12px;
				padding: 6px 0;
			}

			@media screen and (min-width: 1025px) and (max-width: 1440px) {
				font-size: 12px;
				padding: 6px 0;
			}

			@media screen and (min-width: 1441px) and (max-width: 1920px) {
				font-size: 14px;
				padding: 8px 0;
			}

			@media screen and (min-width: 1921px) {
				font-size: 14px;
				padding: 8px 0;
			}
		}
		.action {
			padding: var(--modal-footer-padding-vertical)
				var(--modal-footer-padding-horizontal);
			width: 100%;
			box-sizing: border-box;
			button {
				width: 100%;
			}
		}
	}
}
</style>
