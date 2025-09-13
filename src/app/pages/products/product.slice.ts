import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {productService} from './product.service'
import {toast} from 'react-hot-toast'

const getProductListAction = createAsyncThunk(
  'product/list',
  async (
    {
      onSuccess,
      query
    }: {
      onSuccess?: (data: Api.BusinessList) => void
      query?: {
        search?: string
        categoryId?: string
        subCategoryId?: string
        isNewArrivals?: boolean
        isBestSelling?: boolean
        sort?: string
        order?: string
        minPrice?: number
        maxPrice?: number
      }
    },
    thunkAPI
  ) => {
    try {
      console.log('response service', query)
      const response = await productService.getProductList(query && query)

      onSuccess?.(response)
      // console.log(response, 'from product servei')
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get product!')
    }
  }
)

const getAllProductVariantImagesAction = createAsyncThunk(
  'colorVariant/list',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.getAllProductVariantImages()
      onSuccess?.(response)

      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get product variant!')
    }
  }
)

const delteProductAction = createAsyncThunk(
  'product/delete',
  async (
    {
      productId,
      onSuccess
    }: {
      productId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.deleteProduct(productId)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get product!')
    }
  }
)

const delteProductImageAction = createAsyncThunk(
  'productImage/delete',
  async (
    {
      productId,
      imageId,
      onSuccess
    }: {
      productId: string
      imageId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.deleteProductImages(
        productId,
        imageId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot delete product image!')
    }
  }
)

const deleteProductColorVariantImagesAction = createAsyncThunk(
  'colorVariantImage/delete',
  async (
    {
      variantId,
      imageId,
      onSuccess
    }: {
      variantId: string
      imageId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.deleteProductColorVariantImages(
        variantId,
        imageId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot delete product image variant!')
    }
  }
)

const createProductAction = createAsyncThunk(
  'product/create',
  async (
    {
      productBody,
      onSuccess
    }: {
      productBody: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {

      console.log('productBody data', productBody)
      const response = await productService.createProduct(productBody)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create product!')
    }
  }
)

const createProductImageAction = createAsyncThunk(
  'productImage/create',
  async (
    {
      variantBody,
      onSuccess
    }: {
      variantBody: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.CreateProductImage(variantBody)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create product variant!')
    }
  }
)

const updateProductAction = createAsyncThunk(
  'product/udpate',
  async (
    {
      productBody,
      productId,
      onSuccess
    }: {
      productBody: any
      productId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      console.log('productBody', productBody)
      const response = await productService.updateProduct(
        productBody,
        productId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot update product!')
    }
  }
)

const getProductDetailByIdAction = createAsyncThunk(
  'product/detail',
  async (
    {
      productId
    }: {
      productId: string
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.getProductDetailById(productId)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching Product Detail!')
    }
  }
)

const getOrderDetailByIdAction = createAsyncThunk(
  'productOrder/detail',
  async (
    {
      orderId
    }: {
      orderId: string
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.getOrderDetailById(orderId)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching Product Detail!')
    }
  }
)

const getProductListByCategoryIdAction = createAsyncThunk(
  'product/category',
  async (
    {
      categoryId
    }: {
      categoryId: string
    },
    thunkAPI
  ) => {
    try {
      const response = await productService.getProductListByCategoryId(
        categoryId
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching Product List by Category')
    }
  }
)

// const updateBusinessStatusAction = createAsyncThunk(
//   'business/updateStatus',
//   async (
//     {
//       businessId,
//       isBusinessApproved,
//       callback
//     }: {
//       businessId: number
//       isBusinessApproved: boolean
//       callback?: () => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await businessService.updateBusinessStatus(
//         businessId,
//         isBusinessApproved
//       )
//       callback && callback()
//       return response
//     } catch (error) {
//       const {message} = error.response.data.data
//       toast.error(message)
//       return thunkAPI.rejectWithValue('Error updating business status')
//     }
//   }
// )

// const updateBusinessTrustedAction = createAsyncThunk(
//   'business/updateTrusted',
//   async (
//     {
//       businessId,
//       isBusinessTrusted,
//       callback
//     }: {
//       businessId: number
//       isBusinessTrusted: boolean
//       callback?: () => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await businessService.updateBusinessTrusted(
//         businessId,
//         isBusinessTrusted
//       )
//       callback && callback()
//       return response
//     } catch (error) {
//       const {message} = error.response.data.data
//       toast.error(message)
//       return thunkAPI.rejectWithValue('Error updating business status')
//     }
//   }
// )

const initialState: {
  loading: boolean
  data?: Api.productList[]
  success: boolean
  deleteProductLoading: boolean
  productDetailData?: any
  productDetailLoading?: boolean

  orderDetailData?: any
  orderDetailLoading?: boolean
  createProductLoading?: boolean
  updateProductLoading?: boolean
  deleteProductImageLoading?: boolean

  deleteProductVariantLoading?: boolean
  getProductVariantListLoading?: boolean
  productVariantList: any

  createProductVariantLoading: boolean
  createproductVariantList: any
  //   detailLoading: boolean
  //   detail: any
  //   detailSuccess: boolean

  //   updateLoading: boolean

  //   updateTrustLoading: boolean
} = {
  loading: false,
  data: undefined,
  success: false,
  deleteProductLoading: false,
  createProductLoading: false,
  updateProductLoading: false,
  deleteProductImageLoading: false,
  orderDetailData: undefined,
  orderDetailLoading: false,

  deleteProductVariantLoading: false,
  getProductVariantListLoading: false,
  productVariantList: undefined,

  createProductVariantLoading: false,
  createproductVariantList: undefined
  //   detailLoading: boolean

  //   detailLoading: false,
  //   detail: undefined,
  //   detailSuccess: false,

  //   updateLoading: false,
  //   updateTrustLoading: false
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductListAction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getProductListAction.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data
      state.success = true
    })
    builder.addCase(getProductListAction.rejected, (state) => {
      state.loading = false
      state.success = false
    })

    builder.addCase(getAllProductVariantImagesAction.pending, (state) => {
      state.getProductVariantListLoading = true
    })
    builder.addCase(
      getAllProductVariantImagesAction.fulfilled,
      (state, action) => {
        state.getProductVariantListLoading = false
        state.productVariantList = action.payload.data
      }
    )
    builder.addCase(getAllProductVariantImagesAction.rejected, (state) => {
      state.getProductVariantListLoading = false
    })

    getAllProductVariantImagesAction

    builder.addCase(getProductDetailByIdAction.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getProductDetailByIdAction.fulfilled, (state, action) => {
      state.productDetailLoading = false
      state.productDetailData = action.payload.data
    })
    builder.addCase(getProductDetailByIdAction.rejected, (state) => {
      state.productDetailLoading = false
    })

    builder.addCase(getOrderDetailByIdAction.pending, (state) => {
      state.orderDetailLoading = true
    })
    builder.addCase(getOrderDetailByIdAction.fulfilled, (state, action) => {
      state.orderDetailLoading = false
      state.orderDetailData = action.payload.data
    })
    builder.addCase(getOrderDetailByIdAction.rejected, (state) => {
      state.orderDetailLoading = false
    })

    builder.addCase(delteProductAction.pending, (state) => {
      state.deleteProductLoading = true
    })
    builder.addCase(delteProductAction.fulfilled, (state, action) => {
      state.deleteProductLoading = false
    })
    builder.addCase(delteProductAction.rejected, (state) => {
      state.deleteProductLoading = false
    })

    builder.addCase(delteProductImageAction.pending, (state) => {
      state.deleteProductImageLoading = true
    })
    builder.addCase(delteProductImageAction.fulfilled, (state, action) => {
      state.deleteProductImageLoading = false
    })
    builder.addCase(delteProductImageAction.rejected, (state) => {
      state.deleteProductImageLoading = false
    })

    builder.addCase(deleteProductColorVariantImagesAction.pending, (state) => {
      state.deleteProductVariantLoading = true
    })
    builder.addCase(
      deleteProductColorVariantImagesAction.fulfilled,
      (state, action) => {
        state.deleteProductVariantLoading = false
      }
    )
    builder.addCase(deleteProductColorVariantImagesAction.rejected, (state) => {
      state.deleteProductVariantLoading = false
    })

    builder.addCase(updateProductAction.pending, (state) => {
      state.updateProductLoading = true
    })
    builder.addCase(updateProductAction.fulfilled, (state, action) => {
      state.updateProductLoading = false
    })
    builder.addCase(updateProductAction.rejected, (state) => {
      state.updateProductLoading = false
    })

    builder.addCase(createProductAction.pending, (state) => {
      state.createProductLoading = true
    })
    builder.addCase(createProductAction.fulfilled, (state, action) => {
      state.createProductLoading = false
    })
    builder.addCase(createProductAction.rejected, (state) => {
      state.createProductLoading = false
    })

    // builder.addCase(createProductAction.pending, (state) => {
    //   state.createProductLoading = true
    // })
    // builder.addCase(createProductAction.fulfilled, (state, action) => {
    //   state.createProductLoading = false
    // })
    // builder.addCase(createProductAction.rejected, (state) => {
    //   state.createProductLoading = false
    // })

    builder.addCase(createProductImageAction.pending, (state) => {
      state.createProductVariantLoading = true
    })
    builder.addCase(createProductImageAction.fulfilled, (state, action) => {
      state.createProductVariantLoading = false
    })
    builder.addCase(createProductImageAction.rejected, (state) => {
      state.createProductVariantLoading = false
    })

    // builder.addCase(updateBusinessStatusAction.pending, (state) => {
    //   state.updateLoading = true
    // })
    // builder.addCase(updateBusinessStatusAction.fulfilled, (state) => {
    //   state.updateLoading = false
    // })
    // builder.addCase(updateBusinessStatusAction.rejected, (state) => {
    //   state.updateLoading = false
    // })

    // builder.addCase(updateBusinessTrustedAction.pending, (state) => {
    //   state.updateLoading = true
    // })
    // builder.addCase(updateBusinessTrustedAction.fulfilled, (state) => {
    //   state.updateLoading = false
    // })
    // builder.addCase(updateBusinessTrustedAction.rejected, (state) => {
    //   state.updateLoading = false
    // })
  }
})

export {
  getProductListAction,
  delteProductAction,
  getProductDetailByIdAction,
  createProductAction,
  updateProductAction,
  createProductImageAction,
  getProductListByCategoryIdAction,
  delteProductImageAction,
  getAllProductVariantImagesAction,
  getOrderDetailByIdAction
}
export default productSlice.reducer
