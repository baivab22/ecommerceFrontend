import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch} from 'src/store'
// import {delteProductAction, getProductListAction} from './product.slice'
import {useSelector} from 'react-redux'
import {Box, Button, HStack, SelectField, Table} from 'src/app/common'
import {useRouter} from 'next/router'
import {toast} from 'react-hot-toast'
import {
  deleteCategoryAction,
  getCategoryListAction
} from '../category/category.slice'
import {
  deleteTestimonialAction,
  getTestimonialListAction
} from './testimonial.slice'
import {FILE_URL} from 'src/config'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'
export const Testimonial = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [category, setCategory] = useState<any>()
  const [selectedCateory, setSelectedCategory] = useState<any>()
  const {testimonialData}: any = useSelector((state: any) => state.testimonial)

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [])

  // console.log(categoryData, 'category data called')

  // useEffect(() => {
  //   // console.log(categoryData, 'caetgory data called')
  //   const mappedCategory = categoryData?.map((item: any, index: number) => {
  //     console.log(item, 'caetgory item')
  //     return {
  //       id: item.id,
  //       label: item.name,
  //       value: item.name,
  //       subCategory: item.subCategories
  //     }
  //   })
  //   console.log(mappedCategory, 'mapped category from products')
  //   setCategory(mappedCategory)
  // }, [categoryData])

  useEffect(() => {
    dispatch(
      getTestimonialListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  return (
    <div>
      <Box>
        <HStack justify="space-between" style={{margin: '20px 0'}}>
          <Button
            title="Add Testimonial"
            onClick={() => router.push('/dash-testimonial/add')}
          ></Button>
        </HStack>

        <Table
          columns={[
            {
              field: 'testimonialDescription',
              name: 'Description',
              render: (datas) => {
                console.log(datas, 'datasssssssssss')
                return <div>{datas}</div>
              }
            },
            {
              field: 'testimonialImage',
              name: 'Images',
              render: (datas) => (
                <div>
                  <OptimizedImage
                    src={`${FILE_URL}/testimonial/${datas}`}
                    alt="Testimonial image"
                    width={100}
                    height={70}
                    style={{height: '70px', width: '100px'}}
                  />
                </div>
              )
            }

            // {
            //   field: 'subCategories',
            //   name: 'SubCategory',
            //   render: (datas) => (
            //     <div className="subCategoryButton">
            //       {datas?.map((item: any, index: number) => {
            //         return <p className="subCategoryButton-item">{item.name}</p>
            //       })}
            //     </div>
            //   )
            // }
          ]}
          data={testimonialData}
          actions={{
            // onView: (item: any) => {
            //   navigate(`view/${item.id}`)
            // },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              router.push(`/dash-testimonial/update/${item._id}`)
            },
            onDelete: (item: any, onCloseModalHandler) => {
              console.log(item._id, 'item id to delete')
              dispatch(
                deleteTestimonialAction({
                  testimonialId: item._id,
                  onSuccess: (data: any) => {
                    onCloseModalHandler()
                    toast.success('Testimonial deleted successfully')
                    dispatch(
                      getTestimonialListAction({
                        onSuccess: () => {}
                      })
                    )
                  }
                })
              )
            }
          }}
          pagination={{
            totalCount: Number(testimonialData?.length ?? 1)
            // perPage: Number(import.meta.REACT_APP_TABLE_LIMIT || 10)
          }}
             pageFe={true}
        />
      </Box>
    </div>
  )
}
