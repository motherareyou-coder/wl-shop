<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

definePageMeta({ title: '重置密码' })
useSEO({ title: '重置密码', noIndex: true })

const formRef = ref<FormInstance>()
const form = reactive({ password: '', confirmPassword: '' })
const submitting = ref(false)
const success = ref(false)

const rules: FormRules = {
	password: [
		{ required: true, message: '请输入新密码', trigger: 'blur' },
		{ min: 8, message: '密码至少 8 位', trigger: 'blur' },
	],
	confirmPassword: [
		{ required: true, message: '请确认密码', trigger: 'blur' },
		{
			validator: (_rule, value, callback) => {
				if (value !== form.password) callback(new Error('两次密码不一致'))
				else callback()
			},
			trigger: 'blur',
		},
	],
}

async function submit() {
	if (!formRef.value) return
	await formRef.value.validate(async (valid) => {
		if (!valid) return
		submitting.value = true
		try {
			// TODO: 后续对接后端重置密码接口（待确认路径）
			// 可能是 member/user/reset-password 或 travel 专用接口
			await $api('member/user/update-password', {
				method: 'post',
				body: { password: form.password },
			})
			success.value = true
		} catch {}
		finally { submitting.value = false }
	})
}

const router = useRouter()
function goHome() { router.push($path('/')) }
</script>

<template>
	<div class="reset-page">
		<div class="reset-card">
			<!-- 成功 -->
			<div v-if="success" class="reset-success">
				<div class="reset-success__icon">✓</div>
				<h1>密码重置成功</h1>
				<button class="btn" @click="goHome">进入首页</button>
			</div>

			<!-- 表单 -->
			<el-form v-else ref="formRef" :model="form" :rules="rules" label-position="top">
				<h1 class="reset-card__title">设置新密码</h1>
				<p class="reset-card__desc">首次登录请设置您的新密码以继续使用</p>
				<el-form-item label="新密码" prop="password">
					<el-input v-model="form.password" type="password" show-password placeholder="至少 8 位" />
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input v-model="form.confirmPassword" type="password" show-password placeholder="再次输入新密码" />
				</el-form-item>
				<button class="btn" :disabled="submitting" @click="submit">
					{{ submitting ? '提交中...' : '确认重置' }}
				</button>
			</el-form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.reset-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: linear-gradient(135deg, #1C1917, #292524); }
.reset-card { background: #fff; border-radius: 16px; padding: 40px; max-width: 420px; width: 100%; box-shadow: 0 8px 32px rgba(0,0,0,.2);
	&__title { font-size: 24px; font-weight: 700; margin: 0 0 8px; color: #191919; }
	&__desc { font-size: 14px; color: #898989; margin: 0 0 24px; }
}
.reset-success { text-align: center;
	&__icon { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #A16207, #CA8A04); color: #fff; font-size: 36px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
	h1 { font-size: 22px; font-weight: 700; margin: 0 0 24px; }
}
.btn { width: 100%; padding: 14px; font-size: 16px; font-weight: 600; border-radius: 999px; border: none; cursor: pointer; background: linear-gradient(135deg, #A16207, #CA8A04); color: #fff; transition: transform .2s;
	&:hover { transform: translateY(-1px); } &:disabled { opacity: .5; cursor: not-allowed; }
}
</style>
