<script setup>
import './index.scss'

defineOptions({name: 'AppFooter'})

const {t} = useI18n()
const {domain} = useRuntimeConfig().public
const form = ref({email: ''})
const rules = {
  email: [{type: 'email'}, {required: true}],
}

const list = [
  {
    label: $t('SUPPORT'),
    children: [
      {label: 'Points FAQ', src: $path('/articles/7')},
      {label: 'Sign FAQ', src: $path('/articles/8')},
      {label: 'Level of Member FAQ', src: $path('/articles/9')},
      {label: 'Discount FAQ', src: $path('/articles/10')},
    ],
  },
  {
    label: $t('SHOP AND PROMOTIONS'),
    children: [
      // {label: 'isWink', src: domain},
      {label: 'All Products', src: $path('/product-list')},
      {label: 'Daily Seckill', src: $path('/seckill')},
      {label: 'Group Buying Event', src: $path('/combination')},
      {label: 'Bargin Event', src: $path('/bargin')},
      {label: 'Coupon collection', src: $path('/coupon')},
    ],
  },
  {
    label: $t('FOLLOW US'),
    children: [
      {label: 'Twitter', src: 'https://www.twitter.com/'},
      {label: 'Youtube', src: 'https://www.youtube.com/'},
      {label: 'Facebook', src: 'https://www.facebook.com/'},
    ],
  },
]
const formRef = ref({
  email: ''
})

function submit() {
  formRef.value?.validate((v) => {
    if (!v)
      return ElMessage.info('The email address is invalid.')
    //提交数据到后台
    formRef.value.loading = true
    $api('crm/clue/create-email-subscription', {
      method: 'post',
      body: {email: form.value.email},
    }).then(() => {
      formRef.value.visible = false
      ElMessage.info(t('订阅成功'))
    }).finally(() => {
      formRef.value.loading = false
    })
  })

}
</script>

<template>
  <footer class="site-footer">
    <!--<div class="site-footer__footnote footnote">-->
    <!--  <div class="site-container">-->
    <!--    <div class="footnote__list site-footer__terms">-->
    <!--      <p class="footnote__item site-footer__payment-terms">-->
    <!--        <nuxt-link-->
    <!--            to="https://www.paypal.com/"-->
    <!--        >-->
    <!--          Payment Security:-->
    <!--        </nuxt-link>-->
    <!--        When making transactions using PayPal, you will enjoy a high level of security protection.-->
    <!--        <nuxt-link-->
    <!--            to="https://www.paypal.com/"-->
    <!--        >-->
    <!--          Fees Terms:-->
    <!--        </nuxt-link>-->
    <!--        Using PayPal may incur additional fees (such as currency conversion fees). We recommend confirming any relevant fees prior to completing your transaction.-->
    <!--        <nuxt-link-->
    <!--            :to="domain"-->
    <!--        >-->
    <!--          Refund Policy:-->
    <!--        </nuxt-link>-->
    <!--        If you have any disputes regarding a transaction or need a refund, please follow our website's refund policy and promptly contact our customer support team.-->
    <!--        <nuxt-link-->
    <!--            :to="domain"-->
    <!--        >-->
    <!--          Information Protection:-->
    <!--        </nuxt-link>-->
    <!--        When making payments through PayPal, please be cautious in protecting your account information. We do not collect or store your PayPal account information.-->
    <!--        <nuxt-link-->
    <!--            :to="domain"-->
    <!--        >-->
    <!--          Transaction Restrictions:-->
    <!--        </nuxt-link>-->
    <!--        Certain regions or countries may have restrictions on making payments via PayPal, and we are not responsible for these limitations.-->
    <!--        <nuxt-link-->
    <!--            :to="domain"-->
    <!--        >-->
    <!--          Compliance with Laws:-->
    <!--        </nuxt-link>-->
    <!--        When making transactions using PayPal, you are required to comply with the relevant laws and regulations of your country/region.-->
    <!--      </p>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</div>-->
    <div class="site-footer__content">
      <div class="site-container">
        <section class="site-footer__main">
          <nav class="site-footer__nav">
            <div
                v-for="item in list"
                :key="item.label"
                class="nav__column"
            >
              <div class="column-section">
                <h3
                    class="site-footer__title column-section__title"
                >
                  {{ item.label }}
                </h3>
                <ul class="column-section__list">
                  <li
                      v-for="c in item.children"
                      :key="c.label"
                      class="column-section__item"
                  >
                    <nuxt-link
                        :to="c.src"
                        class="column-section__link"
                    >
                      {{ c.label }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div class="site-footer__aside">
            <div class="site-footer__follow">
              <h3 class="site-footer__title">
                {{ $t('Follow Us') }}
              </h3>
              <ul class="site-footer__follow-list">
                <li class="site-footer__follow-item">
                  <nuxt-link
                      class="site-footer__follow-link"
                      to="https://www.facebook.com/"
                  >
                    <Icon name="icon:facebook"/>
                  </nuxt-link>
                </li>
                <li class="site-footer__follow-item">
                  <nuxt-link
                      class="site-footer__follow-link"
                      to="https://www.youtube.com/"
                  >
                    <Icon name="icon:youtube"/>
                  </nuxt-link>
                </li>
                <li class="site-footer__follow-item">
                  <nuxt-link
                      class="site-footer__follow-link"
                      to="https://www.instagram.com/"
                  >
                    <Icon name="icon:instagram"/>
                  </nuxt-link>
                </li>
                <li class="site-footer__follow-item">
                  <nuxt-link
                      class="site-footer__follow-link"
                      to="https://www.twitter.com/"
                  >
                    <Icon name="icon:twitter"/>
                  </nuxt-link>
                </li>
                <li class="site-footer__follow-item">
                  <nuxt-link
                      class="site-footer__follow-link"
                      to="https://www.tiktok.com/"
                  >
                    <Icon name="icon:tiktok"/>
                  </nuxt-link>
                </li>
              </ul>
            </div>
            <div class="site-footer__connect">
              <h3 class="site-footer__title">
                Enter your email address to subscribe to our
                newsletters
              </h3>
              <el-form
                  ref="formRef"
                  :show-message="false"
                  :model="form"
                  :rules="rules"
                  class="site-footer__form"
              >
                <el-form-item
                    class="site-footer__input"
                    prop="email"
                >
                  <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      name="email"
                      class="site-footer__email"
                      :placeholder="$t('Enter email address')"
                  >
                  <button
                      class="site-footer__submit"
                      @click.prevent="submit"
                  >
                    <el-icon
                        class="micon micon-forward submit__icon"
                    />
                  </button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </section>
        <section class="site-footer__footer">
          <div class="site-footer__legal">
            Copyright © 2024 - 2034 iswink.All Rights Reserved
          </div>
          <!--<div class="site-footer__settings">-->
          <!--  <nuxt-link :to="domain">-->
          <!--    Site Map-->
          <!--  </nuxt-link>-->
          <!--</div>-->
        </section>
      </div>
    </div>
  </footer>
</template>
