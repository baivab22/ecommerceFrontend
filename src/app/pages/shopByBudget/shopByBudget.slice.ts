import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {ShopByBudgetService} from './shopByBudget.service'
import {toast} from 'react-hot-toast'

const getShopByBudgetListAction = createAsyncThunk(
  'shopByBudget/list',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await ShopByBudgetService.getShopByBudgetList()
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Shop By Budget!')
    }
  }
)

// const updateSubCategoryAction = createAsyncThunk(
//   'subCategory/udpate',
//   async (
//     {
//       subCategoryBody,
//       subCategoryId,
//       onSuccess
//     }: {
//       subCategoryBody: any
//       subCategoryId: string
//       onSuccess?: (data: any) => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await subCategoryService.updateSubCategory(
//         subCategoryBody,
//         subCategoryId
//       )
//       onSuccess && onSuccess(response)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot update Sub category!')
//     }
//   }
// )

// const getSubCategoryDetailByIdAction = createAsyncThunk(
//   'subCategory/detail',
//   async (
//     {
//       subCategoryId
//     }: {
//       subCategoryId: string
//     },
//     thunkAPI
//   ) => {
//     console.log('getproduct detail by id called')
//     try {
//       const response = await subCategoryService.getSubCategoryDetailById(
//         subCategoryId
//       )
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Error fetching Sub Category Detail!')
//     }
//   }
// )

const deleteShopByBudgetAction = createAsyncThunk(
  'shopByBudget/delete',

  async (
    {
      shopByBudgetId,

      onSuccess
    }: {
      shopByBudgetId: string

      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      // console.log(bannerName, 'bannerName called')
      const response = await ShopByBudgetService.deleteShopByBudget(
        shopByBudgetId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot delete Shop By Budget !')
    }
  }
)

const createShopByBudgetAction = createAsyncThunk(
  'shopByBudget/create',
  async (
    {
      shopByBudgetData,
      onSuccess
    }: {
      shopByBudgetData: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      // console.log('bannerData', bannerData)
      const response = await ShopByBudgetService.createShopByBudget(
        shopByBudgetData
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create Shop by category!')
    }
  }
)

// const deleteSubCategoryAction = createAsyncThunk(
//   'subCategory/delete',
//   async (
//     {
//       subCategoryId,
//       onSuccess
//     }: {
//       subCategoryId: string
//       onSuccess?: (data: any) => void
//     },
//     thunkAPI
//   ) => {
//     try {
//       const response = await subCategoryService.deleteSubCategory(subCategoryId)
//       onSuccess && onSuccess(response)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Cannot get subCategory!')
//     }
//   }
// )

const initialState: {
  getShopByBudgetLoading?: boolean
  shopByBudgetData?: any
  //   subCategoryDetailData?: any
  //   subCategoryDetailDataLoading?: boolean

  //   deleteSubCategoryLoading?: boolean
  createShopByBudgetLoading?: boolean
  deleteShopByBudgetLoading?: boolean
  //   updateSubCategoryLoading?: boolean
} = {
  getShopByBudgetLoading: false,
  shopByBudgetData: undefined,

  //   subCategoryDetailData: undefined,

  //   deleteSubCategoryLoading: false,
  createShopByBudgetLoading: false,
  deleteShopByBudgetLoading: false
  //   updateSubCategoryLoading: false
}

const ShopByBudgetSlice = createSlice({
  name: 'shopByBudget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getShopByBudgetListAction.pending, (state) => {
      state.getShopByBudgetLoading = true
    })
    builder.addCase(getShopByBudgetListAction.fulfilled, (state, action) => {
      state.getShopByBudgetLoading = false
      state.shopByBudgetData = action.payload.data
    })
    builder.addCase(getShopByBudgetListAction.rejected, (state) => {
      state.getShopByBudgetLoading = false
    })

    // builder.addCase(getSubCategoryDetailByIdAction.pending, (state) => {
    //   state.subCategoryDetailDataLoading = true
    // })
    // builder.addCase(
    //   getSubCategoryDetailByIdAction.fulfilled,
    //   (state, action) => {
    //     state.subCategoryDetailDataLoading = false
    //     state.subCategoryDetailData = action.payload.data
    //   }
    // )
    // builder.addCase(getSubCategoryDetailByIdAction.rejected, (state) => {
    //   state.subCategoryDetailDataLoading = false
    // })

    builder.addCase(deleteShopByBudgetAction.pending, (state) => {
      state.deleteShopByBudgetLoading = true
    })
    builder.addCase(deleteShopByBudgetAction.fulfilled, (state, action) => {
      state.deleteShopByBudgetLoading = false
    })
    builder.addCase(deleteShopByBudgetAction.rejected, (state) => {
      state.deleteShopByBudgetLoading = false
    })

    builder.addCase(createShopByBudgetAction.pending, (state) => {
      state.createShopByBudgetLoading = true
    })
    builder.addCase(createShopByBudgetAction.fulfilled, (state, action) => {
      state.createShopByBudgetLoading = false
    })
    builder.addCase(createShopByBudgetAction.rejected, (state) => {
      state.createShopByBudgetLoading = false
    })

    // builder.addCase(updateSubCategoryAction.pending, (state) => {
    //   state.updateSubCategoryLoading = true
    // })
    // builder.addCase(updateSubCategoryAction.fulfilled, (state, action) => {
    //   state.updateSubCategoryLoading = false
    // })
    // builder.addCase(updateSubCategoryAction.rejected, (state) => {
    //   state.updateSubCategoryLoading = false
    // })
  }
})

export {
  //   getSubCategoryListAction,
  //   deleteSubCategoryAction,
  //   updateSubCategoryAction,
  getShopByBudgetListAction,
  createShopByBudgetAction,
  deleteShopByBudgetAction
  //   getSubCategoryDetailByIdAction
}
export default ShopByBudgetSlice.reducer
