<script setup lang="ts">
import type {AfterSale} from '~/types'

definePageMeta({
  showBread: true,
  title: 'AfterSale Detail',
})
useHead({
  title: `${$t('AfterSale Detail')} ${$t('appTitle')}`,
})

const route = useRoute()
const id = route.params.id
const {data, refresh} = await useAPI<AfterSale>(
    'trade/after-sale/get',
    {params: {id}},
)

const {data: componies} = await useAPI<{ id: number, name: string }[]>(
    'trade/delivery/express/list',
)

const visible = ref(false)
const form = ref({
  id: data.value?.id,
  logisticsId: null,
  logisticsNo: '',
})
const formRef = ref()

function handleShow() {
  if (data.value?.logisticsNo)
    return
  visible.value = true
}

const loading = ref(false)

function handleConfirm() {
  formRef.value?.validate((v) => {
    if (!v)
      return
    loading.value = true
    $api('trade/after-sale/delivery', {
      method: 'put',
      body: form.value,
    })
        .then(() => {
          visible.value = false
          refresh()
        })
        .finally(() => {
          loading.value = false
        })
  })
}

const {t} = useI18n()

function handleCancel() {
  ElMessageBox.confirm(
      t('Are you confirm to cancel?'),
      {confirmButtonClass: 'mi-button--info'},
  ).then(() => {
    loading.value = true
    $api('trade/after-sale/cancel', {
      method: 'delete',
      params: {id},
    })
        .then(refresh)
        .finally(() => {
          loading.value = false
        })
  })
}

const appStore = useAppStore()
</script>

<template>
  <div class="aftersale-detail-contianer">
    <div
        :class="[
				appStore.isPC
					? 'site-container-1400 bg-white mb-10 mx-auto w-full p-10'
					: '',
			]"
    >
      <section class="aftersale-steps bg-white py-2">
        <el-steps
            :active="data?.status"
            finish-status="success"
            process-status="success"
            align-center
        >
          <el-step :title="$t('SubmitAfterSale')"/>
          <el-step :title="$t('Processing')"/>
          <el-step :title="$t('Done')"/>
        </el-steps>
      </section>
      <section
          v-if="data && data.logisticsNo"
          class="my-2 bg-white p-4"
      >
        <p>{{ $t('AfterSale logisticsNo') }}: {{ data.logisticsNo }}</p>
      </section>
      <section
          v-if="data && (data.status === 20 || data.status === 30)"
          class="my-2 bg-white p-4"
      >
        <div
            class="flex justify-between items-center cursor-pointer"
            @click="handleShow"
        >
          <div>
            <div class="mb-2">
              {{ $t('Please fill in the return logistics information.') }}
            </div>
            <div class="text-slate-400 text-sm">
              <app-time :data="data?.deliveryTime"/>
            </div>
          </div>
          <div>
            <el-icon>
              <ElIconArrowRight/>
            </el-icon>
          </div>
        </div>
      </section>
      <section v-if="data" class="my-2 bg-white p-4">
        <div class="flex">
          <nuxt-link
              class="flex mr-5"
              :to="$path(`/product/${data.id}`)"
          >
            <app-image class="h-20 w-20" :src="data.picUrl"/>
          </nuxt-link>
          <div class="flex flex-col justify-between flex-1">
						<span style="color: #000">
							{{ data.spuName }}
						</span>
            <span class="text-xs" style="color: #b4b4be">
							{{
                data.properties
                    ?.map((p) => p.valueName)
                    .join(' ')
              }}
						</span>
            <span class="text-xs">
							<ProductPrice :data="data.payPrice"/>
							<span style="color: #b4b4be">
								{{ ` x ${data.count}` }}
							</span>
						</span>
          </div>
        </div>
      </section>
      <section class="my-2 bg-white p-4">
        <ul>
          <li class="flex justify-between my-1">
						<span class="whitespace-nowrap">
							{{ $t('Refund price') }}
						</span>
            <span class="break-all ml-2 text-right"><ProductPrice :data="data?.refundPrice"/></span>
          </li>
          <li class="flex justify-between my-1">
						<span class="whitespace-nowrap">
							{{ $t('Refund Order No') }}
						</span>
            <span class="break-all ml-2 text-right">{{ data?.no }}</span>
          </li>
          <li class="flex justify-between my-1">
						<span class="whitespace-nowrap">
							{{ $t('Apply time') }}
						</span>
            <span class="break-all ml-2 text-right">
							<app-time :data="data?.createTime"/>
						</span>
          </li>
          <li class="flex justify-between my-1">
						<span class="whitespace-nowrap">
							{{ $t('Apply reason') }}
						</span>
            <span class="break-all ml-2 text-right">
							{{ data?.applyReason }}
						</span>
          </li>
          <li class="flex justify-between my-1">
						<span class="whitespace-nowrap">
							{{ $t('Apply description') }}
						</span>
            <span class="break-all ml-2 text-right">
							{{ data?.applyDescription }}
						</span>
          </li>
        </ul>
      </section>
      <section
          v-if="data?.status < 2"
          class="py-2 px-4 my-2"
          :class="[
					appStore.isMobile
						? 'order-action-container sticky bottom-0 bg-white'
						: '',
				]"
      >
        <div class="flex justify-end">
          <el-button
              type="info"
              :style="appStore.isPC ? 'border-radius:0' : ''"
              :disabled="loading"
              @click="handleCancel"
          >
            {{ $t('Cancel') }}
          </el-button>
        </div>
      </section>
    </div>
    <app-modal v-model="visible" direction="btt">
      <el-form
          ref="formRef"
          :model="form"
          :show-message="false"
          hide-required-asterisk
      >
        <el-form-item
            prop="logisticsId"
            :label="$t('Logistics company')"
            :rules="{ required: true }"
        >
          <el-select v-model="form.logisticsId">
            <el-option
                v-for="o in componies"
                :key="o.id"
                :label="o.name"
                :value="o.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
            prop="logisticsNo"
            :label="$t('Tracking number')"
            :rules="{ required: true }"
        >
          <el-input v-model="form.logisticsNo" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
            type="info"
            class="w-full"
            :disabled="loading"
            @click="handleConfirm"
        >
          {{ $t('Confirm') }}
        </el-button>
      </template>
    </app-modal>
  </div>
</template>

<style lang="scss">
.aftersale-detail-contianer {
  .aftersale-steps {
    --mi-color-success: var(--mi-text-color-primary);

    .mi-step__icon {
      width: 16px;
      height: 16px;
    }

    .mi-step__title {
      font-size: 12px;
    }

    .mi-step__line {
      top: 7px;
    }

    .mi-step__icon-inner {
      // display: none;
    }

    .mi-step__icon {
      .mi-icon {
        font-size: 12px;
      }
    }

    .is-success .mi-step__icon {
    }
  }
}

.order-action-container {
  box-shadow: 0 -2px 4px 0 rgba(25, 25, 25, 0.08);
}
</style>
