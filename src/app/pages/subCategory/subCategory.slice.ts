import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {subCategoryService} from './subCategory.service'
import {toast} from 'react-hot-toast'

const getSubCategoryListAction = createAsyncThunk(
  'category/list',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await subCategoryService.getSubCategoriesList()
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get SubCategory!')
    }
  }
)

const updateSubCategoryAction = createAsyncThunk(
  'subCategory/udpate',
  async (
    {
      subCategoryBody,
      subCategoryId,
      onSuccess
    }: {
      subCategoryBody: any
      subCategoryId: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await subCategoryService.updateSubCategory(
        subCategoryBody,
        subCategoryId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot update Sub category!')
    }
  }
)

const getSubCategoryDetailByIdAction = createAsyncThunk(
  'subCategory/detail',
  async (
    {
      subCategoryId
    }: {
      subCategoryId: any
    },
    thunkAPI
  ) => {
    console.log('getproduct detail by id called')
    try {
      const response = await subCategoryService.getSubCategoryDetailById(
        (subCategoryId) as any
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching Sub Category Detail!')
    }
  }
)

const createSubCategoryAction = createAsyncThunk(
  'subCategory/create',
  async (
    {
      subCategoryBody,
      onSuccess
    }: {
      subCategoryBody: any
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await subCategoryService.createSubCategory(
        subCategoryBody
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create SubCategory!')
    }
  }
)

const deleteSubCategoryAction = createAsyncThunk(
  'subCategory/delete',
  async (
    {
      subCategoryId,
      onSuccess
    }: {
      subCategoryId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await subCategoryService.deleteSubCategory(subCategoryId)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get subCategory!')
    }
  }
)

const initialState: {
  getSubCategoryLoading?: boolean
  subCategoryData?: any
  subCategoryDetailData?: any
  subCategoryDetailDataLoading?: boolean

  deleteSubCategoryLoading?: boolean
  createSubCategoryLoading?: boolean
  updateSubCategoryLoading?: boolean
} = {
  getSubCategoryLoading: false,
  subCategoryData: undefined,
  subCategoryDetailData: undefined,

  deleteSubCategoryLoading: false,
  createSubCategoryLoading: false,
  updateSubCategoryLoading: false
}

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubCategoryListAction.pending, (state) => {
      state.getSubCategoryLoading = true
    })
    builder.addCase(getSubCategoryListAction.fulfilled, (state, action) => {
      state.getSubCategoryLoading = false
      state.subCategoryData = action.payload.data
    })
    builder.addCase(getSubCategoryListAction.rejected, (state) => {
      state.getSubCategoryLoading = false
    })

    builder.addCase(getSubCategoryDetailByIdAction.pending, (state) => {
      state.subCategoryDetailDataLoading = true
    })
    builder.addCase(
      getSubCategoryDetailByIdAction.fulfilled,
      (state, action) => {
        state.subCategoryDetailDataLoading = false
        state.subCategoryDetailData = action.payload.data
      }
    )
    builder.addCase(getSubCategoryDetailByIdAction.rejected, (state) => {
      state.subCategoryDetailDataLoading = false
    })

    builder.addCase(deleteSubCategoryAction.pending, (state) => {
      state.deleteSubCategoryLoading = true
    })
    builder.addCase(deleteSubCategoryAction.fulfilled, (state, action) => {
      state.deleteSubCategoryLoading = false
    })
    builder.addCase(deleteSubCategoryAction.rejected, (state) => {
      state.deleteSubCategoryLoading = false
    })

    builder.addCase(createSubCategoryAction.pending, (state) => {
      state.createSubCategoryLoading = true
    })
    builder.addCase(createSubCategoryAction.fulfilled, (state, action) => {
      state.createSubCategoryLoading = false
    })
    builder.addCase(createSubCategoryAction.rejected, (state) => {
      state.createSubCategoryLoading = false
    })

    builder.addCase(updateSubCategoryAction.pending, (state) => {
      state.updateSubCategoryLoading = true
    })
    builder.addCase(updateSubCategoryAction.fulfilled, (state, action) => {
      state.updateSubCategoryLoading = false
    })
    builder.addCase(updateSubCategoryAction.rejected, (state) => {
      state.updateSubCategoryLoading = false
    })
  }
})

export {
  getSubCategoryListAction,
  deleteSubCategoryAction,
  updateSubCategoryAction,
  createSubCategoryAction,
  getSubCategoryDetailByIdAction
}
export default subCategorySlice.reducer
