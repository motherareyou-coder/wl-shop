export default (key = 'timeout') => {
	const timeout = ref(0)
	let timer = -1
	function start() {
		clearInterval(timer)
		timer = setInterval(() => {
			if (timeout.value <= 0) {
				stop()
			}
			else {
				timeout.value--
				localStorage.setItem(key, `${timeout.value}`)
			}
		}, 1000) as unknown as number
	}
	function stop() {
		clearInterval(timer)
		timeout.value = 0
	}
	try {
		const t = Number(localStorage.getItem('login-timeout'))
		if (!Number.isNaN(t) && t > 0) {
			timeout.value = t
			start()
		}
		else {
			timeout.value = 0
		}
	}
	catch (error) {
		console.warn(error)
		timeout.value = 0
	}

	return { timeout, start, stop }
}
