// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'
// import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
// import {CompWrapper, HStack, VStack} from 'src/app/common'
// import {
//   CategoryContainer,
//   MainCarousel,
//   ProductSection,
//   ShopByBudgetWeb,
//   WatchAndShopSection
// } from 'src/app/components'
// import {TestimonailSection} from 'src/app/components/testimonial/testimonial.component'
// import {useDispatch, useSelector} from 'src/store'
// import {getTestimonialListAction} from '../../testimonial/testimonial.slice'
// import {getShopByBudgetListAction} from '../../shopByBudget/shopByBudget.slice'
// import {getProductListAction, getHotSellingProductsAction, getWatchAndShopProductsAction} from '../../products/product.slice'
// import ProductDisplay from 'src/app/components/productDisplay/productDisplay.component'
// import { useAuth } from 'src/app/routing'
// import { getCategoryListAction } from '../../category/category.slice'

// export const HomePage = () => {
//   const dispatch = useDispatch()
//   const {loginData} = useAuth()

//   console.log(loginData, "login data value final")

//   const {testimonialData} = useSelector((state: any) => state.testimonial)
//   const {shopByBudgetData} = useSelector((state: any) => state.shopByBudget)
//   const {data, hotSellingProducts, hotSellingProductsLoading}: any = useSelector(
//     (state: any) => state.product
//   )
//   const {categoryData} = useSelector((state: any) => state.category)

//   const [testimonialList, setTestimonialList] = useState([])

//   useEffect(() => {
//     const remappedTestimonialData = testimonialData?.map(
//       (item: any, index: number) => {
//         return {
//           image: item.testimonialImage,
//           description: item.testimonialDescription
//         }
//       }
//     )

//     console.log('callback', remappedTestimonialData)
//     setTestimonialList(remappedTestimonialData)
//   }, [testimonialData])

//   const { watchAndShopData}: any = useSelector(
//     (state: any) => state.product
//   )

//   console.log(watchAndShopData, 'watch and shop dataasssss')

//   useEffect(() => {
//     // Fetch testimonials
//     dispatch(
//       getTestimonialListAction({
//         onSuccess: () => {}
//       })
//     )

//     // Fetch shop by budget
//     dispatch(
//       getShopByBudgetListAction({
//         onSuccess: () => {
//           console.log('got all')
//         }
//       })
//     )

//     // Fetch all products
//     dispatch(
//       getProductListAction({
//         onSuccess: () => {
//           console.log('successfully hitted')
//         },
//         query: {
//           search: ''
//         }
//       })
//     )

//     // Fetch hot selling product (latest one based on hotSellingSetAt timestamp)
//     dispatch(
//       getHotSellingProductsAction({
//         limit: 1,
//         onSuccess: (data) => {
//           console.log('Hot selling product fetched:', data)
//         }
//       })
//     )

//     // Fetch categories
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryList fetch Successfully')
//       })
//     )

//     // Fetch Watch and Shop products
//     dispatch(
//       getWatchAndShopProductsAction({
//         onSuccess: (data) => console.log('Watch and Shop fetched:', data)
//       })
//     )
//   }, [dispatch])



//   console.log(data, "data value last")
//   console.log(hotSellingProducts, "hot selling product from API")

//   return (
//     <div className="home" style={{background: 'white'}}>
//       <MainCarousel></MainCarousel>
//       <CompWrapper>
//         <CategoryContainer data={categoryData}></CategoryContainer>
//       </CompWrapper>

//       <CompWrapper>
//         <VStack gap="$4">
//           {/* SEO Header & Intro Section */}
//           <header className="seo-intro" style={{
//             textAlign: 'center',
//             padding: '24px 16px',
//             backgroundColor: '#fafafa',
//             borderRadius: '12px',
//             border: '1px solid #eaeaea',
//             margin: '12px 0 20px 0'
//           }}>
//             <h1 style={{
//               fontSize: '2rem',
//               color: '#1a1a1a',
//               fontWeight: 700,
//               marginBottom: '12px',
//               textTransform: 'uppercase',
//               letterSpacing: '0.5px'
//             }}>
//               Imitation Jewellery in Nepal
//             </h1>
//             <p style={{
//               fontSize: '1rem',
//               color: '#4a4a4a',
//               lineHeight: 1.6,
//               maxWidth: '800px',
//               margin: '0 auto'
//             }}>
//               Welcome to Abhushan Gallery, the ultimate online destination for premium <strong>imitation jewellery in Nepal</strong>. 
//               Discover our gorgeous handpicked collection of high-quality artificial jewelry, traditional bridal sets, necklaces, rings, 
//               and accessories designed to bring elegance and luxury to every occasion.
//             </p>
//           </header>

//           <ProductSection
//             header="OUR PRODUCTS"
//             isHomePage={true}
//             homeCategory="allProducts"
//           ></ProductSection>

//           <ProductSection
//             header="BEST SELLING"
//             isHomePage={true}
//             homeCategory="isBestSelling"
//           ></ProductSection>
//           <div>
//             <ProductSection
//               header="NEW ARRIVALS"
//               isHomePage={true}
//               homeCategory="isNewArrivals"
//             ></ProductSection>
//           </div>
//           {testimonialList?.length > 0 && (
//             <TestimonailSection reviews={testimonialList}></TestimonailSection>
//           )}

//           {watchAndShopData?.length > 0 && (
//             <VStack gap="$8">
//               <div className="jobsSectionContainer-header">WATCH AND SHOP</div>
//               <WatchAndShopSection
//                 data={watchAndShopData}
//               ></WatchAndShopSection>

//               <VStack gap="$3">
//                 <div className="jobsSectionContainer-header">
//                   SHOP BY BUDGET
//                 </div>

//                 <div
//                   style={{
//                     width: '100%',
//                     marginBottom: '12px',
//                     columnGap: '20px',
//                     rowGap: '20px',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     flexWrap: 'wrap'
//                   }}
//                 >
//                   {shopByBudgetData?.map((item: any, index: number) => {
//                     return <ShopByBudgetWeb key={index} data={item}></ShopByBudgetWeb>
//                   })}
//                 </div>
//               </VStack>
//             </VStack>
//           )}

//           {/* Display Hot Selling Product - Latest one based on hotSellingSetAt timestamp */}
//           {!hotSellingProductsLoading && hotSellingProducts && (
//             <ProductDisplay product={hotSellingProducts[0]}></ProductDisplay>
//           )}
//         </VStack>
//       </CompWrapper>
//     </div>
//   )
// }


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
import {getProductListAction, getHotSellingProductsAction, getWatchAndShopProductsAction} from '../../products/product.slice'
import ProductDisplay from 'src/app/components/productDisplay/productDisplay.component'
import { useAuth } from 'src/app/routing'
import { getCategoryListAction } from '../../category/category.slice'

// ===================== NEW SEO COMPONENT =====================
const SEOFooterSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Theme colors
  const themeColors = {
    primary: '#9a40a9',      // Dark Golden / Bronze
    primaryLight: '#d4a017',  // Lighter Gold
    primaryDark: '#8b6508',   // Darker Bronze
    secondary: '#2c1810',     // Dark Brown
    accent: '#FCE7EE',        // Soft Pink/Blush (NEW THEME COLOR)
    background: '#fffaf5',    // Warm White
    text: '#2d2d2d',         // Dark Gray
    textLight: '#666666',     // Light Gray
    border: '#e8d5c4',        // Soft Brown Border
  }

  return (
    <section
      style={{
        background: themeColors.background,
        borderTop: `1px solid ${themeColors.border}`,
        borderBottom: `1px solid ${themeColors.border}`,
        margin: '64px 0 0 0',
        padding: '64px 20px 48px',
        borderRadius: '0',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
      aria-label="About Abhushan Gallery - Imitation Jewellery in Nepal"
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left Column - Main SEO Content */}
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              display: 'inline-block',
              marginBottom: '16px',
              padding: '4px 12px',
              background: `linear-gradient(135deg, ${themeColors.accent}80, ${themeColors.primary}10)`,
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: themeColors.primaryDark,
              letterSpacing: '0.5px',
              border: `1px solid ${themeColors.primary}30`,
            }}
          >
            ✨ SINCE 2020
          </div>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: themeColors.text,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: themeColors.primary, position: 'relative' }}>
              Imitation Jewellery
              <svg
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '100%',
                  height: '8px',
                  zIndex: -1,
                }}
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4 Q 25 0, 50 4 T 100 4"
                  stroke={themeColors.accent}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            in Nepal
          </h2>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: themeColors.textLight,
              marginBottom: '20px',
              fontWeight: 400,
            }}
          >
            Welcome to <strong style={{ color: themeColors.primary }}>Abhushan Gallery</strong>, the ultimate online destination for premium{' '}
            <strong>imitation jewellery in Nepal</strong>. Discover our gorgeous handpicked collection of high-quality artificial jewelry,{' '}
            traditional bridal sets, necklaces, rings, and accessories designed to bring elegance and luxury to every occasion.
          </p>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: themeColors.textLight,
              marginBottom: '24px',
            }}
          >
            From timeless <strong style={{ color: themeColors.primary }}>bridal jewellery sets</strong> to everyday chic accessories,{' '}
            we blend craftsmanship with modern trends — all at affordable prices, delivered across Nepal.
          </p>

          {/* Trust Badges */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              marginTop: '24px',
            }}
          >
            {[
              { icon: '🏆', text: 'Trusted by 10,000+ Customers' },
              { icon: '⭐', text: '4.9 Star Rating' },
              { icon: '🚚', text: 'Free Shipping Nepal' },
            ].map((badge, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  color: themeColors.text,
                  background: 'white',
                  padding: '8px 16px',
                  borderRadius: '40px',
                  border: `1px solid ${themeColors.border}`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{badge.icon}</span>
                <span style={{ fontWeight: 500 }}>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Features */}
        <div
          style={{
            background: `linear-gradient(135deg, ${themeColors.accent} 0%, ${themeColors.accent}40 100%)`,
            borderRadius: '20px',
            padding: '28px',
            border: `1px solid ${themeColors.border}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              background: themeColors.primary,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '24px' }}>💎</span>
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: themeColors.text,
              marginBottom: '20px',
            }}
          >
            Why Choose Abhushan Gallery?
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {[
              { text: 'Premium quality imitation jewellery', icon: '✓' },
              { text: 'Authentic traditional & modern designs', icon: '✓' },
              { text: 'Safe delivery across Nepal', icon: '✓' },
              { text: 'Affordable luxury for every budget', icon: '✓' },
              { text: '100% customer satisfaction', icon: '✓' },
            ].map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.95rem',
                  color: themeColors.textLight,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    background: themeColors.primary,
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Keywords & Categories */}
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '28px',
            border: `1px solid ${themeColors.border}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: themeColors.text,
                margin: 0,
              }}
            >
              🔍 Shop by Category
            </h3>
            <span
              style={{
                fontSize: '0.7rem',
                color: themeColors.primary,
                fontWeight: 600,
                background: `${themeColors.accent}`,
                padding: '2px 8px',
                borderRadius: '12px',
              }}
            >
              POPULAR
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '24px',
            }}
          >
            {[
              'Bridal Sets',
              'Necklaces',
              'Rings',
              'Earrings',
              'Bangles',
              'Pendants',
              'Artificial Jewelry',
              'Traditional Sets',
              'Mangalsutra',
              'Nose Pin',
            ].map((cat, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.85rem',
                  background: themeColors.background,
                  padding: '6px 16px',
                  borderRadius: '30px',
                  color: themeColors.text,
                  fontWeight: 500,
                  border: `1px solid ${themeColors.border}`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = themeColors.primary
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = themeColors.primary
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = themeColors.background
                  e.currentTarget.style.color = themeColors.text
                  e.currentTarget.style.borderColor = themeColors.border
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Special Offer Banner */}
       

          {/* Social Links */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              {['📘', '📸', '📧', '💬'].map((social, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {social}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: themeColors.textLight, margin: 0 }}>
              #AbhushanGallery #ImitationJewelleryNepal
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ===================== END SEO COMPONENT =====================

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

  const { watchAndShopData}: any = useSelector(
    (state: any) => state.product
  )

  console.log(watchAndShopData, 'watch and shop dataasssss')

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

    // Fetch Watch and Shop products
    dispatch(
      getWatchAndShopProductsAction({
        onSuccess: (data) => console.log('Watch and Shop fetched:', data)
      })
    )
  }, [dispatch])

  console.log(data, "data value last")
  console.log(hotSellingProducts, "hot selling product from API")

  return (
    <div className="home" style={{background: 'white'}}>
      <MainCarousel />
      <CompWrapper>
        <CategoryContainer data={categoryData} />
      </CompWrapper>

      <CompWrapper>
        <VStack gap="$4">
          {/* Product Sections */}
          <ProductSection
            header="OUR PRODUCTS"
            isHomePage={true}
            homeCategory="allProducts"
          />

          <ProductSection
            header="BEST SELLING"
            isHomePage={true}
            homeCategory="isBestSelling"
          />

          <div>
            <ProductSection
              header="NEW ARRIVALS"
              isHomePage={true}
              homeCategory="isNewArrivals"
            />
          </div>

          {/* Testimonials */}
          {testimonialList?.length > 0 && (
            <TestimonailSection reviews={testimonialList} />
          )}

          {/* Watch and Shop + Shop by Budget */}
          {watchAndShopData?.length > 0 && (
            <VStack gap="$8">
              <div className="jobsSectionContainer-header">WATCH AND SHOP</div>
              <WatchAndShopSection data={watchAndShopData} />

              <VStack gap="$3">
                <div className="jobsSectionContainer-header">SHOP BY BUDGET</div>
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
                    return <ShopByBudgetWeb key={index} data={item} />
                  })}
                </div>
              </VStack>
            </VStack>
          )}

          {/* Hot Selling Product */}
          {!hotSellingProductsLoading && hotSellingProducts && (
            <ProductDisplay product={hotSellingProducts[0]} />
          )}

          {/* ========== SEO SECTION - JUST ABOVE FOOTER ========== */}
          <SEOFooterSection />
          {/* =================================================== */}
        </VStack>
      </CompWrapper>
    </div>
  )
}