<script setup lang="ts">
import { isObject } from 'lodash-es'
import './AddressDialog.scss'
import type { Address, City, Country, State } from '~/types'

const data = defineModel<Address>({ default: () => ({}) })

interface Options {
	label: any
	value: any
}

const countries = ref<(Country & Options)[]>([])
$api('system/area/getAreaCountry').then((res) => {
	if (isObject(res)) {
		res = [res as unknown as Country]
	}
	res?.forEach((d) => {
		d.label = d.name
		d.value = d.id
	})
	res.length && countries.value.splice(0, countries.value.length, ...res)
})

const states = ref<(State & Options)[]>([])
function refreshStates() {
	if (!data.value.countryId)
		return states.value.splice(0, states.value.length)
	$api('system/area/getAreaStateByCountryId', {
		params: { countryId: data.value.countryId },
	}).then((res) => {
		if (!Array.isArray(res)) {
			res = [res]
		}
		res?.forEach((d) => {
			d.label = d.name
			d.value = d.id
		})
		states.value.splice(0, states.value.length)
		res.length && states.value.push(...res)
	})
}
watch(() => data.value.countryId, refreshStates)
const cities = ref<(City & Options)[]>([])
function refreshCities() {
	if (!data.value.countryId)
		return cities.value.splice(0, cities.value.length)
	$api('system/area/getAreaCityByStateId', {
		params: { stateId: data.value.areaId },
	}).then((res) => {
		if (!Array.isArray(res)) {
			res = [res]
		}
		res?.forEach((d) => {
			d.label = d.name
			d.value = d.id
		})
		cities.value.splice(0, cities.value.length)
		res.length && cities.value.push(...res)
	})
}
watch(() => data.value.areaId, refreshCities)

const rules = {
	name: [
		{ required: true, message: $t('Name') + $t('is required') },
		{
			min: 2,
			max: 17,
			message: $t('It should be 2-17 letters or spaces.'),
		},
	],
	lastName: [
		{ required: true, message: $t('Last Name') + $t('is required') },
		{
			min: 2,
			max: 17,
			message: $t('It should be 2-17 letters or spaces.'),
		},
	],
	postCode: [
		{ required: true, message: $t('Post code') + $t('is required') },
		{ min: 5, max: 10, message: $t('It should be 5-10 digits.') },
	],
	areaId: [{ required: true, message: $t('Area') + $t('is required') }],
	countryCode: [{ required: true, message: $t('City') + $t('is required') }],
	houseNumber: [
		{ required: true, message: $t('House number') + $t('is required') },
		{
			min: 1,
			max: 10,
			message: $t('It should contain 1-10 digits or letters.'),
		},
	],
	detailAddress: [
		{ required: true, message: `${$t('Address')} 1 ${$t('is required')}` },
		{
			min: 2,
			max: 30,
			message: $t('It should contain 2-30 letters, digits or spaces.'),
		},
	],
	detailAddress2: [
		{ required: true, message: `${$t('Address')} 2 ${$t('is required')}` },
		{
			min: 2,
			max: 28,
			message: $t('It should contain 2-28 letters, digits or spaces.'),
		},
	],
	mobile: [
		{ required: true, message: $t('Mobile') + $t('is required') },
		{
			message: $t('It should be max 11 digit number.'),
			validator(rule, v, cb) {
				if (!/^\d{1,11}$/.test(v))
					cb(new Error($t('It should be max 11 digit number.')))
				else cb()
			},
		},
	],
	email: [
		{ required: true, message: $t('Email') + $t('is required') },
		{
			type: 'email',
			message: $t('It should be email format.'),
		},
		{
			min: 7,
			max: 50,
			message: $t('It should be 7-50 characters.'),
		},
	],
}

const columns = [
	{ label: $t('First Name'), prop: 'name', width: '49%' },
	{ label: $t('Last Name'), prop: 'lastName', width: '49%' },
	{ label: $t('Post code'), prop: 'postCode', width: '49%' },
	{
		label: $t('Country'),
		prop: 'countryId',
		options: countries.value,
		width: '49%',
		onChange: (v) => {
			const country = countries.value?.find(c => c.id === v)
			data.value.phonecode = country?.phonecode
		},
	},
	{ label: $t('Area'), prop: 'areaId', options: states.value, width: '49%' },
	{ label: $t('City'), prop: 'cityId', options: cities.value, width: '49%' },
	{ label: $t('House number'), prop: 'houseNumber' },
	{ label: `${$t('Address')} 1`, prop: 'detailAddress' },
	{ label: `${$t('Address')} 2`, prop: 'detailAddress2' },
	{ label: $t('Mobile'), prop: 'mobile' },
	{ label: $t('Email'), prop: 'email' },
]

const editableProps = [
	'name',
	'mobile',
	'areaId',
	'detailAddress',
	'defaultStatus',
]

const formRef = ref()
defineExpose({
	resetFields: (...args: any) => formRef.value?.resetFields(...args),
	clearValidate: (...args: any) => formRef.value?.clearValidate(...args),
	validate: (...args: any) => formRef.value?.validate(...args),
})
</script>

<template>
	<el-form
		ref="formRef"
		class="mi-form address-form mi-form-block"
		:model="data"
		:rules="rules"
		label-position="top"
	>
		<el-form-item
			v-for="c in columns"
			:key="c.prop"
			:label="c.label"
			:prop="c.prop"
			class="mi-form-item address-form__item mi-form-column"
			:style="{ width: c.width }"
		>
			<!-- :disabled="data.id && !editableProps.includes(c.prop)" -->
			<el-select
				v-if="c.options"
				v-model="data[c.prop]"
				@change="c.onChange"
			>
				<el-option v-for="o in c.options" :key="o.value" v-bind="o" />
			</el-select>
			<el-input v-else v-model="data[c.prop]">
				<template v-if="c.prop === 'mobile'" #prefix>
					<span>+{{ data.phonecode }}</span>
				</template>
			</el-input>
		</el-form-item>
		<el-checkbox v-model="data.defaultStatus">
			{{ $t('Set as default address') }}
		</el-checkbox>
	</el-form>
</template>
