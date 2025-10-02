import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {subCategoryService} from './subCategory.service'
import {toast} from 'react-hot-toast'

const getSubCategoryListActionNested = createAsyncThunk(
  'categorynested/listtt',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      console.log('final data hai value response above')
      const response = await subCategoryService.getSubCategoriesListNested()
      console.log('final data hai value response above below',response)
      onSuccess(response.data)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get SubCategory!')
    }
  }
)

const updateSubCategoryActionNested = createAsyncThunk(
  'subCategorynested/udpate',
  async (
    {
      subCategoryBody,
      subCategoryId,
      onSuccess
    }: {
      subCategoryBody: any
      subCategoryId: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await subCategoryService.updateSubCategoryNested(
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

const getSubCategoryDetailByIdActionNested = createAsyncThunk(
  'subCategorynested/detail',
  async (
    {
      subCategoryId
    }: {
      subCategoryId: string
    },
    thunkAPI
  ) => {
    console.log('getproduct detail by id called')
    try {
      const response = await subCategoryService.getSubCategoryDetailByIdNested(
        subCategoryId
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching Sub Category Detail!')
    }
  }
)

const createSubCategoryActionNested = createAsyncThunk(
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
      const response = await subCategoryService.createSubCategoryNested(
        subCategoryBody
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create SubCategory!')
    }
  }
)

const deleteSubCategoryActionNested = createAsyncThunk(
  'subCategorynested/delete',
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
      const response = await subCategoryService.deleteSubCategoryNested(
        subCategoryId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get subCategory!')
    }
  }
)

const initialState: {
  getSubCategoryLoadingNested?: boolean
  subCategoryDataNested?: any
  subCategoryDetailDataNested?: any
  subCategoryDetailDataLoadingNested?: boolean

  deleteSubCategoryLoadingNested?: boolean
  createSubCategoryLoadingNested?: boolean
  updateSubCategoryLoadingNested?: boolean
} = {
  getSubCategoryLoadingNested: false,
  subCategoryDataNested: undefined,
  subCategoryDetailDataNested: undefined,

  deleteSubCategoryLoadingNested: false,
  createSubCategoryLoadingNested: false,
  updateSubCategoryLoadingNested: false
}

const subCategorySliceNested = createSlice({
  name: 'subCategoryNested',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubCategoryListActionNested.pending, (state) => {
      state.getSubCategoryLoadingNested = true
    })
    builder.addCase(
      getSubCategoryListActionNested.fulfilled,
      (state, action) => {
        state.getSubCategoryLoadingNested = false
        state.subCategoryDataNested = action.payload.data
      }
    )
    builder.addCase(getSubCategoryListActionNested.rejected, (state) => {
      state.getSubCategoryLoadingNested = false
    })

    builder.addCase(getSubCategoryDetailByIdActionNested.pending, (state) => {
      state.subCategoryDetailDataLoadingNested = true
    })
    builder.addCase(
      getSubCategoryDetailByIdActionNested.fulfilled,
      (state, action) => {
        state.subCategoryDetailDataLoadingNested = false
        state.subCategoryDetailDataNested = action.payload.data
      }
    )
    builder.addCase(getSubCategoryDetailByIdActionNested.rejected, (state) => {
      state.subCategoryDetailDataLoadingNested = false
    })

    builder.addCase(deleteSubCategoryActionNested.pending, (state) => {
      state.deleteSubCategoryLoadingNested = true
    })
    builder.addCase(
      deleteSubCategoryActionNested.fulfilled,
      (state, action) => {
        state.deleteSubCategoryLoadingNested = false
      }
    )
    builder.addCase(deleteSubCategoryActionNested.rejected, (state) => {
      state.deleteSubCategoryLoadingNested = false
    })

    builder.addCase(createSubCategoryActionNested.pending, (state) => {
      state.createSubCategoryLoadingNested = true
    })
    builder.addCase(
      createSubCategoryActionNested.fulfilled,
      (state, action) => {
        state.createSubCategoryLoadingNested = false
      }
    )
    builder.addCase(createSubCategoryActionNested.rejected, (state) => {
      state.createSubCategoryLoadingNested = false
    })

    builder.addCase(updateSubCategoryActionNested.pending, (state) => {
      state.updateSubCategoryLoadingNested = true
    })
    builder.addCase(
      updateSubCategoryActionNested.fulfilled,
      (state, action) => {
        state.updateSubCategoryLoadingNested = false
      }
    )
    builder.addCase(updateSubCategoryActionNested.rejected, (state) => {
      state.updateSubCategoryLoadingNested = false
    })
  }
})

export {
  getSubCategoryListActionNested,
  deleteSubCategoryActionNested,
  updateSubCategoryActionNested,
  createSubCategoryActionNested,
  getSubCategoryDetailByIdActionNested
}
export default subCategorySliceNested.reducer
