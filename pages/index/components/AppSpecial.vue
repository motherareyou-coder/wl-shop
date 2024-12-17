<script setup lang="ts">
import { chunk } from 'lodash-es'
import type { ProductSpu } from '~/types'
import './AppSpecial.scss'

const { data: specialList } = await useAPI<ProductSpu[]>('product/spu/get-main-show-spu', { params: { count: 6 } })

const finalData = computed(() => chunk(specialList.value, 3))

const router = useRouter()
function handleClick(d: ProductSpu) {
	router.push($path(`/product/${d.id}`))
}
</script>

<template>
	<section class="site-grid site-grid--none site-grid--full " role="grid">
		<div class="store-title-box store-title--dark">
			<div class="store-title-flex store-title-flex--center">
				<div class="store-title__content">
					<h2 class="store-title store-title--center store-title--default">
						Xiaomi Black Friday Special offers
					</h2>
				</div>
			</div>
		</div>
	</section>
	<section v-for="(children, j) in finalData" :key="j" class="site-grid--vertical-100 site-grid site-grid--store-small-special site-grid--special-half-quarter ">
		<section v-for="(d, i) in children" :key="d.id" class="store-goods " :class="[i % 3 === 0 ? 'store-goods--half' : 'store-goods--quarter']" @click="handleClick(d)">
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
								<el-tag	v-if="d.marketPrice != d.price" class="tag__item">
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
					<app-image :src="d.picUrl" />
				</div>
			</div>
		</section>
	</section>
</template>

<style scoped>

</style>
