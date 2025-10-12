import {api} from 'src/api'

// MARK: - getProductlist
const getProductList = async (query?: {
  search?: string
  categoryId?: string
  isNewArrivals?: boolean
  isBestSelling?: boolean
  sort?: string
  order?: string
  minPrice?: number
  maxPrice?: number
  subCategoryId?: string
  nestedSubCategoryId?:string
}) => {
  // &isNewArrivals=${query.isNewArrivals ?? ''}

  console.log('slicess', query)

  const response = await api<any>('get')(`/product`, {
    search: query.search ?? '',
    categoryId: query.categoryId ?? '',
    sort: query.sort ?? '',
    order: query.order ?? '',
    minPrice: query.minPrice ?? 0,
    maxPrice: query.maxPrice ?? 9999999999999999999,
    subCategoryId: query.subCategoryId ?? '',
    isBestSelling: query.isBestSelling ?? '',
    isNewArrivals: query.isNewArrivals ?? '',
    nestedSubCategoryId:query?.nestedSubCategoryId ?? ''
  })

  console.log(response, 'response from slice')

  // const response = await api<any>('get')(`/product`)

  return response.data
}

const deleteProduct = async (productId: string) => {
  const response = await api<any>('delete')(`/product/${productId}`)
}

const deleteProductImages = async (productId: string, imageId: string) => {
  const response = await api<any>('delete')(`/product/${productId}/${imageId}`)
}

// MARK: - getProductDetail
const getProductDetailById = async (productId: string) => {
  const response = await api<Api.Base<any>>('get')(`/product/${productId}`)
  return response.data
}

const getOrderDetailById = async (orderId: string) => {
  const response = await api<Api.Base<any>>('get')(
    `/order/orderDetails/${orderId}`
  )
  return response.data
}

const getProductListByCategoryId = async (categoryId: string) => {
  const response = await api<Api.Base<any>>('get')(
    `/product/category/${categoryId}`
  )
  return response.data
}

// MARK: - createProduct
const createProduct = async (body: any) => {
  console.log(body, 'body product delete')
  const response = await api<Api.Base<{}>>('post')(
    `/product/new`,
    undefined,
    body
  )
  return response.data
}

const updateProduct = async (body: any, productId: string) => {
  const response = await api<Api.Base<{}>>('patch')(
    `/product/${productId}`,
    undefined,
    body
  )
  return response.data
}

// MARK: - updateBusinessTrusted
const updateBusinessTrusted = async (
  businessId: number,
  isBusinessTrusted: boolean
) => {
  const response = await api<Api.Base<{}>>('patch')(
    `/users/${businessId}/trusted`,
    undefined,
    {isTrusted: isBusinessTrusted}
  )
  return response.data.data.data
}

const deleteProductColorVariantImages = async (
  variantId: string,
  imageId: string
) => {
  // console.log(variantId, 'productId from service')
  const response = await api<any>('delete')(
    `/productColor/${variantId}/${imageId}`
  )
}

const getAllProductVariantImages = async () => {
  const response = await api<any>('get')(`/allColorVariant`)
  return response.data
}

const CreateProductImage = async (body: any) => {
  const response = await api<Api.Base<{}>>('post')(
    `/productImage/new`,
    undefined,
    body
  )
  return response.data
}

export const productService = {
  getProductList,
  deleteProduct,
  getProductDetailById,
  createProduct,
  getProductListByCategoryId,
  updateProduct,
  deleteProductImages,
  deleteProductColorVariantImages,
  getAllProductVariantImages,
  CreateProductImage,
  getOrderDetailById
}
