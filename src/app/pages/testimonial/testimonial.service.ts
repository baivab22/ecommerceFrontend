import {api} from 'src/api'

const getTestimonialList = async () => {
  const response = await api<Api.Base<any>>('get')('testimonial')
  return response.data
}

const getTestimonialDetailById = async (testimonialId: string) => {
  //   console.log(subCategoryId, 'from service subcategoryUd')
  const response = await api<Api.Base<any>>('get')(
    `testimonial/${testimonialId}`
  )

  console.log('response hai', response)
  return response.data
}

const updateTestimonial = async (body: any, testimonialId: string) => {

  console.log(body,"body update")
  const response = await api<Api.Base<{}>>('patch')(
    `/testimonial/${testimonialId}`,
    undefined,
    body
  )

  
  return response.data
}

// const getSubCategoriesList = async () => {
//   console.log('it is called subcateogr')
//   const response = await api<Api.Base<any>>('get')(`/subCategory`)
//   return response.data
// }

const deleteTestimonial = async (testimonialId: string) => {
  const response = await api<any>('delete')(`/testimonial/${testimonialId}`)
}

const createTestimonial = async (body: any) => {
  const response = await api<Api.Base<{}>>('post')(
    `/testimonial/new`,
    undefined,
    body
  )
  return response.data
}

export const testimonialService = {
  getTestimonialList,
  getTestimonialDetailById,
  deleteTestimonial,
  createTestimonial,
  updateTestimonial
}
