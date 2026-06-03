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
export const SubCategoryListPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [category, setCategory] = useState<any>()
  //   const [selectedCateory, setSelectedCategory] = useState<any>()
  const {subCategoryData}: any = useSelector((state: any) => state.subCategory)
  useEffect(() => {
    console.log(subCategoryData, 'subCategoryData changed')
  }, [subCategoryData])
  useEffect(() => {
    dispatch(
      getSubCategoryListAction({
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
      getSubCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  return (
    <div>
      <Box>
        <HStack justify="space-between" style={{margin: '20px 0'}}>
          <Button
            title="Add SubCategory"
            onClick={() => router.push('/dash-subCategory/add')}
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
          data={subCategoryData}
          actions={{
            // onView: (item: any) => {
            //   navigate(`view/${item.id}`)
            // },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              router.push(`/dash-subCategory/update/${item.id}`)
            },
            onDelete: (item: any, onCloseModalHandler) => {
              dispatch(
                deleteSubCategoryAction({
                  subCategoryId: item.id,
                  onSuccess: (data: any) => {
                    onCloseModalHandler()
                    toast.success('SubCategory deleted successfully')
                    dispatch(
                      getSubCategoryListAction({
                        onSuccess: () => {}
                      })
                    )
                  }
                })
              )
            }
          }}
          pagination={{
            totalCount: Number(subCategoryData?.length ?? 1),
            // perPage: Number(import.meta.REACT_APP_TABLE_LIMIT || 10)
                   
          }}

             pageFe={true}
        />
      </Box>
    </div>
  )
}
