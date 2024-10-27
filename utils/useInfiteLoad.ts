function useInfiteLoad<T>(
	fetch: (arg0: {
		pageNo: number
		pageSize: number
	}) => Promise<{ total: number, list: T[] }>,
) {
	const data: Ref<T[]> = ref([])
	const total = ref(Infinity)
	const pagination = ref({
		pageNo: 1,
		pageSize: 10,
	})
	const loading = ref(false)

	function getData() {
		if (loading.value)
			return
		loading.value = true
		fetch(pagination.value)
			.then((res) => {
				if (Array.isArray(res)) {
					data.value.push(...res)
					total.value = data.value.length
				}
				else {
					total.value = res.total || Infinity
					data.value.push(...res.list)
				}
			})
			.finally(() => {
				loading.value = false
			})
	}
	function load() {
		if (data.value.length < total.value) {
			pagination.value.pageNo++
			getData()
		}
	}
	function reset() {
		data.value = []
		total.value = Infinity
		pagination.value = {
			pageNo: 1,
			pageSize: 10,
		}
		getData()
	}
	getData()
	return {
		data,
		total,
		pagination,
		getData,
		load,
		reset,
	}
}

export default useInfiteLoad
