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
import {useDebounceValue, useMedia} from 'src/hooks'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {FILE_URL} from 'src/config'
import {useQuery} from 'src/hooks'

export const ProductListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const query = useQuery()
  const media = useMedia()
  
  const [searchTxt, setSearchTxt] = useState('')
  const debouncedSearchTxt = useDebounceValue(searchTxt, 500)
  const [category, setCategory] = useState<any>([])
  const [selectedCategory, setSelectedCategory] = useState<any>('')
  
  const {data, loading, pagination}: any = useSelector((state: any) => state.product)
  const {categoryData}: any = useSelector((state: any) => state.category)

  const proudctCardRef = useRef<HTMLDivElement | null>(null)
  
  const currentPage = query?.page ? Number(query.page) : 1
  const perPage = 5

  // Fetch categories on mount
  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('Categories fetched successfully')
      })
    )
  }, [dispatch])

  // Map category data for select field
  useEffect(() => {
    const mappedCategory = categoryData?.map((item: any) => ({
      id: item.id,
      label: item.name,
      value: item.name,
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

  // Fetch products whenever dependencies change
  useEffect(() => {
    const queryParams: any = {
      page: currentPage,
      limit: perPage,
      sort: 'createdAt',
      order: 'desc'
    }

    if (debouncedSearchTxt) {
      queryParams.search = debouncedSearchTxt
    }

    if (selectedCategory?.id) {
      queryParams.categoryId = selectedCategory.id
    }

    dispatch(
      getProductListAction({
        onSuccess: () => {
          console.log('Products fetched successfully')
        },
        query: queryParams
      })
    )
  }, [debouncedSearchTxt, selectedCategory, currentPage, dispatch, perPage])

  const handleSearch = (e: any) => {
    setSearchTxt(e.target.value)
  }
  
  const handlePdfDownload = () => {
    if (proudctCardRef.current) {
      html2canvas(proudctCardRef.current, {scale: 2, useCORS: true}).then(
        (canvas) => {
          const aspectRatio = canvas.width / canvas.height
          const img = canvas.toDataURL('image/png')

          const doc = new jsPDF({format: 'a4'})
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
    console.log('Page changed to:', page)
  }, [])

  const handleDelete = useCallback((item: any, onCloseModalHandler: any) => {
    dispatch(
      delteProductAction({
        productId: item.id,
        onSuccess: () => {
          onCloseModalHandler()
          toast.success('Product deleted successfully')
          
          // Re-fetch current page data with sort parameters
          const queryParams: any = {
            page: currentPage,
            limit: perPage,
            sort: 'createdAt',
            order: 'desc'
          }

          if (debouncedSearchTxt) {
            queryParams.search = debouncedSearchTxt
          }

          if (selectedCategory?.id) {
            queryParams.categoryId = selectedCategory.id
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
  }, [dispatch, currentPage, perPage, debouncedSearchTxt, selectedCategory])

  return (
    <div>
      <Box>
        <HStack justify="space-between" gap={'$4'} style={{margin: '20px 0'}}>
          <Button 
            title="Add Product" 
            onClick={() => navigate('add')}
            style={{
              padding: !media.md ? '8px' : '8px 20px'
            }}
          />
          <Button 
            title="Download Pdf" 
            onClick={handlePdfDownload}
            style={{
              padding: !media.md ? '8px' : '8px 20px'
            }}
          />
          {media.md && (
            <SearchField
              placeholder="Search Your Product"
              value={searchTxt}
              onChange={handleSearch}
            />
          )}
          <SelectField
            options={category}
            value={selectedCategory}
            onChangeValue={(data) => setSelectedCategory(data)}
            placeholder="Filter Product By Category"
          />
        </HStack>
        
        {!media.md && (
          <SearchField
            placeholder="Search Your Product"
            value={searchTxt}
            onChange={handleSearch}
          />
        )}
        
        <div ref={proudctCardRef}>
          <Table
            columns={[
              {
                field: 'name',
                name: 'Name',
                render: (datas) => <div>{datas}</div>
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
                      src={`${FILE_URL}/products/${datas?.[0]?.coloredImage}`}
                      style={{height: '70px', width: '100px', objectFit: 'cover'}}
                      alt="product"
                    />
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
              totalCount: Number(pagination?.totalProducts ?? 0),
              perPage: perPage
            }}
            onPageChange={handlePageChange}
          />
        </div>
      </Box>
    </div>
  )
}