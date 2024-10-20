<script setup>
import './index.scss'

defineOptions({ name: 'AppSearch' })

const show = defineModel()
const query = ref('')
</script>

<template>
	<div class="search-modal" :class="[show ? 'search-modal--show' : 'search-modal--hidden']" @click="show = false">
		<div class="search-base" @click.stop>
			<div class="search-base__container">
				<el-input v-model="query" class="search-input" clearable>
					<template #prefix>
						<el-icon><ElIconSearch /></el-icon>
					</template>
				</el-input>
			</div>
		</div>
	</div>
</template>
