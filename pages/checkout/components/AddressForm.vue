<script setup lang="ts">
import { isObject } from 'lodash-es'
import './AddressDialog.scss'
import type { Address, City, Country, State } from '~/types'

const props = defineProps({
	isEdit: { type: Boolean, default: () => false },
})
const emit = defineEmits(['submit'])
const data = defineModel<Address>({ default: () => ({}) })

interface Options {
	label: any
	value: any
}

const { data: countries, refresh: refreshCcountries } = await useAsyncData<
	(Country & Options)[]
>(() =>
			$api('system/area/getAreaCountry').then((res) => {
				if (isObject(res)) {
					res = [res as unknown as Country]
				}
				res?.forEach((d) => {
					d.label = d.name
					d.value = d.id
				})
				return res
			}),
		)
const { data: states, refresh: refreshStates } = await useAsyncData<
	(State & Options)[]
>(() =>
			!data.value.countryId
				? Promise.resolve([])
				: $api('system/area/getAreaStateByCountryId', {
					params: { countryId: data.value.countryId },
				}).then((res) => {
					if (!Array.isArray(res)) {
						res = [res]
					}
					res?.forEach((d) => {
						d.label = d.name
						d.value = d.id
					})
					return res
				}),
		)
watch(
	() => data.value.countryId,
	() => refreshStates(),
)
const { data: cities, refresh: refreshCities } = await useAsyncData<
	(City & Options)[]
>(() =>
			!data.value.areaId
				? Promise.resolve([])
				: $api('system/area/getAreaCityByStateId', {
					params: { stateId: data.value.areaId },
				}).then((res) => {
					if (!Array.isArray(res)) {
						res = [res]
					}
					res?.forEach((d) => {
						d.label = d.name
						d.value = d.id
					})
					return res
				}),
		)
watch(
	() => data.value.areaId,
	() => refreshCities(),
)
const rules = {
	name: [
		{ required: true },
		{ min: 2, max: 17, message: $t('It should be 2-17 letters or spaces.') },
	],
	lastName: [
		{ required: true },
		{ min: 2, max: 17, message: $t('It should be 2-17 letters or spaces.') },
	],
	postCode: [
		{ required: true },
		{ min: 5, max: 10, message: $t('It should be 5-10 digits.') },
	],
	countryCode: [{ required: true }],
	areaId: [{ required: true }],
	houseNumber: [
		{ required: true },
		{
			min: 1,
			max: 10,
			message: $t('It should contain 1-10 digits or letters.'),
		},
	],
	detailAddress: [
		{ required: true },
		{
			min: 2,
			max: 30,
			message: $t('It should contain 2-30 letters, digits or spaces.'),
		},
	],
	detailAddress2: [
		{ required: true },
		{
			min: 2,
			max: 28,
			message: $t('It should contain 2-28 letters, digits or spaces.'),
		},
	],
	mobile: [
		{ required: true },
		{
			max: 11,
			message: $t('It should be max 11 digit number.'),
		},
	],
	email: [
		{ required: true },
		{
			type: 'email',
			message: $t('It should be email format.'),
		},
		{
			max: 7,
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
	},
	{ label: $t('Area'), prop: 'areaId', options: states.value, width: '49%' },
	{ label: $t('City'), prop: 'cityId', options: cities.value, width: '49%' },
	{ label: $t('House number'), prop: 'houseNumber' },
	{ label: $t('Address 1'), prop: 'detailAddress' },
	{ label: $t('Address 2'), prop: 'detailAddress2' },
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

const handleSubmit = () => emit('submit')
</script>

<template>
	<el-form
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
			<el-select
				v-if="c.options"
				v-model="data[c.prop]"
				:disabled="props.isEdit && !editableProps.includes(c.prop)"
			>
				<el-option v-for="o in c.options" :key="o.value" v-bind="o" />
			</el-select>
			<el-input
				v-else
				v-model="data[c.prop]"
				:disabled="props.isEdit && !editableProps.includes(c.prop)"
			/>
		</el-form-item>
		<el-checkbox v-model="data.defaultStatus">
			{{ $t('Set as default address') }}
		</el-checkbox>
	</el-form>
	<footer class="mi-modal__footer">
		<div class="mi-modal__action">
			<button class="mi-modal__button app-button" @click="handleSubmit">
				{{ $t('Save') }}
			</button>
		</div>
	</footer>
</template>
