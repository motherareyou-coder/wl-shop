<script setup lang="ts">
import type { ExperienceRecord, MemberLevel } from '~/types'

definePageMeta({
	title: 'Level',
	showBread: true,
})
const appStore = useAppStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)

const { data: steps } = await useAPI<MemberLevel>(
	'member/level/list',
)

function getData<ExperienceRecord>(params: any) {
	return $api<ExperienceRecord>('member/experience-record/page', {
		params,
	})
}
</script>

<template>
	<div class="user-level">
		<div
			class="site-container-1400 mx-auto w-full bg-white mb-10"
			:class="[appStore.isPC ? 'p-12' : 'p-5']"
		>
			<h1 v-if="appStore.isPC" class="mt-0">
				{{ $t('Level') }}
				V{{ user?.level?.level }}
			</h1>
			<el-scrollbar>
				<ul class="level-list whitespace-nowrap">
					<li
						v-for="(step, i) in steps"
						:key="step.level"
						:class="{
							active: user?.level?.level >= step.level,
						}"
					>
						<!--<span>{{-->
						<!--	`${step.discountPercent}% ${$t('off')}`-->
						<!--}}</span>-->
						<!--<app-image class="w-12 h-12 my-2" :src="step.icon" />-->
            <span>{{ step.name }}</span>
            <span>{{ step.experience }}</span>
            <el-tag class="tag__item">
              {{ step.discountPercent }}% off
            </el-tag>
            <span
							v-if="i !== steps.length - 1"
							class="experience"
						></span>
						<!--<span-->
						<!--	v-if="i !== steps.length - 1"-->
						<!--	class="experience"-->
						<!--&gt;{{ step.experience }}</span>-->
					</li>
				</ul>
			</el-scrollbar>
			<app-list :method="getData" row-key="">
				<template #default="{ row }: { row: ExperienceRecord }">
					<li class="record">
						<div>
							<span>{{ row.title }}</span>
							<span>{{ row.experience }} </span>
						</div>
						<div
							class="text-sm"
							:class="[
								appStore.isMobile ? 'flex-col-reverse' : '',
							]"
						>
							<span>{{ row.description }}</span>
							<app-time :data="row.createTime" />
						</div>
					</li>
				</template>
			</app-list>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-level:deep {
	ul.level-list {
		margin: 20px 0;
		li {
			position: relative;
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			opacity: 0.5;
			--gap-width: 10vw;
			&:not(:last-of-type) {
				margin-right: var(--gap-width);
			}
			@media screen and (max-width: 720px) {
				--gap-width: 50px;
			}
			.experience {
				margin: 0 calc(var(--gap-width) * 0.05);
				position: absolute;
				width: calc(var(--gap-width) * 0.9);
				left: 100%;
				top: 50%;
				transform: translateY(-100%);
				border-bottom: 1px solid var(--text-base);
				text-align: center;
				&::after {
					display: block;
					position: absolute;
					content: ' ';
					border: 5px solid var(--text-base);
					border-left-width: 10px;
					border-top-color: transparent;
					border-bottom-color: transparent;
					border-right-color: transparent;
					box-sizing: border-box;
					left: 100%;
					transform: translate(-50%, -50%);
				}
			}
			&.active {
				opacity: 1;
			}
		}
	}
	.record {
		margin-bottom: 10px;
		> div {
			display: flex;
			justify-content: space-between;
			> span:last-child {
				white-space: nowrap;
			}
			&:last-child {
				color: var(--title-light);
			}
		}
	}
}
</style>
