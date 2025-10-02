import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {categoryService} from './category.service'
import {toast} from 'react-hot-toast'

const getCategoryListAction = createAsyncThunk(
  'category/list',
  async (
    {
      onSuccess
    }: {
      onSuccess: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await categoryService.getCategoryList()
      onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get Category!')
    }
  }
)

const getCategoryDetailByIdAction = createAsyncThunk(
  'category/detail',
  async (
    {
      categoryId
    }: {
      categoryId: string
    },
    thunkAPI
  ) => {
    console.log('getCategory detail by id called')
    try {
      const response = await categoryService.getCategoryDetailById(categoryId)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching Product Detail!')
    }
  }
)

const updateCategoryAction = createAsyncThunk(
  'category/udpate',
  async (
    {
      categoryBody,
      categoryId,
      onSuccess,
      onError
    }: {
      categoryBody: any
      categoryId: string
      onSuccess?: (data: any) => void
      onError?: (error: any) => void  
    },
    thunkAPI
  ) => {
    try {
      const response = await categoryService.updateCategory(
        categoryBody,
        categoryId
      )
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot update category!')
    }
  }
)

const getSubCategoryAction = createAsyncThunk(
  'subCategory/list',
  async (
    {
      onSuccess
    }: {
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      console.log('+++++++++++++++++==')
      const response = await categoryService.getSubCategoryList()
      onSuccess && onSuccess(response)
      console.log(response, 'reponse from slice')
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot get SubCategory!')
    }
  }
)

const createCategoryAction = createAsyncThunk(
  'product/create',
  async (
    {
      categoryBody,
      onSuccess,
      onError
    }: {
      categoryBody: any
      onSuccess?: (data: any) => void
      onError?: (error: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await categoryService.createCategory(categoryBody)
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot create category!')
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

const initialState: {
  categoryData?: any
  getCategoryLoading?: boolean
  subCategoryData?: any
  categoryDetailData?: any
  getSubCategoryLoading?: boolean
  deleteCategoryLoading?: boolean
  createCategoryLoading?: boolean
  updateCategoryLoading?: boolean
  categoryDetailDataLoading?: boolean
} = {
  categoryData: undefined,
  getCategoryLoading: false,
  subCategoryData: undefined,
  getSubCategoryLoading: false,
  deleteCategoryLoading: false,
  createCategoryLoading: false,
  updateCategoryLoading: false,
  categoryDetailData: undefined,
  categoryDetailDataLoading: false
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategoryListAction.pending, (state) => {
      state.getCategoryLoading = true
    })
    builder.addCase(getCategoryListAction.fulfilled, (state, action) => {
      state.getCategoryLoading = false
      state.categoryData = action.payload.data
    })
    builder.addCase(getCategoryListAction.rejected, (state) => {
      state.getCategoryLoading = false
    })

    builder.addCase(getSubCategoryAction.pending, (state) => {
      state.getSubCategoryLoading = true
    })
    builder.addCase(getSubCategoryAction.fulfilled, (state, action) => {
      state.getSubCategoryLoading = false
      state.subCategoryData = action.payload.data
    })
    builder.addCase(getSubCategoryAction.rejected, (state) => {
      state.getSubCategoryLoading = false
    })

    builder.addCase(deleteCategoryAction.pending, (state) => {
      state.deleteCategoryLoading = true
    })
    builder.addCase(deleteCategoryAction.fulfilled, (state, action) => {
      state.deleteCategoryLoading = false
    })
    builder.addCase(deleteCategoryAction.rejected, (state) => {
      state.deleteCategoryLoading = false
    })

    builder.addCase(createCategoryAction.pending, (state) => {
      state.createCategoryLoading = true
    })
    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.createCategoryLoading = false
    })
    builder.addCase(createCategoryAction.rejected, (state) => {
      state.createCategoryLoading = false
    })

    builder.addCase(getCategoryDetailByIdAction.pending, (state) => {
      state.categoryDetailDataLoading = true
    })
    builder.addCase(getCategoryDetailByIdAction.fulfilled, (state, action) => {
      state.categoryDetailDataLoading = false
      state.categoryDetailData = action.payload.data
    })
    builder.addCase(getCategoryDetailByIdAction.rejected, (state) => {
      state.categoryDetailDataLoading = false
    })

    builder.addCase(updateCategoryAction.pending, (state) => {
      state.updateCategoryLoading = true
    })
    builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
      state.updateCategoryLoading = false
    })
    builder.addCase(updateCategoryAction.rejected, (state) => {
      state.updateCategoryLoading = false
    })
  }
})

export {
  getCategoryListAction,
  getSubCategoryAction,
  deleteCategoryAction,
  createCategoryAction,
  getCategoryDetailByIdAction,
  updateCategoryAction
}
export default categorySlice.reducer
