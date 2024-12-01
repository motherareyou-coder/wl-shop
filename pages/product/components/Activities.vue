<script setup lang="ts">
import type { Activity } from '~/types'

const props = defineProps({
	collapse: { type: Boolean, default: false },
})
const emit = defineEmits(['click'])
const id = inject('id')
const { data } = await useAPI<Activity[]>(
	'promotion/activity/list-by-spu-id',
	{ params: { spuId: id } },
)

const typeTitle = {
	1: $t('秒杀'),
	2: $t('砍价'),
	3: $t('拼团'),
	4: $t('限时折扣'),
	5: $t('满减送'),
	6: $t('会员折扣'),
	7: $t('优惠劵'),
	8: $t('积分'),
}

const finalData = computed(() => {
	return [1, 2, 3, 4, 5, 6, 7, 8].map(type => ({
		typeTitle: typeTitle[type],
		data: data.value?.filter(d => d.type === type) || [],
	})).filter(d => d.data.length)
})
</script>

<template>
	<template v-if="data?.length">
		<div v-if="props.collapse" class="events-info__container" @click="emit('click')">
			<ul class="events-info__list flex">
				<li v-for="a in data" :key="a.id" class="mr-1 mb-1">
					<el-tag>{{ a.name }}</el-tag>
				</li>
			</ul>
			<button class="events-info__more">
				<el-icon><ElIconArrowRight /></el-icon>
			</button>
		</div>
		<section v-else class="product__section product__section-spacer offers-section">
			<ul v-for="tData in finalData" :key="tData.typeTitle" class="offers-section__list">
				<li class="offers-section__item type-dot">
					{{ tData.typeTitle }}
				</li>
				<li v-for="a in tData.data" :key="a.id" class="offers-section__item">
					{{ a.name }}
					<app-time :data="a.startTime" />
					-
					<app-time :data="a.endTime" />
				</li>
			</ul>
		</section>
	</template>
</template>

<style lang="scss" scoped>
.offers-section__item{
	padding-left: 1rem !important;
}
.type-dot {
	position: relative;
	&::before {
		content: ' ';
		display: block;
		position: absolute;
		left: 0;
		width: 6px;
		height: 6px;
		top: 50%;
		transform: translateY(-50%);
		background-color: var(--mi-color-primary);
	}
}
</style>
