<script setup lang="ts">
import type { CombinationRecordDetail } from '~/types'

const props = defineProps({
	id: { type: Number },
})

const { data } = await useAPI<CombinationRecordDetail>('promotion/combination-record/get-detail', { params: { id: props.id } })
</script>

<template>
	<div v-if="data">
		<div v-for="item in data.memberRecords" :key="item.avatar" class="">
			<app-image :src="item.avatar" class="w-12 h-12 inline-block rounded-full" :alt="item.spuName"/>
		</div>
	</div>
</template>
