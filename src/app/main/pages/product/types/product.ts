export type IProductFilters = {
  rating: string
  gender: string[]
  category: string
  colors: string[]
  priceRange: number[]
}

export type IProductTableFilters = {
  stock: string[]
  publish: string[]
}

export type IProductReviewNewForm = {
  rating: number | null
  review: string
  name: string
  email: string
}

export type IProductItem = {
  id: string
  sku: string
  name: string
  code: string
  price: number
  taxes: number
  tags: string[]
  sizes: string[]
  publish: string
  gender: string[]
  coverUrl: string
  images: string[]
  colors: string[]
  categories: string[]
  featuredImageId: string
  priceTaxIncl: number
  comparedPrice: number
  quantity: number
  category: string
  available: number
  totalSold: number
  description: string
  totalRatings: number
  totalReviews: number
  inventoryType: string
  subDescription: string
  priceSale: number | null
  ratings: {
    name: string
    starCount: number
    reviewCount: number
  }[]
  label: {
    enabled: boolean
    content: string
  }
  newLabel: {
    enabled: boolean
    content: string
  }
}
