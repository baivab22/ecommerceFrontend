import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {CreateLogin, ForgotPasswordService} from './login.service'

export const LoginAction = createAsyncThunk(
  'user/login',
  async (
    {
      loginBody,
      onSuccess
    }: {
      loginBody: any
      onSuccess?: () => void
    },
    thunkAPI
  ) => {
    try {
      // const response = await CreateLogin(loginBody)
      // console.log(response, 'response from login')
      onSuccess && onSuccess()
      // return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot Login!')
    }
  }
)

export const ForgotPasswordAction = createAsyncThunk(
  'user/login',
  async (
    {
      userEmail,
      onSuccess
    }: {
      userEmail: string
      onSuccess?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await ForgotPasswordService(userEmail)
      console.log(response, 'response from login')
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue('Cannot Login!')
    }
  }
)

const initialState: {
  loginLoading?: boolean
  forgotPasswordLoading?: boolean
} = {
  loginLoading: false,
  forgotPasswordLoading: false
}

const subCategorySlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginAction.pending, (state) => {
      state.loginLoading = true
    })
    builder.addCase(LoginAction.fulfilled, (state, action) => {
      state.loginLoading = false
    })
    builder.addCase(LoginAction.rejected, (state) => {
      state.loginLoading = false
    })

    builder.addCase(ForgotPasswordAction.pending, (state) => {
      state.forgotPasswordLoading = true
    })
    builder.addCase(ForgotPasswordAction.fulfilled, (state, action) => {
      state.forgotPasswordLoading = false
    })
    builder.addCase(ForgotPasswordAction.rejected, (state) => {
      state.forgotPasswordLoading = false
    })
  }
})
