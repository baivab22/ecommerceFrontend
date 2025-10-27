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
export const CategoryListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [category, setCategory] = useState<any>()
  const [selectedCateory, setSelectedCategory] = useState<any>()
  const {categoryData}: any = useSelector((state: any) => state.category)

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [])

  

  console.log(categoryData, 'category data called')

  useEffect(() => {
    console.log(categoryData, 'caetgory data called')
    const mappedCategory = categoryData?.map((item: any, index: number) => {
      console.log(item, 'caetgory item')
      return {
        id: item.id,
        label: item.name,
        value: item.name,
        subCategory: item.subCategories
      }
    })
    console.log(mappedCategory, 'mapped category from products')
    setCategory(mappedCategory)
  }, [categoryData])

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  return (
    <div>
      <Box>
        <HStack justify="space-between" style={{margin: '20px 0'}}>
          <Button title="Add Category" onClick={() => navigate('add')}></Button>
        </HStack>

        <Table
          columns={[
            {
              field: 'name',
              name: 'Name',
              render: (datas) => {
                console.log(datas, 'datasssssssssss')
                return <div>{datas}</div>
              }
            },
            {
              field: 'subCategories',
              name: 'SubCategory',
              render: (datas) => (
                <div className="subCategoryButton">
                  {datas?.map((item: any, index: number) => {
                    return <p className="subCategoryButton-item">{item.name}</p>
                  })}
                </div>
              )
            }
          ]}
          data={categoryData}
          actions={{
            // onView: (item: any) => {
            //   navigate(`view/${item.id}`)
            // },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              navigate(`update/${item.id}`)
            },
            onDelete: (item: any, onCloseModalHandler) => {
              console.log(item.id, 'item to be deleted')

              dispatch(
                deleteCategoryAction({
                  categoryId: item.id,
                  onSuccess: (data: any) => {
                    onCloseModalHandler()
                    toast.success('Product deleted successfully')
                    dispatch(
                      getCategoryListAction({
                        onSuccess: () => {}
                      })
                    )
                  }
                })
              )
            }
          }}
          pagination={{
            totalCount: Number(categoryData?.length ?? 1)
            // perPage: Number(import.meta.REACT_APP_TABLE_LIMIT || 10)
          }}

             pageFe={true}
        />
      </Box>
    </div>
  )
}
