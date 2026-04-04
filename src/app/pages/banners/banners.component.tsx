import React, {useCallback, useEffect, useState} from 'react'
import {Button, InputField, VStack} from 'src/app/common'
import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
import {
  createBannerAction,
  deleteBannerImageAction,
  getBannerListAction
} from './banners.slice'
import {useDispatch, useSelector} from 'src/store'
import toast from 'react-hot-toast'

export const Banners = () => {
  const [bannerImage, setBannerImage] = useState<any>([])
  const dispatch = useDispatch()

  const {createBannerLoading, bannerData}: any = useSelector(
    (state: any) => state.banner
  )

  useEffect(() => {
    console.log(bannerData, 'bannerData')
    if (bannerData && bannerData.length > 0) {
      // Only set bannerImage if it's empty or when bannerData changes
      setBannerImage(bannerData?.[0]?.bannerImage || [])
    }
  }, [bannerData])
  const handleImage = useCallback((event: any) => {
    const selectedFiles = Array.from(event.target.files)
    console.log(selectedFiles, 'seelctedFiles+++++++++++++')
    setBannerImage((prev: any) => [...prev, ...selectedFiles])
  }, [])

  console.log(bannerData,"banner data hai")

  // useEffect(() => {}, [bannerData])

  useEffect(() => {
    dispatch(
      getBannerListAction({
        onSuccess: () => {}
      })
    )
  }, [dispatch])



  

  const addBannerHandler = () => {
    const formData = new FormData()
    console.log(bannerImage, 'bannerImage from component')
    bannerImage.forEach((file: any, index: string) => {
      formData.append('bannerImage', file)
    })

    dispatch(
      createBannerAction({
        bannerData: formData,
        onSuccess: () => {
          toast.success('Banner added Successfully')
          // Clear local state and refetch banners
          setBannerImage([])
          dispatch(
            getBannerListAction({
              onSuccess: () => {}
            })
          )
        }
      })
    )
  }
  return (
    <VStack gap="$5">
      <ImageUploader
        defaultImage={bannerData?.[0]?.bannerImage}
        onImageChange={handleImage}
        // value={bannerImage}
        uniqueKeys="bannersupload"
        actionHandler={(name: any) => {

          console.log("action handler data")
          dispatch(
            deleteBannerImageAction({
              bannerName: name,
              onSuccess: (data: any) => {
                toast.success('banner image deleted successfully')
                // Refetch banners after deletion
                dispatch(
                  getBannerListAction({
                    onSuccess: () => {}
                  })
                )
              }
            })
          )
        }}
        isBanner={true}
      ></ImageUploader>

      <Button
        title="Add Banner"
        onClick={addBannerHandler}
        loading={createBannerLoading}
      ></Button>
    </VStack>
  )
}
