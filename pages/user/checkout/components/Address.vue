<script setup>
import './AddressList.scss'

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
						{{ data.receiverName }}
					</h2>
				</div>
				<div class="user-address__card-tel-wrapper">
					<span class="user-address__card-area">
						{{ data.receiverMobile }}
					</span>
				</div>
				<div class="user-address__card-content--wrapper">
					{{
						[
							data.receiverAreaName,
							data.receiverDetailAddress,
						].join(' ')
					}}
				</div>
			</div>
		</div>
	</div>
</template>
