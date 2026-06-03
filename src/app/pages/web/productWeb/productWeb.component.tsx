// import React, { useEffect, useRef, useState } from 'react'
// import { AiOutlineSortAscending } from 'react-icons/ai'
// import {
//   CheckBox,
//   HStack,
//   InputField,
//   Title,
//   VStack
// } from 'src/app/common'
// import { useDispatch, useSelector } from 'src/store'
// import { getCategoryListAction } from '../../category/category.slice'
// import { getProductListAction } from '../../products/product.slice'
// import { ProductCard } from 'src/app/components'
// import { useMedia, useQuery } from 'src/hooks'
// import { useUpdateQuery } from 'src/hooks/useUpdateQuery.hook'
// import { FaSortAmountUp } from 'react-icons/fa'
// import { MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight } from 'react-icons/md'

// // Types
// interface Product {
//   id: string
//   name: string
//   description: string
//   originalPrice: number
//   discountedPrice: number
//   stockQuantity: number
//   isBestSelling: boolean
//   isNewArrivals: boolean
//   isHotSelling: boolean
//   images: Array<{
//     _id: string
//     colorName: string
//     coloredImage: string
//     __v: number
//   }>
//   category: {
//     id: string
//     name: string
//     image: string
//     subCategories: string[]
//   }
//   subCategory: {
//     id: string
//     name: string
//     subCategories: any[]
//   }
//   nestedSubCategory?: {
//     id: string
//     name: string
//   }
// }

// interface Category {
//   id: string
//   name: string
//   image: string
//   subCategories: Category[]
// }

// interface QueryParams {
//   sort?: string
//   order?: string
//   categoryId?: string
//   subCategoryId?: string
//   nestedSubCategoryId?: string
//   categoryname?: string
//   subCategoryName?: string
//   nestedSubCategoryName?: string
//   minPrice?: string
//   maxPrice?: string
//   search?: string
//   isBestSelling?: string
//   isNewArrivals?: string
//   page?: string
//   limit?: string
// }

// interface SelectedFilters {
//   categoryId: string
//   categoryName: string
//   subCategoryId: string
//   subCategoryName: string
//   nestedSubCategoryId: string
//   nestedSubCategoryName: string
// }

// interface PaginationInfo {
//   currentPage: number
//   totalPages: number
//   totalProducts: number
//   hasNextPage: boolean
//   hasPrevPage: boolean
// }

// // Skeleton Loader Component
// const ProductCardSkeleton: React.FC = () => {
//   return (
//     <div
//       style={{
//         border: '1px solid #e5e7eb',
//         borderRadius: '8px',
//         padding: '12px',
//         backgroundColor: 'white',
//         // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//       }}
//     >
//       <div
//         style={{
//           width: '100%',
//           aspectRatio: '1/1',
//           backgroundColor: '#e5e7eb',
//           borderRadius: '6px',
//           marginBottom: '12px'
//         }}
//       />
//       <div
//         style={{
//           height: '16px',
//           backgroundColor: '#e5e7eb',
//           borderRadius: '4px',
//           marginBottom: '8px',
//           width: '80%'
//         }}
//       />
//       <div
//         style={{
//           height: '14px',
//           backgroundColor: '#e5e7eb',
//           borderRadius: '4px',
//           marginBottom: '12px',
//           width: '60%'
//         }}
//       />
//       <div
//         style={{
//           display: 'flex',
//           gap: '8px',
//           marginBottom: '12px'
//         }}
//       >
//         <div
//           style={{
//             height: '20px',
//             backgroundColor: '#e5e7eb',
//             borderRadius: '4px',
//             width: '40%'
//           }}
//         />
//         <div
//           style={{
//             height: '20px',
//             backgroundColor: '#e5e7eb',
//             borderRadius: '4px',
//             width: '30%'
//           }}
//         />
//       </div>
//       <div
//         style={{
//           height: '36px',
//           backgroundColor: '#e5e7eb',
//           borderRadius: '6px',
//           width: '100%'
//         }}
//       />
//       <style>{`
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
//   return (
//     <div className="productListContainer">
//       {Array.from({ length: count }).map((_, index) => (
//         <ProductCardSkeleton key={index} />
//       ))}
//     </div>
//   )
// }

// // Pagination Component
// const Pagination: React.FC<{
//   paginationInfo: PaginationInfo
//   onPageChange: (page: number) => void
//   onLimitChange: (limit: number) => void
//   currentLimit: number
//   isMobile: boolean
// }> = ({ paginationInfo, onPageChange, onLimitChange, currentLimit, isMobile }) => {
//   const { currentPage, totalPages, totalProducts, hasNextPage, hasPrevPage } = paginationInfo
//   const [showLimitDropdown, setShowLimitDropdown] = useState(false)
//   const limitDropdownRef = useRef<HTMLDivElement>(null)

//   const limitOptions = [5, 10, 15, 20, 25]

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (limitDropdownRef.current && !limitDropdownRef.current.contains(event.target as Node)) {
//         setShowLimitDropdown(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   // Generate page numbers to display
//   const getPageNumbers = () => {
//     const pages: (number | string)[] = []
//     const maxVisible = isMobile ? 3 : 5
    
//     if (totalPages <= maxVisible + 2) {
//       // Show all pages if total is small
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i)
//       }
//     } else {
//       // Always show first page
//       pages.push(1)
      
//       // Calculate range around current page
//       let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
//       let end = Math.min(totalPages - 1, start + maxVisible - 1)
      
//       // Adjust start if we're near the end
//       if (end === totalPages - 1) {
//         start = Math.max(2, end - maxVisible + 1)
//       }
      
//       // Add ellipsis if needed
//       if (start > 2) {
//         pages.push('...')
//       }
      
//       // Add middle pages
//       for (let i = start; i <= end; i++) {
//         pages.push(i)
//       }
      
//       // Add ellipsis if needed
//       if (end < totalPages - 1) {
//         pages.push('...')
//       }
      
//       // Always show last page
//       pages.push(totalPages)
//     }
    
//     return pages
//   }

//   const pageNumbers = getPageNumbers()

//   const buttonStyle: React.CSSProperties = {
//     padding: isMobile ? '6px 10px' : '8px 12px',
//     border: '1px solid #ddd',
//     background: 'white',
//     cursor: 'pointer',
//     borderRadius: '4px',
//     fontSize: isMobile ? '12px' : '14px',
//     minWidth: isMobile ? '32px' : '36px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'all 0.2s'
//   }

//   const activeButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     background: 'black',
//     color: 'white',
//     fontWeight: 'bold',
//     border: '1px solid black'
//   }

//   const disabledButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     cursor: 'not-allowed',
//     opacity: 0.5,
//     background: '#f5f5f5'
//   }

//   if (totalPages <= 1 && totalProducts <= Math.min(...limitOptions)) {
//     return null
//   }

//   return (
//     <VStack gap="$3" style={{ width: '100%', alignItems: 'center', marginTop: '24px' }}>
//       {/* Top section with info and limit selector */}
//       <HStack 
//         justify="space-between" 
//         align="center" 
//         style={{ 
//           width: '100%', 
//           flexWrap: isMobile ? 'wrap' : 'nowrap',
//           gap: isMobile ? '12px' : '16px'
//         }}
//       >
//         <div style={{ 
//           fontSize: isMobile ? '12px' : '14px', 
//           color: '#666',
//           textAlign: isMobile ? 'center' : 'left',
//           flex: isMobile ? '1 1 100%' : '1'
//         }}>
//           Showing page {currentPage} of {totalPages} ({totalProducts} total products)
//         </div>
        
//         {/* Items per page dropdown */}
//         <div 
//           ref={limitDropdownRef}
//           style={{ 
//             position: 'relative',
//             flex: isMobile ? '1 1 100%' : '0 0 auto'
//           }}
//         >
//           <HStack 
//             align="center" 
//             gap="$2"
//             style={{
//               justifyContent: isMobile ? 'center' : 'flex-end'
//             }}
//           >
//             <span style={{ 
//               fontSize: isMobile ? '12px' : '14px', 
//               color: '#666',
//               whiteSpace: 'nowrap'
//             }}>
//               Items per page:
//             </span>
//             <button
//               onClick={() => setShowLimitDropdown(!showLimitDropdown)}
//               style={{
//                 padding: isMobile ? '6px 12px' : '8px 16px',
//                 border: '1px solid #ddd',
//                 borderRadius: '4px',
//                 background: 'white',
//                 cursor: 'pointer',
//                 fontSize: isMobile ? '12px' : '14px',
//                 fontWeight: '500',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 minWidth: '70px',
//                 justifyContent: 'space-between'
//               }}
//             >
//               {currentLimit}
//               <MdExpandMore 
//                 style={{ 
//                   transform: showLimitDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
//                   transition: 'transform 0.2s'
//                 }} 
//               />
//             </button>
//           </HStack>

//           {/* Dropdown menu */}
//           {showLimitDropdown && (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '100%',
//                 right: 0,
//                 marginTop: '4px',
//                 background: 'white',
//                 border: '1px solid #ddd',
//                 borderRadius: '4px',
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                 zIndex: 1000,
//                 minWidth: '80px'
//               }}
//             >
//               {limitOptions.map((limit) => (
//                 <button
//                   key={limit}
//                   onClick={() => {
//                     onLimitChange(limit)
//                     setShowLimitDropdown(false)
//                   }}
//                   style={{
//                     width: '100%',
//                     padding: '8px 16px',
//                     border: 'none',
//                     background: currentLimit === limit ? '#f0f0f0' : 'white',
//                     cursor: 'pointer',
//                     fontSize: isMobile ? '12px' : '14px',
//                     textAlign: 'left',
//                     fontWeight: currentLimit === limit ? 'bold' : 'normal',
//                     transition: 'background 0.2s'
//                   }}
//                   onMouseEnter={(e) => {
//                     if (currentLimit !== limit) {
//                       e.currentTarget.style.background = '#f8f8f8'
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentLimit !== limit) {
//                       e.currentTarget.style.background = 'white'
//                     }
//                   }}
//                 >
//                   {limit}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </HStack>
      
//       {/* Pagination controls */}
//       {totalPages > 1 && (
//         <HStack gap={isMobile ? '$1' : '$2'} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
//           {/* Previous Button */}
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={!hasPrevPage}
//             style={!hasPrevPage ? disabledButtonStyle : buttonStyle}
//             aria-label="Previous page"
//           >
//             <MdChevronLeft size={isMobile ? 16 : 20} />
//             {!isMobile && <span style={{ marginLeft: '4px' }}>Prev</span>}
//           </button>

//           {/* Page Numbers */}
//           {pageNumbers.map((page, index) => {
//             if (page === '...') {
//               return (
//                 <span 
//                   key={`ellipsis-${index}`} 
//                   style={{ 
//                     padding: isMobile ? '6px 4px' : '8px 6px',
//                     fontSize: isMobile ? '12px' : '14px'
//                   }}
//                 >
//                   ...
//                 </span>
//               )
//             }
            
//             return (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(page as number)}
//                 style={currentPage === page ? activeButtonStyle : buttonStyle}
//                 aria-label={`Go to page ${page}`}
//                 aria-current={currentPage === page ? 'page' : undefined}
//               >
//                 {page}
//               </button>
//             )
//           })}

//           {/* Next Button */}
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={!hasNextPage}
//             style={!hasNextPage ? disabledButtonStyle : buttonStyle}
//             aria-label="Next page"
//           >
//             {!isMobile && <span style={{ marginRight: '4px' }}>Next</span>}
//             <MdChevronRight size={isMobile ? 16 : 20} />
//           </button>
//         </HStack>
//       )}

//       {/* Quick jump to first/last on desktop */}
//       {!isMobile && totalPages > 5 && (
//         <HStack gap="$2" style={{ fontSize: '12px', color: '#666' }}>
//           {currentPage !== 1 && (
//             <button
//               onClick={() => onPageChange(1)}
//               style={{
//                 ...buttonStyle,
//                 fontSize: '12px',
//                 padding: '4px 8px'
//               }}
//             >
//               Go to first
//             </button>
//           )}
//           {currentPage !== totalPages && (
//             <button
//               onClick={() => onPageChange(totalPages)}
//               style={{
//                 ...buttonStyle,
//                 fontSize: '12px',
//                 padding: '4px 8px'
//               }}
//             >
//               Go to last
//             </button>
//           )}
//         </HStack>
//       )}
//     </VStack>
//   )
// }

// // Hierarchical Category Item Component
// const CategoryItem: React.FC<{
//   category: Category
//   level?: number
//   selectedFilters: SelectedFilters
//   onFilterChange: (filters: Partial<SelectedFilters>) => void
// }> = ({ category, level = 0, selectedFilters, onFilterChange }) => {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const hasSubCategories = category.subCategories && category.subCategories.length > 0
  
//   const paddingLeft = level * 20 + 'px'
  
//   const handleCategoryClick = () => {
//     const filterType = level === 0 ? 'categoryId' : level === 1 ? 'subCategoryId' : 'nestedSubCategoryId'
//     const nameType = level === 0 ? 'categoryName' : level === 1 ? 'subCategoryName' : 'nestedSubCategoryName'
    
//     console.log('Category clicked:', { level, categoryId: category.id, categoryName: category.name, filterType, nameType })
    
//     onFilterChange({
//       [filterType]: category.id,
//       [nameType]: category.name,
//       // Clear lower level filters when selecting higher level
//       ...(level === 0 && {
//         subCategoryId: '',
//         subCategoryName: '',
//         nestedSubCategoryId: '',
//         nestedSubCategoryName: ''
//       }),
//       ...(level === 1 && {
//         nestedSubCategoryId: '',
//         nestedSubCategoryName: ''
//       })
//     })
//   }

//   const isSelected = (): boolean => {
//     if (level === 0) return selectedFilters.categoryId === category.id
//     if (level === 1) return selectedFilters.subCategoryId === category.id
//     if (level === 2) return selectedFilters.nestedSubCategoryId === category.id
//     return false
//   }

//   return (
//     <div style={{ paddingLeft }}>
//       <HStack 
//         align="center" 
//         justify="space-between" 
//         style={{
//           cursor: 'pointer',
//           padding: '8px 0',
//           borderBottom: level === 0 ? '1px solid #eee' : 'none'
//         }}
//       >
//         <HStack align="center" gap="$2">
//           <CheckBox
//             name={category.name}
//             label={category.name}
//             handleCheckboxChange={handleCategoryClick}
//             check={isSelected()}
//           />
//         </HStack>
//         {hasSubCategories && (
//           <div 
//             onClick={(e) => {
//               e.stopPropagation()
//               setIsExpanded(!isExpanded)
//             }}
//             style={{ cursor: 'pointer', padding: '4px' }}
//           >
//             {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
//           </div>
//         )}
//       </HStack>
      
//       {hasSubCategories && isExpanded && (
//         <div style={{ marginTop: '8px' }}>
//           {category.subCategories.map((subCategory) => (
//             <CategoryItem
//               key={subCategory.id}
//               category={subCategory}
//               level={level + 1}
//               selectedFilters={selectedFilters}
//               onFilterChange={onFilterChange}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export const ProductListSideComp: React.FC = () => {
//   const query = useQuery() as QueryParams
//   const { categoryData }: { categoryData: Category[] } = useSelector((state: any) => state.category)
//   const dispatch = useDispatch()
//   const updateQuery = useUpdateQuery()
//   const media = useMedia()

//   const selectedFilters: SelectedFilters = {
//     categoryId: query.categoryId || '',
//     categoryName: query.categoryname || '',
//     subCategoryId: query.subCategoryId || '',
//     subCategoryName: query.subCategoryName || '',
//     nestedSubCategoryId: query.nestedSubCategoryId || '',
//     nestedSubCategoryName: query.nestedSubCategoryName || ''
//   }

//   console.log('ProductListSideComp - Query params:', query)
//   console.log('ProductListSideComp - Selected filters:', selectedFilters)

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => {}
//       })
//     )
//   }, [dispatch])

//   const handleFilterChange = (newFilters: Partial<SelectedFilters>) => {
//     console.log('Filter change requested:', newFilters)
//     // Reset to page 1 when filters change
//     updateQuery({
//       ...query,
//       ...newFilters,
//       page: '1'
//     })
//   }

//   const clearAllFilters = () => {
//     console.log('Clearing all filters')
//     updateQuery({
//       ...query,
//       categoryId: '',
//       categoryname: '',
//       subCategoryId: '',
//       subCategoryName: '',
//       nestedSubCategoryId: '',
//       nestedSubCategoryName: '',
//       minPrice: '',
//       maxPrice: '',
//       isBestSelling: '',
//       isNewArrivals: '',
//       page: '1'
//     })
//   }

//   const isMobile = !media.md
//   const [showFilters, setShowFilters] = React.useState(!isMobile)

//   return (
//     <VStack
//       align="flex-start"
//       justify="space-between"
//       style={{ width: '100%' }}
//       gap="$4"
//     >
//       {isMobile && (
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           style={{
//             width: '100%',
//             padding: '12px',
//             background: '#e3f2fd',
//             border: '1px solid #2196f3',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: 'bold',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}
//         >
//           <span>Filters & Categories</span>
//           <span>{showFilters ? '▲' : '▼'}</span>
//         </button>
//       )}

//       {(!isMobile || showFilters) && (
//         <>
//           <HStack justify="space-between" align="center" style={{ width: '100%' }}>
//             <Title primaryHeading>Categories</Title>
//             {(selectedFilters.categoryId || selectedFilters.subCategoryId || selectedFilters.nestedSubCategoryId) && (
//               <button 
//                 onClick={clearAllFilters}
//                 style={{
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   padding: '4px 8px',
//                   fontSize: '12px',
//                   cursor: 'pointer',
//                   background: 'black',
//                   color: 'white'
//                 }}
//               >
//                 Clear All
//               </button>
//             )}
//           </HStack>

//           {(selectedFilters.categoryName || selectedFilters.subCategoryName || selectedFilters.nestedSubCategoryName) && (
//             <div style={{
//               background: '#f5f5f5',
//               padding: '8px',
//               borderRadius: '4px',
//               fontSize: '11px',
//               width: '100%'
//             }}>
//               <strong>Selected:</strong>
//               <div style={{ marginTop: '4px' }}>
//                 {selectedFilters.categoryName && (
//                   <span>{selectedFilters.categoryName}</span>
//                 )}
//                 {selectedFilters.subCategoryName && (
//                   <span> → {selectedFilters.subCategoryName}</span>
//                 )}
//                 {selectedFilters.nestedSubCategoryName && (
//                   <span> → {selectedFilters.nestedSubCategoryName}</span>
//                 )}
//               </div>
//             </div>
//           )}

//           <div
//             style={{
//               width: '100%',
//               maxHeight: isMobile ? '150px' : '300px', 
//               overflowY: 'auto',
//               border: '1px solid #eee',
//               borderRadius: '4px',
//               padding: '8px'
//             }}
//           >
//             <div
//               onClick={clearAllFilters}
//               style={{
//                 padding: '8px',
//                 cursor: 'pointer',
//                 borderRadius: '4px',
//                 background: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'black' : 'transparent',
//                 fontWeight: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'bold' : 'normal',
//                 marginBottom: '4px',
//                 color: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'white' : 'black'
//               }}
//             >
//               All Categories
//             </div>
            
//             {categoryData?.map((category) => (
//               <CategoryItem
//                 key={category.id}
//                 category={category}
//                 level={0}
//                 selectedFilters={selectedFilters}
//                 onFilterChange={handleFilterChange}
//               />
//             ))}
//           </div>

//           <VStack align="flex-start" style={{ width: '100%' }} gap="$2">
//             <Title primaryHeading>Price Range</Title>
//             <HStack
//               style={{ width: '100%' }}
//               gap="$2"
//               align="center"
//               justify="center"
//             >
//               <VStack gap="$1" style={{ flex: 1 }}>
//                 <Title subheading style={{ fontSize: isMobile ? '10px' : '12px' }}>FROM</Title>
//                 <InputField
//                   type="number"
//                   value={query.minPrice || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     updateQuery({
//                       minPrice: e.target.value,
//                       page: '1'
//                     })
//                   }}
//                   placeholder="Min"
//                   style={{ fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px' : '8px' }}
//                 />
//               </VStack>
//               <HStack justify="center" align="center" style={{ padding: isMobile ? '0 4px' : '0 8px', marginTop: '20px' }}>
//                 -
//               </HStack>
//               <VStack gap="$1" style={{ flex: 1 }}>
//                 <Title subheading style={{ fontSize: isMobile ? '10px' : '12px' }}>TO</Title>
//                 <InputField
//                   type="number"
//                   value={query.maxPrice || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     updateQuery({
//                       maxPrice: e.target.value,
//                       page: '1'
//                     })
//                   }}
//                   placeholder="Max"
//                   style={{ fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px' : '8px' }}
//                 />
//               </VStack>
//             </HStack>
//           </VStack>

//           <VStack align="flex-start" style={{ width: '100%',marginTop:'20px' }} gap="$2">
//             <Title primaryHeading>Filters</Title>
            
//             <HStack gap={isMobile ? '$3' : '$2'} style={{ width: '100%', flexWrap: 'wrap' }}>
//               <CheckBox
//                 name="isBestSelling"
//                 label="Best Selling"
//                 handleCheckboxChange={(checked: boolean) => {
//                   updateQuery({
//                     isBestSelling: checked ? 'true' : '',
//                     page: '1'
//                   })
//                 }}
//                 check={query.isBestSelling === 'true'}
//               />
              
//               <CheckBox
//                 name="isNewArrivals"
//                 label="New Arrivals"
//                 handleCheckboxChange={(checked: boolean) => {
//                   updateQuery({
//                     isNewArrivals: checked ? 'true' : '',
//                     page: '1'
//                   })
//                 }}
//                 check={query.isNewArrivals === 'true'}
//               />
//             </HStack>
//           </VStack>
//         </>
//       )}
//     </VStack>
//   )
// }

// export const ProductListForWeb: React.FC = () => {
//   const [sortVisible, setSortVisible] = useState(false)
//   const sortRef = useRef<HTMLDivElement | null>(null)
//   const productListRef = useRef<HTMLDivElement | null>(null)
  
//   const dispatch = useDispatch()
//   const query = useQuery() as QueryParams
//   const media = useMedia()

//   const { 
//     data, 
//     loading,
//     pagination 
//   }: { 
//     data: Product[]
//     loading: boolean
//     pagination?: PaginationInfo 
//   } = useSelector((state: any) => state.product)
  
//   const updateQuery = useUpdateQuery()

//   // Get current page and limit from query params
//   const currentPage = parseInt(query.page || '1')
//   const currentLimit = parseInt(query.limit || '12')

//   useEffect(() => {
//     const productQuery: any = {
//       page: currentPage,
//       limit: currentLimit
//     }

//     if (query.sort) productQuery.sort = query.sort
//     if (query.order) productQuery.order = query.order
    
//     if (query.categoryId) productQuery.categoryId = query.categoryId
//     if (query.subCategoryId) productQuery.subCategoryId = query.subCategoryId
//     if (query.nestedSubCategoryId) productQuery.nestedSubCategoryId = query.nestedSubCategoryId
    
//     if (query.search) productQuery.search = query.search

//     if (query.minPrice) {
//       const minPrice = parseInt(query.minPrice)
//       if (!isNaN(minPrice)) productQuery.minPrice = minPrice
//     }
//     if (query.maxPrice) {
//       const maxPrice = parseInt(query.maxPrice)
//       if (!isNaN(maxPrice)) productQuery.maxPrice = maxPrice
//     }

//     if (query.isBestSelling === 'true') productQuery.isBestSelling = true
//     if (query.isNewArrivals === 'true') productQuery.isNewArrivals = true

//     console.log('ProductListForWeb - Fetching products with query:', productQuery)
//     console.log('ProductListForWeb - URL query params:', query)

//     dispatch(
//       getProductListAction({
//         onSuccess: () => {
//           console.log('Products fetched successfully')
//           // Scroll to top of product list when page changes
//           if (productListRef.current) {
//             productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
//           }
//         },
//         query: productQuery
//       })
//     )
//   }, [
//     dispatch,
//     query.sort,
//     query.order,
//     query.categoryId,
//     query.subCategoryId,
//     query.nestedSubCategoryId,
//     query.minPrice,
//     query.maxPrice,
//     query.search,
//     query.isBestSelling,
//     query.isNewArrivals,
//     query.page,
//     query.limit,
//     currentPage,
//     currentLimit
//   ])

//   const handleOutSideClick = (event: MouseEvent) => {
//     if (
//       sortRef.current &&
//       !sortRef.current.contains(event.target as Node) &&
//       event.target !== document.getElementById('openModalButton')
//     ) {
//       setSortVisible(false)
//     }
//   }

//   useEffect(() => {
//     document.addEventListener('click', handleOutSideClick)
//     return () => {
//       document.removeEventListener('click', handleOutSideClick)
//     }
//   }, [])

//   const handlePageChange = (newPage: number) => {
//     console.log('Changing to page:', newPage)
//     updateQuery({
//       page: newPage.toString()
//     })
//   }

//   const handleLimitChange = (newLimit: number) => {
//     console.log('Changing limit to:', newLimit)
//     // Reset to page 1 when changing items per page
//     updateQuery({
//       limit: newLimit.toString(),
//       page: '1'
//     })
//   }

//   const handleSortChange = (sort: string, order: string) => {
//     updateQuery({
//       sort,
//       order,
//       page: '1' // Reset to first page when sorting changes
//     })
//     setSortVisible(false)
//   }

//   return (
//     <div
//       style={{ width: '90%', minHeight: '40vh' }}
//       className="productWebPage-container"
//     >
//       <div
//         style={{ width: media.md ? '25%' : '100%' }}
//         className="productWebPage-container-left"
//       >
//         <ProductListSideComp />
//       </div>
//       <VStack
//         style={{ width: media.md ? '75%' : '100%' }}
//         justify="space-between"
//         align="flex-start"
//       >
//         <VStack gap="$3" style={{ width: '100%' }}>
//           <HStack justify="space-between" align="center">
//             <Title subheading>
//               Products {pagination?.totalProducts ? `(${pagination.totalProducts})` : data?.length > 0 ? `(${data.length})` : ''}
//             </Title>

//             <VStack className="sortMainContainer" style={{ position: 'relative' }}>
//               <div
//                 id="openModalButton"
//                 onClick={(e) =>{
//                   e.stopPropagation() ;
                  
//                   setSortVisible((prev) => !prev)}

//                 }

             
//                 style={{ cursor: 'pointer',alignItems:'center',justifyContent:'center',gap:'4px',display:'flex'  }}
    
//               >
//                 Sort
//                 <FaSortAmountUp />
//               </div>

//               <div
//                 className="sortModalContainer"
//                 style={{ 
//                   scale: sortVisible ? '1' : '0',
//                   position: 'absolute',
//                   top: '100%',
//                   right: 0,
//                   background: 'white',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   padding: '8px',
//                   zIndex: 1000,
//                   minWidth: '200px',
//                   transition: 'scale 0.2s ease-in-out',
//                   transformOrigin: 'top right'
//                 }}
//                 ref={sortRef}
//               >
//                 <VStack>
//                   <HStack
//                     align="center"
//                     gap="$3"
//                     className="filterItem"
//                     style={{ cursor: 'pointer', padding: '8px' }}
//                     onClick={() => handleSortChange('price', 'asc')}
//                   >
//                     <AiOutlineSortAscending />
//                     <p>Asc (price low to high)</p>
//                   </HStack>
//                   <HStack
//                     align="center"
//                     gap="$3"
//                     className="filterItem"
//                     style={{ cursor: 'pointer', padding: '8px' }}
//                     onClick={() => handleSortChange('price', 'desc')}
//                   >
//                     <AiOutlineSortAscending />
//                     <p>Desc (price high to low)</p>
//                   </HStack>
//                   <HStack
//                     align="center"
//                     gap="$3"
//                     className="filterItem"
//                     style={{ cursor: 'pointer', padding: '8px' }}
//                     onClick={() => handleSortChange('name', 'asc')}
//                   >
//                     <AiOutlineSortAscending />
//                     <p>Asc (Product Name A to Z)</p>
//                   </HStack>
//                   <HStack
//                     align="center"
//                     gap="$3"
//                     className="filterItem"
//                     style={{ cursor: 'pointer', padding: '8px' }}
//                     onClick={() => handleSortChange('name', 'desc')}
//                   >
//                     <AiOutlineSortAscending />
//                     <p>Desc (Product Name Z to A)</p>
//                   </HStack>
//                 </VStack>
//               </div>
//             </VStack>
//           </HStack>

//           {loading ? (
//             <ProductGridSkeleton count={currentLimit} />
//           ) : data?.length > 0 ? (
//             <>
//               <div className="productListContainer">
//                 {data.map((item: Product) => (
//                   <ProductCard data={item} key={item.id} />
//                 ))}
//               </div>
              
//               {/* Pagination Component */}
//               {pagination && (
//                 <Pagination
//                   paginationInfo={pagination}
//                   onPageChange={handlePageChange}
//                   onLimitChange={handleLimitChange}
//                   currentLimit={currentLimit}
//                   isMobile={!media.md}
//                 />
//               )}
//             </>
//           ) : (
//             <div style={{ 
//               textAlign: 'center', 
//               padding: '40px', 
//               color: '#666',
//               width: '100%' 
//             }}>
//               <p style={{ fontSize: '18px', marginBottom: '8px' }}>No products found</p>
//               <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
//             </div>
//           )}
//         </VStack>
//       </VStack>
//     </div>
//   )
// }

// export default ProductListForWeb

// import React, { useEffect, useRef, useState } from 'react'
// import { AiOutlineSortAscending } from 'react-icons/ai'
// import {
//   CheckBox,
//   HStack,
//   InputField,
//   Title,
//   VStack
// } from 'src/app/common'
// import { useDispatch, useSelector } from 'src/store'
// import { getCategoryListAction } from '../../category/category.slice'
// import { getProductListAction } from '../../products/product.slice'
// import { ProductCard } from 'src/app/components'
// import { useMedia, useQuery } from 'src/hooks'
// import { useUpdateQuery } from 'src/hooks/useUpdateQuery.hook'
// import { FaSortAmountUp } from 'react-icons/fa'
// import { MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight, MdCheck } from 'react-icons/md'
// import { HiOutlineFilter } from 'react-icons/hi'
// import { IoCloseOutline } from 'react-icons/io5'

// // Types
// interface Product {
//   id: string
//   name: string
//   description: string
//   originalPrice: number
//   discountedPrice: number
//   stockQuantity: number
//   isBestSelling: boolean
//   isNewArrivals: boolean
//   isHotSelling: boolean
//   images: Array<{
//     _id: string
//     colorName: string
//     coloredImage: string
//     __v: number
//   }>
//   category: {
//     id: string
//     name: string
//     image: string
//     subCategories: string[]
//   }
//   subCategory: {
//     id: string
//     name: string
//     subCategories: any[]
//   }
//   nestedSubCategory?: {
//     id: string
//     name: string
//   }
// }

// interface Category {
//   id: string
//   name: string
//   image: string
//   subCategories: Category[]
// }

// interface QueryParams {
//   sort?: string
//   order?: string
//   categoryId?: string
//   subCategoryId?: string
//   nestedSubCategoryId?: string
//   categoryname?: string
//   subCategoryName?: string
//   nestedSubCategoryName?: string
//   minPrice?: string
//   maxPrice?: string
//   search?: string
//   isBestSelling?: string
//   isNewArrivals?: string
//   page?: string
//   limit?: string
// }

// interface SelectedFilters {
//   categoryId: string
//   categoryName: string
//   subCategoryId: string
//   subCategoryName: string
//   nestedSubCategoryId: string
//   nestedSubCategoryName: string
// }

// interface PaginationInfo {
//   currentPage: number
//   totalPages: number
//   totalProducts: number
//   hasNextPage: boolean
//   hasPrevPage: boolean
// }

// // Skeleton Loader Component
// const ProductCardSkeleton: React.FC = () => {
//   return (
//     <div
//       style={{
//         border: '1px solid #e5e7eb',
//         borderRadius: '12px',
//         padding: '12px',
//         backgroundColor: 'white',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//       }}
//     >
//       <div
//         style={{
//           width: '100%',
//           aspectRatio: '1/1',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '8px',
//           marginBottom: '12px',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <div
//         style={{
//           height: '16px',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '4px',
//           marginBottom: '8px',
//           width: '80%',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <div
//         style={{
//           height: '14px',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '4px',
//           marginBottom: '12px',
//           width: '60%',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <div
//         style={{
//           display: 'flex',
//           gap: '8px',
//           marginBottom: '12px'
//         }}
//       >
//         <div
//           style={{
//             height: '20px',
//             backgroundColor: '#f3f4f6',
//             borderRadius: '4px',
//             width: '40%',
//             animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//           }}
//         />
//         <div
//           style={{
//             height: '20px',
//             backgroundColor: '#f3f4f6',
//             borderRadius: '4px',
//             width: '30%',
//             animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//           }}
//         />
//       </div>
//       <div
//         style={{
//           height: '36px',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '8px',
//           width: '100%',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <style>{`
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
//   return (
//     <div className="productListContainer">
//       {Array.from({ length: count }).map((_, index) => (
//         <ProductCardSkeleton key={index} />
//       ))}
//     </div>
//   )
// }

// // Pagination Component
// const Pagination: React.FC<{
//   paginationInfo: PaginationInfo
//   onPageChange: (page: number) => void
//   onLimitChange: (limit: number) => void
//   currentLimit: number
//   isMobile: boolean
// }> = ({ paginationInfo, onPageChange, onLimitChange, currentLimit, isMobile }) => {
//   const { currentPage, totalPages, totalProducts, hasNextPage, hasPrevPage } = paginationInfo
//   const [showLimitDropdown, setShowLimitDropdown] = useState(false)
//   const limitDropdownRef = useRef<HTMLDivElement>(null)

//   const limitOptions = [8, 12, 16, 20, 24]

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (limitDropdownRef.current && !limitDropdownRef.current.contains(event.target as Node)) {
//         setShowLimitDropdown(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   const getPageNumbers = () => {
//     const pages: (number | string)[] = []
//     const maxVisible = isMobile ? 3 : 5
    
//     if (totalPages <= maxVisible + 2) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i)
//       }
//     } else {
//       pages.push(1)
      
//       let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
//       let end = Math.min(totalPages - 1, start + maxVisible - 1)
      
//       if (end === totalPages - 1) {
//         start = Math.max(2, end - maxVisible + 1)
//       }
      
//       if (start > 2) {
//         pages.push('...')
//       }
      
//       for (let i = start; i <= end; i++) {
//         pages.push(i)
//       }
      
//       if (end < totalPages - 1) {
//         pages.push('...')
//       }
      
//       pages.push(totalPages)
//     }
    
//     return pages
//   }

//   const pageNumbers = getPageNumbers()

//   const buttonStyle: React.CSSProperties = {
//     padding: isMobile ? '6px 10px' : '8px 14px',
//     border: '1px solid #e5e7eb',
//     background: 'white',
//     cursor: 'pointer',
//     borderRadius: '8px',
//     fontSize: isMobile ? '13px' : '14px',
//     minWidth: isMobile ? '36px' : '40px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'all 0.2s',
//     fontWeight: 500,
//     color: '#374151'
//   }

//   const activeButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     background: 'black',
//     color: 'white',
//     fontWeight: '600',
//     border: '1px solid black'
//   }

//   const disabledButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     cursor: 'not-allowed',
//     opacity: 0.4,
//     background: '#f9fafb'
//   }

//   if (totalPages <= 1 && totalProducts <= Math.min(...limitOptions)) {
//     return null
//   }

//   return (
//     <VStack gap="$4" style={{ width: '100%', alignItems: 'center', marginTop: '32px' }}>
//       <HStack 
//         justify="space-between" 
//         align="center" 
//         style={{ 
//           width: '100%', 
//           flexWrap: isMobile ? 'wrap' : 'nowrap',
//           gap: isMobile ? '12px' : '16px'
//         }}
//       >
//         <div style={{ 
//           fontSize: isMobile ? '13px' : '14px', 
//           color: '#6b7280',
//           fontWeight: 500
//         }}>
//           Showing {((currentPage - 1) * currentLimit) + 1} - {Math.min(currentPage * currentLimit, totalProducts)} of {totalProducts} products
//         </div>
        
//         <div ref={limitDropdownRef} style={{ position: 'relative' }}>
//           <HStack align="center" gap="$2">
//             <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#6b7280' }}>
//               Show:
//             </span>
//             <button
//               onClick={() => setShowLimitDropdown(!showLimitDropdown)}
//               style={{
//                 padding: isMobile ? '6px 12px' : '8px 16px',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: '8px',
//                 background: 'white',
//                 cursor: 'pointer',
//                 fontSize: isMobile ? '13px' : '14px',
//                 fontWeight: 500,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 minWidth: '70px',
//                 justifyContent: 'space-between',
//                 color: '#374151'
//               }}
//             >
//               {currentLimit}
//               <MdExpandMore 
//                 style={{ 
//                   transform: showLimitDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
//                   transition: 'transform 0.2s'
//                 }} 
//               />
//             </button>
//           </HStack>

//           {showLimitDropdown && (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '100%',
//                 right: 0,
//                 marginTop: '8px',
//                 background: 'white',
//                 border: '1px solid #e5e7eb',
//                 borderRadius: '12px',
//                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//                 zIndex: 1000,
//                 minWidth: '80px',
//                 overflow: 'hidden'
//               }}
//             >
//               {limitOptions.map((limit) => (
//                 <button
//                   key={limit}
//                   onClick={() => {
//                     onLimitChange(limit)
//                     setShowLimitDropdown(false)
//                   }}
//                   style={{
//                     width: '100%',
//                     padding: '10px 16px',
//                     border: 'none',
//                     background: currentLimit === limit ? '#f9fafb' : 'white',
//                     cursor: 'pointer',
//                     fontSize: isMobile ? '13px' : '14px',
//                     textAlign: 'left',
//                     fontWeight: currentLimit === limit ? '600' : '400',
//                     color: currentLimit === limit ? 'black' : '#374151',
//                     transition: 'all 0.2s'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = '#f9fafb'
//                   }}
//                   onMouseLeave={(e) => {
//                     if (currentLimit !== limit) {
//                       e.currentTarget.style.background = 'white'
//                     }
//                   }}
//                 >
//                   {limit}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </HStack>
      
//       {totalPages > 1 && (
//         <HStack gap={isMobile ? '$1' : '$2'} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={!hasPrevPage}
//             style={!hasPrevPage ? disabledButtonStyle : buttonStyle}
//           >
//             <MdChevronLeft size={isMobile ? 18 : 20} />
//             {!isMobile && <span style={{ marginLeft: '6px' }}>Prev</span>}
//           </button>

//           {pageNumbers.map((page, index) => {
//             if (page === '...') {
//               return (
//                 <span 
//                   key={`ellipsis-${index}`} 
//                   style={{ 
//                     padding: isMobile ? '6px 4px' : '8px 6px',
//                     fontSize: isMobile ? '14px' : '16px',
//                     color: '#9ca3af'
//                   }}
//                 >
//                   ...
//                 </span>
//               )
//             }
            
//             return (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(page as number)}
//                 style={currentPage === page ? activeButtonStyle : buttonStyle}
//               >
//                 {page}
//               </button>
//             )
//           })}

//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={!hasNextPage}
//             style={!hasNextPage ? disabledButtonStyle : buttonStyle}
//           >
//             {!isMobile && <span style={{ marginRight: '6px' }}>Next</span>}
//             <MdChevronRight size={isMobile ? 18 : 20} />
//           </button>
//         </HStack>
//       )}
//     </VStack>
//   )
// }

// // Hierarchical Category Item Component
// const CategoryItem: React.FC<{
//   category: Category
//   level?: number
//   selectedFilters: SelectedFilters
//   onFilterChange: (filters: Partial<SelectedFilters>) => void
// }> = ({ category, level = 0, selectedFilters, onFilterChange }) => {
//   const [isExpanded, setIsExpanded] = useState(level === 0)
//   const hasSubCategories = category.subCategories && category.subCategories.length > 0
  
//   const paddingLeft = level * 20 + 'px'
  
//   const handleCategoryClick = () => {
//     const filterType = level === 0 ? 'categoryId' : level === 1 ? 'subCategoryId' : 'nestedSubCategoryId'
//     const nameType = level === 0 ? 'categoryName' : level === 1 ? 'subCategoryName' : 'nestedSubCategoryName'
    
//     onFilterChange({
//       [filterType]: category.id,
//       [nameType]: category.name,
//       ...(level === 0 && {
//         subCategoryId: '',
//         subCategoryName: '',
//         nestedSubCategoryId: '',
//         nestedSubCategoryName: ''
//       }),
//       ...(level === 1 && {
//         nestedSubCategoryId: '',
//         nestedSubCategoryName: ''
//       })
//     })
//   }

//   const isSelected = (): boolean => {
//     if (level === 0) return selectedFilters.categoryId === category.id
//     if (level === 1) return selectedFilters.subCategoryId === category.id
//     if (level === 2) return selectedFilters.nestedSubCategoryId === category.id
//     return false
//   }

//   return (
//     <div style={{ paddingLeft }}>
//       <HStack 
//         align="center" 
//         justify="space-between" 
//         style={{
//           cursor: 'pointer',
//           padding: '10px 8px',
//           borderRadius: '8px',
//           transition: 'background 0.2s',
//           background: isSelected() ? '#f3f4f6' : 'transparent',
//           marginBottom: '2px'
//         }}
//         onMouseEnter={(e) => {
//           if (!isSelected()) {
//             e.currentTarget.style.background = '#f9fafb'
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!isSelected()) {
//             e.currentTarget.style.background = 'transparent'
//           }
//         }}
//       >
//         <HStack align="center" gap="$3" style={{ flex: 1 }} onClick={handleCategoryClick}>
//           <div style={{
//             width: '16px',
//             height: '16px',
//             borderRadius: '4px',
//             border: `2px solid ${isSelected() ? 'black' : '#d1d5db'}`,
//             background: isSelected() ? 'black' : 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             {isSelected() && <MdCheck size={12} color="white" />}
//           </div>
//           <span style={{ 
//             fontSize: '14px', 
//             fontWeight: isSelected() ? '600' : '400',
//             color: isSelected() ? 'black' : '#374151'
//           }}>
//             {category.name}
//           </span>
//         </HStack>
//         {hasSubCategories && (
//           <div 
//             onClick={(e) => {
//               e.stopPropagation()
//               setIsExpanded(!isExpanded)
//             }}
//             style={{ 
//               cursor: 'pointer', 
//               padding: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               color: '#6b7280'
//             }}
//           >
//             {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
//           </div>
//         )}
//       </HStack>
      
//       {hasSubCategories && isExpanded && (
//         <div style={{ marginTop: '4px' }}>
//           {category.subCategories.map((subCategory) => (
//             <CategoryItem
//               key={subCategory.id}
//               category={subCategory}
//               level={level + 1}
//               selectedFilters={selectedFilters}
//               onFilterChange={onFilterChange}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // Sort Button Component with active state
// const SortButton: React.FC<{
//   currentSort: string
//   currentOrder: string
//   onSortChange: (sort: string, order: string) => void
// }> = ({ currentSort, currentOrder, onSortChange }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const sortRef = useRef<HTMLDivElement>(null)

//   const getActiveSortLabel = () => {
//     if (currentSort === 'price') {
//       return currentOrder === 'asc' ? 'Price: Low to High' : 'Price: High to Low'
//     }
//     if (currentSort === 'name') {
//       return currentOrder === 'asc' ? 'Name: A to Z' : 'Name: Z to A'
//     }
//     return 'Sort by'
//   }

//   const sortOptions = [
//     { sort: 'price', order: 'asc', label: 'Price: Low to High', icon: '💰' },
//     { sort: 'price', order: 'desc', label: 'Price: High to Low', icon: '💎' },
//     { sort: 'name', order: 'asc', label: 'Name: A to Z', icon: '🔤' },
//     { sort: 'name', order: 'desc', label: 'Name: Z to A', icon: '🔠' }
//   ]

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const isActive = (option: typeof sortOptions[0]) => {
//     return currentSort === option.sort && currentOrder === option.order
//   }

//   return (
//     <div ref={sortRef} style={{ position: 'relative' }}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           padding: '8px 16px',
//           background: 'white',
//           border: '1px solid #e5e7eb',
//           borderRadius: '10px',
//           cursor: 'pointer',
//           fontSize: '14px',
//           fontWeight: 500,
//           color: '#374151',
//           transition: 'all 0.2s',
//           boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.borderColor = '#9ca3af'
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.borderColor = '#e5e7eb'
//         }}
//       >
//         <FaSortAmountUp size={16} />
//         <span>{getActiveSortLabel()}</span>
//         <MdExpandMore 
//           size={18} 
//           style={{ 
//             transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
//             transition: 'transform 0.2s'
//           }} 
//         />
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '100%',
//             right: 0,
//             marginTop: '8px',
//             background: 'white',
//             border: '1px solid #e5e7eb',
//             borderRadius: '12px',
//             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//             minWidth: '220px',
//             zIndex: 1000,
//             overflow: 'hidden'
//           }}
//         >
//           {sortOptions.map((option, index) => (
//             <button
//               key={`${option.sort}-${option.order}`}
//               onClick={() => {
//                 onSortChange(option.sort, option.order)
//                 setIsOpen(false)
//               }}
//               style={{
//                 width: '100%',
//                 padding: '12px 16px',
//                 border: 'none',
//                 background: isActive(option) ? '#f9fafb' : 'white',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 textAlign: 'left',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 borderBottom: index < sortOptions.length - 1 ? '1px solid #f3f4f6' : 'none',
//                 fontWeight: isActive(option) ? '600' : '400',
//                 color: isActive(option) ? 'black' : '#374151',
//                 transition: 'all 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 if (!isActive(option)) {
//                   e.currentTarget.style.background = '#f9fafb'
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isActive(option)) {
//                   e.currentTarget.style.background = 'white'
//                 }
//               }}
//             >
//               <span>{option.icon}</span>
//               <span style={{ flex: 1 }}>{option.label}</span>
//               {isActive(option) && <MdCheck size={18} color="black" />}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export const ProductListSideComp: React.FC = () => {
//   const query = useQuery() as QueryParams
//   const { categoryData }: { categoryData: Category[] } = useSelector((state: any) => state.category)
//   const dispatch = useDispatch()
//   const updateQuery = useUpdateQuery()
//   const media = useMedia()

//   const selectedFilters: SelectedFilters = {
//     categoryId: query.categoryId || '',
//     categoryName: query.categoryname || '',
//     subCategoryId: query.subCategoryId || '',
//     subCategoryName: query.subCategoryName || '',
//     nestedSubCategoryId: query.nestedSubCategoryId || '',
//     nestedSubCategoryName: query.nestedSubCategoryName || ''
//   }

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => {}
//       })
//     )
//   }, [dispatch])

//   const handleFilterChange = (newFilters: Partial<SelectedFilters>) => {
//     updateQuery({
//       ...query,
//       ...newFilters,
//       page: '1'
//     })
//   }

//   const clearAllFilters = () => {
//     updateQuery({
//       ...query,
//       categoryId: '',
//       categoryname: '',
//       subCategoryId: '',
//       subCategoryName: '',
//       nestedSubCategoryId: '',
//       nestedSubCategoryName: '',
//       minPrice: '',
//       maxPrice: '',
//       isBestSelling: '',
//       isNewArrivals: '',
//       page: '1'
//     })
//   }

//   const isMobile = !media.md
//   const [showFilters, setShowFilters] = useState(!isMobile)

//   const hasActiveFilters = selectedFilters.categoryId || selectedFilters.subCategoryId || 
//     selectedFilters.nestedSubCategoryId || query.minPrice || query.maxPrice || 
//     query.isBestSelling === 'true' || query.isNewArrivals === 'true'

//   return (
//     <VStack
//       align="flex-start"
//       justify="space-between"
//       style={{ width: '100%' }}
//       gap="$4"
//     >
//       {isMobile && (
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           style={{
//             width: '100%',
//             padding: '12px 16px',
//             background: 'black',
//             color: 'white',
//             border: 'none',
//             borderRadius: '12px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: 600,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}
//         >
//           <HStack gap="$2" align="center">
//             <HiOutlineFilter size={20} />
//             <span>Filters</span>
//           </HStack>
//           <span>{showFilters ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}</span>
//         </button>
//       )}

//       {(!isMobile || showFilters) && (
//         <>
//           <HStack justify="space-between" align="center" style={{ width: '100%' }}>
//             <Title primaryHeading style={{ fontSize: '18px', fontWeight: 600 }}>Categories</Title>
//             {hasActiveFilters && (
//               <button 
//                 onClick={clearAllFilters}
//                 style={{
//                   border: 'none',
//                   borderRadius: '8px',
//                   padding: '6px 12px',
//                   fontSize: '12px',
//                   cursor: 'pointer',
//                   background: '#f3f4f6',
//                   color: '#374151',
//                   fontWeight: 500,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '4px',
//                   transition: 'all 0.2s'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = '#e5e7eb'
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = '#f3f4f6'
//                 }}
//               >
//                 <IoCloseOutline size={14} />
//                 {/* Clear All */}
//               </button>
//             )}
//           </HStack>

//           {(selectedFilters.categoryName || selectedFilters.subCategoryName || selectedFilters.nestedSubCategoryName) && (
//             <div style={{
//               background: '#f9fafb',
//               padding: '12px',
//               borderRadius: '10px',
//               fontSize: '13px',
//               width: '100%',
//               border: '1px solid #f3f4f6'
//             }}>
//               <strong style={{ color: '#374151' }}>Selected Category:</strong>
//               <div style={{ marginTop: '6px', color: '#6b7280' }}>
//                 {selectedFilters.categoryName && (
//                   <span>{selectedFilters.categoryName}</span>
//                 )}
//                 {selectedFilters.subCategoryName && (
//                   <span> → {selectedFilters.subCategoryName}</span>
//                 )}
//                 {selectedFilters.nestedSubCategoryName && (
//                   <span> → {selectedFilters.nestedSubCategoryName}</span>
//                 )}
//               </div>
//             </div>
//           )}

//           <div
//             style={{
//               width: '100%',
//               maxHeight: isMobile ? '200px' : '400px', 
//               overflowY: 'auto',
//               border: '1px solid #f3f4f6',
//               borderRadius: '12px',
//               padding: '8px',
//               background: 'white'
//             }}
//           >
//             <div
//               onClick={clearAllFilters}
//               style={{
//                 padding: '10px 12px',
//                 cursor: 'pointer',
//                 borderRadius: '8px',
//                 background: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'black' : 'transparent',
//                 fontWeight: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? '600' : '400',
//                 marginBottom: '4px',
//                 color: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'white' : '#374151',
//                 transition: 'all 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 if (selectedFilters.categoryId || selectedFilters.subCategoryId || selectedFilters.nestedSubCategoryId) {
//                   e.currentTarget.style.background = '#f9fafb'
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (selectedFilters.categoryId || selectedFilters.subCategoryId || selectedFilters.nestedSubCategoryId) {
//                   e.currentTarget.style.background = 'transparent'
//                 }
//               }}
//             >
//               All Categories
//             </div>
            
//             {categoryData?.map((category) => (
//               <CategoryItem
//                 key={category.id}
//                 category={category}
//                 level={0}
//                 selectedFilters={selectedFilters}
//                 onFilterChange={handleFilterChange}
//               />
//             ))}
//           </div>

//           <VStack align="flex-start" style={{ width: '100%' }} gap="$3">
//             <Title primaryHeading style={{ fontSize: '18px', fontWeight: 600,marginTop:'16px' }}>Price Range</Title>
//             <HStack
//               style={{ width: '100%' }}
//               gap="$3"
//               align="center"
//               justify="center"
//             >
//               <VStack gap="$2" style={{ flex: 1 }}>
//                 <Title subheading style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>MIN</Title>
//                 <InputField
//                   type="number"
//                   value={query.minPrice || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     updateQuery({
//                       minPrice: e.target.value,
//                       page: '1'
//                     })
//                   }}
//                   placeholder="0"
//                   style={{ 
//                     fontSize: isMobile ? '14px' : '14px', 
//                     padding: isMobile ? '10px' : '10px',
//                     borderRadius: '10px',
//                     border: '1px solid #e5e7eb'
//                   }}
//                 />
//               </VStack>
//               <div style={{ marginTop: '20px', color: '#9ca3af', fontWeight: 500 }}>—</div>
//               <VStack gap="$2" style={{ flex: 1 }}>
//                 <Title subheading style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>MAX</Title>
//                 <InputField
//                   type="number"
//                   value={query.maxPrice || ''}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     updateQuery({
//                       maxPrice: e.target.value,
//                       page: '1'
//                     })
//                   }}
//                   placeholder="10000000"
//                   style={{ 
//                     fontSize: isMobile ? '14px' : '14px', 
//                     padding: isMobile ? '10px' : '10px',
//                     borderRadius: '10px',
//                     border: '1px solid #e5e7eb'
//                   }}
//                 />
//               </VStack>
//             </HStack>
//           </VStack>

//           <VStack align="flex-start" style={{ width: '100%' }} gap="$3">
//             <Title primaryHeading style={{ fontSize: '18px', fontWeight: 600,marginTop:'16px' }}>Product Tags</Title>
            
//             <HStack gap="$3" style={{ width: '100%', flexWrap: 'wrap' }}>
//               <button
//                 onClick={() => {
//                   updateQuery({
//                     isBestSelling: query.isBestSelling === 'true' ? '' : 'true',
//                     page: '1'
//                   })
//                 }}
//                 style={{
//                   padding: '8px 16px',
//                   borderRadius: '20px',
//                   border: `1px solid ${query.isBestSelling === 'true' ? 'black' : '#e5e7eb'}`,
//                   background: query.isBestSelling === 'true' ? 'black' : 'white',
//                   color: query.isBestSelling === 'true' ? 'white' : '#374151',
//                   cursor: 'pointer',
//                   fontSize: '13px',
//                   fontWeight: 500,
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 🔥 Best Selling
//               </button>
              
//               <button
//                 onClick={() => {
//                   updateQuery({
//                     isNewArrivals: query.isNewArrivals === 'true' ? '' : 'true',
//                     page: '1'
//                   })
//                 }}
//                 style={{
//                   padding: '8px 16px',
//                   borderRadius: '20px',
//                   border: `1px solid ${query.isNewArrivals === 'true' ? 'black' : '#e5e7eb'}`,
//                   background: query.isNewArrivals === 'true' ? 'black' : 'white',
//                   color: query.isNewArrivals === 'true' ? 'white' : '#374151',
//                   cursor: 'pointer',
//                   fontSize: '13px',
//                   fontWeight: 500,
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 ✨ New Arrivals
//               </button>
//             </HStack>
//           </VStack>
//         </>
//       )}
//     </VStack>
//   )
// }

// export const ProductListForWeb: React.FC = () => {
//   const dispatch = useDispatch()
//   const query = useQuery() as QueryParams
//   const media = useMedia()
//   const productListRef = useRef<HTMLDivElement | null>(null)

//   const { 
//     data, 
//     loading,
//     pagination 
//   }: { 
//     data: Product[]
//     loading: boolean
//     pagination?: PaginationInfo 
//   } = useSelector((state: any) => state.product)
  
//   const updateQuery = useUpdateQuery()

//   const currentPage = parseInt(query.page || '1')
//   const currentLimit = parseInt(query.limit || '12')
//   const currentSort = query.sort || ''
//   const currentOrder = query.order || ''

//   useEffect(() => {
//     const productQuery: any = {
//       page: currentPage,
//       limit: currentLimit
//     }

//     if (currentSort) productQuery.sort = currentSort
//     if (currentOrder) productQuery.order = currentOrder
    
//     if (query.categoryId) productQuery.categoryId = query.categoryId
//     if (query.subCategoryId) productQuery.subCategoryId = query.subCategoryId
//     if (query.nestedSubCategoryId) productQuery.nestedSubCategoryId = query.nestedSubCategoryId
    
//     if (query.search) productQuery.search = query.search

//     if (query.minPrice) {
//       const minPrice = parseInt(query.minPrice)
//       if (!isNaN(minPrice)) productQuery.minPrice = minPrice
//     }
//     if (query.maxPrice) {
//       const maxPrice = parseInt(query.maxPrice)
//       if (!isNaN(maxPrice)) productQuery.maxPrice = maxPrice
//     }

//     if (query.isBestSelling === 'true') productQuery.isBestSelling = true
//     if (query.isNewArrivals === 'true') productQuery.isNewArrivals = true

//     dispatch(
//       getProductListAction({
//         onSuccess: () => {
//           if (productListRef.current) {
//             productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
//           }
//         },
//         query: productQuery
//       })
//     )
//   }, [
//     dispatch,
//     currentSort,
//     currentOrder,
//     query.categoryId,
//     query.subCategoryId,
//     query.nestedSubCategoryId,
//     query.minPrice,
//     query.maxPrice,
//     query.search,
//     query.isBestSelling,
//     query.isNewArrivals,
//     currentPage,
//     currentLimit
//   ])

//   const handlePageChange = (newPage: number) => {
//     updateQuery({ page: newPage.toString() })
//   }

//   const handleLimitChange = (newLimit: number) => {
//     updateQuery({ limit: newLimit.toString(), page: '1' })
//   }

//   const handleSortChange = (sort: string, order: string) => {
//     updateQuery({ sort, order, page: '1' })
//   }

//   return (
//     <div
//       style={{ 
//         width: '90%', 
//         minHeight: '40vh',
//         maxWidth: '1400px',
//         margin: '0 auto'
//       }}
//       className="productWebPage-container"
//     >
//       <div
//         style={{ 
//           width: media.md ? '280px' : '100%',
//           flexShrink: 0
//         }}
//         className="productWebPage-container-left"
//       >
//         <ProductListSideComp />
//       </div>
//       <VStack
//         style={{ 
//           width: media.md ? 'calc(100% - 300px)' : '100%',
//           paddingLeft: media.md ? '24px' : '0'
//         }}
//         justify="space-between"
//         align="flex-start"
//       >
//         <VStack gap="$4" style={{ width: '100%' }}>
//           <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
//             <Title subheading style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
//               {pagination?.totalProducts ? `${pagination.totalProducts} Products` : data?.length > 0 ? `${data.length} Products` : 'Products'}
//             </Title>

//             <SortButton
//               currentSort={currentSort}
//               currentOrder={currentOrder}
//               onSortChange={handleSortChange}
//             />
//           </HStack>

//           {loading ? (
//             <ProductGridSkeleton count={currentLimit} />
//           ) : data?.length > 0 ? (
//             <>
//               <div ref={productListRef} className="productListContainer">
//                 {data.map((item: Product) => (
//                   <ProductCard data={item} key={item.id} />
//                 ))}
//               </div>
              
//               {pagination && (
//                 <Pagination
//                   paginationInfo={pagination}
//                   onPageChange={handlePageChange}
//                   onLimitChange={handleLimitChange}
//                   currentLimit={currentLimit}
//                   isMobile={!media.md}
//                 />
//               )}
//             </>
//           ) : (
//             <div style={{ 
//               textAlign: 'center', 
//               padding: '60px 20px', 
//               color: '#6b7280',
//               width: '100%',
//               background: '#f9fafb',
//               borderRadius: '16px'
//             }}>
//               <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
//               <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>No products found</p>
//               <p style={{ fontSize: '14px' }}>Try adjusting your filters or search criteria</p>
//             </div>
//           )}
//         </VStack>
//       </VStack>
//     </div>
//   )
// }

// export default ProductListForWeb


// import React, { useEffect, useRef, useState } from 'react'
// import { AiOutlineSortAscending } from 'react-icons/ai'
// import {
//   CheckBox,
//   HStack,
//   InputField,
//   Title,
//   VStack
// } from 'src/app/common'
// import { useDispatch, useSelector } from 'src/store'
// import { getCategoryListAction } from '../../category/category.slice'
// import { getProductListAction } from '../../products/product.slice'
// import { ProductCard } from 'src/app/components'
// import { useMedia, useQuery } from 'src/hooks'
// import { useUpdateQuery } from 'src/hooks/useUpdateQuery.hook'
// import { FaSortAmountUp, FaFilter } from 'react-icons/fa'
// import { MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight, MdCheck, MdClose } from 'react-icons/md'
// import { HiOutlineFilter } from 'react-icons/hi'
// import { IoCloseOutline } from 'react-icons/io5'
// import { BiFilterAlt } from 'react-icons/bi'

// // Types
// interface Product {
//   id: string
//   name: string
//   description: string
//   originalPrice: number
//   discountedPrice: number
//   stockQuantity: number
//   isBestSelling: boolean
//   isNewArrivals: boolean
//   isHotSelling: boolean
//   images: Array<{
//     _id: string
//     colorName: string
//     coloredImage: string
//     __v: number
//   }>
//   category: {
//     id: string
//     name: string
//     image: string
//     subCategories: string[]
//   }
//   subCategory: {
//     id: string
//     name: string
//     subCategories: any[]
//   }
//   nestedSubCategory?: {
//     id: string
//     name: string
//   }
// }

// interface Category {
//   id: string
//   name: string
//   image: string
//   subCategories: Category[]
// }

// interface QueryParams {
//   sort?: string
//   order?: string
//   categoryId?: string
//   subCategoryId?: string
//   nestedSubCategoryId?: string
//   categoryname?: string
//   subCategoryName?: string
//   nestedSubCategoryName?: string
//   minPrice?: string
//   maxPrice?: string
//   search?: string
//   isBestSelling?: string
//   isNewArrivals?: string
//   page?: string
//   limit?: string
// }

// interface SelectedFilters {
//   categoryId: string
//   categoryName: string
//   subCategoryId: string
//   subCategoryName: string
//   nestedSubCategoryId: string
//   nestedSubCategoryName: string
// }

// interface PaginationInfo {
//   currentPage: number
//   totalPages: number
//   totalProducts: number
//   hasNextPage: boolean
//   hasPrevPage: boolean
// }

// // Skeleton Loader Component
// const ProductCardSkeleton: React.FC = () => {
//   return (
//     <div
//       style={{
//         border: '1px solid #e5e7eb',
//         borderRadius: '12px',
//         padding: '12px',
//         backgroundColor: 'white',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//       }}
//     >
//       <div
//         style={{
//           width: '100%',
//           aspectRatio: '1/1',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '8px',
//           marginBottom: '12px',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <div
//         style={{
//           height: '16px',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '4px',
//           marginBottom: '8px',
//           width: '80%',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <div
//         style={{
//           height: '14px',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '4px',
//           marginBottom: '12px',
//           width: '60%',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <div
//         style={{
//           display: 'flex',
//           gap: '8px',
//           marginBottom: '12px'
//         }}
//       >
//         <div
//           style={{
//             height: '20px',
//             backgroundColor: '#f3f4f6',
//             borderRadius: '4px',
//             width: '40%',
//             animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//           }}
//         />
//         <div
//           style={{
//             height: '20px',
//             backgroundColor: '#f3f4f6',
//             borderRadius: '4px',
//             width: '30%',
//             animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//           }}
//         />
//       </div>
//       <div
//         style={{
//           height: '36px',
//           backgroundColor: '#f3f4f6',
//           borderRadius: '8px',
//           width: '100%',
//           animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//         }}
//       />
//       <style>{`
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
//   return (
//     <div className="productListContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
//       {Array.from({ length: count }).map((_, index) => (
//         <ProductCardSkeleton key={index} />
//       ))}
//     </div>
//   )
// }

// // Mobile Filter Modal
// const MobileFilterModal: React.FC<{
//   isOpen: boolean
//   onClose: () => void
//   children: React.ReactNode
// }> = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null

//   return (
//     <>
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 1000,
//           animation: 'fadeIn 0.3s ease'
//         }}
//         onClick={onClose}
//       />
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           right: 0,
//           bottom: 0,
//           width: '85%',
//           maxWidth: '400px',
//           backgroundColor: 'white',
//           zIndex: 10000000001,
//           overflowY: 'auto',
//           animation: 'slideIn 0.3s ease',
//           boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
//         }}
//       >
//         <div
//           style={{
//             padding: '20px',
//             borderBottom: '1px solid #f3f4f6',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             position: 'sticky',
//             top: 0,
//             backgroundColor: 'white',
//             zIndex: 10
//           }}
//         >
//           <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Filters</h3>
//           <button
//             onClick={onClose}
//             style={{
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               padding: '8px',
//               display: 'flex',
//               alignItems: 'center',
//               borderRadius: '8px'
//             }}
//           >
//             <MdClose size={24} />
//           </button>
//         </div>
//         <div style={{ padding: '20px' }}>
//           {children}
//         </div>
//       </div>
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideIn {
//           from { transform: translateX(100%); }
//           to { transform: translateX(0); }
//         }
//       `}</style>
//     </>
//   )
// }

// // Pagination Component
// const Pagination: React.FC<{
//   paginationInfo: PaginationInfo
//   onPageChange: (page: number) => void
//   onLimitChange: (limit: number) => void
//   currentLimit: number
//   isMobile: boolean
// }> = ({ paginationInfo, onPageChange, onLimitChange, currentLimit, isMobile }) => {
//   const { currentPage, totalPages, totalProducts, hasNextPage, hasPrevPage } = paginationInfo
//   const [showLimitDropdown, setShowLimitDropdown] = useState(false)
//   const limitDropdownRef = useRef<HTMLDivElement>(null)

//   const limitOptions = [8, 12, 16, 20, 24]

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (limitDropdownRef.current && !limitDropdownRef.current.contains(event.target as Node)) {
//         setShowLimitDropdown(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   const getPageNumbers = () => {
//     const pages: (number | string)[] = []
//     const maxVisible = isMobile ? 3 : 5
    
//     if (totalPages <= maxVisible + 2) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i)
//       }
//     } else {
//       pages.push(1)
      
//       let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
//       let end = Math.min(totalPages - 1, start + maxVisible - 1)
      
//       if (end === totalPages - 1) {
//         start = Math.max(2, end - maxVisible + 1)
//       }
      
//       if (start > 2) {
//         pages.push('...')
//       }
      
//       for (let i = start; i <= end; i++) {
//         pages.push(i)
//       }
      
//       if (end < totalPages - 1) {
//         pages.push('...')
//       }
      
//       pages.push(totalPages)
//     }
    
//     return pages
//   }

//   const pageNumbers = getPageNumbers()

//   const buttonStyle: React.CSSProperties = {
//     padding: isMobile ? '8px 12px' : '8px 14px',
//     border: '1px solid #e5e7eb',
//     background: 'white',
//     cursor: 'pointer',
//     borderRadius: '8px',
//     fontSize: isMobile ? '14px' : '14px',
//     minWidth: isMobile ? '40px' : '40px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'all 0.2s',
//     fontWeight: 500,
//     color: '#374151'
//   }

//   const activeButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     background: 'black',
//     color: 'white',
//     fontWeight: '600',
//     border: '1px solid black'
//   }

//   const disabledButtonStyle: React.CSSProperties = {
//     ...buttonStyle,
//     cursor: 'not-allowed',
//     opacity: 0.4,
//     background: '#f9fafb'
//   }

//   if (totalPages <= 1 && totalProducts <= Math.min(...limitOptions)) {
//     return null
//   }

//   return (
//     <VStack gap="$4" style={{ width: '100%', alignItems: 'center', marginTop: '32px', marginBottom: '20px' }}>
//       {!isMobile && (
//         <HStack 
//           justify="space-between" 
//           align="center" 
//           style={{ width: '100%', flexWrap: 'wrap', gap: '16px' }}
//         >
//           <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
//             Showing {((currentPage - 1) * currentLimit) + 1} - {Math.min(currentPage * currentLimit, totalProducts)} of {totalProducts} products
//           </div>
          
//           <div ref={limitDropdownRef} style={{ position: 'relative' }}>
//             <HStack align="center" gap="$2">
//               <span style={{ fontSize: '14px', color: '#6b7280' }}>Show:</span>
//               <button
//                 onClick={() => setShowLimitDropdown(!showLimitDropdown)}
//                 style={{
//                   padding: '8px 16px',
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '8px',
//                   background: 'white',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: 500,
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   minWidth: '70px',
//                   justifyContent: 'space-between',
//                   color: '#374151'
//                 }}
//               >
//                 {currentLimit}
//                 <MdExpandMore 
//                   style={{ 
//                     transform: showLimitDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
//                     transition: 'transform 0.2s'
//                   }} 
//                 />
//               </button>
//             </HStack>

//             {showLimitDropdown && (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: '100%',
//                   right: 0,
//                   marginTop: '8px',
//                   background: 'white',
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '12px',
//                   boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//                   zIndex: 1000,
//                   minWidth: '80px',
//                   overflow: 'hidden'
//                 }}
//               >
//                 {limitOptions.map((limit) => (
//                   <button
//                     key={limit}
//                     onClick={() => {
//                       onLimitChange(limit)
//                       setShowLimitDropdown(false)
//                     }}
//                     style={{
//                       width: '100%',
//                       padding: '10px 16px',
//                       border: 'none',
//                       background: currentLimit === limit ? '#f9fafb' : 'white',
//                       cursor: 'pointer',
//                       fontSize: '14px',
//                       textAlign: 'left',
//                       fontWeight: currentLimit === limit ? '600' : '400',
//                       color: currentLimit === limit ? 'black' : '#374151',
//                       transition: 'all 0.2s'
//                     }}
//                   >
//                     {limit}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </HStack>
//       )}
      
//       {totalPages > 1 && (
//         <HStack gap={isMobile ? '$2' : '$2'} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={!hasPrevPage}
//             style={!hasPrevPage ? disabledButtonStyle : buttonStyle}
//           >
//             <MdChevronLeft size={isMobile ? 20 : 20} />
//             {!isMobile && <span style={{ marginLeft: '6px' }}>Prev</span>}
//           </button>

//           {pageNumbers.map((page, index) => {
//             if (page === '...') {
//               return (
//                 <span 
//                   key={`ellipsis-${index}`} 
//                   style={{ 
//                     padding: isMobile ? '8px 4px' : '8px 6px',
//                     fontSize: isMobile ? '16px' : '16px',
//                     color: '#9ca3af'
//                   }}
//                 >
//                   ...
//                 </span>
//               )
//             }
            
//             return (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(page as number)}
//                 style={currentPage === page ? activeButtonStyle : buttonStyle}
//               >
//                 {page}
//               </button>
//             )
//           })}

//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={!hasNextPage}
//             style={!hasNextPage ? disabledButtonStyle : buttonStyle}
//           >
//             {!isMobile && <span style={{ marginRight: '6px' }}>Next</span>}
//             <MdChevronRight size={isMobile ? 20 : 20} />
//           </button>
//         </HStack>
//       )}

//       {isMobile && (
//         <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
//           Page {currentPage} of {totalPages} • {totalProducts} products
//         </div>
//       )}
//     </VStack>
//   )
// }

// // Hierarchical Category Item Component
// const CategoryItem: React.FC<{
//   category: Category
//   level?: number
//   selectedFilters: SelectedFilters
//   onFilterChange: (filters: Partial<SelectedFilters>) => void
// }> = ({ category, level = 0, selectedFilters, onFilterChange }) => {
//   const [isExpanded, setIsExpanded] = useState(level === 0)
//   const hasSubCategories = category.subCategories && category.subCategories.length > 0
  
//   const paddingLeft = level * 20 + 'px'
  
//   const handleCategoryClick = () => {
//     const filterType = level === 0 ? 'categoryId' : level === 1 ? 'subCategoryId' : 'nestedSubCategoryId'
//     const nameType = level === 0 ? 'categoryName' : level === 1 ? 'subCategoryName' : 'nestedSubCategoryName'
    
//     onFilterChange({
//       [filterType]: category.id,
//       [nameType]: category.name,
//       ...(level === 0 && {
//         subCategoryId: '',
//         subCategoryName: '',
//         nestedSubCategoryId: '',
//         nestedSubCategoryName: ''
//       }),
//       ...(level === 1 && {
//         nestedSubCategoryId: '',
//         nestedSubCategoryName: ''
//       })
//     })
//   }

//   const isSelected = (): boolean => {
//     if (level === 0) return selectedFilters.categoryId === category.id
//     if (level === 1) return selectedFilters.subCategoryId === category.id
//     if (level === 2) return selectedFilters.nestedSubCategoryId === category.id
//     return false
//   }

//   return (
//     <div style={{ paddingLeft }}>
//       <HStack 
//         align="center" 
//         justify="space-between" 
//         style={{
//           cursor: 'pointer',
//           padding: '12px 8px',
//           borderRadius: '8px',
//           transition: 'background 0.2s',
//           background: isSelected() ? '#f3f4f6' : 'transparent',
//           marginBottom: '2px'
//         }}
//         onMouseEnter={(e) => {
//           if (!isSelected()) {
//             e.currentTarget.style.background = '#f9fafb'
//           }
//         }}
//         onMouseLeave={(e) => {
//           if (!isSelected()) {
//             e.currentTarget.style.background = 'transparent'
//           }
//         }}
//       >
//         <HStack align="center" gap="$3" style={{ flex: 1 }} onClick={handleCategoryClick}>
//           <div style={{
//             width: '18px',
//             height: '18px',
//             borderRadius: '4px',
//             border: `2px solid ${isSelected() ? 'black' : '#d1d5db'}`,
//             background: isSelected() ? 'black' : 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             {isSelected() && <MdCheck size={13} color="white" />}
//           </div>
//           <span style={{ 
//             fontSize: '14px', 
//             fontWeight: isSelected() ? '600' : '400',
//             color: isSelected() ? 'black' : '#374151'
//           }}>
//             {category.name}
//           </span>
//         </HStack>
//         {hasSubCategories && (
//           <div 
//             onClick={(e) => {
//               e.stopPropagation()
//               setIsExpanded(!isExpanded)
//             }}
//             style={{ 
//               cursor: 'pointer', 
//               padding: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               color: '#6b7280'
//             }}
//           >
//             {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
//           </div>
//         )}
//       </HStack>
      
//       {hasSubCategories && isExpanded && (
//         <div style={{ marginTop: '4px' }}>
//           {category.subCategories.map((subCategory) => (
//             <CategoryItem
//               key={subCategory.id}
//               category={subCategory}
//               level={level + 1}
//               selectedFilters={selectedFilters}
//               onFilterChange={onFilterChange}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // Sort Button Component with active state
// const SortButton: React.FC<{
//   currentSort: string
//   currentOrder: string
//   onSortChange: (sort: string, order: string) => void
//   isMobile?: boolean
// }> = ({ currentSort, currentOrder, onSortChange, isMobile = false }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const sortRef = useRef<HTMLDivElement>(null)

//   const getActiveSortLabel = () => {
//     if (currentSort === 'price') {
//       return currentOrder === 'asc' ? 'Price: Low to High' : 'Price: High to Low'
//     }
//     if (currentSort === 'name') {
//       return currentOrder === 'asc' ? 'Name: A to Z' : 'Name: Z to A'
//     }
//     return 'Sort by'
//   }

//   const sortOptions = [
//     { sort: 'price', order: 'asc', label: 'Price: Low to High', icon: '💰' },
//     { sort: 'price', order: 'desc', label: 'Price: High to Low', icon: '💎' },
//     { sort: 'name', order: 'asc', label: 'Name: A to Z', icon: '🔤' },
//     { sort: 'name', order: 'desc', label: 'Name: Z to A', icon: '🔠' }
//   ]

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const isActive = (option: typeof sortOptions[0]) => {
//     return currentSort === option.sort && currentOrder === option.order
//   }

//   return (
//     <div ref={sortRef} style={{ position: 'relative' }}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: isMobile ? '6px' : '8px',
//           padding: isMobile ? '10px 16px' : '8px 16px',
//           background: 'white',
//           border: '1px solid #e5e7eb',
//           borderRadius: '10px',
//           cursor: 'pointer',
//           fontSize: isMobile ? '14px' : '14px',
//           fontWeight: 500,
//           color: '#374151',
//           transition: 'all 0.2s',
//           boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//           flex: isMobile ? 1 : 'auto',
//           justifyContent: 'center'
//         }}
//       >
//         <FaSortAmountUp size={isMobile ? 14 : 16} />
//         <span>{isMobile ? 'Sort' : getActiveSortLabel()}</span>
//         {!isMobile && (
//           <MdExpandMore 
//             size={18} 
//             style={{ 
//               transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
//               transition: 'transform 0.2s'
//             }} 
//           />
//         )}
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '100%',
//             right: 0,
//             marginTop: '8px',
//             background: 'white',
//             border: '1px solid #e5e7eb',
//             borderRadius: '12px',
//             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//             minWidth: isMobile ? '200px' : '220px',
//             zIndex: 1000,
//             overflow: 'hidden'
//           }}
//         >
//           {sortOptions.map((option, index) => (
//             <button
//               key={`${option.sort}-${option.order}`}
//               onClick={() => {
//                 onSortChange(option.sort, option.order)
//                 setIsOpen(false)
//               }}
//               style={{
//                 width: '100%',
//                 padding: '12px 16px',
//                 border: 'none',
//                 background: isActive(option) ? '#f9fafb' : 'white',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 textAlign: 'left',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 borderBottom: index < sortOptions.length - 1 ? '1px solid #f3f4f6' : 'none',
//                 fontWeight: isActive(option) ? '600' : '400',
//                 color: isActive(option) ? 'black' : '#374151',
//                 transition: 'all 0.2s'
//               }}
//             >
//               <span>{option.icon}</span>
//               <span style={{ flex: 1 }}>{option.label}</span>
//               {isActive(option) && <MdCheck size={18} color="black" />}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export const ProductListSideComp: React.FC<{ isMobile?: boolean; onFilterChange?: () => void }> = ({ 
//   isMobile = false, 
//   onFilterChange 
// }) => {
//   const query = useQuery() as QueryParams
//   const { categoryData }: { categoryData: Category[] } = useSelector((state: any) => state.category)
//   const dispatch = useDispatch()
//   const updateQuery = useUpdateQuery()

//   const selectedFilters: SelectedFilters = {
//     categoryId: query.categoryId || '',
//     categoryName: query.categoryname || '',
//     subCategoryId: query.subCategoryId || '',
//     subCategoryName: query.subCategoryName || '',
//     nestedSubCategoryId: query.nestedSubCategoryId || '',
//     nestedSubCategoryName: query.nestedSubCategoryName || ''
//   }

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => {}
//       })
//     )
//   }, [dispatch])

//   const handleFilterChange = (newFilters: Partial<SelectedFilters>) => {
//     updateQuery({
//       ...query,
//       ...newFilters,
//       page: '1'
//     })
//     if (onFilterChange) onFilterChange()
//   }

//   const clearAllFilters = () => {
//     updateQuery({
//       ...query,
//       categoryId: '',
//       categoryname: '',
//       subCategoryId: '',
//       subCategoryName: '',
//       nestedSubCategoryId: '',
//       nestedSubCategoryName: '',
//       minPrice: '',
//       maxPrice: '',
//       isBestSelling: '',
//       isNewArrivals: '',
//       page: '1'
//     })
//     if (onFilterChange) onFilterChange()
//   }

//   const hasActiveFilters = selectedFilters.categoryId || selectedFilters.subCategoryId || 
//     selectedFilters.nestedSubCategoryId || query.minPrice || query.maxPrice || 
//     query.isBestSelling === 'true' || query.isNewArrivals === 'true'

//   return (
//     <VStack
//       align="flex-start"
//       justify="space-between"
//       style={{ width: '100%' }}
//       gap="$4"
//     >
//       <HStack justify="space-between" align="center" style={{ width: '100%' }}>
//         <Title primaryHeading style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600 }}>Categories</Title>
//         {hasActiveFilters && (
//           <button 
//             onClick={clearAllFilters}
//             style={{
//               border: 'none',
//               borderRadius: '8px',
//               padding: '6px 12px',
//               fontSize: '12px',
//               cursor: 'pointer',
//               background: '#f3f4f6',
//               color: '#374151',
//               fontWeight: 500,
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px',
//               transition: 'all 0.2s'
//             }}
//           >
//             <IoCloseOutline size={14} />
//             {/* Clear All */}
//           </button>
//         )}
//       </HStack>

//       {(selectedFilters.categoryName || selectedFilters.subCategoryName || selectedFilters.nestedSubCategoryName) && (
//         <div style={{
//           background: '#f9fafb',
//           padding: '12px',
//           borderRadius: '10px',
//           fontSize: '13px',
//           width: '100%',
//           border: '1px solid #f3f4f6'
//         }}>
//           <strong style={{ color: '#374151' }}>Selected Category:</strong>
//           <div style={{ marginTop: '6px', color: '#6b7280' }}>
//             {selectedFilters.categoryName && (
//               <span>{selectedFilters.categoryName}</span>
//             )}
//             {selectedFilters.subCategoryName && (
//               <span> → {selectedFilters.subCategoryName}</span>
//             )}
//             {selectedFilters.nestedSubCategoryName && (
//               <span> → {selectedFilters.nestedSubCategoryName}</span>
//             )}
//           </div>
//         </div>
//       )}

//       <div
//         style={{
//           width: '100%',
//           maxHeight: isMobile ? '300px' : '400px', 
//           overflowY: 'auto',
//           border: '1px solid #f3f4f6',
//           borderRadius: '12px',
//           padding: '8px',
//           background: 'white'
//         }}
//       >
//         <div
//           onClick={clearAllFilters}
//           style={{
//             padding: '10px 12px',
//             cursor: 'pointer',
//             borderRadius: '8px',
//             background: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'black' : 'transparent',
//             fontWeight: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? '600' : '400',
//             marginBottom: '4px',
//             color: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'white' : '#374151',
//             transition: 'all 0.2s'
//           }}
//         >
//           All Categories
//         </div>
        
//         {categoryData?.map((category) => (
//           <CategoryItem
//             key={category.id}
//             category={category}
//             level={0}
//             selectedFilters={selectedFilters}
//             onFilterChange={handleFilterChange}
//           />
//         ))}
//       </div>

//       <VStack align="flex-start" style={{ width: '100%' }} gap="$3">
//         <Title primaryHeading style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600, marginTop: '16px' }}>Price Range</Title>
//         <HStack
//           style={{ width: '100%' }}
//           gap="$3"
//           align="center"
//           justify="center"
//         >
//           <VStack gap="$2" style={{ flex: 1 }}>
//             <Title subheading style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>MIN</Title>
//             <InputField
//               type="number"
//               value={query.minPrice || ''}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 updateQuery({
//                   minPrice: e.target.value,
//                   page: '1'
//                 })
//               }}
//               placeholder="$0"
//               style={{ 
//                 fontSize: '14px', 
//                 padding: '10px',
//                 borderRadius: '10px',
//                 border: '1px solid #e5e7eb'
//               }}
//             />
//           </VStack>
//           <div style={{ marginTop: '20px', color: '#9ca3af', fontWeight: 500 }}>—</div>
//           <VStack gap="$2" style={{ flex: 1 }}>
//             <Title subheading style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>MAX</Title>
//             <InputField
//               type="number"
//               value={query.maxPrice || ''}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 updateQuery({
//                   maxPrice: e.target.value,
//                   page: '1'
//                 })
//               }}
//               placeholder="$1000+"
//               style={{ 
//                 fontSize: '14px', 
//                 padding: '10px',
//                 borderRadius: '10px',
//                 border: '1px solid #e5e7eb'
//               }}
//             />
//           </VStack>
//         </HStack>
//       </VStack>

//       <VStack align="flex-start" style={{ width: '100%',marginBottom: '16px' }} gap="$3">
//         <Title primaryHeading style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600, marginTop: '16px' }}>Product Tags</Title>
        
//         <HStack gap="$3" style={{ width: '100%', flexWrap: 'wrap' }}>
//           <button
//             onClick={() => {
//               updateQuery({
//                 isBestSelling: query.isBestSelling === 'true' ? '' : 'true',
//                 page: '1'
//               })
//               if (onFilterChange) onFilterChange()
//             }}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '20px',
//               border: `1px solid ${query.isBestSelling === 'true' ? 'black' : '#e5e7eb'}`,
//               background: query.isBestSelling === 'true' ? 'black' : 'white',
//               color: query.isBestSelling === 'true' ? 'white' : '#374151',
//               cursor: 'pointer',
//               fontSize: '13px',
//               fontWeight: 500,
//               transition: 'all 0.2s'
//             }}
//           >
//             🔥 Best Selling
//           </button>
          
//           <button
//             onClick={() => {
//               updateQuery({
//                 isNewArrivals: query.isNewArrivals === 'true' ? '' : 'true',
//                 page: '1'
//               })
//               if (onFilterChange) onFilterChange()
//             }}
//             style={{
//               padding: '8px 16px',
//               borderRadius: '20px',
//               border: `1px solid ${query.isNewArrivals === 'true' ? 'black' : '#e5e7eb'}`,
//               background: query.isNewArrivals === 'true' ? 'black' : 'white',
//               color: query.isNewArrivals === 'true' ? 'white' : '#374151',
//               cursor: 'pointer',
//               fontSize: '13px',
//               fontWeight: 500,
//               transition: 'all 0.2s'
//             }}
//           >
//             ✨ New Arrivals
//           </button>
//         </HStack>
//       </VStack>
//     </VStack>
//   )
// }

// export const ProductListForWeb: React.FC = () => {
//   const dispatch = useDispatch()
//   const query = useQuery() as QueryParams
//   const media = useMedia()
//   const productListRef = useRef<HTMLDivElement | null>(null)
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

//   const { 
//     data, 
//     loading,
//     pagination 
//   }: { 
//     data: Product[]
//     loading: boolean
//     pagination?: PaginationInfo 
//   } = useSelector((state: any) => state.product)
  
//   const updateQuery = useUpdateQuery()

//   const currentPage = parseInt(query.page || '1')
//   const currentLimit = parseInt(query.limit || '12')
//   const currentSort = query.sort || ''
//   const currentOrder = query.order || ''
//   const isMobile = !media.md

//   useEffect(() => {
//     const productQuery: any = {
//       page: currentPage,
//       limit: currentLimit
//     }

//     if (currentSort) productQuery.sort = currentSort
//     if (currentOrder) productQuery.order = currentOrder
    
//     if (query.categoryId) productQuery.categoryId = query.categoryId
//     if (query.subCategoryId) productQuery.subCategoryId = query.subCategoryId
//     if (query.nestedSubCategoryId) productQuery.nestedSubCategoryId = query.nestedSubCategoryId
    
//     if (query.search) productQuery.search = query.search

//     if (query.minPrice) {
//       const minPrice = parseInt(query.minPrice)
//       if (!isNaN(minPrice)) productQuery.minPrice = minPrice
//     }
//     if (query.maxPrice) {
//       const maxPrice = parseInt(query.maxPrice)
//       if (!isNaN(maxPrice)) productQuery.maxPrice = maxPrice
//     }

//     if (query.isBestSelling === 'true') productQuery.isBestSelling = true
//     if (query.isNewArrivals === 'true') productQuery.isNewArrivals = true

//     dispatch(
//       getProductListAction({
//         onSuccess: () => {
//           if (productListRef.current) {
//             productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
//           }
//         },
//         query: productQuery
//       })
//     )
//   }, [
//     dispatch,
//     currentSort,
//     currentOrder,
//     query.categoryId,
//     query.subCategoryId,
//     query.nestedSubCategoryId,
//     query.minPrice,
//     query.maxPrice,
//     query.search,
//     query.isBestSelling,
//     query.isNewArrivals,
//     currentPage,
//     currentLimit
//   ])

//   const handlePageChange = (newPage: number) => {
//     updateQuery({ page: newPage.toString() })
//     // Scroll to top on mobile
//     if (isMobile && productListRef.current) {
//       setTimeout(() => {
//         productListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//       }, 100)
//     }
//   }

//   const handleLimitChange = (newLimit: number) => {
//     updateQuery({ limit: newLimit.toString(), page: '1' })
//   }

//   const handleSortChange = (sort: string, order: string) => {
//     updateQuery({ sort, order, page: '1' })
//   }

//   // Mobile header with filter button
//   const MobileHeader = () => (
//     <div style={{
//       position: 'sticky',
//       top: 0,
//       zIndex: 100,
//       background: 'white',
//       borderBottom: '1px solid #f3f4f6',
//       padding: '12px 16px',
//       marginBottom: '16px'
//     }}>
//       <HStack justify="space-between" align="center">
//         <Title subheading style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
//           {pagination?.totalProducts ? `${pagination.totalProducts} Products` : data?.length > 0 ? `${data.length} Products` : 'Products'}
//         </Title>
        
//         <HStack gap="$2">
//           <SortButton
//             currentSort={currentSort}
//             currentOrder={currentOrder}
//             onSortChange={handleSortChange}
//             isMobile={true}
//           />
//           <button
//             onClick={() => setIsFilterModalOpen(true)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '6px',
//               padding: '10px 16px',
//               background: 'black',
//               color: 'white',
//               border: 'none',
//               borderRadius: '10px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: 500
//             }}
//           >
//             <BiFilterAlt size={16} />
//             Filter
//           </button>
//         </HStack>
//       </HStack>
//     </div>
//   )

//   return (
//     <>
//       <div
//         style={{ 
//           width: '100%', 
//           minHeight: '40vh',
//           maxWidth: '1400px',
//           margin: '0 auto',
//           padding: isMobile ? '0' : '0 20px'
//         }}
//         className="productWebPage-container"
//       >
//         {!isMobile && (
//           <div
//             style={{ 
//               width: '280px',
//               flexShrink: 0,
//               position: 'sticky',
//               top: '20px',
//               height: 'fit-content'
//             }}
//             className="productWebPage-container-left"
//           >
//             <ProductListSideComp />
//           </div>
//         )}
        
//         <VStack
//           style={{ 
//             width: isMobile ? '100%' : 'calc(100% - 300px)',
//             paddingLeft: isMobile ? '16px' : '24px'
//           }}
//           justify="space-between"
//           align="flex-start"
//         >
//           <VStack gap="$4" style={{ width: '100%' }}>
//             {isMobile ? (
//               <MobileHeader />
//             ) : (
//               <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
//                 <Title subheading style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
//                   {pagination?.totalProducts ? `${pagination.totalProducts} Products` : data?.length > 0 ? `${data.length} Products` : 'Products'}
//                 </Title>
//                 <SortButton
//                   currentSort={currentSort}
//                   currentOrder={currentOrder}
//                   onSortChange={handleSortChange}
//                 />
//               </HStack>
//             )}

//             {loading ? (
//               <ProductGridSkeleton count={currentLimit} />
//             ) : data?.length > 0 ? (
//               <>
//                 <div 
//                   ref={productListRef} 
//                   className="productListContainer"
//                   style={{
//                     display: 'grid',
//                     gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))',
//                     gap: isMobile ? '12px' : '20px',
//                     width: '100%'
//                   }}
//                 >
//                   {data.map((item: Product) => (
//                     <ProductCard data={item} key={item.id} />
//                   ))}
//                 </div>
                
//                 {pagination && (
//                   <Pagination
//                     paginationInfo={pagination}
//                     onPageChange={handlePageChange}
//                     onLimitChange={handleLimitChange}
//                     currentLimit={currentLimit}
//                     isMobile={isMobile}
//                   />
//                 )}
//               </>
//             ) : (
//               <div style={{ 
//                 textAlign: 'center', 
//                 padding: '60px 20px', 
//                 color: '#6b7280',
//                 width: '100%',
//                 background: '#f9fafb',
//                 borderRadius: '16px'
//               }}>
//                 <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
//                 <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>No products found</p>
//                 <p style={{ fontSize: '14px' }}>Try adjusting your filters or search criteria</p>
//               </div>
//             )}
//           </VStack>
//         </VStack>
//       </div>

//       {/* Mobile Filter Modal */}
//       {isMobile && (
//         <MobileFilterModal
//           isOpen={isFilterModalOpen}
//           onClose={() => setIsFilterModalOpen(false)}
//         >
//           <ProductListSideComp 
//             isMobile={true}
//             onFilterChange={() => setIsFilterModalOpen(false)}
//           />
//         </MobileFilterModal>
//       )}
//     </>
//   )
// }

// export default ProductListForWeb

import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSortAscending } from 'react-icons/ai'
import {
  CheckBox,
  HStack,
  InputField,
  Title,
  VStack
} from 'src/app/common'
import { useDispatch, useSelector } from 'src/store'
import { getCategoryListAction } from '../../category/category.slice'
import { getProductListAction } from '../../products/product.slice'
import { ProductCard } from 'src/app/components'
import { useMedia, useQuery } from 'src/hooks'
import { useUpdateQuery } from 'src/hooks/useUpdateQuery.hook'
import { FaSortAmountUp, FaFilter } from 'react-icons/fa'
import { MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight, MdCheck, MdClose } from 'react-icons/md'
import { HiOutlineFilter } from 'react-icons/hi'
import { IoCloseOutline } from 'react-icons/io5'
import { BiFilterAlt } from 'react-icons/bi'

// Types
interface Product {
  id: string
  name: string
  description: string
  originalPrice: number
  discountedPrice: number
  stockQuantity: number
  isBestSelling: boolean
  isNewArrivals: boolean
  isHotSelling: boolean
  images: Array<{
    _id: string
    colorName: string
    coloredImage: string
    __v: number
  }>
  category: {
    id: string
    name: string
    image: string
    subCategories: string[]
  }
  subCategory: {
    id: string
    name: string
    subCategories: any[]
  }
  nestedSubCategory?: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  image: string
  subCategories: Category[]
}

interface QueryParams {
  sort?: string
  order?: string
  categoryId?: string
  subCategoryId?: string
  nestedSubCategoryId?: string
  categoryname?: string
  subCategoryName?: string
  nestedSubCategoryName?: string
  minPrice?: string
  maxPrice?: string
  search?: string
  isBestSelling?: string
  isNewArrivals?: string
  page?: string
  limit?: string
}

interface SelectedFilters {
  categoryId: string
  categoryName: string
  subCategoryId: string
  subCategoryName: string
  nestedSubCategoryId: string
  nestedSubCategoryName: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Skeleton Loader Component
const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '12px',
        backgroundColor: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '12px',
          // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      <div
        style={{
          height: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          marginBottom: '8px',
          width: '80%',
          // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      <div
        style={{
          height: '14px',
          backgroundColor: '#f3f4f6',
          borderRadius: '4px',
          marginBottom: '12px',
          width: '60%',
          // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <div
          style={{
            height: '20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            width: '40%',
            // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        <div
          style={{
            height: '20px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            width: '30%',
            // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      </div>
      <div
        style={{
          height: '36px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          width: '100%',
          // animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="productListContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Mobile Filter Modal
const MobileFilterModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '400px',
          backgroundColor: 'white',
          zIndex: 10000000001,
          overflowY: 'auto',
          animation: 'slideIn 0.3s ease',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 10
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Filters</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px'
            }}
          >
            <MdClose size={24} />
          </button>
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

// Pagination Component
const Pagination: React.FC<{
  paginationInfo: PaginationInfo
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  currentLimit: number
  isMobile: boolean
}> = ({ paginationInfo, onPageChange, onLimitChange, currentLimit, isMobile }) => {
  const { currentPage, totalPages, totalProducts, hasNextPage, hasPrevPage } = paginationInfo
  const [showLimitDropdown, setShowLimitDropdown] = useState(false)
  const limitDropdownRef = useRef<HTMLDivElement>(null)

  const limitOptions = [8, 12, 16, 20, 24]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (limitDropdownRef.current && !limitDropdownRef.current.contains(event.target as Node)) {
        setShowLimitDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = isMobile ? 3 : 5
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      
      let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages - 1, start + maxVisible - 1)
      
      if (end === totalPages - 1) {
        start = Math.max(2, end - maxVisible + 1)
      }
      
      if (start > 2) {
        pages.push('...')
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  const buttonStyle: React.CSSProperties = {
    padding: isMobile ? '8px 12px' : '8px 14px',
    border: '1px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: isMobile ? '14px' : '14px',
    minWidth: isMobile ? '40px' : '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontWeight: 500,
    color: '#374151'
  }

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'black',
    color: 'white',
    fontWeight: '600',
    border: '1px solid black'
  }

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    cursor: 'not-allowed',
    opacity: 0.4,
    background: '#f9fafb'
  }

  if (totalPages <= 1 && totalProducts <= Math.min(...limitOptions)) {
    return null
  }

  return (
    <VStack gap="$4" style={{ width: '100%', alignItems: 'center', marginTop: '32px', marginBottom: '20px' }}>
      {!isMobile && (
        <HStack 
          justify="space-between" 
          align="center" 
          style={{ width: '100%', flexWrap: 'wrap', gap: '16px' }}
        >
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
            Showing {((currentPage - 1) * currentLimit) + 1} - {Math.min(currentPage * currentLimit, totalProducts)} of {totalProducts} products
          </div>
          
          <div ref={limitDropdownRef} style={{ position: 'relative' }}>
            <HStack align="center" gap="$2">
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Show:</span>
              <button
                onClick={() => setShowLimitDropdown(!showLimitDropdown)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '70px',
                  justifyContent: 'space-between',
                  color: '#374151'
                }}
              >
                {currentLimit}
                <MdExpandMore 
                  style={{ 
                    transform: showLimitDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </button>
            </HStack>

            {showLimitDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  minWidth: '80px',
                  overflow: 'hidden'
                }}
              >
                {limitOptions.map((limit) => (
                  <button
                    key={limit}
                    onClick={() => {
                      onLimitChange(limit)
                      setShowLimitDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: currentLimit === limit ? '#f9fafb' : 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: currentLimit === limit ? '600' : '400',
                      color: currentLimit === limit ? 'black' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            )}
          </div>
        </HStack>
      )}
      
      {totalPages > 1 && (
        <HStack gap={isMobile ? '$2' : '$2'} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            style={!hasPrevPage ? disabledButtonStyle : buttonStyle}
          >
            <MdChevronLeft size={isMobile ? 20 : 20} />
            {!isMobile && <span style={{ marginLeft: '6px' }}>Prev</span>}
          </button>

          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`} 
                  style={{ 
                    padding: isMobile ? '8px 4px' : '8px 6px',
                    fontSize: isMobile ? '16px' : '16px',
                    color: '#9ca3af'
                  }}
                >
                  ...
                </span>
              )
            }
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                style={currentPage === page ? activeButtonStyle : buttonStyle}
              >
                {page}
              </button>
            )
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            style={!hasNextPage ? disabledButtonStyle : buttonStyle}
          >
            {!isMobile && <span style={{ marginRight: '6px' }}>Next</span>}
            <MdChevronRight size={isMobile ? 20 : 20} />
          </button>
        </HStack>
      )}

      {isMobile && (
        <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
          Page {currentPage} of {totalPages} • {totalProducts} products
        </div>
      )}
    </VStack>
  )
}

// Hierarchical Category Item Component
const CategoryItem: React.FC<{
  category: Category
  level?: number
  selectedFilters: SelectedFilters
  onFilterChange: (filters: Partial<SelectedFilters>) => void
}> = ({ category, level = 0, selectedFilters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const hasSubCategories = category.subCategories && category.subCategories.length > 0
  
  const paddingLeft = level * 20 + 'px'
  
  const handleCategoryClick = () => {
    const filterType = level === 0 ? 'categoryId' : level === 1 ? 'subCategoryId' : 'nestedSubCategoryId'
    const nameType = level === 0 ? 'categoryName' : level === 1 ? 'subCategoryName' : 'nestedSubCategoryName'
    
    onFilterChange({
      [filterType]: category.id,
      [nameType]: category.name,
      ...(level === 0 && {
        subCategoryId: '',
        subCategoryName: '',
        nestedSubCategoryId: '',
        nestedSubCategoryName: ''
      }),
      ...(level === 1 && {
        nestedSubCategoryId: '',
        nestedSubCategoryName: ''
      })
    })
  }

  const isSelected = (): boolean => {
    if (level === 0) return selectedFilters.categoryId === category.id
    if (level === 1) return selectedFilters.subCategoryId === category.id
    if (level === 2) return selectedFilters.nestedSubCategoryId === category.id
    return false
  }

  return (
    <div style={{ paddingLeft }}>
      <HStack 
        align="center" 
        justify="space-between" 
        style={{
          cursor: 'pointer',
          padding: '12px 8px',
          borderRadius: '8px',
          transition: 'background 0.2s',
          background: isSelected() ? '#f3f4f6' : 'transparent',
          marginBottom: '2px'
        }}
        onMouseEnter={(e) => {
          if (!isSelected()) {
            e.currentTarget.style.background = '#f9fafb'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected()) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        <HStack align="center" gap="$3" style={{ flex: 1 }} onClick={handleCategoryClick}>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '4px',
            border: `2px solid ${isSelected() ? 'black' : '#d1d5db'}`,
            background: isSelected() ? 'black' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isSelected() && <MdCheck size={13} color="white" />}
          </div>
          <span style={{ 
            fontSize: '14px', 
            fontWeight: isSelected() ? '600' : '400',
            color: isSelected() ? 'black' : '#374151'
          }}>
            {category.name}
          </span>
        </HStack>
        {hasSubCategories && (
          <div 
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            style={{ 
              cursor: 'pointer', 
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: '#6b7280'
            }}
          >
            {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
          </div>
        )}
      </HStack>
      
      {hasSubCategories && isExpanded && (
        <div style={{ marginTop: '4px' }}>
          {category.subCategories.map((subCategory) => (
            <CategoryItem
              key={subCategory.id}
              category={subCategory}
              level={level + 1}
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Sort Button Component - UPDATED to use discountedPrice
const SortButton: React.FC<{
  currentSort: string
  currentOrder: string
  onSortChange: (sort: string, order: string) => void
  isMobile?: boolean
}> = ({ currentSort, currentOrder, onSortChange, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const getActiveSortLabel = () => {
    if (currentSort === 'discountedPrice') {
      return currentOrder === 'asc' ? 'Price: Low to High' : 'Price: High to Low'
    }
    if (currentSort === 'name') {
      return currentOrder === 'asc' ? 'Name: A to Z' : 'Name: Z to A'
    }
    return 'Sort by'
  }

  const sortOptions = [
    { sort: 'discountedPrice', order: 'asc', label: 'Price: Low to High', icon: '💰' },
    { sort: 'discountedPrice', order: 'desc', label: 'Price: High to Low', icon: '💎' },
    { sort: 'name', order: 'asc', label: 'Name: A to Z', icon: '🔤' },
    { sort: 'name', order: 'desc', label: 'Name: Z to A', icon: '🔠' }
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (option: typeof sortOptions[0]) => {
    return currentSort === option.sort && currentOrder === option.order
  }

  return (
    <div ref={sortRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '6px' : '8px',
          padding: isMobile ? '10px 16px' : '8px 16px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: isMobile ? '14px' : '14px',
          fontWeight: 500,
          color: '#374151',
          transition: 'all 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          flex: isMobile ? 1 : 'auto',
          justifyContent: 'center'
        }}
      >
        <FaSortAmountUp size={isMobile ? 14 : 16} />
        <span>{isMobile ? 'Sort' : getActiveSortLabel()}</span>
        {!isMobile && (
          <MdExpandMore 
            size={18} 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} 
          />
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            minWidth: isMobile ? '200px' : '220px',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {sortOptions.map((option, index) => (
            <button
              key={`${option.sort}-${option.order}`}
              onClick={() => {
                onSortChange(option.sort, option.order)
                setIsOpen(false)
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: isActive(option) ? '#f9fafb' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: index < sortOptions.length - 1 ? '1px solid #f3f4f6' : 'none',
                fontWeight: isActive(option) ? '600' : '400',
                color: isActive(option) ? 'black' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <span>{option.icon}</span>
              <span style={{ flex: 1 }}>{option.label}</span>
              {isActive(option) && <MdCheck size={18} color="black" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const ProductListSideComp: React.FC<{ isMobile?: boolean; onFilterChange?: () => void }> = ({ 
  isMobile = false, 
  onFilterChange 
}) => {
  const query = useQuery() as QueryParams
  const { categoryData }: { categoryData: Category[] } = useSelector((state: any) => state.category)
  const dispatch = useDispatch()
  const updateQuery = useUpdateQuery()

  const selectedFilters: SelectedFilters = {
    categoryId: query.categoryId || '',
    categoryName: query.categoryname || '',
    subCategoryId: query.subCategoryId || '',
    subCategoryName: query.subCategoryName || '',
    nestedSubCategoryId: query.nestedSubCategoryId || '',
    nestedSubCategoryName: query.nestedSubCategoryName || ''
  }

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [dispatch])

  const handleFilterChange = (newFilters: Partial<SelectedFilters>) => {
    updateQuery({
      ...query,
      ...newFilters,
      page: '1'
    })
    if (onFilterChange) onFilterChange()
  }

  const clearAllFilters = () => {
    updateQuery({
      ...query,
      categoryId: '',
      categoryname: '',
      subCategoryId: '',
      subCategoryName: '',
      nestedSubCategoryId: '',
      nestedSubCategoryName: '',
      minPrice: '',
      maxPrice: '',
      isBestSelling: '',
      isNewArrivals: '',
      page: '1'
    })
    if (onFilterChange) onFilterChange()
  }

  const hasActiveFilters = selectedFilters.categoryId || selectedFilters.subCategoryId || 
    selectedFilters.nestedSubCategoryId || query.minPrice || query.maxPrice || 
    query.isBestSelling === 'true' || query.isNewArrivals === 'true'

  return (
    <VStack
      align="flex-start"
      justify="space-between"
      style={{ width: '100%' }}
      gap="$4"
    >
      <HStack justify="space-between" align="center" style={{ width: '100%' }}>
        <Title primaryHeading style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600 }}>Categories</Title>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            style={{
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              background: '#f3f4f6',
              color: '#374151',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            <IoCloseOutline size={14} />
          </button>
        )}
      </HStack>

      {(selectedFilters.categoryName || selectedFilters.subCategoryName || selectedFilters.nestedSubCategoryName) && (
        <div style={{
          background: '#f9fafb',
          padding: '12px',
          borderRadius: '10px',
          fontSize: '13px',
          width: '100%',
          border: '1px solid #f3f4f6'
        }}>
          <strong style={{ color: '#374151' }}>Selected Category:</strong>
          <div style={{ marginTop: '6px', color: '#6b7280' }}>
            {selectedFilters.categoryName && (
              <span>{selectedFilters.categoryName}</span>
            )}
            {selectedFilters.subCategoryName && (
              <span> → {selectedFilters.subCategoryName}</span>
            )}
            {selectedFilters.nestedSubCategoryName && (
              <span> → {selectedFilters.nestedSubCategoryName}</span>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          width: '100%',
          maxHeight: isMobile ? '300px' : '400px', 
          overflowY: 'auto',
          border: '1px solid #f3f4f6',
          borderRadius: '12px',
          padding: '8px',
          background: 'white'
        }}
      >
        <div
          onClick={clearAllFilters}
          style={{
            padding: '10px 12px',
            cursor: 'pointer',
            borderRadius: '8px',
            background: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'black' : 'transparent',
            fontWeight: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? '600' : '400',
            marginBottom: '4px',
            color: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'white' : '#374151',
            transition: 'all 0.2s'
          }}
        >
          All Categories
        </div>
        
        {categoryData?.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            level={0}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        ))}
      </div>

      <VStack align="flex-start" style={{ width: '100%' }} gap="$3">
        <Title primaryHeading style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600, marginTop: '16px' }}>Price Range</Title>
        <HStack
          style={{ width: '100%' }}
          gap="$3"
          align="center"
          justify="center"
        >
          <VStack gap="$2" style={{ flex: 1 }}>
            <Title subheading style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>MIN</Title>
            <InputField
              type="number"
              value={query.minPrice || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateQuery({
                  minPrice: e.target.value,
                  page: '1'
                })
              }}
              placeholder="0"
              style={{ 
                fontSize: '14px', 
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              }}
            />
          </VStack>
          <div style={{ marginTop: '20px', color: '#9ca3af', fontWeight: 500 }}>—</div>
          <VStack gap="$2" style={{ flex: 1 }}>
            <Title subheading style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>MAX</Title>
            <InputField
              type="number"
              value={query.maxPrice || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateQuery({
                  maxPrice: e.target.value,
                  page: '1'
                })
              }}
              placeholder="1000+"
              style={{ 
                fontSize: '14px', 
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              }}
            />
          </VStack>
        </HStack>
      </VStack>

      <VStack align="flex-start" style={{ width: '100%',marginBottom: '16px' }} gap="$3">
        <Title primaryHeading style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600, marginTop: '16px' }}>Product Tags</Title>
        
        <HStack gap="$3" style={{ width: '100%', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              updateQuery({
                isBestSelling: query.isBestSelling === 'true' ? '' : 'true',
                page: '1'
              })
              if (onFilterChange) onFilterChange()
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${query.isBestSelling === 'true' ? 'black' : '#e5e7eb'}`,
              background: query.isBestSelling === 'true' ? 'black' : 'white',
              color: query.isBestSelling === 'true' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            🔥 Best Selling
          </button>
          
          <button
            onClick={() => {
              updateQuery({
                isNewArrivals: query.isNewArrivals === 'true' ? '' : 'true',
                page: '1'
              })
              if (onFilterChange) onFilterChange()
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${query.isNewArrivals === 'true' ? 'black' : '#e5e7eb'}`,
              background: query.isNewArrivals === 'true' ? 'black' : 'white',
              color: query.isNewArrivals === 'true' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            ✨ New Arrivals
          </button>
        </HStack>
      </VStack>
    </VStack>
  )
}

export const ProductListForWeb: React.FC = () => {
  const dispatch = useDispatch()
  const query = useQuery() as QueryParams
  const media = useMedia()
  const productListRef = useRef<HTMLDivElement | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const { 
    data, 
    loading,
    pagination 
  }: { 
    data: Product[]
    loading: boolean
    pagination?: PaginationInfo 
  } = useSelector((state: any) => state.product)
  
  const updateQuery = useUpdateQuery()

  const currentPage = parseInt(query.page || '1')
  const currentLimit = parseInt(query.limit || '12')
  const currentSort = query.sort || ''
  const currentOrder = query.order || ''
  const isMobile = !media.md ;
   useEffect(() => {
    const productQuery: any = {
      page: currentPage,
      limit: currentLimit
    }

    if (currentSort) productQuery.sort = currentSort
    if (currentOrder) productQuery.order = currentOrder
    
    if (query.categoryId) productQuery.categoryId = query.categoryId
    if (query.subCategoryId) productQuery.subCategoryId = query.subCategoryId
    if (query.nestedSubCategoryId) productQuery.nestedSubCategoryId = query.nestedSubCategoryId
    
    if (query.search) productQuery.search = query.search

    if (query.minPrice) {
      const minPrice = parseInt(query.minPrice)
      if (!isNaN(minPrice)) productQuery.minPrice = minPrice
    }
    if (query.maxPrice) {
      const maxPrice = parseInt(query.maxPrice)
      if (!isNaN(maxPrice)) productQuery.maxPrice = maxPrice
    }

    if (query.isBestSelling === 'true') productQuery.isBestSelling = true
    if (query.isNewArrivals === 'true') productQuery.isNewArrivals = true

    dispatch(
      getProductListAction({
        onSuccess: () => {
          if (productListRef.current) {
            productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        },
        query: productQuery
      })
    )
  }, [
    dispatch,
    currentSort,
    currentOrder,
    query.categoryId,
    query.subCategoryId,
    query.nestedSubCategoryId,
    query.minPrice,
    query.maxPrice,
    query.search,
    query.isBestSelling,
    query.isNewArrivals,
    currentPage,
    currentLimit
  ])

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: newPage.toString() })
    if (isMobile && productListRef.current) {
      setTimeout(() => {
        productListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  const handleLimitChange = (newLimit: number) => {
    updateQuery({ limit: newLimit.toString(), page: '1' })
  }

  const handleSortChange = (sort: string, order: string) => {
    updateQuery({ sort, order, page: '1' })
  }

  const MobileHeader = () => (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'white',
      borderBottom: '1px solid #f3f4f6',
      padding: '12px 16px',
      marginBottom: '16px'
    }}>
      <HStack justify="space-between" align="center">
        <Title subheading style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
          {pagination?.totalProducts ? `${pagination.totalProducts} Products` : data?.length > 0 ? `${data.length} Products` : 'Products'}
        </Title>
        
        <HStack gap="$2">
          <SortButton
            currentSort={currentSort}
            currentOrder={currentOrder}
            onSortChange={handleSortChange}
            isMobile={true}
          />
          <button
            onClick={() => setIsFilterModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              background: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <BiFilterAlt size={16} />
            Filter
          </button>
        </HStack>
      </HStack>
    </div>
  )

  return (
    <>
      <div
        style={{ 
          width: '100%', 
          minHeight: '40vh',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '0' : '0 20px'
        }}
        className="productWebPage-container"
      >
        {!isMobile && (
          <div
            style={{ 
              width: '280px',
              flexShrink: 0,
              position: 'sticky',
              top: '20px',
              height: 'fit-content'
            }}
            className="productWebPage-container-left"
          >
            <ProductListSideComp />
          </div>
        )}
        
        <VStack
          style={{ 
            width: isMobile ? '100%' : 'calc(100% - 300px)',
            paddingLeft: isMobile ? '16px' : '24px'
          }}
          justify="space-between"
          align="flex-start"
        >
          <VStack gap="$4" style={{ width: '100%' }}>
            {isMobile ? (
              <MobileHeader />
            ) : (
              <HStack justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <Title subheading style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                  {pagination?.totalProducts ? `${pagination.totalProducts} Products` : data?.length > 0 ? `${data.length} Products` : 'Products'}
                </Title>
                <SortButton
                  currentSort={currentSort}
                  currentOrder={currentOrder}
                  onSortChange={handleSortChange}
                />
              </HStack>
            )}

            {loading ? (
              <ProductGridSkeleton count={currentLimit} />
            ) : data?.length > 0 ? (
              <>
                <div 
                  ref={productListRef} 
                  className="productListContainer"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: isMobile ? '12px' : '20px',
                    width: '100%'
                  }}
                >
                  {data.map((item: Product) => (
                    <ProductCard data={item} key={item.id} />
                  ))}
                </div>
                
                {pagination && (
                  <Pagination
                    paginationInfo={pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    currentLimit={currentLimit}
                    isMobile={isMobile}
                  />
                )}
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                color: '#6b7280',
                width: '100%',
                background: '#f9fafb',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>No products found</p>
                <p style={{ fontSize: '14px' }}>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </VStack>
        </VStack>
      </div>

      {isMobile && (
        <MobileFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        >
          <ProductListSideComp 
            isMobile={true}
            onFilterChange={() => setIsFilterModalOpen(false)}
          />
        </MobileFilterModal>
      )}
    </>
  )
}

export default ProductListForWeb