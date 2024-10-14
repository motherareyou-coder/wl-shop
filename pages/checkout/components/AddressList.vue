<script setup>
import { cloneDeep } from 'lodash-es'
import AddressDialog from './AddressDialog.vue'
import './AddressList.scss'

const { t } = useI18n()

const selected = defineModel()

const formState = reactive({
	visible: false,
	data: {},
})

const list = ref([
	{
		address: 'erger[-addr-]casdae[-addr-]2654684',
		address_id: '10241012647524395',
		city: {
			id: '857741279',
			name: 'Greater Manchester',
		},
		consignee: 'jie chen',
		district: {
			id: '857741317',
			name: 'Manchester',
		},
		email: 'fl****@gmail.com',
		province: {
			id: '850398216',
			name: 'England',
		},
		phoneCode: '+44',
		tel: '465****419',
		zipcode: 'M25BQ',
		limit: '',
		limit_cod: '',
		citys: '',
		is_default: 1,
		can_cod: 0,
		is_invalid: 0,
		limit_txt: '',
		limit_cod_txt: '',
		first_name: 'jie',
		last_name: 'chen',
		address1: 'erger',
		address2: 'casdae',
		addr_india: {
			addr: 'casdae',
			landmark: '2654684',
			city: 'erger',
		},
		address3: '2654684',
		gstin_prefix: '',
		area: {
			id: '857742083',
			name: 'M25BQ',
		},
		change_addr_tips:
			'Changing the address may affect delivery speed, you can only change the address once. The changes in the address may not reflect if the product has already been shipped, the warehouse changes etc.',
		address_type: '1',
		email_txt: 'flkgkl@gmail.com',
		tel_txt: '4654987419',
		invalid_fields: {},
		tel_country_code: '',
		address_format_type: '1',
	},
])

function handleAdd() {
	formState.data = {}
	formState.visible = true
}

function handleEdit(data) {
	formState.data = cloneDeep(data)
	formState.visible = true
}

function handleDelete(data, i) {
	list.value.splice(i, 1)
}
</script>

<template>
	<div>
		<div
			v-for="(a, i) in list"
			:key="a.id"
			class="user-address__card user-address__card--center user-address__card--default"
			:class="{ active: selected === a }"
			@click="selected = a"
		>
			<div v-if="a.is_default" class="user-address__card-default active">
				{{ t('Default') }}
			</div>
			<div class="user-address__card-text">
				<div class="user-address__card-title--wrapper">
					<h2 class="user-address__card-title">
						{{ a.first_name }} {{ a.last_name }}
					</h2>
				</div>
				<div class="user-address__card-tel-wrapper">
					<span class="user-address__card-area">
						{{ a.phoneCode }}
					</span>
					<span class="user-address__card-tel">{{ a.tel }}</span>
				</div>
				<div class="user-address__card-content--wrapper">
					{{
						[
							a.address3,
							a.address1,
							a.address2,
							a.city.name,
							a.zipcode,
						].join(' ')
					}}
				</div>
				<div class="user-address__card-btn--wrapper">
					<span
						class="user-address__card-btn user-address__card-btn--delete"
						@click="handleDelete(a, i)"
					>
						<el-icon>
							<ElIconDelete />
						</el-icon>
					</span>
					<span
						class="user-address__card-btn user-address__card-btn--edit"
						@click="handleEdit(a)"
					>
						<el-icon>
							<ElIconEdit />
						</el-icon>
					</span>
				</div>
			</div>
		</div>
		<div class="user-address__add--wrapper" @click="handleAdd">
			<div
				class="user-address__card--add user-address__add--center"
				style="height: 100%"
			>
				<span>
					{{ t('Add new address') }}
					<el-icon class="micon-link-arrow">
						<ElIconArrowRight />
					</el-icon>
				</span>
				<button class="user-address__card--add-btn app-button">
					<el-icon>
						<ElIconPlus />
					</el-icon>
					<span>
						{{ t('Add new address') }}
					</span>
				</button>
			</div>
		</div>
		<AddressDialog
			v-model:data="formState.data"
			v-model:visible="formState.visible"
		/>
	</div>
</template>
