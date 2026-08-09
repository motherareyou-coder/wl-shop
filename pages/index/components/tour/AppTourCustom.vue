<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { tourCases } from '~/config/tour-cases'

defineOptions({ name: 'AppTourCustom' })

// 行程类型卡片（静态）
const tripTypes = [
	{
		icon: 'icon:shop',
		titleKey: 'tour.custom.type.business',
		titleFallback: '商务出行',
		descKey: 'tour.custom.type.businessDesc',
		descFallback: '高端商务接待与会议行程安排',
	},
	{
		icon: 'icon:user',
		titleKey: 'tour.custom.type.family',
		titleFallback: '家庭旅行',
		descKey: 'tour.custom.type.familyDesc',
		descFallback: '亲子友好的全家定制路线',
	},
	{
		icon: 'icon:like',
		titleKey: 'tour.custom.type.culture',
		titleFallback: '文化深度游',
		descKey: 'tour.custom.type.cultureDesc',
		descFallback: '深入体验中国传统文化与历史',
	},
	{
		icon: 'icon:menu',
		titleKey: 'tour.custom.type.theme',
		titleFallback: '主题定制',
		descKey: 'tour.custom.type.themeDesc',
		descFallback: '摄影、美食、养生等主题专享',
	},
]

// 客户真实案例（从共享数据加载，首页 + 详情页共用；首页只展示前 4 条）
const cases = tourCases.slice(0, 4)

// 表单状态（对接 travel/inquiry/create，与独立定制页一致）
const formRef = ref<FormInstance>()
const form = reactive({
	name: '',
	contact: '',
	destination: '',
	people: '',
	requirement: '',
})
const rules: FormRules = {
	name: [{ required: true, message: '请输入您的称呼', trigger: 'blur' }],
	contact: [
		{ required: true, message: '请输入联系方式', trigger: 'blur' },
	],
}
const submitting = ref(false)

async function submit() {
	if (!formRef.value)
		return
	await formRef.value.validate(async (valid) => {
		if (!valid) {
			ElMessage.info($t('Please fill in the required fields'))
			return
		}
		submitting.value = true
		try {
			// 对接 /travel/inquiry/create（匿名可提交，邮箱作为身份标识）
			await $api('travel/inquiry/create', {
				method: 'post',
				body: {
					email: form.contact,
					destination: form.destination || '未指定',
					startDate: new Date().toISOString().split('T')[0],
					travelerCount: parseInt(form.people) || 1,
					specialRequirements: [
						`称呼：${form.name}`,
						form.requirement ? `需求：${form.requirement}` : '',
					].filter(Boolean).join('\n') || undefined,
				},
			})
			ElMessage.info($t('Submitted successfully, a planner will contact you soon!'))
			formRef.value?.resetFields()
		}
		catch {
			// 全局拦截器已弹错误提示，此处不重复弹（API 规范 §3）
		}
		finally {
			submitting.value = false
		}
	})
}

function tr(key: string, fallback: string) {
	return $t(key) !== key ? $t(key) : fallback
}
</script>

<template>
	<!-- 整块：需求定制（左文案+右深黑渐变表单）+ 案例分享（4列网格）
	保留原 AppTourCustom 的 site-grid 背景风格 -->
	<section class="tour-custom site-grid site-grid--vertical-100 site-grid--full">
		<div class="tour-custom__module site-container">
			<!-- ===== 上：需求定制（左文案 + 右表单），白色背景块包住 ===== -->
			<div class="tour-custom__custom">
				<!-- 左：标题 + 描述 + 要点 + 4类型卡片 -->
				<div class="tour-custom__intro">
					<h2 class="tour-custom__title">
						{{ tr('tour.cta.heading', '开启您的专属中国之旅') }}
					</h2>
					<p class="tour-custom__desc">
						{{ tr('tour.cta.desc', '资深规划师 1 对 1 服务，从行程规划到落地接待全程跟进。无论商务出行、家庭旅行还是文化探索，都能为您量身打造。') }}
					</p>
					<ul class="tour-custom__points">
						<li>{{ tr('tour.cta.point1', '免费咨询，无任何规划费用') }}</li>
						<li>{{ tr('tour.cta.point2', '本地直连，价格透明更低') }}</li>
						<li>{{ tr('tour.cta.point3', '7×24 管家全程跟进') }}</li>
					</ul>
					<!-- 4 行程类型卡片 -->
					<div class="tour-custom__types">
						<article
							v-for="item in tripTypes"
							:key="item.titleFallback"
							class="tour-custom__type-card"
						>
							<Icon :name="item.icon" class="tour-custom__type-icon" />
							<div class="tour-custom__type-text">
								<h4 class="tour-custom__type-title">
									{{ tr(item.titleKey, item.titleFallback) }}
								</h4>
								<p class="tour-custom__type-desc">
									{{ tr(item.descKey, item.descFallback) }}
								</p>
							</div>
						</article>
					</div>
				</div>

				<!-- 右：深黑渐变表单（保持现背景色，同 banner） -->
				<el-form
					ref="formRef"
					:model="form"
					:rules="rules"
					class="tour-custom__form"
					label-position="top"
				>
					<div class="tour-custom__form-head">
						<div class="tour-custom__form-title">
							{{ tr('tour.cta.submit', '免费定制行程') }}
						</div>
						<div class="tour-custom__form-sub">
							{{ tr('tour.cta.desc', '提交需求，规划师 24 小时内联系您') }}
						</div>
					</div>
					<div class="tour-custom__form-row">
						<el-form-item :label="tr('tour.cta.form.name', '称呼')" prop="name">
							<el-input v-model="form.name" :placeholder="tr('tour.cta.form.namePh', '您的称呼')" />
						</el-form-item>
						<el-form-item :label="tr('tour.cta.form.contact', '联系方式')" prop="contact">
							<el-input v-model="form.contact" :placeholder="tr('tour.cta.form.contactPh', '微信/邮箱/手机')" />
						</el-form-item>
					</div>
					<div class="tour-custom__form-row">
						<el-form-item :label="tr('tour.cta.form.destination', '目的地')">
							<el-input v-model="form.destination" :placeholder="tr('tour.cta.form.destinationPh', '如：北京、云南、西藏')" />
						</el-form-item>
						<el-form-item :label="tr('tour.cta.form.people', '出行人数')">
							<el-input v-model="form.people" :placeholder="tr('tour.cta.form.peoplePh', '如：2 大人 1 小孩')" />
						</el-form-item>
					</div>
					<el-form-item :label="tr('tour.cta.form.requirement', '需求描述')">
						<el-input
							v-model="form.requirement"
							type="textarea"
							:rows="3"
							:placeholder="tr('tour.cta.form.requirementPh', '出行日期、预算、偏好等')"
						/>
					</el-form-item>
					<button
						type="button"
						class="tour-custom__submit mi-button mi-btn mi-btn--primary"
						:disabled="submitting"
						@click="submit"
					>
						{{ submitting ? tr('tour.cta.submitting', '提交中...') : tr('tour.cta.submit', '免费定制行程') }}
					</button>
				</el-form>
			</div>

			<!-- ===== 下：客户真实案例（4 列网格，紧贴需求定制，证明真实性）===== -->
			<div class="tour-custom__cases">
				<h3 class="tour-custom__cases-title">
					客户<em>真实案例</em>分享
					<span class="tour-custom__cases-subtitle">— 他们都选择了 iswink 定制专属行程</span>
				</h3>
				<div class="tour-custom__cases-grid">
					<NuxtLink
						v-for="item in cases"
						:key="item.id"
						:to="$path(`/case/${item.id}`)"
						class="tour-custom__case"
					>
						<div class="tour-custom__case-user">
							<div class="tour-custom__case-avatar" :class="item.avatarCls">
								{{ item.avatar }}
							</div>
							<div class="tour-custom__case-info">
								<div class="tour-custom__case-name">
									{{ item.name }}
								</div>
								<div class="tour-custom__case-meta">
									{{ item.meta }}
								</div>
							</div>
							<div class="tour-custom__case-stars">
								★★★★★
							</div>
						</div>
						<div class="tour-custom__case-route">
							{{ item.route }}
						</div>
						<p class="tour-custom__case-sharing">
							{{ item.sharing }}
						</p>
						<div class="tour-custom__case-date">
							<span>{{ item.date }}</span>
							<span class="tour-custom__case-verified">✓ {{ $t('tour.caseDetail.verifiedOrder') }}</span>
						</div>
					</NuxtLink>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourCustom.scss');
</style>
