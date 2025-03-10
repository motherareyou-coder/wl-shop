<script setup lang="ts">
import BannerBg from '@/assets/imgs/login-banner.jpg'

defineOptions({ name: 'Login' })
definePageMeta({ layout: 'login' })

const router = useRouter()
const route = useRoute()
const { shortDomain, domain } = useRuntimeConfig().public
const redirect = decodeURIComponent(route.query.redirect || '')

const tab = ref(route.query.type == 1 ? 1 : 0)

const { t } = useI18n()
useHead({
	title: `${t('login')} ${t('appTitle')}`,
	link: [{ rel: 'canonical', href: `${domain} ${route.path}` }],
	meta: [{ name: 'description', content: 'login' }],
})

const userStore = useUserStore()

const msg = $t('Password is inconsistent')
const form = ref({ account: '', password: '', confirmPassword: '', code: '', agreed: true })
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

const showPsw = ref(false)
const showPsw1 = ref(false)
const showPsw2 = ref(false)
const usePsw = ref(true)

function sendCode() {
	$api('member/auth/send-sms-email-code', {
		method: 'post',
		body: {
			account: form.value.account,
			scene: 0,
		},
	})
}

const { loading, wrapLoading } = useLoading(false)
const formRef = ref()

function handleLogin() {
	formRef.value?.validate((v) => {
		if (!v)
			return
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
			promise = $api('member/auth/email-sms-Login', {
				method: 'post',
				body: {
					account: form.value.account,
					code: form.value.code,
				},
			})
		}
		wrapLoading(promise.then((res) => {
			userStore.needAddCart = true
			userStore.setToken(res)
			router.push(redirect || '/')
		}))
	})
}

function handleRegister() {
	formRef.value?.validate((v) => {
		if (!v)
			return
		wrapLoading(
			$api('member/auth/email-account-register', {
				method: 'post',
				body: {
					account: form.value.account,
					password: form.value.password,
					confirmPassword: form.value.confirmPassword,
				},
			}).then((res) => {
				userStore.setToken(res)
				router.push(redirect || '/')
			}),
		)
	})
}

// 社交登录
async function doSocialLogin(type: number) {
	// 计算 redirectUri
	// tricky: type、redirect需要先encode一次，否则钉钉回调会丢失。
	// 配合 Login/SocialLogin.vue#getUrlValue() 使用
	// 进行跳转
	// const res = await LoginApi.socialAuthRedirect(type, encodeURIComponent(redirectUri))
	// console.log("redirect",redirect)
	// 获取当前页面的域名地址
	const domain = window.location.origin
	const loginbackUrl = domain + $path('/login/loginBack')
	// console.log("loginbackUrl",loginbackUrl)
	$api('member/auth/social-auth-redirect', {
		params: { type, redirectUri: redirect, loginBack: decodeURIComponent(loginbackUrl) },
	}).then((res) => {
		window.location.href = res as string
	})
}
</script>

<template>
	<div
		class="mi-sider-layout"
	>
		<div class="mi-sider-layout__sider">
			<div class="mi-sider-layout__banner" :style="{ backgroundImage: `url(${BannerBg})` }"></div>
		</div>
		<div class="mi-sider-layout__content">
			<div class="mi-sider-layout__scroll">
				<div class="mi-layout">
					<div class="mi-layout__header">
						<div class="mi-layout__title">
							<div class="mi-layout__logo-wrap">
								<nuxt-link class="logo__link" :to="$path('/')" aria-label="loginLink">
									<Icon name="icon:shop" class="mi-layout__logo" />
								</nuxt-link>
							</div>
							Account
						</div>
						<div class="mi-nav">
							<div class="mi-nav__item">
								<language-select style="vertical-align: middle;font-size: 30px;" />
							</div>
						</div>
					</div>
					<div class="mi-layout__container">
						<div class="mi-layout__card">
							<el-tabs v-model="tab">
								<el-tab-pane :label="$t('login')" :name="0">
									<el-form
										ref="formRef"
										:model="form"
										:rules="rules"
									>
										<div class="mi-form__content">
											<el-form-item>
												<el-select v-model="usePsw" class="mi-form-field__field">
													<template #prefix>
														<label>{{ $t('Login Type') }}</label>
													</template>
													<el-option :label="$t('Using Code Login')" :value="false" />
													<el-option :label="$t('Using Password Login')" :value="true" />
												</el-select>
											</el-form-item>
											<el-form-item prop="account">
												<el-input v-model="form.account" :placeholder="$t('Email')" class="mi-form-field__field" />
											</el-form-item>
											<el-form-item v-if="usePsw" prop="password">
												<el-input
													v-model="form.password" :placeholder="$t('Password')"
													:type="showPsw ? '' : 'password'" class="mi-form-field__field"
												>
													<template #suffix>
														<PswEye v-model="showPsw" />
													</template>
												</el-input>
											</el-form-item>
											<el-form-item v-else prop="code">
												<el-input v-model="form.code" class="mi-form-field__field code">
													<template #suffix>
														<CodeSender
															token="login-timeout"
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
												@click.prevent.stop="handleLogin"
											>
												{{ $t('login') }}
											</el-button>
											<div class="mi-form-actions mi-form-actions--inline">
												<div class="mi-form-action mi-form-action--start" style="max-width: 100%">
													<!-- <el-link :href="$path('/forgetPassword')" type="primary" :underline="false"> -->
													<el-link type="primary" :underline="false" @click="usePsw = false">
														{{ $t('Forgot password') }}?
													</el-link>
												</div>
											</div>
										</div>
										<div class="mi-sns-login">
											<div class="mi-sns-login__title">
												{{ $t('More options') }}
											</div>
											<div class="mi-sns-login__content">
												<div class="mi-sns-login__list">
													<div class="mi-sns-login__item">
														<span class="mi-sns-login__icon" style="padding:8px">
															<Icon name="icon:google" @click="doSocialLogin(40)" />
														</span>
													</div>
												</div>
											</div>
										</div>
									</el-form>
								</el-tab-pane>
								<el-tab-pane :label="$t('register')" :name="1">
									<el-form>
										<div class="mi-form__content">
											<el-form-item prop="account">
												<el-input v-model="form.account" :placeholder="$t('Email')" class="mi-form-field__field" />
											</el-form-item>
											<el-form-item prop="password">
												<el-input
													v-model="form.password" :placeholder="$t('Set password')"
													:type="showPsw1 ? '' : 'password'" class="mi-form-field__field"
												>
													<template #suffix>
														<PswEye v-model="showPsw1" />
													</template>
												</el-input>
											</el-form-item>
											<el-form-item prop="confirmPassword">
												<el-input
													v-model="form.confirmPassword" :placeholder="$t('Enter your password again')"
													:type="showPsw2 ? '' : 'password'" class="mi-form-field__field"
												>
													<template #suffix>
														<PswEye v-model="showPsw2" />
													</template>
												</el-input>
											</el-form-item>
											<p class="my-2 text-sm " style="color:var(--title-light)">
												{{ $t('password-required') }}
											</p>
											<el-form-item>
												<div class="flex">
													<el-checkbox
														v-model="form.agreed" style="margin-right: 0.75rem;--mi-checkbox-height: 20px;"
														class="leading-5 height-5"
													/>
													<span class="leading-5">
														{{ $t("I've read and agreed to User Agreementand Privacy Policy") }}
													</span>
												</div>
											</el-form-item>
											<button class="mi-button mi-button--primary w-full" :aria-label="$t('Next')" @click.prevent.stop="handleRegister">
												{{ $t('Next') }}
											</button>
										</div>
									</el-form>
								</el-tab-pane>
							</el-tabs>
						</div>
					</div>
					<div class="mi-copyright">
						<!-- Xiaomi Inc., All rights reserved - Beijing ICP - 10046444 - <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802020134" target="_blank" rel="noopener noreferrer">Beijing Public Security ICP-11010802020134</a> - Beijing ICP licence No. - 110507 -->
						Copyright © 2024 - 2034 {{ shortDomain }}.All Rights Reserved
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import url('./index.scss');
</style>
