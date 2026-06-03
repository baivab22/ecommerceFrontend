import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {BannerService} from './banners.service'
import {toast} from 'react-hot-toast'

const getBannerListAction = createAsyncThunk(
  'banner/list',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await BannerService.getBannerList()
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Banner!')
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

const deleteBannerImageAction = createAsyncThunk(
  'bannerImage/delete',

  async (
    {
      bannerName,

      onSuccess
    }: {
      bannerName: string

      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      console.log(bannerName, 'bannerName called')
      const response = await BannerService.deleteBannerImages(bannerName)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot delete banner image!')
    }
  }
)

const createBannerAction = createAsyncThunk(
  'banner/create',
  async (
    {
      bannerData,
      onSuccess
    }: {
      bannerData: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      console.log('bannerData', bannerData)
      const response = await BannerService.createBanner(bannerData)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create SubCategory!')
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
  getBannerLoading?: boolean
  bannerData?: any
  //   subCategoryDetailData?: any
  //   subCategoryDetailDataLoading?: boolean

  //   deleteSubCategoryLoading?: boolean
  createBannerLoading?: boolean
  deleteBannerLoading?: boolean
  //   updateSubCategoryLoading?: boolean
} = {
  getBannerLoading: false,
  bannerData: undefined,

  //   subCategoryDetailData: undefined,

  //   deleteSubCategoryLoading: false,
  createBannerLoading: false,
  deleteBannerLoading: false
  //   updateSubCategoryLoading: false
}

const BannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBannerListAction.pending, (state) => {
      state.getBannerLoading = true
    })
    builder.addCase(getBannerListAction.fulfilled, (state, action) => {
      state.getBannerLoading = false
      state.bannerData = action.payload.data
    })
    builder.addCase(getBannerListAction.rejected, (state) => {
      state.getBannerLoading = false
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

    builder.addCase(deleteBannerImageAction.pending, (state) => {
      state.deleteBannerLoading = true
    })
    builder.addCase(deleteBannerImageAction.fulfilled, (state, action) => {
      state.deleteBannerLoading = false
      // Update banner data after deletion - the server response should contain updated banner data
      if (state.bannerData?.[0]) {
        state.bannerData[0] = action.payload?.data || action.payload
      }
    })
    builder.addCase(deleteBannerImageAction.rejected, (state) => {
      state.deleteBannerLoading = false
    })

    builder.addCase(createBannerAction.pending, (state) => {
      state.createBannerLoading = true
    })
    builder.addCase(createBannerAction.fulfilled, (state, action) => {
      state.createBannerLoading = false
      // Update banner data after creation
      if (action.payload) {
        state.bannerData = [action.payload?.data || action.payload]
      }
    })
    builder.addCase(createBannerAction.rejected, (state) => {
      state.createBannerLoading = false
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
  getBannerListAction,
  createBannerAction,
  deleteBannerImageAction
  //   getSubCategoryDetailByIdAction
}
export default BannerSlice.reducer
