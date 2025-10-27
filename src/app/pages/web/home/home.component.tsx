import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {CompWrapper, HStack, VStack} from 'src/app/common'
import {
  CategoryContainer,
  MainCarousel,
  ProductSection,
  ShopByBudgetWeb,
  WatchAndShopSection
} from 'src/app/components'
import {TestimonailSection} from 'src/app/components/testimonial/testimonial.component'
import {useDispatch, useSelector} from 'src/store'
import {getTestimonialListAction} from '../../testimonial/testimonial.slice'
import {getShopByBudgetListAction} from '../../shopByBudget/shopByBudget.slice'
import {getProductListAction, getHotSellingProductsAction} from '../../products/product.slice'
import ProductDisplay from 'src/app/components/productDisplay/productDisplay.component'
import { useAuth } from 'src/app/routing'
import { getCategoryListAction } from '../../category/category.slice'

export const HomePage = () => {
  const dispatch = useDispatch()
  const {loginData} = useAuth()

  console.log(loginData, "login data value final")

  const {testimonialData} = useSelector((state: any) => state.testimonial)
  const {shopByBudgetData} = useSelector((state: any) => state.shopByBudget)
  const {data, hotSellingProducts, hotSellingProductsLoading}: any = useSelector(
    (state: any) => state.product
  )
  const {categoryData} = useSelector((state: any) => state.category)

  const [testimonialList, setTestimonialList] = useState([])

  useEffect(() => {
    const remappedTestimonialData = testimonialData?.map(
      (item: any, index: number) => {
        return {
          image: item.testimonialImage,
          description: item.testimonialDescription
        }
      }
    )

    console.log('callback', remappedTestimonialData)
    setTestimonialList(remappedTestimonialData)
  }, [testimonialData])

  const {data: watchandshopdata}: any = useSelector(
    (state: any) => state.product
  )

  console.log(watchandshopdata, 'watch and shop dataa')

  useEffect(() => {
    // Fetch testimonials
    dispatch(
      getTestimonialListAction({
        onSuccess: () => {}
      })
    )

    // Fetch shop by budget
    dispatch(
      getShopByBudgetListAction({
        onSuccess: () => {
          console.log('got all')
        }
      })
    )

    // Fetch all products
    dispatch(
      getProductListAction({
        onSuccess: () => {
          console.log('successfully hitted')
        },
        query: {
          search: ''
        }
      })
    )

    // Fetch hot selling product (latest one based on hotSellingSetAt timestamp)
    dispatch(
      getHotSellingProductsAction({
        limit: 1,
        onSuccess: (data) => {
          console.log('Hot selling product fetched:', data)
        }
      })
    )

    // Fetch categories
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [dispatch])

  const watchAndShopFilterData = useMemo(() => {
    return watchandshopdata?.filter((item: any, index: number) => {
      return item.isWatchAndShop === true
    })
  }, [watchandshopdata])

  console.log(data, "data value last")
  console.log(hotSellingProducts, "hot selling product from API")

  return (
    <div className="home" style={{background: 'white'}}>
      <MainCarousel></MainCarousel>
      <CompWrapper>
        <CategoryContainer data={categoryData}></CategoryContainer>
      </CompWrapper>

      <CompWrapper>
        <VStack gap="$4">
          <ProductSection
            header="BEST SELLING"
            isHomePage={true}
            homeCategory="isBestSelling"
          ></ProductSection>
          <div>
            <ProductSection
              header="NEW ARRIVALS"
              isHomePage={true}
              homeCategory="isNewArrivals"
            ></ProductSection>
          </div>
          {testimonialList?.length > 0 && (
            <TestimonailSection reviews={testimonialList}></TestimonailSection>
          )}

          {watchAndShopFilterData?.length > 0 && (
            <VStack gap="$8">
              <div className="jobsSectionContainer-header">WATCH AND SHOP</div>
              <WatchAndShopSection
                data={watchAndShopFilterData}
              ></WatchAndShopSection>

              <VStack gap="$3">
                <div className="jobsSectionContainer-header">
                  SHOP BY BUDGET
                </div>

                <div
                  style={{
                    width: '100%',
                    marginBottom: '12px',
                    columnGap: '20px',
                    rowGap: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  {shopByBudgetData?.map((item: any, index: number) => {
                    return <ShopByBudgetWeb key={index} data={item}></ShopByBudgetWeb>
                  })}
                </div>
              </VStack>
            </VStack>
          )}

          {/* Display Hot Selling Product - Latest one based on hotSellingSetAt timestamp */}
          {!hotSellingProductsLoading && hotSellingProducts && (
            <ProductDisplay product={hotSellingProducts[0]}></ProductDisplay>
          )}
        </VStack>
      </CompWrapper>
    </div>
  )
}