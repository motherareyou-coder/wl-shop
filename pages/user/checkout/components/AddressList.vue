<script setup lang="tsx">
import { pick } from 'lodash-es'
import AddressForm from './AddressForm.vue'
import type { Address } from '~/types'
import './AddressList.scss'

const props = defineProps({
	isCheckout: { type: Boolean },
})
const emit = defineEmits(['select'])

const selected = defineModel()
const addressList = ref<Address[]>([])

watch(selected, (v) => {
	console.log('select', v)

	emit('select', v)
})
watch(
	addressList,
	(v) => {
		if (selected.value && !v.find(d => d.id === selected.value.id))
			selected.value = null
		if (v.length && !selected.value) {
			const t = v.find(d => d.defaultStatus) || v[0]
			selected.value = t
		}
	},
	{ deep: true },
)

const formState = reactive({
	visible: false,
	data: {},
})
const formRef = ref()
const isEdit = ref(false)

function refressAddressList() {
	return $api('member/address/list?apifoxApiId=220056923').then((res) => {
		addressList.value = res || []
	})
}
refressAddressList()

function handleAdd() {
	nextTick(() => formRef.value?.resetFields())
	formState.data = {}
	formState.visible = true
	isEdit.value = false
}

function handleEdit(data: Address) {
	nextTick(() => formRef.value?.resetFields())
	formState.data = cloneDeep(data)
	formState.visible = true
	isEdit.value = true
}

const msg = $t('Are you sure to delete this address?')
function handleDelete(data: Address, i: number) {
	ElMessageBox.confirm(msg, {
		confirmButtonClass: 'mi-button--info',
	})
		.then(() =>
			$api('member/address/delete?apifoxApiId=221188610', {
				method: 'delete',
				body: { id: data.id },
			}).then(() => {
				addressList.value?.splice(i, 1)
				// refressAddressList()
			}),
		)
		.catch(() => {})
}

const propList = [
	'name',
	'mobile',
	'areaId',
	'detailAddress',
	'defaultStatus',
	'lastName',
	'postCode',
	'houseNumber',
	'countryId',
	'countryPhoneCode',
	'detailAddress2',
	'email',
]

const loading = ref(false)
function handleSubmit() {
	formRef.value?.validate((v: boolean) => {
		if (!v)
			return
		loading.value = true
		if (formState.data.id) {
			$api('member/address/update?apifoxApiId=221188479', {
				method: 'put',
				body: pick(formState.data, propList),
			})
				.then(() => {
					formState.visible = false
					refressAddressList()
				})
				.finally(() => {
					loading.value = false
				})
		}
		else {
			$api('member/address/create?apifoxApiId=221188485', {
				method: 'post',
				body: pick(formState.data, propList),
			})
				.then(() => {
					formState.visible = false
					refressAddressList()
				})
				.finally(() => {
					loading.value = false
				})
		}
	})
}

const appStore = useAppStore()
const listVisible = ref(false)
function showList() {
	if (appStore.isMobile && props.isCheckout)
		listVisible.value = true
}

function updateDefaultStatus(data: Address, v: number) {
	if (v) {
		$api('member/address/update?apifoxApiId=221188479', {
			method: 'put',
			body: { ...pick(data, propList), defaultStatus: true },
		}).then(() => {
			addressList.value.forEach((d) => {
				d.defaultStatus = false
			})
			data.defaultStatus = true
		})
	}
	else {
		data.defaultStatus = true
	}
}

function renderButton(props1: { data: Address, index: any }) {
	return (
		<>
			<span
				class="user-address__card-btn user-address__card-btn--delete"
				onClick={() => handleDelete(props1.data, props1.index)}
			>
				<el-icon>
					<ElIconDelete />
				</el-icon>
			</span>
			<span
				class="user-address__card-btn user-address__card-btn--edit"
				onClick={() => handleEdit(props1.data)}
			>
				<el-icon>
					<ElIconEdit />
				</el-icon>
			</span>
		</>
	)
}
function RenderAddress(props1: { data: Address, index: number }) {
	return (
		<div
			class={{
				'user-address__card user-address__card--center user-address__card--default cursor-pointer':
					true,
				'user-address__card--selected': selected.value === props1.data,
			}}
			onClick={() => {
				selected.value = props1.data
			}}
		>
			{appStore.isPC && props1.data.defaultStatus
				? (
						<div class="user-address__card-default active ">
							{$t('Default')}
						</div>
					)
				: null}
			<div class="user-address__card-text">
				<div class="user-address__card-title--wrapper">
					<h2 class="user-address__card-title">{props1.data.name}</h2>
					{appStore.isMobile
					&& props.isCheckout
					&& props1.data.defaultStatus
						? (
								<div
									class="user-address__card-default active "
									style="position:relative"
								>
									{$t('Default')}
								</div>
							)
						: null}
				</div>
				<div class="user-address__card-tel-wrapper">
					<span class="user-address__card-area">
						{props1.data.mobile}
					</span>
				</div>
				<div class="user-address__card-content--wrapper">
					{[
						props1.data.countryId,
						props1.data.areaId,
						props1.data.detailAddress,
					].join(' ')}
				</div>
				<div class="user-address__card-btn--wrapper justify-between">
					{appStore.isMobile
						? (
								<div class="user-address__card-btn--default">
									<el-checkbox
										v-model={props1.data.defaultStatus}
										class="mi-address-checkbox__item"
										onChange={v =>
											updateDefaultStatus(props1.data, v)}
										onClick={e => e.stopPropagation()}
									>
										{$t('Set as default address')}
									</el-checkbox>
								</div>
							)
						: null}
					{appStore.isMobile
						? (
								<div class="user-address__card-btn--right">
									{renderButton(props1)}
								</div>
							)
						: (
								renderButton(props1)
							)}
				</div>
			</div>
		</div>
	)
}
</script>

<template>
	<div>
		<template v-if="appStore.isPC">
			<template v-for="(a, i) in addressList" :key="a.id">
				<RenderAddress :data="a" :index="i" />
			</template>
		</template>
		<template v-if="appStore.isMobile">
			<template v-for="(a, i) in addressList" :key="a.id">
				<RenderAddress :data="a" :index="i" @click="showList" />
			</template>
			<section
				v-if="
					props.isCheckout && (addressList.length === 0 || !selected)
				"
				class="empty-address"
				role="button"
				tabindex="0"
				@click="handleAdd"
			>
				<div class="mobile-empty">
					<div class="mobile-empty__text">
						{{ $t('Add new address') }}
					</div>
					<div>
						<el-icon class="micon micon-unfold-more">
							<ElIconPlus />
						</el-icon>
					</div>
				</div>
			</section>
			<ElIcon
				v-else-if="props.isCheckout"
				class="spread-icon micon micon-forward"
				@click="showList"
			>
				<ElIconArrowRight />
			</ElIcon>
		</template>
		<div
			v-if="(props.isCheckout && appStore.isPC) || !props.isCheckout"
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
					<ElIcon>
						<ElIconPlus />
					</ElIcon>
					<span>
						{{ $t('Add new address') }}
					</span>
				</button>
			</div>
		</div>
		<AppModal
			v-model="formState.visible"
			:title="
				formState.data.id
					? $t('Edit your address')
					: $t('Create your address')
			"
		>
			<AddressForm ref="formRef" v-model="formState.data" />
			<template #footer>
				<div>
					<el-button
						type="info"
						:disabled="loading"
						class="w-full"
						@click="handleSubmit"
					>
						{{ $t('Save') }}
					</el-button>
				</div>
			</template>
		</AppModal>
		<AppModal
			v-if="appStore.isMobile"
			v-model="listVisible"
			:title="$t('Address')"
			style="max-height: 60vh"
			append-to-body
		>
			<template v-for="(a, i) in addressList" :key="a.id">
				<RenderAddress :data="a" :index="i" :hide-default="true" />
			</template>
			<template #footer>
				<button
					class="user-address__card--add-btn app-button w-full"
					@click="handleAdd"
				>
					<ElIcon>
						<ElIconPlus />
					</ElIcon>
					<span>
						{{ $t('Add new address') }}
					</span>
				</button>
			</template>
		</AppModal>
	</div>
</template>
