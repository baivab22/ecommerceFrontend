import {BiTimeFive} from 'react-icons/bi'
import {Chip, HStack, StatInfo, Title, VStack} from 'src/app/common'

export const ProductDetail = ({productDetails}: Comp.ProductDetailProps) => {
  return (
    <VStack className="productDetail-container">
      <VStack className="productDetail">
        <div className="productDetail-detailTop">
          <HStack
            className="productDetail-detailTop-topMost"
            justify="space-between"
          >
            <Title extrasmallheading>Ad-id: {productDetails.id}</Title>
            <HStack gap="$4">
              {/* <StatInfo icon={<AiOutlineEye />} value={`${1234} views`} /> */}

              <StatInfo
                icon={<BiTimeFive />}
                value={productDetails.time ?? ''}
              />
            </HStack>
          </HStack>

          <VStack className="productDetail-detailTop-electronics" gap="$0_5">
            <Title smallheading>{productDetails.catagory}</Title>

            <Title heading>{productDetails.itemName}</Title>
          </VStack>

          <Title primaryHeading>Rs.{productDetails.price}</Title>
        </div>

        <VStack className="productDetail-detailBottom" gap="$8">
          <VStack className="productDetail-detailBottom-description" gap="$4">
            <Title heading>Description</Title>

            <div
              className="productDetail-detailBottom-description-content"
              dangerouslySetInnerHTML={{__html: productDetails.description ?? ''}}
            />
          </VStack>
          {productDetails.website && (
            <HStack justify="flex-start">
              <a
                href={productDetails?.website}
                target="_blank"
                rel="noreferrer"
              >
                <Chip title="Website" color="orange" />
              </a>
            </HStack>
          )}
        </VStack>
      </VStack>
    </VStack>
  )
}
