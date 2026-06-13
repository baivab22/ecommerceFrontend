// import React, {useEffect, useRef, useState} from 'react'
// import {AiFillCamera, AiFillCloseCircle} from 'react-icons/ai'
// import {TbCameraPlus} from 'react-icons/tb'
// import StateManagedSelect from 'react-select/dist/declarations/src/stateManager'
// import {BASE_URL, FILE_URL} from 'src/config'

// const ImageUploader = React.memo(
//   ({
//     onImageChange,
//     value,
//     defaultImage,
//     actionHandler,
//     isBanner,
//     uniqueKeys
//   }: {
//     onImageChange: (e: any) => void
//     value?: any
//     defaultImage?: any
//     actionHandler: any
//     isBanner?: boolean
//     uniqueKeys?: any
//   }) => {
//     // Add more URLs as needed
//     const [selectedImages, setSelectedImages] = useState([])
//     const [files, setFiles] = useState([])

//     const closeClickHandlerRef = useRef<any>(false)
//     console.log(defaultImage, 'default Imagesssssss outside')
//     useEffect(() => {
//       console.log(
//         defaultImage,
//         !!defaultImage && defaultImage.length > 0,
//         !closeClickHandlerRef.current,
//         'default Imagesssssss'
//       )
//       if (!closeClickHandlerRef.current) {
//         if (!!defaultImage && defaultImage.length > 0) {
//           const remappedFiles = defaultImage?.map(
//             (item: any, index: number) => ({
           

//               file: isBanner
//                 ? `${FILE_URL}/${item}`
//                 : `${FILE_URL}/products/${item?.coloredImage}`,
//               id: isBanner ? item : item?._id
//             })
//           )

//           console.log(defaultImage, remappedFiles, 'remapped files value')

//           console.log('selected image hai 2', remappedFiles)
//           // closeClickHandlerRef.current = true
//           setSelectedImages(remappedFiles)
//         }
//       }
//     }, [defaultImage])

//     console.log('default images data value', defaultImage)

//     const handleImageUpload = (e: any) => {
//       e.stopPropagation()

//       console.log('handleImagecalled', 'handleImagecalled')

//       onImageChange && onImageChange(e)

//       const files = Array.from(e.target.files)

//       const newImages = files.map((file: any, index: number) => ({
//         file: URL.createObjectURL(file),
//         isNew: true,
//         id: Math.random()
//       }))

//       console.log(newImages, 'newImages from cmp')

//       closeClickHandlerRef.current = true

//       setSelectedImages((prev: any) => [...prev, ...newImages])
//     }

//     // useEffect(() => {
//     //   console.log(selectedImages, 'selected iamges from iamge uploader')
//     //   onImageChange && onImageChange(selectedImages)
//     // }, [selectedImages])

//     const handleRemoveImage = (id: any, isNew: boolean) => {
//       console.log(id, ' product id ')

//       console.log('handle remove image called',!isNew, id, selectedImages)

//       // !isNew ? actionHandler && actionHandler(id) : null


//       actionHandler(id)

//       const updatedImages = selectedImages?.filter(
//         (image: any) => image.id !== id
//       )

//       console.log(updatedImages, 'updated images')
//       setSelectedImages(updatedImages)
//     }

//     console.log(selectedImages, 'selected images hai')

//     useEffect(() => {
//       // console.log(selectedImages, 'seelcted images from upload image component')

//       return () => {
//         // Cleanup logic, e.g., clear setImages
//         // setSelectedImages([])
//       }
//     }, [selectedImages, files])

//     console.log(selectedImages, 'selectedImages from cmp')

//     return (
//       <div className="image-uploader">
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleImageUpload}
//           className="image-uploader-input"
//           id={uniqueKeys}
//           // value={value && value}

//           key={Math.random()}
//         />
//         <label htmlFor={uniqueKeys}>
//           {selectedImages.length <= 0 ? (
//             <div className="imageUploader-placeholder">
//               <TbCameraPlus size={40}></TbCameraPlus>
//               <p>Click here to upload the image</p>
//             </div>
//           ) : (
//             <div className="afterUpload">
//               <TbCameraPlus size={40}></TbCameraPlus>
//             </div>
//           )}
//         </label>

//         <div className="image-list" key={Math.random()}>
//           {selectedImages?.map((image, index) => (
//             <span key={index} className="image-list-item">
//               <img
//                 src={image.file}
//                 alt="Selected"
//                 className="image-list-item-preview"
//                 onChange={(e: any) => e.stopPropagation()}
//               />
//               <button
//                 onClick={(e: any) => {
//                   e.preventDefault()
//                   handleRemoveImage(image.id, image.isNew)
//                 }}
//                 className="image-list-item-button"
//               >
//                 <AiFillCloseCircle color="red" size={20}></AiFillCloseCircle>
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>
//     )
//   }
// )

// export default ImageUploader


import React, { useEffect, useRef, useState, useCallback } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { TbCameraPlus } from 'react-icons/tb'
import { FILE_URL } from 'src/config'

interface ImageItem {
  file: string
  isNew: boolean
  id: string
  originalPath?: string
  originalFile?: File
}

interface ImageUploaderProps {
  onImageChange: (files: File[]) => void
  onNewImageUpload?: (newImages: { id: string; file: File }[]) => void
  onImageRemove?: (imageId: string, imagePath: string) => void
  onNewImageRemove?: (imageId: string) => void
  actionHandler?: (name: string) => void
  defaultImages?: string[]
  uniqueKeys?: string | number
  isBanner?: boolean
  isTestimonial?: boolean
  colorName?: string
}

const generateUniqueId = (prefix: string, index: number, suffix: string) => {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return `${prefix}_${window.crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now()}_${index}_${suffix.replace(/\s+/g, '_')}`
}

const ImageUploader = React.memo(({
  onImageChange,
  onNewImageUpload,
  onImageRemove,
  onNewImageRemove,
  actionHandler,
  defaultImages,
  uniqueKeys,
  colorName,
  isBanner,
  isTestimonial
}: ImageUploaderProps) => {
  const [existingImages, setExistingImages] = useState<ImageItem[]>([])
  const [newImages, setNewImages] = useState<ImageItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadKey, setUploadKey] = useState<number>(Date.now())

  const buildImageUrl = useCallback((imagePath: string): string => {
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath
    }
    if (isBanner) {
      return `${FILE_URL}/banners/${imagePath}`
    }
    if (isTestimonial) {
      return `${FILE_URL}/testimonial/${imagePath}`
    }
    return `${FILE_URL}/products/${imagePath}`
  }, [isBanner, isTestimonial])

  // Load default images
  useEffect(() => {
    const images = defaultImages ?? []
    if (images.length > 0) {
      const imageItems: ImageItem[] = images
        .filter((path) => typeof path === 'string' && path.length > 0)
        .map((path, index) => {
          const stringPath = path as string
          const filename = stringPath.split('/').pop() || stringPath
          return {
            file: buildImageUrl(stringPath),
            isNew: false,
            id: `existing_${index}_${filename}`,
            originalPath: stringPath
          }
        })

      setExistingImages(imageItems)
    } else {
      setExistingImages([])
    }
  }, [defaultImages, buildImageUrl])

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    onImageChange(files)
    
    const uploadedImages: ImageItem[] = files.map((file, index) => ({
      file: URL.createObjectURL(file),
      isNew: true,
      id: generateUniqueId('new', index, file.name),
      originalFile: file
    }))
    
    setNewImages((prev) => [...prev, ...uploadedImages])
    if (onNewImageUpload) {
      onNewImageUpload(uploadedImages.map(({ id, originalFile }) => ({ id, file: originalFile! })))
    }
    
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    
    setUploadKey(Date.now())
  }, [onImageChange, onNewImageUpload])

  // Handle image removal
  const handleRemoveImage = useCallback((image: ImageItem) => {
    // If it's an existing image from backend, call delete API
    if (!image.isNew && image.originalPath) {
      const imageId = image.originalPath.split('/').pop() || image.originalPath
      if (onImageRemove) {
        onImageRemove(imageId, image.originalPath)
      }
      if (actionHandler) {
        actionHandler(imageId)
      }
    }
    // If it's a new image (just selected), notify parent to remove from newImages
    else if (image.isNew && onNewImageRemove) {
      onNewImageRemove(image.id)
    }

    if (image.isNew) {
      setNewImages((prev) => prev.filter((img) => img.id !== image.id))
    } else {
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id))
    }

    if (image.isNew && image.file.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(image.file)
      } catch (e) {
        // ignore
      }
    }
  }, [onImageRemove, onNewImageRemove, actionHandler])

  // Cleanup
  useEffect(() => {
    return () => {
      [...existingImages, ...newImages].forEach(image => {
        if (image.isNew && image.file.startsWith('blob:')) {
          URL.revokeObjectURL(image.file)
        }
      })
    }
  }, [existingImages, newImages])

  const selectedImages = [...existingImages, ...newImages]

  return (
    <div className="image-uploader">
      <input
        ref={inputRef}
        key={uploadKey}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="image-uploader-input"
        id={String(uniqueKeys)}
      />
      
      {selectedImages.length > 0 && (
        <div className="image-list">
          {selectedImages.map((image, imageIndex) => (
            <span key={image.id} className="image-list-item">
              <img
                src={image.file}
                alt={`Selected ${imageIndex + 1}`}
                className="image-list-item-preview"
                loading="lazy"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleRemoveImage(image)
                }}
                className="image-list-item-button"
                aria-label="Remove image"
              >
                <AiFillCloseCircle color="red" size={20} />
              </button>
            </span>
          ))}
        </div>
      )}

      <label htmlFor={String(uniqueKeys)}>
        {selectedImages.length === 0 ? (
          <div className="imageUploader-placeholder">
            <TbCameraPlus size={40} />
            <p>Click here to upload the image</p>
          </div>
        ) : (
          <div className="afterUpload">
            <TbCameraPlus size={40} />
          </div>
        )}
      </label>
    </div>
  )
})

ImageUploader.displayName = 'ImageUploader'

export default ImageUploader