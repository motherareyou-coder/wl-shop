<script setup lang="ts">
import type { Activity } from '~/types'

defineOptions({
	name: 'ActivityTag',
})

const props = defineProps({
	type: { type: Number },
	name: { type: String },
	isTag: { type: Boolean, default: true },
})

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
</script>

<template>
	<el-tag>
		<template v-if="props.type">
			{{ typeTitle[props.type] }}
		</template>
		<template v-else>
			{{ props.name }}
		</template>
	</el-tag>
</template>

<style scoped>

</style>
