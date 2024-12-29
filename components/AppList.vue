<script setup lang="ts">
defineOptions({
	name: 'AppList',
})

const props = defineProps({
	method: { type: Function, required: true },
	rowKey: { type: String },
})

const { data: data1, load, loading, reset } = useInfiteLoad(props.method, props.rowKey, false)
const { data: data2, pagination, resetData } = useTablePagination(props.method, false)
const appStore = useAppStore()
watch(() => appStore.isMobile, v => v && reset(), { immediate: true })
watch(() => appStore.isPC, v => v && resetData(), { immediate: true })
</script>

<template>
	<div v-if="appStore.isMobile">
		<ul v-infinite-scroll="load" :class="$attrs.class">
			<template v-for="(item, i) in data1" :key="item[props.rowKey] || i">
				<slot :row="item"></slot>
			</template>
			<el-empty v-if="!loading && !data1.length" :description="$t('No data')" />
		</ul>
	</div>
	<template v-if="appStore.isPC">
		<ul :class="$attrs.class">
			<template v-for="(item, i) in data2" :key="item[props.rowKey] || i">
				<slot :row="item"></slot>
			</template>
		</ul>
		<el-empty v-if="!data2.length" :description="$t('No data')" />
		<el-pagination
			v-if="pagination.total"
			v-model:current-page="pagination.currentPage"
			v-model:page-size="pagination.pageSize"
			:total="pagination.total"
			layout="prev,pager,next,jumper"
			class="mt-2"
		/>
	</template>
</template>
