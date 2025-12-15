import React, {useState, useEffect, useCallback, useRef} from 'react'
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineDelete
} from 'react-icons/ai'
import {
  Button,
  HStack,
  InputField,
  Label,
  SelectField,
  VStack
} from 'src/app/common'
import {useParams} from 'src/hooks'
import {useDispatch, useSelector} from 'src/store'
import {
  createSubCategoryAction,
  getSubCategoryListAction,
  updateSubCategoryAction
} from '../../subCategory/subCategory.slice'
import {
  createCategoryAction,
  getCategoryDetailByIdAction,
  getSubCategoryAction,
  updateCategoryAction
} from '../category.slice'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

// Image Uploader Component
const ImageUploader = ({onImageSelect, initialImage = null, error = null}) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState(initialImage)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage)
      if (typeof initialImage === 'string') {
        setPreviewUrl(initialImage)
      } else {
        const url = URL.createObjectURL(initialImage)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
      }
    }
  }, [initialImage])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onImageSelect(file)
    } else {
      toast.error('Please select a valid image file')
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{display: 'none', height: 'auto !important'}}
      />

      {previewUrl ? (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" className="preview-image" />
          <div className="image-overlay">
            <button
              type="button"
              onClick={removeImage}
              className="remove-image-btn"
              title="Remove image"
            >
              <AiOutlineDelete size={20} />
            </button>
            <button
              type="button"
              onClick={openFileDialog}
              className="change-image-btn"
              title="Change image"
            >
              <AiOutlineCloudUpload size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${
            error ? 'error' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <AiOutlineCloudUpload size={48} className="upload-icon" />
          <p className="upload-text">
            <span className="upload-main-text">Click to upload</span> or drag
            and drop
          </p>
          <p className="upload-sub-text">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  )
}

export const AddCategoryPage = () => {
  const categoryId = useParams('categoryId')
  const navigate = useNavigate()
  const [data, setData] = useState<any>({
    name: '',
    subCategories: [],
    image: null
  })
  const [imageError, setImageError] = useState(null)
  const dispatch = useDispatch()
  const [subCategories, setSubCategories] = useState([])
  const [eachSubCat, setEachSubCat] = useState('')
  const [subCategoryOption, setSubCategoryOption] = useState()
  const [selectedSubCategoryOption, setSelectedSubCategoryOption] = useState([])
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState([])

  const {
    categoryData,
    getCategoryLoading,
    createCategoryLoading,
    updateCategoryLoading,
    getSubCategoryLoading,
    subCategoryData,
    categoryDetailData
  }: any = useSelector((state: any) => state.category)

  useEffect(() => {
    console.log(eachSubCat, 'eachSubCat')
  }, [eachSubCat])

  useEffect(() => {
    console.log(subCategories, 'subCatgories')
  }, [subCategories])

  const handleInputChange = (e: any) => {
    setEachSubCat(e.target.value)
  }

  const handleImageSelect = (file) => {
    setData((prev: any) => ({
      ...prev,
      image: file
    }))
    setImageError(null)
  }

  const deleteSubCategory = (id: number) => {
    const remainingSubCategory = subCategories.filter(
      (item: string, index: number) => {
        return index !== id
      }
    )
    setSubCategories(remainingSubCategory)
  }

  const validateForm = () => {
    if (!data.name.trim()) {
      toast.error('Category name is required')
      return false
    }

    if (!categoryId && !data.image) {
      setImageError('Category image is required')
      return false
    }

    return true
  }

  const addCategoryHandler = () => {
    if (!validateForm()) return

    const formData = new FormData()
    formData.append('name', data.name)

    if (data.image) {
      formData.append('image', data.image)
    }

    // Append subcategories
    selectedSubCategoryId.forEach((id, index) => {
      formData.append(`subCategories[${index}]`, id.toString())
    })


if(categoryId ){
    dispatch(
      updateCategoryAction({
        categoryBody: formData, 
        categoryId:categoryId as any,// Use FormData instead of plain object
        onSuccess: () => {
          toast.success(
            categoryId
              ? 'Category Updated Successfully'
              : 'Category Created Successfully'
          )
          navigate('/dash-category')
        },
        onError: (error) => {
          toast.error(error?.message || 'Something went wrong')
        }
      })
    )
}else{
    dispatch(
      createCategoryAction({
        categoryBody: formData, // Use FormData instead of plain object
        onSuccess: () => {
          toast.success(
            categoryId
              ? 'Category Updated Successfully'
              : 'Category Created Successfully'
          )
          navigate('/dash-category')
        },
        onError: (error) => {
          toast.error(error?.message || 'Something went wrong')
        }
      })
    )
}





    
  }

  useEffect(() => {
    dispatch(getSubCategoryAction({}))
    categoryId &&
      dispatch(getCategoryDetailByIdAction({categoryId: categoryId as string}))
  }, [])

  const remappedSubCategoryAction = useCallback(() => {
    const modifiedSubCategoryList = subCategoryData?.map(
      (item: any, index: number) => {
        return {
          id: item.id,
          label: item.name,
          value: item.name
        }
      }
    )
    console.log(modifiedSubCategoryList, 'modified Sub Category List')
    setSubCategoryOption(modifiedSubCategoryList)
  }, [subCategoryData])

  useEffect(() => {
    remappedSubCategoryAction()

    if (categoryId && categoryDetailData) {
      setData((prev: any) => ({
        ...prev,
        name: categoryDetailData?.name,
        image: categoryDetailData?.image // Set existing image for edit mode
      }))

      const remappedCategoryDetail = categoryDetailData?.subCategories?.map(
        (item: any, index: number) => {
          return {
            id: item.id,
            label: item.name,
            value: item.name
          }
        }
      )

      console.log(remappedCategoryDetail, 'remappedcategory detail')
      setSelectedSubCategoryOption(remappedCategoryDetail || [])
    }
  }, [subCategoryData, categoryDetailData, categoryId])

  useEffect(() => {
    console.log(subCategoryOption, 'subCategory option')
  }, [subCategoryOption])

  useEffect(() => {
    console.clear()
    console.log(
      selectedSubCategoryOption,
      'selectedSub Category Option changed'
    )
    const selectedSubCategoryId = selectedSubCategoryOption?.map(
      (item: any) => {
        return item.id
      }
    )

    setSelectedSubCategoryId(selectedSubCategoryId || [])
  }, [selectedSubCategoryOption])

  return (
    <div className="addCategoryContainer"
    style={{padding:'20px 12px'}}
    >
      <VStack className="addCategory" gap="$3">
        <VStack gap="$2">
          <Label required labelName="Category Name"></Label>
          <InputField
            type="text"
            placeholder="Enter Category Name"
            onChange={(e: any) =>
              setData((prev: any) => ({
                ...prev,
                name: e.target.value
              }))
            }
            value={data.name}
          ></InputField>
        </VStack>

        <VStack gap="$2">
          <Label required labelName="Category Image"></Label>
          <ImageUploader
            onImageSelect={handleImageSelect}
            initialImage={data.image}
            error={imageError}
          />
        </VStack>

        <VStack className="addCategory-subCategory" gap="$4">
          <VStack gap="$2">
            <Label required labelName="SubCategories"></Label>
            <SelectField
              options={subCategoryOption && subCategoryOption}
              value={selectedSubCategoryOption}
              isSearchable={true}
              isMulti={true}
              onChangeValue={(data) => {
                setSelectedSubCategoryOption(data)
              }}
              placeholder="Select SubCategory"
            ></SelectField>
          </VStack>
        </VStack>

        <Button
          title={categoryId ? 'Update Category' : 'Add Category'}
          onClick={addCategoryHandler}
          loading={categoryId ? updateCategoryLoading : createCategoryLoading}
        ></Button>
      </VStack>

      <style>{`
        .image-uploader {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          // padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f9fafb;
          // min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .upload-area.drag-active {
          border-color: #3b82f6;
          background-color: #dbeafe;
          transform: scale(1.02);
        }

        .upload-area.error {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .upload-icon {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .upload-area:hover .upload-icon {
          color: #3b82f6;
        }

        .upload-text {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          color: #374151;
        }

        .upload-main-text {
          font-weight: 600;
          color: #3b82f6;
        }

        .upload-sub-text {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          max-width: 300px;
          margin: 0 auto;
        }

        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview:hover .image-overlay {
          opacity: 1;
        }

        .remove-image-btn,
        .change-image-btn {
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #374151;
        }

        .remove-image-btn:hover {
          background-color: #ef4444;
          color: white;
        }

        .change-image-btn:hover {
          background-color: #3b82f6;
          color: white;
        }

        .error-text {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .upload-area {
            padding: 1.5rem 1rem;
            // min-height: 150px;
          }

          .image-overlay {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
