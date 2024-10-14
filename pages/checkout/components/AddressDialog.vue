<script setup>
import './AddressDialog.scss'

const data = defineModel('data')
const visible = defineModel('visible')
const rules = {}

const { t } = useI18n()
const columns = [
	{ label: t('Country'), prop: 'Country' },
	{ label: t('First name'), prop: 'Firstname' },
	{ label: t('Last name'), prop: 'Lastname' },
	{ label: t('Post code'), prop: 'Postcode' },
	{ label: t('City'), prop: 'City' },
	{ label: t('House number'), prop: 'Housenumber' },
	{ label: t('Address 1'), prop: 'Address1' },
	{ label: t('Address 2'), prop: 'Address2' },
	{ label: t('Phone number'), prop: 'Phonenumber' },
	{ label: t('Email Address'), prop: 'EmailAddress' },
]
</script>

<template>
	<el-dialog
		v-model="visible"
		:title="t('Create your address')"
		append-to-body
		class="mi-modal"
	>
		<el-form
			:model="data"
			:rules="rules"
			label-position="top"
		>
			<el-form-item
				v-for="c in columns"
				:key="c.prop"
				:label="c.label"
				:prop="c.prop"
			>
				<el-input v-model="data[c.prop]" />
			</el-form-item>
			<el-checkbox v-model="data.isDefault">
				{{ t('Set as default address') }}
			</el-checkbox>
		</el-form>
		<footer class="mi-modal__footer">
			<div class="mi-modal__action">
				<button class="mi-modal__button app-button">
					{{ t('Save') }}
				</button>
			</div>
		</footer>
	</el-dialog>
</template>

<style lang="scss" scoped></style>
