import {api} from 'src/api'

const getCartListByUserId = async ({userId}: {userId: string}) => {
  const response = await api<Api.Base<any>>('get')(`/cart/${userId}`)
  console.log('data', response.data)
  return response.data
}

/**
 * Fetch order list with pagination and filters
 * @param {Object} params - { page, limit, search, startDate, endDate }
 */
const getOrderList = async (params: {
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string
} = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  const url = `/order${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await api<Api.Base<any>>('get')(url);
  console.log('from cart service', response.data);
  return response.data;
}

const updateOrderById = async (id:string,data:any) => {
  const response = await api<Api.Base<any>>('patch')(`/order/${id}`,undefined,data)
  console.log('from cart service', response.data)
  return response.data
}
export const createCartByUserId = async (body: any, userId: string) => {
  console.log(body, 'b')
  const response = await api<Api.Base<{}>>('post')(
    `/cart/new/${userId}`,
    undefined,
    body
  )
  return response.data
}

export const updateCartByProductId = async (body: any) => {
  console.log(body, 'b')
  const response = await api<Api.Base<{}>>('patch')(
    `/cart/${body.productId}`,
    undefined,
    body
  )
  return response.data
}

export const createOrderByUserId = async (body: any, userId: string) => {
  console.log(body, 'b')
  const response = await api<Api.Base<{}>>('post')(
    `/order/new/${userId}`,
    undefined,
    body
  )
  return response.data
}

const deleteCartByProductId = async (userId: string, productId: string) => {
  //   console.log(bannerName, 'productId from service')
  console.log('delte service')
  const response = await api<any>('delete')(`/cart/${productId}`, undefined, {
    userId: userId
  })
  console.log(response, 'response hai ta')

  return response
}

const deleteCart=async (cartId: string) => {
  //   console.log(bannerName, 'productId from service')
  console.log('delte service',cartId)
  const response = await api<any>('delete')(`/cart/delete/${cartId}`, undefined)
  console.log(response, 'response hai ta')

  return response
}

export const CartService = {
  createCartByUserId,
  deleteCartByProductId,
  getCartListByUserId,
  createOrderByUserId,
  getOrderList,
  updateCartByProductId,
  deleteCart,
  updateOrderById
}
