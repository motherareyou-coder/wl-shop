<script setup lang="ts">
import type { Activity } from '~/types'

const id = inject('id')
const { data } = await useAPI<Activity[]>(
	'promotion/activity/list-by-spu-id?apifoxApiId=218974336',
	{ params: { spuId: id } },
)
</script>

<template>
	<ul>
		<li v-for="a in data" :key="a.id">
			{{ `${a.type} ${a.name} ${a.startTime} - ${a.endTime}` }}
		</li>
	</ul>
</template>

<style lang="scss" scoped>
li {
	margin: 5px 0;
	font-size: 12px;
	color: var(--title-light);
	overflow: hidden;
	position: relative;
	@media screen and (max-width: 720px) {
		font-size: 16px;
	}
	@media screen and (min-width: 721px) {
		padding-left: 12px;
		&::before {
			content: ' ';
			display: block;
			position: absolute;
			left: 0;
			width: 6px;
			height: 6px;
			top: 5px;
			background-color: var(--mi-color-primary);
		}
	}
}
ul.overflow-hidden {
	li {
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>
