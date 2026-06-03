import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch} from 'src/store'
// import {delteProductAction, getProductListAction} from './product.slice'
import {useSelector} from 'react-redux'
import {Box, Button, HStack, SelectField, Table} from 'src/app/common'
import { useRouter } from 'next/router'
import {toast} from 'react-hot-toast'
import {
  deleteSubCategoryAction,
  getSubCategoryListAction
} from '../subCategory/subCategory.slice'
import {
  deleteSubCategoryActionNested,
  getSubCategoryListActionNested
} from './subCategory.slice'
export const SubCategoryListPageNested = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [category, setCategory] = useState<any>()
  //   const [selectedCateory, setSelectedCategory] = useState<any>()
  const {subCategoryDataNested}: any = useSelector(
    (state: any) => state.subCategoryNested
  )
  useEffect(() => {
    console.log(subCategoryDataNested, 'subCategoryData changed')
  }, [subCategoryDataNested])
  useEffect(() => {
    dispatch(
      getSubCategoryListActionNested({
        onSuccess: () => console.log('Sub categoryList fetch Successfully')
      })
    )
  }, [])

  //   useEffect(() => {
  //     console.log(categoryData, 'caetgory data called')
  //     const mappedSubCategory = categoryData?.map((item: any, index: number) => {
  //       console.log(item, 'caetgory item')
  //       return {
  //         id: item.id,
  //         label: item.name,
  //         value: item.name,
  //         subCategory: item.subCategories
  //       }
  //     })
  //     console.log(mappedCategory, 'mapped category from products')
  //     setCategory(mappedCategory)
  //   }, [categoryData])

  useEffect(() => {
    dispatch(
      getSubCategoryListActionNested({
        onSuccess: () => {}
      })
    )
  }, [])

  return (
    <div>
      <Box>
        <HStack justify="space-between" style={{margin: '20px 0'}}>
          <Button
            title="Add Nested SubCategory"
            onClick={() => router.push('/dash-subCategorynested/add')}
          ></Button>
        </HStack>

        <Table
          columns={[
            {
              field: 'name',
              name: 'Name',
              render: (datas) => {
                return <div>{datas}</div>
              }
            }
            // {
            //   field: 'name',
            //   name: 'Name',
            //   render: (datas) => (
            //     <div className="subCategoryButton">
            //       <p className="subCategoryButton-item">{datas}</p>
            //     </div>
            //   )
            // }
          ]}
          data={subCategoryDataNested}
          actions={{
            // onView: (item: any) => {
            //   navigate(`view/${item.id}`)
            // },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              router.push(`/dash-subCategorynested/update/${item.id}`)
            },
            onDelete: (item: any, onCloseModalHandler) => {
              dispatch(
                deleteSubCategoryActionNested({
                  subCategoryId: item.id,
                  onSuccess: (data: any) => {
                    onCloseModalHandler()
                    toast.success('SubCategory deleted successfully')
                    dispatch(
                      getSubCategoryListActionNested({
                        onSuccess: () => {}
                      })
                    )
                  }
                })
              )
            }
          }}
          pagination={{
            totalCount: Number(subCategoryDataNested?.length ?? 1),
            perPage: 10
          }}
          pageFe={true}
        />
      </Box>
    </div>
  )
}
