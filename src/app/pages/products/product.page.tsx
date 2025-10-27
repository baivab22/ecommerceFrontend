import React, {useEffect, useState, useCallback, useRef} from 'react'
import {useDispatch} from 'src/store'
import {delteProductAction, getProductListAction} from './product.slice'
import {useSelector} from 'react-redux'
import {
  Box,
  Button,
  HStack,
  SearchField,
  SelectField,
  Table
} from 'src/app/common'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import {getCategoryListAction} from '../category/category.slice'
import {useDebounceValue} from 'src/hooks'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {FILE_URL} from 'src/config'
export const ProductListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchTxt, setSearchTxt] = useState('')

  const {data}: any = useSelector((state: any) => state.product)

  console.log(data, 'data')
  const [category, setCategory] = useState<any>([])
  const [selectedCateory, setSelectedCategory] = useState<any>('')
  const {categoryData}: any = useSelector((state: any) => state.category)

  useEffect(() => {
    dispatch(
      getCategoryListAction({
        onSuccess: () => console.log('categoryList fetch Successfully')
      })
    )
  }, [])

  useEffect(() => {
    const mappedCategory = categoryData?.map((item: any, index: number) => {
      return {
        id: item.id,
        label: item.name,
        value: item.name,
        subCategory: item.subCategories
      }
    })

    // const allCategory = [
    //   {},
    //   mappedCategory
    // ]

    // console.log(mappedCategory, 'mapped category from products')
    mappedCategory?.unshift({
      id: '',
      label: 'All',
      value: '',
      subCategory: ''
    })

    setCategory(mappedCategory)
  }, [categoryData])

  useEffect(() => {
    dispatch(
      getProductListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  const handleSearch = (e: any) => {
    // console.log(e.target.value, 'searchValue')
    setSearchTxt(e.target.value)

    // const debounceValue = useDebounceValue(e.target.value)
  }

  useEffect(() => {
    dispatch(
      getProductListAction({
        onSuccess: () => {},
        query: {search: searchTxt, categoryId: selectedCateory?.id}
      })
    )
  }, [searchTxt, selectedCateory])

  const proudctCardRef = useRef<HTMLDivElement | null>(null)
  const handlePdfDownload = () => {
    if (proudctCardRef.current) {
      html2canvas(proudctCardRef.current, {scale: 2, useCORS: true}).then(
        (canvas) => {
          // var drawingCanvas = document.getElementById(
          //   'canvas'
          // ) as HTMLCanvasElement
          console.log(canvas, 'canvas value')
          const aspectRatio = canvas.width / canvas.height
          var img = canvas.toDataURL('image/png')
          console.log(img, 'required img')

          var doc = new jsPDF({format: 'a4'})
          doc.setFillColor(255, 255, 255)
          doc.rect(
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height,
            'F'
          )

          doc.addImage(
            img,
            'JPEG',
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.width / aspectRatio
          )
          doc.save('productList.pdf')

          // Get the 2D rendering context of the canvas
        }
      )
    }
  }

  return (
    <div>
      <Box>
        <HStack justify="space-between" gap={'$4'} style={{margin: '20px 0'}}>
          <Button title="Add Product" onClick={() => navigate('add')}></Button>
          <Button title="Download Pdf" onClick={handlePdfDownload}></Button>
          <SearchField
            placeholder="Search Your Product"
            onChange={handleSearch}
          ></SearchField>
          <SelectField
            // defaultValue={category?.[0]}
            options={category}
            value={selectedCateory}
            width="320px"
            onChangeValue={(data) => setSelectedCategory(data)}
            placeholder={'Filter Product By Category'}
          />
        </HStack>
        <div ref={proudctCardRef}>
          <Table
            columns={[
              {
                field: 'name',
                name: 'Name',
                render: (datas) => {
                  return <div>{datas}</div>
                }
              },
              {
                field: 'discountedPrice',
                name: 'Price',
                render: (datas) => <div>{datas}</div>
              },
              {
                field: 'originalPrice',
                name: 'Original Price',
                render: (datas) => <div>{datas}</div>
              },
              // {
              //   field: 'discountPercentage',
              //   name: 'Discounted Price',
              //   render: (datas) => <div>{datas}</div>
              // },
              {
                field: 'images',
                name: 'Images',
                render: (datas) => (
                  <div>
                    <img
                      //@ts-ignore
                      // src={datas?[0]?.coloredImage[0]}

                      // src=`http://localhost:8000/products${datas.}`

                      src={`${FILE_URL}/products/${datas?.[0]?.coloredImage}`}
                      // src=`https://localhost:8000/products/${datas?[0].coloredImage[0]}`
                      style={{height: '70px', width: '100px'}}
                    ></img>
                  </div>
                )
              }
            ]}
            data={data}
            actions={{
              // onView: (item: any) => {
              //   navigate(`view/${item.id}`)
              // },

              onEdit: (item: any) => {
                navigate(`update/${item.id}`)
              },
              onDelete: (item: any, onCloseModalHandler) => {
                dispatch(
                  delteProductAction({
                    productId: item.id,
                    onSuccess: (data: any) => {
                      onCloseModalHandler()

                      console.log('onSUccess called')
                      toast.success('Product deleted successfully')
                      console.log('ad1')
                      dispatch(
                        getProductListAction({
                          onSuccess: () => {},
                          query: {
                            search: searchTxt,
                            categoryId: selectedCateory?.id
                          }
                        })
                      )
                    }
                  })
                )
              }
            }}
            pagination={{
              totalCount: Number(data?.length ?? 1),
              perPage: Number(5)
            }}
          />
        </div>
      </Box>
    </div>
  )
}
