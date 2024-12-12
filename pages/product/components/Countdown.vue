<script setup lang="ts">
import type { BargainActivity, CombinationActivityDetail, SeckillActivity } from '~/types'

const now = ref(new Date().getTime())

const seckillActivity = inject('seckillActivity') as Ref<SeckillActivity>
const combinationActivity = inject('combinationActivity') as Ref<CombinationActivityDetail>
const bargainActivity = inject('bargainActivity') as Ref<BargainActivity>

const activity = computed(() =>
	seckillActivity.value
	|| combinationActivity.value
	|| bargainActivity.value,
)

const inTimerange = inject('inTimerange') as Ref<boolean>
watchEffect(() => {
	inTimerange.value = activity.value.startTime <= now.value && activity.value.endTime >= now.value
})

const { t } = useI18n()
const title = computed(() => {
	if (seckillActivity.value)
		return t('DAILY PICKS')
	if (combinationActivity.value)
		return t('拼团')
	if (bargainActivity.value)
		return t('砍价')
	return ''
})
</script>

<template>
	<div class="product-information__events-header">
		<div class="bar-items bar-items--yellow bar-items--daily-pick">
			<div class="bar-items__left">
				<p class="bar-items__title">
					{{ title }}
				</p>
			</div>
			<div v-if="activity.startTime > now" class="bar-items__countdown">
				<span class="bar-items__desc">{{ $t('Starts in') }}</span>
				<app-count-down class="bar-items__num" :end-time="activity.startTime" />
			</div>
			<div v-else-if="activity.endTime > now" class="bar-items__countdown">
				<span class="bar-items__desc">{{ $t('Ends in') }}</span>
				<app-count-down class="bar-items__num" :end-time="activity.endTime" />
			</div>
			<div v-else class="bar-items__countdown">
				<span class="bar-items__desc">{{ $t('已结束') }}</span>
			</div>
		</div>
	</div>
</template>
