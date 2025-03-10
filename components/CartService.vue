<script setup>
defineOptions({ name: 'CartService' })
const { shortDomain } = useRuntimeConfig().public
const tab = ref('1')
</script>

<template>
	<section class="why-buy-from-mi">
		<el-collapse v-model="tab">
			<el-collapse-item :title="`Why buy from ${shortDomain}`" name="1">
				<div class="why-buy-from-mi__separator"></div>
				<div class="why-buy-from-mi__list">
					<div class="why-buy-from-mi__item">
						<i class="why-buy-from-mi__item-icon">
							<Icon name="icon:shop" />
						</i>
						<div class="why-buy-from-mi__item-content">
							<div class="why-buy-from-mi__item-title">
								Fast delivery
							</div>
							<div class="why-buy-from-mi__item-desc">
								5-14 days FREE delivery<br>Door-to-door
								standard delivery
							</div>
						</div>
					</div>
					<div class="why-buy-from-mi__item">
						<i class="why-buy-from-mi__item-icon">
							<Icon name="icon:shop" />
						</i>
						<div class="why-buy-from-mi__item-content">
							<div class="why-buy-from-mi__item-title">
								Free return
							</div>
							<div class="why-buy-from-mi__item-desc">
								14-day free return<br>30-day replacement &
								return for manufacturing problems
							</div>
						</div>
					</div>
					<div class="why-buy-from-mi__item">
						<i class="why-buy-from-mi__item-icon">
							<Icon name="icon:shop" />
						</i>
						<div class="why-buy-from-mi__item-content">
							<div class="why-buy-from-mi__item-title">
								Secure checkout
							</div>
							<div>Safe & Secure checkout. Easy and Fast</div>
							<div class="why-buy-from-mi__pay-list">
								<img
									class="why-buy-from-mi__pay-img"
									src="@/assets/imgs/visa-logo.png"
									alt="visa"
								>
								<img
									class="why-buy-from-mi__pay-img"
									src="@/assets/imgs/mastercard-logo.png"
									alt="mastercard"
								>
								<img
									class="why-buy-from-mi__pay-img"
									src="@/assets/imgs/american-express-logo.png"
									alt="american-express"
								>
								<img
									class="why-buy-from-mi__pay-img"
									src="@/assets/imgs/paypal-logo.png"
									alt="paypal"
								>
							</div>
						</div>
					</div>
				</div>
				<div class="why-buy-from-mi__separator"></div>
				<div class="why-buy-from-mi__tel">
					Need more help? Chat now
					<!-- whatsApp -->
					<!-- <a href="https://wa.me/1234567890">WhatsApp</a> -->
					<!-- <a href="https://wa.me/1234567890">WhatsApp</a> -->
					<a href="https://t.me/is_wink" target="_blank" aria-label="chatNowTelegram">Telegram</a>
					or <!-- 邮件 -->
					<a href="mailto:iswink@iswink.com" target="_blank" aria-label="chatNowEmail">Email</a>
				</div>
			</el-collapse-item>
		</el-collapse>
	</section>
</template>

<style lang="scss">
@import url('./CartService.scss');
</style>

<style lang="scss" scoped>
.why-buy-from-mi {
	background-color: var(--background-white);
	border-radius: 9px;
	padding: var(--padding, 24px);
	width: 100%;
	box-sizing: border-box;
	.mi-collapse {
		--mi-collapse-border-color: transparent;
	}

	:deep {
		.mi-collapse-item__header {
			font-weight: 500;
			margin: 0;
		}
		.mi-collapse-item__content{
			padding-bottom: 0 !important;
		}

		@media screen and (max-width: 720px) {
			.mi-collapse{
				--mi-collapse-header-height: 30px;
			}
			.mi-collapse-item__header {
				font-size: 16px;
			}
		}

		@media screen and (min-width: 721px) and (max-width: 1024px) {
			.mi-collapse-item__header {
				font-size: 16px;
			}
		}

		@media screen and (min-width: 1025px) and (max-width: 1440px) {
			.mi-collapse-item__header {
				font-size: 18px;
			}
		}

		@media screen and (min-width: 1441px) and (max-width: 1920px) {
			.mi-collapse-item__header {
				font-size: 24px;
			}
		}

		@media screen and (min-width: 1921px) {
			.mi-collapse-item__header {
				font-size: 24px;
			}
		}
	}
}
</style>
