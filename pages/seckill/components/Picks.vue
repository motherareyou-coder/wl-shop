<script setup lang="ts">
import type {Product, SeckillActivity} from '~/types'

const props = defineProps({
  id: {type: Number},
  startTime: {type: String},
  endTime: {type: String},
})
const {data, load} = useInfiteLoad<SeckillActivity>(p =>
    $api('promotion/seckill-activity/page', {params: {configId: props.id, ...p}}))

const router = useRouter()

function handleClick(item: SeckillActivity) {
  router.push($path(`/product/${item.spuId}?seckillActivityId=${item.id}`))
}

const now = inject('now')
</script>

<template>
  <main v-infinite-scroll="load" class="daily-picks-area__main" role="grid">
    <div v-for="item in data" :key="item.id" class="daily-picks-area__list daily-picks-area__list--doing"
         @click="handleClick(item)">
      <div class="daily-picks-area__list-header">
        <div class="daily-picks-area__list-date">
          <strong>{{ `${$dayjs().date()} ${$dayjs().format('MMMM')}` }}</strong>
          <mark>{{ $t('Today') }}</mark>
        </div>
        <div v-if="props.startTime > now" class="daily-picks-area__list-status">
          {{ $t('Starts in') }}
          <app-count-down :end-time="props.startTime" class="mi-count-down mi-count-down--icon">
            <template #default="scope">
              <strong class="mi-count-down__time mi-count-down__time--hours">
                {{ scope.data.h }}
              </strong>
              <strong class="mi-count-down__colon mi-count-down__colon--hours">:</strong>
              <strong class="mi-count-down__time mi-count-down__time--minutes">
                {{ scope.data.m }}
              </strong>
              <strong class="mi-count-down__colon mi-count-down__colon--minutes">:</strong>
              <strong class="mi-count-down__time mi-count-down__time--seconds">
                {{ scope.data.s }}
              </strong>
            </template>
          </app-count-down>
        </div>
        <div v-if="props.endTime > now && props.startTime < now" class="daily-picks-area__list-status">
          {{ $t('Ends in') }}
          <app-count-down :end-time="props.endTime" class="mi-count-down mi-count-down--icon">
            <template #default="scope">
              <strong class="mi-count-down__time mi-count-down__time--hours">
                {{ scope.data.h }}
              </strong>
              <strong class="mi-count-down__colon mi-count-down__colon--hours">:</strong>
              <strong class="mi-count-down__time mi-count-down__time--minutes">
                {{ scope.data.m }}
              </strong>
              <strong class="mi-count-down__colon mi-count-down__colon--minutes">:</strong>
              <strong class="mi-count-down__time mi-count-down__time--seconds">
                {{ scope.data.s }}
              </strong>
            </template>
          </app-count-down>
        </div>
      </div>
      <div class="daily-picks-area__item">
        <article class="daily-picks-area__item-detail">
          <h4 class="daily-picks-area__item-title">
            {{ item.name }}
          </h4>
          <h6 class="daily-picks-area__item-subtitle">
            {{ item.desc }}
          </h6>
          <div class="mi-energy-label mi-energy-label--light daily-picks-area__item-energy">
            <div class="mi-energy-label__item">
              <nuxt-link class="mi-energy-label__link mi-energy-label__link--image">
                <img src="@/assets/imgs/E-level.png" class="mi-energy-label__image">
              </nuxt-link>
              <nuxt-link class="mi-energy-label__link mi-energy-label__link--info">
                {{ $t('Product information') }}
              </nuxt-link>
            </div>
          </div>
          <div class="daily-picks-area__item-spacer"></div>
          <div class="flex items-center">
            <span>{{ $t('limit') }}</span>
            <el-progress class="w-2/4 ml-2" :percentage="(100 * (item.totalStock / item.stock))/item.totalStock"
                         :text-inside="true" :stroke-width="20">
              {{ item.stock }}/{{ item.totalStock }}
            </el-progress>
          </div>
          <p class="daily-picks-area__item-info">
            {{ $t('节省') }}
            <product-price :data="item.marketPrice - item.seckillPrice"/>
          </p>
          <div class="mi-price daily-picks-area__item-price">
            <product-price :data="item.seckillPrice"/>
            <del class="notranslate">
              <product-price :data="item.marketPrice" plain/>
            </del>
          </div>
        </article>
        <div class="daily-picks-area__item-gap"></div>
        <aside class="daily-picks-area__item-images">
          <app-image class="daily-picks-area__item-main" :src="item.picUrl"/>
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
