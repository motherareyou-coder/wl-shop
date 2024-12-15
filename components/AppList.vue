<script setup lang="ts">
defineOptions({
	name: 'AppList',
})

const props = defineProps({
	method: { type: Function, required: true },
	rowKey: { type: String },
})

const { data: data1, load } = useInfiteLoad(props.method, props.rowKey)
const { data: data2, pagination, resetData } = useTablePagination(props.method)
const appStore = useAppStore()
</script>

<template>
	<template v-if="appStore.isPC">
		<ul :class="$attrs.class">
			<template v-for="(item, i) in data2" :key="item[props.rowKey] || i">
				<slot :row="item"></slot>
			</template>
		</ul>
		<el-pagination
			v-if="pagination.total"
			v-model:current-page="pagination.currentPage"
			v-model:page-size="pagination.pageSize"
			:total="pagination.total"
			layout="prev,pager,next,jumper"
			class="mt-2"
		/>
	</template>
	<div v-if="appStore.isMobile" v-infinite-scroll="load">
		<ul :class="$attrs.class">
			<template v-for="(item, i) in data1" :key="item[props.rowKey] || i">
				<slot :row="item"></slot>
			</template>
		</ul>
	</div>
</template>
