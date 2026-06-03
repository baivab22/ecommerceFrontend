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
import { useRouter } from 'next/router'
import {toast} from 'react-hot-toast'
import {getCategoryListAction} from '../category/category.slice'
import {useDebounceValue, useMedia, useQuery} from 'src/hooks'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'
export const NewArrivalListPage = () => {
  const router = useRouter()
  const query = useQuery() as any
  const dispatch = useDispatch()
  const [searchTxt, setSearchTxt] = useState('')
  const debouncedSearchTxt = useDebounceValue(searchTxt, 500)

  const {data, loading, pagination}: any = useSelector((state: any) => state.product)

  const [category, setCategory] = useState<any>([])
  const [selectedCateory, setSelectedCategory] = useState<any>('')
  const {categoryData}: any = useSelector((state: any) => state.category)

  const currentPage = query?.page ? Number(query.page) : 1
  const perPage = 10

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [dispatch])

  useEffect(() => {
    const queryParams: any = {
      isNewArrivals: true,
      page: currentPage,
      limit: perPage
    }

    if (debouncedSearchTxt.trim()) {
      queryParams.search = debouncedSearchTxt.trim()
    }

    if (selectedCateory) {
      queryParams.categoryId = selectedCateory
    }

    dispatch(
      getProductListAction({
        onSuccess: () => {},
        query: queryParams
      })
    )
  }, [dispatch, currentPage, debouncedSearchTxt, selectedCateory])

  console.log(categoryData, 'category data called')

  useEffect(() => {
    console.log(categoryData, 'category data called')
    const mappedCategory = categoryData?.map((item: any) => ({
      id: item.id,
      label: item.name,
      value: item.id,
      subCategory: item.subCategories
    }))

    mappedCategory?.unshift({
      id: '',
      label: 'All',
      value: '',
      subCategory: ''
    })

    setCategory(mappedCategory)
  }, [categoryData])

  const handleSearch = (e: any) => {
    setSearchTxt(e.target.value)

    const newQuery: any = {
      ...query,
      page: '1'
    }

    if (e.target.value.trim()) {
      newQuery.search = e.target.value.trim()
    } else {
      delete newQuery.search
    }

    router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true
    })
  }

  console.log(data?.length, 'data length')
const media=useMedia();
  return (
    <div>
      <Box>
        <HStack justify="space-between" gap={'$4'} style={{margin: '20px 0'}}>
          {/* <Button title="Add Product" onClick={() => navigate('add')}></Button> */}
          <SearchField
            placeholder="Search Your Product"
            value={searchTxt}
            onChange={handleSearch}
          ></SearchField>



          {
            !media.md &&         <SelectField
            // defaultValue={category?.[0]}
            options={category}
            value={selectedCateory}
              containerStyle={{width:'max-content'}}
            // width={!media.md?"320px":"unset"}
            onChangeValue={(data) => setSelectedCategory(data)}
            placeholder={'Category'}
          />
          }
  
        </HStack>

                {
            media.md &&         <SelectField
            // defaultValue={category?.[0]}
            options={category}
            value={selectedCateory}
            // width={!media.md?"320px":"unset"}
            onChangeValue={(data) => setSelectedCategory(data)}
            containerStyle={{width:'max-content'}}
            placeholder={'Category'}
          />
          }
  

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
                    <OptimizedImage
                      src={datas?.[0]?.url}
                      alt="Product image"
                      width={100}
                      height={70}
                      style={{height: '70px', width: '100px'}}
                    />
                  )}
                </div>
              )
            }
          ]}
          data={data || []}
          loading={loading}
          actions={{
            onView: (item: any) => {
              router.push(`/dash-new-arrivals/view/${item.id}`)
            },

            onEdit: (item: any) => {
              console.log(item.id, 'item id to delete')
              router.push(`/dash-new-arrivals/update/${item.id}`)
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
            totalCount: Number(pagination?.totalProducts ?? 0),
            perPage: perPage
          }}
          onPageChange={(page: number) => {
            const newQuery: any = {
              ...query,
              page: page.toString()
            }
            router.replace({ pathname: router.pathname, query: newQuery }, undefined, {
              shallow: true
            })
          }}
        />
      </Box>
    </div>
  )
}
