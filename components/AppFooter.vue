<script setup>
defineOptions({ name: 'AppFooter' })

const form = ref({ email: '' })
const rules = {
	email: [{ type: 'email' }],
}

const list = [
	{
		label: 'SUPPORT',
		children: [
			{ label: 'Mi Points FAQ', src: 'https://www.mi.com/uk/' },
			{ label: 'Where to Buy', src: 'https://www.mi.com/uk/' },
			{ label: 'Coupon Code', src: 'https://www.mi.com/uk/' },
			{ label: 'Trade-in', src: 'https://www.mi.com/uk/' },
		],
	},
	{
		label: 'ABOUT US',
		children: [
			{ label: 'Xiaomi', src: 'https://www.mi.com/uk/' },
			{ label: 'Leadership Team', src: 'https://www.mi.com/uk/' },
			{ label: 'Privacy Policy', src: 'https://www.mi.com/uk/' },
			{ label: 'Integrity & Compliance', src: 'https://www.mi.com/uk/' },
			{ label: 'Trust Centre', src: 'https://www.mi.com/uk/' },
			{ label: 'Xiaomi Accessibility', src: 'https://www.mi.com/uk/' },
		],
	},
	{
		label: 'CONTRACT US',
		children: [
			{ label: 'Twitter', src: 'https://www.mi.com/uk/' },
			{ label: 'Youtube', src: 'https://www.mi.com/uk/' },
			{ label: 'Facebook', src: 'https://www.mi.com/uk/' },
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
	<footer class="app-footer">
		<div class="container note">
			<div class="site-container">
				<p>
					<nuxt-link
						to="https://www.paypal.com/uk/webapps/mpp/paypal-virtual-credit/faq"
						target="_blank"
					>
						PayPal Credit
					</nuxt-link>
					and PayPal Pay in 3 are trading names of PayPal UK Ltd,
					Whittaker House, Whittaker Avenue, Richmond-Upon-Thames,
					Surrey, United Kingdom, TW9 1EH. PayPal Credit: Terms and
					conditions apply. Credit subject to status, UK residents
					only, Xiaomi Technology UK Limited is an appointed
					representative of Product Partnerships Limited for the
					purpose of credit broking. Product Partnerships Limited is
					authorised and regulated by the Financial Conduct Authority
					with registration 959828 and address Second Floor, Atlas
					House, 31 King Street, Leeds LS1 2HL. United Kingdom. Xiaomi
					Technology UK Limited acts as a credit broker not a lender.
					We do not receive any commission for introducing customers
					to
					<nuxt-link
						to="https://www.paypal.com/uk/webapps/mpp/paypal-virtual-credit/faq"
						target="_blank"
					>
						PayPal Credit
					</nuxt-link>. You may be able to obtain finance for your purchase from
					other lenders and you are encouraged to seek alternative
					quotations. If you would like to know how we handle
					complaints, please ask for a copy of our complaints handling
					process. You can also find information about referring a
					complaint to the Financial Ombudsman Service (FOS) at
					<nuxt-link
						to="http://financial-ombudsman.org.uk/"
						target="_blank"
					>
						financial-ombudsman.org.uk
					</nuxt-link>. PayPal Pay in 3: PayPal Pay in 3 is not regulated by the
					Financial Conduct Authority. Pay in 3 eligibility is subject
					to status and approval. 18+. UK residents only. Pay in 3 is
					a form of credit. Check if affordable and how you will
					repay. May make other borrowing more difficult or expensive.
					See product terms for more details.
				</p>
			</div>
		</div>
		<div class="container">
			<div class="site-container">
				<div class="main">
					<div class="nav">
						<div
							v-for="item in list"
							:key="item.label"
							class="nav__column"
						>
							<h3 class="title">
								{{ item.label }}
							</h3>
							<ul>
								<li v-for="c in item.children" :key="c.label">
									<nuxt-link :to="c.src" target="_blank">
										{{ c.label }}
									</nuxt-link>
								</li>
							</ul>
						</div>
					</div>
					<div class="aside">
						<div>
							<h3 class="title">
								Follow Us
							</h3>
							<ul class="follow-list">
								<li>
									<nuxt-link to="https://www.mi.com/uk/">
										<Icon name="icon:facebook" />
									</nuxt-link>
								</li>
								<li>
									<nuxt-link to="https://www.mi.com/uk/">
										<Icon name="icon:youtube" />
									</nuxt-link>
								</li>
								<li>
									<nuxt-link to="https://www.mi.com/uk/">
										<Icon name="icon:instagram" />
									</nuxt-link>
								</li>
								<li>
									<nuxt-link to="https://www.mi.com/uk/">
										<Icon name="icon:twitter" />
									</nuxt-link>
								</li>
								<li>
									<nuxt-link to="https://www.mi.com/uk/">
										<Icon name="icon:tiktok" />
									</nuxt-link>
								</li>
							</ul>
						</div>
						<div>
							<h3>
								Enter your email address to subscribe to our
								newsletters
							</h3>
							<el-form ref="formRef" :model="form" :rules="rules">
								<el-form-item label="">
									<el-input
										v-model="form.email"
										placeholder="Enter email address"
									>
										<template #suffix>
											<ElIcon @click="submit">
												<ElIconArrowRight />
											</ElIcon>
										</template>
									</el-input>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
				<div class="footer">
					<div class="legal">
						Copyright © 2010 - 2024 All Rights Reserved
					</div>
					<div>
						<nuxt-link to="https://www.mi.com/uk/" target="_blank">
							Site Map
						</nuxt-link>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<style scoped lang="scss">
.app-footer {
	--icon-size: 30px;
	.container {
		background-color: var(--background-black, #191919);
		--margin-vertical: 0;
		.main {
			flex-direction: row;
			padding-top: 64px;
			display: flex;
			justify-content: space-between;
			@media screen and (min-width: 721px) and (max-width: 1024px) {
				flex-direction: column-reverse;
				padding-top: 32px;
			}
			.nav {
				display: flex;
				flex-grow: 1;
				margin-inline-end: 50px;
				width: 100%;
				.nav__column {
					margin-inline-end: 16px;
					flex: 1 1;
					ul {
						padding: 0;
						margin: 0;
						li {
							padding: 0;
							margin: 0;
							color: var(--text-reverse);
							font-size: 16px;
							line-height: 20px;
							margin-bottom: 16px;
							list-style: none;
							a {
								color: var(--text-secondary, #898989);
								&:hover {
									color: var(--text-reverse);
									text-decoration: underline;
								}
							}
						}
					}
				}
			}
			.title {
				color: var(--text-reverse);
				font-size: 16px;
				line-height: 20px;
				margin: 0 0 16px;
			}
			.aside {
				color: var(--text-reverse);
				font-size: 16px;
				line-height: 20px;
				.follow-list {
					display: flex;
					li {
						margin-inline-end: 16px;
					}
					svg {
						padding: calc(var(--icon-size) / 6);
						box-sizing: border-box;
						border-radius: calc(var(--icon-size) / 3);
						color: #000;
						background-color: var(--brand-grey-40, #d0d0d0);
						width: var(--icon-size);
						height: var(--icon-size);
						line-height: 1;
					}
				}
				.el-input {
					--el-input-text-color: var(--text-reverse);
					--el-input-bg-color: transparent;
					.el-icon {
						cursor: pointer;
					}
				}
			}
		}
		.footer {
			flex-direction: row;
			font-size: 18px;
			line-height: 20px;
			margin-top: 64px;
			padding: 24px 0 38px;
			align-items: center;
			border-top: 1px solid #898989;
			border-top: 1px solid var(--border-base);
			box-sizing: border-box;
			display: flex;
			color: var(--text-reverse);
			.legal {
				margin-inline-end: 32px;
			}
		}
	}
	.note {
		font-size: 16px;
		--note-row-gap: 32px;
		--note-font-size: 12px;
		--footnote-padding-vertical: 48px;
		background-color: #ececec;
		color: #898989;
		color: var(--text-secondary);
		padding: var(--footnote-padding-vertical) 0;
		p {
			margin: 0;
			padding: 0;
			white-space: pre-line;
		}
		a {
			color: var(--brand-orange, #ff6900);
		}
	}
}
</style>
