<script setup>
const props = defineProps({
	data: { type: Object },
})

const data = computed(() => props.data || {})
</script>

<template>
	<div
		style="align-self: flex-start"
	>
		<div
			class="user-address__card user-address__card--center user-address__card--selected"
		>
			<div class="user-address__card-text">
				<div class="user-address__card-title--wrapper">
					<h2 class="user-address__card-title">
						{{ data.receiverName }} {{ data.receiverLastName }}
					</h2>
				</div>
				<div class="user-address__card-tel-wrapper">
					<span class="user-address__card-area">
						{{ data.receiverCountryCode }} {{ data.receiverMobile }}
					</span>
				</div>
				<div class="user-address__card-content--wrapper">
					{{
						[
							data.receiverHouseNumber,
							data.receiverDetailAddress2,
							data.receiverDetailAddress,
							data.receiverAreaName,
							data.receiverPostCode,
						].join(' ')
					}}
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./AddressList.scss');
</style>
