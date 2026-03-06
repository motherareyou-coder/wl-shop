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
	return data.value?.sort((a, b) => a.type - b.type)?.map(d => ({ ...d, typeTitle: typeTitle[d.type] }))
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
			<button class="events-info__more" aria-label="more">
				<el-icon>
					<ElIconArrowRight />
				</el-icon>
			</button>
		</div>
		<section v-else class="product__section product__section-spacer offers-section">
			<ul class="offers-section__list">
				<li v-for="a in finalData" :key="a.typeTitle" class="offers-section__item">
					<picture class="clip-image-v4 offers-section__item-dot"><img src="@/assets/icons/dot.svg" :alt="a.name"></picture>
					<span>
						{{ a.typeTitle }}:
						{{ a.name }}
						<app-time :data="a.startTime" format="YYYY-MM-DD" />
						-
						<app-time :data="a.endTime" format="YYYY-MM-DD" />
						<!-- 秒杀 -->
						<nuxt-link
							v-if="a.type === 1" type="primary" class="offers-section__link"
							:to="$path(`/product/${id}?seckillActivityId=${a.id}`)"
						>
							{{ $t('learn more') }}
						</nuxt-link>
						<!-- 砍价 -->
						<nuxt-link
							v-if="a.type === 2" type="primary" class="offers-section__link"
							:to="$path(`/product/${id}?bargainActivityId=${a.id}`)"
						>
							{{ $t('learn more') }}
						</nuxt-link>
						<!-- 拼团 -->
						<nuxt-link
							v-if="a.type === 3" type="primary" class="offers-section__link"
							:to="$path(`/product/${id}?combinationActivityId=${a.id}`)"
						>
							{{ $t('learn more') }}
						</nuxt-link>
					</span>
				</li>
			</ul>
		</section>
	</template>
</template>
