import styled from 'styled-components'

import {Card, HStack, VStack} from 'src/app/common'
import Theme from 'src/theme'
import moment from 'moment'
import {getImageUrl} from 'src/helpers/getImageUrl.helper'
import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'

const PreTitle = styled.div`
  font-size: ${Theme.fontSizes.$3};
  font-style: italic;
  margin-bottom: 10px;
  color: ${Theme.colors.$gray400};
`

const ArticleTitle = styled.div`
  font-size: ${Theme.fontSizes.$5};
  font-weight: ${Theme.fontWeights.$bold};
`

const ShortDescription = styled.div`
  font-size: ${Theme.fontSizes.$3};
  font-style: italic;
  margin-bottom: ${Theme.space.$9};
  color: ${Theme.colors.$gray400};
`

const DescriptionContainer = styled.div`
  padding: ${Theme.space.$10} 0;

  font-family: Arial;
  margin: 40px 0;
  & > ul {
    list-style: disc;

    & > li {
      margin-left: 40px;
    }
  }

  & > ol {
    & > li {
      margin-left: 40px;
    }
  }

  & > h1 {
    margin: 24px 0 12px;
  }

  & > h2 {
    margin: 20px 0 10px;
  }

  & > h3 {
    margin: 10px 0 6px;
  }
`
const ImgContainer = styled.div`
  position: relative;
  min-height: 400px;
  width: 100%;
  border-radius: ${Theme.radius.$default};
  overflow: hidden;
`

interface ArticleDetailProps {
  detail?: {
    description_details?: {
      id: number
      slug: string
      title: string
      posted_at: string
      thumbnail: string
      main_description: string
      short_description: string
      video_link: string
      posted_by: string
    }
    category_details: {
      id: number
      type: string
      title: string
      common_category_id: number
      is_description_only: boolean
    }
  }
}
export const ArticleDetail = ({detail}: ArticleDetailProps) => {
  return (
    <Card
      title={
        <HStack justify="space-between" align="center">
          <div>View Article</div>
          {/* <Button title="Edit" color="info" onClick={onEditCaseResult} /> */}
        </HStack>
      }
      // containerStyle={{
      //   minHeight: '80vh'
      // }}
    >
      <VStack style={{padding: Theme.space.$9}}>
        <PreTitle>
          {detail?.description_details?.posted_by && (
            <>{detail?.description_details?.posted_by}, </>
          )}
          {moment(detail?.description_details?.posted_at).format(
            `DD MMM, YYYY`
          )}
        </PreTitle>
        <ArticleTitle>
          {detail?.description_details?.title ?? 'No title'}
        </ArticleTitle>
        {detail?.description_details?.short_description && (
          <ShortDescription>
            {detail?.description_details?.short_description}
          </ShortDescription>
        )}

        {detail?.description_details?.thumbnail && (
          <ImgContainer>
            <OptimizedImage
              alt="article image"
              src={getImageUrl(
                `commonDescription`,
                detail?.description_details?.thumbnail as string
              )}
              width={960}
              height={540}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </ImgContainer>
        )}

        <DescriptionContainer
          dangerouslySetInnerHTML={{
            __html: detail?.description_details?.main_description as string
          }}
        >
          {/* <Interweave content={detail?.description_details?.main_description} /> */}
        </DescriptionContainer>
      </VStack>
    </Card>
  )
}
