<script setup>
defineOptions({ name: 'AppSearch' })

const show = defineModel()
const query = ref('')

const router = useRouter()
function goSearch() {
	router.push($path(`/product-list?query=${query.value}`))
	show.value = false
	query.value = ''
}
</script>

<template>
	<el-drawer
		v-model="show"
		direction="ttb"
		:show-close="false"
		append-to-body
	>
		<div class="search-base__container">
			<el-input
				v-model="query"
				class="search-input"
				clearable
				@keydown.enter="goSearch"
			>
				<template #prefix>
					<el-icon><ElIconSearch /></el-icon>
				</template>
			</el-input>
		</div>
	</el-drawer>
</template>

<style lang="scss">
@import url( './index.scss');
</style>
