<script setup lang="ts">
import AddressForm from './AddressForm.vue'
import type { Address } from '~/types'
import './AddressList.scss'

const props = defineProps({
	addable: { type: Boolean, default: true },
})
const selected = defineModel()
const addressList = defineModel<Address[]>('list', { default: () => [] })

const formState = reactive({
	visible: false,
	data: {},
})
const isEdit = ref(false)

$api('member/address/list?apifoxApiId=220056923').then((res) => {
	addressList.value = res || []
})

function handleAdd() {
	formState.data = {}
	formState.visible = true
	isEdit.value = false
}

function handleEdit(data: Address) {
	formState.data = cloneDeep(data)
	formState.visible = true
	isEdit.value = true
}

function handleDelete(data: Address, i: number) {
	ElMessageBox.confirm($t('Are you sure to delete this address?')).then(() =>
		$api('member/address/delete?apifoxApiId=221188610', {
			method: 'delete',
			body: { id: data.id },
		}).then(() => {
			addressList.value?.splice(i, 1)
		}),
	)
}
const appStore = useAppStore()
</script>

<template>
	<div>
		<template v-for="(a, i) in addressList">
			<div
				v-if="props.addable || a === selected"
				:key="a.areaId"
				class="user-address__card user-address__card--center user-address__card--default cursor-pointer"
				:class="{ 'user-address__card--selected': selected === a }"
				@click="selected = a"
			>
				<div
					v-if="a.defaultStatus"
					class="user-address__card-default active"
				>
					{{ $t('Default') }}
				</div>
				<div class="user-address__card-text">
					<div class="user-address__card-title--wrapper">
						<h2 class="user-address__card-title">
							{{ a.name }}
						</h2>
					</div>
					<div class="user-address__card-tel-wrapper">
						<span class="user-address__card-area">
							{{ a.mobile }}
						</span>
					</div>
					<div class="user-address__card-content--wrapper">
						{{ [a.countryId, a.areaId, a.detailAddress].join(' ') }}
					</div>
					<div class="user-address__card-btn--wrapper">
						<span
							v-if="props.addable"
							class="user-address__card-btn user-address__card-btn--delete"
							@click="handleDelete(a, i)"
						>
							<el-icon>
								<ElIconDelete />
							</el-icon>
						</span>
						<span
							v-if="props.addable"
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
		</template>
		<div
			v-if="props.addable"
			class="user-address__add--wrapper"
			@click="handleAdd"
		>
			<div
				class="user-address__card--add user-address__add--center"
				style="height: 100%"
			>
				<span>
					{{ $t('Add new address') }}
					<i class="micon micon-link-arrow"></i>
				</span>
				<button class="user-address__card--add-btn app-button">
					<el-icon>
						<ElIconPlus />
					</el-icon>
					<span>
						{{ $t('Add new address') }}
					</span>
				</button>
			</div>
		</div>
		<el-dialog
			v-if="appStore.isPC"
			v-model="formState.visible"
			:title="$t('Create your address')"
			class="mi-modal"
			width="40rem"
			center
		>
			<AddressForm v-model="formState.data" />
		</el-dialog>
		<el-drawer
			v-if="appStore.isMobile"
			v-model="formState.visible"
			direction="btt"
			:title="$t('Create your address')"
		>
			<AddressForm v-model="formState.data" />
		</el-drawer>
	</div>
</template>
