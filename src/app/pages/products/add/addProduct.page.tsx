import React, {useCallback, useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'src/store'

import {useParams} from 'src/hooks'
import {
  Button,
  CheckBox,
  HStack,
  InputField,
  Label,
  SelectField,
  TextEditor,
  VStack
} from 'src/app/common'
import {
  getCategoryListAction,
  getSubCategoryAction
} from '../../category/category.slice'
import {
  createProductAction,
  createProductImageAction,
  delteProductImageAction,
  getAllProductVariantImagesAction,
  getProductDetailByIdAction,
  getProductListAction,
  updateProductAction
} from '../product.slice'
import {useFormInput} from 'use-form-input'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
import {useStepContext} from '@mui/material'
import CustomVideoPlayer from 'src/app/common/customVideoPlayer/customVideoPlayer.component'
import ReactPlayer from 'react-player'
import {AiFillPlayCircle, AiOutlineClose} from 'react-icons/ai'
import {color} from 'html2canvas/dist/types/css/types/color'

import {v4 as uuidv4} from 'uuid'
import {FILE_URL} from 'src/config'

export const AddProductPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productId = useParams('productId')
  // console.log(productId, 'productId present')

  useEffect(() => {
    productId &&
      dispatch(getProductDetailByIdAction({productId: productId as string}))
  }, [])

  const {productDetailData, productDetailLoading}: any = useSelector(
    (state: any) => state.product
  )

  // console.log(productDetailData, 'productDetailData')

  // console.log(!!productDetailData, 'product detail data boolean')

  // console.log('product id is available', productId)

  const [image, setImage] = useState<any>([])

  const [colorCount, setColorCount] = useState(2)
  const [colorImage, setColorImage] = useState([
    {
      id: uuidv4(),
      color: '',
      image: {}
    }
  ])

  const [allColorVariant, setAllColorVariant] = useState([])

  useEffect(() => {
    console.log(colorImage, 'colorImage value')
  }, [colorImage])

  useEffect(() => {
    console.log(colorCount, 'colorCount')
    console.log(colorImage, 'color image')
  }, [colorCount, colorImage])
  const [data, setData] = useState<any>({
    name: '',
    originalPrice: '',
    discountedPrice: '',
    discountPercentage: '',
    category: '',
    subCategory: '',
    images: [],
    video: null,
    description: '',
    stockQuantity: ''
  })

  const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
    isNewArrival: false,
    isBestSelling: false,
    isWatchAndShop: false
  })

  const [isHotSelling, setIsHotSelling] = useState(false)


  useEffect(() => {
    // console.log('product DetailData called')

    if (productId) {
      setSelectedCategory({
        id: productDetailData?.category?.id,
        label: productDetailData?.category.name,
        value: productDetailData?.category?.value
      })
      setSelectedSubCategory({
        id: productDetailData?.subCategory?.id,
        label: productDetailData?.subCategory.neame,
        value: productDetailData?.subCategory?.value
      })

      setProductVariantIdList(
        productDetailData?.images?.map((item: any, index: number) => {
          return item._id
        })
      )

      setColorImage(() => {
        return productDetailData?.images?.map((item: any, index: number) => {
          return {
            id: item._id,
            color: item.colorName,
            image: item.coloredImage
          }
        })
      })

      setData((prev: any) => ({
        ...prev,
        name: productDetailData?.name,
        originalPrice: productDetailData?.originalPrice,
        discountedPrice: !!productDetailData
          ? productDetailData.discountedPrice
          : '',
        discountPercentage: !!productDetailData
          ? productDetailData.discountPercentage
          : '',
        stockQuantity: !!productDetailData
          ? productDetailData.stockQuantity
          : 0,

        images: !!productDetailData ? productDetailData.images?.[0] : '',

        // video: !!productDetailData ? productDetailData.video : null,

        // video: !!productDetailData
        //   ? productDetailData.video
        //     ? `${import.meta.env.REACT_APP_DEV_ASSET_URL}/video/${
        //         productDetailData?.video
        //       }`
        //     : null
        //   : null,

        description: !!productDetailData ? productDetailData?.description : ''
      }))

      const videoUrl = productDetailData?.video
        ? `${FILE_URL}/video/${productDetailData.video}`
        : null

      if (videoUrl) {
        fetch(videoUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.blob()
          })
          .then((blob) => {
            setData((prev) => ({
              ...prev,
              video: blob
            }))
          })
      }

      console.log(productVariantIdList, 'pr list')

      setColorCount(productDetailData?.images?.length)
      setAllColorVariant(productDetailData?.images)

      // productId && !!productDetailData
      // ? productDetailData?.images[index]?.coloredImage
      // : ''

      // setIsNewArrivalOrBestSelling((prev:any)=>({...prev,isBestSelling:!!productDetailData?productDetailData?.isBestSelling))
      setIsNewArrivalOrBestSelling((prev: any) => ({
        ...prev,

        isBestSelling: !!productDetailData
          ? productDetailData?.isBestSelling
          : '',
        isNewArrival: !!productDetailData
          ? productDetailData?.isNewArrivals
          : ''
      }))
    }

    console.log(productDetailData, 'product detail data')
  }, [productDetailData])

  const [selectedCategory, setSelectedCategory] = useState<any>()
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
  const [category, setCategory] = useState<any>()
  const [subCategory, setSubCategory] = useState<any>()

  const {
    categoryData,
    getCategoryLoading,
    subCategoryData,
    getSubCategoryLoading
  }: any = useSelector((state: any) => state.category)

  const {createProductLoading, updateProductLoading, productVariantList}: any =
    useSelector((state: any) => state.product)
  const [productVariantIdList, setProductVariantIdList] = useState([''])
  useEffect(() => {
    console.log('product variant list')
    setProductVariantIdList(
      productVariantList?.map((item: any, index: number) => {
        return item._id
      })
    )
    // console.log(productVariantList, 'productVariant list')
  }, [productVariantList])

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [])

  useEffect(() => {
    const mappedCategory = categoryData?.map((item: any, index: number) => {
      // console.log(item, 'caetgory item')
      return {
        id: item.id,
        label: item.name,
        value: item.name,
        subCategory: item.subCategories
      }
    })
    // console.log(mappedCategory, 'mapped category')
    setCategory(mappedCategory)
  }, [categoryData])

  useEffect(() => {
    // console.log('selcted category changed')
    // console.log('subcategory resetting')

    const mappedSubCategory = selectedCategory?.subCategory?.map(
      (item: any, index: number) => {
        return {
          id: item.id,
          label: item.name,
          value: item.name
        }
      }
    )

    setSubCategory(mappedSubCategory)
  }, [selectedCategory])

  const handleImage = (event: any) => {
    const selectedFiles = Array.from(event.target.files)
    console.log(selectedFiles, 'seelctedFiles+++++++++++++')
    const myImages = [...image]
    console.log(myImages, 'myimages before')
    console.clear()
    console.log([...image, ...selectedFiles], '++++++++++')

    setImage((prev: any) => [...prev, ...selectedFiles])
    // myImages.push(event.target.files)
    // console.log(myImages, 'myiamgesssssssssssss after')

    // const filesArray = Array.from(myImages).map((fileList) =>
    //   Array.from(fileList)
    // )

    // setImage(selectedFiles)
  }

  const playerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [controls, setControls] = useState(true)
  const [showThumbnail, setShowThumbnail] = useState(true)

  const handlePlayClick = () => {
    setPlaying(true)

    // playerRef.current.wrapper.requestFullscreen()
    // console.log(videoPlayer, 'video player')

    // if (videoPlayer) {
    //   if (videoPlayer[0].requestFullscreen) {
    //     console.log(videoPlayer, 'video player hitted')
    //     videoPlayer[0].requestFullscreen()
    //   }
    // }
  }

  useEffect(() => {
    console.log(productDetailData, 'pr')
  }, [productDetailData])

  console.log(colorImage, 'colored images')

  const handleAction = (imageId: string) => {
    console.log('product id called dfsdfsdfdf', productId)
    dispatch(
      delteProductImageAction({
        productId: productId as string,
        imageId: imageId as string,
        onSuccess: () => {
          toast.success('product delete')
        }
      })
    )
  }

  const handleVideo = (event: any) => {
    const selectedFile = event.target.files[0]
    const videoUrl = URL.createObjectURL(selectedFile)

    console.log(videoUrl, 'video url')
    setData((prev: any) => ({...prev, video: videoUrl}))
  }

  const handlenewArrival = (item: any) => {
    setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
  }

  console.log(allColorVariant, colorCount, 'cc')

  const handleBestSelling = (item: any) => {
    setIsNewArrivalOrBestSelling((prev: any) => ({
      ...prev,
      isBestSelling: item
    }))
  }

  const handleWatchAndShopping = (item: any) => {
    setIsNewArrivalOrBestSelling((prev: any) => ({
      ...prev,
      isWatchAndShop: item
    }))
  }

  const addProductHandler = (event: any) => {
    event.preventDefault()
    console.log('addProduct called to updated', data)
    console.log(isHotSelling, 'is new arrival or best selling')
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('category', selectedCategory?.id)
    formData.append('subCategory', selectedSubCategory?.id)
    formData.append('originalPrice', data.originalPrice)
    formData.append('discountedPrice', data.discountedPrice)
    formData.append('discountPercentage', data.discountPercentage)
    formData.append('description', data.description)
    console.log(data.video, 'data video')
    formData.append('video', data.video)
    formData.append('stockQuantity', data.stockQuantity)
    formData.append('isHotSelling', JSON.stringify(isHotSelling))




    // productVariantIdList.forEach((productId: any, index: string) => {
    //   formData.append('productVariants', productId)
    // })

    console.log(productVariantIdList, 'product variant list')
    console.log(productVariantIdList, 'product variant id list')
    const minusCount = -colorCount
    // console.log(minusCount, 'minusCount')
    const productImageIds = productVariantIdList?.slice(minusCount)
    console.log(productImageIds, 'meroname')
    productImageIds?.forEach((value, index) => {
      formData.append('productVariants', value)
    })

    formData.append(
      'isBestSelling',
      JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
    )

    formData.append(
      'isNewArrivals',
      JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
    )

    formData.append(
      'isWatchAndShop',
      JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
    )


    




    console.log(isHotSelling,'ishotselling value before  append')

    // formData.append(
    //   'isHotSelling',
    //   JSON.stringify(isHotSelling)
    // )
// formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

    
    // console.log(data?.images, 'data images')

    // image.forEach((file: any, index: string) => {
    //   formData.append('image', file)
    // })

    console.log(isHotSelling, ' is hot selling video')

    {
      productId
        ? dispatch(
            updateProductAction({
              productBody: formData,
              productId: productId as any,
              onSuccess: () => {
                dispatch(
                  getProductListAction({
                    onSuccess: (data) => console.log('get hit after update')
                  })
                )
                navigate('/products')
                toast.success('Product Updated SuccessFully')
                setData({
                  name: '',
                  originalPrice: '',
                  discountedPrice: '',
                  discountPercentage: '',
                  category: '',
                  subCategory: '',
                  images: [],
                  video: null,
                  description: '',
                  // isHotSelling:false
                })
              }
            })
          )
        : dispatch(
            createProductAction({
              productBody: formData,
              onSuccess: () => {
                dispatch(
                  getProductListAction({
                    onSuccess: (data) => setData({})
                  })
                )
                navigate('/products')

                toast.success('Product Created SuccessFully')
                setData({
                  name: '',
                  originalPrice: '',
                  discountedPrice: '',
                  discountPercentage: '',
                  category: '',
                  subCategory: '',
                  images: [],
                  video: null,
                  description: '',
                  // isHotSelling:false
                })
              }
            })
          )
    }
  }

  // console.log(
  //   selectedSubCategory,
  //   selectedCategory,
  //   'selected sub category value'
  // )

  const handleColorVariant = () => {
    // setAllColorVariant((prev) => [...prev, colorImage])
    // console.log(colorImage, 'colorIMage')
    const formData = new FormData()
    // console.clear()
    // console.log(colorImage.image, 'image list')

    // colorImage.image.forEach((item: any, index: number) => {
    //   formData.append('coloredImage', item)
    // })

    console.log(colorImage, 'colorImage hai')

    colorImage.forEach((item, index) => {
      console.log(item.image[0], 'image list hai')
      formData.append(`coloredImage`, item.image[0])
      formData.append(`colorName`, item.color)
    })
    // createProductImageAction

    dispatch(
      createProductImageAction({
        variantBody: formData,
        onSuccess: () => {
          toast.success('Product color variant added Successfully')

          dispatch(
            getAllProductVariantImagesAction({
              onSuccess: () => {
                console.log(data, 'data')
              }
            })
          )

          // setColorImage((prev: any) => [])
        }
      })
    )

    // setColorImage((prev: any) => ({
    //   image: [],
    //   color: ''
    // }))
  }

  useEffect(() => {
    console.log(allColorVariant, 'allColorVariant')
  }, [allColorVariant])

  console.log(colorImage, 'colorImages default')

  const [currentlySelectedColor, setCurrentlySelectedColor] =
    useState<string>('')

  useEffect(() => {
    const discountedPrice = data?.originalPrice * data?.discountPercentage
    const finalPrice = discountedPrice / 100
    const actualDiscountedPrice = data?.originalPrice - finalPrice
    setData((prev) => ({...prev, discountedPrice: actualDiscountedPrice}))
  }, [data?.discountPercentage, data?.originalPrice])

  console.log(productDetailData?.images, productDetailData, 'images data value')


  console.log('isHot selling value',isHotSelling)

  return (
    <div className="addProductContainer">
      <div className="addProduct">
        <div className="addProduct-input">
          <Label required labelName="Product Name"></Label>
          <InputField
            type="text"
            placeholder="Enter Product Name"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, name: e.target.value}))
            }
            value={data.name}
          ></InputField>
        </div>

        <HStack gap="$3">
          <div className="addProduct-input">
            <Label required labelName="Category"></Label>
            <SelectField
              options={category}
              // defaultValue={selectedCategory[0]}
              // value={newUnitList?.find((item) => {
              //   return item.label === data.unitName
              // })}
              // onChangeValue={(e) =>()
              // !Array.isArray(e) && setValue('unitName', e.label)
              // }
              width="320px"
              value={selectedCategory?.label !== undefined && selectedCategory}
              onChangeValue={(data) => {
                setSelectedCategory(data)
                setSelectedSubCategory(null)
              }}
              placeholder={'Select Category'}
            />
          </div>

          <div className="addProduct-input">
            <Label required labelName="SubCategory"></Label>
            <SelectField
              options={subCategory}
              // onChangeValue={(e) =>
              // !Array.isArray(e) && setValue('unitName', e.label)
              // }
              width="320px"
              onChangeValue={(data) => setSelectedSubCategory(data)}
              placeholder={'Select SubCategory'}
              value={
                selectedSubCategory?.label !== undefined && selectedSubCategory
              }
            />
          </div>
        </HStack>

        <HStack justify="space-between" gap="$3">
          <div className="addProduct-input">
            <Label required labelName="Original Price"></Label>
            <InputField
              type="number"
              placeholder="Enter Original Price"
              onChange={(e: any) =>
                setData((prev: any) => ({
                  ...prev,
                  originalPrice: e.target.value
                }))
              }
              value={data.originalPrice}
            ></InputField>
          </div>
          <div className="addProduct-input">
            <Label required labelName="Discount Percentage"></Label>
            <InputField
              type="number"
              placeholder="Enter Discount Percentage"
              onChange={(e: any) =>
                setData((prev: any) => ({
                  ...prev,
                  discountPercentage: e.target.value
                }))
              }
              value={data.discountPercentage}
            ></InputField>
          </div>
        </HStack>

        <div className="addProduct-input">
          <Label required labelName="Discounted Price"></Label>
          <InputField
            type="number"
            placeholder="Enter Discounted Price"
            onChange={(e: any) =>
              setData((prev: any) => ({
                ...prev,
                discountedPrice: e.target.value
              }))
            }
            value={data.discountedPrice}
          ></InputField>
        </div>

        <div className="addProduct-input">
          <Label required labelName="Stock Quantity"></Label>
          <InputField
            type="number"
            placeholder="Enter Stock Quantity"
            onChange={(e: any) =>
              setData((prev: any) => ({
                ...prev,
                stockQuantity: e.target.value
              }))
            }
            value={data.stockQuantity}
          ></InputField>
        </div>

        <div className="addProduct-input">
          <Label required labelName="How many color variant"></Label>
          <InputField
            type="number"
            placeholder="Enter Color variant bumber"
            onChange={(e: any) => setColorCount(e.target.value)}
            value={colorCount}
          ></InputField>
        </div>

        {colorCount &&
          Array(Number(colorCount))
            ?.fill(10)
            ?.map((item: any, index: number) => {
              return (
                <HStack key={index + item.name}>
                  <div>
                    <ImageUploader
                      key={index}
                      uniqueKeys={index}
                      defaultImage={
                        productId && !!productDetailData
                          ? [productDetailData?.images[index]]
                          : ''
                      }
                      onImageChange={(event) => {
                        const selectedFiles = Array.from(event.target.files)

                        console.log(index, 'index')
                        console.log(selectedFiles, 'seelctedFiles+++++++++++++')

                        setColorImage((prev) => {
                          const existingList = [...prev]
                          const currentObject = existingList[index]

                          console.log(existingList, 'existingList 2')

                          console.log(currentObject, 'current object 2')

                          existingList[index] = {
                            ...currentObject,
                            image: event.target.files,
                            id: uuidv4()
                          }

                          // existingList.splice(index, 0, {
                          //   ...currentObject,
                          //   color: e.target.value
                          // })

                          return existingList
                        })

                        // setColorImage((prev: any) => {
                        //   const existingList = [...prev]

                        //   console.log(existingList, 'existingList')
                        //   const currentObject = existingList[index]
                        //   console.log(currentObject, 'current object')

                        //   existingList.splice(index, 0, {
                        //     ...currentObject,
                        //     image: [...selectedFiles]
                        //   })

                        //   return existingList
                        // })

                        // setColorImage((prev: any) => ({
                        //   ...prev,
                        //   image: [...selectedFiles]
                        // }))
                      }}
                      value={colorImage[index]?.image ?? ''}
                      actionHandler={handleAction}
                    ></ImageUploader>
                  </div>

                  <div>
                    <input
                      type="color"
                      style={{width: '200px', height: '200px'}}
                      onChange={(e: any) => {
                        // setColorImage((prev: any) => ({
                        //   ...prev,
                        //   color: e.target.value
                        // }))

                        // setAllColorVariant((prev) => {
                        //   const findItem = allColorVariant.map(
                        //     (items, index) => {
                        //       return item.id === items?.id
                        //     }
                        //   )
                        //   return [...prev]
                        // })
                        setColorImage((prev) => {
                          setCurrentlySelectedColor(e.target.value)

                          const existingList = [...prev]
                          const currentObject = existingList[index]

                          console.log(existingList, 'existingList 2')

                          console.log(currentObject, 'current object 2')

                          existingList[index] = {
                            ...currentObject,
                            color: e.target.value
                          }

                          // existingList.splice(index, 0, {
                          //   ...currentObject,
                          //   color: e.target.value
                          // })

                          return existingList
                        })
                      }}
                      value={colorImage[index]?.color ?? ''}

                      // value="#a72020"
                      // value={productId && colorImage?.color}

                      // value={productDetailData?.images?.[index]?.colorName}
                    ></input>

                    <Button
                      title="Add Color variant"
                      onClick={handleColorVariant}
                    ></Button>
                  </div>
                </HStack>
              )
            })}

        <div className="addProduct-input">
          <Label required labelName="Product Detail"></Label>
          {/* <InputField
            type="text"
            placeholder="Enter Product Detail"
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, details: e.target.value}))
            }
            value={data.details}
          ></InputField> */}

          <TextEditor
            descriptionBody={data.description}
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, description: e}))
            }
          />
        </div>

        <div className="addProduct-input">
          {/* <Label required labelName="Product Images"></Label> */}
          {/* <InputField
            type="file"
            accept="image/*"
            multiple
            placeholder="Upload Your Product Images From Here"
            onChange={handleImage}
            // value={data.images}
          ></InputField> */}

          {/* <ImageUploader
            defaultImage={
              productId && !!productDetailData ? productDetailData.image : ''
            }
            onImageChange={handleImage}
            value={data.images}
            actionHandler={handleAction}
          ></ImageUploader> */}
        </div>

        <div className="addProduct-input">
          <Label required labelName="Product Video"></Label>
          {/* <InputField
            type="file"
            placeholder="Upload Your Product Video From Here"
            accept="video/*"
            onChange={handleVideo}
            // value={data.video}
          ></InputField> */}

          <VideoUploader
            defaultVideo={
              productId && !!productDetailData
                ? `${FILE_URL}/video/${productDetailData?.video}`
                : ''
            }
            onVideoChange={handleVideo}
            value={handleVideo}
            actionHandler={(video: any) =>
              setData((prev: any) => ({...prev, video: video}))
            }
          ></VideoUploader>

          {/* <ReactPlayer
            url={data.video}
            controls={controls}
            playIcon={
              <h1 style={{border: '2px solid red'}}>
                <AiFillPlayCircle
                  size={40}
                  color="red"
                  onClick={handlePlayClick}
                />
              </h1>
            }
            ref={playerRef}
            playing={playing}
            light={
              showThumbnail &&
              'https://cdn.kimkim.com/files/a/content_articles/featured_photos/050a89ea730f913b48cf7dea23719688bc3652fe/big-891ee83ca306656a3c388f949db9e72d.jpg'
            }
          /> */}
          {/* 
          <div
            className="playCloseButton"
            style={{
              position: 'fixed',
              zIndex: '300000000000000',
              border: '2px solid red',
              top: '20px',
              right: '20px'
            }}
            onClick={() => {
              setPlaying(false)
              setControls(false)
              document.getElementsByTagName('video')[0].style.border =
                '4px solid green'
              document.getElementsByTagName('video')[0].style.position =
                'relative'
              document.getElementsByTagName('video')[0].style.height = '100px'
              document.getElementsByTagName('video')[0].style.width = '100px'
              // setShowThumbnail(true)
            }}
          >
            <AiOutlineClose size={20} color="red"></AiOutlineClose>
          </div> */}

          <div
            className="addProduct-input"
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              columnGap: '20%',
              flexDirection: 'row',
              margin: '14px'
            }}
          >
            <VStack gap="$3">
              <Label required labelName="Is New Arrival"></Label>
              <CheckBox
                value="newArrival"
                label="New Arrival"
                name="newArrival"
                check={isNewArrivalOrBestSelling.isNewArrival}
                handleCheckboxChange={handlenewArrival}
              />
            </VStack>
            <VStack gap="$3">
              <Label required labelName="Is Best Selling?"></Label>

              <CheckBox
                value="best selling"
                label="Best Selling"
                name="bestselling"
                check={isNewArrivalOrBestSelling.isBestSelling}
                handleCheckboxChange={handleBestSelling}
              />
            </VStack>

            <VStack gap="$3">
              <Label required labelName="Is Watch And Shopping?"></Label>

              <CheckBox
                value="isWatchAndShop"
                label="Watch And Shop"
                name="isWatchAndShop"
                check={isNewArrivalOrBestSelling.isWatchAndShop}
                handleCheckboxChange={handleWatchAndShopping}
              />
            </VStack>


           
          </div>

                  <VStack gap="$3">
              <Label required labelName="Is Hot Selling?"></Label>

              <CheckBox
                value="Hot selling"
                label="Hot Selling"
                name="hotselling"
                check={isHotSelling}
                handleCheckboxChange={()=>{
                  setIsHotSelling(!isHotSelling)
                }}
              />
            </VStack>
        </div>

        <Button
          title={productId ? 'Update Product' : 'Add Product'}
          onClick={addProductHandler}
          loading={productId ? updateProductLoading : createProductLoading}
        ></Button>
      </div>
    </div>
  )
}
