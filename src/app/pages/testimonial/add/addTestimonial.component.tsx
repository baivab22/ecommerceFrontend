import React, {useCallback, useEffect, useState} from 'react'
import {Button, InputField, Label, VStack} from 'src/app/common'
import {useParams} from 'src/hooks'
import {useDispatch, useSelector} from 'src/store'
import {
  updateTestimonialAction,
  createTestimonialAction,
  getTestimonialDetailByIdAction
} from '../testimonial.slice'
import toast from 'react-hot-toast'
// import {useRouter} from 'next/router'
import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
import { useNavigate } from 'react-router-dom'
export const AddTestimonialPage = () => {
    const navigate = useNavigate()
  // const router = useRouter()
  const {
    updateTestimonialLoading,
    createTestimonialLoading,
    testimonialDetailLoading,

    // testimoniailDetailData
    testimonialDetailData
  } = useSelector((state: any) => state.testimonial)

  const testimonialId = useParams('testimonialId')
  const [data, setData] = useState<any>({
    description: '',
    image: []
  })
  const dispatch = useDispatch()

  useEffect(() => {
    console.log(testimonialId, 'tid')
    // Only fetch detail if we're in edit mode
    if (testimonialId) {
      dispatch(getTestimonialDetailByIdAction({testimonialId: testimonialId}))
    } else {
      // Clear form data when in add mode
      setData({
        description: '',
        image: []
      })
    }
  }, [testimonialId, dispatch])

  useEffect(() => {
    // console.log(testimonialDetailData, 'dd')
    // Only set data if we're in edit mode and have detail data
    if (testimonialId && testimonialDetailData) {
      setData((prev: any) => ({
        image: testimonialDetailData?.testimonialImage,
        description: testimonialDetailData?.testimonialDescription
      }))
    } else if (!testimonialId) {
      // Clear form when in add mode
      setData({
        description: '',
        image: []
      })
    }

    console.log(testimonialDetailData, 'testimonial detail data')
  }, [testimonialDetailData, testimonialId])

  const addTestimonialHandler = () => {
    const formData = new FormData()

    data?.image?.forEach((file: any, index: string) => {
      formData.append('testimonialImage', file)
    })

    formData.append('testimonialDescription', data.description)
for (const pair of formData.entries()) {
  console.log(`${pair[0]}:`, pair[1],"idea","testimonial id datasssssss");
}
    // console.log(testimonialId,  !testimonialId,data,formData,"testimonial id datasssssss")



    !testimonialId
      ? dispatch(
          createTestimonialAction({
            testimonialBody: formData,
            onSuccess: (data: any) => {
              navigate('/dash-testimonial')
              toast.success('Testimonial Created')
            }
          })
        )
      : dispatch(
          updateTestimonialAction({
            testimonialBody: formData,
            testimonialId: testimonialId as string,
            onSuccess: (data: any) => {
              toast.success('testimonial Updated Successfully')
              navigate('/dash-testimonial')
            }
          })
        )
  }

  return (
    <VStack gap="$3">
      <VStack gap="$2">
        <div>
          <Label required labelName="Testimonial Name"></Label>

          <InputField
            type="text"
            placeholder="Enter Testimonial Description"
            onChange={(e: any) =>
              setData((prev: any) => ({
                ...prev,
                description: e.target.value
              }))
            }
            value={data.description}
          ></InputField>
        </div>

        <VStack>
          <Label required labelName="Testimonial Name"></Label>

          <ImageUploader
            defaultImages={data.image}
            onImageChange={(files: File[]) => {
              console.log(files, 'seelctedFiles+++++++++++++')

              setData((prev: any) => ({...prev, image: files}))
            }}
            // value={bannerImage}
            uniqueKeys="testimonialImages"
            actionHandler={(name: any) => {
              // dispatch(
              //   deleteBannerImageAction({
              //     bannerName: name,
              //     onSuccess: (data: any) =>
              //       toast.success('banner image deleted successfully')
              //   })
              // )
            }}
            isBanner={false}
            isTestimonial={true}
          ></ImageUploader>
        </VStack>
      </VStack>

      <Button
        title={testimonialId ? 'Update Testimonial' : 'Add Testimonial'}
        onClick={addTestimonialHandler}
        loading={
          testimonialId ? updateTestimonialLoading : createTestimonialLoading
        }
      ></Button>
    </VStack>
  )
}
