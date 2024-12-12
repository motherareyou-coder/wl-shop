<script setup lang="ts">
import type { BargainActivity, BargainHelp } from '~/types'

const bargainHelpList = inject('bargainHelpList') as Ref<BargainHelp[]>

const appStore = useAppStore()
</script>

<template>
	<div class="site-container w-full mx-auto">
		<section class="my-5" :class="[appStore.isPC ? 'p-5' : 'px-2']">
			<ul
				v-if="bargainHelpList?.length"
				class="bg-white"
				:class="[appStore.isPC ? 'p-5' : 'p-2']"
			>
				<li v-for="item in bargainHelpList" :key="item.id" class="my-2">
					<div v-if="appStore.isPC" class="flex items-center">
						<app-image :src="item.avatar || '/avatar.png'" class="w-12 h-12 rounded-full" />
						<span class="text-sm m-2">{{ item.nickname }}</span>
						<span class="m-2">{{ $t('已砍') }} </span>
						<product-price class="m-2" style="color:var(--mi-color-priamry)" :data="item.reducePrice" />
						<div class="text-sm m-2" style="color:var(--title-light)">
							<app-time :data="item.createTime" />
						</div>
					</div>
					<div v-if="appStore.isMobile" class="flex items-center justify-between">
						<div class="flex items-center">
							<app-image
								:src="item.avatar || '/avatar.png'"
								class="w-12 h-12 rounded-full"
							/>
							<div class="flex flex-col justify-between m-2">
								<div class="text-sm">
									{{ item.nickname }}
								</div>
								<div class="text-sm" style="color:var(--title-light)">
									<app-time :data="item.createTime" />
								</div>
							</div>
						</div>
						<div>
							<span class="mr-2">{{ $t('已砍') }} </span>
							<product-price style="color:var(--mi-color-priamry)" :data="item.reducePrice" />
						</div>
					</div>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped>

</style>
