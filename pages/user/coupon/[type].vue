<script setup>
import './index.scss'

const route = useRoute()
const type = route.params.type

const { t } = useI18n()

const selected = ref(type)

const tags = ref(['unused', 'used', 'expired', 'Use coupon code'])

const list = ref([
	{
		coupon_id: 6580638524,
		coupon_type_id: 18148,
		status_type: 1,
		start_time: '09/10/2024 17:36:30',
		end_time: '23/10/2024 17:36:30',
		coupon_value_desc: '￡250-￡20',
		coupon_name_desc: '￡250-￡20 | Smartphones',
		short_usebale_range_desc:
			'Can apply this coupon when you spend ￡250. Apply for all smartphones on mi.com/uk',
		start_time_timestamp: 1728491790,
		end_time_timestamp: 1729701390,
		custom_type: 0,
		is_online: true,
		go_app_link: '',
	},
])
</script>

<template>
	<section class="user-coupon">
		<div class="breadcrumbs-wrapper"></div>
		<div class="page-headings page-headings--has-children">
			<h1 class="page-headings__title">
				{{ t('Coupons') }}
			</h1>
		</div>
		<div class="user-coupon__tabs--wrapper">
			<div class="mi-tabs">
				<ul class="mi-tabs__header">
					<li
						v-for="t in tags"
						:key="t"
						class="mi-tabs__item mi-tabs__item--separator"
						:class="{ 'mi-tabs__item--active': selected === t }"
						@click="selected = t"
					>
						<div class="mi-tabs__item-content">
							{{ t }}
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="user-coupon__list--content">
			<ul class="user-coupon__list">
				<li
					v-for="c in list"
					:key="c.coupon_id"
					class="user-coupon__item--wrapper"
				>
					<div class="user-coupon__item in">
						<p class="user-coupon__item--name">
							{{ c.coupon_name_desc }}
						</p>
						<p class="user-coupon__item--value">
							{{ c.coupon_value_desc }}
						</p>
						<p class="user-coupon__item--time">
							{{ [c.start_time, c.end_time].join('-') }}
						</p>
						<p class="user-coupon__item--desc">
							<span>{{ c.short_usebale_range_desc }}</span>
						</p>
					</div>
					<div class="user-coupon__item--btn">
						<nuxt-link
							class="mi-btn user-coupon__btn"
						>
							<span class="mi-btn__text">{{ t('Use now') }}</span>
						</nuxt-link>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>
