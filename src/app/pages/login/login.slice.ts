import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {CreateLogin, ForgotPasswordService} from './login.service'

export const LoginAction = createAsyncThunk(
  'user/login',
  async (
    {
      loginBody,
      onSuccess,
      onError
    }: {
      loginBody: any
      onSuccess?: (data:any) => void
      onError?: (data:any) => void  
    },
    thunkAPI
  ) => {
    try {

      const response = await CreateLogin(loginBody)
      // console.log(response, 'response from login')

  console.log( 'response from loginnnnnn',response)

      onSuccess && onSuccess(response)
      return response
    } catch (error) {
            onError && onError(error)
      return thunkAPI.rejectWithValue('Cannot Login!')
    }
  }
)

export const ForgotPasswordAction = createAsyncThunk(
  'user/forgetPassword ',
  async (
    {
      userEmail,
      onSuccess,
      onError
    }: {
      userEmail: string
      onSuccess?: (data: any) => void
      onError?: (data: any) => void
    },
    thunkAPI
  ) => {
    try {
      const response = await ForgotPasswordService(userEmail)
      console.log(response, 'response from login')
      onSuccess && onSuccess(response)
      return response
    } catch (error) {
      onError && onError(error)
      return thunkAPI.rejectWithValue('Cannot Login!')
    }
  }
)

const initialState: {
  loginLoading?: boolean
  forgotPasswordLoading?: boolean,
  loginData?: any
} = {
  loginLoading: false,
  forgotPasswordLoading: false,
  loginData: null
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginAction.pending, (state) => {
      state.loginLoading = true
    })
    builder.addCase(LoginAction.fulfilled, (state, action) => {

      console.log(action.payload,'payload in login slice')
      state.loginLoading = false
      state.loginData = action.payload
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


export default loginSlice.reducer
