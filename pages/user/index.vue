<script setup>
import BgImg from '@/assets/imgs/user-center-bg.jpg'
import './index.scss'

const user = ref({
	nickname: '8268540278',
	headimgurl:
		'https://i02.appmifile.com/815_operatorx_operatorx_opx/24/11/2021/3ca208cec434b2f128fb21b7cf9cb5e6.png',
	sex: '',
	birthdayMonth: 0,
	birthdayDay: 0,
	uid: 8268540278,
	phone: '',
	email: 'linchuo****@outlook.com',
	password: '',
	showBirthday: true,
	security: 2,
	fbid: '',
	greeting_message: 'Good Morning',
	is_agreed_tc: false,
	isLimitBirthdayUpdateFrequency: true,
	nextEditBirthdayTimestamp: 31507200,
	nextEditBirthdayTime: '31/12/1970 17:00:00',
	isAllowUpdateBirthInfo: true,
})

const linkList = [
	{
		sequence: 0,
		type: 1,
		title: $t('My Orders'),
		tips: 'Track, modify, or cancel an order or make a return or review',
		icon: 'https://i05.appmifile.com/102_operatorx_operatorx_opx/06/06/2024/f49e629f0207ee1bccb2fbd9b7712318.png',
		icon_desc: '',
		url: '/user/orderlist',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/102_operatorx_operatorx_opx/06/06/2024/f49e629f0207ee1bccb2fbd9b7712318.png',
		pc_url: 'https://ams.buy.mi.com/uk/user/order',
		class_name: '',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('Coupons'),
		tips: 'View your Coupons redeem',
		icon: 'https://i05.appmifile.com/791_operatorx_operatorx_opx/06/06/2024/e1b8a664a4b5df21bc0977b135892354.png',
		icon_desc: '',
		url: '/user/coupon',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/791_operatorx_operatorx_opx/06/06/2024/e1b8a664a4b5df21bc0977b135892354.png',
		pc_url: '/user/coupon',
		class_name: 'coupons',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('Mi Club'),
		tips: 'Shopping to earn and redeem for coupons',
		icon: 'https://i05.appmifile.com/143_operatorx_operatorx_opx/06/06/2024/d1a5a49897e12ddf746db4461c696812.png',
		icon_desc: '',
		url: 'https://mobile.mi.com/uk/user/mi-club',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/143_operatorx_operatorx_opx/06/06/2024/d1a5a49897e12ddf746db4461c696812.png',
		pc_url: '/user/mi-club',
		class_name: '',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('Address Book'),
		tips: 'Manager your address for delivery',
		icon: 'https://i05.appmifile.com/87_operatorx_operatorx_opx/06/06/2024/de057751b5b6119d34a827cc57f55f79.png',
		icon_desc: '',
		url: '/user/address',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/87_operatorx_operatorx_opx/06/06/2024/de057751b5b6119d34a827cc57f55f79.png',
		pc_url: '/user/address',
		class_name: 'address_manager',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('Notifications Preferences'),
		tips: 'Manager your push, email and messages',
		icon: 'https://i05.appmifile.com/61_operatorx_operatorx_opx/06/06/2024/2f0829882fd50a98858aedbc203ed39e.png',
		icon_desc: '',
		url: '/user/notification-preferences',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/61_operatorx_operatorx_opx/06/06/2024/2f0829882fd50a98858aedbc203ed39e.png',
		pc_url: 'https://ams.buy.mi.com/uk/user/preferences',
		class_name: '',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('My Account'),
		tips: 'Signing in and security or reset password',
		icon: 'https://i05.appmifile.com/681_operatorx_operatorx_opx/06/06/2024/ebccf17dd62553652278d76353868aa4.png',
		icon_desc: '',
		url: 'https://account.xiaomi.com/fe/service/account?bizFlag=mi_i18n_global',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/681_operatorx_operatorx_opx/06/06/2024/ebccf17dd62553652278d76353868aa4.png',
		pc_url: 'https://account.xiaomi.com/fe/service/account?bizFlag=mi_i18n_global',
		class_name: '',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('My Reviews'),
		tips: 'Share your opinions about products features or your own feelings',
		icon: 'https://i05.appmifile.com/656_operatorx_operatorx_opx/06/06/2024/82fc1f0e03bdd22014ccfa62a0ca722c.png',
		icon_desc: '',
		url: '',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/656_operatorx_operatorx_opx/06/06/2024/82fc1f0e03bdd22014ccfa62a0ca722c.png',
		pc_url: 'https://ams.buy.mi.com/uk/comment/myreview',
		class_name: '',
		class_value: '',
	},
	{
		sequence: 0,
		type: 1,
		title: $t('F-code'),
		tips: '',
		icon: 'https://i05.appmifile.com/843_operatorx_operatorx_opx/06/06/2024/d4f9359112e712e9519a61e0fe05c389.png',
		icon_desc: '',
		url: '/user/f-code',
		login: true,
		pc_icon:
			'https://i05.appmifile.com/843_operatorx_operatorx_opx/06/06/2024/d4f9359112e712e9519a61e0fe05c389.png',
		pc_url: '/user/f-code',
		class_name: '',
		class_value: '',
	},
]

const appStore = useAppStore()
</script>

<template>
	<div class="user-center__container">
		<section
			class="user-account__overview"
			:style="{ 'background-image': `url(${BgImg})` }"
		>
			<main class="account-overview-main">
				<section class="overview-main">
					<div class="account-info-block">
						<section class="account-avatar-wrapper">
							<app-image
								class="account-avatar"
								:src="user.headimgurl"
							/>
						</section>
						<div class="info-box">
							<ul class="info-box__list">
								<li class="info-box__item greetings">
									{{ user.greeting_message }},
									{{ user.nickname }}
								</li>
								<li class="info-box__item email">
									{{ user.email }}
								</li>
							</ul>
							<a class="edit-info__link">
								<span>
									{{ $t('Edit information') }}
								</span>
								<el-icon class="icon-forward">
									<ElIconArrowRight />
								</el-icon>
							</a>
						</div>
					</div>
				</section>
			</main>
		</section>
		<section
			v-if="appStore.isMobile"
			class="user-account__orders user-center__section"
		>
			<div class="orders__header">
				<span class="container__title">{{ $t('My orders') }}</span>
				<a
					href="//ams-m.buy.mi.com/uk/user/orderlist/"
					class="mi-btn mi-btn--link mi-btn--normal mi-btn--light mi-btn--arrow-pc mi-btn--arrow-m more-order__link"
					style="display: flex !important;"
				>
					<span class="mi-btn__text">{{ $t('All orders') }}</span>
					<i class="micon micon-link-arrow"></i>
				</a>
			</div>
			<section
				class="orders-swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-free-mode"
			>
				<ul
					class="swiper-wrapper orders-nav"
					style="transform: translate3d(0px, 0px, 0px)"
				>
					<li
						class="swiper-slide orders-nav__item swiper-slide-active"
						style="width: 107.75px"
					>
						<a
							href="https://ams-m.buy.mi.com/uk/user/orderlist/?type=7"
						>
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/321_operatorx_operatorx_opx/09/12/2021/51e6d2dc6305cc3250d71be3fad1c40c.png"
								alt="Unpaid"
							>
							<span class="orders-item__title">Unpaid</span>
						</a>
					</li>
					<li
						role="row"
						class="swiper-slide orders-nav__item swiper-slide-next"
						style="width: 107.75px"
					>
						<a
							href="https://ams-m.buy.mi.com/uk/user/orderlist/?type=8"
						>
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/614_operatorx_operatorx_opx/09/12/2021/9f29b095aee59d25f488324878e80f31.png"
								alt="Shipping"
							>
							<span class="orders-item__title">Shipping</span>
						</a>
					</li>
					<li
						role="row"
						class="swiper-slide orders-nav__item"
						style="width: 107.75px"
					>
						<a
							href="https://ams-m.buy.mi.com/uk/user/reviewsappredirect/"
						>
							<img
								class="orders-nav__icon"
								src="https://i02.appmifile.com/213_operatorx_operatorx_opx/09/12/2021/bdfa2888681dc590f4e20ee6545549b2.png"
								alt="Reviews"
							>
							<span class="orders-item__title">Reviews</span>
						</a>
					</li>
				</ul>
			</section>
		</section>
		<section class="use-center-nav__entries user-center__section">
			<nuxt-link
				v-for="l in linkList"
				:key="l.type"
				class="use-center-nav__item"
				:to="$path(l.url)"
			>
				<img class="entries-icon" :src="l.icon">
				<p class="entries-item__title">
					{{ l.title }}
				</p>
				<p class="entries-item__desc">
					{{ l.tips }}
				</p>
				<el-icon class="icon-forward">
					<ElIconArrowRight />
				</el-icon>
			</nuxt-link>
		</section>
	</div>
</template>
