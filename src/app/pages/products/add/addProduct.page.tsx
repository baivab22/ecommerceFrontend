import React, {useCallback, useEffect, useState, useRef} from 'react'
import {useDispatch, useSelector} from 'src/store'
import {useMedia, useParams} from 'src/hooks'
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
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
import {v4 as uuidv4} from 'uuid'
import {BASE_URL, FILE_URL} from 'src/config'

export const AddProductPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const productId = useParams('productId')

  useEffect(() => {
    productId &&
      dispatch(getProductDetailByIdAction({productId: productId as string}))
  }, [])

  const {productDetailData, productDetailLoading}: any = useSelector(
    (state: any) => state.product
  )

  const [image, setImage] = useState<any>([])
  const [colorCount, setColorCount] = useState(2)
  const [colorImage, setColorImage] = useState([
    {
      id: uuidv4(),
      color: '',
      image: {},
      existingImagePath: '' // Store the existing image path
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
    nestedSubCategory: '', 
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

  // Category, SubCategory, and NestedSubCategory states
  const [selectedCategory, setSelectedCategory] = useState<any>()
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
  const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
  const [category, setCategory] = useState<any>()
  const [subCategory, setSubCategory] = useState<any>()
  const [nestedSubCategory, setNestedSubCategory] = useState<any>()

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
  }, [productVariantList])

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [])

  // Load product detail data when editing
  useEffect(() => {
    if (productId && productDetailData) {
      setSelectedCategory({
        id: productDetailData?.category?.id,
        label: productDetailData?.category?.name,
        value: productDetailData?.category?.value
      })
      
      setSelectedSubCategory({
        id: productDetailData?.subCategory?.id,
        label: productDetailData?.subCategory?.name,
        value: productDetailData?.subCategory?.value
      })

      // NEW: Load nested subcategory if it exists
      if (productDetailData?.nestedSubCategory) {
        setSelectedNestedSubCategory({
          id: productDetailData?.nestedSubCategory?.id,
          label: productDetailData?.nestedSubCategory?.name,
          value: productDetailData?.nestedSubCategory?.value
        })
      }

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
            image: item.coloredImage,
            existingImagePath: item.coloredImage // Store existing image filename
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

      setIsNewArrivalOrBestSelling((prev: any) => ({
        ...prev,
        isBestSelling: !!productDetailData
          ? productDetailData?.isBestSelling
          : false,
        isNewArrival: !!productDetailData
          ? productDetailData?.isNewArrivals
          : false,
        isWatchAndShop: !!productDetailData
          ? productDetailData?.isWatchAndShop
          : false
      }))

      setIsHotSelling(!!productDetailData ? productDetailData?.isHotSelling : false)
    }

    console.log(productDetailData, 'product detail data')
  }, [productDetailData])

  // Map categories from API data
  useEffect(() => {
    const mappedCategory = categoryData?.map((item: any, index: number) => {
      return {
        id: item.id,
        label: item.name,
        value: item.name,
        subCategory: item.subCategories
      }
    })
    setCategory(mappedCategory)
  }, [categoryData])

  // Map subcategories when category changes
  useEffect(() => {
    const mappedSubCategory = selectedCategory?.subCategory?.map(
      (item: any, index: number) => {
        return {
          id: item.id,
          label: item.name,
          value: item.name,
          nestedSubCategories: item.subCategories || [] // Assuming your API returns nested structure
        }
      }
    )
    setSubCategory(mappedSubCategory)
    // Reset nested subcategory when category changes
    if (!productId) {
      setSelectedNestedSubCategory(null)
    }
  }, [selectedCategory])

  // NEW: Map nested subcategories when subcategory changes
  useEffect(() => {
    const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
      (item: any, index: number) => {
        return {
          id: item.id,
          label: item.name,
          value: item.name
        }
      }
    )
    setNestedSubCategory(mappedNestedSubCategory)
  }, [selectedSubCategory])

  // NEW: Load nested subcategories when editing and subcategory is set
  useEffect(() => {
    if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
      const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
        (item: any, index: number) => {
          return {
            id: item.id,
            label: item.name,
            value: item.name
          }
        }
      )
      setNestedSubCategory(mappedNestedSubCategory)
    }
  }, [selectedSubCategory, productId, productDetailData])

  const handleImage = (event: any) => {
    const selectedFiles = Array.from(event.target.files)
    console.log(selectedFiles, 'seelctedFiles+++++++++++++')
    const myImages = [...image]
    console.log(myImages, 'myimages before')
    console.clear()
    console.log([...image, ...selectedFiles], '++++++++++')

    setImage((prev: any) => [...prev, ...selectedFiles])
  }

  const playerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [controls, setControls] = useState(true)
  const [showThumbnail, setShowThumbnail] = useState(true)

  const handlePlayClick = () => {
    setPlaying(true)
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
    console.log(isHotSelling, 'is hot selling')
    
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('category', selectedCategory?.id)
    formData.append('subCategory', selectedSubCategory?.id)
    
    // NEW: Append nested subcategory if selected
    if (selectedNestedSubCategory?.id) {
      formData.append('nestedSubCategory', selectedNestedSubCategory.id)
    }
    
    formData.append('originalPrice', data.originalPrice)
    formData.append('discountedPrice', data.discountedPrice)
    formData.append('discountPercentage', data.discountPercentage)
    formData.append('description', data.description)
    console.log(data.video, 'data video')

formData.append('video', data.video)
    formData.append('stockQuantity', data.stockQuantity)
    formData.append('isHotSelling', JSON.stringify(isHotSelling))

    console.log(productVariantIdList, 'product variant list')
    console.log(productVariantIdList, 'product variant id list')
    const minusCount = -colorCount
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

    console.log(isHotSelling,'ishotselling value before append')

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
                toast.success('Product Updated Successfully')
                setData({
                  name: '',
                  originalPrice: '',
                  discountedPrice: '',
                  discountPercentage: '',
                  category: '',
                  subCategory: '',
                  nestedSubCategory: '',
                  images: [],
                  video: null,
                  description: '',
                  stockQuantity: ''
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

                toast.success('Product Created Successfully')
                setData({
                  name: '',
                  originalPrice: '',
                  discountedPrice: '',
                  discountPercentage: '',
                  category: '',
                  subCategory: '',
                  nestedSubCategory: '',
                  images: [],
                  video: null,
                  description: '',
                  stockQuantity: ''
                })
              }
            })
          )
    }
  }

const handleColorVariant = async () => {
  try {
    const formData = new FormData();

    console.log(colorImage, 'colorImage hai');

    for (let index = 0; index < colorImage.length; index++) {
      const item = colorImage[index];

      // ✅ CASE 1: New image uploaded (File or FileList)
      if (item.image instanceof FileList && item.image.length > 0) {
        formData.append('coloredImage', item.image[0]);
      } else if (item.image instanceof File) {
        formData.append('coloredImage', item.image);
      } 
      // ✅ CASE 2: Existing image (string filename)
      else if (typeof item.image === 'string' && item.existingImagePath) {
        try {
          const imageUrl = `${FILE_URL}/products/${item.existingImagePath}`;
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error(`Failed to fetch ${imageUrl}`);
          const blob = await response.blob();
          const file = new File([blob], item.existingImagePath, { type: blob.type });
          formData.append('coloredImage', file);
        } catch (error) {
          console.error(`Error fetching existing image at index ${index}:`, error);
          toast.error(`Failed to process existing image #${index + 1}`);
          return;
        }
      } else {
        console.warn(`No valid image found at index ${index}`, item);
        continue; // skip this one
      }

      // ✅ Append corresponding color
      formData.append('colorName', item.color);
    }

    // ✅ Debug FormData before sending
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // ✅ Dispatch your Redux action
    dispatch(
      createProductImageAction({
        variantBody: formData,
        onSuccess: () => {
          toast.success('Product color variant added successfully!');
          dispatch(getAllProductVariantImagesAction({
            onSuccess: (data) => {
             console.log(data, 'all variant images after adding new one');
            }
          }));
        },
      })
    );
  } catch (error) {
    console.error('Unexpected error in handleColorVariant:', error);
    toast.error('Something went wrong while uploading color variants.');
  }
};


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

  console.log('isHot selling value', isHotSelling)
const media=useMedia();
  return (
    <div className="addProductContainer">
      <div className="addProduct"
      style={{padding:'20px 12px'}}
      >
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

        <div style={{display:'flex',gap:'12px',flexDirection:!media.md?'column':'row'}}>
          <div className="addProduct-input">
            <Label required labelName="Category"></Label>
            <SelectField
              options={category}
              width="320px"
              value={selectedCategory?.label !== undefined && selectedCategory}
              onChangeValue={(data) => {
                setSelectedCategory(data)
                setSelectedSubCategory(null)
                setSelectedNestedSubCategory(null)
              }}
              placeholder={'Select Category'}
            />
          </div>

          <div className="addProduct-input">
            <Label required labelName="SubCategory"></Label>
            <SelectField
              options={subCategory}
              width="320px"
              onChangeValue={(data) => {
                setSelectedSubCategory(data)
                setSelectedNestedSubCategory(null)
              }}
              placeholder={'Select SubCategory'}
              value={
                selectedSubCategory?.label !== undefined && selectedSubCategory
              }
            />
          </div>
        </div>

        {/* NEW: Nested SubCategory Dropdown - Only shows when nested options exist */}
        {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
          <div className="addProduct-input">
            <Label labelName="Nested SubCategory (Optional)"></Label>
            <SelectField
              options={nestedSubCategory}
              width="100%"
              onChangeValue={(data) => setSelectedNestedSubCategory(data)}
              placeholder={'Select Nested SubCategory'}
              value={
                selectedNestedSubCategory?.label !== undefined && 
                selectedNestedSubCategory
              }
            />
          </div>
        ) : null}

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
            placeholder="Enter Color variant number"
            onChange={(e: any) => setColorCount(e.target.value)}
            value={colorCount}
          ></InputField>
        </div>

        {colorCount &&
          Array(Number(colorCount))
            ?.fill(10)
            ?.map((item: any, index: number) => {
              return (
                <div
                  div
                 style={{display:'flex',gap:'12px',flexDirection:!media.md?'column':'row'}}
                 key={index + item.name}
                // HStack 
                >
                  <div style={{minWidth:'300px'}}>
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

                          return existingList
                        })
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
                        setColorImage((prev) => {
                          setCurrentlySelectedColor(e.target.value)
                          const existingList = [...prev]
                          const currentObject = existingList[index]
                          existingList[index] = {
                            ...currentObject,
                            color: e.target.value
                          }

                          return existingList
                        })
                      }}
                      value={colorImage[index]?.color ?? ''}
                    ></input>

                    <Button
                      title="Add Color variant"
                      onClick={handleColorVariant}
                    ></Button>
                  </div>
                </div>
              )
            })}

        <div className="addProduct-input">
          <Label required labelName="Product Detail"></Label>
          <TextEditor
            descriptionBody={data.description}
            onChange={(e: any) =>
              setData((prev: any) => ({...prev, description: e}))
            }
          />
        </div>

        <div className="addProduct-input">
          <Label required labelName="Product Video"></Label>
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

          {/* <VStack gap="$3">
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
          </VStack> */}
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