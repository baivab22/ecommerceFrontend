import React, {useCallback, useEffect, useState} from 'react'
import {Button, VStack} from 'src/app/common'
import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
import {
  createBannerAction,
  deleteBannerImageAction,
  getBannerListAction
} from './banners.slice'
import {useDispatch, useSelector} from 'src/store'
import toast from 'react-hot-toast'

export const Banners = () => {
  const [desktopBannerImage, setDesktopBannerImage] = useState<any>([])
  const [mobileBannerImage, setMobileBannerImage] = useState<any>([])
  const dispatch = useDispatch()

  const {createBannerLoading, bannerData}: any = useSelector(
    (state: any) => state.banner
  )

  useEffect(() => {
    if (bannerData && bannerData.length > 0) {
      const firstBanner = bannerData?.[0] || {}
      const normalize = (value: any) =>
        Array.isArray(value) ? value : value ? [value] : []

      setDesktopBannerImage(
        normalize(firstBanner?.desktopBannerImage || firstBanner?.bannerImage)
      )
      setMobileBannerImage(
        normalize(firstBanner?.mobileBannerImage || firstBanner?.bannerImage)
      )
    } else {
      setDesktopBannerImage([])
      setMobileBannerImage([])
    }
  }, [bannerData])
  const handleDesktopImage = useCallback((event: any) => {
    const selectedFiles = Array.from(event.target.files)
    setDesktopBannerImage((prev: any) => [...prev, ...selectedFiles])
  }, [])

  const handleMobileImage = useCallback((event: any) => {
    const selectedFiles = Array.from(event.target.files)
    setMobileBannerImage((prev: any) => [...prev, ...selectedFiles])
  }, [])


  console.log(desktopBannerImage, 'desktop banner image');


  useEffect(() => {
    dispatch(
      getBannerListAction({
        onSuccess: () => {}
      })
    )
  }, [dispatch])



  

  const addBannerHandler = () => {
    const formData = new FormData()

    desktopBannerImage.forEach((file: File) => {
      formData.append('desktopBannerImage', file)
    })

    mobileBannerImage.forEach((file: File) => {
      formData.append('mobileBannerImage', file)
    })

    dispatch(
      createBannerAction({
        bannerData: formData,
        onSuccess: () => {
          toast.success('Banner added Successfully')
          // Clear local state and refetch banners
          setDesktopBannerImage([])
          setMobileBannerImage([])
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
      <VStack gap="$3">
        <h3>Desktop Banner</h3>
      <ImageUploader
        defaultImages={desktopBannerImage}
        onImageChange={handleDesktopImage}
        uniqueKeys="desktopbannersupload"
        actionHandler={(name: any) => {
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
      </VStack>

      <VStack gap="$3">
        <h3>Mobile Banner</h3>
        <ImageUploader
          defaultImages={mobileBannerImage}
          onImageChange={handleMobileImage}
          uniqueKeys="mobilebannersupload"
          actionHandler={(name: any) => {
            dispatch(
              deleteBannerImageAction({
                bannerName: name,
                onSuccess: () => {
                  toast.success('banner image deleted successfully')
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
      </VStack>

      <Button
        title="Add Banner"
        onClick={addBannerHandler}
        loading={createBannerLoading}
      ></Button>
    </VStack>
  )
}
