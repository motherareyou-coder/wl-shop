<script setup lang="ts">
defineOptions({ name: 'Login' })
definePageMeta({ layout: 'login' })

const router = useRouter()

const { t } = useI18n()
useHead({
	title: `${t('login')} ${t('appTitle')}`,
	meta: [{ name: 'description', content: 'Login' }],
})

const userStore = useUserStore()

const rules = {
	account: [{ required: true }],
	password: [{ required: true }],
	code: [{ required: true }],
}
const form = ref({ account: '', password: '', code: '' })

const usePsw = ref(true)
const isChange = ref(false)
const timeout = ref(0)
try {
	const t = Number(localStorage.getItem('login-timeout'))
	if (!Number.isNaN(t) && t > 0) {
		timeout.value = t
		reduceTime()
	}
}
catch (error) {
	console.warn(error)
	timeout.value = 0
}

function reduceTime() {
	const timer = setInterval(() => {
		if (timeout.value <= 0) {
			clearInterval(timer)
			timeout.value = 0
		}
		else {
			timeout.value--
			localStorage.setItem('login-timeout', `${timeout.value}`)
		}
	}, 1000)
}

function sendCode() {
	timeout.value = 60
	reduceTime()
	if (isChange.value) {
		$api('member/auth/send-sms-email-code', {
			method: 'post',
			body: {
				account: form.value.account,
				scene: 3,
			},
		})
	}
	else {
		$api('member/auth/send-sms-email-code', {
			method: 'post',
			body: {
				account: form.value.account,
				scene: 0,
			},
		})
	}
}

const loading = ref(false)
const formRef = ref()
function updatePsw() {
	formRef.value?.validate((v) => {
		if (!v)
			return
		$api('member/user/update-password', {
			method: 'put',
			body: {
				code: form.value.code,
				password: form.value.password,
			},
		}).then(() => {
			form.value.password = ''
			form.value.code = ''
			usePsw.value = true
			isChange.value = false
		})
	})
}
function login() {
	formRef.value?.validate((v) => {
		if (!v)
			return
		loading.value = true
		let promise
		if (usePsw.value) {
			promise = $api('member/auth/account-login', {
				method: 'post',
				body: {
					account: form.value.account,
					password: form.value.password,
				},
			})
		}
		else {
			promise = $api(
				'member/auth/email-sms-Login',
				{
					method: 'post',
					body: {
						account: form.value.account,
						code: form.value.code,
					},
				},
			)
		}
		promise
			.then((res) => {
				userStore.setToken(res)
				router.push('/')
			})
			.finally(() => {
				loading.value = false
			})
	})
}
</script>

<template>
	<div
		class="flex flex-col bg-white mx-auto my-20 p-10 max-w-full login-container"
	>
		<h2 v-if="isChange" class="text-3xl text-center mb-5">
			{{ $t('Update Password') }}
		</h2>
		<h2 v-else class="text-3xl text-center mb-5">
			{{ $t('login') }}
		</h2>
		<el-radio-group
			v-model="usePsw"
			:class="[isChange ? 'invisible' : 'visible']"
			class="mb-3"
		>
			<el-radio :value="true">
				{{ $t('Use password') }}
			</el-radio>
			<el-radio :value="false">
				{{ $t('Use code') }}
			</el-radio>
		</el-radio-group>
		<el-form
			ref="formRef"
			class="login-form max-w-full"
			:model="form"
			:rules="rules"
			label-position="top"
			hide-required-asterisk
			:show-message="false"
		>
			<el-form-item :label="$t('Account')" prop="account">
				<el-input v-model="form.account" />
			</el-form-item>
			<el-form-item
				v-if="usePsw && !isChange"
				:label="$t('Password')"
				prop="password"
			>
				<el-input v-model="form.password" type="password" />
			</el-form-item>
			<el-form-item
				v-if="!usePsw || isChange"
				:label="$t('Code')"
				prop="code"
			>
				<el-input v-model="form.code" class="code-input">
					<template #suffix>
						<el-button
							:disabled="!form.account || !!timeout"
							type="info"
							@click="sendCode"
						>
							<span v-if="timeout">({{ timeout }}s)</span>
							<span v-else>
								{{ $t('Send code') }}
							</span>
						</el-button>
					</template>
				</el-input>
			</el-form-item>
		</el-form>
		<el-button
			v-if="isChange"
			class="w-full"
			type="info"
			@click="updatePsw"
		>
			{{ $t('Update Password') }}
		</el-button>
		<el-button
			v-else
			class="w-full"
			type="info"
			:disabled="loading"
			@click="login"
		>
			{{ $t('Login') }}
		</el-button>
		<div v-if="isChange" class="my-2 text-left">
			<a
				class="inline-flex items-center text-sm cursor-pointer"
				@click="isChange = false"
			>
				<el-icon><el-icon-arrow-left /></el-icon>
				{{ $t('Login') }}
			</a>
		</div>
		<div v-else class="my-2 text-right">
			<a
				v-show="!isChange"
				class="inline-flex items-center text-sm cursor-pointer"
				@click="isChange = true"
			>
				{{ $t('Forget password') }}
				<el-icon><el-icon-arrow-right /></el-icon>
			</a>
		</div>
	</div>
</template>

<style scoped lang="scss">
.login-container {
	border-radius: 4px;
	box-shadow: 0 20px 50px 0 hsla(0, 0%, 64%, 0.1);
	.login-form {
		width: 20rem;
		min-width: 15rem;
		:deep {
			.mi-radio__label {
				color: #191919;
			}
			.code-input {
				.mi-input__wrapper {
					padding-right: 1px;
					overflow: hidden;
				}
				.mi-button {
					border-radius: 0;
					border: none;
					height: 30px;
				}
			}
		}
	}
	a {
		color: #898989;
	}
}

@media screen and (max-width: 720px) {
	.login-container {
		padding: 30px;
		.login-form {
			width: 16rem;
		}
	}
}
@media screen and (min-width: 1921px) {
	.login-container {
		.login-form {
			min-width: 500px;
		}
	}
}
</style>
