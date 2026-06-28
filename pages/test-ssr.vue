<template>
	<div class="test-page">
		<h1>测试页 - 最小 SSR 验证</h1>
		<div class="test-grid">
			<div class="test-card">卡片1</div>
			<div class="test-card">卡片2</div>
			<div class="test-card">卡片3</div>
		</div>
	</div>
</template>

<style scoped>
.test-page {
	padding: 40px;
}
.test-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;
	margin-top: 20px;
}
.test-card {
	padding: 20px;
	background: #ff6900;
	color: #fff;
	border-radius: 8px;
	text-align: center;
}
</style>
