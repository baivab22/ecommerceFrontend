import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch} from 'src/store'

import {
  getProductListAction,
  delteProductAction
} from '../products/product.slice'
import {useSelector} from 'react-redux'
import {
  Box,
  Button,
  HStack,
  SearchField,
  SelectField,
  Table
} from 'src/app/common'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import {getCategoryListAction} from '../category/category.slice'
import {useDebounceValue} from 'src/hooks'
export const NewArrivalListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchTxt, setSearchTxt] = useState('')
  const [newArrivalProducts, setNewArrivalProducts] = useState([])

  const {data}: any = useSelector((state: any) => state.product)

  const [category, setCategory] = useState<any>([])
  const [selectedCateory, setSelectedCategory] = useState<any>('')
  const {categoryData}: any = useSelector((state: any) => state.category)

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [])

  useEffect(() => {
    console.log('all product', data)
    const newArrivalProductsss = data?.filter((item: any, index: number) => {
      return item.isNewArrivals === true
    })

    console.log(newArrivalProductsss, 'new arrival list')

    setNewArrivalProducts(newArrivalProductsss)
  }, [data])

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

    // const allCategory = [
    //   {},
    //   mappedCategory
    // ]

    // console.log(mappedCategory, 'mapped category from products')
    mappedCategory?.unshift({
      id: '',
      label: 'All',
      value: '',
      subCategory: ''
    })

    setCategory(mappedCategory)
  }, [categoryData])

  useEffect(() => {
    getProductListAction({
      onSuccess: () => {},
      query: {isNewArrivals: true}
    })
  }, [])

  const handleSearch = (e: any) => {
    // console.log(e.target.value, 'searchValue')
    setSearchTxt(e.target.value)

    // const debounceValue = useDebounceValue(e.target.value)
  }

  useEffect(() => {
    console.log(selectedCateory, 'selected category name')

    dispatch(
      getProductListAction({
        onSuccess: () => {},
        query: {isNewArrivals: true}
      })
    )
  }, [searchTxt, selectedCateory])

  console.log(data?.length, 'data length')

  return (
    <div>
      <Box>
        <HStack justify="space-between" gap={'$4'} style={{margin: '20px 0'}}>
          <Button title="Add Product" onClick={() => navigate('add')}></Button>
          <SearchField
            placeholder="Search Your Product"
            onChange={handleSearch}
          ></SearchField>
          <SelectField
            // defaultValue={category?.[0]}
            options={category}
            value={selectedCateory}
            width="320px"
            onChangeValue={(data) => setSelectedCategory(data)}
            placeholder={'Filter Product By Category'}
          />
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
              field: 'originalPrice',
              name: 'Price',
              render: (datas) => <div>{datas}</div>
            },
            {
              field: 'originalPrice',
              name: 'Original Price',
              render: (datas) => <div>{datas}</div>
            },
            {
              field: 'discountPercentage',
              name: 'Discounted Price',
              render: (datas) => <div>{datas}</div>
            },
            {
              field: 'image',
              name: 'Images',
              render: (datas) => (
                <div>
                  {datas?.[0] && (
                    <img
                      src={datas?.[0]?.url}
                      style={{height: '70px', width: '100px'}}
                    ></img>
                  )}
                </div>
              )
            }
          ]}
          data={newArrivalProducts && newArrivalProducts}
          actions={{
            onView: (item: any) => {
              navigate(`view/${item.id}`)
            },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              navigate(`update/${item.id}`)
            },
            onDelete: (item: any, onCloseModalHandler) => {
              console.log(item.id, 'item to be deleted')

              dispatch(
                delteProductAction({
                  productId: item.id,
                  onSuccess: (data: any) => {
                    onCloseModalHandler()
                    toast.success('Product deleted successfully')
                    dispatch(
                      getProductListAction({
                        onSuccess: () => {}
                      })
                    )
                  }
                })
              )
            }
          }}
          pagination={{
            totalCount: Number(data?.length ?? 1),
            perPage: Number(5)
          }}

             pageFe={true}
        />
      </Box>
    </div>
  )
}
