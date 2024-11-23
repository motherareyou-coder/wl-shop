<script setup lang="ts">
import './index.scss'

definePageMeta({
	layout: 'empty',
})

const msg = $t('Password is inconsistent')
const form = ref({ account: '', password: '', confirmPassword: '', code: '' })
const rules = {
	account: [{ required: true, message: '' }],
	password: [{ required: true, message: '' }],
	code: [{ required: true, message: '' }],
	confirmPassword: [
		{ required: true, message: '' },
		{
			validator: (r, v, cb) => {
				if (v && v !== form.value.password)
					cb(new Error(msg))
				else cb()
			},
		},
	],
}
const formRef = ref()
const showPsw = ref(false)
const showPsw1 = ref(false)
const router = useRouter()

function sendCode() {
	$api('member/auth/send-sms-email-code', {
		method: 'post',
		body: {
			account: form.value.account,
			scene: 3,
		},
	})
}
const { loading, wrapLoading } = useLoading()
function updatePsw() {
	formRef.value?.validate((v: boolean) => {
		if (!v)
			return
		wrapLoading($api('member/user/update-password', {
			method: 'put',
			body: {
				account: form.value.account,
				password: form.value.password,
				code: form.value.code,
			},
		}).then(() => {
			router.push($path('/login'))
		}))
	})
}
</script>

<template>
	<div class="forgetPassword-root-wrap">
		<div class="forgetPassword-container">
			<header class="">
				<div class="py-4 flex justify-between">
					<language-select />
					<div></div>
				</div>
				<h4 class="text-center pt-3 pb-4 font-medium text-xl">
					{{ $t('Reset password') }}
				</h4>
			</header>
			<div class="mi-layout">
				<div class="mi-layout__container">
					<div class="mi-layout__card">
						<el-form
							ref="formRef"
							:model="form"
							:rules="rules"
						>
							<div class="mi-form__content">
								<el-form-item prop="account">
									<el-input v-model="form.account" :placeholder="$t('Email')" class="mi-form-field__field" />
								</el-form-item>
								<el-form-item prop="password">
									<el-input v-model="form.password" :placeholder="$t('Password')" :type="showPsw ? '' : 'password'" class="mi-form-field__field">
										<template #suffix>
											<PswEye v-model="showPsw" />
										</template>
									</el-input>
								</el-form-item>
								<el-form-item prop="confirmPassword">
									<el-input v-model="form.confirmPassword" :placeholder="$t('Enter your password again')" :type="showPsw1 ? '' : 'password'" class="mi-form-field__field">
										<template #suffix>
											<PswEye v-model="showPsw1" />
										</template>
									</el-input>
								</el-form-item>
								<el-form-item prop="code">
									<el-input v-model="form.code" :placeholder="$t('Code')" class="mi-form-field__field code">
										<template #suffix>
											<CodeSender
												token="forgetPsw-timeout"
												:disabled="!form.account"
												@click="sendCode"
											/>
										</template>
									</el-input>
								</el-form-item>
								<el-button
									type="primary"
									class="w-full"
									:disabled="loading"
									@click.prevent.stop="updatePsw"
								>
									{{ $t('Update Password') }}
								</el-button>
							</div>
						</el-form>
					</div>
				</div>
				<div class="mi-copyright">
					Xiaomi Inc., All rights reserved - Beijing ICP - 10046444 - <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802020134" target="_blank" rel="noopener noreferrer">Beijing Public Security ICP-11010802020134</a> - Beijing ICP licence No. - 110507
				</div>
			</div>
		</div>
	</div>
</template>
