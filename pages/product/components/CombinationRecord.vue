<script setup lang="ts">
import type { CombinationRecord } from '~/types'

const emit = defineEmits(['click'])
const activityId = inject('combinationActivityId') as number
const { data } = await useAPI<CombinationRecord[]>('promotion/combination-record/get-head-list', { params: { activityId, status: 0, count: 5 } })
function handleClick(a: CombinationRecord) {
	emit('click', { combinationHeadId: a.id })
}
</script>

<template>
	<section v-if="data?.length">
		<ul class="offers-section__list">
			<li v-for="a in data" :key="a.id" class="offers-section__item flex items-center ">
				<app-image :src="a.avatar" class="w-8 h-8 rounded-full mr-2" />
				<span>
					{{ $t("还差x人成团", { number: a.userCount }) }}
				</span>
				<span class="flex-1"></span>
				<el-link type="primary" class="justify-self-end" @click="handleClick(a)">
					{{ $t('去参加') }}
				</el-link>
			</li>
		</ul>
	</section>
</template>
