import React, {useEffect, useState, useCallback, useRef} from 'react'
import {useDispatch} from 'src/store'
import {delteProductAction, getProductListAction} from './product.slice'
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
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {FILE_URL} from 'src/config'
import {useQuery} from 'src/hooks'

export const ProductListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const query = useQuery()
  const [searchTxt, setSearchTxt] = useState('')
  const debouncedSearchTxt = useDebounceValue(searchTxt, 500)

  const {data, loading, pagination}: any = useSelector((state: any) => state.product)

  console.log(data, 'data', pagination, 'totalCount')
  
  const [category, setCategory] = useState<any>([])
  const [selectedCateory, setSelectedCategory] = useState<any>('')
  const {categoryData}: any = useSelector((state: any) => state.category)

  const currentPage = query?.page ? Number(query.page) : 1
  const perPage = 5

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [dispatch])

  useEffect(() => {
    const mappedCategory = categoryData?.map((item: any, index: number) => {
      return {
        id: item.id,
        label: item.name,
        value: item.name,
        subCategory: item.subCategories
      }
    })

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
  }

  // Fetch products whenever page, search, or category changes
  useEffect(() => {
    const queryParams: any = {
      page: currentPage,
      limit: perPage
    }

    if (debouncedSearchTxt) {
      queryParams.search = debouncedSearchTxt
    }

    if (selectedCateory?.id) {
      queryParams.categoryId = selectedCateory.id
    }

    dispatch(
      getProductListAction({
        onSuccess: () => {
          console.log('Products fetched successfully')
        },
        query: queryParams
      })
    )
  }, [debouncedSearchTxt, selectedCateory, currentPage, dispatch])

  const proudctCardRef = useRef<HTMLDivElement | null>(null)
  
  const handlePdfDownload = () => {
    if (proudctCardRef.current) {
      html2canvas(proudctCardRef.current, {scale: 2, useCORS: true}).then(
        (canvas) => {
          console.log(canvas, 'canvas value')
          const aspectRatio = canvas.width / canvas.height
          var img = canvas.toDataURL('image/png')
          console.log(img, 'required img')

          var doc = new jsPDF({format: 'a4'})
          doc.setFillColor(255, 255, 255)
          doc.rect(
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height,
            'F'
          )

          doc.addImage(
            img,
            'JPEG',
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.width / aspectRatio
          )
          doc.save('productList.pdf')
        }
      )
    }
  }

  const handlePageChange = useCallback((page: number) => {
    // Page change is already handled by the Table component
    // which updates the URL query params
    console.log('Page changed to:', page)
  }, [])

  const handleDelete = useCallback((item: any, onCloseModalHandler: any) => {
    dispatch(
      delteProductAction({
        productId: item.id,
        onSuccess: (data: any) => {
          onCloseModalHandler()
          toast.success('Product deleted successfully')
          
          // Re-fetch current page data
          const queryParams: any = {
            page: currentPage,
            limit: perPage
          }

          if (debouncedSearchTxt) {
            queryParams.search = debouncedSearchTxt
          }

          if (selectedCateory?.id) {
            queryParams.categoryId = selectedCateory.id
          }

          dispatch(
            getProductListAction({
              onSuccess: () => {},
              query: queryParams
            })
          )
        }
      })
    )
  }, [dispatch, currentPage, debouncedSearchTxt, selectedCateory])

  return (
    <div>
      <Box>
        <HStack justify="space-between" gap={'$4'} style={{margin: '20px 0'}}>
          <Button title="Add Product" onClick={() => navigate('add')}></Button>
          <Button title="Download Pdf" onClick={handlePdfDownload}></Button>
          <SearchField
            placeholder="Search Your Product"
            value={searchTxt}
            onChange={handleSearch}
          ></SearchField>
          <SelectField
            options={category}
            value={selectedCateory}
            width="320px"
            onChangeValue={(data) => setSelectedCategory(data)}
            placeholder={'Filter Product By Category'}
          />
        </HStack>
        <div ref={proudctCardRef}>
          <Table
            columns={[
              {
                field: 'name',
                name: 'Name',
                render: (datas) => {
                  return <div>{datas}</div>
                }
              },
              {
                field: 'discountedPrice',
                name: 'Price',
                render: (datas) => <div>{datas}</div>
              },
              {
                field: 'originalPrice',
                name: 'Original Price',
                render: (datas) => <div>{datas}</div>
              },
              {
                field: 'images',
                name: 'Images',
                render: (datas) => (
                  <div>
                    <img
                      src={`https://abhushangallery.com/products/${datas?.[0]?.coloredImage}`}
                      style={{height: '70px', width: '100px'}}
                      alt="product"
                    ></img>
                  </div>
                )
              }
            ]}
            data={data || []}
            loading={loading}
            actions={{
              onEdit: (item: any) => {
                navigate(`update/${item.id}`)
              },
              onDelete: handleDelete
            }}
            pagination={{
              totalCount: Number(pagination.totalProducts ?? 0),
              perPage: perPage
            }}
            onPageChange={handlePageChange}
          />
        </div>
      </Box>
    </div>
  )
}