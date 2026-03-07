<script setup lang="ts">
import { chunk } from 'lodash-es'
import type { ProductSpu } from '~/types'

const { t } = useI18n()

// 使用异步数据加载，避免阻塞渲染
const { data: specialList, pending } = await useAPI<ProductSpu[]>(
	'product/spu/get-main-show-spu',
	{
		params: { count: 6 },
		lazy: false,
		dedupe: 'defer',
	}
)

const finalData = computed(() => {
	if (!specialList.value) return []
	return chunk(specialList.value, 3)
})

const router = useRouter()
function handleClick(d: ProductSpu) {
	router.push($path(`/product/${d.id}`))
}
</script>

<template>
	<div class="special-offers">
		<section class="site-grid site-grid--none site-grid--full" role="grid">
			<div class="store-title-box store-title--dark">
				<div class="store-title-flex store-title-flex--center">
					<div class="store-title__content">
						<h2 class="store-title store-title--center store-title--default">
							{{ $t('Special offers') }}
						</h2>
					</div>
				</div>
			</div>
		</section>
		
		<!-- 加载状态 -->
		<div v-if="pending" class="special-skeleton">
			<div class="skeleton-grid">
				<div v-for="i in 6" :key="i" class="skeleton-card">
					<div class="skeleton-image" />
					<div class="skeleton-info">
						<div class="skeleton-title" />
						<div class="skeleton-price" />
					</div>
				</div>
			</div>
		</div>
		
		<template v-else>
			<section v-for="(children, j) in finalData" :key="j" class="site-grid--vertical-100 site-grid site-grid--store-small-special site-grid--special-half-quarter">
				<section v-for="(d, i) in children" :key="d.id" class="store-goods" :class="[i % 3 === 0 ? 'store-goods--half' : 'store-goods--quarter']" @click="handleClick(d)">
					<div class="store-goods__wrapper">
						<div class="store-goods__info">
							<div class="store-goods__info--upper">
								<div class="store-goods__title">
									<nuxt-link :to="$path(`/product/${d.id}`)">
										{{ d.name }}
									</nuxt-link>
								</div>
								<span v-if="i % 3 === 0" class="store-goods__subtitle" style="color: rgb(255, 105, 0);">
									{{ d.introduction }}
								</span>
								<div class="mi-marketing-label__tags store-goods__tag-list">
									<ul class="tag__list">
										<el-tag v-if="d.marketPrice != d.price" class="tag__item">
											{{ Math.ceil(100 * (d.marketPrice - d.price) / d.marketPrice) }}% off
										</el-tag>
									</ul>
								</div>
							</div>
							<div class="store-goods__info--lower">
								<div class="mi-price store-goods__price">
									<product-price :data="d.price" />
									<del v-if="d.marketPrice != d.price" class="notranslate">
										<product-price :data="d.marketPrice" plain />
									</del>
								</div>
							</div>
						</div>
						<div class="store-goods__product">
							<NuxtImg :src="d.picUrl" :alt="d.name" loading="lazy" preset="product" />
						</div>
					</div>
				</section>
			</section>
		</template>
	</div>
</template>

<style lang="scss">
@import url('./AppSpecial.scss');
</style>

<style lang="scss" scoped>
.special-offers {
	width: 100%;
}

.special-skeleton {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
	
	.skeleton-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}
	
	.skeleton-card {
		background: #f5f5f5;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.skeleton-image {
		height: 200px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}
	
	.skeleton-info {
		padding: 16px;
	}
	
	.skeleton-title {
		height: 20px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
		margin-bottom: 12px;
	}
	
	.skeleton-price {
		height: 24px;
		width: 80px;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
		border-radius: 4px;
	}
}

@keyframes loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
</style>
