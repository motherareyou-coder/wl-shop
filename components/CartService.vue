<script setup>
defineOptions({ name: 'CartService' })
</script>

<template>
	<section class="service">
		<el-collapse>
			<el-collapse-item title="Why buy from mi.com">
				<div class="separator"></div>
				<div class="item">
					<Icon name="icon:shop" />
					<div class="content">
						<div>Fast delivery</div>
						<div>
							2-5 days FREE delivery<br>Door-to-door standard
							delivery
						</div>
					</div>
				</div>
				<div class="item">
					<Icon name="icon:shop" />
					<div class="content">
						<div>Free return</div>
						<div>
							14-day free return<br>30-day replacement & return
							for manufacturing problems
						</div>
					</div>
				</div>
				<div class="item">
					<Icon name="icon:shop" />
					<div class="content">
						<div>Secure checkout</div>
						<div>Safe & Secure checkout. Easy and Fast</div>
						<div>
							<img src="@/assets/imgs/visa-logo.png" alt="visa">
							<img
								src="@/assets/imgs/mastercard-logo.png"
								alt="mastercard"
							>
							<img
								src="@/assets/imgs/american-express-logo.png"
								alt="american-express"
							>
							<img
								src="@/assets/imgs/paypal-logo.png"
								alt="paypal"
							>
						</div>
					</div>
				</div>
				<div class="separator"></div>
				<div class="help">
					Need more help? Chat now or call
					<a href="tel: 0800 021 1888">0800 021 1888</a>
				</div>
			</el-collapse-item>
		</el-collapse>
	</section>
</template>

<style lang="scss" scoped>
.service {
	background-color: var(--background-white);
	border-radius: 9px;
	padding: var(--padding, 24px);
	width: 100%;
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
</style>
