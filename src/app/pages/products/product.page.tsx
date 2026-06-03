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
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'
import { useRouter } from 'next/router'
import {toast} from 'react-hot-toast'
import {getCategoryListAction} from '../category/category.slice'
import {useDebounceValue, useMedia} from 'src/hooks'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {FILE_URL} from 'src/config'
import {useQuery} from 'src/hooks'

export const ProductListPage = () => {
  const router = useRouter()
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
  const perPage = 10

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
    // Set default selected category to 'All' if not already set
    setSelectedCategory(mappedCategory ? mappedCategory[0] : '')
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
    const newQuery = {
      ...query,
      page: page.toString()
    }

    router.replace(
      {pathname: router.pathname, query: newQuery},
      undefined,
      {shallow: true}
    )
  }, [query, router])

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
            onClick={() => router.push('/dash-product/add')}
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
              containerStyle={{flex: 1, minWidth: 120, marginRight: 12}}
            />
          )}
          <SelectField
            options={category}
            value={selectedCategory}
            onChangeValue={(data) => setSelectedCategory(data)}
            placeholder="Category"
          />
        </HStack>
        
        {!media.md && (
          <SearchField
            placeholder="Search Your Product"
            value={searchTxt}
            onChange={handleSearch}
            containerStyle={{flex: 1, minWidth: 120, marginRight: 12}}
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
                    <OptimizedImage
                      src={`${FILE_URL}/products/${datas?.[0]?.coloredImages?.[0]}`}
                      width={100}
                      height={70}
                      alt="product"
                      style={{height: '70px', width: '100px', objectFit: 'cover'}}
                    />
                  </div>
                )
              }
            ]}
            data={data || []}
            loading={loading}
            actions={{
              onEdit: (item: any) => {
                router.push(`/dash-product/update/${item.id}`)
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


// import React, {useEffect, useState, useCallback, useRef} from 'react'
// import {useDispatch} from 'src/store'
// import {delteProductAction, getProductListAction} from './product.slice'
// import {useSelector} from 'react-redux'
// import {
//   Box,
//   Button,
//   HStack,
//   SearchField,
//   SelectField,
//   Table
// } from 'src/app/common'
// import {useNavigate} from 'react-router-dom'
// import {toast} from 'react-hot-toast'
// import {getCategoryListAction} from '../category/category.slice'
// import {useDebounceValue, useMedia} from 'src/hooks'
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
// import {FILE_URL} from 'src/config'
// import {useQuery} from 'src/hooks'

// export const ProductListPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const query = useQuery()
//   const media = useMedia()
  
//   const [searchTxt, setSearchTxt] = useState('')
//   const debouncedSearchTxt = useDebounceValue(searchTxt, 500)
//   const [category, setCategory] = useState<any>([])
//   const [selectedCategory, setSelectedCategory] = useState<any>('')
  
//   // Add state for current page
//   const [currentPage, setCurrentPage] = useState(() => {
//     const page = query?.page ? Number(query.page) : 1
//     return page
//   })
  
//   const perPage = 10
  
//   const {data, loading, pagination}: any = useSelector((state: any) => state.product)
//   const {categoryData}: any = useSelector((state: any) => state.category)

//   const proudctCardRef = useRef<HTMLDivElement | null>(null)

//   // Fetch categories on mount
//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('Categories fetched successfully')
//       })
//     )
//   }, [dispatch])

//   // Map category data for select field
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any) => ({
//       id: item.id,
//       label: item.name,
//       value: item.name,
//       subCategory: item.subCategories
//     }))

//     mappedCategory?.unshift({
//       id: '',
//       label: 'All',
//       value: '',
//       subCategory: ''
//     })

//     setCategory(mappedCategory)
//     setSelectedCategory(mappedCategory ? mappedCategory[0] : '')
//   }, [categoryData])

//   // Fetch products whenever dependencies change - RESET TO PAGE 1 WHEN SEARCH OR CATEGORY CHANGES
//   useEffect(() => {
//     // Reset to page 1 when search term or category changes
//     setCurrentPage(1)
//   }, [debouncedSearchTxt, selectedCategory])

//   // Fetch products with current page
//   useEffect(() => {
//     const queryParams: any = {
//       page: currentPage,
//       limit: perPage,
//       sort: 'createdAt',
//       order: 'desc'
//     }

//     if (debouncedSearchTxt) {
//       queryParams.search = debouncedSearchTxt
//     }

//     if (selectedCategory?.id) {
//       queryParams.categoryId = selectedCategory.id
//     }

//     dispatch(
//       getProductListAction({
//         onSuccess: () => {
//           console.log('Products fetched successfully')
//         },
//         query: queryParams
//       })
//     )
//   }, [debouncedSearchTxt, selectedCategory, currentPage, dispatch, perPage])

//   const handleSearch = (e: any) => {
//     setSearchTxt(e.target.value)
//   }
  
//   const handlePdfDownload = () => {
//     if (proudctCardRef.current) {
//       html2canvas(proudctCardRef.current, {scale: 2, useCORS: true}).then(
//         (canvas) => {
//           const aspectRatio = canvas.width / canvas.height
//           const img = canvas.toDataURL('image/png')

//           const doc = new jsPDF({format: 'a4'})
//           doc.setFillColor(255, 255, 255)
//           doc.rect(
//             0,
//             0,
//             doc.internal.pageSize.width,
//             doc.internal.pageSize.height,
//             'F'
//           )

//           doc.addImage(
//             img,
//             'JPEG',
//             0,
//             0,
//             doc.internal.pageSize.width,
//             doc.internal.pageSize.width / aspectRatio
//           )
//           doc.save('productList.pdf')
//         }
//       )
//     }
//   }

//   const handlePageChange = useCallback((page: number) => {
//     // update state only; URL sync is handled in an effect to avoid duplicate params
//     setCurrentPage(page)
//   }, [])

//   // Keep the URL query params inside the hash route (HashRouter-compatible)
//   useEffect(() => {
//     try {
//       const fullHash = window.location.hash || ''
//       const hashContent = fullHash.startsWith('#') ? fullHash.slice(1) : fullHash
//       const [hashPath] = hashContent.split('?')

//       const params = new URLSearchParams()
//       if (currentPage && currentPage > 1) params.set('page', String(currentPage))
//       if (debouncedSearchTxt) params.set('search', debouncedSearchTxt)
//       if (selectedCategory?.id) params.set('categoryId', selectedCategory.id)

//       const searchString = params.toString()
//       const newHash = (hashPath || window.location.pathname) + (searchString ? `?${searchString}` : '')
//       const newUrl = window.location.pathname + window.location.search + '#' + newHash
//       window.history.replaceState({}, '', newUrl)
//     } catch (err) {
//       console.error('Failed to sync URL params into hash', err)
//     }
//   }, [currentPage, debouncedSearchTxt, selectedCategory])

//   const handleDelete = useCallback((item: any, onCloseModalHandler: any) => {
//     dispatch(
//       delteProductAction({
//         productId: item.id,
//         onSuccess: () => {
//           onCloseModalHandler()
//           toast.success('Product deleted successfully')
          
//           // Check if current page has any items after deletion
//           const remainingItems = data?.length - 1 || 0
//           let newPage = currentPage
          
//           // If this was the last item on the page and not on first page, go to previous page
//           if (remainingItems === 0 && currentPage > 1) {
//             newPage = currentPage - 1
//             setCurrentPage(newPage)
//           }
          
//           // Re-fetch current page data
//           const queryParams: any = {
//             page: newPage,
//             limit: perPage,
//             sort: 'createdAt',
//             order: 'desc'
//           }

//           if (debouncedSearchTxt) {
//             queryParams.search = debouncedSearchTxt
//           }

//           if (selectedCategory?.id) {
//             queryParams.categoryId = selectedCategory.id
//           }

//           dispatch(
//             getProductListAction({
//               onSuccess: () => {},
//               query: queryParams
//             })
//           )
//         }
//       })
//     )
//   }, [dispatch, currentPage, perPage, debouncedSearchTxt, selectedCategory, data])

//   // Clear search function
//   const clearSearch = () => {
//     setSearchTxt('')
//   }

//   return (
//     <div>
//       <Box>
//         <HStack justify="space-between" gap={'$4'} style={{margin: '20px 0', flexWrap: 'wrap'}}>
//           <HStack gap={'$2'} style={{flexWrap: 'wrap'}}>
//             <Button 
//               title="Add Product" 
//               onClick={() => navigate('add')}
//               style={{
//                 padding: !media.md ? '8px' : '8px 20px'
//               }}
//             />
//             <Button 
//               title="Download Pdf" 
//               onClick={handlePdfDownload}
//               style={{
//                 padding: !media.md ? '8px' : '8px 20px'
//               }}
//             />
//           </HStack>
          
//           {media.md && (
//             <div style={{flex: 1, minWidth: 200}}>
//               <SearchField
//                 placeholder="Search Your Product..."
//                 value={searchTxt}
//                 onChange={handleSearch}
//                 // onClear={clearSearch}
//                 containerStyle={{width: '100%'}}
//               />
//             </div>
//           )}
          
//           <SelectField
//             options={category}
//             value={selectedCategory}
//             onChangeValue={(data) => setSelectedCategory(data)}
//             placeholder="Category"
//             // style={{minWidth: 150}}
//           />
//         </HStack>
        
//         {!media.md && (
//           <div style={{marginBottom: '16px'}}>
//             <SearchField
//               placeholder="Search Your Product..."
//               value={searchTxt}
//               onChange={handleSearch}
//               // onClear={clearSearch}
//               containerStyle={{width: '100%'}}
//             />
//           </div>
//         )}
        
//         {/* Show search results info */}
//         {debouncedSearchTxt && (
//           <div style={{
//             padding: '8px 12px',
//             backgroundColor: '#f0f0f0',
//             borderRadius: '4px',
//             marginBottom: '16px',
//             fontSize: '14px'
//           }}>
//             Showing results for: <strong>"{debouncedSearchTxt}"</strong>
//             {pagination?.totalProducts > 0 && (
//               <span> ({pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''} found)</span>
//             )}
//             <Button
//               title="Clear"
//               onClick={clearSearch}
//               style={{
//                 marginLeft: '12px',
//                 padding: '4px 12px',
//                 fontSize: '12px'
//               }}
//               variant="text"
//             />
//           </div>
//         )}
        
//         <div ref={proudctCardRef}>
//           <Table
//             columns={[
//               {
//                 field: 'name',
//                 name: 'Name',
//                 render: (datas) => <div style={{fontWeight: 500}}>{datas}</div>
//               },
//               {
//                 field: 'discountedPrice',
//                 name: 'Price',
//                 render: (datas) => <div>रू. {datas?.toFixed(2)}</div>
//               },
//               {
//                 field: 'originalPrice',
//                 name: 'Original Price',
//                 render: (datas) => <div style={{textDecoration: 'line-through', color: '#999'}}>रू. {datas?.toFixed(2)}</div>
//               },
//               {
//                 field: 'images',
//                 name: 'Images',
//                 render: (datas) => (
//                   <div>
//                     {datas?.[0]?.coloredImage ? (
//                       <img
//                         src={`${FILE_URL}/products/${datas[0].coloredImage}`}
//                         style={{height: '70px', width: '100px', objectFit: 'cover', borderRadius: '4px'}}
//                         alt="product"
//                       />
//                     ) : (
//                       <div style={{
//                         height: '70px',
//                         width: '100px',
//                         backgroundColor: '#f0f0f0',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderRadius: '4px',
//                         color: '#999'
//                       }}>
//                         No image
//                       </div>
//                     )}
//                   </div>
//                 )
//               }
//             ]}
//             data={data || []}
//             loading={loading}
//             actions={{
//               onEdit: (item: any) => {
//                 navigate(`update/${item.id}`)
//               },
//               onDelete: handleDelete
//             }}
//             pagination={{
//               totalCount: Number(pagination?.totalProducts ?? 0),
//               perPage: perPage,
//               // currentPage: currentPage
//             }}
//             onPageChange={handlePageChange}
//           />
          
//           {/* No results message */}
//           {!loading && data?.length === 0 && (
//             <div style={{
//               textAlign: 'center',
//               padding: '40px',
//               backgroundColor: '#f9f9f9',
//               borderRadius: '8px',
//               marginTop: '20px'
//             }}>
//               <p style={{color: '#666', marginBottom: '16px'}}>
//                 {debouncedSearchTxt 
//                   ? `No products found matching "${debouncedSearchTxt}"` 
//                   : 'No products available'}
//               </p>
//               {debouncedSearchTxt && (
//                 <Button
//                   title="Clear Search"
//                   onClick={clearSearch}
//                   variant="outline"
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       </Box>
//     </div>
//   )
// }