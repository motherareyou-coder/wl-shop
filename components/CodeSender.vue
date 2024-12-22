<script setup lang="ts">
const props = defineProps({
	token: { type: String },
})
const emit = defineEmits(['click'])

function useTimeout(key = 'timeout') {
	const timeout = useLocalStorage(key, 0)
	let timer = -1
	function start() {
		clearInterval(timer)
		timer = setInterval(() => {
			if (timeout.value <= 0) {
				stop()
			}
			else {
				timeout.value--
			}
		}, 1000) as unknown as number
	}
	function stop() {
		clearInterval(timer)
		timeout.value = 0
	}
	if (!Number.isNaN(timeout.value) && timeout.value > 0) {
		start()
	}
	else {
		timeout.value = 0
	}
	return { timeout, start, stop }
}

const { timeout, start } = useTimeout(props.token)

function handleClick() {
	timeout.value = 60
	start()
	emit('click')
}
</script>

<template>
	<button
		class="cursor-pointer"
		:disabled="!!timeout"
		@click.prevent.stop="handleClick"
	>
		{{ $t('Send code') }}
		<span v-if="timeout">({{ timeout }}s)</span>
	</button>
</template>
