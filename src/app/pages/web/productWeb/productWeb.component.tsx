import React, {useEffect, useRef, useState} from 'react'
import {AiOutlineSortAscending} from 'react-icons/ai'
import {
  CheckBox,
  CustomModal,
  HStack,
  InputField,
  Modal,
  Title,
  VStack
} from 'src/app/common'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {useDispatch, useSelector} from 'src/store'
import {getCategoryListAction} from '../../category/category.slice'
import {getProductListAction} from '../../products/product.slice'
import {Loader, ProductCard} from 'src/app/components'
import toast from 'react-hot-toast'
import {useMedia, useQuery} from 'src/hooks'
import {useUpdateQuery} from 'src/hooks/useUpdateQuery.hook'
import {FaSortAmountUp} from 'react-icons/fa'

export const ProductListForWeb = () => {
  const [sortVisible, setSortVisible] = useState(false)
  const sortRef = useRef<HTMLDivElement | null>(null)
  const modalButtonRef = useRef<any>(null)
  const [sortOrder, setSortOrder] = useState({
    parameter: '',
    order: ''
  })
  const [minMaxPrice, setMinMaxPrice] = useState({minPrice: 0, maxPrice: 20000})
  const [selectedCategories, setSelectedCategories] = useState({
    name: '',
    id: null
  })

  const dispatch = useDispatch()

  const query = useQuery()
  const media = useMedia()

  console.log('parent called', query)

  const {data, loading}: any = useSelector((state: any) => state.product)
  const updateQuery = useUpdateQuery()

  // const {sort, order, categoryId, minPrice, maxPrice} = queries

  // console.log(queries, 'queries')

  // useEffect(() => {
  //   console.log('called')
  //   setSelectedCategories({name: 'hehe', id: query.category})
  // }, [query.category])

  // useEffect(() => {
  //   console.log('update Query called')
  //   // dispatch(
  //   //   getProductListAction({
  //   //     onSuccess: () => {},
  //   //     query: {
  //   //       sort: sortOrder.parameter,
  //   //       order: sortOrder.order,
  //   //       categoryId:
  //   //         selectedCategories.id !== 'all' ? selectedCategories.id : '',
  //   //       minPrice: minMaxPrice.minPrice,
  //   //       maxPrice: minMaxPrice.maxPrice
  //   //     }

  //   //     // queries
  //   //   })
  //   // )

  //   // }
  // }, [
  //   sortOrder.order,
  //   sortOrder.parameter,
  //   selectedCategories?.id,
  //   minMaxPrice
  // ])

  useEffect(() => {
    dispatch(
      getProductListAction({
        onSuccess: () => {},
        query: {
          sort: query.sort,
          order: query.order,
          categoryId: selectedCategories.id !== 'all' ? query.categoryId : '',
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          search: query.search,
          subCategoryId: query.subCategoryId,
          isBestSelling: query.isBestSelling,
          isNewArrivals: query.isNewArrivals
        }

        // queries
      })
    )
  }, [
    query.sort,
    query.order,
    query.categoryId,
    query.categoryName,
    query.minPrice,
    query.maxPrice,
    query.search,
    query.subCategoryId,
    query.bestSelling,
    query.isNewArrivals
  ])

  // useEffect(() => {
  //   console.log('api hit ', queries)
  //   // dispatch(
  //   //   getProductListAction({
  //   //     onSuccess: () => {},
  //   //     query:
  //   //       // {
  //   //       //   sort: sortOrder.parameter,
  //   //       //   order: sortOrder.order,
  //   //       //   categoryId:
  //   //       //     selectedCategories.id !== 'all' ? selectedCategories.id : '',
  //   //       //   minPrice: minMaxPrice.minPrice,
  //   //       //   maxPrice: minMaxPrice.maxPrice
  //   //       // }

  //   //       queries
  //   //   })
  //   // )
  // }, [sort, order, categoryId, minPrice, maxPrice])

  const handleOutSideClick = (event) => {
    if (
      sortRef.current &&
      !sortRef.current.contains(event.target) &&
      event.target !== document.getElementById('openModalButton')
    ) {
      setSortVisible(false)
    } else {
      // !!sortVisible && setSortVisible(false)
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
      style={{width: '90%', minHeight: '40vh'}}
      className="productWebPage-container"
    >
      <div
        style={{width: media.md ? '25%' : '100%'}}
        className="productWebPage-container-left"
      >
        <ProductListSideComp
          selectedCategories={selectedCategories}
          onCategoryChange={({id, name}) => {
            // setSelectedCategories((prev) => ({
            //   id: id,
            //   name: name
            // }))

            updateQuery({
              ...query,
              categoryId: id,
              categoryname: name
            })
          }}
          // setMinMaxPrice={setMinMaxPrice}
          // minMaxPrice={minMaxPrice}
        ></ProductListSideComp>
      </div>
      <VStack
        style={{width: media.md ? '75%' : '100%'}}
        justify="space-between"
        align="flex-start"
      >
        <VStack gap="$3" style={{width: '100%'}}>
          <HStack justify="space-between" align="center">
            <Title subheading>Products</Title>

            <VStack className="sortMainContainer">
              <HStack
                id="openModalButton"
                onClick={() => setSortVisible((prev) => !prev)}
                align="center"
                justify="flex-start"
                style={{cursor: 'pointer'}}
                gap="$3"
              >
                Sort
                <FaSortAmountUp />
              </HStack>

              <div
                className="sortModalContainer"
                style={{scale: sortVisible ? '1' : '0'}}
                ref={sortRef}
              >
                <VStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    onClick={() => {
                      updateQuery({
                        sort: 'price',
                        order: 'asc'
                      })
                    }}
                  >
                    <AiOutlineSortAscending></AiOutlineSortAscending>
                    <p>Asc (price low to high)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    onClick={() => {
                      updateQuery({
                        sort: 'price',
                        order: 'desc'
                      })
                    }}
                  >
                    <AiOutlineSortAscending></AiOutlineSortAscending>
                    <p>Desc (price hight to low)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    onClick={() => {
                      updateQuery({
                        sort: 'name',
                        order: 'asc'
                      })
                    }}
                  >
                    <AiOutlineSortAscending></AiOutlineSortAscending>
                    <p>Asc (Product Name A to Z)</p>
                  </HStack>
                  <HStack
                    align="center"
                    gap="$3"
                    className="filterItem"
                    onClick={() => {
                      updateQuery({
                        sort: 'name',
                        order: 'desc'
                      })
                    }}
                  >
                    <AiOutlineSortAscending></AiOutlineSortAscending>
                    <p>Desc (Product Name A to Z)</p>
                  </HStack>
                </VStack>
              </div>
            </VStack>
          </HStack>

          {!!loading ? (
            <Loader
              variant="four"
              loading={loading}
              color="#fcedeb"
              size={30}
            
            />
          ) : data?.length > 0 ? (
            <div style={{}} className="productListContainer">
              {data?.map((item: any, index: number) => {
                return <ProductCard data={item} key={item.id} />
              })}
            </div>
          ) : (
            <div>No Product found</div>
          )}
        </VStack>
      </VStack>
    </div>
  )
}

export const ProductListSideComp = ({
  onCategoryChange,
  selectedCategories,
  minMaxPrice,
  setMinMaxPrice
}: {
  onCategoryChange?: ({id, name}: {id: string; name: string}) => void
  selectedCategories?: {
    id: string
    name: string
  }
  minMaxPrice?: {minPrice: number; maxPrice: number}
  setMinMaxPrice?: React.Dispatch<
    React.SetStateAction<{
      minPrice: number
      maxPrice: number
    }>
  >
}) => {
  console.log('product list side comp called')
  const query = useQuery()

  const {categoryData}: any = useSelector((state: any) => state.category)
  const dispatch = useDispatch()
  const updateQuery = useUpdateQuery()
  const media = useMedia()
  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  return (
    <VStack
      align="flex-start"
      justify="space-between"
      style={{width: '100%'}}
      gap="$4"
    >
      <Title primaryHeading>Categories</Title>
      {/* <ProductPriceSlider /> */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: media.md ? 'column' : 'row',
          flexWrap: media.md ? 'nowrap' : 'wrap',
          gap: '12px'
        }}
      >
        {categoryData?.map((item, index) => {
          return (
            <CheckBox
              name={item.name}
              label={item.name}
              handleCheckboxChange={() =>
                onCategoryChange({id: item.id, name: item.name})
              }
              check={item.name === query.categoryname}
            />
          )
        })}

        <CheckBox
          name="all"
          label="All"
          handleCheckboxChange={() => onCategoryChange({id: '', name: 'All'})}
          check={'All' === query.categoryname}
        />
      </div>
      <HStack
        style={{width: '90%'}}
        gap="$3"
        align="center"
        justify="center
      "
      >
        <VStack gap="$2">
          <Title subheading>FROM</Title>
          <InputField
            // style={{width: '40%'}}
            type="number"
            onChange={(e: any) => {
              // setMinMaxPrice((prev: any) => ({
              //   ...prev,
              //   minPrice: e.target.value
              // }))
              updateQuery({
                // ...query,
                minPrice: e.target.value
              })
            }}
            placeholder="Enter minimum price"
          ></InputField>
        </VStack>
        <HStack justify="center" align="center">
          -
        </HStack>
        <VStack gap="$2">
          <Title subheading>TO</Title>
          <InputField
            // style={{width: '40%'}}
            type="number"
            onChange={(e: any) => {
              console.log(e.target.value, 'value changes hai')
              // setMinMaxPrice((prev: any) => ({
              //   ...prev,
              //   maxPrice: e.target.value
              // }))

              updateQuery({
                ...query,
                maxPrice: e.target.value
              })
            }}
            placeholder="Enter max price"
          ></InputField>
        </VStack>
      </HStack>
    </VStack>
  )
}

export const ProductPriceSlider = () => {
  const [priceRnage, setPriceRange] = useState({
    minPrice: 50,
    maxPrice: 1000
  })

  return (
    <div style={{position: 'relative'}} className="productWeb-container"></div>
  )
}
