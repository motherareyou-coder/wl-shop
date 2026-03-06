import type { ProductDetail } from '~/types'
import { isArray, isString, uniqBy } from 'lodash-es'

export function useProperties(info: Ref<ProductDetail | null>) {
	watch(
		info,
		(v) => {
			v?.skus.forEach((s) => {
				s.propertyMap = s.properties.reduce((t, p) => {
					t[p.propertyId] = p.valueId
					return t
				}, {})
			})
		},
		{ immediate: true },
	)
	const properties = computed(() => {
		if (!info.value)
			return []
		if (isString(info.value.propertyList)) {
			const a = JSON.parse(info.value.propertyList)
			if (a.length)
				return a
		}
		if (isArray(info.value.propertyList))
			return info.value.propertyList
		const arr = info.value.skus.map(s => s.properties).flat()
		const map: Record<any, any> = {}
		arr.forEach((c) => {
			const { propertyId, propertyName, valueId, valueName } = c
			const property = map[propertyId] || {
				id: propertyId,
				name: propertyName,
				values: [],
			}
			property.values.push({ id: valueId, name: valueName })
			property.values = uniqBy(property.values, 'id')
			map[propertyId] = property
		})
		return Object.values(map)
	})
	return properties
}
