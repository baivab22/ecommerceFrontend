
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
// import { useRouter } from 'next/router'
import { useNavigate, useLocation } from 'react-router-dom'
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
  // const router = useRouter()
    const navigate = useNavigate()
    const location = useLocation()
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
          navigate('/dash-product' + location.search)
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
          navigate('/dash-product' + location.search)
          toast.success('Product Created Successfully')
          resetForm()
        },
        onError: (error: any): void => {
          toast.error(error?.message || 'Failed to create product')
        }
      }))
    }
  }, [formData, selectedCategory, selectedSubCategory, selectedNestedSubCategory, colorVariants, videoFile, existingVideoUrl, isHotSelling, featureFlags, productId, dispatch, navigate, resetForm, validateStockQuantity])

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