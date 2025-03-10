<script setup lang="ts">
import { isString } from 'lodash-es'
import type { Address, City, Country, State } from '~/types'

const { t } = useI18n()
const data = defineModel<Address>({ default: () => ({}) })
watch(data, (v) => {
	if (isString(v.countryId))
		v.countryId = Number(v.countryId)
	if (isString(v.stateId))
		v.stateId = Number(v.stateId)
	if (isString(v.cityId))
		v.cityId = Number(v.cityId)
	if (isString(v.areaId))
		v.areaId = Number(v.areaId)
	const cityId = v.cityId || v.areaId
	data.value.areaCity = (v.stateId === cityId || !cityId) ? [v.stateId] : [v.stateId, cityId]
}, { immediate: true })

const paramsStore = useParamsStore()
paramsStore.getCountries()
const countries = computed(() => paramsStore.countries)

function refreshStates() {
	return !data.value.countryId
		? Promise.resolve([])
		: $api('system/area/getAreaStateByCountryId', {
			params: { countryId: data.value.countryId },
		}).then((res) => {
			if (!Array.isArray(res)) {
				res = [res]
			}
			return res?.map(d => ({
				label: d.name,
				value: d.id,
				leaf: d.leaf, // TODO: 需要后端返回是否叶子节点
			})) || []
		})
}
function refreshCities(stateId: number) {
	return !stateId
		? Promise.resolve([])
		: $api('system/area/getAreaCityByStateId', { params: { stateId } }).then((res) => {
			if (!Array.isArray(res)) {
				res = [res]
			}
			return res?.map(d => ({
				label: d.name,
				value: d.id,
				leaf: true,
			})) || []
		})
}

const rules = {
	name: [
		{ required: true, message: `${t('Name')} ${t('is required')}` },
		{
			min: 1,
			max: 17,
			message: t('It should be 1-17 letters or spaces.'),
		},
	],
	lastName: [
		{ required: true, message: `${t('Last Name')} ${t('is required')}` },
		{
			min: 1,
			max: 17,
			message: t('It should be 1-17 letters or spaces.'),
		},
	],
	postCode: [
		{ required: true, message: `${t('Post code')} ${t('is required')}` },
		{ min: 5, max: 10, message: t('It should be 5-10 digits.') },
	],
	areaCity: [{ required: true, message: `${t('City')} ${t('is required')}` }],
	countryId: [{ required: true, message: `${t('Country')} ${t('is required')}` }],
	houseNumber: [
		{ required: true, message: `${t('House number')} ${t('is required')}` },
		{
			min: 1,
			max: 10,
			message: t('It should contain 1-10 digits or letters.'),
		},
	],
	detailAddress: [
		{ required: true, message: `${t('Address')} 1 ${t('is required')}` },
		{
			min: 2,
			max: 30,
			message: t('It should contain 2-30 letters, digits or spaces.'),
		},
	],
	detailAddress2: [
		{ required: true, message: `${t('Address')} 2 ${t('is required')}` },
		{
			min: 2,
			max: 28,
			message: t('It should contain 2-28 letters, digits or spaces.'),
		},
	],
	mobile: [
		{ required: true, message: `${t('Mobile')} ${t('is required')}` },
		// ,
		// {
		// 	message: t('It should be max 11 digit number.'),
		// 	validator(rule, v, cb) {
		// 		if (!/^\d{1,11}$/.test(v))
		// 			cb(new Error(t('It should be max 11 digit number.')))
		// 		else cb()
		// 	},
		// },
	],
	email: [
		{ required: true, message: `${t('Email')} ${t('is required')}` },
		{
			type: 'email',
			message: t('It should be email format.'),
		},
		{
			min: 5,
			max: 50,
			message: t('It should be 7-50 characters.'),
		},
	],
}

const CityProps = {
	lazy: true,
	lazyLoad(node, resolve) {
		const { level } = node
		if (level === 0)
			refreshStates().then(resolve)
		else if (level === 1)
			refreshCities(node.value).then(resolve)
		else
			resolve([])
	},
}
function cityChange(v) {
	data.value.stateId = v?.[0]
	data.value.cityId = v?.[1]
	data.value.areaId = v?.[1] || v?.[0]
}

const columns = [
	{
		label: t('Country'),
		prop: 'countryId',
		options: countries.value,
		width: '100%',
		onChange: (v: number) => {
			const country = countries.value?.find(c => c.value === v)
			data.value.countryPhoneCode = country?.phonecode ? `+${country.phonecode}` : ''
			data.value.areaCity = []
			data.value.stateId = ''
			data.value.cityId = ''
			data.value.areaId = ''
		},
	},
	{ label: t('First Name'), prop: 'name', width: '49%' },
	{ label: t('Last Name'), prop: 'lastName', width: '49%' },
	{ label: t('Post code'), prop: 'postCode', width: '49%' },
	// {
	// 	label: t('Area'),
	// 	prop: 'areaId',
	// 	options: states.value,
	// 	width: '49%',
	// 	onChange: () => {
	// 		data.value.stateId = ''
	// 	},
	// },
	{ label: t('City'), prop: 'areaCity', width: '49%' },
	{ label: t('House number'), prop: 'houseNumber' },
	{ label: `${t('Address')} 1`, prop: 'detailAddress' },
	{ label: `${t('Address')} 2`, prop: 'detailAddress2' },
	{ label: t('Mobile'), prop: 'mobile' },
	{ label: t('Email'), prop: 'email' },
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
		size="large"
		label-position="top"
		require-asterisk-position="right"
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
			<el-cascader
				v-if="c.prop === 'areaCity'"
				:key="data.countryId"
				v-model="data[c.prop]"
				:props="CityProps"
				style="width:100%"
				@change="cityChange"
			/>
			<el-select
				v-else-if="c.options"
				v-model="data[c.prop]"
				filterable
				@change="c.onChange"
			>
				<el-option v-for="o in c.options" :key="o.value" v-bind="o" />
			</el-select>
			<el-input v-else v-model="data[c.prop]">
				<template v-if="c.prop === 'mobile'" #prefix>
					<span>{{ data.countryPhoneCode }}</span>
				</template>
			</el-input>
		</el-form-item>
		<el-checkbox v-model="data.defaultStatus" size="large">
			{{ t('Set as default address') }}
		</el-checkbox>
	</el-form>
</template>

<style lang="scss" scoped>
.mi-form--large:deep {
	.mi-form-item:last-of-type{
		margin-bottom: 10px;
	}
	.mi-input--large {
		--mi-input-border-radius: 12px;
	}

	.mi-input--prefix .mi-input__wrapper {
		padding-left: 2px;
	}

	.mi-input__prefix {
		border-radius: var(--mi-input-border-radius, var(--mi-border-radius-base));
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		background: #f3f3f3;
		padding: 0 8px;
		margin-right: 15px;
	}
	.mi-form-item.is-required:not(.is-no-asterisk).asterisk-right>.mi-form-item__label:after,
	.mi-form-item.is-required:not(.is-no-asterisk).asterisk-right>.mi-form-item__label-wrap>.mi-form-item__label:after {
		color: var(--text-secondary)
	}
}
</style>

<style lang="scss">
@import url('./AddressDialog.scss');
</style>
