import React, {useEffect, useRef, useState} from 'react'
import {AiFillCamera, AiFillCloseCircle} from 'react-icons/ai'
import {TbCameraPlus} from 'react-icons/tb'
import StateManagedSelect from 'react-select/dist/declarations/src/stateManager'
import {FILE_URL} from 'src/config'

const ImageUploader = React.memo(
  ({
    onImageChange,
    value,
    defaultImage,
    actionHandler,
    isBanner,
    uniqueKeys
  }: {
    onImageChange: (e: any) => void
    value?: any
    defaultImage?: any
    actionHandler: any
    isBanner?: boolean
    uniqueKeys?: any
  }) => {
    // Add more URLs as needed
    const [selectedImages, setSelectedImages] = useState([])
    const [files, setFiles] = useState([])

    const closeClickHandlerRef = useRef<any>(false)
    console.log(defaultImage, 'default Imagesssssss outside')
    useEffect(() => {
      console.log(
        defaultImage,
        !!defaultImage && defaultImage.length > 0,
        !closeClickHandlerRef.current,
        'default Imagesssssss'
      )
      if (!closeClickHandlerRef.current) {
        if (!!defaultImage && defaultImage.length > 0) {
          const remappedFiles = defaultImage?.map(
            (item: any, index: number) => ({
              // file: isBanner
              //   ? import.meta.env.REACT_APP_DEV_URL/$

              //   `http://localehost:8000/${item}`
              //   : `http://localhost:8000/products/${item}`,
              // id: isBanner ? item : item._id

              file: isBanner
                ? `${FILE_URL}/${item}`
                : `${FILE_URL}/products/${item?.coloredImage}`,
              id: isBanner ? item : item?._id
            })
          )

          console.log(defaultImage, remappedFiles, 'remapped files value')

          console.log('selected image hai 2', remappedFiles)
          // closeClickHandlerRef.current = true
          setSelectedImages(remappedFiles)
        }
      }
    }, [defaultImage])

    console.log('default images data value', defaultImage)

    const handleImageUpload = (e: any) => {
      e.stopPropagation()

      console.log('handleImagecalled', 'handleImagecalled')

      onImageChange && onImageChange(e)

      const files = Array.from(e.target.files)

      const newImages = files.map((file: any, index: number) => ({
        file: URL.createObjectURL(file),
        isNew: true,
        id: Math.random()
      }))

      console.log(newImages, 'newImages from cmp')

      closeClickHandlerRef.current = true

      setSelectedImages((prev: any) => [...prev, ...newImages])
    }

    // useEffect(() => {
    //   console.log(selectedImages, 'selected iamges from iamge uploader')
    //   onImageChange && onImageChange(selectedImages)
    // }, [selectedImages])

    const handleRemoveImage = (id: any, isNew: boolean) => {
      console.log(id, ' product id ')

      console.log('handle remove image called',!isNew, id, selectedImages)

      // !isNew ? actionHandler && actionHandler(id) : null


      actionHandler(id)

      const updatedImages = selectedImages?.filter(
        (image: any) => image.id !== id
      )

      console.log(updatedImages, 'updated images')
      setSelectedImages(updatedImages)
    }

    console.log(selectedImages, 'selected images hai')

    useEffect(() => {
      console.log(selectedImages, 'seelcted images from upload image component')

      return () => {
        // Cleanup logic, e.g., clear setImages
        // setSelectedImages([])
      }
    }, [selectedImages, files])

    console.log(selectedImages, 'selectedImages from cmp')

    return (
      <div className="image-uploader">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="image-uploader-input"
          id={uniqueKeys}
          // value={value && value}

          key={Math.random()}
        />
        <label htmlFor={uniqueKeys}>
          {selectedImages.length <= 0 ? (
            <div className="imageUploader-placeholder">
              <TbCameraPlus size={40}></TbCameraPlus>
              <p>Click here to upload the image</p>
            </div>
          ) : (
            <div className="afterUpload">
              <TbCameraPlus size={40}></TbCameraPlus>
            </div>
          )}
        </label>

        <div className="image-list" key={Math.random()}>
          {selectedImages?.map((image, index) => (
            <span key={index} className="image-list-item">
              <img
                src={image.file}
                alt="Selected"
                className="image-list-item-preview"
                onChange={(e: any) => e.stopPropagation()}
              />
              <button
                onClick={(e: any) => {
                  e.preventDefault()
                  handleRemoveImage(image.id, image.isNew)
                }}
                className="image-list-item-button"
              >
                <AiFillCloseCircle color="red" size={20}></AiFillCloseCircle>
              </button>
            </span>
          ))}
        </div>
      </div>
    )
  }
)

export default ImageUploader
