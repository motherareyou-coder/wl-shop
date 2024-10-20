export interface Product {
	id: number
	name: string
	introduction: string
	categoryId: number
	picUrl: string
	sliderPicUrls: string[]
	specType: true
	price: number
	marketPrice: number
	vipPrice: number
	stock: number
	salesCount: number
}

export interface Category {
	id: number
	parentId: number
	name: string
	picUrl: string
	children?: Product[]
}
