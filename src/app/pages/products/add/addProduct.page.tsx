// import React, {useCallback, useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from 'src/store'
// import {useMedia, useParams} from 'src/hooks'
// import {
//   Button,
//   CheckBox,
//   HStack,
//   InputField,
//   Label,
//   SelectField,
//   TextEditor,
//   VStack
// } from 'src/app/common'
// import {
//   getCategoryListAction,
//   getSubCategoryAction
// } from '../../category/category.slice'
// import {
//   createProductAction,
//   createProductImageAction,
//   delteProductImageAction,
//   getAllProductVariantImagesAction,
//   getProductDetailByIdAction,
//   getProductListAction,
//   updateProductAction
// } from '../product.slice'
// import {useNavigate} from 'react-router-dom'
// import {toast} from 'react-hot-toast'
// import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
// import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
// import {v4 as uuidv4} from 'uuid'
// import {FILE_URL} from 'src/config'
// import {resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'

// export const AddProductPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const productId = useParams('productId')
//   const hydratedProductIdRef = useRef<string | null>(null)

//   useEffect(() => {
//     productId &&
//       dispatch(getProductDetailByIdAction({productId: productId as string}))
//   }, [])

//   const {productDetailData, productDetailLoading}: any = useSelector(
//     (state: any) => state.product
//   )

//   const [image, setImage] = useState<any>([])
//   const [colorCount, setColorCount] = useState(2)
//   const [colorImage, setColorImage] = useState([
//     {
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: '' // Store the existing image path
//     }
//   ])

//   const [allColorVariant, setAllColorVariant] = useState([])

//   useEffect(() => {
//     console.log(colorImage, 'colorImage value')
//   }, [colorImage])

//   useEffect(() => {
//     console.log(colorCount, 'colorCount')
//     console.log(colorImage, 'color image')
//   }, [colorCount, colorImage])

//   const [data, setData] = useState<any>({
//     name: '',
//     originalPrice: '',
//     discountedPrice: '',
//     discountPercentage: 0,
//     category: '',
//     subCategory: '',
//     nestedSubCategory: '', 
//     images: [],
//     video: null,
//     description: '',
//     stockQuantity: ''
//   })

//   const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
//     isNewArrival: false,
//     isBestSelling: false,
//     isWatchAndShop: false
//   })

//   const [isHotSelling, setIsHotSelling] = useState(false)

//   // Category, SubCategory, and NestedSubCategory states
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
//   const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
//   const [category, setCategory] = useState<any>()
//   const [subCategory, setSubCategory] = useState<any>()
//   const [nestedSubCategory, setNestedSubCategory] = useState<any>()

//   const {
//     categoryData,
//     getCategoryLoading,
//     subCategoryData,
//     getSubCategoryLoading
//   }: any = useSelector((state: any) => state.category)

//   const {createProductLoading, updateProductLoading, productVariantList}: any =
//     useSelector((state: any) => state.product)
  
//   const [productVariantIdList, setProductVariantIdList] = useState([''])

//   useEffect(() => {
//     console.log('product variant list')
//     setProductVariantIdList(
//       productVariantList?.map((item: any, index: number) => {
//         return item._id
//       })
//     )
//   }, [productVariantList])

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryList fetch Successfully')
//       })
//     )
//   }, [])

//   useEffect(() => {
//     hydratedProductIdRef.current = null
//   }, [productId])

//   // Load product detail data when editing (once per product — avoids wiping color edits)
//   useEffect(() => {
//     if (
//       productId &&
//       productDetailData &&
//       hydratedProductIdRef.current !== productId
//     ) {
//       hydratedProductIdRef.current = productId as string
//       setSelectedCategory({
//         id: productDetailData?.category?.id,
//         label: productDetailData?.category?.name,
//         value: productDetailData?.category?.value
//       })
      
//       setSelectedSubCategory({
//         id: productDetailData?.subCategory?.id,
//         label: productDetailData?.subCategory?.name,
//         value: productDetailData?.subCategory?.value
//       })

//       // NEW: Load nested subcategory if it exists
//       if (productDetailData?.nestedSubCategory) {
//         setSelectedNestedSubCategory({
//           id: productDetailData?.nestedSubCategory?.id,
//           label: productDetailData?.nestedSubCategory?.name,
//           value: productDetailData?.nestedSubCategory?.value
//         })
//       }

//       setProductVariantIdList(
//         productDetailData?.images?.map((item: any, index: number) => {
//           // Use index as identifier since images are now embedded objects without _id
//           return String(index)
//         })
//       )

//       setColorImage(() => {
//         return productDetailData?.images?.map((item: any, index: number) => {
//           return {
//             // Use index as unique identifier for embedded images (no _id in embedded objects)
//             id: String(index),
//             color: item.colorName,
//             image: item.coloredImage,
//             existingImagePath: item.coloredImage // Store existing image filename
//           }
//         })
//       })

//       setData((prev: any) => ({
//         ...prev,
//         name: productDetailData?.name,
//         originalPrice: productDetailData?.originalPrice,
//         discountedPrice: !!productDetailData
//           ? productDetailData.discountedPrice
//           : '',
//         discountPercentage: !!productDetailData
//           ? productDetailData.discountPercentage
//           : 0,
//         stockQuantity: !!productDetailData
//           ? productDetailData.stockQuantity
//           : 0,
//         images: !!productDetailData ? productDetailData.images?.[0] : '',
//         description: !!productDetailData ? productDetailData?.description : '',
//         video: null  // ✅ Don't store existing video as blob, only store when user selects new one
//       }))

//       // ✅ REMOVED: Don't fetch and convert existing video to blob
//       // Only store actual File objects when user selects a new video
//       // This prevents sending blob data when form is submitted without changing video

//       console.log(productVariantIdList, 'pr list')

//       setColorCount(productDetailData?.images?.length)
//       setAllColorVariant(productDetailData?.images)

//       setIsNewArrivalOrBestSelling((prev: any) => ({
//         ...prev,
//         isBestSelling: !!productDetailData
//           ? productDetailData?.isBestSelling
//           : false,
//         isNewArrival: !!productDetailData
//           ? productDetailData?.isNewArrivals
//           : false,
//         isWatchAndShop: !!productDetailData
//           ? productDetailData?.isWatchAndShop
//           : false
//       }))

//       setIsHotSelling(!!productDetailData ? productDetailData?.isHotSelling : false)
//     }

//     console.log(productDetailData, 'product detail data')
//   }, [productDetailData])

//   // Map categories from API data
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any, index: number) => {
//       return {
//         id: item.id,
//         label: item.name,
//         value: item.name,
//         subCategory: item.subCategories
//       }
//     })
//     setCategory(mappedCategory)
//   }, [categoryData])

//   // Map subcategories when category changes
//   useEffect(() => {
//     const mappedSubCategory = selectedCategory?.subCategory?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name,
//           nestedSubCategories: item.subCategories || [] // Assuming your API returns nested structure
//         }
//       }
//     )
//     setSubCategory(mappedSubCategory)
//     // Reset nested subcategory when category changes
//     if (!productId) {
//       setSelectedNestedSubCategory(null)
//     }
//   }, [selectedCategory])

//   // NEW: Map nested subcategories when subcategory changes
//   useEffect(() => {
//     const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name
//         }
//       }
//     )
//     setNestedSubCategory(mappedNestedSubCategory)
//   }, [selectedSubCategory])

//   // NEW: Load nested subcategories when editing and subcategory is set
//   useEffect(() => {
//     if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
//       const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//         (item: any, index: number) => {
//           return {
//             id: item.id,
//             label: item.name,
//             value: item.name
//           }
//         }
//       )
//       setNestedSubCategory(mappedNestedSubCategory)
//     }
//   }, [selectedSubCategory, productId, productDetailData])

//   const handleImage = (event: any) => {
//     const selectedFiles = Array.from(event.target.files)
//     console.log(selectedFiles, 'seelctedFiles+++++++++++++')
//     const myImages = [...image]
//     console.log(myImages, 'myimages before')
//     console.clear()
//     console.log([...image, ...selectedFiles], '++++++++++')

//     setImage((prev: any) => [...prev, ...selectedFiles])
//   }

//   const playerRef = useRef(null)
//   const [playing, setPlaying] = useState(false)
//   const [controls, setControls] = useState(true)
//   const [showThumbnail, setShowThumbnail] = useState(true)

//   const handlePlayClick = () => {
//     setPlaying(true)
//   }

//   useEffect(() => {
//     console.log(productDetailData, 'pr')
//   }, [productDetailData])

//   console.log(colorImage, 'colored images')

//   const handleAction = (imageId: string) => {
//     console.log('product id called dfsdfsdfdf', productId)
//     dispatch(
//       delteProductImageAction({
//         productId: productId as string,
//         imageId: imageId as string,
//         onSuccess: () => {
//           toast.success('product delete')
//         }
//       })
//     )
//   }

//   const handleVideo = (event: any) => {
//     const selectedFile = event.target.files?.[0]
//     if (!selectedFile) return
//     if (!selectedFile.size) {
//       toast.error('Selected video file is empty')
//       return
//     }
//     setData((prev: any) => ({...prev, video: selectedFile}))
//   }

//   const handlenewArrival = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
//   }

//   console.log(allColorVariant, colorCount, 'cc')

//   const handleBestSelling = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isBestSelling: item
//     }))
//   }

//   const handleWatchAndShopping = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isWatchAndShop: item
//     }))
//   }

//   const getActiveVariantSlots = () =>
//     colorImage.slice(0, Math.max(1, Number(colorCount) || colorImage.length))

//   const appendColorVariantsToFormData = (
//     formData: FormData,
//     isUpdate: boolean
//   ) => {
//     const slots = getActiveVariantSlots()

//     if (isUpdate) {
//       const variantsMeta = slots.map((item, index) => {
//         const hasNewFile =
//           (item?.image instanceof FileList && item.image.length > 0) ||
//           item?.image instanceof File

//         const existingImage = !hasNewFile
//           ? (typeof item?.image === 'string' && item.image) ||
//             item?.existingImagePath ||
//             null
//           : null

//         return {
//           color: item?.color ?? '',
//           existingImage,
//           hasNewImage: hasNewFile
//         }
//       })

//       formData.append('variantsMeta', JSON.stringify(variantsMeta))
//       formData.append('replaceImages', 'true')

//       slots.forEach((item) => {
//         formData.append('colorName', item?.color ?? '')
//       })

//       slots.forEach((item) => {
//         if (item?.image instanceof FileList && item.image.length > 0) {
//           formData.append('coloredImage', item.image[0])
//         } else if (item?.image instanceof File) {
//           formData.append('coloredImage', item.image)
//         }
//       })
//       return
//     }

//     slots.forEach((item) => {
//       if (item?.color) {
//         formData.append('colorName', item.color)
//       }

//       if (item?.image instanceof FileList && item.image.length > 0) {
//         formData.append('coloredImage', item.image[0])
//       } else if (item?.image instanceof File) {
//         formData.append('coloredImage', item.image)
//       }
//     })
//   }

//   const addProductHandler = (event: any) => {
//     event.preventDefault()
//     console.log('addProduct called to updated', data)
//     console.log(isHotSelling, 'is hot selling')
    
//     const formData = new FormData()

//     formData.append('name', data.name)
//     formData.append('category', selectedCategory?.id)
//     formData.append('subCategory', selectedSubCategory?.id)
    
//     // NEW: Append nested subcategory if selected
//     if (selectedNestedSubCategory?.id) {
//       formData.append('nestedSubCategory', selectedNestedSubCategory.id)
//     }
    
//     formData.append('originalPrice', data.originalPrice)
//     formData.append('discountedPrice', data.discountedPrice)
//     formData.append('discountPercentage', data.discountPercentage)
//     formData.append('description', data.description)
    
//     // ✅ Only append video if a new file was selected (File object), not if it's a string (existing video)
//     if (data.video instanceof File) {
//       formData.append('video', data.video)
//     }
    
//     formData.append('stockQuantity', data.stockQuantity)
//     formData.append('isHotSelling', JSON.stringify(isHotSelling))

//     // Images are optional now. Do not block save if no color-variant images are provided.

//     appendColorVariantsToFormData(formData, !!productId)

//     formData.append(
//       'isBestSelling',
//       JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
//     )

//     formData.append(
//       'isNewArrivals',
//       JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
//     )

//     formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

//     console.log(isHotSelling,'ishotselling value before append')

//     console.log(isHotSelling, ' is hot selling video')

//     {
//       productId
//         ? dispatch(
//             updateProductAction({
//               productBody: formData,
//               productId: productId as any,
//               onSuccess: () => {
//                 dispatch(
//                   getProductListAction({
//                     onSuccess: (data) => console.log('get hit after update')
//                   })
//                 )
//                 navigate('/products')
//                 toast.success('Product Updated Successfully')
//                 setData({
//                   name: '',
//                   originalPrice: '',
//                   discountedPrice: '',
//                   discountPercentage: 0,
//                   category: '',
//                   subCategory: '',
//                   nestedSubCategory: '',
//                   images: [],
//                   video: null,
//                   description: '',
//                   stockQuantity: ''
//                 })
//               }
//             })
//           )
//         : dispatch(
//             createProductAction({
//               productBody: formData,
//               onSuccess: () => {
//                 dispatch(
//                   getProductListAction({
//                     onSuccess: (data) => setData({})
//                   })
//                 )
//                 navigate('/products')

//                 toast.success('Product Created Successfully')
//                 setData({
//                   name: '',
//                   originalPrice: '',
//                   discountedPrice: '',
//                   discountPercentage: 0,
//                   category: '',
//                   subCategory: '',
//                   nestedSubCategory: '',
//                   images: [],
//                   video: null,
//                   description: '',
//                   stockQuantity: ''
//                 })
//               }
//             })
//           )
//     }
//   }

// const handleColorVariant = async () => {
//   try {
//     const formData = new FormData();

//     console.log(colorImage, 'colorImage hai');

//     for (let index = 0; index < colorImage.length; index++) {
//       const item = colorImage[index];

//       // ✅ CASE 1: New image uploaded (File or FileList)
//       if (item.image instanceof FileList && item.image.length > 0) {
//         formData.append('coloredImage', item.image[0]);
//       } else if (item.image instanceof File) {
//         formData.append('coloredImage', item.image);
//       } 
//       // ✅ CASE 2: Existing image (string filename)
//       else if (typeof item.image === 'string' && item.existingImagePath) {
//         try {
//           const imageUrl = `${FILE_URL}/products/${item.existingImagePath}`;
//           const response = await fetch(imageUrl);
//           if (!response.ok) throw new Error(`Failed to fetch ${imageUrl}`);
//           const blob = await response.blob();
//           const file = new File([blob], item.existingImagePath, { type: blob.type });
//           formData.append('coloredImage', file);
//         } catch (error) {
//           console.error(`Error fetching existing image at index ${index}:`, error);
//           toast.error(`Failed to process existing image #${index + 1}`);
//           return;
//         }
//       } else {
//         console.warn(`No valid image found at index ${index}`, item);
//         continue; // skip this one
//       }

//       // ✅ Append corresponding color
//       formData.append('colorName', item.color);
//     }

//     // ✅ Debug FormData before sending
//     for (const pair of formData.entries()) {
//       console.log(pair[0], pair[1]);
//     }

//     // ✅ Dispatch your Redux action
//     dispatch(
//       createProductImageAction({
//         variantBody: formData,
//         onSuccess: () => {
//           toast.success('Product color variant added successfully!');
//           dispatch(getAllProductVariantImagesAction({
//             onSuccess: (data) => {
//              console.log(data, 'all variant images after adding new one');
//             }
//           }));
//         },
//       })
//     );
//   } catch (error) {
//     console.error('Unexpected error in handleColorVariant:', error);
//     toast.error('Something went wrong while uploading color variants.');
//   }
// };


//   useEffect(() => {
//     console.log(allColorVariant, 'allColorVariant')
//   }, [allColorVariant])

//   console.log(colorImage, 'colorImages default')

//   const [currentlySelectedColor, setCurrentlySelectedColor] =
//     useState<string>('')

//   useEffect(() => {
//     const discountedPrice = data?.originalPrice * data?.discountPercentage
//     const finalPrice = discountedPrice / 100
//     const actualDiscountedPrice = data?.originalPrice - finalPrice
//     setData((prev) => ({...prev, discountedPrice: actualDiscountedPrice}))
//   }, [data?.discountPercentage, data?.originalPrice])

//   console.log(productDetailData?.images, productDetailData, 'images data value')

//   console.log('isHot selling value', isHotSelling)
// const media=useMedia();
//   return (
//     <div className="addProductContainer">
//       <div className="addProduct"
//       style={{padding:'20px 12px'}}
//       >
//         <div className="addProduct-input">
//           <Label required labelName="Product Name"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Product Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, name: e.target.value}))
//             }
//             value={data.name}
//           ></InputField>
//         </div>

//         <div style={{display:'flex',gap:'12px',flexDirection:!media.md?'column':'row'}}>
//           <div className="addProduct-input">
//             <Label required labelName="Category"></Label>
//             <SelectField
//               options={category}
//               width="320px"
//               value={selectedCategory?.label !== undefined && selectedCategory}
//               onChangeValue={(data) => {
//                 setSelectedCategory(data)
//                 setSelectedSubCategory(null)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select Category'}
//             />
//           </div>

//           <div className="addProduct-input">
//             <Label required labelName="SubCategory"></Label>
//             <SelectField
//               options={subCategory}
//               width="320px"
//               onChangeValue={(data) => {
//                 setSelectedSubCategory(data)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select SubCategory'}
//               value={
//                 selectedSubCategory?.label !== undefined && selectedSubCategory
//               }
//             />
//           </div>
//         </div>

//         {/* NEW: Nested SubCategory Dropdown - Only shows when nested options exist */}
//         {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
//           <div className="addProduct-input">
//             <Label labelName="Nested SubCategory (Optional)"></Label>
//             <SelectField
//               options={nestedSubCategory}
//               width="100%"
//               onChangeValue={(data) => setSelectedNestedSubCategory(data)}
//               placeholder={'Select Nested SubCategory'}
//               value={
//                 selectedNestedSubCategory?.label !== undefined && 
//                 selectedNestedSubCategory
//               }
//             />
//           </div>
//         ) : null}

//         <HStack justify="space-between" gap="$3">
//           <div className="addProduct-input">
//             <Label required labelName="Original Price"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Original Price"
//               onChange={(e: any) =>
//                 setData((prev: any) => ({
//                   ...prev,
//                   originalPrice: e.target.value
//                 }))
//               }
//               value={data.originalPrice}
//             ></InputField>
//           </div>
//           <div className="addProduct-input">
//             <Label required labelName="Discount Percentage"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Discount Percentage"
//               onChange={(e: any) =>
//                 setData((prev: any) => ({
//                   ...prev,
//                   discountPercentage: Number(e.target.value)
//                 }))
//               }
//               value={data.discountPercentage}
//             ></InputField>
//           </div>
//         </HStack>

//         <div className="addProduct-input">
//           <Label required labelName="Discounted Price"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Discounted Price"
//             onChange={(e: any) =>
//               setData((prev: any) => ({
//                 ...prev,
//                 discountedPrice: e.target.value
//               }))
//             }
//             value={data.discountedPrice}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Stock Quantity"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Stock Quantity"
//             onChange={(e: any) =>
//               setData((prev: any) => ({
//                 ...prev,
//                 stockQuantity: e.target.value
//               }))
//             }
//             value={data.stockQuantity}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="How many color variant"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Color variant number"
//             onChange={(e: any) => setColorCount(e.target.value)}
//             value={colorCount}
//           ></InputField>
//         </div>

//         {colorCount &&
//           Array(Number(colorCount))
//             ?.fill(10)
//             ?.map((item: any, index: number) => {
//               return (
//                 <div
                
//                  style={{display:'flex',gap:'12px',flexDirection:!media.md?'column':'row'}}
//                  key={index + item.name}
//                 // HStack 
//                 >
//                   <div style={{minWidth:'300px'}}>
//                     <ImageUploader
//                       key={index}
//                       uniqueKeys={index}
//                       defaultImage={
//                         productId && !!productDetailData
//                           ? [productDetailData?.images[index]]
//                           : ''
//                       }
//                       onImageChange={(event) => {
//                         const selectedFiles = Array.from(event.target.files)

//                         console.log(index, 'index')
//                         console.log(selectedFiles, 'seelctedFiles+++++++++++++')

//                         setColorImage((prev) => {
//                           const existingList = [...prev]
//                           const currentObject = existingList[index]

//                           console.log(existingList, 'existingList 2')

//                           console.log(currentObject, 'current object 2')

//                           existingList[index] = {
//                             ...currentObject,
//                             image: event.target.files,
//                             id: uuidv4()
//                           }

//                           return existingList
//                         })
//                       }}
//                       value={colorImage[index]?.image ?? ''}
//                       actionHandler={handleAction}
//                     ></ImageUploader>
//                   </div>

//                   <div>
//                     <input
//                       type="color"
//                       style={{width: '200px', height: '200px'}}
//                       onChange={(e: any) => {
//                         setColorImage((prev) => {
//                           const existingList = [...prev]
//                           const currentObject = existingList[index] ?? {
//                             id: String(index),
//                             color: '',
//                             image: '',
//                             existingImagePath: ''
//                           }
//                           existingList[index] = {
//                             ...currentObject,
//                             color: e.target.value
//                           }

//                           return existingList
//                         })
//                       }}
//                       value={colorImage[index]?.color ?? ''}
//                     ></input>

//                     {/* <Button
//                       title="Add Color variant"
//                       onClick={handleColorVariant}
//                     ></Button> */}
//                   </div>
//                 </div>
//               )
//             })}

//         <div className="addProduct-input">
//           <Label required labelName="Product Detail"></Label>
//           <TextEditor
//             descriptionBody={data.description}
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, description: e}))
//             }
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Product Video"></Label>
//           <VideoUploader
//             defaultVideo={
//               productId && productDetailData?.video
//                 ? resolveProductVideoUrl(productDetailData.video)
//                 : ''
//             }
//             onVideoChange={handleVideo}
//             actionHandler={(video: File) => {
//               if (!video?.size) {
//                 toast.error('Selected video file is empty')
//                 return
//               }
//               setData((prev: any) => ({...prev, video}))
//             }}
//           ></VideoUploader>

//           <div
//             className="addProduct-input"
//             style={{
//               display: 'flex',
//               justifyContent: 'flex-start',
//               alignItems: 'center',
//               columnGap: '20%',
//               flexDirection: 'row',
//               margin: '14px'
//             }}
//           >
//             <VStack gap="$3">
//               <Label required labelName="Is New Arrival"></Label>
//               <CheckBox
//                 value="newArrival"
//                 label="New Arrival"
//                 name="newArrival"
//                 check={isNewArrivalOrBestSelling.isNewArrival}
//                 handleCheckboxChange={handlenewArrival}
//               />
//             </VStack>
//             <VStack gap="$3">
//               <Label required labelName="Is Best Selling?"></Label>

//               <CheckBox
//                 value="best selling"
//                 label="Best Selling"
//                 name="bestselling"
//                 check={isNewArrivalOrBestSelling.isBestSelling}
//                 handleCheckboxChange={handleBestSelling}
//               />
//             </VStack>

//             <VStack gap="$3">
//               <Label required labelName="Is Watch And Shopping?"></Label>

//               <CheckBox
//                 value="isWatchAndShop"
//                 label="Watch And Shop"
//                 name="isWatchAndShop"
//                 check={isNewArrivalOrBestSelling.isWatchAndShop}
//                 handleCheckboxChange={handleWatchAndShopping}
//               />
//             </VStack>
//           </div>

//           {/* <VStack gap="$3">
//             <Label required labelName="Is Hot Selling?"></Label>

//             <CheckBox
//               value="Hot selling"
//               label="Hot Selling"
//               name="hotselling"
//               check={isHotSelling}
//               handleCheckboxChange={()=>{
//                 setIsHotSelling(!isHotSelling)
//               }}
//             />
//           </VStack> */}
//         </div>

//         <Button
//           title={productId ? 'Update Product' : 'Add Product'}
//           onClick={addProductHandler}
//           loading={productId ? updateProductLoading : createProductLoading}
//         ></Button>
//       </div>
//     </div>
//   )
// }

// import React, {useCallback, useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from 'src/store'
// import {useMedia, useParams} from 'src/hooks'
// import {
//   Button,
//   CheckBox,
//   HStack,
//   InputField,
//   Label,
//   SelectField,
//   TextEditor,
//   VStack
// } from 'src/app/common'
// import {
//   getCategoryListAction,
//   getSubCategoryAction
// } from '../../category/category.slice'
// import {
//   createProductAction,
//   createProductImageAction,
//   delteProductImageAction,
//   getAllProductVariantImagesAction,
//   getProductDetailByIdAction,
//   getProductListAction,
//   updateProductAction,
//   resetProductDetail
// } from '../product.slice'
// import {useNavigate} from 'react-router-dom'
// import {toast} from 'react-hot-toast'
// import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
// import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
// import {v4 as uuidv4} from 'uuid'
// import {FILE_URL} from 'src/config'
// import {resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'

// export const AddProductPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const productId = useParams('productId')
//   const hydratedProductIdRef = useRef<string | null>(null)

//   // Reset form function
//   const resetForm = useCallback(() => {
//     setData({
//       name: '',
//       originalPrice: '',
//       discountedPrice: '',
//       discountPercentage: 0,
//       category: '',
//       subCategory: '',
//       nestedSubCategory: '',
//       images: [],
//       video: null,
//       description: '',
//       stockQuantity: ''
//     })
    
//     setImage([])
//     setColorCount(2)
//     setColorImage([{
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }])
//     setAllColorVariant([])
//     setSelectedCategory(null)
//     setSelectedSubCategory(null)
//     setSelectedNestedSubCategory(null)
//     setIsNewArrivalOrBestSelling({
//       isNewArrival: false,
//       isBestSelling: false,
//       isWatchAndShop: false
//     })
//     setIsHotSelling(false)
//     setProductVariantIdList([''])
//     hydratedProductIdRef.current = null
//   }, [])

//   const [image, setImage] = useState<any>([])
//   const [colorCount, setColorCount] = useState(2)
//   const [colorImage, setColorImage] = useState([
//     {
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }
//   ])

//   const [allColorVariant, setAllColorVariant] = useState([])

//   const [data, setData] = useState<any>({
//     name: '',
//     originalPrice: '',
//     discountedPrice: '',
//     discountPercentage: 0,
//     category: '',
//     subCategory: '',
//     nestedSubCategory: '', 
//     images: [],
//     video: null,
//     description: '',
//     stockQuantity: ''
//   })

//   const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
//     isNewArrival: false,
//     isBestSelling: false,
//     isWatchAndShop: false
//   })

//   const [isHotSelling, setIsHotSelling] = useState(false)

//   // Category, SubCategory, and NestedSubCategory states
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
//   const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
//   const [category, setCategory] = useState<any>()
//   const [subCategory, setSubCategory] = useState<any>()
//   const [nestedSubCategory, setNestedSubCategory] = useState<any>()

//   const {
//     categoryData,
//     getCategoryLoading,
//     subCategoryData,
//     getSubCategoryLoading
//   }: any = useSelector((state: any) => state.category)

//   const {createProductLoading, updateProductLoading, productVariantList, productDetailData, productDetailLoading}: any =
//     useSelector((state: any) => state.product)
  
//   const [productVariantIdList, setProductVariantIdList] = useState([''])



//   // Reset form when component mounts or productId changes (for new product)
//   useEffect(() => {

   
//     if (!productId) {
//        console.log("productId in useEffect mount", productId,!productId )

//       resetForm()
//       dispatch(resetProductDetail())
//     }
    
//     // Cleanup on unmount
//     return () => {
//        console.log("productId in useEffect unmount", productId,!productId )

//       // if (!productId) { 
//        console.log("productId in useEffect unmount", productId,!productId )

//         dispatch(resetProductDetail())
//       // }
//     }
//   }, [productId, resetForm, dispatch])

//   // Fetch product detail when productId exists
//   useEffect(() => {
//     if (productId) {
//       // Reset form and clear previous data before loading new product
//       resetForm()
//       dispatch(resetProductDetail())
//       hydratedProductIdRef.current = null
      
//       dispatch(getProductDetailByIdAction({productId: productId as string}))
//     }
//   }, [productId, dispatch, resetForm])

//   useEffect(() => {
//     console.log(productVariantList, 'product variant list')
//     setProductVariantIdList(
//       productVariantList?.map((item: any, index: number) => {
//         return item._id
//       })
//     )
//   }, [productVariantList])

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryList fetch Successfully')
//       })
//     )
//   }, [dispatch])

//   // Load product detail data when editing (only once per product)
//   useEffect(() => {
//     if (
//       productId &&
//       productDetailData &&
//       hydratedProductIdRef.current !== productId &&
//       Object.keys(productDetailData).length > 0
//     ) {
//       hydratedProductIdRef.current = productId as string
      
//       setSelectedCategory({
//         id: productDetailData?.category?.id,
//         label: productDetailData?.category?.name,
//         value: productDetailData?.category?.value
//       })
      
//       setSelectedSubCategory({
//         id: productDetailData?.subCategory?.id,
//         label: productDetailData?.subCategory?.name,
//         value: productDetailData?.subCategory?.value
//       })

//       // Load nested subcategory if it exists
//       if (productDetailData?.nestedSubCategory) {
//         setSelectedNestedSubCategory({
//           id: productDetailData?.nestedSubCategory?.id,
//           label: productDetailData?.nestedSubCategory?.name,
//           value: productDetailData?.nestedSubCategory?.value
//         })
//       }

//       setProductVariantIdList(
//         productDetailData?.images?.map((item: any, index: number) => {
//           return String(index)
//         })
//       )

//       setColorImage(() => {
//         if (productDetailData?.images && productDetailData.images.length > 0) {
//           return productDetailData?.images?.map((item: any, index: number) => {
//             return {
//               id: String(index),
//               color: item.colorName,
//               image: item.coloredImage,
//               existingImagePath: item.coloredImage
//             }
//           })
//         }
//         return [{
//           id: uuidv4(),
//           color: '',
//           image: {},
//           existingImagePath: ''
//         }]
//       })

//       setData((prev: any) => ({
//         ...prev,
//         name: productDetailData?.name || '',
//         originalPrice: productDetailData?.originalPrice || '',
//         discountedPrice: productDetailData?.discountedPrice || '',
//         discountPercentage: productDetailData?.discountPercentage || 0,
//         stockQuantity: productDetailData?.stockQuantity || 0,
//         images: productDetailData?.images?.[0] || '',
//         description: productDetailData?.description || '',
//         video: null
//       }))

//       setColorCount(productDetailData?.images?.length || 2)
//       setAllColorVariant(productDetailData?.images || [])

//       setIsNewArrivalOrBestSelling({
//         isBestSelling: productDetailData?.isBestSelling || false,
//         isNewArrival: productDetailData?.isNewArrivals || false,
//         isWatchAndShop: productDetailData?.isWatchAndShop || false
//       })

//       setIsHotSelling(productDetailData?.isHotSelling || false)
//     }
//   }, [productDetailData, productId])

//   // Map categories from API data
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any, index: number) => {
//       return {
//         id: item.id,
//         label: item.name,
//         value: item.name,
//         subCategory: item.subCategories
//       }
//     })
//     setCategory(mappedCategory)
//   }, [categoryData])

//   // Map subcategories when category changes
//   useEffect(() => {
//     const mappedSubCategory = selectedCategory?.subCategory?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name,
//           nestedSubCategories: item.subCategories || []
//         }
//       }
//     )
//     setSubCategory(mappedSubCategory)
//     // Reset nested subcategory when category changes
//     if (!productId) {
//       setSelectedNestedSubCategory(null)
//     }
//   }, [selectedCategory, productId])

//   // Map nested subcategories when subcategory changes
//   useEffect(() => {
//     const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name
//         }
//       }
//     )
//     setNestedSubCategory(mappedNestedSubCategory)
//   }, [selectedSubCategory])

//   // Load nested subcategories when editing and subcategory is set
//   useEffect(() => {
//     if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
//       const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//         (item: any, index: number) => {
//           return {
//             id: item.id,
//             label: item.name,
//             value: item.name
//           }
//         }
//       )
//       setNestedSubCategory(mappedNestedSubCategory)
//     }
//   }, [selectedSubCategory, productId, productDetailData])

//   const handleImage = (event: any) => {
//     const selectedFiles = Array.from(event.target.files)
//     const myImages = [...image]
//     setImage((prev: any) => [...prev, ...selectedFiles])
//   }

//   const playerRef = useRef(null)
//   const [playing, setPlaying] = useState(false)
//   const [controls, setControls] = useState(true)
//   const [showThumbnail, setShowThumbnail] = useState(true)

//   const handlePlayClick = () => {
//     setPlaying(true)
//   }

//   const handleAction = (imageId: string) => {
//     dispatch(
//       delteProductImageAction({
//         productId: productId as string,
//         imageId: imageId as string,
//         onSuccess: () => {
//           toast.success('Product image deleted')
//           // Refresh product details after deletion
//           if (productId) {
//             dispatch(getProductDetailByIdAction({productId: productId as string}))
//           }
//         }
//       })
//     )
//   }

//   const handleVideo = (event: any) => {
//     const selectedFile = event.target.files?.[0]
//     if (!selectedFile) return
//     if (!selectedFile.size) {
//       toast.error('Selected video file is empty')
//       return
//     }
//     setData((prev: any) => ({...prev, video: selectedFile}))
//   }

//   const handlenewArrival = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
//   }

//   const handleBestSelling = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isBestSelling: item
//     }))
//   }

//   const handleWatchAndShopping = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isWatchAndShop: item
//     }))
//   }

//   const getActiveVariantSlots = () =>
//     colorImage.slice(0, Math.max(1, Number(colorCount) || colorImage.length))

//   const appendColorVariantsToFormData = (
//     formData: FormData,
//     isUpdate: boolean
//   ) => {
//     const slots = getActiveVariantSlots()

//     if (isUpdate) {
//       const variantsMeta = slots.map((item, index) => {
//         const hasNewFile =
//           (item?.image instanceof FileList && item.image.length > 0) ||
//           item?.image instanceof File

//         const existingImage = !hasNewFile
//           ? (typeof item?.image === 'string' && item.image) ||
//             item?.existingImagePath ||
//             null
//           : null

//         return {
//           color: item?.color ?? '',
//           existingImage,
//           hasNewImage: hasNewFile
//         }
//       })

//       formData.append('variantsMeta', JSON.stringify(variantsMeta))
//       formData.append('replaceImages', 'true')

//       slots.forEach((item) => {
//         formData.append('colorName', item?.color ?? '')
//       })

//       slots.forEach((item) => {
//         if (item?.image instanceof FileList && item.image.length > 0) {
//           formData.append('coloredImage', item.image[0])
//         } else if (item?.image instanceof File) {
//           formData.append('coloredImage', item.image)
//         }
//       })
//       return
//     }

//     slots.forEach((item) => {
//       if (item?.color) {
//         formData.append('colorName', item.color)
//       }

//       if (item?.image instanceof FileList && item.image.length > 0) {
//         formData.append('coloredImage', item.image[0])
//       } else if (item?.image instanceof File) {
//         formData.append('coloredImage', item.image)
//       }
//     })
//   }

//   const addProductHandler = (event: any) => {
//     event.preventDefault()
    
//     const formData = new FormData()

//     formData.append('name', data.name)
//     formData.append('category', selectedCategory?.id)
//     formData.append('subCategory', selectedSubCategory?.id)
    
//     if (selectedNestedSubCategory?.id) {
//       formData.append('nestedSubCategory', selectedNestedSubCategory.id)
//     }
    
//     formData.append('originalPrice', data.originalPrice)
//     formData.append('discountedPrice', data.discountedPrice)
//     formData.append('discountPercentage', data.discountPercentage)
//     formData.append('description', data.description)
    
//     if (data.video instanceof File) {
//       formData.append('video', data.video)
//     }
    
//     formData.append('stockQuantity', data.stockQuantity)
//     formData.append('isHotSelling', JSON.stringify(isHotSelling))

//     appendColorVariantsToFormData(formData, !!productId)

//     formData.append(
//       'isBestSelling',
//       JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
//     )

//     formData.append(
//       'isNewArrivals',
//       JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
//     )

//     formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

//     if (productId) {
//       dispatch(
//         updateProductAction({
//           productBody: formData,
//           productId: productId as any,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => console.log('get hit after update')
//               })
//             )
//             navigate('/products')
//             toast.success('Product Updated Successfully')
//             resetForm()
//           }
//         })
//       )
//     } else {
//       dispatch(
//         createProductAction({
//           productBody: formData,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => setData({})
//               })
//             )
//             navigate('/products')
//             toast.success('Product Created Successfully')
//             resetForm()
//           }
//         })
//       )
//     }
//   }

//   const handleColorVariant = async () => {
//     try {
//       const formData = new FormData();

//       for (let index = 0; index < colorImage.length; index++) {
//         const item = colorImage[index];

//         if (item.image instanceof FileList && item.image.length > 0) {
//           formData.append('coloredImage', item.image[0]);
//         } else if (item.image instanceof File) {
//           formData.append('coloredImage', item.image);
//         } else if (typeof item.image === 'string' && item.existingImagePath) {
//           try {
//             const imageUrl = `${FILE_URL}/products/${item.existingImagePath}`;
//             const response = await fetch(imageUrl);
//             if (!response.ok) throw new Error(`Failed to fetch ${imageUrl}`);
//             const blob = await response.blob();
//             const file = new File([blob], item.existingImagePath, { type: blob.type });
//             formData.append('coloredImage', file);
//           } catch (error) {
//             console.error(`Error fetching existing image at index ${index}:`, error);
//             toast.error(`Failed to process existing image #${index + 1}`);
//             return;
//           }
//         } else {
//           console.warn(`No valid image found at index ${index}`, item);
//           continue;
//         }

//         formData.append('colorName', item.color);
//       }

//       dispatch(
//         createProductImageAction({
//           variantBody: formData,
//           onSuccess: () => {
//             toast.success('Product color variant added successfully!');
//             dispatch(getAllProductVariantImagesAction({
//               onSuccess: (data) => {
//                 console.log(data, 'all variant images after adding new one');
//               }
//             }));
//           },
//         })
//       );
//     } catch (error) {
//       console.error('Unexpected error in handleColorVariant:', error);
//       toast.error('Something went wrong while uploading color variants.');
//     }
//   };

//   const [currentlySelectedColor, setCurrentlySelectedColor] = useState<string>('')

//   // Calculate discounted price
//   useEffect(() => {
//     if (data?.originalPrice && data?.discountPercentage) {
//       const discountedPrice = data.originalPrice * data.discountPercentage
//       const finalPrice = discountedPrice / 100
//       const actualDiscountedPrice = data.originalPrice - finalPrice
//       setData((prev) => ({...prev, discountedPrice: actualDiscountedPrice}))
//     }
//   }, [data?.discountPercentage, data?.originalPrice])

//   const media = useMedia();

//   // Show loading state while fetching product details
//   if (productId && productDetailLoading) {
//     return (
//       <div className="addProductContainer">
//         <div className="addProduct" style={{padding: '20px 12px', textAlign: 'center'}}>
//           Loading product details...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="addProductContainer">
//       <div className="addProduct" style={{padding:'20px 12px'}}>
//         <div className="addProduct-input">
//           <Label required labelName="Product Name"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Product Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, name: e.target.value}))
//             }
//             value={data.name}
//           ></InputField>
//         </div>

//         <div style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input">
//             <Label required labelName="Category"></Label>
//             <SelectField
//               options={category}
//               width={media.md ? "320px" : "100%"}
//               value={selectedCategory?.label !== undefined && selectedCategory}
//               onChangeValue={(data) => {
//                 setSelectedCategory(data)
//                 setSelectedSubCategory(null)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select Category'}
//             />
//           </div>

//           <div className="addProduct-input">
//             <Label required labelName="SubCategory"></Label>
//             <SelectField
//               options={subCategory}
//               width={media.md ? "320px" : "100%"}
//               onChangeValue={(data) => {
//                 setSelectedSubCategory(data)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select SubCategory'}
//               value={
//                 selectedSubCategory?.label !== undefined && selectedSubCategory
//               }
//             />
//           </div>
//         </div>

//         {/* Nested SubCategory Dropdown */}
//         {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
//           <div className="addProduct-input">
//             <Label labelName="Nested SubCategory (Optional)"></Label>
//             <SelectField
//               options={nestedSubCategory}
//               width="100%"
//               onChangeValue={(data) => setSelectedNestedSubCategory(data)}
//               placeholder={'Select Nested SubCategory'}
//               value={
//                 selectedNestedSubCategory?.label !== undefined && 
//                 selectedNestedSubCategory
//               }
//             />
//           </div>
//         ) : null}

//         <HStack justify="space-between" gap="$3" style={{flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Original Price"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Original Price"
//               onChange={(e: any) =>
//                 setData((prev: any) => ({
//                   ...prev,
//                   originalPrice: e.target.value
//                 }))
//               }
//               value={data.originalPrice}
//             ></InputField>
//           </div>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Discount Percentage"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Discount Percentage"
//               onChange={(e: any) =>
//                 setData((prev: any) => ({
//                   ...prev,
//                   discountPercentage: Number(e.target.value)
//                 }))
//               }
//               value={data.discountPercentage}
//             ></InputField>
//           </div>
//         </HStack>

//         <div className="addProduct-input">
//           <Label required labelName="Discounted Price"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Discounted Price"
//             onChange={(e: any) =>
//               setData((prev: any) => ({
//                 ...prev,
//                 discountedPrice: e.target.value
//               }))
//             }
//             value={data.discountedPrice}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Stock Quantity"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Stock Quantity"
//             onChange={(e: any) =>
//               setData((prev: any) => ({
//                 ...prev,
//                 stockQuantity: e.target.value
//               }))
//             }
//             value={data.stockQuantity}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="How many color variant"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Color variant number"
//             onChange={(e: any) => setColorCount(e.target.value)}
//             value={colorCount}
//           ></InputField>
//         </div>

//         {colorCount &&
//           Array(Number(colorCount))
//             ?.fill(10)
//             ?.map((item: any, index: number) => {
//               return (
//                 <div
//                   style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row', marginBottom: '20px'}}
//                   key={colorImage[index]?.id || index}
//                 >
//                   <div style={{minWidth: media.md ? '300px' : '100%'}}>
//                     <ImageUploader
//                       key={index}
//                       uniqueKeys={index}
//                       defaultImage={
//                         productId && !!productDetailData && productDetailData?.images?.[index]
//                           ? [productDetailData?.images[index]]
//                           : ''
//                       }
//                       onImageChange={(event) => {
//                         setColorImage((prev) => {
//                           const existingList = [...prev]
//                           const currentObject = existingList[index] || {
//                             id: String(index),
//                             color: '',
//                             image: {},
//                             existingImagePath: ''
//                           }

//                           existingList[index] = {
//                             ...currentObject,
//                             image: event.target.files,
//                             id: currentObject.id || uuidv4()
//                           }

//                           return existingList
//                         })
//                       }}
//                       value={colorImage[index]?.image ?? ''}
//                       actionHandler={handleAction}
//                     />
//                   </div>

//                   <div>
//                     <input
//                       type="color"
//                       style={{width: '200px', height: '200px'}}
//                       onChange={(e: any) => {
//                         setColorImage((prev) => {
//                           const existingList = [...prev]
//                           const currentObject = existingList[index] || {
//                             id: String(index),
//                             color: '',
//                             image: '',
//                             existingImagePath: ''
//                           }
//                           existingList[index] = {
//                             ...currentObject,
//                             color: e.target.value
//                           }

//                           return existingList
//                         })
//                       }}
//                       value={colorImage[index]?.color || ''}
//                     />
//                   </div>
//                 </div>
//               )
//             })}

//         <div className="addProduct-input">
//           <Label required labelName="Product Detail"></Label>
//           <TextEditor
//             descriptionBody={data.description}
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, description: e}))
//             }
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Product Video"></Label>
//           <VideoUploader
//             defaultVideo={
//               productId && productDetailData?.video
//                 ? resolveProductVideoUrl(productDetailData.video)
//                 : ''
//             }
//             onVideoChange={handleVideo}
//             actionHandler={(video: File) => {
//               if (!video?.size) {
//                 toast.error('Selected video file is empty')
//                 return
//               }
//               setData((prev: any) => ({...prev, video}))
//             }}
//           />
//         </div>

//         <div
//           className="addProduct-input"
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             columnGap: '20%',
//             flexDirection: !media.md ? 'column' : 'row',
//             margin: '14px',
//             rowGap: '16px'
//           }}
//         >
//           <VStack gap="$3">
//             <Label required labelName="Is New Arrival"></Label>
//             <CheckBox
//               value="newArrival"
//               label="New Arrival"
//               name="newArrival"
//               check={isNewArrivalOrBestSelling.isNewArrival}
//               handleCheckboxChange={handlenewArrival}
//             />
//           </VStack>
//           <VStack gap="$3">
//             <Label required labelName="Is Best Selling?"></Label>
//             <CheckBox
//               value="best selling"
//               label="Best Selling"
//               name="bestselling"
//               check={isNewArrivalOrBestSelling.isBestSelling}
//               handleCheckboxChange={handleBestSelling}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label required labelName="Is Watch And Shopping?"></Label>
//             <CheckBox
//               value="isWatchAndShop"
//               label="Watch And Shop"
//               name="isWatchAndShop"
//               check={isNewArrivalOrBestSelling.isWatchAndShop}
//               handleCheckboxChange={handleWatchAndShopping}
//             />
//           </VStack>
//         </div>

//         <Button
//           title={productId ? 'Update Product' : 'Add Product'}
//           onClick={addProductHandler}
//           loading={productId ? updateProductLoading : createProductLoading}
//           style={{width: '100%', marginTop: '20px'}}
//         />
//       </div>
//     </div>
//   )
// }

// import React, {useCallback, useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from 'src/store'
// import {useMedia, useParams} from 'src/hooks'
// import {
//   Button,
//   CheckBox,
//   HStack,
//   InputField,
//   Label,
//   SelectField,
//   TextEditor,
//   VStack
// } from 'src/app/common'
// import {
//   getCategoryListAction,
//   getSubCategoryAction
// } from '../../category/category.slice'
// import {
//   createProductAction,
//   createProductImageAction,
//   delteProductImageAction,
//   getAllProductVariantImagesAction,
//   getProductDetailByIdAction,
//   getProductListAction,
//   updateProductAction,
//   resetProductDetail
// } from '../product.slice'
// import {useNavigate} from 'react-router-dom'
// import {toast} from 'react-hot-toast'
// import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
// import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
// import {v4 as uuidv4} from 'uuid'
// import {FILE_URL} from 'src/config'
// import {resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'

// export const AddProductPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const productId = useParams('productId')
//   const hydratedProductIdRef = useRef<string | null>(null)

//   // Reset form function
//   const resetForm = useCallback(() => {
//     setData({
//       name: '',
//       originalPrice: '',
//       discountedPrice: '',
//       discountPercentage: '',
//       category: '',
//       subCategory: '',
//       nestedSubCategory: '',
//       images: [],
//       video: null,
//       description: '',
//       stockQuantity: ''
//     })
    
//     setImage([])
//     setColorCount(2)
//     setColorImage([{
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }])
//     setAllColorVariant([])
//     setSelectedCategory(null)
//     setSelectedSubCategory(null)
//     setSelectedNestedSubCategory(null)
//     setIsNewArrivalOrBestSelling({
//       isNewArrival: false,
//       isBestSelling: false,
//       isWatchAndShop: false
//     })
//     setIsHotSelling(false)
//     setProductVariantIdList([''])
//     hydratedProductIdRef.current = null
//   }, [])

//   const [image, setImage] = useState<any>([])
//   const [colorCount, setColorCount] = useState(2)
//   const [colorImage, setColorImage] = useState([
//     {
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }
//   ])

//   const [allColorVariant, setAllColorVariant] = useState([])

//   const [data, setData] = useState<any>({
//     name: '',
//     originalPrice: '',
//     discountedPrice: '',
//     discountPercentage: '',
//     category: '',
//     subCategory: '',
//     nestedSubCategory: '', 
//     images: [],
//     video: null,
//     description: '',
//     stockQuantity: ''
//   })

//   const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
//     isNewArrival: false,
//     isBestSelling: false,
//     isWatchAndShop: false
//   })

//   const [isHotSelling, setIsHotSelling] = useState(false)

//   // Category, SubCategory, and NestedSubCategory states
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
//   const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
//   const [category, setCategory] = useState<any>()
//   const [subCategory, setSubCategory] = useState<any>()
//   const [nestedSubCategory, setNestedSubCategory] = useState<any>()

//   const {
//     categoryData,
//     getCategoryLoading,
//     subCategoryData,
//     getSubCategoryLoading
//   }: any = useSelector((state: any) => state.category)

//   const {createProductLoading, updateProductLoading, productVariantList, productDetailData, productDetailLoading}: any =
//     useSelector((state: any) => state.product)
  
//   const [productVariantIdList, setProductVariantIdList] = useState([''])

//   // Calculate discounted price from original price and discount percentage
//   const calculateDiscountedPrice = useCallback((originalPrice: number, discountPercentage: number) => {
//     if (originalPrice && discountPercentage && discountPercentage > 0) {
//       const discountAmount = (originalPrice * discountPercentage) / 100
//       const finalPrice = originalPrice - discountAmount
//       return Math.round(finalPrice * 100) / 100 // Round to 2 decimal places
//     }
//     return ''
//   }, [])

//   // Calculate discount percentage from original price and discounted price
//   const calculateDiscountPercentage = useCallback((originalPrice: number, discountedPrice: number) => {
//     if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
//       const discountAmount = originalPrice - discountedPrice
//       const percentage = (discountAmount / originalPrice) * 100
//       return Math.round(percentage * 100) / 100 // Round to 2 decimal places
//     }
//     return ''
//   }, [])

//   // Handle price changes
//   const handlePriceChange = useCallback((field: string, value: string) => {
//     const numValue = value === '' ? '' : Number(value)
    
//     if (field === 'originalPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, originalPrice: numValue }
        
//         // If discount percentage exists, calculate discounted price
//         if (prev.discountPercentage && prev.discountPercentage !== '') {
//           const discounted = calculateDiscountedPrice(numValue, Number(prev.discountPercentage))
//           newData.discountedPrice = discounted
//         }
//         // If discounted price exists, calculate discount percentage
//         else if (prev.discountedPrice && prev.discountedPrice !== '') {
//           const percentage = calculateDiscountPercentage(numValue, Number(prev.discountedPrice))
//           newData.discountPercentage = percentage
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountPercentage') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountPercentage: numValue === '' ? '' : numValue }
        
//         // Calculate discounted price if original price exists
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const discounted = calculateDiscountedPrice(Number(prev.originalPrice), numValue)
//           newData.discountedPrice = discounted
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountedPrice = ''
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountedPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountedPrice: numValue === '' ? '' : numValue }
        
//         // Calculate discount percentage if original price exists
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const percentage = calculateDiscountPercentage(Number(prev.originalPrice), numValue)
//           newData.discountPercentage = percentage
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountPercentage = ''
//         }
        
//         return newData
//       })
//     }
//   }, [calculateDiscountedPrice, calculateDiscountPercentage])

//   // Reset form when component mounts or productId changes (for new product)
//   useEffect(() => {
//     if (!productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//     }
    
//     // Cleanup on unmount
//     return () => {
//       if (!productId) {
//         dispatch(resetProductDetail())
//       }
//     }
//   }, [productId, resetForm, dispatch])

//   // Fetch product detail when productId exists
//   useEffect(() => {
//     if (productId) {
//       // Reset form and clear previous data before loading new product
//       resetForm()
//       dispatch(resetProductDetail())
//       hydratedProductIdRef.current = null
      
//       dispatch(getProductDetailByIdAction({productId: productId as string}))
//     }
//   }, [productId, dispatch, resetForm])

//   useEffect(() => {
//     console.log(productVariantList, 'product variant list')
//     setProductVariantIdList(
//       productVariantList?.map((item: any, index: number) => {
//         return item._id
//       })
//     )
//   }, [productVariantList])

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryList fetch Successfully')
//       })
//     )
//   }, [dispatch])

//   // Load product detail data when editing (only once per product)
//   useEffect(() => {
//     if (
//       productId &&
//       productDetailData &&
//       hydratedProductIdRef.current !== productId &&
//       Object.keys(productDetailData).length > 0
//     ) {
//       hydratedProductIdRef.current = productId as string
      
//       setSelectedCategory({
//         id: productDetailData?.category?.id,
//         label: productDetailData?.category?.name,
//         value: productDetailData?.category?.value
//       })
      
//       setSelectedSubCategory({
//         id: productDetailData?.subCategory?.id,
//         label: productDetailData?.subCategory?.name,
//         value: productDetailData?.subCategory?.value
//       })

//       // Load nested subcategory if it exists
//       if (productDetailData?.nestedSubCategory) {
//         setSelectedNestedSubCategory({
//           id: productDetailData?.nestedSubCategory?.id,
//           label: productDetailData?.nestedSubCategory?.name,
//           value: productDetailData?.nestedSubCategory?.value
//         })
//       }

//       setProductVariantIdList(
//         productDetailData?.images?.map((item: any, index: number) => {
//           return String(index)
//         })
//       )

//       setColorImage(() => {
//         if (productDetailData?.images && productDetailData.images.length > 0) {
//           return productDetailData?.images?.map((item: any, index: number) => {
//             return {
//               id: String(index),
//               color: item.colorName,
//               image: item.coloredImage,
//               existingImagePath: item.coloredImage
//             }
//           })
//         }
//         return [{
//           id: uuidv4(),
//           color: '',
//           image: {},
//           existingImagePath: ''
//         }]
//       })

//       setData((prev: any) => ({
//         ...prev,
//         name: productDetailData?.name || '',
//         originalPrice: productDetailData?.originalPrice || '',
//         discountedPrice: productDetailData?.discountedPrice || '',
//         discountPercentage: productDetailData?.discountPercentage || '',
//         stockQuantity: productDetailData?.stockQuantity || '',
//         images: productDetailData?.images?.[0] || '',
//         description: productDetailData?.description || '',
//         video: null
//       }))

//       setColorCount(productDetailData?.images?.length || 2)
//       setAllColorVariant(productDetailData?.images || [])

//       setIsNewArrivalOrBestSelling({
//         isBestSelling: productDetailData?.isBestSelling || false,
//         isNewArrival: productDetailData?.isNewArrivals || false,
//         isWatchAndShop: productDetailData?.isWatchAndShop || false
//       })

//       setIsHotSelling(productDetailData?.isHotSelling || false)
//     }
//   }, [productDetailData, productId])

//   // Map categories from API data
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any, index: number) => {
//       return {
//         id: item.id,
//         label: item.name,
//         value: item.name,
//         subCategory: item.subCategories
//       }
//     })
//     setCategory(mappedCategory)
//   }, [categoryData])

//   // Map subcategories when category changes
//   useEffect(() => {
//     const mappedSubCategory = selectedCategory?.subCategory?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name,
//           nestedSubCategories: item.subCategories || []
//         }
//       }
//     )
//     setSubCategory(mappedSubCategory)
//     // Reset nested subcategory when category changes
//     if (!productId) {
//       setSelectedNestedSubCategory(null)
//     }
//   }, [selectedCategory, productId])

//   // Map nested subcategories when subcategory changes
//   useEffect(() => {
//     const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name
//         }
//       }
//     )
//     setNestedSubCategory(mappedNestedSubCategory)
//   }, [selectedSubCategory])

//   // Load nested subcategories when editing and subcategory is set
//   useEffect(() => {
//     if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
//       const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//         (item: any, index: number) => {
//           return {
//             id: item.id,
//             label: item.name,
//             value: item.name
//           }
//         }
//       )
//       setNestedSubCategory(mappedNestedSubCategory)
//     }
//   }, [selectedSubCategory, productId, productDetailData])

//   const handleImage = (event: any) => {
//     const selectedFiles = Array.from(event.target.files)
//     const myImages = [...image]
//     setImage((prev: any) => [...prev, ...selectedFiles])
//   }

//   const playerRef = useRef(null)
//   const [playing, setPlaying] = useState(false)
//   const [controls, setControls] = useState(true)
//   const [showThumbnail, setShowThumbnail] = useState(true)

//   const handlePlayClick = () => {
//     setPlaying(true)
//   }

//   const handleAction = (imageId: string) => {
//     dispatch(
//       delteProductImageAction({
//         productId: productId as string,
//         imageId: imageId as string,
//         onSuccess: () => {
//           toast.success('Product image deleted')
//           // Refresh product details after deletion
//           if (productId) {
//             dispatch(getProductDetailByIdAction({productId: productId as string}))
//           }
//         }
//       })
//     )
//   }

//   const handleVideo = (event: any) => {
//     const selectedFile = event.target.files?.[0]
//     if (!selectedFile) return
//     if (!selectedFile.size) {
//       toast.error('Selected video file is empty')
//       return
//     }
//     setData((prev: any) => ({...prev, video: selectedFile}))
//   }

//   const handlenewArrival = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
//   }

//   const handleBestSelling = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isBestSelling: item
//     }))
//   }

//   const handleWatchAndShopping = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isWatchAndShop: item
//     }))
//   }

//   const getActiveVariantSlots = () =>
//     colorImage.slice(0, Math.max(1, Number(colorCount) || colorImage.length))

//   const appendColorVariantsToFormData = (
//     formData: FormData,
//     isUpdate: boolean
//   ) => {
//     const slots = getActiveVariantSlots()

//     if (isUpdate) {
//       const variantsMeta = slots.map((item, index) => {
//         const hasNewFile =
//           (item?.image instanceof FileList && item.image.length > 0) ||
//           item?.image instanceof File

//         const existingImage = !hasNewFile
//           ? (typeof item?.image === 'string' && item.image) ||
//             item?.existingImagePath ||
//             null
//           : null

//         return {
//           color: item?.color ?? '',
//           existingImage,
//           hasNewImage: hasNewFile
//         }
//       })

//       formData.append('variantsMeta', JSON.stringify(variantsMeta))
//       formData.append('replaceImages', 'true')

//       slots.forEach((item) => {
//         formData.append('colorName', item?.color ?? '')
//       })

//       slots.forEach((item) => {
//         if (item?.image instanceof FileList && item.image.length > 0) {
//           formData.append('coloredImage', item.image[0])
//         } else if (item?.image instanceof File) {
//           formData.append('coloredImage', item.image)
//         }
//       })
//       return
//     }

//     slots.forEach((item) => {
//       if (item?.color) {
//         formData.append('colorName', item.color)
//       }

//       if (item?.image instanceof FileList && item.image.length > 0) {
//         formData.append('coloredImage', item.image[0])
//       } else if (item?.image instanceof File) {
//         formData.append('coloredImage', item.image)
//       }
//     })
//   }

//   // Validate stock quantity
//   const validateStockQuantity = (value: string) => {
//     const numValue = Number(value)
//     if (value === '') return true
//     if (isNaN(numValue)) return false
//     if (numValue < 0) return false
//     if (!Number.isInteger(numValue)) return false
//     return true
//   }

//   const addProductHandler = (event: any) => {
//     event.preventDefault()
    
//     // Validation checks
//     if (!data.name || data.name.trim() === '') {
//       toast.error('Please enter product name')
//       return
//     }
    
//     if (!selectedCategory?.id) {
//       toast.error('Please select a category')
//       return
//     }
    
//     if (!selectedSubCategory?.id) {
//       toast.error('Please select a subcategory')
//       return
//     }
    
//     if (!data.originalPrice || Number(data.originalPrice) <= 0) {
//       toast.error('Please enter a valid original price')
//       return
//     }
    
//     if (!data.stockQuantity || data.stockQuantity === '') {
//       toast.error('Please enter stock quantity')
//       return
//     }
    
//     if (!validateStockQuantity(data.stockQuantity)) {
//       toast.error('Stock quantity must be a positive whole number')
//       return
//     }
    
//     if (Number(data.stockQuantity) < 0) {
//       toast.error('Stock quantity cannot be negative')
//       return
//     }
    
//     const formData = new FormData()

//     formData.append('name', data.name)
//     formData.append('category', selectedCategory?.id)
//     formData.append('subCategory', selectedSubCategory?.id)
    
//     if (selectedNestedSubCategory?.id) {
//       formData.append('nestedSubCategory', selectedNestedSubCategory.id)
//     }
    
//     formData.append('originalPrice', String(data.originalPrice))
//     formData.append('discountedPrice', String(data.discountedPrice || 0))
//     formData.append('discountPercentage', String(data.discountPercentage || 0))
//     formData.append('description', data.description || '')
    
//     if (data.video instanceof File) {
//       formData.append('video', data.video)
//     }
    
//     formData.append('stockQuantity', String(data.stockQuantity))
//     formData.append('isHotSelling', JSON.stringify(isHotSelling))

//     appendColorVariantsToFormData(formData, !!productId)

//     formData.append(
//       'isBestSelling',
//       JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
//     )

//     formData.append(
//       'isNewArrivals',
//       JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
//     )

//     formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

//     if (productId) {
//       dispatch(
//         updateProductAction({
//           productBody: formData,
//           productId: productId as any,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => console.log('get hit after update')
//               })
//             )
//             navigate('/products')
//             toast.success('Product Updated Successfully')
//             resetForm()
//           }
//         })
//       )
//     } else {
//       dispatch(
//         createProductAction({
//           productBody: formData,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => setData({})
//               })
//             )
//             navigate('/products')
//             toast.success('Product Created Successfully')
//             resetForm()
//           }
//         })
//       )
//     }
//   }

//   const handleColorVariant = async () => {
//     try {
//       const formData = new FormData();

//       for (let index = 0; index < colorImage.length; index++) {
//         const item = colorImage[index];

//         if (item.image instanceof FileList && item.image.length > 0) {
//           formData.append('coloredImage', item.image[0]);
//         } else if (item.image instanceof File) {
//           formData.append('coloredImage', item.image);
//         } else if (typeof item.image === 'string' && item.existingImagePath) {
//           try {
//             const imageUrl = `${FILE_URL}/products/${item.existingImagePath}`;
//             const response = await fetch(imageUrl);
//             if (!response.ok) throw new Error(`Failed to fetch ${imageUrl}`);
//             const blob = await response.blob();
//             const file = new File([blob], item.existingImagePath, { type: blob.type });
//             formData.append('coloredImage', file);
//           } catch (error) {
//             console.error(`Error fetching existing image at index ${index}:`, error);
//             toast.error(`Failed to process existing image #${index + 1}`);
//             return;
//           }
//         } else {
//           console.warn(`No valid image found at index ${index}`, item);
//           continue;
//         }

//         formData.append('colorName', item.color);
//       }

//       dispatch(
//         createProductImageAction({
//           variantBody: formData,
//           onSuccess: () => {
//             toast.success('Product color variant added successfully!');
//             dispatch(getAllProductVariantImagesAction({
//               onSuccess: (data) => {
//                 console.log(data, 'all variant images after adding new one');
//               }
//             }));
//           },
//         })
//       );
//     } catch (error) {
//       console.error('Unexpected error in handleColorVariant:', error);
//       toast.error('Something went wrong while uploading color variants.');
//     }
//   };

//   const [currentlySelectedColor, setCurrentlySelectedColor] = useState<string>('')

//   const media = useMedia();

//   // Show loading state while fetching product details
//   if (productId && productDetailLoading) {
//     return (
//       <div className="addProductContainer">
//         <div className="addProduct" style={{padding: '20px 12px', textAlign: 'center'}}>
//           Loading product details...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="addProductContainer">
//       <div className="addProduct" style={{padding:'20px 12px'}}>
//         <div className="addProduct-input">
//           <Label required labelName="Product Name"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Product Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, name: e.target.value}))
//             }
//             value={data.name}
//           ></InputField>
//         </div>

//         <div style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input">
//             <Label required labelName="Category"></Label>
//             <SelectField
//               options={category}
//               width={media.md ? "320px" : "100%"}
//               value={selectedCategory?.label !== undefined && selectedCategory}
//               onChangeValue={(data) => {
//                 setSelectedCategory(data)
//                 setSelectedSubCategory(null)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select Category'}
//             />
//           </div>

//           <div className="addProduct-input">
//             <Label required labelName="SubCategory"></Label>
//             <SelectField
//               options={subCategory}
//               width={media.md ? "320px" : "100%"}
//               onChangeValue={(data) => {
//                 setSelectedSubCategory(data)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select SubCategory'}
//               value={
//                 selectedSubCategory?.label !== undefined && selectedSubCategory
//               }
//             />
//           </div>
//         </div>

//         {/* Nested SubCategory Dropdown */}
//         {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
//           <div className="addProduct-input">
//             <Label labelName="Nested SubCategory (Optional)"></Label>
//             <SelectField
//               options={nestedSubCategory}
//               width="100%"
//               onChangeValue={(data) => setSelectedNestedSubCategory(data)}
//               placeholder={'Select Nested SubCategory'}
//               value={
//                 selectedNestedSubCategory?.label !== undefined && 
//                 selectedNestedSubCategory
//               }
//             />
//           </div>
//         ) : null}

//         <HStack justify="space-between" gap="$3" style={{flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Original Price"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Original Price"
//               onChange={(e: any) => handlePriceChange('originalPrice', e.target.value)}
//               value={data.originalPrice}
//             ></InputField>
//           </div>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Discount Percentage (%)"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Discount Percentage"
//               onChange={(e: any) => handlePriceChange('discountPercentage', e.target.value)}
//               value={data.discountPercentage}
//             ></InputField>
//           </div>
//         </HStack>

//         <div className="addProduct-input">
//           <Label required labelName="Discounted Price"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Discounted Price"
//             onChange={(e: any) => handlePriceChange('discountedPrice', e.target.value)}
//             value={data.discountedPrice}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Stock Quantity"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Stock Quantity (must be a whole number)"
//             onChange={(e: any) => {
//               const value = e.target.value
//               if (validateStockQuantity(value) || value === '') {
//                 setData((prev: any) => ({
//                   ...prev,
//                   stockQuantity: value === '' ? '' : Number(value)
//                 }))
//               } else {
//                 toast.error('Stock quantity must be a positive whole number')
//               }
//             }}
//             value={data.stockQuantity}
//           ></InputField>
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="How many color variant"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Color variant number"
//             onChange={(e: any) => setColorCount(e.target.value)}
//             value={colorCount}
//           ></InputField>
//         </div>

//         {colorCount &&
//           Array(Number(colorCount))
//             ?.fill(10)
//             ?.map((item: any, index: number) => {
//               return (
//                 <div
//                   style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row', marginBottom: '20px'}}
//                   key={colorImage[index]?.id || index}
//                 >
//                   <div style={{minWidth: media.md ? '300px' : '100%'}}>
//                     <ImageUploader
//                       key={index}
//                       uniqueKeys={index}
//                       defaultImage={
//                         productId && !!productDetailData && productDetailData?.images?.[index]
//                           ? [productDetailData?.images[index]]
//                           : ''
//                       }
//                       onImageChange={(event) => {
//                         setColorImage((prev) => {
//                           const existingList = [...prev]
//                           const currentObject = existingList[index] || {
//                             id: String(index),
//                             color: '',
//                             image: {},
//                             existingImagePath: ''
//                           }

//                           existingList[index] = {
//                             ...currentObject,
//                             image: event.target.files,
//                             id: currentObject.id || uuidv4()
//                           }

//                           return existingList
//                         })
//                       }}
//                       value={colorImage[index]?.image ?? ''}
//                       actionHandler={handleAction}
//                     />
//                   </div>

//                   <div>
//                     <input
//                       type="color"
//                       style={{width: '200px', height: '200px'}}
//                       onChange={(e: any) => {
//                         setColorImage((prev) => {
//                           const existingList = [...prev]
//                           const currentObject = existingList[index] || {
//                             id: String(index),
//                             color: '',
//                             image: '',
//                             existingImagePath: ''
//                           }
//                           existingList[index] = {
//                             ...currentObject,
//                             color: e.target.value
//                           }

//                           return existingList
//                         })
//                       }}
//                       value={colorImage[index]?.color || ''}
//                     />
//                   </div>
//                 </div>
//               )
//             })}

//         <div className="addProduct-input">
//           <Label required labelName="Product Detail"></Label>
//           <TextEditor
//             descriptionBody={data.description}
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, description: e}))
//             }
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Product Video"></Label>
//           <VideoUploader
//             defaultVideo={
//               productId && productDetailData?.video
//                 ? resolveProductVideoUrl(productDetailData.video)
//                 : ''
//             }
//             onVideoChange={handleVideo}
//             actionHandler={(video: File) => {
//               if (!video?.size) {
//                 toast.error('Selected video file is empty')
//                 return
//               }
//               setData((prev: any) => ({...prev, video}))
//             }}
//           />
//         </div>

//         <div
//           className="addProduct-input"
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             columnGap: '20%',
//             flexDirection: !media.md ? 'column' : 'row',
//             margin: '14px',
//             rowGap: '16px'
//           }}
//         >
//           <VStack gap="$3">
//             <Label required labelName="Is New Arrival"></Label>
//             <CheckBox
//               value="newArrival"
//               label="New Arrival"
//               name="newArrival"
//               check={isNewArrivalOrBestSelling.isNewArrival}
//               handleCheckboxChange={handlenewArrival}
//             />
//           </VStack>
//           <VStack gap="$3">
//             <Label required labelName="Is Best Selling?"></Label>
//             <CheckBox
//               value="best selling"
//               label="Best Selling"
//               name="bestselling"
//               check={isNewArrivalOrBestSelling.isBestSelling}
//               handleCheckboxChange={handleBestSelling}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label required labelName="Is Watch And Shopping?"></Label>
//             <CheckBox
//               value="isWatchAndShop"
//               label="Watch And Shop"
//               name="isWatchAndShop"
//               check={isNewArrivalOrBestSelling.isWatchAndShop}
//               handleCheckboxChange={handleWatchAndShopping}
//             />
//           </VStack>
//         </div>

//         <Button
//           title={productId ? 'Update Product' : 'Add Product'}
//           onClick={addProductHandler}
//           loading={productId ? updateProductLoading : createProductLoading}
//           style={{width: '100%', marginTop: '20px'}}
//         />
//       </div>
//     </div>
//   )
// }


// import React, {useCallback, useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from 'src/store'
// import {useMedia, useParams} from 'src/hooks'
// import {
//   Button,
//   CheckBox,
//   HStack,
//   InputField,
//   Label,
//   SelectField,
//   TextEditor,
//   VStack
// } from 'src/app/common'
// import {
//   getCategoryListAction,
//   getSubCategoryAction
// } from '../../category/category.slice'
// import {
//   createProductAction,
//   createProductImageAction,
//   delteProductImageAction,
//   getAllProductVariantImagesAction,
//   getProductDetailByIdAction,
//   getProductListAction,
//   updateProductAction,
//   resetProductDetail
// } from '../product.slice'
// import {useNavigate} from 'react-router-dom'
// import {toast} from 'react-hot-toast'
// import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
// import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
// import {v4 as uuidv4} from 'uuid'
// import {FILE_URL} from 'src/config'
// import {resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'
// import { Trash2, X } from 'lucide-react'

// export const AddProductPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const productId = useParams('productId')
//   const hydratedProductIdRef = useRef<string | null>(null)

//   // Reset form function
//   const resetForm = useCallback(() => {
//     setData({
//       name: '',
//       originalPrice: '',
//       discountedPrice: '',
//       discountPercentage: '',
//       category: '',
//       subCategory: '',
//       nestedSubCategory: '',
//       images: [],
//       video: null,
//       description: '',
//       stockQuantity: ''
//     })
    
//     setImage([])
//     setColorCount(2)
//     setColorImage([{
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }])
//     setAllColorVariant([])
//     setSelectedCategory(null)
//     setSelectedSubCategory(null)
//     setSelectedNestedSubCategory(null)
//     setIsNewArrivalOrBestSelling({
//       isNewArrival: false,
//       isBestSelling: false,
//       isWatchAndShop: false
//     })
//     setIsHotSelling(false)
//     setProductVariantIdList([''])
//     setVideoFile(null)
//     setExistingVideoUrl('')
//     hydratedProductIdRef.current = null
//   }, [])

//   const [image, setImage] = useState<any>([])
//   const [colorCount, setColorCount] = useState(2)
//   const [colorImage, setColorImage] = useState([
//     {
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }
//   ])

//   const [allColorVariant, setAllColorVariant] = useState([])

//   const [data, setData] = useState<any>({
//     name: '',
//     originalPrice: '',
//     discountedPrice: '',
//     discountPercentage: '',
//     category: '',
//     subCategory: '',
//     nestedSubCategory: '', 
//     images: [],
//     video: null,
//     description: '',
//     stockQuantity: ''
//   })

//   const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
//     isNewArrival: false,
//     isBestSelling: false,
//     isWatchAndShop: false
//   })

//   const [isHotSelling, setIsHotSelling] = useState(false)

//   // Category, SubCategory, and NestedSubCategory states
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
//   const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
//   const [category, setCategory] = useState<any>()
//   const [subCategory, setSubCategory] = useState<any>()
//   const [nestedSubCategory, setNestedSubCategory] = useState<any>()

//   // Video states
//   const [videoFile, setVideoFile] = useState<File | null>(null)
//   const [existingVideoUrl, setExistingVideoUrl] = useState<string>('')

//   const {
//     categoryData,
//     getCategoryLoading,
//     subCategoryData,
//     getSubCategoryLoading
//   }: any = useSelector((state: any) => state.category)

//   const {createProductLoading, updateProductLoading, productVariantList, productDetailData, productDetailLoading}: any =
//     useSelector((state: any) => state.product)
  
//   const [productVariantIdList, setProductVariantIdList] = useState([''])

//   // Calculate discounted price from original price and discount percentage
//   const calculateDiscountedPrice = useCallback((originalPrice: number, discountPercentage: number) => {
//     if (originalPrice && discountPercentage && discountPercentage > 0) {
//       const discountAmount = (originalPrice * discountPercentage) / 100
//       const finalPrice = originalPrice - discountAmount
//       return Math.round(finalPrice * 100) / 100
//     }
//     return ''
//   }, [])

//   // Calculate discount percentage from original price and discounted price
//   const calculateDiscountPercentage = useCallback((originalPrice: number, discountedPrice: number) => {
//     if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
//       const discountAmount = originalPrice - discountedPrice
//       const percentage = (discountAmount / originalPrice) * 100
//       return Math.round(percentage * 100) / 100
//     }
//     return ''
//   }, [])

//   // Handle price changes
//   const handlePriceChange = useCallback((field: string, value: string) => {
//     const numValue = value === '' ? '' : Number(value)
    
//     if (field === 'originalPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, originalPrice: numValue }
        
//         if (prev.discountPercentage && prev.discountPercentage !== '') {
//           const discounted = calculateDiscountedPrice(numValue, Number(prev.discountPercentage))
//           newData.discountedPrice = discounted
//         }
//         else if (prev.discountedPrice && prev.discountedPrice !== '') {
//           const percentage = calculateDiscountPercentage(numValue, Number(prev.discountedPrice))
//           newData.discountPercentage = percentage
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountPercentage') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountPercentage: numValue === '' ? '' : numValue }
        
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const discounted = calculateDiscountedPrice(Number(prev.originalPrice), numValue)
//           newData.discountedPrice = discounted
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountedPrice = ''
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountedPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountedPrice: numValue === '' ? '' : numValue }
        
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const percentage = calculateDiscountPercentage(Number(prev.originalPrice), numValue)
//           newData.discountPercentage = percentage
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountPercentage = ''
//         }
        
//         return newData
//       })
//     }
//   }, [calculateDiscountedPrice, calculateDiscountPercentage])

//   // Reset form when component mounts or productId changes
//   useEffect(() => {
//     if (!productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//     }
    
//     return () => {
//       if (!productId) {
//         dispatch(resetProductDetail())
//       }
//     }
//   }, [productId, resetForm, dispatch])

//   // Fetch product detail when productId exists
//   useEffect(() => {
//     if (productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//       hydratedProductIdRef.current = null
//       dispatch(getProductDetailByIdAction({productId: productId as string}))
//     }
//   }, [productId, dispatch, resetForm])

//   useEffect(() => {
//     setProductVariantIdList(
//       productVariantList?.map((item: any, index: number) => {
//         return item._id
//       })
//     )
//   }, [productVariantList])

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryList fetch Successfully')
//       })
//     )
//   }, [dispatch])

//   // Load product detail data when editing
//   useEffect(() => {
//     if (
//       productId &&
//       productDetailData &&
//       hydratedProductIdRef.current !== productId &&
//       Object.keys(productDetailData).length > 0
//     ) {
//       hydratedProductIdRef.current = productId as string
      
//       setSelectedCategory({
//         id: productDetailData?.category?.id,
//         label: productDetailData?.category?.name,
//         value: productDetailData?.category?.value
//       })
      
//       setSelectedSubCategory({
//         id: productDetailData?.subCategory?.id,
//         label: productDetailData?.subCategory?.name,
//         value: productDetailData?.subCategory?.value
//       })

//       if (productDetailData?.nestedSubCategory) {
//         setSelectedNestedSubCategory({
//           id: productDetailData?.nestedSubCategory?.id,
//           label: productDetailData?.nestedSubCategory?.name,
//           value: productDetailData?.nestedSubCategory?.value
//         })
//       }

//       setProductVariantIdList(
//         productDetailData?.images?.map((item: any, index: number) => {
//           return String(index)
//         })
//       )

//       setColorImage(() => {
//         if (productDetailData?.images && productDetailData.images.length > 0) {
//           return productDetailData?.images?.map((item: any, index: number) => {
//             return {
//               id: String(index),
//               color: item.colorName,
//               image: item.coloredImage,
//               existingImagePath: item.coloredImage
//             }
//           })
//         }
//         return [{
//           id: uuidv4(),
//           color: '',
//           image: {},
//           existingImagePath: ''
//         }]
//       })

//       // Set video URL if exists
//       if (productDetailData?.video) {
//         setExistingVideoUrl(resolveProductVideoUrl(productDetailData.video))
//         setVideoFile(null)
//       }

//       setData((prev: any) => ({
//         ...prev,
//         name: productDetailData?.name || '',
//         originalPrice: productDetailData?.originalPrice || '',
//         discountedPrice: productDetailData?.discountedPrice || '',
//         discountPercentage: productDetailData?.discountPercentage || '',
//         stockQuantity: productDetailData?.stockQuantity || '',
//         images: productDetailData?.images?.[0] || '',
//         description: productDetailData?.description || '',
//         video: null
//       }))

//       setColorCount(productDetailData?.images?.length || 2)
//       setAllColorVariant(productDetailData?.images || [])

//       setIsNewArrivalOrBestSelling({
//         isBestSelling: productDetailData?.isBestSelling || false,
//         isNewArrival: productDetailData?.isNewArrivals || false,
//         isWatchAndShop: productDetailData?.isWatchAndShop || false
//       })

//       setIsHotSelling(productDetailData?.isHotSelling || false)
//     }
//   }, [productDetailData, productId])

//   // Map categories from API data
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any, index: number) => {
//       return {
//         id: item.id,
//         label: item.name,
//         value: item.name,
//         subCategory: item.subCategories
//       }
//     })
//     setCategory(mappedCategory)
//   }, [categoryData])

//   // Map subcategories when category changes
//   useEffect(() => {
//     const mappedSubCategory = selectedCategory?.subCategory?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name,
//           nestedSubCategories: item.subCategories || []
//         }
//       }
//     )
//     setSubCategory(mappedSubCategory)
//     if (!productId) {
//       setSelectedNestedSubCategory(null)
//     }
//   }, [selectedCategory, productId])

//   // Map nested subcategories when subcategory changes
//   useEffect(() => {
//     const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name
//         }
//       }
//     )
//     setNestedSubCategory(mappedNestedSubCategory)
//   }, [selectedSubCategory])

//   // Load nested subcategories when editing
//   useEffect(() => {
//     if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
//       const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//         (item: any, index: number) => {
//           return {
//             id: item.id,
//             label: item.name,
//             value: item.name
//           }
//         }
//       )
//       setNestedSubCategory(mappedNestedSubCategory)
//     }
//   }, [selectedSubCategory, productId, productDetailData])

//   const handleAction = (imageId: string) => {
//     dispatch(
//       delteProductImageAction({
//         productId: productId as string,
//         imageId: imageId as string,
//         onSuccess: () => {
//           toast.success('Product image deleted')
//           if (productId) {
//             dispatch(getProductDetailByIdAction({productId: productId as string}))
//           }
//         }
//       })
//     )
//   }

//   // Add new color variant
//   const addColorVariant = () => {
//     setColorImage(prev => [
//       ...prev,
//       {
//         id: uuidv4(),
//         color: '',
//         image: {},
//         existingImagePath: ''
//       }
//     ])
//     setColorCount(prev => prev + 1)
//   }

//   // Remove color variant
//   const removeColorVariant = (index: number) => {
//     if (colorImage.length <= 1) {
//       toast.error('At least one color variant is required')
//       return
//     }
    
//     setColorImage(prev => prev.filter((_, i) => i !== index))
//     setColorCount(prev => prev - 1)
//   }

//   // Remove video
//   const removeVideo = () => {
//     setVideoFile(null)
//     setExistingVideoUrl('')
//     setData((prev: any) => ({ ...prev, video: null }))
//     toast.success('Video removed')
//   }

//   const handleVideo = (event: any) => {
//     const selectedFile = event.target.files?.[0]
//     if (!selectedFile) return
//     if (!selectedFile.size) {
//       toast.error('Selected video file is empty')
//       return
//     }
    
//     // Validate video type
//     const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
//     if (!validVideoTypes.includes(selectedFile.type)) {
//       toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)')
//       return
//     }
    
//     // Validate video size (max 100MB)
//     if (selectedFile.size > 100 * 1024 * 1024) {
//       toast.error('Video size should be less than 100MB')
//       return
//     }
    
//     setVideoFile(selectedFile)
//     setExistingVideoUrl('')
//     setData((prev: any) => ({...prev, video: selectedFile}))
//   }

//   const handlenewArrival = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
//   }

//   const handleBestSelling = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isBestSelling: item
//     }))
//   }

//   const handleWatchAndShopping = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isWatchAndShop: item
//     }))
//   }

//   const getActiveVariantSlots = () =>
//     colorImage.slice(0, Math.max(1, Number(colorCount) || colorImage.length))

//   const appendColorVariantsToFormData = (
//     formData: FormData,
//     isUpdate: boolean
//   ) => {
//     const slots = getActiveVariantSlots()

//     if (isUpdate) {
//       const variantsMeta = slots.map((item, index) => {
//         const hasNewFile =
//           (item?.image instanceof FileList && item.image.length > 0) ||
//           item?.image instanceof File

//         const existingImage = !hasNewFile
//           ? (typeof item?.image === 'string' && item.image) ||
//             item?.existingImagePath ||
//             null
//           : null

//         return {
//           color: item?.color ?? '',
//           existingImage,
//           hasNewImage: hasNewFile
//         }
//       })

//       formData.append('variantsMeta', JSON.stringify(variantsMeta))
//       formData.append('replaceImages', 'true')

//       slots.forEach((item) => {
//         formData.append('colorName', item?.color ?? '')
//       })

//       slots.forEach((item) => {
//         if (item?.image instanceof FileList && item.image.length > 0) {
//           formData.append('coloredImage', item.image[0])
//         } else if (item?.image instanceof File) {
//           formData.append('coloredImage', item.image)
//         }
//       })
//       return
//     }

//     slots.forEach((item) => {
//       if (item?.color) {
//         formData.append('colorName', item.color)
//       }

//       if (item?.image instanceof FileList && item.image.length > 0) {
//         formData.append('coloredImage', item.image[0])
//       } else if (item?.image instanceof File) {
//         formData.append('coloredImage', item.image)
//       }
//     })
//   }

//   // Validate stock quantity
//   const validateStockQuantity = (value: string) => {
//     const numValue = Number(value)
//     if (value === '') return true
//     if (isNaN(numValue)) return false
//     if (numValue < 0) return false
//     if (!Number.isInteger(numValue)) return false
//     return true
//   }

//   const addProductHandler = (event: any) => {
//     event.preventDefault()
    
//     // Validation checks
//     if (!data.name || data.name.trim() === '') {
//       toast.error('Please enter product name')
//       return
//     }
    
//     if (!selectedCategory?.id) {
//       toast.error('Please select a category')
//       return
//     }
    
//     if (!selectedSubCategory?.id) {
//       toast.error('Please select a subcategory')
//       return
//     }
    
//     if (!data.originalPrice || Number(data.originalPrice) <= 0) {
//       toast.error('Please enter a valid original price')
//       return
//     }
    
//     if (!data.stockQuantity || data.stockQuantity === '') {
//       toast.error('Please enter stock quantity')
//       return
//     }
    
//     if (!validateStockQuantity(data.stockQuantity)) {
//       toast.error('Stock quantity must be a positive whole number')
//       return
//     }
    
//     if (Number(data.stockQuantity) < 0) {
//       toast.error('Stock quantity cannot be negative')
//       return
//     }

//     // Validate color variants
//     const activeSlots = getActiveVariantSlots()
//     for (let i = 0; i < activeSlots.length; i++) {
//       if (!activeSlots[i].color) {
//         toast.error(`Please select color for variant ${i + 1}`)
//         return
//       }
//       const hasImage = activeSlots[i].image instanceof File || 
//                       activeSlots[i].image instanceof FileList && activeSlots[i].image.length > 0 ||
//                       activeSlots[i].existingImagePath
//       if (!hasImage) {
//         toast.error(`Please upload image for variant ${i + 1}`)
//         return
//       }
//     }
    
//     const formData = new FormData()

//     formData.append('name', data.name)
//     formData.append('category', selectedCategory?.id)
//     formData.append('subCategory', selectedSubCategory?.id)
    
//     if (selectedNestedSubCategory?.id) {
//       formData.append('nestedSubCategory', selectedNestedSubCategory.id)
//     }
    
//     formData.append('originalPrice', String(data.originalPrice))
//     formData.append('discountedPrice', String(data.discountedPrice || 0))
//     formData.append('discountPercentage', String(data.discountPercentage || 0))
//     formData.append('description', data.description || '')
    
//     // Handle video - use new file if exists, otherwise keep existing
//     if (videoFile instanceof File) {
//       formData.append('video', videoFile)
//     } else if (existingVideoUrl) {
//       // Keep existing video - no need to append, backend should keep it
//       formData.append('keepExistingVideo', 'true')
//     }
    
//     formData.append('stockQuantity', String(data.stockQuantity))
//     formData.append('isHotSelling', JSON.stringify(isHotSelling))

//     appendColorVariantsToFormData(formData, !!productId)

//     formData.append(
//       'isBestSelling',
//       JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
//     )

//     formData.append(
//       'isNewArrivals',
//       JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
//     )

//     formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

//     if (productId) {
//       dispatch(
//         updateProductAction({
//           productBody: formData,
//           productId: productId as any,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => console.log('get hit after update')
//               })
//             )
//             navigate('/products')
//             toast.success('Product Updated Successfully')
//             resetForm()
//           },
//           onError: (error) => {
//             toast.error(error?.message || 'Failed to update product')
//           }
//         })
//       )
//     } else {
//       dispatch(
//         createProductAction({
//           productBody: formData,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => setData({})
//               })
//             )
//             navigate('/products')
//             toast.success('Product Created Successfully')
//             resetForm()
//           },
//           onError: (error) => {
//             toast.error(error?.message || 'Failed to create product')
//           }
//         })
//       )
//     }
//   }

//   const media = useMedia();

//   // Show loading state while fetching product details
//   if (productId && productDetailLoading) {
//     return (
//       <div className="addProductContainer">
//         <div className="addProduct" style={{padding: '20px 12px', textAlign: 'center'}}>
//           Loading product details...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="addProductContainer">
//       <div className="addProduct" style={{padding:'20px 12px'}}>
//         <div className="addProduct-input">
//           <Label required labelName="Product Name"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Product Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, name: e.target.value}))
//             }
//             value={data.name}
//           />
//         </div>

//         <div style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input">
//             <Label required labelName="Category"></Label>
//             <SelectField
//               options={category}
//               width={media.md ? "320px" : "100%"}
//               value={selectedCategory?.label !== undefined && selectedCategory}
//               onChangeValue={(data) => {
//                 setSelectedCategory(data)
//                 setSelectedSubCategory(null)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select Category'}
//             />
//           </div>

//           <div className="addProduct-input">
//             <Label required labelName="SubCategory"></Label>
//             <SelectField
//               options={subCategory}
//               width={media.md ? "320px" : "100%"}
//               onChangeValue={(data) => {
//                 setSelectedSubCategory(data)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select SubCategory'}
//               value={
//                 selectedSubCategory?.label !== undefined && selectedSubCategory
//               }
//             />
//           </div>
//         </div>

//         {/* Nested SubCategory Dropdown */}
//         {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
//           <div className="addProduct-input">
//             <Label labelName="Nested SubCategory (Optional)"></Label>
//             <SelectField
//               options={nestedSubCategory}
//               width="100%"
//               onChangeValue={(data) => setSelectedNestedSubCategory(data)}
//               placeholder={'Select Nested SubCategory'}
//               value={
//                 selectedNestedSubCategory?.label !== undefined && 
//                 selectedNestedSubCategory
//               }
//             />
//           </div>
//         ) : null}

//         <HStack justify="space-between" gap="$3" style={{flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Original Price"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Original Price"
//               onChange={(e: any) => handlePriceChange('originalPrice', e.target.value)}
//               value={data.originalPrice}
//             />
//           </div>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Discount Percentage (%)"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Discount Percentage"
//               onChange={(e: any) => handlePriceChange('discountPercentage', e.target.value)}
//               value={data.discountPercentage}
//             />
//           </div>
//         </HStack>

//         <div className="addProduct-input">
//           <Label required labelName="Discounted Price"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Discounted Price"
//             onChange={(e: any) => handlePriceChange('discountedPrice', e.target.value)}
//             value={data.discountedPrice}
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Stock Quantity"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Stock Quantity (must be a whole number)"
//             onChange={(e: any) => {
//               const value = e.target.value
//               if (validateStockQuantity(value) || value === '') {
//                 setData((prev: any) => ({
//                   ...prev,
//                   stockQuantity: value === '' ? '' : Number(value)
//                 }))
//               } else {
//                 toast.error('Stock quantity must be a positive whole number')
//               }
//             }}
//             value={data.stockQuantity}
//           />
//         </div>

//         <div className="addProduct-input">
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
//             <Label required labelName="Color Variants"></Label>
//             <Button
//               title="+ Add Variant"
//               onClick={addColorVariant}
//               style={{padding: '5px 15px', fontSize: '12px', width: 'auto'}}
//               type="button"
//             />
//           </div>
//         </div>

//         {colorImage.map((variant, index) => {
//           return (
//             <div
//               key={variant.id}
//               style={{
//                 display: 'flex', 
//                 gap: '12px', 
//                 flexDirection: !media.md ? 'column' : 'row', 
//                 marginBottom: '20px',
//                 position: 'relative',
//                 padding: '15px',
//                 border: '1px solid #e0e0e0',
//                 borderRadius: '8px',
//                 backgroundColor: '#f9f9f9'
//               }}
//             >
//               <div style={{minWidth: media.md ? '300px' : '100%', position: 'relative'}}>
//                 <ImageUploader
//                   key={index}
//                   uniqueKeys={index}
//                   defaultImage={
//                     productId && !!productDetailData && productDetailData?.images?.[index]
//                       ? [productDetailData?.images[index]]
//                       : ''
//                   }
//                   onImageChange={(event) => {
//                     setColorImage((prev) => {
//                       const existingList = [...prev]
//                       const currentObject = existingList[index] || {
//                         id: variant.id,
//                         color: '',
//                         image: {},
//                         existingImagePath: ''
//                       }

//                       existingList[index] = {
//                         ...currentObject,
//                         image: event.target.files,
//                         id: currentObject.id || uuidv4()
//                       }

//                       return existingList
//                     })
//                   }}
//                   value={colorImage[index]?.image ?? ''}
//                   actionHandler={handleAction}
//                 />
//               </div>

//               <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
//                 <div>
//                   <Label labelName="Color Picker" />
//                   <input
//                     type="color"
//                     style={{width: '200px', height: '200px', cursor: 'pointer'}}
//                     onChange={(e: any) => {
//                       setColorImage((prev) => {
//                         const existingList = [...prev]
//                         const currentObject = existingList[index] || {
//                           id: variant.id,
//                           color: '',
//                           image: '',
//                           existingImagePath: ''
//                         }
//                         existingList[index] = {
//                           ...currentObject,
//                           color: e.target.value
//                         }

//                         return existingList
//                       })
//                     }}
//                     value={colorImage[index]?.color || '#000000'}
//                   />
//                 </div>

//                 {/* Remove variant button */}
//                 <Button
//                   title=""
//                   onClick={() => removeColorVariant(index)}
//                   style={{
//                     padding: '8px',
//                     width: '40px',
//                     height: '40px',
//                     backgroundColor: '#dc2626',
//                     marginTop: '24px'
//                   }}
//                   type="button"
//                 >
//                   <Trash2 size={18} color="white" />
//                 </Button>
//               </div>
//             </div>
//           )
//         })}

//         <div className="addProduct-input">
//           <Label required labelName="Product Detail"></Label>
//           <TextEditor
//             descriptionBody={data.description}
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, description: e}))
//             }
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Product Video"></Label>
//           <div style={{position: 'relative', display: 'inline-block'}}>
//             <VideoUploader
//               defaultVideo={existingVideoUrl}
//               onVideoChange={handleVideo}
//               actionHandler={(video: File) => {
//                 if (!video?.size) {
//                   toast.error('Selected video file is empty')
//                   return
//                 }
//                 handleVideo({ target: { files: [video] } })
//               }}
//             />
//             {(existingVideoUrl || videoFile) && (
//               <button
//                 onClick={removeVideo}
//                 style={{
//                   position: 'absolute',
//                   top: '-10px',
//                   right: '-10px',
//                   backgroundColor: '#dc2626',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: '24px',
//                   height: '24px',
//                   cursor: 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 10
//                 }}
//                 type="button"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div
//           className="addProduct-input"
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             columnGap: '20%',
//             flexDirection: !media.md ? 'column' : 'row',
//             margin: '14px',
//             rowGap: '16px'
//           }}
//         >
//           <VStack gap="$3">
//             <Label required labelName="Is New Arrival"></Label>
//             <CheckBox
//               value="newArrival"
//               label="New Arrival"
//               name="newArrival"
//               check={isNewArrivalOrBestSelling.isNewArrival}
//               handleCheckboxChange={handlenewArrival}
//             />
//           </VStack>
//           <VStack gap="$3">
//             <Label required labelName="Is Best Selling?"></Label>
//             <CheckBox
//               value="best selling"
//               label="Best Selling"
//               name="bestselling"
//               check={isNewArrivalOrBestSelling.isBestSelling}
//               handleCheckboxChange={handleBestSelling}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label required labelName="Is Watch And Shopping?"></Label>
//             <CheckBox
//               value="isWatchAndShop"
//               label="Watch And Shop"
//               name="isWatchAndShop"
//               check={isNewArrivalOrBestSelling.isWatchAndShop}
//               handleCheckboxChange={handleWatchAndShopping}
//             />
//           </VStack>
//         </div>

//         <Button
//           title={productId ? 'Update Product' : 'Add Product'}
//           onClick={addProductHandler}
//           loading={productId ? updateProductLoading : createProductLoading}
//           style={{width: '100%', marginTop: '20px'}}
//         />
//       </div>
//     </div>
//   )
// }



// import React, {useCallback, useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from 'src/store'
// import {useMedia, useParams} from 'src/hooks'
// import {
//   Button,
//   CheckBox,
//   HStack,
//   InputField,
//   Label,
//   SelectField,
//   TextEditor,
//   VStack
// } from 'src/app/common'
// import {
//   getCategoryListAction,
//   getSubCategoryAction
// } from '../../category/category.slice'
// import {
//   createProductAction,
//   createProductImageAction,
//   delteProductImageAction,
//   getAllProductVariantImagesAction,
//   getProductDetailByIdAction,
//   getProductListAction,
//   updateProductAction,
//   resetProductDetail
// } from '../product.slice'
// import {useRouter} from 'next/router'
// import {toast} from 'react-hot-toast'
// import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
// import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
// import {v4 as uuidv4} from 'uuid'
// import {FILE_URL} from 'src/config'
// import {resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'
// import { Trash2, X } from 'lucide-react'

// export const AddProductPage = () => {
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const productId = useParams('productId')
//   const hydratedProductIdRef = useRef<string | null>(null)

//   // Reset form function
//   const resetForm = useCallback(() => {
//     setData({
//       name: '',
//       originalPrice: '',
//       discountedPrice: '',
//       discountPercentage: '',
//       category: '',
//       subCategory: '',
//       nestedSubCategory: '',
//       images: [],
//       video: null,
//       description: '',
//       stockQuantity: ''
//     })
    
//     setImage([])
//     setColorCount(2)
//     setColorImage([{
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }])
//     setAllColorVariant([])
//     setSelectedCategory(null)
//     setSelectedSubCategory(null)
//     setSelectedNestedSubCategory(null)
//     setIsNewArrivalOrBestSelling({
//       isNewArrival: false,
//       isBestSelling: false,
//       isWatchAndShop: false,
//       showInHomePage: false
//     })
//     setIsHotSelling(false)
//     setProductVariantIdList([''])
//     setVideoFile(null)
//     setExistingVideoUrl('')
//     setVideoUploaderKey(Date.now()) // Force refresh VideoUploader
//     hydratedProductIdRef.current = null
//   }, [])

//   const [image, setImage] = useState<any>([])
//   const [colorCount, setColorCount] = useState(2)
//   const [colorImage, setColorImage] = useState([
//     {
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }
//   ])

//   const [allColorVariant, setAllColorVariant] = useState([])

//   const [data, setData] = useState<any>({
//     name: '',
//     originalPrice: '',
//     discountedPrice: '',
//     discountPercentage: '',
//     category: '',
//     subCategory: '',
//     nestedSubCategory: '', 
//     images: [],
//     video: null,
//     description: '',
//     stockQuantity: ''
//   })

//   const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
//     isNewArrival: false,
//     isBestSelling: false,
//     isWatchAndShop: false,
//     showInHomePage: false
//   })

//   const [isHotSelling, setIsHotSelling] = useState(false)

//   // Category, SubCategory, and NestedSubCategory states
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
//   const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
//   const [category, setCategory] = useState<any>()
//   const [subCategory, setSubCategory] = useState<any>()
//   const [nestedSubCategory, setNestedSubCategory] = useState<any>()

//   // Video states
//   const [videoFile, setVideoFile] = useState<File | null>(null)
//   const [existingVideoUrl, setExistingVideoUrl] = useState<string>('')
//   const [videoUploaderKey, setVideoUploaderKey] = useState<number>(Date.now()) // Key to force remount

//   const {
//     categoryData,
//     getCategoryLoading,
//     subCategoryData,
//     getSubCategoryLoading
//   }: any = useSelector((state: any) => state.category)

//   const {createProductLoading, updateProductLoading, productVariantList, productDetailData, productDetailLoading}: any =
//     useSelector((state: any) => state.product)
  
//   const [productVariantIdList, setProductVariantIdList] = useState([''])

//   // Calculate discounted price from original price and discount percentage
//   const calculateDiscountedPrice = useCallback((originalPrice: number, discountPercentage: number) => {
//     if (originalPrice && discountPercentage && discountPercentage > 0) {
//       const discountAmount = (originalPrice * discountPercentage) / 100
//       const finalPrice = originalPrice - discountAmount
//       return Math.round(finalPrice * 100) / 100
//     }
//     return ''
//   }, [])

//   // Calculate discount percentage from original price and discounted price
//   const calculateDiscountPercentage = useCallback((originalPrice: number, discountedPrice: number) => {
//     if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
//       const discountAmount = originalPrice - discountedPrice
//       const percentage = (discountAmount / originalPrice) * 100
//       return Math.round(percentage * 100) / 100
//     }
//     return ''
//   }, [])

//   // Handle price changes
//   const handlePriceChange = useCallback((field: string, value: string) => {
//     const numValue = value === '' ? '' : Number(value)
    
//     if (field === 'originalPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, originalPrice: numValue }
        
//         if (prev.discountPercentage && prev.discountPercentage !== '') {
//           const discounted = calculateDiscountedPrice(Number(numValue), Number(prev.discountPercentage))
//           newData.discountedPrice = discounted
//         }
//         else if (prev.discountedPrice && prev.discountedPrice !== '') {
//           const percentage = calculateDiscountPercentage(Number(numValue), Number(prev.discountedPrice))
//           newData.discountPercentage = percentage
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountPercentage') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountPercentage: numValue === '' ? '' : numValue }
        
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const discounted = calculateDiscountedPrice(Number(prev.originalPrice), numValue)
//           newData.discountedPrice = discounted
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountedPrice = ''
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountedPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountedPrice: numValue === '' ? '' : numValue }
        
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const percentage = calculateDiscountPercentage(Number(prev.originalPrice), numValue)
//           newData.discountPercentage = percentage
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountPercentage = ''
//         }
        
//         return newData
//       })
//     }
//   }, [calculateDiscountedPrice, calculateDiscountPercentage])

//   // Reset form when component mounts or productId changes
//   useEffect(() => {
//     if (!productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//     }
    
//     return () => {
//       // if (!productId) {
//         dispatch(resetProductDetail())
//       // }
//     }
//   }, [productId, resetForm, dispatch])

//   // Fetch product detail when productId exists
//   useEffect(() => {
//     if (productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//       hydratedProductIdRef.current = null
//       dispatch(getProductDetailByIdAction({productId: productId as string}))
//     }
//   }, [productId, dispatch, resetForm])

//   useEffect(() => {
//     setProductVariantIdList(
//       productVariantList?.map((item: any, index: number) => {
//         return item._id
//       })
//     )
//   }, [productVariantList])

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryListtttt fetch Successfully')
//       })
//     )
//   }, [dispatch])

//   // Load product detail data when editing
//   useEffect(() => {
//     if (
//       productId &&
//       productDetailData &&
//       hydratedProductIdRef.current !== productId &&
//       Object.keys(productDetailData).length > 0
//     ) {
//       hydratedProductIdRef.current = productId as string
      
//       setSelectedCategory({
//         id: productDetailData?.category?.id,
//         label: productDetailData?.category?.name,
//         value: productDetailData?.category?.value
//       })
      
//       setSelectedSubCategory({
//         id: productDetailData?.subCategory?.id,
//         label: productDetailData?.subCategory?.name,
//         value: productDetailData?.subCategory?.value
//       })

//       if (productDetailData?.nestedSubCategory) {
//         setSelectedNestedSubCategory({
//           id: productDetailData?.nestedSubCategory?.id,
//           label: productDetailData?.nestedSubCategory?.name,
//           value: productDetailData?.nestedSubCategory?.value
//         })
//       }

//       setProductVariantIdList(
//         productDetailData?.images?.map((item: any, index: number) => {
//           return String(index)
//         })
//       )

//       setColorImage(() => {
//         if (productDetailData?.images && productDetailData.images.length > 0) {
//           return productDetailData?.images?.map((item: any, index: number) => {
//             const existingImages = Array.isArray(item.coloredImages)
//               ? item.coloredImages
//               : item.coloredImage
//               ? [item.coloredImage]
//               : []

//             return {
//               id: String(index),
//               color: item.colorName,
//               image: existingImages,
//               existingImagePath: existingImages
//             }
//           })
//         }
//         return [{
//           id: uuidv4(),
//           color: '',
//           image: {},
//           existingImagePath: ''
//         }]
//       })

//       // Set video URL if exists
//       if (productDetailData?.video) {
//         const videoUrl = resolveProductVideoUrl(productDetailData.video)
//         setExistingVideoUrl(videoUrl)
//         setVideoFile(null)
//       } else {
//         setExistingVideoUrl('')
//         setVideoFile(null)
//       }

//       setData((prev: any) => ({
//         ...prev,
//         name: productDetailData?.name || '',
//         originalPrice: productDetailData?.originalPrice || '',
//         discountedPrice: productDetailData?.discountedPrice || '',
//         discountPercentage: productDetailData?.discountPercentage || '',
//         stockQuantity: productDetailData?.stockQuantity || '',
//         images: productDetailData?.images?.[0] || '',
//         description: productDetailData?.description || '',
//         video: productDetailData?.video || null
//       }))

//       setColorCount(productDetailData?.images?.length || 2)
//       setAllColorVariant(productDetailData?.images || [])

//       setIsNewArrivalOrBestSelling({
//         isBestSelling: productDetailData?.isBestSelling || false,
//         isNewArrival: productDetailData?.isNewArrivals || false,
//         isWatchAndShop: productDetailData?.isWatchAndShop || false,
//         showInHomePage: productDetailData?.showInHomePage || false
//       })

//       setIsHotSelling(productDetailData?.isHotSelling || false)
//     }
//   }, [productDetailData, productId])

//   // Map categories from API data
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any, index: number) => {
//       return {
//         id: item.id,
//         label: item.name,
//         value: item.name,
//         subCategory: item.subCategories
//       }
//     })
//     setCategory(mappedCategory)
//   }, [categoryData])

//   // Map subcategories when category changes
//   useEffect(() => {
//     const mappedSubCategory = selectedCategory?.subCategory?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name,
//           nestedSubCategories: item.subCategories || []
//         }
//       }
//     )
//     setSubCategory(mappedSubCategory)
//     if (!productId) {
//       setSelectedNestedSubCategory(null)
//     }
//   }, [selectedCategory, productId])

//   // Map nested subcategories when subcategory changes
//   useEffect(() => {
//     const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name
//         }
//       }
//     )
//     setNestedSubCategory(mappedNestedSubCategory)
//   }, [selectedSubCategory])

//   // Load nested subcategories when editing
//   useEffect(() => {
//     if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
//       const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//         (item: any, index: number) => {
//           return {
//             id: item.id,
//             label: item.name,
//             value: item.name
//           }
//         }
//       )
//       setNestedSubCategory(mappedNestedSubCategory)
//     }
//   }, [selectedSubCategory, productId, productDetailData])

//   const handleAction = (imageId: string) => {
//     dispatch(
//       delteProductImageAction({
//         productId: productId as string,
//         imageId: imageId as string,
//         onSuccess: () => {
//           toast.success('Product image deleted')
//           // Refresh product details after deletion
//           if (productId) {
//             dispatch(getProductDetailByIdAction({ productId: productId as string }))
//           }
//         }
//       })
//     )
//   }

//   // Add new color variant
//   const addColorVariant = () => {
//     setColorImage(prev => [
//       ...prev,
//       {
//         id: uuidv4(),
//         color: '',
//         image: {},
//         existingImagePath: ''
//       }
//     ])
//     setColorCount(prev => prev + 1)
//   }

//   // Remove color variant
//   const removeColorVariant = (index: number) => {
//     // Allow removing any variant (including the last one)
//     setColorImage(prev => prev.filter((_, i) => i !== index))
//     setColorCount(prev => Math.max(0, prev - 1))
//   }

//   // Remove video - FIXED VERSION
//   const removeVideo = () => {
//     setVideoFile(null)
//     setExistingVideoUrl('')
//     setData((prev: any) => ({ ...prev, video: null }))
//     setVideoUploaderKey(Date.now()) // Force VideoUploader to remount and clear its state
//     toast.success('Video removed successfully')
//   }

//   const handleVideo = (event: any) => {
//     const selectedFile = event.target.files?.[0]
//     if (!selectedFile) return
//     if (!selectedFile.size) {
//       toast.error('Selected video file is empty')
//       return
//     }
    
//     // Validate video type
//     const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
//     if (!validVideoTypes.includes(selectedFile.type)) {
//       toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)')
//       return
//     }
    
//     // Validate video size (max 100MB)
//     if (selectedFile.size > 100 * 1024 * 1024) {
//       toast.error('Video size should be less than 100MB')
//       return
//     }
    
//     setVideoFile(selectedFile)
//     setExistingVideoUrl('')
//     setData((prev: any) => ({...prev, video: selectedFile}))
//   }

//   const handlenewArrival = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
//   }

//   const handleBestSelling = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isBestSelling: item
//     }))
//   }

//   const handleWatchAndShopping = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isWatchAndShop: item
//     }))
//   }

//   const handleShowInHomePage = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       showInHomePage: item
//     }))
//   }

//   const getActiveVariantSlots = () =>
//     colorImage.slice(0, Math.max(1, Number(colorCount) || colorImage.length))
//   const appendColorVariantsToFormData = (formData: FormData, isUpdate: boolean) => {
//     const slots = getActiveVariantSlots();

//     // Always support multiple images per color variant for both create and update
//     const variantsMeta = slots.map((item) => {
//       const hasNewFile =
//         (item?.image instanceof FileList && item.image.length > 0) ||
//         item?.image instanceof File;

//       const existingImages = Array.isArray(item?.existingImagePath)
//         ? item.existingImagePath
//         : item?.existingImagePath
//         ? [item.existingImagePath]
//         : [];

//       return {
//         color: item?.color ?? '',
//         existingImages,
//         hasNewImage: hasNewFile,
//       };
//     });

//     formData.append('variantsMeta', JSON.stringify(variantsMeta));
//     formData.append('replaceImages', 'true');

//     slots.forEach((item) => {
//       if (item?.image instanceof FileList && item.image.length > 0) {
//         for (let f = 0; f < item.image.length; f++) {
//           formData.append('coloredImage', item.image[f]);
//           formData.append('colorName', item?.color ?? '');
//         }
//       } else if (item?.image instanceof File) {
//         formData.append('coloredImage', item.image);
//         formData.append('colorName', item?.color ?? '');
//       } else if (Array.isArray(item?.existingImagePath)) {
//         // No new file, but keep colorName for existing images
//         item.existingImagePath.forEach(() => {
//           formData.append('colorName', item?.color ?? '');
//         });
//       } else if (typeof item?.existingImagePath === 'string') {
//         formData.append('colorName', item?.color ?? '');
//       }
//     });
//   }

//   // Validate stock quantity
//   const validateStockQuantity = (value: string) => {
//     const numValue = Number(value)
//     if (value === '') return true
//     if (isNaN(numValue)) return false
//     if (numValue < 0) return false
//     if (!Number.isInteger(numValue)) return false
//     return true
//   }

//   const addProductHandler = (event: any) => {
//     event.preventDefault()
    
//     // Validation checks
//     if (!data.name || data.name.trim() === '') {
//       toast.error('Please enter product name')
//       return
//     }
    
//     if (!selectedCategory?.id) {
//       toast.error('Please select a category')
//       return
//     }
    
//     if (!selectedSubCategory?.id) {
//       toast.error('Please select a subcategory')
//       return
//     }
    
//     if (!data.originalPrice || Number(data.originalPrice) <= 0) {
//       toast.error('Please enter a valid original price')
//       return
//     }
    
//     if (!data.stockQuantity || data.stockQuantity === '') {
//       toast.error('Please enter stock quantity')
//       return
//     }
    
//     if (!validateStockQuantity(data.stockQuantity)) {
//       toast.error('Stock quantity must be a positive whole number')
//       return
//     }
    
//     if (Number(data.stockQuantity) < 0) {
//       toast.error('Stock quantity cannot be negative')
//       return
//     }

//     // Validate color variants
//     const activeSlots = getActiveVariantSlots()
//     for (let i = 0; i < activeSlots.length; i++) {
//       if (!activeSlots[i].color) {
//         toast.error(`Please select color for variant ${i + 1}`)
//         return
//       }
//       const hasImage = activeSlots[i].image instanceof File || 
//                       activeSlots[i].image instanceof FileList && (activeSlots[i].image as any).length > 0 ||
//                       activeSlots[i].existingImagePath
//       if (!hasImage) {
//         toast.error(`Please upload image for variant ${i + 1}`)
//         return
//       }
//     }
    
//     const formData = new FormData()

//     formData.append('name', data.name)
//     formData.append('category', selectedCategory?.id)
//     formData.append('subCategory', selectedSubCategory?.id)
    
//     if (selectedNestedSubCategory?.id) {
//       formData.append('nestedSubCategory', selectedNestedSubCategory.id)
//     }
    
//     formData.append('originalPrice', String(data.originalPrice))
//     formData.append('discountedPrice', String(data.discountedPrice || 0))
//     formData.append('discountPercentage', String(data.discountPercentage || 0))
//     formData.append('description', data.description || '')
    
//     // Handle video - use new file if exists
//     if (videoFile instanceof File) {
//       formData.append('video', videoFile)
//     } else if (!existingVideoUrl && data.video === null) {
//       // If video was removed, send a flag to delete existing video
//       formData.append('removeVideo', 'true')
//     }
    
//     formData.append('stockQuantity', String(data.stockQuantity))
//     formData.append('isHotSelling', JSON.stringify(isHotSelling))

//     appendColorVariantsToFormData(formData, !!productId)

//     formData.append(
//       'isBestSelling',
//       JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
//     )

//     formData.append(
//       'isNewArrivals',
//       JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
//     )

//     formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

//     formData.append(
//       'showInHomePage',
//       JSON.stringify(isNewArrivalOrBestSelling.showInHomePage)
//     )

//     if (productId) {
//       dispatch(
//         updateProductAction({
//           productBody: formData,
//           productId: productId as any,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => console.log('get hit after updateee')
//               })
//             )
//             router.push('/dash-product')
//             toast.success('Product Updated Successfully')
//             resetForm()
//           },
//           onError: (error) => {
//             toast.error(error?.message || 'Failed to update product')
//           }
//         })
//       )
//     } else {
//       dispatch(
//         createProductAction({
//           productBody: formData,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => setData({})
//               })
//             )
//             router.push('/dash-product')
//             toast.success('Product Created Successfully')
//             resetForm()
//           },
//           onError: (error) => {
//             toast.error(error?.message || 'Failed to create product')
//           }
//         })
//       )
//     }
//   }

//   const media = useMedia();

//   // Show loading state while fetching product details
//   if (productId && productDetailLoading) {
//     return (
//       <div className="addProductContainer">
//         <div className="addProduct" style={{padding: '20px 12px', textAlign: 'center'}}>
//           Loading product details...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="addProductContainer">
//       <div className="addProduct" style={{padding:'20px 12px'}}>
//         <div className="addProduct-input">
//           <Label required labelName="Product Name"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Product Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, name: e.target.value}))
//             }
//             value={data.name}
//           />
//         </div>

//         <div style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input">
//             <Label required labelName="Category"></Label>
//             <SelectField
//               options={category}
//               width={media.md ? "320px" : "100%"}
//               value={selectedCategory?.label !== undefined && selectedCategory}
//               onChangeValue={(data) => {
//                 setSelectedCategory(data)
//                 setSelectedSubCategory(null)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select Category'}
//             />
//           </div>

//           <div className="addProduct-input">
//             <Label required labelName="SubCategory"></Label>
//             <SelectField
//               options={subCategory}
//               width={media.md ? "320px" : "100%"}
//               onChangeValue={(data) => {
//                 setSelectedSubCategory(data)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select SubCategory'}
//               value={
//                 selectedSubCategory?.label !== undefined && selectedSubCategory
//               }
//             />
//           </div>
//         </div>

//         {/* Nested SubCategory Dropdown */}
//         {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
//           <div className="addProduct-input">
//             <Label labelName="Nested SubCategory (Optional)"></Label>
//             <SelectField
//               options={nestedSubCategory}
//               width="100%"
//               onChangeValue={(data) => setSelectedNestedSubCategory(data)}
//               placeholder={'Select Nested SubCategory'}
//               value={
//                 selectedNestedSubCategory?.label !== undefined && 
//                 selectedNestedSubCategory
//               }
//             />
//           </div>
//         ) : null}

//         <HStack justify="space-between" gap="$3" style={{flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Original Price"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Original Price"
//               onChange={(e: any) => handlePriceChange('originalPrice', e.target.value)}
//               value={data.originalPrice}
//             />
//           </div>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Discount Percentage (%)"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Discount Percentage"
//               onChange={(e: any) => handlePriceChange('discountPercentage', e.target.value)}
//               value={data.discountPercentage}
//             />
//           </div>
//         </HStack>

//         <div className="addProduct-input">
//           <Label required labelName="Discounted Price"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Discounted Price"
//             onChange={(e: any) => handlePriceChange('discountedPrice', e.target.value)}
//             value={data.discountedPrice}
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Stock Quantity"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Stock Quantity (must be a whole number)"
//             onChange={(e: any) => {
//               const value = e.target.value
//               if (validateStockQuantity(value) || value === '') {
//                 setData((prev: any) => ({
//                   ...prev,
//                   stockQuantity: value === '' ? '' : Number(value)
//                 }))
//               } else {
//                 toast.error('Stock quantity must be a positive whole number')
//               }
//             }}
//             value={data.stockQuantity}
//           />
//         </div>

//         <div className="addProduct-input">
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
//             <Label required labelName="Color Variants"></Label>
//             <Button
//               title="+ Add Variant"
//               onClick={addColorVariant}
//               style={{padding: '5px 15px', fontSize: '12px', width: 'auto'}}
//               type="button"
//             />
//           </div>
//         </div>

//         {colorImage.map((variant, index) => {
//           return (
//             <div
//               key={variant.id}
//               style={{
//                 display: 'flex', 
//                 gap: '12px', 
//                 flexDirection: !media.md ? 'column' : 'row', 
//                 marginBottom: '20px',
//                 position: 'relative',
//                 padding: '15px',
//                 border: '1px solid #e0e0e0',
//                 borderRadius: '8px',
//                 backgroundColor: '#f9f9f9'
//               }}
//             >
//               <div style={{minWidth: media.md ? '300px' : '100%', position: 'relative'}}>
//                 <ImageUploader
//                   key={index}
//                   uniqueKeys={index}
//                   defaultImage={
//                     productId && !!productDetailData && productDetailData?.images?.[index]
//                       ? productDetailData?.images[index]?.coloredImages || []
//                       : []
//                   }
//                   onImageChange={(event) => {
//                     setColorImage((prev) => {
//                       const existingList = [...prev]
//                       const currentObject = existingList[index] || {
//                         id: variant.id,
//                         color: '',
//                         image: {},
//                         existingImagePath: ''
//                       }

//                       existingList[index] = {
//                         ...currentObject,
//                         image: event.target.files,
//                         id: currentObject.id || uuidv4()
//                       }

//                       return existingList
//                     })
//                   }}
//                   value={colorImage[index]?.image ?? ''}
//                   actionHandler={handleAction}
//                 />
//               </div>

//               <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
//                 <div>
//                   <Label labelName="Color Picker" />
//                   <input
//                     type="color"
//                     style={{width: '200px', height: '200px', cursor: 'pointer'}}
//                     onChange={(e: any) => {
//                       setColorImage((prev) => {
//                         const existingList = [...prev]
//                         const currentObject = existingList[index] || {
//                           id: variant.id,
//                           color: '',
//                           image: '',
//                           existingImagePath: ''
//                         }
//                         existingList[index] = {
//                           ...currentObject,
//                           color: e.target.value
//                         }

//                         return existingList
//                       })
//                     }}
//                     value={colorImage[index]?.color || '#000000'}
//                   />
//                 </div>

//                 {/* Remove variant button */}
//                 {/* <Button
//                   title=""
                
//                   // style={{
//                   //   padding: '8px',
//                   //   width: '40px',
//                   //   height: '40px',
//                   //   backgroundColor: '#dc2626',
//                   //   marginTop: '24px'
//                   // }}
//                   type="button"
//                 > */}

       
//                   <Trash2 size={18}   onClick={() => removeColorVariant(index)} style={{cursor:'pointer'}}/>
//                 {/* </Button> */}
    
//               </div>
//             </div>
//           )
//         })}

//         <div className="addProduct-input">
//           <Label required labelName="Product Detail"></Label>
//           <TextEditor
//             descriptionBody={data.description}
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, description: e}))
//             }
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Product Video"></Label>
//           <div style={{position: 'relative', display: 'inline-block', width: '100%'}}>
//             <VideoUploader
//               key={videoUploaderKey} // This forces remount when key changes
//               defaultVideo={existingVideoUrl}
//               onVideoChange={handleVideo}
//               actionHandler={(video: File) => {
//                 if (!video?.size) {
//                   toast.error('Selected video file is empty')
//                   return
//                 }
//                 handleVideo({ target: { files: [video] } })
//               }}
//             />
//             {(existingVideoUrl || videoFile) && (
//               <button
//                 onClick={removeVideo}
//                 style={{
//                   position: 'absolute',
//                   top: '-10px',
//                   right: '-10px',
//                   backgroundColor: '#dc2626',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: '28px',
//                   height: '28px',
//                   cursor: 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 10,
//                   transition: 'all 0.2s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = '#b91c1c'
//                   e.currentTarget.style.transform = 'scale(1.1)'
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = '#dc2626'
//                   e.currentTarget.style.transform = 'scale(1)'
//                 }}
//                 type="button"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div
//           className="addProduct-input"
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             columnGap: '20%',
//             flexDirection: !media.md ? 'column' : 'row',
//             margin: '14px',
//             rowGap: '16px'
//           }}
//         >
//           <VStack gap="$3">
//             <Label required labelName="Is New Arrival"></Label>
//             <CheckBox
//               value="newArrival"
//               label="New Arrival"
//               name="newArrival"
//               check={isNewArrivalOrBestSelling.isNewArrival}
//               handleCheckboxChange={handlenewArrival}
//             />
//           </VStack>
//           <VStack gap="$3">
//             <Label required labelName="Is Best Selling?"></Label>
//             <CheckBox
//               value="best selling"
//               label="Best Selling"
//               name="bestselling"
//               check={isNewArrivalOrBestSelling.isBestSelling}
//               handleCheckboxChange={handleBestSelling}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label required labelName="Is Watch And Shopping?"></Label>
//             <CheckBox
//               value="isWatchAndShop"
//               label="Watch And Shop"
//               name="isWatchAndShop"
//               check={isNewArrivalOrBestSelling.isWatchAndShop}
//               handleCheckboxChange={handleWatchAndShopping}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label labelName="Show On Home Page"></Label>
//             <CheckBox
//               value="showInHomePage"
//               label="Show On Home Page"
//               name="showInHomePage"
//               check={isNewArrivalOrBestSelling.showInHomePage}
//               handleCheckboxChange={handleShowInHomePage}
//             />
//           </VStack>
//         </div>

//         <Button
//           title={productId ? 'Update Product' : 'Add Product'}
//           onClick={addProductHandler}
//           loading={productId ? updateProductLoading : createProductLoading}
//           style={{width: '100%', marginTop: '20px'}}
//         />
//       </div>
//     </div>
//   )
// }

// import React, {useCallback, useEffect, useState, useRef} from 'react'
// import {useDispatch, useSelector} from 'src/store'
// import {useMedia, useParams} from 'src/hooks'
// import {
//   Button,
//   CheckBox,
//   HStack,
//   InputField,
//   Label,
//   SelectField,
//   TextEditor,
//   VStack
// } from 'src/app/common'
// import {
//   getCategoryListAction,
//   getSubCategoryAction
// } from '../../category/category.slice'
// import {
//   createProductAction,
//   createProductImageAction,
//   delteProductImageAction,
//   getAllProductVariantImagesAction,
//   getProductDetailByIdAction,
//   getProductListAction,
//   updateProductAction,
//   resetProductDetail
// } from '../product.slice'
// import {useRouter} from 'next/router'
// import {toast} from 'react-hot-toast'
// import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
// import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
// import {v4 as uuidv4} from 'uuid'
// import {FILE_URL} from 'src/config'
// import {resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'
// import { Trash2, X } from 'lucide-react'

// export const AddProductPage = () => {
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const productId = useParams('productId')
//   const hydratedProductIdRef = useRef<string | null>(null)

//   // Reset form function
//   const resetForm = useCallback(() => {
//     setData({
//       name: '',
//       originalPrice: '',
//       discountedPrice: '',
//       discountPercentage: '',
//       category: '',
//       subCategory: '',
//       nestedSubCategory: '',
//       images: [],
//       video: null,
//       description: '',
//       stockQuantity: ''
//     })
    
//     setImage([])
//     setColorCount(2)
//     setColorImage([{
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }])
//     setAllColorVariant([])
//     setSelectedCategory(null)
//     setSelectedSubCategory(null)
//     setSelectedNestedSubCategory(null)
//     setIsNewArrivalOrBestSelling({
//       isNewArrival: false,
//       isBestSelling: false,
//       isWatchAndShop: false,
//       showInHomePage: false
//     })
//     setIsHotSelling(false)
//     setProductVariantIdList([''])
//     setVideoFile(null)
//     setExistingVideoUrl('')
//     setVideoUploaderKey(Date.now())
//     hydratedProductIdRef.current = null
//   }, [])

//   const [image, setImage] = useState<any>([])
//   const [colorCount, setColorCount] = useState(2)
//   const [colorImage, setColorImage] = useState([
//     {
//       id: uuidv4(),
//       color: '',
//       image: {},
//       existingImagePath: ''
//     }
//   ])

//   const [allColorVariant, setAllColorVariant] = useState([])

//   const [data, setData] = useState<any>({
//     name: '',
//     originalPrice: '',
//     discountedPrice: '',
//     discountPercentage: '',
//     category: '',
//     subCategory: '',
//     nestedSubCategory: '', 
//     images: [],
//     video: null,
//     description: '',
//     stockQuantity: ''
//   })

//   const [isNewArrivalOrBestSelling, setIsNewArrivalOrBestSelling] = useState({
//     isNewArrival: false,
//     isBestSelling: false,
//     isWatchAndShop: false,
//     showInHomePage: false
//   })

//   const [isHotSelling, setIsHotSelling] = useState(false)

//   // Category, SubCategory, and NestedSubCategory states
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const [selectedSubCategory, setSelectedSubCategory] = useState<any>()
//   const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>()
  
//   const [category, setCategory] = useState<any>()
//   const [subCategory, setSubCategory] = useState<any>()
//   const [nestedSubCategory, setNestedSubCategory] = useState<any>()

//   // Video states
//   const [videoFile, setVideoFile] = useState<File | null>(null)
//   const [existingVideoUrl, setExistingVideoUrl] = useState<string>('')
//   const [videoUploaderKey, setVideoUploaderKey] = useState<number>(Date.now())

//   const {
//     categoryData,
//     getCategoryLoading,
//     subCategoryData,
//     getSubCategoryLoading
//   }: any = useSelector((state: any) => state.category)

//   const {createProductLoading, updateProductLoading, productVariantList, productDetailData, productDetailLoading}: any =
//     useSelector((state: any) => state.product)
  
//   const [productVariantIdList, setProductVariantIdList] = useState([''])

//   // Calculate discounted price from original price and discount percentage
//   const calculateDiscountedPrice = useCallback((originalPrice: number, discountPercentage: number) => {
//     if (originalPrice && discountPercentage && discountPercentage > 0) {
//       const discountAmount = (originalPrice * discountPercentage) / 100
//       const finalPrice = originalPrice - discountAmount
//       return Math.round(finalPrice * 100) / 100
//     }
//     return ''
//   }, [])

//   // Calculate discount percentage from original price and discounted price
//   const calculateDiscountPercentage = useCallback((originalPrice: number, discountedPrice: number) => {
//     if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
//       const discountAmount = originalPrice - discountedPrice
//       const percentage = (discountAmount / originalPrice) * 100
//       return Math.round(percentage * 100) / 100
//     }
//     return ''
//   }, [])

//   // Handle price changes
//   const handlePriceChange = useCallback((field: string, value: string) => {
//     const numValue = value === '' ? '' : Number(value)
    
//     if (field === 'originalPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, originalPrice: numValue }
        
//         if (prev.discountPercentage && prev.discountPercentage !== '') {
//           const discounted = calculateDiscountedPrice(Number(numValue), Number(prev.discountPercentage))
//           newData.discountedPrice = discounted
//         }
//         else if (prev.discountedPrice && prev.discountedPrice !== '') {
//           const percentage = calculateDiscountPercentage(Number(numValue), Number(prev.discountedPrice))
//           newData.discountPercentage = percentage
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountPercentage') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountPercentage: numValue === '' ? '' : numValue }
        
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const discounted = calculateDiscountedPrice(Number(prev.originalPrice), numValue)
//           newData.discountedPrice = discounted
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountedPrice = ''
//         }
        
//         return newData
//       })
//     }
//     else if (field === 'discountedPrice') {
//       setData((prev: any) => {
//         const newData = { ...prev, discountedPrice: numValue === '' ? '' : numValue }
        
//         if (prev.originalPrice && prev.originalPrice !== '' && numValue !== '' && numValue > 0) {
//           const percentage = calculateDiscountPercentage(Number(prev.originalPrice), numValue)
//           newData.discountPercentage = percentage
//         } else if (numValue === '' || numValue === 0) {
//           newData.discountPercentage = ''
//         }
        
//         return newData
//       })
//     }
//   }, [calculateDiscountedPrice, calculateDiscountPercentage])

//   // Reset form when component mounts or productId changes
//   useEffect(() => {
//     if (!productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//     }
    
//     return () => {
//       dispatch(resetProductDetail())
//     }
//   }, [productId, resetForm, dispatch])

//   // Fetch product detail when productId exists
//   useEffect(() => {
//     if (productId) {
//       resetForm()
//       dispatch(resetProductDetail())
//       hydratedProductIdRef.current = null
//       dispatch(getProductDetailByIdAction({productId: productId as string}))
//     }
//   }, [productId, dispatch, resetForm])

//   useEffect(() => {
//     setProductVariantIdList(
//       productVariantList?.map((item: any, index: number) => {
//         return item._id
//       })
//     )
//   }, [productVariantList])

//   useEffect(() => {
//     dispatch(
//       getCategoryListAction({
//         onSuccess: () => console.log('categoryListtttt fetch Successfully')
//       })
//     )
//   }, [dispatch])

//   // Load product detail data when editing
//   useEffect(() => {
//     if (
//       productId &&
//       productDetailData &&
//       hydratedProductIdRef.current !== productId &&
//       Object.keys(productDetailData).length > 0
//     ) {
//       hydratedProductIdRef.current = productId as string
      
//       setSelectedCategory({
//         id: productDetailData?.category?.id,
//         label: productDetailData?.category?.name,
//         value: productDetailData?.category?.value
//       })
      
//       setSelectedSubCategory({
//         id: productDetailData?.subCategory?.id,
//         label: productDetailData?.subCategory?.name,
//         value: productDetailData?.subCategory?.value
//       })

//       if (productDetailData?.nestedSubCategory) {
//         setSelectedNestedSubCategory({
//           id: productDetailData?.nestedSubCategory?.id,
//           label: productDetailData?.nestedSubCategory?.name,
//           value: productDetailData?.nestedSubCategory?.value
//         })
//       }

//       setProductVariantIdList(
//         productDetailData?.images?.map((item: any, index: number) => {
//           return String(index)
//         })
//       )

//       setColorImage(() => {
//         if (productDetailData?.images && productDetailData.images.length > 0) {
//           return productDetailData?.images?.map((item: any, index: number) => {
//             const existingImages = Array.isArray(item.coloredImages)
//               ? item.coloredImages
//               : item.coloredImage
//               ? [item.coloredImage]
//               : []

//             return {
//               id: String(index),
//               color: item.colorName,
//               image: {},
//               existingImagePath: existingImages
//             }
//           })
//         }
//         return [{
//           id: uuidv4(),
//           color: '',
//           image: {},
//           existingImagePath: ''
//         }]
//       })

//       if (productDetailData?.video) {
//         const videoUrl = resolveProductVideoUrl(productDetailData.video)
//         setExistingVideoUrl(videoUrl)
//         setVideoFile(null)
//       } else {
//         setExistingVideoUrl('')
//         setVideoFile(null)
//       }

//       setData((prev: any) => ({
//         ...prev,
//         name: productDetailData?.name || '',
//         originalPrice: productDetailData?.originalPrice || '',
//         discountedPrice: productDetailData?.discountedPrice || '',
//         discountPercentage: productDetailData?.discountPercentage || '',
//         stockQuantity: productDetailData?.stockQuantity || '',
//         images: productDetailData?.images?.[0] || '',
//         description: productDetailData?.description || '',
//         video: productDetailData?.video || null
//       }))

//       setColorCount(productDetailData?.images?.length || 2)
//       setAllColorVariant(productDetailData?.images || [])

//       setIsNewArrivalOrBestSelling({
//         isBestSelling: productDetailData?.isBestSelling || false,
//         isNewArrival: productDetailData?.isNewArrivals || false,
//         isWatchAndShop: productDetailData?.isWatchAndShop || false,
//         showInHomePage: productDetailData?.showInHomePage || false
//       })

//       setIsHotSelling(productDetailData?.isHotSelling || false)
//     }
//   }, [productDetailData, productId])

//   // Map categories from API data
//   useEffect(() => {
//     const mappedCategory = categoryData?.map((item: any, index: number) => {
//       return {
//         id: item.id,
//         label: item.name,
//         value: item.name,
//         subCategory: item.subCategories
//       }
//     })
//     setCategory(mappedCategory)
//   }, [categoryData])

//   // Map subcategories when category changes
//   useEffect(() => {
//     const mappedSubCategory = selectedCategory?.subCategory?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name,
//           nestedSubCategories: item.subCategories || []
//         }
//       }
//     )
//     setSubCategory(mappedSubCategory)
//     if (!productId) {
//       setSelectedNestedSubCategory(null)
//     }
//   }, [selectedCategory, productId])

//   // Map nested subcategories when subcategory changes
//   useEffect(() => {
//     const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//       (item: any, index: number) => {
//         return {
//           id: item.id,
//           label: item.name,
//           value: item.name
//         }
//       }
//     )
//     setNestedSubCategory(mappedNestedSubCategory)
//   }, [selectedSubCategory])

//   // Load nested subcategories when editing
//   useEffect(() => {
//     if (productId && selectedSubCategory && productDetailData?.nestedSubCategory) {
//       const mappedNestedSubCategory = selectedSubCategory?.nestedSubCategories?.map(
//         (item: any, index: number) => {
//           return {
//             id: item.id,
//             label: item.name,
//             value: item.name
//           }
//         }
//       )
//       setNestedSubCategory(mappedNestedSubCategory)
//     }
//   }, [selectedSubCategory, productId, productDetailData])

//   const handleAction = (imageId: string) => {
//     dispatch(
//       delteProductImageAction({
//         productId: productId as string,
//         imageId: imageId as string,
//         onSuccess: () => {
//           toast.success('Product image deleted')
//           if (productId) {
//             dispatch(getProductDetailByIdAction({ productId: productId as string }))
//           }
//         }
//       })
//     )
//   }

//   // Add new color variant
//   const addColorVariant = () => {
//     setColorImage(prev => [
//       ...prev,
//       {
//         id: uuidv4(),
//         color: '',
//         image: {},
//         existingImagePath: ''
//       }
//     ])
//     setColorCount(prev => prev + 1)
//   }

//   // Remove color variant
//   const removeColorVariant = (index: number) => {
//     setColorImage(prev => prev.filter((_, i) => i !== index))
//     setColorCount(prev => Math.max(0, prev - 1))
//   }

//   // Remove video
//   const removeVideo = () => {
//     setVideoFile(null)
//     setExistingVideoUrl('')
//     setData((prev: any) => ({ ...prev, video: null }))
//     setVideoUploaderKey(Date.now())
//     toast.success('Video removed successfully')
//   }

//   const handleVideo = (event: any) => {
//     const selectedFile = event.target.files?.[0]
//     if (!selectedFile) return
//     if (!selectedFile.size) {
//       toast.error('Selected video file is empty')
//       return
//     }
    
//     const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
//     if (!validVideoTypes.includes(selectedFile.type)) {
//       toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)')
//       return
//     }
    
//     if (selectedFile.size > 100 * 1024 * 1024) {
//       toast.error('Video size should be less than 100MB')
//       return
//     }
    
//     setVideoFile(selectedFile)
//     setExistingVideoUrl('')
//     setData((prev: any) => ({...prev, video: selectedFile}))
//   }

//   const handlenewArrival = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({...prev, isNewArrival: item}))
//   }

//   const handleBestSelling = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isBestSelling: item
//     }))
//   }

//   const handleWatchAndShopping = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       isWatchAndShop: item
//     }))
//   }

//   const handleShowInHomePage = (item: any) => {
//     setIsNewArrivalOrBestSelling((prev: any) => ({
//       ...prev,
//       showInHomePage: item
//     }))
//   }

//   const getActiveVariantSlots = () =>
//     colorImage.slice(0, Math.max(1, Number(colorCount) || colorImage.length))

//   // FIXED: Updated function to properly handle image updates
//   const appendColorVariantsToFormData = (formData: FormData, isUpdate: boolean) => {
//     const slots = getActiveVariantSlots();

//     // Prepare variants metadata
//     const variantsMeta = slots.map((item) => {
//       const hasNewFile =
//         (item?.image instanceof FileList && item.image.length > 0) ||
//         item?.image instanceof File;

//       let existingImages: string[] = [];
      
//       if (Array.isArray(item?.existingImagePath)) {
//         existingImages = item.existingImagePath;
//       } else if (typeof item?.existingImagePath === 'string' && item.existingImagePath) {
//         existingImages = [item.existingImagePath];
//       }

//       return {
//         color: item?.color ?? '',
//         existingImages: existingImages,
//         hasNewImage: hasNewFile,
//       };
//     });

//     formData.append('variantsMeta', JSON.stringify(variantsMeta));
    
//     if (isUpdate) {
//       formData.append('replaceImages', 'true');
//     }

//     // Track processed colors to ensure we don't miss any
//     const processedColors = new Set();

//     // Process each variant and ensure we send data for all variants
//     slots.forEach((item, index) => {
//       const colorValue = item?.color ?? '';
      
//       if (!colorValue) {
//         console.warn(`Variant ${index + 1} has no color selected`);
//         return;
//       }

//       processedColors.add(colorValue);
      
//       // Handle new image uploads
//       if (item?.image instanceof FileList && item.image.length > 0) {
//         for (let f = 0; f < item.image.length; f++) {
//           formData.append('coloredImage', item.image[f]);
//           formData.append('colorName', colorValue);
//         }
//       } 
//       else if (item?.image instanceof File) {
//         formData.append('coloredImage', item.image);
//         formData.append('colorName', colorValue);
//       }
//       else if (Array.isArray(item?.existingImagePath) && item.existingImagePath.length > 0) {
//         // For existing images without new uploads, we still need to maintain the structure
//         // Send a placeholder to maintain array indices
//         for (let i = 0; i < item.existingImagePath.length; i++) {
//           formData.append('coloredImage', ''); // Empty string as placeholder
//           formData.append('colorName', colorValue);
//         }
//       }
//       else {
//         // Even if no images at all, send a placeholder to ensure the variant is processed
//         formData.append('coloredImage', '');
//         formData.append('colorName', colorValue);
//       }
//     });

//     // Log for debugging
//     console.log('Sending variants data:', {
//       variantsMeta,
//       processedColors: Array.from(processedColors),
//       totalSlots: slots.length
//     });
//   }

//   // Validate stock quantity
//   const validateStockQuantity = (value: string) => {
//     const numValue = Number(value)
//     if (value === '') return true
//     if (isNaN(numValue)) return false
//     if (numValue < 0) return false
//     if (!Number.isInteger(numValue)) return false
//     return true
//   }

//   const addProductHandler = (event: any) => {
//     event.preventDefault()
    
//     // Validation checks
//     if (!data.name || data.name.trim() === '') {
//       toast.error('Please enter product name')
//       return
//     }
    
//     if (!selectedCategory?.id) {
//       toast.error('Please select a category')
//       return
//     }
    
//     if (!selectedSubCategory?.id) {
//       toast.error('Please select a subcategory')
//       return
//     }
    
//     if (!data.originalPrice || Number(data.originalPrice) <= 0) {
//       toast.error('Please enter a valid original price')
//       return
//     }
    
//     if (!data.stockQuantity || data.stockQuantity === '') {
//       toast.error('Please enter stock quantity')
//       return
//     }
    
//     if (!validateStockQuantity(data.stockQuantity)) {
//       toast.error('Stock quantity must be a positive whole number')
//       return
//     }
    
//     if (Number(data.stockQuantity) < 0) {
//       toast.error('Stock quantity cannot be negative')
//       return
//     }

//     // Validate color variants
//     const activeSlots = getActiveVariantSlots()
//     if (activeSlots.length === 0) {
//       toast.error('Please add at least one color variant')
//       return
//     }
    
//     for (let i = 0; i < activeSlots.length; i++) {
//       if (!activeSlots[i].color) {
//         toast.error(`Please select color for variant ${i + 1}`)
//         return
//       }
      
//       // Check if there's either a new image or existing images
//       const hasNewImage = activeSlots[i].image instanceof File || 
//                          (activeSlots[i].image instanceof FileList && (activeSlots[i].image as any).length > 0)
//       const hasExistingImages = activeSlots[i].existingImagePath && 
//                                (Array.isArray(activeSlots[i].existingImagePath) 
//                                  ? activeSlots[i].existingImagePath.length > 0
//                                  : activeSlots[i].existingImagePath)
      
//       if (!hasNewImage && !hasExistingImages) {
//         toast.error(`Please upload at least one image for variant ${i + 1}`)
//         return
//       }
//     }
    
//     const formData = new FormData()

//     formData.append('name', data.name)
//     formData.append('category', selectedCategory?.id)
//     formData.append('subCategory', selectedSubCategory?.id)
    
//     if (selectedNestedSubCategory?.id) {
//       formData.append('nestedSubCategory', selectedNestedSubCategory.id)
//     }
    
//     formData.append('originalPrice', String(data.originalPrice))
//     formData.append('discountedPrice', String(data.discountedPrice || 0))
//     formData.append('discountPercentage', String(data.discountPercentage || 0))
//     formData.append('description', data.description || '')
    
//     // Handle video
//     if (videoFile instanceof File) {
//       formData.append('video', videoFile)
//     } else if (!existingVideoUrl && data.video === null) {
//       formData.append('removeVideo', 'true')
//     }
    
//     formData.append('stockQuantity', String(data.stockQuantity))
//     formData.append('isHotSelling', JSON.stringify(isHotSelling))

//     // Use the fixed function
//     appendColorVariantsToFormData(formData, !!productId)

//     formData.append(
//       'isBestSelling',
//       JSON.stringify(isNewArrivalOrBestSelling.isBestSelling)
//     )

//     formData.append(
//       'isNewArrivals',
//       JSON.stringify(isNewArrivalOrBestSelling.isNewArrival)
//     )

//     formData.append(
//       'isWatchAndShop',
//       JSON.stringify(isNewArrivalOrBestSelling.isWatchAndShop)
//     )

//     formData.append(
//       'showInHomePage',
//       JSON.stringify(isNewArrivalOrBestSelling.showInHomePage)
//     )

//     if (productId) {
//       dispatch(
//         updateProductAction({
//           productBody: formData,
//           productId: productId as any,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => console.log('get hit after updateee')
//               })
//             )
//             router.push('/dash-product')
//             toast.success('Product Updated Successfully')
//             resetForm()
//           },
//           onError: (error) => {
//             toast.error(error?.message || 'Failed to update product')
//           }
//         })
//       )
//     } else {
//       dispatch(
//         createProductAction({
//           productBody: formData,
//           onSuccess: () => {
//             dispatch(
//               getProductListAction({
//                 onSuccess: (data) => setData({})
//               })
//             )
//             router.push('/dash-product')
//             toast.success('Product Created Successfully')
//             resetForm()
//           },
//           onError: (error) => {
//             toast.error(error?.message || 'Failed to create product')
//           }
//         })
//       )
//     }
//   }

//   const media = useMedia();

//   // Show loading state while fetching product details
//   if (productId && productDetailLoading) {
//     return (
//       <div className="addProductContainer">
//         <div className="addProduct" style={{padding: '20px 12px', textAlign: 'center'}}>
//           Loading product details...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="addProductContainer">
//       <div className="addProduct" style={{padding:'20px 12px'}}>
//         <div className="addProduct-input">
//           <Label required labelName="Product Name"></Label>
//           <InputField
//             type="text"
//             placeholder="Enter Product Name"
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, name: e.target.value}))
//             }
//             value={data.name}
//           />
//         </div>

//         <div style={{display:'flex', gap:'12px', flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input">
//             <Label required labelName="Category"></Label>
//             <SelectField
//               options={category}
//               width={media.md ? "320px" : "100%"}
//               value={selectedCategory?.label !== undefined && selectedCategory}
//               onChangeValue={(data) => {
//                 setSelectedCategory(data)
//                 setSelectedSubCategory(null)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select Category'}
//             />
//           </div>

//           <div className="addProduct-input">
//             <Label required labelName="SubCategory"></Label>
//             <SelectField
//               options={subCategory}
//               width={media.md ? "320px" : "100%"}
//               onChangeValue={(data) => {
//                 setSelectedSubCategory(data)
//                 setSelectedNestedSubCategory(null)
//               }}
//               placeholder={'Select SubCategory'}
//               value={
//                 selectedSubCategory?.label !== undefined && selectedSubCategory
//               }
//             />
//           </div>
//         </div>

//         {/* Nested SubCategory Dropdown */}
//         {(nestedSubCategory && nestedSubCategory.length > 0) || selectedNestedSubCategory ? (
//           <div className="addProduct-input">
//             <Label labelName="Nested SubCategory (Optional)"></Label>
//             <SelectField
//               options={nestedSubCategory}
//               width="100%"
//               onChangeValue={(data) => setSelectedNestedSubCategory(data)}
//               placeholder={'Select Nested SubCategory'}
//               value={
//                 selectedNestedSubCategory?.label !== undefined && 
//                 selectedNestedSubCategory
//               }
//             />
//           </div>
//         ) : null}

//         <HStack justify="space-between" gap="$3" style={{flexDirection: !media.md ? 'column' : 'row'}}>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Original Price"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Original Price"
//               onChange={(e: any) => handlePriceChange('originalPrice', e.target.value)}
//               value={data.originalPrice}
//             />
//           </div>
//           <div className="addProduct-input" style={{flex: 1}}>
//             <Label required labelName="Discount Percentage (%)"></Label>
//             <InputField
//               type="number"
//               placeholder="Enter Discount Percentage"
//               onChange={(e: any) => handlePriceChange('discountPercentage', e.target.value)}
//               value={data.discountPercentage}
//             />
//           </div>
//         </HStack>

//         <div className="addProduct-input">
//           <Label required labelName="Discounted Price"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Discounted Price"
//             onChange={(e: any) => handlePriceChange('discountedPrice', e.target.value)}
//             value={data.discountedPrice}
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Stock Quantity"></Label>
//           <InputField
//             type="number"
//             placeholder="Enter Stock Quantity (must be a whole number)"
//             onChange={(e: any) => {
//               const value = e.target.value
//               if (validateStockQuantity(value) || value === '') {
//                 setData((prev: any) => ({
//                   ...prev,
//                   stockQuantity: value === '' ? '' : Number(value)
//                 }))
//               } else {
//                 toast.error('Stock quantity must be a positive whole number')
//               }
//             }}
//             value={data.stockQuantity}
//           />
//         </div>

//         <div className="addProduct-input">
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
//             <Label required labelName="Color Variants"></Label>
//             <Button
//               title="+ Add Variant"
//               onClick={addColorVariant}
//               style={{padding: '5px 15px', fontSize: '12px', width: 'auto'}}
//               type="button"
//             />
//           </div>
//         </div>

//         {colorImage.map((variant, index) => {
//           return (
//             <div
//               key={variant.id}
//               style={{
//                 display: 'flex', 
//                 gap: '12px', 
//                 flexDirection: !media.md ? 'column' : 'row', 
//                 marginBottom: '20px',
//                 position: 'relative',
//                 padding: '15px',
//                 border: '1px solid #e0e0e0',
//                 borderRadius: '8px',
//                 backgroundColor: '#f9f9f9'
//               }}
//             >
//               <div style={{minWidth: media.md ? '300px' : '100%', position: 'relative'}}>
//                 <ImageUploader
//                   key={index}
//                   uniqueKeys={index}
//                   defaultImage={
//                     productId && !!productDetailData && productDetailData?.images?.[index]
//                       ? productDetailData?.images[index]?.coloredImages || []
//                       : []
//                   }
//                   onImageChange={(event) => {
//                     setColorImage((prev) => {
//                       const existingList = [...prev]
//                       const currentObject = existingList[index] || {
//                         id: variant.id,
//                         color: '',
//                         image: {},
//                         existingImagePath: ''
//                       }

//                       existingList[index] = {
//                         ...currentObject,
//                         image: event.target.files,
//                         id: currentObject.id || uuidv4()
//                       }

//                       return existingList
//                     })
//                   }}
//                   value={colorImage[index]?.image ?? ''}
//                   actionHandler={handleAction}
//                 />
//               </div>

//               <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
//                 <div>
//                   <Label labelName="Color Picker" />
//                   <input
//                     type="color"
//                     style={{width: '200px', height: '200px', cursor: 'pointer'}}
//                     onChange={(e: any) => {
//                       setColorImage((prev) => {
//                         const existingList = [...prev]
//                         const currentObject = existingList[index] || {
//                           id: variant.id,
//                           color: '',
//                           image: '',
//                           existingImagePath: ''
//                         }
//                         existingList[index] = {
//                           ...currentObject,
//                           color: e.target.value
//                         }

//                         return existingList
//                       })
//                     }}
//                     value={colorImage[index]?.color || '#000000'}
//                   />
//                 </div>

//                 <Trash2 size={18} onClick={() => removeColorVariant(index)} style={{cursor:'pointer', marginTop: '24px'}}/>
//               </div>
//             </div>
//           )
//         })}

//         <div className="addProduct-input">
//           <Label required labelName="Product Detail"></Label>
//           <TextEditor
//             descriptionBody={data.description}
//             onChange={(e: any) =>
//               setData((prev: any) => ({...prev, description: e}))
//             }
//           />
//         </div>

//         <div className="addProduct-input">
//           <Label required labelName="Product Video"></Label>
//           <div style={{position: 'relative', display: 'inline-block', width: '100%'}}>
//             <VideoUploader
//               key={videoUploaderKey}
//               defaultVideo={existingVideoUrl}
//               onVideoChange={handleVideo}
//               actionHandler={(video: File) => {
//                 if (!video?.size) {
//                   toast.error('Selected video file is empty')
//                   return
//                 }
//                 handleVideo({ target: { files: [video] } })
//               }}
//             />
//             {(existingVideoUrl || videoFile) && (
//               <button
//                 onClick={removeVideo}
//                 style={{
//                   position: 'absolute',
//                   top: '-10px',
//                   right: '-10px',
//                   backgroundColor: '#dc2626',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: '28px',
//                   height: '28px',
//                   cursor: 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 10,
//                   transition: 'all 0.2s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = '#b91c1c'
//                   e.currentTarget.style.transform = 'scale(1.1)'
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = '#dc2626'
//                   e.currentTarget.style.transform = 'scale(1)'
//                 }}
//                 type="button"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div
//           className="addProduct-input"
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-start',
//             alignItems: 'center',
//             columnGap: '20%',
//             flexDirection: !media.md ? 'column' : 'row',
//             margin: '14px',
//             rowGap: '16px'
//           }}
//         >
//           <VStack gap="$3">
//             <Label required labelName="Is New Arrival"></Label>
//             <CheckBox
//               value="newArrival"
//               label="New Arrival"
//               name="newArrival"
//               check={isNewArrivalOrBestSelling.isNewArrival}
//               handleCheckboxChange={handlenewArrival}
//             />
//           </VStack>
//           <VStack gap="$3">
//             <Label required labelName="Is Best Selling?"></Label>
//             <CheckBox
//               value="best selling"
//               label="Best Selling"
//               name="bestselling"
//               check={isNewArrivalOrBestSelling.isBestSelling}
//               handleCheckboxChange={handleBestSelling}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label required labelName="Is Watch And Shopping?"></Label>
//             <CheckBox
//               value="isWatchAndShop"
//               label="Watch And Shop"
//               name="isWatchAndShop"
//               check={isNewArrivalOrBestSelling.isWatchAndShop}
//               handleCheckboxChange={handleWatchAndShopping}
//             />
//           </VStack>

//           <VStack gap="$3">
//             <Label labelName="Show On Home Page"></Label>
//             <CheckBox
//               value="showInHomePage"
//               label="Show On Home Page"
//               name="showInHomePage"
//               check={isNewArrivalOrBestSelling.showInHomePage}
//               handleCheckboxChange={handleShowInHomePage}
//             />
//           </VStack>
//         </div>

//         <Button
//           title={productId ? 'Update Product' : 'Add Product'}
//           onClick={addProductHandler}
//           loading={productId ? updateProductLoading : createProductLoading}
//           style={{width: '100%', marginTop: '20px'}}
//         />
//       </div>
//     </div>
//   )
// }

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'src/store'
import { useMedia, useParams } from 'src/hooks'
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
} from '../../category/category.slice'
import {
  createProductAction,
  delteProductImageAction,
  getProductDetailByIdAction,
  getProductListAction,
  updateProductAction,
  resetProductDetail
} from '../product.slice'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import ImageUploader from 'src/app/common/imageUploader/imageUploader.common'
import VideoUploader from 'src/app/common/videoUploader/videoUploader.common'
import { v4 as uuidv4 } from 'uuid'
import { resolveProductVideoUrl } from 'src/helpers/mediaUrl.helper'
import { Trash2, X } from 'lucide-react'

interface ColorVariant {
  id: string
  color: string
  newImages: Array<{ id: string; file: File }>
  existingImages: string[]
  deletedImages: string[]
}

export const AddProductPage: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const productId = useParams('productId')
  const hydratedProductIdRef = useRef<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    discountedPrice: '',
    discountPercentage: '',
    description: '',
    stockQuantity: ''
  })

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    {
      id: uuidv4(),
      color: '#000000',
      newImages: [],
      existingImages: [],
      deletedImages: []
    }
  ])
  const [deletedVariantImages, setDeletedVariantImages] = useState<string[]>([])

  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null)
  const [selectedNestedSubCategory, setSelectedNestedSubCategory] = useState<any>(null)
  const [categoryOptions, setCategoryOptions] = useState<any[]>([])
  const [subCategoryOptions, setSubCategoryOptions] = useState<any[]>([])
  const [nestedSubCategoryOptions, setNestedSubCategoryOptions] = useState<any[]>([])

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>('')
  const [videoUploaderKey, setVideoUploaderKey] = useState<number>(Date.now())

  const [featureFlags, setFeatureFlags] = useState({
    isNewArrival: false,
    isBestSelling: false,
    isWatchAndShop: false,
    showInHomePage: false
  })
  const [isHotSelling, setIsHotSelling] = useState<boolean>(false)

  const { categoryData }: any = useSelector((state: any) => state.category)
  const { 
    createProductLoading, 
    updateProductLoading, 
    productDetailData, 
    productDetailLoading 
  }: any = useSelector((state: any) => state.product)

  const media = useMedia()

  const resetForm = useCallback((): void => {
    setFormData({
      name: '',
      originalPrice: '',
      discountedPrice: '',
      discountPercentage: '',
      description: '',
      stockQuantity: ''
    })
    setColorVariants([
      {
        id: uuidv4(),
        color: '#000000',
        newImages: [],
        existingImages: [],
        deletedImages: []
      }
    ])
    setDeletedVariantImages([])
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setSelectedNestedSubCategory(null)
    setFeatureFlags({
      isNewArrival: false,
      isBestSelling: false,
      isWatchAndShop: false,
      showInHomePage: false
    })
    setIsHotSelling(false)
    setVideoFile(null)
    setExistingVideoUrl('')
    setVideoUploaderKey(Date.now())
  }, [])

  useEffect((): void => {
    dispatch(getCategoryListAction({ 
      onSuccess: (): void => console.log('Categories loaded successfully') 
    }))
  }, [dispatch])

  useEffect((): void | (() => void) => {
    resetForm()
    dispatch(resetProductDetail())
    hydratedProductIdRef.current = null

    if (productId) {
      dispatch(getProductDetailByIdAction({ productId: productId as string }))
    }

    return (): void => {
      dispatch(resetProductDetail())
    }
  }, [productId, resetForm, dispatch])

  useEffect((): void => {
    if (categoryData && Array.isArray(categoryData)) {
      const mapped = categoryData.map((item: any) => ({
        id: item.id,
        label: item.name,
        value: item.name,
        subCategory: item.subCategories || []
      }))
      setCategoryOptions(mapped)
    }
  }, [categoryData])

  useEffect((): void => {
    if (selectedCategory?.subCategory) {
      const mapped = selectedCategory.subCategory.map((item: any) => ({
        id: item.id,
        label: item.name,
        value: item.name,
        nestedSubCategories: item.subCategories || []
      }))
      setSubCategoryOptions(mapped)
    } else {
      setSubCategoryOptions([])
    }
    if (!productId) {
      setSelectedNestedSubCategory(null)
    }
  }, [selectedCategory, productId])

  useEffect((): void => {
    if (selectedSubCategory?.nestedSubCategories) {
      const mapped = selectedSubCategory.nestedSubCategories.map((item: any) => ({
        id: item.id,
        label: item.name,
        value: item.name
      }))
      setNestedSubCategoryOptions(mapped)
    } else {
      setNestedSubCategoryOptions([])
    }
  }, [selectedSubCategory])

  // Load product detail data
  useEffect((): void => {
    if (
      productId && 
      productDetailData && 
      hydratedProductIdRef.current !== productId && 
      Object.keys(productDetailData).length > 0
    ) {
      hydratedProductIdRef.current = productId as string
      
      if (productDetailData?.category) {
        setSelectedCategory({
          id: productDetailData.category.id,
          label: productDetailData.category.name,
          value: productDetailData.category.value,
          subCategory: productDetailData.category.subCategories
        })
      }
      
      if (productDetailData?.subCategory) {
        setSelectedSubCategory({
          id: productDetailData.subCategory.id,
          label: productDetailData.subCategory.name,
          value: productDetailData.subCategory.value,
          nestedSubCategories: productDetailData.subCategory.subCategories || []
        })
      }

      if (productDetailData?.nestedSubCategory) {
        setSelectedNestedSubCategory({
          id: productDetailData.nestedSubCategory.id,
          label: productDetailData.nestedSubCategory.name,
          value: productDetailData.nestedSubCategory.value
        })
      }

      // Set color variants with existing images
      if (productDetailData?.images && productDetailData.images.length > 0) {
        const variants: ColorVariant[] = productDetailData.images.map((item: any) => {
          let existingImages: string[] = []
          
          if (Array.isArray(item.coloredImages)) {
            existingImages = [...item.coloredImages]
          } else if (item.coloredImage) {
            existingImages = [item.coloredImage]
          }
          
          return {
            id: uuidv4(),
            color: item.colorName || '#000000',
            newImages: [],
            existingImages: existingImages,
            deletedImages: []
          }
        })
        setColorVariants(variants)
      }

      if (productDetailData?.video) {
        const videoUrl = resolveProductVideoUrl(productDetailData.video)
        setExistingVideoUrl(videoUrl)
        setVideoFile(null)
      }

      setFormData({
        name: productDetailData?.name || '',
        originalPrice: productDetailData?.originalPrice?.toString() || '',
        discountedPrice: productDetailData?.discountedPrice?.toString() || '',
        discountPercentage: productDetailData?.discountPercentage?.toString() || '',
        description: productDetailData?.description || '',
        stockQuantity: productDetailData?.stockQuantity?.toString() || ''
      })

      setFeatureFlags({
        isBestSelling: productDetailData?.isBestSelling || false,
        isNewArrival: productDetailData?.isNewArrivals || false,
        isWatchAndShop: productDetailData?.isWatchAndShop || false,
        showInHomePage: productDetailData?.showInHomePage || false
      })
      setIsHotSelling(productDetailData?.isHotSelling || false)
    }
  }, [productDetailData, productId])

  // Handle image deletion - IMMEDIATELY call API
  const handleImageDelete = useCallback((imageId: string, imagePath: string, variantIndex: number): void => {
    if (!productId) {
      toast.error('Cannot delete image: No product selected')
      return
    }
    
    // Call delete API immediately
    dispatch(
      delteProductImageAction({
        productId: productId as string,
        imageId: imageId,
        onSuccess: (): void => {
          toast.success('Image deleted successfully')
          
          const deletedKeys = [imagePath, imageId].filter(Boolean)

          // Remove from local state after successful deletion and remember the deletion for submit payloads
          setColorVariants((prev: ColorVariant[]): ColorVariant[] => {
            return prev.map((variant, index) => {
              if (index !== variantIndex) {
                return variant
              }

              const existingImages = variant.existingImages.filter((path: string): boolean => {
                const filename = path.split('/').pop() || path
                return !deletedKeys.includes(path) && !deletedKeys.includes(filename)
              })

              const deletedImages = Array.from(
                new Set([
                  ...variant.deletedImages,
                  ...deletedKeys,
                  ...deletedKeys.map((path) => path.split('/').pop() || path)
                ])
              )

              return {
                ...variant,
                existingImages,
                deletedImages
              }
            })
          })

          setDeletedVariantImages((current) =>
            Array.from(
              new Set([
                ...current,
                ...deletedKeys,
                ...deletedKeys.map((path) => path.split('/').pop() || path)
              ])
            )
          )
        }
      })
    )
  }, [productId, dispatch])

  const addColorVariant = useCallback((): void => {
    setColorVariants((prev: ColorVariant[]): ColorVariant[] => [
      ...prev,
      {
        id: uuidv4(),
        color: '#000000',
        newImages: [],
        existingImages: [],
        deletedImages: []
      }
    ])
  }, [])

  const removeColorVariant = useCallback((index: number): void => {
    setColorVariants((prev: ColorVariant[]): ColorVariant[] => {
      const removedVariant = prev[index]
      if (removedVariant?.existingImages?.length) {
        setDeletedVariantImages((current) =>
          Array.from(new Set([...current, ...removedVariant.existingImages]))
        )
      }

      return prev.filter((_, i: number): boolean => i !== index)
    })
  }, [colorVariants.length])

  const updateVariantColor = useCallback((index: number, color: string): void => {
    setColorVariants((prev: ColorVariant[]): ColorVariant[] => {
      const updated = [...prev]
      updated[index].color = color
      return updated
    })
  }, [])

  const handleVariantImageUpload = useCallback((index: number, files: Array<{ id: string; file: File }>): void => {
    if (!files || files.length === 0) return
    
    setColorVariants((prev: ColorVariant[]): ColorVariant[] =>
      prev.map((variant, idx) =>
        idx === index
          ? {
              ...variant,
              newImages: [...variant.newImages, ...files]
            }
          : variant
      )
    )
  }, [])

  const handleVariantNewImageRemove = useCallback((index: number, removedImageId: string): void => {
    setColorVariants((prev: ColorVariant[]): ColorVariant[] =>
      prev.map((variant, idx) =>
        idx === index
          ? {
              ...variant,
              newImages: variant.newImages.filter((image) => image.id !== removedImageId)
            }
          : variant
      )
    )
  }, [])

  const handlePriceChange = useCallback((field: string, value: string): void => {
    if (field === 'originalPrice') {
      setFormData((prev) => {
        const newData = { ...prev, originalPrice: value }
        if (prev.discountPercentage && prev.discountPercentage !== '') {
          const original = Number(value)
          const discountPercent = Number(prev.discountPercentage)
          const discounted = Math.round((original - (original * discountPercent / 100)) * 100) / 100
          newData.discountedPrice = discounted.toString()
        } else if (prev.discountedPrice && prev.discountedPrice !== '') {
          const original = Number(value)
          const discounted = Number(prev.discountedPrice)
          const discountPercent = Math.round(((original - discounted) / original) * 100 * 100) / 100
          newData.discountPercentage = discountPercent.toString()
        }
        return newData
      })
    } else if (field === 'discountPercentage') {
      setFormData((prev) => {
        const newData = { ...prev, discountPercentage: value }
        if (prev.originalPrice && prev.originalPrice !== '' && value !== '') {
          const original = Number(prev.originalPrice)
          const discountPercent = Number(value)
          const discounted = Math.round((original - (original * discountPercent / 100)) * 100) / 100
          newData.discountedPrice = discounted.toString()
        }
        return newData
      })
    } else if (field === 'discountedPrice') {
      setFormData((prev) => {
        const newData = { ...prev, discountedPrice: value }
        if (prev.originalPrice && prev.originalPrice !== '' && value !== '') {
          const original = Number(prev.originalPrice)
          const discounted = Number(value)
          const discountPercent = Math.round(((original - discounted) / original) * 100 * 100) / 100
          newData.discountPercentage = discountPercent.toString()
        }
        return newData
      })
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }, [])

  const validateStockQuantity = useCallback((value: string): boolean => {
    if (value === '') return true
    const numValue = Number(value)
    return !isNaN(numValue) && numValue >= 0 && Number.isInteger(numValue)
  }, [])

  const handleVideo = useCallback((event: any): void => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!validVideoTypes.includes(selectedFile.type)) {
      toast.error('Please select a valid video file')
      return
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error('Video size should be less than 100MB')
      return
    }
    
    setVideoFile(selectedFile)
    setExistingVideoUrl('')
  }, [])

  const removeVideo = useCallback((): void => {
    setVideoFile(null)
    setExistingVideoUrl('')
    setVideoUploaderKey(Date.now())
    toast.success('Video removed locally. Save the product to persist the removal.')
  }, [])

  const addProductHandler = useCallback(async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    
    if (!formData.name?.trim()) {
      toast.error('Please enter product name')
      return
    }
    
    if (!selectedCategory?.id) {
      toast.error('Please select a category')
      return
    }
    
    if (!selectedSubCategory?.id) {
      toast.error('Please select a subcategory')
      return
    }
    
    if (!formData.originalPrice || Number(formData.originalPrice) <= 0) {
      toast.error('Please enter a valid original price')
      return
    }
    
    if (!formData.stockQuantity || formData.stockQuantity === '') {
      toast.error('Please enter stock quantity')
      return
    }
    
    if (!validateStockQuantity(formData.stockQuantity) || Number(formData.stockQuantity) < 0) {
      toast.error('Stock quantity must be a positive whole number')
      return
    }

    for (let i = 0; i < colorVariants.length; i++) {
      const variant = colorVariants[i]
      if (!variant.color) {
        toast.error(`Please select color for variant ${i + 1}`)
        return
      }
    }
    
    const submitData = new FormData()
    
    submitData.append('name', formData.name)
    submitData.append('category', selectedCategory.id)
    submitData.append('subCategory', selectedSubCategory.id)
    if (selectedNestedSubCategory?.id) {
      submitData.append('nestedSubCategory', selectedNestedSubCategory.id)
    }
    submitData.append('originalPrice', formData.originalPrice)
    submitData.append('discountedPrice', formData.discountedPrice || '0')
    submitData.append('discountPercentage', formData.discountPercentage || '0')
    submitData.append('description', formData.description || '')
    submitData.append('stockQuantity', formData.stockQuantity)
    submitData.append('isHotSelling', JSON.stringify(isHotSelling))
    submitData.append('isBestSelling', JSON.stringify(featureFlags.isBestSelling))
    submitData.append('isNewArrivals', JSON.stringify(featureFlags.isNewArrival))
    submitData.append('isWatchAndShop', JSON.stringify(featureFlags.isWatchAndShop))
    submitData.append('showInHomePage', JSON.stringify(featureFlags.showInHomePage))
    
    if (videoFile) {
      submitData.append('video', videoFile)
    } else if (productId && !existingVideoUrl) {
      submitData.append('removeVideo', 'true')
    }
    
    // Send only existing images (not deleted ones)
    const variantsMeta = colorVariants.map((variant) => ({
      color: variant.color,
      existingImages: variant.existingImages, // These are the images that still exist
      deletedImages: variant.deletedImages,
      hasNewImage: variant.newImages.length > 0
    }))
    submitData.append('variantsMeta', JSON.stringify(variantsMeta))
    submitData.append('deletedVariantImages', JSON.stringify(deletedVariantImages))
    
    // Append new images
    colorVariants.forEach((variant) => {
      variant.newImages.forEach((image) => {
        submitData.append('coloredImage', image.file)
        submitData.append('colorName', variant.color)
      })
    })
    
    if (productId) {
      dispatch(updateProductAction({
        productBody: submitData,
        productId: productId as any,
        onSuccess: (): void => {
          dispatch(getProductListAction({ onSuccess: (): void => {} }))
          router.push('/dash-product')
          toast.success('Product Updated Successfully')
          resetForm()
        },
        onError: (error: any): void => {
          toast.error(error?.message || 'Failed to update product')
        }
      }))
    } else {
      dispatch(createProductAction({
        productBody: submitData,
        onSuccess: (): void => {
          dispatch(getProductListAction({ onSuccess: (): void => {} }))
          router.push('/dash-product')
          toast.success('Product Created Successfully')
          resetForm()
        },
        onError: (error: any): void => {
          toast.error(error?.message || 'Failed to create product')
        }
      }))
    }
  }, [formData, selectedCategory, selectedSubCategory, selectedNestedSubCategory, colorVariants, videoFile, existingVideoUrl, isHotSelling, featureFlags, productId, dispatch, router, resetForm, validateStockQuantity])

  if (productId && productDetailLoading) {
    return (
      <div className="addProductContainer">
        <div className="addProduct" style={{ padding: '20px 12px', textAlign: 'center' }}>
          Loading product details...
        </div>
      </div>
    )
  }

  return (
    <div className="addProductContainer">
      <div className="addProduct" style={{ padding: '20px 12px' }}>
        <form onSubmit={addProductHandler}>
          <div className="addProduct-input">
            <Label required labelName="Product Name" />
            <InputField
              type="text"
              placeholder="Enter Product Name"
              onChange={(e: any): void => handlePriceChange('name', e.target.value)}
              value={formData.name}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexDirection: !media.md ? 'column' : 'row' }}>
            <div className="addProduct-input">
              <Label required labelName="Category" />
              <SelectField
                options={categoryOptions}
                width={media.md ? "320px" : "100%"}
                value={selectedCategory}
                onChangeValue={(data: any): void => {
                  setSelectedCategory(data)
                  setSelectedSubCategory(null)
                  setSelectedNestedSubCategory(null)
                }}
                placeholder="Select Category"
              />
            </div>

            <div className="addProduct-input">
              <Label required labelName="SubCategory" />
              <SelectField
                options={subCategoryOptions}
                width={media.md ? "320px" : "100%"}
                onChangeValue={(data: any): void => {
                  setSelectedSubCategory(data)
                  setSelectedNestedSubCategory(null)
                }}
                placeholder="Select SubCategory"
                value={selectedSubCategory}
              />
            </div>
          </div>

          {(nestedSubCategoryOptions.length > 0 || selectedNestedSubCategory) && (
            <div className="addProduct-input">
              <Label labelName="Nested SubCategory (Optional)" />
              <SelectField
                options={nestedSubCategoryOptions}
                width="100%"
                onChangeValue={(data: any): void => setSelectedNestedSubCategory(data)}
                placeholder="Select Nested SubCategory"
                value={selectedNestedSubCategory}
              />
            </div>
          )}

          <HStack justify="space-between" gap="$3" style={{ flexDirection: !media.md ? 'column' : 'row' }}>
            <div className="addProduct-input" style={{ flex: 1 }}>
              <Label required labelName="Original Price" />
              <InputField
                type="number"
                placeholder="Enter Original Price"
                onChange={(e: any): void => handlePriceChange('originalPrice', e.target.value)}
                value={formData.originalPrice}
              />
            </div>
            <div className="addProduct-input" style={{ flex: 1 }}>
              <Label required labelName="Discount Percentage (%)" />
              <InputField
                type="number"
                placeholder="Enter Discount Percentage"
                onChange={(e: any): void => handlePriceChange('discountPercentage', e.target.value)}
                value={formData.discountPercentage}
              />
            </div>
          </HStack>

          <div className="addProduct-input">
            <Label required labelName="Discounted Price" />
            <InputField
              type="number"
              placeholder="Enter Discounted Price"
              onChange={(e: any): void => handlePriceChange('discountedPrice', e.target.value)}
              value={formData.discountedPrice}
            />
          </div>

          <div className="addProduct-input">
            <Label required labelName="Stock Quantity" />
            <InputField
              type="number"
              placeholder="Enter Stock Quantity (must be a whole number)"
              onChange={(e: any): void => {
                const value = e.target.value
                if (validateStockQuantity(value) || value === '') {
                  handlePriceChange('stockQuantity', value)
                } else {
                  toast.error('Stock quantity must be a positive whole number')
                }
              }}
              value={formData.stockQuantity}
            />
          </div>

          <div className="addProduct-input">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <Label required labelName="Color Variants" />
              <Button
                title="+ Add Variant"
                onClick={addColorVariant}
                style={{ padding: '5px 15px', fontSize: '12px', width: 'auto' }}
                type="button"
              />
            </div>
          </div>

          {colorVariants.map((variant: ColorVariant, index: number) => (
            <div
              key={variant.id}
              style={{
                display: 'flex',
                gap: '12px',
                flexDirection: !media.md ? 'column' : 'row',
                marginBottom: '20px',
                position: 'relative',
                padding: '15px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}

            >
              <div style={{ minWidth: media.md ? '300px' : '100%' }}>
                <ImageUploader
                  key={`uploader_${variant.id}`}
                  uniqueKeys={`image-uploader-${variant.id}`}
                  defaultImages={variant.existingImages}
                  onImageChange={(): void => {}}
                  onNewImageUpload={(newImages): void => handleVariantImageUpload(index, newImages)}
                  onImageRemove={(imageId: string, imagePath: string): void => handleImageDelete(imageId, imagePath, index)}
                  onNewImageRemove={(imageId: string): void => handleVariantNewImageRemove(index, imageId)}
                  colorName={variant.color}
                />
                {variant.newImages.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
                    {variant.newImages.length} new image(s) ready to upload
                  </div>
                )}
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
                  Total: {variant.existingImages.length + variant.newImages.length} image(s)
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <Label labelName="Color Picker" />
                  <input
                    type="color"
                    style={{ width: '200px', height: '200px', cursor: 'pointer' }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => updateVariantColor(index, e.target.value)}
                    value={variant.color}
                  />
                </div>

                <Trash2 
                  size={18} 
                  onClick={(): void => removeColorVariant(index)} 
                  style={{ cursor: 'pointer', marginTop: '24px' }}
                />
              </div>
            </div>
          ))}

          <div className="addProduct-input">
            <Label required labelName="Product Detail" />
            <TextEditor
              descriptionBody={formData.description}
              onChange={(e: any): void => handlePriceChange('description', e)}
            />
          </div>

          <div className="addProduct-input">
            <Label labelName="Product Video" />
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <VideoUploader
                key={videoUploaderKey}
                defaultVideo={existingVideoUrl}
                onVideoChange={handleVideo}
                actionHandler={(video: File): void => {
                  if (!video?.size) {
                    toast.error('Selected video file is empty')
                    return
                  }
                  handleVideo({ target: { files: [video] } })
                }}
              />
              {(existingVideoUrl || videoFile) && (
                <button
                  onClick={removeVideo}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="addProduct-input" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            columnGap: '20%',
            flexDirection: !media.md ? 'column' : 'row',
            margin: '14px',
            rowGap: '16px'
          }}>
            <VStack gap="$3">
              <Label labelName="Is New Arrival" />
              <CheckBox
                value="newArrival"
                label="New Arrival"
                name="newArrival"
                check={featureFlags.isNewArrival}
                handleCheckboxChange={(item: boolean): void => 
                  setFeatureFlags((prev) => ({ ...prev, isNewArrival: item }))
                }
              />
            </VStack>
            
            <VStack gap="$3">
              <Label labelName="Is Best Selling?" />
              <CheckBox
                value="best selling"
                label="Best Selling"
                name="bestselling"
                check={featureFlags.isBestSelling}
                handleCheckboxChange={(item: boolean): void => 
                  setFeatureFlags((prev) => ({ ...prev, isBestSelling: item }))
                }
              />
            </VStack>

            <VStack gap="$3">
              <Label labelName="Is Watch And Shopping?" />
              <CheckBox
                value="isWatchAndShop"
                label="Watch And Shop"
                name="isWatchAndShop"
                check={featureFlags.isWatchAndShop}
                handleCheckboxChange={(item: boolean): void => 
                  setFeatureFlags((prev) => ({ ...prev, isWatchAndShop: item }))
                }
              />
            </VStack>

            <VStack gap="$3">
              <Label labelName="Show On Home Page" />
              <CheckBox
                value="showInHomePage"
                label="Show On Home Page"
                name="showInHomePage"
                check={featureFlags.showInHomePage}
                handleCheckboxChange={(item: boolean): void => 
                  setFeatureFlags((prev) => ({ ...prev, showInHomePage: item }))
                }
              />
            </VStack>
          </div>

          <Button
            title={productId ? 'Update Product' : 'Add Product'}
            type="submit"
            loading={productId ? updateProductLoading : createProductLoading}
            style={{ width: '100%', marginTop: '20px' }}
          />
        </form>
      </div>
    </div>
  )
}

export default AddProductPage