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
  deleteShopByBudgetAction,
  getShopByBudgetListAction
} from './shopByBudget.slice'
export const ShopByBudget = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [category, setCategory] = useState<any>()
  const [selectedCateory, setSelectedCategory] = useState<any>()
  const {shopByBudgetData}: any = useSelector(
    (state: any) => state.shopByBudget
  )

  useEffect(() => {
    dispatch(
      getShopByBudgetListAction({
        onSuccess: () => console.log('Shop By Budget fetched Successfully')
      })
    )
  }, [])

  return (
    <div style={{marginBottom: '40px'}}>
      <Box>
        <HStack
          justify="space-between"
          style={{
            margin: '20px 0',
            marginBottom: '30px'
          }}
          gap="$3"
        >
          <Button
            title="Add Shop By Budget"
            onClick={() => router.push('/dash-shopByBudget/add')}
          ></Button>
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
          data={shopByBudgetData}
          actions={{
            // onView: (item: any) => {
            //   navigate(`view/${item.id}`)
            // },

            // onEdit: (item: any) => {
            //   console.log(item.id, 'item id to delete')
            //   navigate(`update/${item._id}`)
            // },
            onDelete: (item: any, onCloseModalHandler) => {
              dispatch(
                deleteShopByBudgetAction({
                  shopByBudgetId: item._id,
                  onSuccess: (data: any) => {
                    onCloseModalHandler()
                    toast.success('ShopByBudget deleted successfully')
                    dispatch(
                      getShopByBudgetListAction({
                        onSuccess: () => {}
                      })
                    )
                  }
                })
              )
            }
          }}
          pagination={{
            totalCount: Number(shopByBudgetData?.length ?? 1)
            // perPage: Number(import.meta.REACT_APP_TABLE_LIMIT || 10)
          }}
        />
      </Box>
    </div>
  )
}
