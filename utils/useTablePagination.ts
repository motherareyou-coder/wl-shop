interface Res<T> {
	list: T[]
	total: number
}

function useTablePagination<T>(fetch: (p: any) => Promise<Res<T>>, immediate = true) {
	const data: Ref<T[]> = ref([])
	const pagination = reactive({
		currentPage: 1,
		pageSize: 10,
		total: 0,
	})
	const loading = ref(false)

	const getData = () => {
		if (loading.value)
			return
		loading.value = true
		fetch({
			pageNo: pagination.currentPage,
			pageSize: pagination.pageSize,
		})
			.then((res: Res<T>) => {
				const { list, total } = res
				data.value = list
				pagination.total = total
			})
			.finally(() => {
				loading.value = false
			})
	}
	const resetData = () => {
		pagination.currentPage = 1
		pagination.total = 0
		data.value = []
		getData()
	}

	if (immediate)
		getData()

	watch([() => pagination.pageSize, () => pagination.currentPage], getData)

	return {
		data,
		pagination,
		getData,
		resetData,
	}
}

export default useTablePagination
