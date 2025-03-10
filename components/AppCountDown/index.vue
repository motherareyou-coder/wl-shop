<script setup>
defineOptions({
	name: 'AppCountDown',
})
const props = defineProps({
	endTime: { type: [String, Number] }, // 结束时间
})
const countdown = ref({
	h: '00',
	m: '00',
	s: '00',
})
const dayjs = useDayjs()
const timer = setInterval(() => {
	const t = dayjs(props.endTime)
	const now = dayjs()
	const diff = dayjs.duration(t.diff(now))
	if (diff.seconds() < 0)
		clearInterval(timer)
	countdown.value.d = diff.format('D')
	countdown.value.h = diff.format('HH')
	countdown.value.m = diff.format('mm')
	countdown.value.s = diff.format('ss')
}, 1000)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
	<div>
		<slot :data="countdown">
			<strong data-type="hrs">
				<span>
					{{ countdown.h }}
				</span>
			</strong>
			<strong data-type="min">
				<span>
					{{ countdown.m }}
				</span>
			</strong>
			<strong data-type="sec">
				<span>
					{{ countdown.s }}
				</span>
			</strong>
		</slot>
	</div>
</template>
