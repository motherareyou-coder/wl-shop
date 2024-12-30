<script setup>
import './index.scss'

defineOptions({ name: 'AppFooter' })

const { domain } = useRuntimeConfig().public
const form = ref({ email: '' })
const rules = {
	email: [{ type: 'email' }, { required: true }],
}

const list = [
	{
		label: $t('SUPPORT'),
		children: [
			{ label: 'Mi Points FAQ', src: 'https://www.mi.com/uk/' },
			{ label: 'Where to Buy', src: 'https://www.mi.com/uk/' },
			{ label: 'Coupon Code', src: 'https://www.mi.com/uk/' },
		],
	},
	{
		label: $t('ABOUT US'),
		children: [
			{ label: 'isWink', src: domain },
			{ label: 'Leadership Team', src: domain },
			{ label: 'Privacy Policy', src: domain },
			{ label: 'Integrity & Compliance', src: domain },
			{ label: 'Trust Centre', src: domain },
			{ label: 'Accessibility', src: domain },
		],
	},
	{
		label: $t('CONTRACT US'),
		children: [
			{ label: 'Twitter', src: 'https://www.twitter.com/' },
			{ label: 'Youtube', src: 'https://www.youtube.com/' },
			{ label: 'Facebook', src: 'https://www.facebook.com/' },
		],
	},
]
const formRef = ref()
function submit() {
	formRef.value?.validate((v) => {
		if (!v)
			return ElMessage.info('The email address is invalid.')
	})
}
</script>

<template>
	<footer class="site-footer">
		<div class="site-footer__footnote footnote">
			<div class="site-container">
				<div class="footnote__list site-footer__terms">
					<p class="footnote__item site-footer__payment-terms">
						<nuxt-link
							to="https://www.paypal.com/uk/webapps/mpp/paypal-virtual-credit/faq"
						>
							PayPal Credit
						</nuxt-link>
						and PayPal Pay in 3 are trading names of PayPal UK Ltd,
						Whittaker House, Whittaker Avenue, Richmond-Upon-Thames,
						Surrey, United Kingdom, TW9 1EH. PayPal Credit: Terms
						and conditions apply. Credit subject to status, UK
						residents only, Xiaomi Technology UK Limited is an
						appointed representative of Product Partnerships Limited
						for the purpose of credit broking. Product Partnerships
						Limited is authorised and regulated by the Financial
						Conduct Authority with registration 959828 and address
						Second Floor, Atlas House, 31 King Street, Leeds LS1
						2HL. United Kingdom. Xiaomi Technology UK Limited acts
						as a credit broker not a lender. We do not receive any
						commission for introducing customers to
						<nuxt-link
							to="https://www.paypal.com/uk/webapps/mpp/paypal-virtual-credit/faq"
						>
							PayPal Credit
						</nuxt-link>. You may be able to obtain finance for your purchase
						from other lenders and you are encouraged to seek
						alternative quotations. If you would like to know how we
						handle complaints, please ask for a copy of our
						complaints handling process. You can also find
						information about referring a complaint to the Financial
						Ombudsman Service (FOS) at
						<nuxt-link
							:to="domain"
						>
							financial-ombudsman.org.uk
						</nuxt-link>. PayPal Pay in 3: PayPal Pay in 3 is not regulated by
						the Financial Conduct Authority. Pay in 3 eligibility is
						subject to status and approval. 18+. UK residents only.
						Pay in 3 is a form of credit. Check if affordable and
						how you will repay. May make other borrowing more
						difficult or expensive. See product terms for more
						details.
					</p>
				</div>
			</div>
		</div>
		<div class="site-footer__content">
			<div class="site-container">
				<section class="site-footer__main">
					<nav class="site-footer__nav">
						<div
							v-for="item in list"
							:key="item.label"
							class="nav__column"
						>
							<div class="column-section">
								<h3
									class="site-footer__title column-section__title"
								>
									{{ item.label }}
								</h3>
								<ul class="column-section__list">
									<li
										v-for="c in item.children"
										:key="c.label"
										class="column-section__item"
									>
										<nuxt-link
											:to="c.src"
											class="column-section__link"
										>
											{{ c.label }}
										</nuxt-link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
					<div class="site-footer__aside">
						<div class="site-footer__follow">
							<h3 class="site-footer__title">
								{{ $t('Follow Us') }}
							</h3>
							<ul class="site-footer__follow-list">
								<li class="site-footer__follow-item">
									<nuxt-link
										class="site-footer__follow-link"
										to="https://www.facebook.com/"
									>
										<Icon name="icon:facebook" />
									</nuxt-link>
								</li>
								<li class="site-footer__follow-item">
									<nuxt-link
										class="site-footer__follow-link"
										to="https://www.youtube.com/"
									>
										<Icon name="icon:youtube" />
									</nuxt-link>
								</li>
								<li class="site-footer__follow-item">
									<nuxt-link
										class="site-footer__follow-link"
										to="https://www.instagram.com/"
									>
										<Icon name="icon:instagram" />
									</nuxt-link>
								</li>
								<li class="site-footer__follow-item">
									<nuxt-link
										class="site-footer__follow-link"
										to="https://www.twitter.com/"
									>
										<Icon name="icon:twitter" />
									</nuxt-link>
								</li>
								<li class="site-footer__follow-item">
									<nuxt-link
										class="site-footer__follow-link"
										to="https://www.tiktok.com/"
									>
										<Icon name="icon:tiktok" />
									</nuxt-link>
								</li>
							</ul>
						</div>
						<div class="site-footer__connect">
							<h3 class="site-footer__title">
								Enter your email address to subscribe to our
								newsletters
							</h3>
							<el-form
								ref="formRef"
								:show-message="false"
								:model="form"
								:rules="rules"
								class="site-footer__form"
							>
								<el-form-item
									class="site-footer__input"
									prop="email"
								>
									<input
										id="email"
										v-model="form.email"
										type="email"
										name="email"
										class="site-footer__email"
										:placeholder="$t('Enter email address')"
									>
									<button
										class="site-footer__submit"
										@click.prevent="submit"
									>
										<el-icon
											class="micon micon-forward submit__icon"
										/>
									</button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</section>
				<section class="site-footer__footer">
					<div class="site-footer__legal">
						Copyright © 2024 - 2034 iswink.All Rights Reserved
					</div>
					<div class="site-footer__settings">
						<nuxt-link :to="domain">
							Site Map
						</nuxt-link>
					</div>
				</section>
			</div>
		</div>
	</footer>
</template>
