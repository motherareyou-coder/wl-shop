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
	<div>
		<div v-if="appStore.isPC">
			<ul>
				<li v-for="(item, i) in data2" :key="item[props.rowKey] || i">
					<slot :row="item"></slot>
				</li>
			</ul>
			<el-pagination
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:total="pagination.total"
				layout="prev,pager,next,jumper"
				class="mt-2"
			/>
		</div>
		<div v-if="appStore.isMobile" v-infinite-scroll="load">
			<ul>
				<li v-for="(item, i) in data1" :key="item[props.rowKey] || i">
					<slot :row="item"></slot>
				</li>
			</ul>
		</div>
	</div>
</template>
