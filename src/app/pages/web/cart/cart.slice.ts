// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
// import {CartService} from './cart.service'
// import {toast} from 'react-hot-toast'
// import {delteProductAction} from '../../products/product.slice'

// const getCartByUserIdListAction = createAsyncThunk(
//   'cartByUserId/listing',
//   async (
//     {
//       onSuccess,
//       userId
//     }: {
//       onSuccess?: (data: any) => void
//       userId: string
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await CartService.getCartListByUserId({userId})

//       console.log(response.data, 'getcart slice')
//       onSuccess(response)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot get user cart!')
//     }
//   }
// )

// const deleteCartByProdcutIdAction = createAsyncThunk(
//   'cart/delete',

//   async (
//     {
//       productId,
//       userId,

//       onSuccess
//     }: {
//       productId: string
//       userId: string

//       onSuccess?: (data: any) => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       // console.log(bannerName, 'bannerName called')
//       const response = await CartService.deleteCartByProductId(
//         userId,
//         productId
//       )
//       onSuccess && onSuccess(response)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot delete cart By Budget !')
//     }
//   }
// )

// const createCartByUserIdAction = createAsyncThunk(
//   'cartByUserId/create',
//   async (
//     {
//       userId,
//       data,
//       onSuccess
//     }: {
//       userId: any
//       data: any
//       onSuccess?: (data: any) => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       // console.log('bannerData', bannerData)
//       const response = await CartService.createCartByUserId(data, userId)
//       onSuccess && onSuccess(response)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot create Cart!')
//     }
//   }
// )

// // const deleteCartByProductIdAction = createAsyncThunk(
// //   'deleteCartByUserId/delete',
// //   async (
// //     {
// //       userId,
// //       productId,
// //       onSuccess
// //     }: {
// //       userId: string
// //       productId: string
// //       onSuccess?: (data: any) => void
// //     },
// //     thunkAPI
// //   ) => {
// //     try {
// //       const response = await CartService.deleteCartByProductId(
// //         userId,
// //         productId
// //       )
// //       onSuccess && onSuccess(response)
// //       return response
// //     } catch (error) {
// //       return thunkAPI.rejectWithValue('Cannot delete cart!')
// //     }
// //   }
// // )

// const initialState: {
//   getCartListLoading?: boolean
//   cartListDatas: any

//   createCartByUserIdLoading?: boolean
//   deleteCartByProductIdLoading?: boolean
// } = {
//   getCartListLoading: false,
//   cartListDatas: undefined,

//   createCartByUserIdLoading: false,
//   // createCartByProductIdData?:data,
//   deleteCartByProductIdLoading: false
// }

// const cartSlice = createSlice({
//   name: 'cartByUserId',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // builder.addCase(getCartByUserIdListAction.pending, (state) => {
//     //   state.getCartListLoading = true
//     // })
//     // builder.addCase(getCartByUserIdListAction.fulfilled, (state, action) => {
//     //   state.getCartListLoading = false

//     //   state.cartListData = action.payload
//     // })
//     // builder.addCase(getCartByUserIdListAction.rejected, (state) => {
//     //   console.log('error occured')
//     //   state.getCartListLoading = false
//     // })

//     builder.addCase(deleteCartByProdcutIdAction.pending, (state) => {
//       state.deleteCartByProductIdLoading = true
//     })
//     builder.addCase(delteProductAction.fulfilled, (state, action) => {
//       state.deleteCartByProductIdLoading = false
//     })
//     builder.addCase(delteProductAction.rejected, (state) => {
//       state.deleteCartByProductIdLoading = false
//     })

//     builder.addCase(createCartByUserIdAction.pending, (state) => {
//       state.createCartByUserIdLoading = true
//     })
//     builder.addCase(createCartByUserIdAction.fulfilled, (state, action) => {
//       state.createCartByUserIdLoading = false
//     })
//     builder.addCase(createCartByUserIdAction.rejected, (state) => {
//       state.createCartByUserIdLoading = false
//     }),
//       builder.addCase(getCartByUserIdListAction.pending, (state) => {
//         console.log('getLoading')
//         state.getCartListLoading = true
//       })

//     builder.addCase(getCartByUserIdListAction.fulfilled, (state, action) => {
//       state.getCartListLoading = false
//       state.cartListDatas = action.payload

//       console.log('fullfilled')
//     })
//     builder.addCase(getCartByUserIdListAction.rejected, (state, action) => {
//       console.log('geterror')
//       console.log('Error fetching cart data:', action.error.message)
//       state.getCartListLoading = false
//     })

//     // builder.addCase(updateSubCategoryAction.pending, (state) => {
//     //   state.updateSubCategoryLoading = true
//     // })
//     // builder.addCase(updateSubCategoryAction.fulfilled, (state, action) => {
//     //   state.updateSubCategoryLoading = false
//     // })
//     // builder.addCase(updateSubCategoryAction.rejected, (state) => {
//     //   state.updateSubCategoryLoading = false
//     // })
//   }
// })

// export {
//   //   getSubCategoryListAction,
//   //   deleteSubCategoryAction,
//   //   updateSubCategoryAction,
//   getCartByUserIdListAction,
//   createCartByUserIdAction,
//   delteProductAction
//   //   getSubCategoryDetailByIdAction
// }
// export default cartSlice.reducer

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {CartService} from './cart.service'
import {toast} from 'react-hot-toast'
import { categoryService } from '../../category/category.service'

const getCartlistAction = createAsyncThunk(
  'cart/list',
  async (
    {
      userId,
      onSuccess
    }: {
      userId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await CartService.getCartListByUserId({userId: userId})
      console.log('from slice')
      onSuccess?.(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Cart items!')
    }
  }
)




const getOrderListAction = createAsyncThunk(
  'order/list',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await CartService.getOrderList()
      console.log('from slice')
      onSuccess?.(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Order List!')
    }
  }
)



const updateOrderByIdAction = createAsyncThunk(
  'order/updateOrder',
  async (
    {
      id,
      data,
      onSuccess
    }: {
      id:string,
      data:any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await CartService.updateOrderById(String(id),data)
      console.log('from slice')
      onSuccess?.(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot update Order List!')
    }
  }
)

const delteProductFromCartAction = createAsyncThunk(
  'product/delete',
  async (
    {
      userId,
      productId,
      onSuccess
    }: {
      userId
      productId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    console.log(productId, 'productId slice')
    try {
      const response = await CartService.deleteCartByProductId(
        userId,
        productId
      )
      console.log('on delete sucess called')
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot delete product from cart!')
    }
  }
)





// const updateCartAction = createAsyncThunk(
//   'category/udpate',
//   async (
//     {
//       categoryBody,
//       categoryId,
//       onSuccess
//     }: {
//       categoryBody: any
//       categoryId: string
//       onSuccess?: (data: any) => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await categoryService.updateCategory(
//         categoryBody,
//         categoryId
//       )
//       onSuccess && onSuccess(response)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot update category!')
//     }
//   }
// )

// const getSubCategoryAction = createAsyncThunk(
//   'subCategory/list',
//   async (
//     {
//       onSuccess
//     }: {
//       onSuccess?: (data: any) => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       console.log('+++++++++++++++++==')
//       const response = await categoryService.getSubCategoryList()
//       onSuccess && onSuccess(response)
//       console.log(response, 'reponse from slice')
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot get SubCategory!')
//     }
//   }
// )


const createCartByUserIdAction = createAsyncThunk(
  'cartByUserId/create',
  async (
    {
      userId,
      data,
      onSuccess
    }: {
      userId: any
      data: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      // console.log('bannerData', bannerData)
      const response = await CartService.createCartByUserId(data, userId)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create Cart!')
    }
  })


const updatedCartByProductIdAction = createAsyncThunk(
  'updateCartByUserId/create',
  async (
    {
      data,
      onSuccess,
      onFailure
    }: {
      data: any
      onSuccess?: (data: any) => void
      onFailure?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      // console.log('bannerData', bannerData)

      console.log(data, 'dsa')
      const response = await CartService.updateCartByProductId(data)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      onFailure && onFailure(error)
      return thunkAPI.rejectWithValue('Cannot update Cart!')
    }
  }
)

const createOrderByUserIdAction = createAsyncThunk(
  'orderByUserId/create',
  async (
    {
      userId,
      data,
      onSuccess,
      onFailure
    }: {
      userId: any
      data: any
      onSuccess?: (data: any) => void
      onFailure?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      console.log('bannerData values')
      const response = await CartService.createOrderByUserId(data, userId)
      console.log('hello success')
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      console.log('hello error', error)
      onFailure && onFailure(error)
      return thunkAPI.rejectWithValue('Cannot create Order!')
    }
  }
)
const deleteCategoryAction = createAsyncThunk(
  'category/delete',
  async (
    {
      categoryId,
      onSuccess
    }: {
      categoryId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    console.log(categoryId, 'productId slice')
    try {
      const response = await categoryService.deleteCategory(categoryId)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Category!')
    }
  }
)


const deleteCartByIdAction = createAsyncThunk(
  'cartId/delete',
  async (
    {
      cartId,
      onSuccess
    }: {
      cartId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    console.log(cartId, 'productId slice')
    try {
      const response = await CartService.deleteCart(cartId)
      onSuccess && onSuccess?.(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Category!')
    }
  }
)



const initialState: {
  cartData?: any
  cartLoading?: boolean
  orderData?: any
  orderDataLoading: boolean
  subCategoryData?: any
  createOrderByUserIdData?: any
  createOrderByUserIdLoading?: boolean
  updatedCartByProductId: any
  updatedCardByLoading?: boolean
  categoryDetailData?: any
  getSubCategoryLoading?: boolean
  deleteProductFromCartLoading?: boolean
  createCategoryLoading?: boolean
  updateCategoryLoading?: boolean
  categoryDetailDataLoading?: boolean
  cartDeleteLoading?: boolean 
  updateOrderDataLoading?: boolean
  updateOrderData?: any
} = {
  cartData: undefined,
  cartLoading: false,
  orderDataLoading: false,
  orderData: undefined,
  subCategoryData: undefined,
  getSubCategoryLoading: false,
  createOrderByUserIdData: undefined,
  createOrderByUserIdLoading: false,
  deleteProductFromCartLoading: false,
  updatedCartByProductId: undefined,
  updatedCardByLoading: false,
  createCategoryLoading: false,
  updateCategoryLoading: false,
  categoryDetailData: undefined,
  categoryDetailDataLoading: false,
  cartDeleteLoading: false,
    updateOrderDataLoading: false,
  updateOrderData: undefined
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCartlistAction.pending, (state) => {
      state.cartLoading = true
    })
    builder.addCase(getCartlistAction.fulfilled, (state, action) => {
      state.cartLoading = false
      console.log('could not hitted')
      state.cartData = action.payload.data
    })
    builder.addCase(getCartlistAction.rejected, (state) => {
      state.cartLoading = false
    })

    builder.addCase(getOrderListAction.pending, (state) => {
      state.orderDataLoading = true
    })
    builder.addCase(getOrderListAction.fulfilled, (state, action) => {
      state.orderDataLoading = false
      state.orderData = action.payload.data
    })
    builder.addCase(getOrderListAction.rejected, (state) => {
      state.orderDataLoading = false
    })



        builder.addCase(updateOrderByIdAction.pending, (state) => {
      state.updateOrderDataLoading = true
    })
    builder.addCase(updateOrderByIdAction.fulfilled, (state, action) => {
      state.updateOrderDataLoading = false
      state.updateOrderData = action.payload.data
    })
    builder.addCase(updateOrderByIdAction.rejected, (state) => {
      state.updateOrderDataLoading = false
    })


    builder.addCase(delteProductFromCartAction.pending, (state) => {
      state.deleteProductFromCartLoading = true
    })
    builder.addCase(delteProductFromCartAction.fulfilled, (state, action) => {
      state.deleteProductFromCartLoading = false
    })
    builder.addCase(delteProductFromCartAction.rejected, (state) => {
      state.deleteProductFromCartLoading = false
    })

    builder.addCase(createOrderByUserIdAction.pending, (state) => {
      state.createOrderByUserIdLoading = true
    })
    builder.addCase(createOrderByUserIdAction.fulfilled, (state, action) => {
      state.createOrderByUserIdLoading = false
    })
    builder.addCase(createOrderByUserIdAction.rejected, (state) => {
      state.createOrderByUserIdLoading = false
    })

    builder.addCase(updatedCartByProductIdAction.pending, (state) => {
      state.updatedCardByLoading = true
    })
    builder.addCase(updatedCartByProductIdAction.fulfilled, (state, action) => {
      state.updatedCardByLoading = false
    })
    builder.addCase(updatedCartByProductIdAction.rejected, (state) => {
      state.updatedCardByLoading = false
    })

        builder.addCase(deleteCartByIdAction.pending, (state) => {
      state.cartDeleteLoading = true
    })
    builder.addCase(deleteCartByIdAction.fulfilled, (state, action) => {
      state.cartDeleteLoading = false
    })
    builder.addCase(deleteCartByIdAction.rejected, (state) => {
      state.cartDeleteLoading = false
    })

    // builder.addCase(getCategoryDetailByIdAction.pending, (state) => {
    //   state.categoryDetailDataLoading = true
    // })
    // builder.addCase(getCategoryDetailByIdAction.fulfilled, (state, action) => {
    //   state.categoryDetailDataLoading = false
    //   state.categoryDetailData = action.payload.data
    // })
    // builder.addCase(getCategoryDetailByIdAction.rejected, (state) => {
    //   state.categoryDetailDataLoading = false
    // })

    // builder.addCase(updateCategoryAction.pending, (state) => {
    //   state.updateCategoryLoading = true
    // })
    // builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
    //   state.updateCategoryLoading = false
    // })
    // builder.addCase(updateCategoryAction.rejected, (state) => {
    //   state.updateCategoryLoading = false
    // })
  }
})

export {
  // getCategoryListAction,
  // getSubCategoryAction,
  // deleteCategoryAction,
  // createCategoryAction,
  // getCategoryDetailByIdAction
  delteProductFromCartAction,
  getCartlistAction,
  createCartByUserIdAction,
  // updateCardByUserIdAction,
  createOrderByUserIdAction,
  getOrderListAction,
  updatedCartByProductIdAction,
  deleteCartByIdAction,
  updateOrderByIdAction
}
export default cartSlice.reducer
