import moment from 'moment'
import {useMedia} from 'src/hooks'
import {getImageUrl} from 'src/helpers/getImageUrl.helper'
import {Link, useNavigate} from 'react-router-dom'
import {ProductCard} from '../productCard'
import {useSelector, useDispatch} from 'src/store'
import {useEffect} from 'react'
import {getProductListAction} from 'src/app/pages/products/product.slice'

// Skeleton Component for Product Card
const ProductCardSkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px'
  }

  const imageSkeletonStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    backgroundColor: '#e5e7eb',
    borderRadius: '8px',
    ...skeletonStyle
  }

  const textSkeletonStyle: React.CSSProperties = {
    height: '20px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    ...skeletonStyle
  }

  const priceSkeletonStyle: React.CSSProperties = {
    height: '24px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    width: '96px',
    ...skeletonStyle
  }

  const buttonSkeletonStyle: React.CSSProperties = {
    height: '40px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    width: '100%',
    marginTop: '8px',
    ...skeletonStyle
  }

  return (
    <div style={cardStyle}>
      {/* Product Image Skeleton */}
      <div style={imageSkeletonStyle}></div>
      
      {/* Product Name Skeleton */}
      <div style={{...textSkeletonStyle, width: '75%'}}></div>
      
      {/* Product Description Skeleton */}
      <div style={{...textSkeletonStyle, height: '16px', width: '100%'}}></div>
      <div style={{...textSkeletonStyle, height: '16px', width: '85%'}}></div>
      
      {/* Price Skeleton */}
      <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px'}}>
        <div style={priceSkeletonStyle}></div>
        <div style={{...priceSkeletonStyle, width: '80px', height: '20px'}}></div>
      </div>
      
      {/* Button Skeleton */}
      <div style={buttonSkeletonStyle}></div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  )
}

// Section Header Skeleton
const ProductSectionHeaderSkeleton = () => {
  const headerSkeletonStyle: React.CSSProperties = {
    height: '32px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    width: '192px',
    marginBottom: '24px',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }

  return <div style={headerSkeletonStyle}></div>
}

export const ProductSection = ({
  jobItems,
  header,
  itemOnGrid,
  isHomePage,
  homeCategory,
  isForSimilar
}: any) => {
  const media = useMedia()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Build query based on homeCategory prop
    const query: any = {}
    
    if (homeCategory === 'isBestSelling') {
      query.isBestSelling = true
    } else if (homeCategory === 'isNewArrivals') {
      query.isNewArrivals = true
    }

    console.log('api hit with query:', query)
    
    dispatch(getProductListAction({
      onSuccess: () => console.log('Products fetched successfully'),
      // query
    
    }))
  }, [homeCategory, dispatch])

  const {data, loading}: any = useSelector((state: any) => state.product)



  console.log(data, 'data from ps', loading, "loading value")

  // Show skeleton while loading
  if (!isForSimilar && (loading || !data)) {
    return (
      <div className="jobsSectionContainer">
        <ProductSectionHeaderSkeleton />
        <div className="jobsSectionContainer-items">
          {Array.from({length: 4}).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  // Don't render if no data
  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className="jobsSectionContainer">
      <div className="jobsSectionContainer-header">
        {data?.length > 0 && header}

        <div className="jobsSectionContainer-header-right">
          {/* <div className="jobsSectionContainer-header-right-common">
              <IoIosArrowBack />
            </div>
            <div className="jobsSectionContainer-header-right-common">
              <IoIosArrowForward />
            </div> */}
        </div>
      </div>

      {/* <div className="jobsSectionContainer-items">
        {data?.filter((item: any, index: number) => {
      return  homeCategory === 'isBestSelling'? item.isBestSelling === true: item?.isNewArrivals===true
    })?.slice(0, 4).map((item: any, index: number) => {
          return <ProductCard data={item} key={item.id} />
        })}
      </div> */}

      <div className="jobsSectionContainer-items">
  {data
    ?.filter((item: any) => {
      if (homeCategory === 'isBestSelling') return item.isBestSelling === true;
      if (homeCategory === 'isNewArrivals') return item.isNewArrivals === true;
      return true; // show all if no category matches
    })
    ?.slice(0, 4)
    .map((item: any) => (
      <ProductCard data={item} key={item.id} />
    ))}
</div>


      {isHomePage && (
        <div
          className="jobsSectionContainer-seemore"
          onClick={() => {
            navigate(
              `/products?${
                homeCategory === 'isBestSelling'
                  ? 'isBestSelling=true'
                  : 'isNewArrivals=true'
              }`
            )
          }}
        >
          See more
        </div>
      )}
    </div>
  )
}