<script setup lang="ts">
import BgImg from '@/assets/imgs/user-center-bg.jpg'
import BgImgMobile from '@/assets/imgs/user-center-bg--mobile.png'
import type { PayWallet } from '~/types'
import './index.scss'

useHead({
	title: `${$t('user')} ${$t('appTitle')}`,
})
const appStore = useAppStore()
const userStore = useUserStore()

const user = computed(() => userStore.user)

const dayjs = useDayjs()
const formState = reactive({
	visible: false,
	loading: false,
	file: null,
	rules: {
		nickname: [{ required: true }],
	},
	data: {
		nickname: user.value.nickname,
		avatar: user.value.avatar,
		sex: user.value.sex,
		birthday: dayjs(user.value.birthday).format('YYYY-MM-DD'),
	},
})

const { data: favCount } = await useAPI(
	'product/favorite/get-count',
)
const { data: wallet } = await useAPI<PayWallet>('pay/wallet/get')

const linkList = [
	{
		title: $t('My Orders'),
		icon: 'https://i05.appmifile.com/102_operatorx_operatorx_opx/06/06/2024/f49e629f0207ee1bccb2fbd9b7712318.png',
		url: '/user/orderlist',
	},
	{
		title: $t('拼团记录'),
		icon: 'https://i05.appmifile.com/102_operatorx_operatorx_opx/06/06/2024/f49e629f0207ee1bccb2fbd9b7712318.png',
		url: '/user/combination',
	},
	{
		title: $t('Coupons'),
		icon: 'https://i05.appmifile.com/791_operatorx_operatorx_opx/06/06/2024/e1b8a664a4b5df21bc0977b135892354.png',
		url: '/user/coupon',
	},
	{
		title: $t('Sign'),
		icon: 'https://i05.appmifile.com/143_operatorx_operatorx_opx/06/06/2024/d1a5a49897e12ddf746db4461c696812.png',
		url: '/user/signin',
	},
	{
		title: $t('Address Book'),
		icon: 'https://i05.appmifile.com/87_operatorx_operatorx_opx/06/06/2024/de057751b5b6119d34a827cc57f55f79.png',
		url: '/user/address',
	},
	// {
	// 	title: $t('My wallet'),
	// 	icon: 'https://i05.appmifile.com/61_operatorx_operatorx_opx/06/06/2024/2f0829882fd50a98858aedbc203ed39e.png',
	// 	url: '/user/wallet',
	// },
	// {
	// 	title: $t('My points') + (user.value.point ? `(${user.value.point})` : ''),
	// 	type: 'points',
	// 	icon: 'https://i05.appmifile.com/61_operatorx_operatorx_opx/06/06/2024/2f0829882fd50a98858aedbc203ed39e.png',
	// 	url: '/user/points',
	// },
	{
		title: $t('Level'),
		icon: 'https://i05.appmifile.com/681_operatorx_operatorx_opx/06/06/2024/ebccf17dd62553652278d76353868aa4.png',
		url: '/user/level',
	},
	// {
	// 	title: $t('My Reviews'),
	// 	icon: 'https://i05.appmifile.com/656_operatorx_operatorx_opx/06/06/2024/82fc1f0e03bdd22014ccfa62a0ca722c.png',
	// 	url: '',
	// },
	{
		title: $t('Favorites') + (favCount.value ? `(${favCount.value})` : ''),
		icon: 'https://i05.appmifile.com/843_operatorx_operatorx_opx/06/06/2024/d4f9359112e712e9519a61e0fe05c389.png',
		url: '/user/favorite',
	},
]

function handleEdit() {
	formState.file = null
	formState.data = {
		nickname: user.value.nickname,
		avatar: user.value.avatar,
		sex: user.value.sex,
		birthday: dayjs(user.value.birthday).format('YYYY-MM-DD'),
	}
	formState.visible = true
}

const uploadRef = ref()
function handleChangeAvatar(p) {
	const form = new FormData()
	form.append('file', p.file)
	return $api('infra/file/upload', {
		method: 'post',
		body: form,
	}).then((res) => {
		formState.data.avatar = res as string
		uploadRef.value?.clearFiles()
	})
}

const formRef = ref()
function handleSubmit() {
	formRef.value?.validate((v) => {
		if (!v)
			return
		formState.loading = true
		$api('member/user/update', {
			method: 'put',
			body: formState.data,
		}).then(() => {
			formState.visible = false
			userStore.getInfo()
		}).finally(() => {
			formState.loading = false
		})
	})
}

const formRef1 = ref()
const showPsw1 = ref(true)
const changePswState = reactive({
	visible: false,
	loading: false,
	data: {
		password: '',
		code: '',
	},
	rules: {
		password: [{ required: true }, {
			validator: (r, v, cb) => {

			},
			message: $t('password-required'),
		}],
		code: [{ required: true }],
	},
})
function handleChangePsw() {
	changePswState.data = {
		password: '',
		code: '',
	}
	changePswState.visible = true
}
function updatePsw() {
	formRef1.value?.validate((v: boolean) => {
		if (!v)
			return
		changePswState.loading = true
		$api('member/user/update-password', {
			method: 'put',
			body: {
				password: changePswState.data.password,
				code: changePswState.data.code,
			},
		}).then(() => {
			changePswState.visible = false
		}).finally(() => {
			changePswState.loading = false
		})
	})
}

function sendCode() {
	user.value.email
	&& $api('member/auth/send-sms-email-code', {
		method: 'post',
		body: {
			account: user.value.email,
			scene: 3,
		},
	})
}

const router = useRouter()
function logout() {
	userStore.logout().then(() => {
		router.push($path('/'))
	})
}
</script>

<template>
	<div class="user-center__container">
		<section
			class="user-account__overview"
			:style="{ 'background-image': `url(${appStore.isPC ? BgImg : BgImgMobile})` }"
		>
			<main class="account-overview-main">
				<section class="overview-main">
					<div class="account-info-block">
						<section class="account-avatar-wrapper">
							<app-image
								class="account-avatar"
								:src="user.avatar"
							/>
						</section>
						<div class="info-box">
							<ul class="info-box__list">
								<li class="info-box__item greetings">
									{{ user.nickname }}
								</li>
								<li class="info-box__item email">
									<span class="email-content">
										{{ $t('Email') }}: {{ user.email }}
									</span>
									<i
										v-if="appStore.isMobile"
										class="micon micon-link-arrow icon-forward"
										@click="handleEdit"
									></i>
								</li>
								<li
									v-if="appStore.isMobile"
									class="info-box__item email"
									style="margin-top: -20px"
								>
									<span class="email-content">
										{{ $t('Update password') }}
									</span>
									<i
										class="micon micon-link-arrow icon-forward"
										@click="handleChangePsw"
									></i>
								</li>
							</ul>
							<a
								v-if="appStore.isPC"
								class="edit-info__link"
								@click="handleEdit"
							>
								<span>
									{{ $t('Edit information') }}
								</span>
								<i class="micon micon-link-arrow icon-forward"></i>
							</a>
							<a
								v-if="appStore.isPC"
								class="edit-info__link"
								@click="handleChangePsw"
							>
								<span>
									{{ $t('Update password') }}
								</span>
								<i class="micon micon-link-arrow icon-forward"></i>
							</a>
						</div>
					</div>
					<div class="message-block">
						<nuxt-link :to="$path('/user/level')" class="message-block__link">
							<dl class="msg__item">
								<dt>
									<i class="micon micon-account msg-item__icon"></i>
									{{ appStore.isPC ? $t('Level') : '' }}
								</dt>
								<dd>
									{{ appStore.isMobile ? $t('Level') : '' }}
									{{ user.level?.name }}
								</dd>
							</dl>
						</nuxt-link>
						<nuxt-link :to="$path('/user/wallet?type=1')" class="message-block__link">
							<dl class="msg__item">
								<dt>
									<i class="micon micon-coupons msg-item__icon"></i>
									{{ appStore.isPC ? $t('Wallet') : '' }}
								</dt>
								<dd>
									{{ appStore.isMobile ? $t('Wallet') : '' }}
									{{ wallet?.balance }}
								</dd>
							</dl>
						</nuxt-link>
						<nuxt-link :to="appStore.isPC ? $path('/user/wallet?type=0') : $path('/user/points')" class="message-block__link">
							<dl class="msg__item">
								<dt>
									<i class="micon micon-points msg-item__icon"></i>
									{{ appStore.isPC ? $t('Points') : '' }}
								</dt>
								<dd>
									{{ appStore.isMobile ? $t('Points') : '' }}
									{{ user.point }}
								</dd>
							</dl>
						</nuxt-link>
					</div>
				</section>
			</main>
		</section>
		<section
			v-if="appStore.isMobile"
			class="user-account__orders user-center__section"
		>
			<div class="orders__header">
				<span class="container__title">{{ $t('My Orders') }}</span>
				<nuxt-link
					:to="$path('/user/orderlist')"
					style="display: flex !important"
					class="flex items-center"
				>
					<span class="mi-btn__text">{{ $t('All orders') }}</span>
					<i class="micon micon-link-arrow"></i>
				</nuxt-link>
			</div>
			<section class="orders-swiper-container">
				<ul class="orders-nav flex justify-around">
					<li class="orders-nav__item">
						<nuxt-link :to="$path('/user/orderlist?type=0')">
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/321_operatorx_operatorx_opx/09/12/2021/51e6d2dc6305cc3250d71be3fad1c40c.png"
								alt="Unpaid"
							>
							<span class="orders-item__title">
								{{ $t('Unpaid') }}
							</span>
						</nuxt-link>
					</li>
					<li role="row" class="orders-nav__item">
						<nuxt-link :to="$path('/user/orderlist?type=20')">
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/614_operatorx_operatorx_opx/09/12/2021/9f29b095aee59d25f488324878e80f31.png"
								alt="Shipping"
							>
							<span class="orders-item__title">
								{{ $t('Shipping') }}
							</span>
						</nuxt-link>
					</li>
					<li role="row" class="orders-nav__item">
						<nuxt-link :to="$path('/user/orderlist?type=30')">
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/213_operatorx_operatorx_opx/09/12/2021/bdfa2888681dc590f4e20ee6545549b2.png"
								alt="Reviews"
							>
							<span class="orders-item__title">
								{{ $t('Reviews') }}
							</span>
						</nuxt-link>
					</li>
					<li role="row" tabindex="0" class="orders-nav__item">
						<nuxt-link :to="$path('/user/aftersale')">
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/613_operatorx_operatorx_opx/09/12/2021/e355c76f8bbaddcfb285e03454bdf2ed.png"
								alt="Returns"
							>
							<span class="orders-item__title">
								{{ $t('Returns') }}
							</span>
						</nuxt-link>
					</li>
				</ul>
			</section>
		</section>
		<section class="use-center-nav__entries user-center__section">
			<nuxt-link
				v-for="l in linkList"
				v-show="!(l.type === 'points' && appStore.isPC) "
				:key="l.url"
				class="use-center-nav__item"
				:to="$path(l.url)"
			>
				<img class="entries-icon" :src="l.icon">
				<p class="entries-item__title">
					{{ l.title }}
				</p>
				<i v-if="appStore.isMobile" class="micon micon-forward icon-forward"></i>
			</nuxt-link>
		</section>
		<button
			v-if="appStore.isMobile"
			class="sign-out__item"
			@click.prevent="logout"
		>
			<i class="micon micon-sign-out sign-out__icon"></i>
			<p class="sign-out__title">
				{{ $t('Sign Out') }}
			</p>
			<i v-if="appStore.isMobile" class="micon micon-forward icon-forward"></i>
		</button>
		<app-modal
			v-model="formState.visible"
			:title="$t('Edit information')"
			class="edit-modal-main"
			destroy-on-close
			:show-close="false"
			style="min-height: 70vh"
		>
			<el-form ref="formRef" class="edit-modal__form" :model="formState.data" :rules="formState.rules" label-position="top" :show-message="false" hide-required-asterisk>
				<el-form-item class="m-0">
					<div class="w-full flex justify-center">
						<el-upload
							ref="uploadRef"
							accept=".jpg,.jpeg,.png,.gif"
							:limit="1"
							:http-request="handleChangeAvatar"
							:show-file-list="false"
						>
							<div class="edit-modal__avatar m-0">
								<app-image
									class="responsive-image clip-image clip-image--shadow avatar-img"
									:src="formState.data.avatar"
								/>
								<div class="edit-modal-avatar_edit">
									<i class="micon micon-edit1 upload-avatar__icon"></i>
								</div>
							</div>
						</el-upload>
					</div>
				</el-form-item>
				<el-form-item :label="$t('ID')">
					<el-input v-model="user.id" disabled />
				</el-form-item>
				<el-form-item :label="$t('Nickname')" prop="nickname">
					<el-input v-model="formState.data.nickname" />
				</el-form-item>
				<el-form-item :label="$t('Birthday')" prop="birthday">
					<el-date-picker
						v-model="formState.data.birthday"
						value-format="YYYY-MM-DD"
						style="width: 100%"
						:placement="appStore.isMobile ? 'top' : ''"
					/>
				</el-form-item>
				<el-form-item :label="$t('Sex')" prop="sex">
					<el-select
						v-model="formState.data.sex"
						:placement="appStore.isMobile ? 'top' : ''"
					>
						<el-option :value="0" :label="$t('Male')" />
						<el-option :value="1" :label="$t('Female')" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="flex w-full">
					<el-button class="edit-modal-btn w-2/4" @click="formState.visible = false">
						{{ $t('Cancel') }}
					</el-button>
					<el-button class="edit-modal-btn w-2/4" type="info" :disabled="formState.loading" @click="handleSubmit">
						{{ $t('Save') }}
					</el-button>
				</div>
			</template>
		</app-modal>
		<app-modal
			v-model="changePswState.visible"
			:title="$t('Update password')"
			class="edit-modal-main"
		>
			<el-form ref="formRef1" :model="changePswState.data" :rules="changePswState.rules" label-position="top" :show-message="false" hide-required-asterisk>
				<el-form-item :label="$t('Password')" prop="password">
					<el-input v-model="changePswState.data.password" :type="showPsw1 ? '' : 'password'">
						<template #suffix>
							<PswEye v-model="showPsw1" />
						</template>
					</el-input>
				</el-form-item>
				<el-form-item :label="$t('Code')" prop="code">
					<el-input v-model="changePswState.data.code">
						<template #suffix>
							<CodeSender
								token="updatePsw-timeout"
								@click="sendCode"
							/>
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="flex w-full">
					<el-button class="edit-modal-btn w-2/4" @click="changePswState.visible = false">
						{{ $t('Cancel') }}
					</el-button>
					<el-button class="edit-modal-btn w-2/4" type="info" :disabled="changePswState.loading" @click="updatePsw">
						{{ $t('Save') }}
					</el-button>
				</div>
			</template>
		</app-modal>
	</div>
</template>
