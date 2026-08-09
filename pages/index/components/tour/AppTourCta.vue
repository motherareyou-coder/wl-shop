<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'AppTourCta' })

// 客户真实案例（静态，4 条）
const cases = [
	{
		avatar: '张',
		avatarCls: 'tour-cta__case-avatar--1',
		name: '张先生',
		meta: '来自上海 · 家庭出行',
		route: '丝绸之路 · 西安到敦煌 · 12天',
		sharing: '从西安兵马俑到敦煌莫高窟，规划师安排的本地向导特别专业，孩子全程听得津津有味。最惊喜的是参加了壁画画坊，亲手体验了千年技艺。全程专车接送，比跟团游深度太多。',
		date: '2024年10月',
	},
	{
		avatar: 'L',
		avatarCls: 'tour-cta__case-avatar--2',
		name: 'Linda Chen',
		meta: '来自新加坡 · 情侣出行',
		route: '云南秘境 · 昆明大理丽江 · 8天',
		sharing: 'The trip was perfectly customized for us. We stayed in a Bai minority courtyard home, learned traditional tie-dye, and visited a Pu\'er tea farm. Our concierge handled everything — even last-minute changes.',
		date: '2024年9月',
	},
	{
		avatar: '王',
		avatarCls: 'tour-cta__case-avatar--3',
		name: '王先生夫妇',
		meta: '来自北京 · 夫妻出行',
		route: '西藏朝圣 · 拉萨林芝 · 10天',
		sharing: '最担心的高反问题，规划师提前安排了氧气瓶随车和预防方案。持牌导游对藏传佛教文化讲解深入，布达拉宫的清晨参观完全没人挤。林芝的桃花和南迦巴瓦峰，这一趟值了。',
		date: '2024年4月',
	},
	{
		avatar: 'M',
		avatarCls: 'tour-cta__case-avatar--4',
		name: 'Michael Wang',
		meta: '某科技公司 · 商务出行',
		route: '企业团建 · 上海及周边 · 5天',
		sharing: '为 30 人年会团队定制，从专车接送到高端餐饮、会议场地全部安排妥当。特别赞的是朱家角古镇的团建活动设计，融合了江南文化体验，团队反馈非常好。报价透明无隐藏费用。',
		date: '2024年11月',
	},
]

// 表单状态（复用现有线索收集思路）
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
		if (!valid)
			return
		submitting.value = true
		try {
			// 复用现有线索收集接口（SEO 规范：禁止裸 $fetch，用 $api）
			await $api('crm/clue/create-email-subscription', {
				method: 'post',
				body: {
					name: form.name,
					contact: form.contact,
					destination: form.destination,
					people: form.people,
					requirement: form.requirement,
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
	<!-- 整块：需求定制（左文案+右深黑渐变表单）+ 案例分享（4列网格） -->
	<section class="tour-cta">
		<div class="tour-cta__inner">
			<!-- ===== 上：需求定制（左文案 + 右表单）=====
			     类型卡已由上方 AppTourCustom 展示，这里不重复 -->
			<div class="tour-cta__custom">
				<!-- 左：标题 + 描述 + 要点 -->
				<div class="tour-cta__intro">
					<h2 class="tour-cta__title">
						{{ tr('tour.cta.heading', '开启您的专属中国之旅') }}
					</h2>
					<p class="tour-cta__desc">
						{{ tr('tour.cta.desc', '资深规划师 1 对 1 服务，从行程规划到落地接待全程跟进。无论商务出行、家庭旅行还是文化探索，都能为您量身打造。') }}
					</p>
					<ul class="tour-cta__points">
						<li>{{ tr('tour.cta.point1', '免费咨询，无任何规划费用') }}</li>
						<li>{{ tr('tour.cta.point2', '本地直连，价格透明更低') }}</li>
						<li>{{ tr('tour.cta.point3', '7×24 管家全程跟进') }}</li>
					</ul>
				</div>

				<!-- 右：深黑渐变表单（保持现背景色，同 banner） -->
				<el-form
					ref="formRef"
					:model="form"
					:rules="rules"
					class="tour-cta__form"
					label-position="top"
				>
					<div class="tour-cta__form-head">
						<div class="tour-cta__form-title">
							{{ tr('tour.cta.submit', '免费定制行程') }}
						</div>
						<div class="tour-cta__form-sub">
							{{ tr('tour.cta.desc', '提交需求，规划师 24 小时内联系您') }}
						</div>
					</div>
					<div class="tour-cta__form-row">
						<el-form-item :label="tr('tour.cta.form.name', '称呼')" prop="name">
							<el-input v-model="form.name" :placeholder="tr('tour.cta.form.namePh', '您的称呼')" />
						</el-form-item>
						<el-form-item :label="tr('tour.cta.form.contact', '联系方式')" prop="contact">
							<el-input v-model="form.contact" :placeholder="tr('tour.cta.form.contactPh', '微信/邮箱/手机')" />
						</el-form-item>
					</div>
					<div class="tour-cta__form-row">
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
						class="tour-cta__submit mi-button mi-btn mi-btn--primary"
						:disabled="submitting"
						@click="submit"
					>
						{{ submitting ? tr('tour.cta.submitting', '提交中...') : tr('tour.cta.submit', '免费定制行程') }}
					</button>
				</el-form>
			</div>

			<!-- ===== 下：客户真实案例（4 列网格平铺，不滑动）===== -->
			<div class="tour-cta__cases">
				<h3 class="tour-cta__cases-title">
					{{ tr('tour.guide.heading', '客户') }}<em>{{ tr('tour.cta.point2', '真实案例') }}</em>{{ tr('tour.guide.viewAll', '分享') }}
				</h3>
				<div class="tour-cta__cases-grid">
					<article
						v-for="item in cases"
						:key="item.name"
						class="tour-cta__case"
					>
						<div class="tour-cta__case-user">
							<div class="tour-cta__case-avatar" :class="item.avatarCls">
								{{ item.avatar }}
							</div>
							<div class="tour-cta__case-info">
								<div class="tour-cta__case-name">
									{{ item.name }}
								</div>
								<div class="tour-cta__case-meta">
									{{ item.meta }}
								</div>
							</div>
							<div class="tour-cta__case-stars">
								★★★★★
							</div>
						</div>
						<div class="tour-cta__case-route">
							{{ item.route }}
						</div>
						<p class="tour-cta__case-sharing">
							{{ item.sharing }}
						</p>
						<div class="tour-cta__case-date">
							<span>{{ item.date }}</span>
							<span class="tour-cta__case-verified">✓ {{ tr('tour.trust.licensed', '真实订单') }}</span>
						</div>
					</article>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
@import url('./AppTourCta.scss');
</style>
