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
import { FaSortAmountUp } from 'react-icons/fa'
import { MdExpandMore, MdExpandLess, MdChevronLeft, MdChevronRight } from 'react-icons/md'

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
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: 'white',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#e5e7eb',
          borderRadius: '6px',
          marginBottom: '12px'
        }}
      />
      <div
        style={{
          height: '16px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '8px',
          width: '80%'
        }}
      />
      <div
        style={{
          height: '14px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '12px',
          width: '60%'
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
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            width: '40%'
          }}
        />
        <div
          style={{
            height: '20px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            width: '30%'
          }}
        />
      </div>
      <div
        style={{
          height: '36px',
          backgroundColor: '#e5e7eb',
          borderRadius: '6px',
          width: '100%'
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
    <div className="productListContainer">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
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

  const limitOptions = [5, 10, 15, 20, 25]

  // Close dropdown when clicking outside
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = isMobile ? 3 : 5
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages - 1, start + maxVisible - 1)
      
      // Adjust start if we're near the end
      if (end === totalPages - 1) {
        start = Math.max(2, end - maxVisible + 1)
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  const buttonStyle: React.CSSProperties = {
    padding: isMobile ? '6px 10px' : '8px 12px',
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: isMobile ? '12px' : '14px',
    minWidth: isMobile ? '32px' : '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  }

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'black',
    color: 'white',
    fontWeight: 'bold',
    border: '1px solid black'
  }

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    cursor: 'not-allowed',
    opacity: 0.5,
    background: '#f5f5f5'
  }

  if (totalPages <= 1 && totalProducts <= Math.min(...limitOptions)) {
    return null
  }

  return (
    <VStack gap="$3" style={{ width: '100%', alignItems: 'center', marginTop: '24px' }}>
      {/* Top section with info and limit selector */}
      <HStack 
        justify="space-between" 
        align="center" 
        style={{ 
          width: '100%', 
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '12px' : '16px'
        }}
      >
        <div style={{ 
          fontSize: isMobile ? '12px' : '14px', 
          color: '#666',
          textAlign: isMobile ? 'center' : 'left',
          flex: isMobile ? '1 1 100%' : '1'
        }}>
          Showing page {currentPage} of {totalPages} ({totalProducts} total products)
        </div>
        
        {/* Items per page dropdown */}
        <div 
          ref={limitDropdownRef}
          style={{ 
            position: 'relative',
            flex: isMobile ? '1 1 100%' : '0 0 auto'
          }}
        >
          <HStack 
            align="center" 
            gap="$2"
            style={{
              justifyContent: isMobile ? 'center' : 'flex-end'
            }}
          >
            <span style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              color: '#666',
              whiteSpace: 'nowrap'
            }}>
              Items per page:
            </span>
            <button
              onClick={() => setShowLimitDropdown(!showLimitDropdown)}
              style={{
                padding: isMobile ? '6px 12px' : '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '70px',
                justifyContent: 'space-between'
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

          {/* Dropdown menu */}
          {showLimitDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '80px'
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
                    padding: '8px 16px',
                    border: 'none',
                    background: currentLimit === limit ? '#f0f0f0' : 'white',
                    cursor: 'pointer',
                    fontSize: isMobile ? '12px' : '14px',
                    textAlign: 'left',
                    fontWeight: currentLimit === limit ? 'bold' : 'normal',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currentLimit !== limit) {
                      e.currentTarget.style.background = '#f8f8f8'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentLimit !== limit) {
                      e.currentTarget.style.background = 'white'
                    }
                  }}
                >
                  {limit}
                </button>
              ))}
            </div>
          )}
        </div>
      </HStack>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <HStack gap={isMobile ? '$1' : '$2'} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            style={!hasPrevPage ? disabledButtonStyle : buttonStyle}
            aria-label="Previous page"
          >
            <MdChevronLeft size={isMobile ? 16 : 20} />
            {!isMobile && <span style={{ marginLeft: '4px' }}>Prev</span>}
          </button>

          {/* Page Numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`} 
                  style={{ 
                    padding: isMobile ? '6px 4px' : '8px 6px',
                    fontSize: isMobile ? '12px' : '14px'
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
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            style={!hasNextPage ? disabledButtonStyle : buttonStyle}
            aria-label="Next page"
          >
            {!isMobile && <span style={{ marginRight: '4px' }}>Next</span>}
            <MdChevronRight size={isMobile ? 16 : 20} />
          </button>
        </HStack>
      )}

      {/* Quick jump to first/last on desktop */}
      {!isMobile && totalPages > 5 && (
        <HStack gap="$2" style={{ fontSize: '12px', color: '#666' }}>
          {currentPage !== 1 && (
            <button
              onClick={() => onPageChange(1)}
              style={{
                ...buttonStyle,
                fontSize: '12px',
                padding: '4px 8px'
              }}
            >
              Go to first
            </button>
          )}
          {currentPage !== totalPages && (
            <button
              onClick={() => onPageChange(totalPages)}
              style={{
                ...buttonStyle,
                fontSize: '12px',
                padding: '4px 8px'
              }}
            >
              Go to last
            </button>
          )}
        </HStack>
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
  const [isExpanded, setIsExpanded] = useState(false)
  const hasSubCategories = category.subCategories && category.subCategories.length > 0
  
  const paddingLeft = level * 20 + 'px'
  
  const handleCategoryClick = () => {
    const filterType = level === 0 ? 'categoryId' : level === 1 ? 'subCategoryId' : 'nestedSubCategoryId'
    const nameType = level === 0 ? 'categoryName' : level === 1 ? 'subCategoryName' : 'nestedSubCategoryName'
    
    console.log('Category clicked:', { level, categoryId: category.id, categoryName: category.name, filterType, nameType })
    
    onFilterChange({
      [filterType]: category.id,
      [nameType]: category.name,
      // Clear lower level filters when selecting higher level
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
          padding: '8px 0',
          borderBottom: level === 0 ? '1px solid #eee' : 'none'
        }}
      >
        <HStack align="center" gap="$2">
          <CheckBox
            name={category.name}
            label={category.name}
            handleCheckboxChange={handleCategoryClick}
            check={isSelected()}
          />
        </HStack>
        {hasSubCategories && (
          <div 
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            style={{ cursor: 'pointer', padding: '4px' }}
          >
            {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
          </div>
        )}
      </HStack>
      
      {hasSubCategories && isExpanded && (
        <div style={{ marginTop: '8px' }}>
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

export const ProductListSideComp: React.FC = () => {
  const query = useQuery() as QueryParams
  const { categoryData }: { categoryData: Category[] } = useSelector((state: any) => state.category)
  const dispatch = useDispatch()
  const updateQuery = useUpdateQuery()
  const media = useMedia()

  const selectedFilters: SelectedFilters = {
    categoryId: query.categoryId || '',
    categoryName: query.categoryname || '',
    subCategoryId: query.subCategoryId || '',
    subCategoryName: query.subCategoryName || '',
    nestedSubCategoryId: query.nestedSubCategoryId || '',
    nestedSubCategoryName: query.nestedSubCategoryName || ''
  }

  console.log('ProductListSideComp - Query params:', query)
  console.log('ProductListSideComp - Selected filters:', selectedFilters)

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [dispatch])

  const handleFilterChange = (newFilters: Partial<SelectedFilters>) => {
    console.log('Filter change requested:', newFilters)
    // Reset to page 1 when filters change
    updateQuery({
      ...query,
      ...newFilters,
      page: '1'
    })
  }

  const clearAllFilters = () => {
    console.log('Clearing all filters')
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
  }

  const isMobile = !media.md
  const [showFilters, setShowFilters] = React.useState(!isMobile)

  return (
    <VStack
      align="flex-start"
      justify="space-between"
      style={{ width: '100%' }}
      gap="$4"
    >
      {isMobile && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Filters & Categories</span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>
      )}

      {(!isMobile || showFilters) && (
        <>
          <HStack justify="space-between" align="center" style={{ width: '100%' }}>
            <Title primaryHeading>Categories</Title>
            {(selectedFilters.categoryId || selectedFilters.subCategoryId || selectedFilters.nestedSubCategoryId) && (
              <button 
                onClick={clearAllFilters}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  background: 'black',
                  color: 'white'
                }}
              >
                Clear All
              </button>
            )}
          </HStack>

          {(selectedFilters.categoryName || selectedFilters.subCategoryName || selectedFilters.nestedSubCategoryName) && (
            <div style={{
              background: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '11px',
              width: '100%'
            }}>
              <strong>Selected:</strong>
              <div style={{ marginTop: '4px' }}>
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
              maxHeight: isMobile ? '150px' : '300px', 
              overflowY: 'auto',
              border: '1px solid #eee',
              borderRadius: '4px',
              padding: '8px'
            }}
          >
            <div
              onClick={clearAllFilters}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '4px',
                background: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'black' : 'transparent',
                fontWeight: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'bold' : 'normal',
                marginBottom: '4px',
                color: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'white' : 'black'
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

          <VStack align="flex-start" style={{ width: '100%' }} gap="$2">
            <Title primaryHeading>Price Range</Title>
            <HStack
              style={{ width: '100%' }}
              gap="$2"
              align="center"
              justify="center"
            >
              <VStack gap="$1" style={{ flex: 1 }}>
                <Title subheading style={{ fontSize: isMobile ? '10px' : '12px' }}>FROM</Title>
                <InputField
                  type="number"
                  value={query.minPrice || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateQuery({
                      minPrice: e.target.value,
                      page: '1'
                    })
                  }}
                  placeholder="Min"
                  style={{ fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px' : '8px' }}
                />
              </VStack>
              <HStack justify="center" align="center" style={{ padding: isMobile ? '0 4px' : '0 8px', marginTop: '20px' }}>
                -
              </HStack>
              <VStack gap="$1" style={{ flex: 1 }}>
                <Title subheading style={{ fontSize: isMobile ? '10px' : '12px' }}>TO</Title>
                <InputField
                  type="number"
                  value={query.maxPrice || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateQuery({
                      maxPrice: e.target.value,
                      page: '1'
                    })
                  }}
                  placeholder="Max"
                  style={{ fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px' : '8px' }}
                />
              </VStack>
            </HStack>
          </VStack>

          <VStack align="flex-start" style={{ width: '100%',marginTop:'20px' }} gap="$2">
            <Title primaryHeading>Filters</Title>
            
            <HStack gap={isMobile ? '$3' : '$2'} style={{ width: '100%', flexWrap: 'wrap' }}>
              <CheckBox
                name="isBestSelling"
                label="Best Selling"
                handleCheckboxChange={(checked: boolean) => {
                  updateQuery({
                    isBestSelling: checked ? 'true' : '',
                    page: '1'
                  })
                }}
                check={query.isBestSelling === 'true'}
              />
              
              <CheckBox
                name="isNewArrivals"
                label="New Arrivals"
                handleCheckboxChange={(checked: boolean) => {
                  updateQuery({
                    isNewArrivals: checked ? 'true' : '',
                    page: '1'
                  })
                }}
                check={query.isNewArrivals === 'true'}
              />
            </HStack>
          </VStack>
        </>
      )}
    </VStack>
  )
}

export const ProductListForWeb: React.FC = () => {
  const [sortVisible, setSortVisible] = useState(false)
  const sortRef = useRef<HTMLDivElement | null>(null)
  const productListRef = useRef<HTMLDivElement | null>(null)
  
  const dispatch = useDispatch()
  const query = useQuery() as QueryParams
  const media = useMedia()

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

  // Get current page and limit from query params
  const currentPage = parseInt(query.page || '1')
  const currentLimit = parseInt(query.limit || '12')

  useEffect(() => {
    const productQuery: any = {
      page: currentPage,
      limit: currentLimit
    }

    if (query.sort) productQuery.sort = query.sort
    if (query.order) productQuery.order = query.order
    
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

    console.log('ProductListForWeb - Fetching products with query:', productQuery)
    console.log('ProductListForWeb - URL query params:', query)

    dispatch(
      getProductListAction({
        onSuccess: () => {
          console.log('Products fetched successfully')
          // Scroll to top of product list when page changes
          if (productListRef.current) {
            productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        },
        query: productQuery
      })
    )
  }, [
    dispatch,
    query.sort,
    query.order,
    query.categoryId,
    query.subCategoryId,
    query.nestedSubCategoryId,
    query.minPrice,
    query.maxPrice,
    query.search,
    query.isBestSelling,
    query.isNewArrivals,
    query.page,
    query.limit,
    currentPage,
    currentLimit
  ])

  const handleOutSideClick = (event: MouseEvent) => {
    if (
      sortRef.current &&
      !sortRef.current.contains(event.target as Node) &&
      event.target !== document.getElementById('openModalButton')
    ) {
      setSortVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleOutSideClick)
    return () => {
      document.removeEventListener('click', handleOutSideClick)
    }
  }, [])

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage)
    updateQuery({
      page: newPage.toString()
    })
  }

  const handleLimitChange = (newLimit: number) => {
    console.log('Changing limit to:', newLimit)
    // Reset to page 1 when changing items per page
    updateQuery({
      limit: newLimit.toString(),
      page: '1'
    })
  }

  const handleSortChange = (sort: string, order: string) => {
    updateQuery({
      sort,
      order,
      page: '1' // Reset to first page when sorting changes
    })
    setSortVisible(false)
  }

  return (
    <div
      style={{ width: '90%', minHeight: '40vh' }}
      className="productWebPage-container"
    >
      <div
        style={{ width: media.md ? '25%' : '100%' }}
        className="productWebPage-container-left"
      >
        <ProductListSideComp />
      </div>
      <VStack
        style={{ width: media.md ? '75%' : '100%' }}
        justify="space-between"
        align="flex-start"
      >
        <VStack gap="$3" style={{ width: '100%' }} ref={productListRef}>
          <HStack justify="space-between" align="center">
            <Title subheading>
              Products {pagination?.totalProducts ? `(${pagination.totalProducts})` : data?.length > 0 ? `(${data.length})` : ''}
            </Title>

            <VStack className="sortMainContainer" style={{ position: 'relative' }}>
              <HStack
                id="openModalButton"
                onClick={() => setSortVisible((prev) => !prev)}
                align="center"
                justify="flex-start"
                style={{ cursor: 'pointer' }}
                gap="$3"
              >
                Sort
                <FaSortAmountUp />
              </HStack>

              <div
                className="sortModalContainer"
                style={{ 
                  scale: sortVisible ? '1' : '0',
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                  zIndex: 1000,
                  minWidth: '200px',
                  transition: 'scale 0.2s ease-in-out',
                  transformOrigin: 'top right'
                }}
                ref={sortRef}
              >
                <VStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => handleSortChange('price', 'asc')}
                  >
                    <AiOutlineSortAscending />
                    <p>Asc (price low to high)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => handleSortChange('price', 'desc')}
                  >
                    <AiOutlineSortAscending />
                    <p>Desc (price high to low)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => handleSortChange('name', 'asc')}
                  >
                    <AiOutlineSortAscending />
                    <p>Asc (Product Name A to Z)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => handleSortChange('name', 'desc')}
                  >
                    <AiOutlineSortAscending />
                    <p>Desc (Product Name Z to A)</p>
                  </HStack>
                </VStack>
              </div>
            </VStack>
          </HStack>

          {loading ? (
            <ProductGridSkeleton count={currentLimit} />
          ) : data?.length > 0 ? (
            <>
              <div className="productListContainer">
                {data.map((item: Product) => (
                  <ProductCard data={item} key={item.id} />
                ))}
              </div>
              
              {/* Pagination Component */}
              {pagination && (
                <Pagination
                  paginationInfo={pagination}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  currentLimit={currentLimit}
                  isMobile={!media.md}
                />
              )}
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              width: '100%' 
            }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>No products found</p>
              <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
            </div>
          )}
        </VStack>
      </VStack>
    </div>
  )
}

export default ProductListForWeb