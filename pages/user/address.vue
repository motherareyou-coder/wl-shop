<script setup>
import AddressList from '../checkout/components/AddressList.vue'
import './address.scss'

const { t } = useI18n()
</script>

<template>
	<section class="user-address--wrapper">
		<div class="user-address">
			<div class="breadcrumbs-wrapper">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item :to="{ path: '/' }">
						{{ t('Home') }}
					</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/' }">
						{{ t('My account') }}
					</el-breadcrumb-item>
					<el-breadcrumb-item>
						{{
							t('Delivery address')
						}}
					</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="page-headings">
				<h1 class="page-headings__title" fmp-c="1">
					{{ t('Delivery address') }}
				</h1>
			</div>
			<div class="user-address__list-wrapper">
				<AddressList class="user-address__list" />
			</div>
		</div>
	</section>
</template>
