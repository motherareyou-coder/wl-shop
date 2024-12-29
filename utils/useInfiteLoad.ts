function useInfiteLoad<T>(
	fetch: (arg0: {
		pageNo: number
		pageSize: number
	}) => Promise<{ total: number, list: T[] }>,
	uniqKey = 'id',
	immediate = true,
) {
	const data: Ref<T[]> = ref([])
	const total = ref(Infinity)
	const pagination = ref({
		pageNo: 1,
		pageSize: 30,
	})
	const loading = ref(false)

	function getData(num?: number) {
		if (loading.value)
			return
		if (num) {
			pagination.value.pageNo = num
		}
		loading.value = true
		fetch(pagination.value)
			.then((res) => {
				if (Array.isArray(res)) {
					data.value = res
					total.value = data.value.length
				}
				else {
					total.value = res.total ?? Infinity
					if (uniqKey) {
						res.list.forEach((d) => {
							const index = data.value.findIndex(
								dd => dd[uniqKey] === d[uniqKey],
							)
							if (index === -1) {
								data.value.push(d)
							}
							else {
								data.value.splice(index, 1, d)
							}
						})
					}
					else {
						data.value.push(...res.list)
					}
				}
			})
			.finally(() => {
				loading.value = false
			})
	}
	function load() {
		if (data.value.length < total.value) {
			getData(pagination.value.pageNo + 1)
		}
	}
	function reset() {
		data.value = []
		total.value = Infinity
		pagination.value = {
			pageNo: 1,
			pageSize: 30,
		}
		getData()
	}
	immediate && getData()
	return {
		data,
		total,
		pagination,
		getData,
		load,
		reset,
		loading,
	}
}

export default useInfiteLoad
