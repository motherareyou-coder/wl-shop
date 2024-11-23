export default (b = false) => {
	const loading = ref(b)

	function wrapLoading<T>(p: Promise<T>) {
		if (p instanceof Promise) {
			if (loading.value)
				return
			loading.value = true
			p.finally(() => {
				loading.value = false
			})
		}
		return p
	}

	return {
		loading,
		wrapLoading,
	}
}
