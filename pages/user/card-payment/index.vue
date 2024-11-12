<script setup>
import './index.scss'

const route = useRoute()
const id = route.query.orderId

const { data: info } = await useAPI('trade/order/get-detail', { params: { id } })

const data = ref({})
</script>

<template>
	<div class="card-wrapper">
		<main class="card-container">
			<div class="card-order-detail">
				<h2 class="order-summary">
					{{ $t('Order summary') }}
				</h2>
				<table class="order-message">
					<tbody>
						<tr class="order-message__item">
							<td class="title">
								{{ $t('Reference') }}:
							</td>
							<td class="info">
								{{ info.no }}
							</td>
						</tr>
						<tr class="order-message__item">
							<td class="title">
								{{ $t('Description') }}:
							</td>
							<td class="info">
								{{ info.items.map(d => d.spuName).join(', ') }}
							</td>
						</tr>
						<tr class="order-message__item">
							<td class="title">
								{{ $t('Amount(GBP)') }}:
							</td>
							<td class="info">
								<product-price :data="info.totalPrice" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card-payment-components">
				<div class="adyen-payment-wrapper">
					<el-form
						label-position="top"
						class="adyen-checkout__card__form"
					>
						<div
							class="adyen-checkout__field adyen-checkout__field--cardNumber"
						>
							<el-form-item prop="" label="Card number">
								<el-input
									v-model="data.cardNumber"
									placeholder="1234 5678 9012 3456"
								/>
							</el-form-item>
						</div>
						<div
							class="adyen-checkout__card__exp-cvc adyen-checkout__field-wrapper"
						>
							<el-form-item

								label="Expiry date"
								class="adyen-checkout__field adyen-checkout__field--50 adyen-checkout__field--expiryDate"
							>
								<el-input	v-model="data.date" placeholder="MM/YY" />
							</el-form-item>
							<el-form-item
								label="CVC / CVV"
								class="adyen-checkout__field adyen-checkout__field--50 adyen-checkout__field__cvc adyen-checkout__field--securityCode"
							>
								<el-input v-model="data.cvc" placeholder="3 digits" />
							</el-form-item>
						</div>
					</el-form>
					<button class="app-button">
						<span class="flex items-center justify-center">
							<img
								src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/components/lock.svg"
							>
							<span class="ml-2">
								{{ $t('Pay') }}
							</span>
						</span>
					</button>
				</div>
			</div>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.mi-form {
	:deep {
		.mi-form-item__content {
			width: 100%;
			> * {
				width: 100%;
			}
		}
	}
}
</style>
