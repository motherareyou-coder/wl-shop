function useForm(columns) {
	const rules = columns.reduce((t, c) => {
		if (c.required)
			t[c.prop] = []
		return t
	}, {})
	return {
		rules,
	}
}
