import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSortAscending } from 'react-icons/ai'
import {
  CheckBox,
  CustomModal,
  HStack,
  InputField,
  Modal,
  Title,
  VStack
} from 'src/app/common'
import { getNprPrice } from 'src/helpers/nprPrice.helper'
import { useDispatch, useSelector } from 'src/store'
import { getCategoryListAction } from '../../category/category.slice'
import { getProductListAction } from '../../products/product.slice'
import { Loader, ProductCard } from 'src/app/components'
import toast from 'react-hot-toast'
import { useMedia, useQuery } from 'src/hooks'
import { useUpdateQuery } from 'src/hooks/useUpdateQuery.hook'
import { FaSortAmountUp } from 'react-icons/fa'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'

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
  categoryName?: string
  subCategoryName?: string
  nestedSubCategoryName?: string
  minPrice?: string
  maxPrice?: string
  search?: string
  isBestSelling?: string
  isNewArrivals?: string
}

interface SelectedFilters {
  categoryId: string
  categoryName: string
  subCategoryId: string
  subCategoryName: string
  nestedSubCategoryId: string
  nestedSubCategoryName: string
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
      {/* Image Skeleton */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundColor: '#e5e7eb',
          borderRadius: '6px',
          marginBottom: '12px'
        }}
      />
      
      {/* Title Skeleton */}
      <div
        style={{
          height: '16px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '8px',
          width: '80%'
        }}
      />
      
      {/* Subtitle Skeleton */}
      <div
        style={{
          height: '14px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          marginBottom: '12px',
          width: '60%'
        }}
      />
      
      {/* Price Skeleton */}
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
      
      {/* Button Skeleton */}
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

const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="productListContainer">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
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
      
      {/* Render subcategories */}
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
  console.log('product list side comp called')
  const query = useQuery() as QueryParams
  const { categoryData }: { categoryData: Category[] } = useSelector((state: any) => state.category)
  const dispatch = useDispatch()
  const updateQuery = useUpdateQuery()
  const media = useMedia()

  // Track all selected filters
  const selectedFilters: SelectedFilters = {
    categoryId: query.categoryId || '',
    categoryName: query.categoryName || '',
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
      ...newFilters
    })
  }

  const clearAllFilters = () => {
    updateQuery({
      ...query,
      categoryId: '',
      categoryName: '',
      subCategoryId: '',
      subCategoryName: '',
      nestedSubCategoryId: '',
      nestedSubCategoryName: ''
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
                  background: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            )}
          </HStack>

      {/* Display current selection path */}
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

      {/* Categories with hierarchy */}
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
        {/* All option */}
        <div
          onClick={clearAllFilters}
          style={{
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '4px',
            background: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? '#e3f2fd' : 'transparent',
            fontWeight: (!selectedFilters.categoryId && !selectedFilters.subCategoryId && !selectedFilters.nestedSubCategoryId) ? 'bold' : 'normal',
            marginBottom: '4px'
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

      {/* Price Range Filter */}
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
                  minPrice: e.target.value
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
                  maxPrice: e.target.value
                })
              }}
              placeholder="Max"
              style={{ fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px' : '8px' }}
            />
          </VStack>
        </HStack>
      </VStack>

      {/* Best Selling and New Arrivals Filters */}
      <VStack align="flex-start" style={{ width: '100%' }} gap="$2">
        <Title primaryHeading>Filters</Title>
        
        <HStack gap={isMobile ? '$3' : '$2'} style={{ width: '100%', flexWrap: 'wrap' }}>
          <CheckBox
            name="isBestSelling"
            label="Best Selling"
            handleCheckboxChange={(checked: boolean) => {
              updateQuery({
                isBestSelling: checked ? 'true' : ''
              })
            }}
            check={query.isBestSelling === 'true'}
          />
          
          <CheckBox
            name="isNewArrivals"
            label="New Arrivals"
            handleCheckboxChange={(checked: boolean) => {
              updateQuery({
                isNewArrivals: checked ? 'true' : ''
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
  
  const dispatch = useDispatch()
  const query = useQuery() as QueryParams
  const media = useMedia()

  console.log('parent called', query)

  const { data, loading }: { data: Product[], loading: boolean } = useSelector((state: any) => state.product)
  const updateQuery = useUpdateQuery()

  useEffect(() => {
    dispatch(
      getProductListAction({
        onSuccess: () => {},
        query: {
          sort: query.sort,
          order: query.order,
          categoryId: query.categoryId,
          //@ts-ignore 
          minPrice: query.minPrice as number,
          //@ts-ignore

          maxPrice: query.maxPrice as number,
          search: query.search,
          subCategoryId: query.subCategoryId,
          //@ts-ignore
          
          nestedSubCategoryId: query.nestedSubCategoryId,
                   //@ts-ignore
          isBestSelling: query.isBestSelling,
                   //@ts-ignore
          isNewArrivals: query.isNewArrivals 
        }
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
    query.isNewArrivals
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
        <VStack gap="$3" style={{ width: '100%' }}>
          <HStack justify="space-between" align="center">
            <Title subheading>Products</Title>

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
                    onClick={() => {
                      updateQuery({
                        sort: 'price',
                        order: 'asc'
                      })
                      setSortVisible(false)
                    }}
                  >
                    <AiOutlineSortAscending />
                    <p>Asc (price low to high)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => {
                      updateQuery({
                        sort: 'price',
                        order: 'desc'
                      })
                      setSortVisible(false)
                    }}
                  >
                    <AiOutlineSortAscending />
                    <p>Desc (price high to low)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => {
                      updateQuery({
                        sort: 'name',
                        order: 'asc'
                      })
                      setSortVisible(false)
                    }}
                  >
                    <AiOutlineSortAscending />
                    <p>Asc (Product Name A to Z)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    style={{ cursor: 'pointer', padding: '8px' }}
                    onClick={() => {
                      updateQuery({
                        sort: 'name',
                        order: 'desc'
                      })
                      setSortVisible(false)
                    }}
                  >
                    <AiOutlineSortAscending />
                    <p>Desc (Product Name Z to A)</p>
                  </HStack>
                </VStack>
              </div>
            </VStack>
          </HStack>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : data?.length > 0 ? (
            <div className="productListContainer">
              {data.map((item: Product) => (
                <ProductCard data={item} key={item.id} />
              ))}
            </div>
          ) : (
            <div>No Product found</div>
          )}
        </VStack>
      </VStack>
    </div>
  )
}

export const ProductPriceSlider: React.FC = () => {
  const [priceRange, setPriceRange] = useState({
    minPrice: 50,
    maxPrice: 1000
  })

  return (
    <div style={{ position: 'relative' }} className="productWeb-container"></div>
  )
}

export default ProductListForWeb