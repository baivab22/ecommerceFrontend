import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch} from 'src/store'
// import {delteProductAction, getProductListAction} from './product.slice'
import {useSelector} from 'react-redux'
import {Box, Button, HStack, SelectField, Table} from 'src/app/common'
import {useNavigate} from 'react-router-dom'
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
export const Testimonial = () => {
  const navigate = useNavigate()
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
            onClick={() => navigate('add')}
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
                  <img
                    //@ts-ignore
                    // src={datas?[0]?.coloredImage[0]}

                    // src=`http://localhost:8000/products${datas.}`

                    src={`https://abhushangallery.com/testimonial/${datas}`}
                    // src=`https://localhost:8000/products/${datas?[0].coloredImage[0]}`
                    style={{height: '70px', width: '100px'}}
                  ></img>
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
            onView: (item: any) => {
              navigate(`view/${item.id}`)
            },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              navigate(`update/${item._id}`)
            },
            onDelete: (item: any, onCloseModalHandler) => {
              console.log(item.id, 'item to be deleted')

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
