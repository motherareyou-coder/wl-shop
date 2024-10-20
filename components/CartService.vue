<script setup>
import './CartService.scss'

defineOptions({ name: 'CartService' })
</script>

<template>
	<section class="why-buy-from-mi">
		<el-collapse>
			<el-collapse-item title="Why buy from mi.com">
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
								2-5 days FREE delivery<br>Door-to-door
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
					Need more help? Chat now or call
					<a href="tel: 0800 021 1888">0800 021 1888</a>
				</div>
			</el-collapse-item>
		</el-collapse>
	</section>
</template>

<style lang="scss" scoped>
.why-buy-from-mi {
	background-color: var(--background-white);
	border-radius: 9px;
	padding: var(--padding, 24px);
	width: 100%;
	box-sizing: border-box;
	.el-collapse {
		--el-collapse-border-color: transparent;
	}

	:deep {
		.el-collapse-item__header {
			font-weight: 500;
			margin: 0;
		}

		@media screen and (max-width: 720px) {
			.el-collapse-item__header {
				font-size: 16px;
			}
		}

		@media screen and (min-width: 721px) and (max-width: 1024px) {
			.el-collapse-item__header {
				font-size: 16px;
			}
		}

		@media screen and (min-width: 1025px) and (max-width: 1440px) {
			.el-collapse-item__header {
				font-size: 18px;
			}
		}

		@media screen and (min-width: 1441px) and (max-width: 1920px) {
			.el-collapse-item__header {
				font-size: 24px;
			}
		}

		@media screen and (min-width: 1921px) {
			.el-collapse-item__header {
				font-size: 24px;
			}
		}
	}
}
</style>
