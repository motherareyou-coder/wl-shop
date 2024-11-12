<script setup lang="ts">
import type { SignIn, SignInConfig } from '~/types'

const appStore = useAppStore()

definePageMeta({
	title: 'Sign in',
	showBread: true,
})

const { data, refresh } = await useAPI<SignIn>(
	'member/sign-in/record/get-summary',
)
const { data: steps } = await useAPI<SignInConfig[]>(
	'member/sign-in/config/list',
)
function signIn() {
	$api('member/sign-in/record/create', {
		method: 'post',
	}).then(refresh)
}
</script>

<template>
	<div class="user-signin">
		<div
			class="site-container-1400 mx-auto w-full bg-white mb-10"
			:class="[appStore.isPC ? 'p-12' : 'p-5']"
		>
			<h1 v-if="appStore.isPC" class="mt-0">
				{{ $t('Sign in') }}
			</h1>
			<p class="py-5 calendar flex justify-between">
				<span>
					{{ $t('Sign in calendar') }}
				</span>
				<span class="continuous-day">
					{{ $t('Have benn signed in for') }}
					<span>{{ data?.continuousDay }}</span>
					{{
						data?.continuousDay <= 0
							? $t('consecutive day')
							: $t('consecutive days')
					}}
				</span>
			</p>
			<div class="my-5 overflow-auto">
				<ul>
					<li
						v-for="(step, i) in steps"
						:key="i"
						:class="{ active: data.continuousDay > i }"
					>
						<span>
							{{
								`${$t('dayorder-pre')} ${step.day} ${$t(
									'dayorder-suf',
								)}`
							}}
						</span>
						<span>
							<el-icon><ElIconStarFilled /></el-icon>
						</span>
						<span> +{{ step.point }} </span>
					</li>
				</ul>
			</div>
			<div>
				<el-button
					type="info"
					:class="[appStore.isPC ? 'w-32' : 'w-full']"
					@click="signIn"
				>
					{{ $t('Sign in') }}
				</el-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-signin {
	.calendar {
		border-bottom: 1px solid var(--title-light);
		.continuous-day {
			color: var(--title-light);
			span {
				color: var(--mi-color-primary);
			}
		}
	}
	ul {
		li {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			&:not(:first-of-type) {
				margin-left: 20px;
			}
			.mi-icon {
				font-size: 24px;
			}
			> * {
				margin: 5px 0;
			}
			&.active {
				color: var(--mi-color-primary);
			}
		}
	}
}
</style>
