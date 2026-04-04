import {api} from 'src/api'

const getBannerList = async () => {
  const response = await api<Api.Base<any>>('get')('banner')
  return response.data
}
export const createBanner = async (body: any) => {
  console.log(body, 'body from servie')
  const response = await api<Api.Base<{}>>('post')(
    `/banner/new`,
    undefined,
    body
  )
  return response.data
}

const deleteBannerImages = async (bannerName: string) => {
  console.log(bannerName, 'productId from service')
  const response = await api<any>('delete')(`/banner/${bannerName}`)
  return response.data
}

const getSocialLinks = async () => {
  const response = await api<Api.Base<any>>('get')('socialIcons')
  return response.data
}
export const createSocialLinks = async (body: any) => {
  console.log(body, 'body from servie')
  const response = await api<Api.Base<{}>>('post')(
    `/socialLinks/new`,
    undefined,
    body
  )
  return response.data
}

export const updateSocialLinks = async (body: any) => {
  console.log(body, 'body from servie')
  const response = await api<Api.Base<{}>>('post')(
    `/socialLinks/new`,
    undefined,
    body
  )
  return response.data
}

const deleteSocialLinks = async (bannerName: string) => {
  console.log(bannerName, 'productId from service')
  const response = await api<any>('delete')(`/socialLinks/${bannerName}`)
}

export const BannerService = {
  createBanner,
  getBannerList,
  deleteBannerImages,
  getSocialLinks,
  createSocialLinks,
  updateSocialLinks,
  deleteSocialLinks
}
