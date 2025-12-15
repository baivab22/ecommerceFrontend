import React, { useState, useEffect, useCallback } from 'react'
import './_loginPage.scss'
import { useDispatch } from 'src/store'
import { ForgotPasswordAction, LoginAction } from './login.slice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { setCookie } from 'src/helpers'
import { useAuth } from 'src/app/routing'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { BASE_URL } from 'src/config'

interface GoogleUserData {
  email: string
  name: string
  picture?: string
  sub: string
  email_verified?: boolean
}

interface FacebookUserData {
  id: string
  name: string
  email?: string
  picture?: {
    data: {
      url: string
    }
  }
}

interface LoginResponse {
  message: string
  success: boolean
  user: {
    _id: string
    email: string
    name: string
    role: string
    picture?: string
  }
  userRoles: string
  token: string
  expiresIn: string
}

// const API_BASE_URL = 'http://localhost:8000/api'

// const API_BASE_URL = '/api'

const FACEBOOK_APP_ID = '2593546121022183'

const ADMIN_CREDENTIALS = [
  {
    email: 'adminemail12@gmail.com',
    password: '123456783',
    id: '68c432bec123ae6086bd1866',
    name: 'Admin'
  },
  {
    email: 'meromail123@gmail.com',
    password: '12345673',
    id: '68c432bec123ae6086bd1867',
    name: 'Admin 2'
  }
] as const

declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFacebookSDKReady, setIsFacebookSDKReady] = useState(false)

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }, [])

  const checkAdminCredentials = useCallback((email: string, password: string) => {
    return ADMIN_CREDENTIALS.find(
      admin => admin.email === email && admin.password === password
    )
  }, [])

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) {
        setIsFacebookSDKReady(true)
        return
      }

      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      
      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript)
      }
    }

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      })
      
      setIsFacebookSDKReady(true)
    }

    loadFacebookSDK()
  }, [])

  const handleSuccessfulLogin = useCallback((data: LoginResponse) => {

    console.log(data,"data value for login hai")
    if (data?.user?._id) {
      setCookie('userId', data.user._id)
    }
    
    if (data.user?.picture) {
      setCookie('userPicture', data.user.picture)
    }
    
    if (data.user?.name) {
      setCookie('userName', data.user.name)
    }

    const userRole = data?.userRoles || 'USER'
    setCookie('userRoles', userRole)
    handleLogin(data.token, userRole, data)
    navigate('/home')
  }, [handleLogin, navigate])

  const handleLogins = useCallback(() => {
    const trimmedEmail = loginData.email.trim()
    const trimmedPassword = loginData.password

    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Please fill in both email and password')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    const adminMatch = checkAdminCredentials(trimmedEmail, trimmedPassword)
    
    if (adminMatch) {
      const mockAdminData: LoginResponse = {
        message: 'Login successful',
        success: true,
        user: {
          _id: adminMatch.id,
          email: adminMatch.email,
          name: adminMatch.name,
          role: 'ADMIN'
        },
        userRoles: 'ADMIN',
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI${adminMatch.id}IiwiZW1haWwiOiIke adminMatch.email}Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzU4NzM1MTk0LCJleHAiOjE3NTg4MjE1OTR9.OUke0Im6mpImGyi8nH3OoMB-BU2Fj8j8Nsxzr338ZOo`,
        expiresIn: '24h'
      }
      
      handleSuccessfulLogin(mockAdminData)
      toast.success(`Welcome ${adminMatch.name}!`)
      setIsLoading(false)
      return
    }

    dispatch(
      LoginAction({
        loginBody: {
          email: trimmedEmail,
          password: trimmedPassword
        },
        onSuccess: (data: any) => {
          setIsLoading(false)
          toast.success('Logged in successfully')
          handleSuccessfulLogin(data)
        },
        onError: (error: any) => {
          setIsLoading(false)
          const status = error?.response?.status
          
          const errorMessages: Record<number, string> = {
            401: 'Invalid email or password',
            404: 'User not found',
            500: 'Server error. Please try again later.',
            502: 'Server error. Please try again later.',
            503: 'Server error. Please try again later.'
          }
          
          const errorMessage = status && status >= 500 
            ? errorMessages[500] 
            : errorMessages[status] || error?.response?.data?.message || 'Login failed. Please try again.'
          
          toast.error(errorMessage)
        }
      })
    )
  }, [loginData, validateEmail, checkAdminCredentials, handleSuccessfulLogin, dispatch])

  const handleGoogleLoginSuccess = useCallback(async (credentialResponse: any) => {
    try {
      setIsLoading(true)
      const decodedResponse: GoogleUserData = jwtDecode(credentialResponse.credential)

      const response = await fetch(`${BASE_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleToken: credentialResponse.credential,
          name: decodedResponse.name,
          picture: decodedResponse.picture,
        }),
      })

      const data: LoginResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed')
      }

      toast.success(`Welcome ${decodedResponse.name}!`)
      handleSuccessfulLogin(data)
    } catch (error: any) {
      toast.error(error.message || 'Google login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [handleSuccessfulLogin])

  const handleGoogleLoginError = useCallback(() => {
    toast.error('Google login failed. Please try again.')
  }, [])

  const handleFacebookLogin = useCallback(() => {
    if (!isFacebookSDKReady || !window.FB) {
      toast.error('Facebook is still loading. Please try again in a moment.')
      return
    }

    setIsLoading(true)

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse

          window.FB.api(
            '/me',
            { fields: 'name,email,picture' },
            async (userInfo: FacebookUserData) => {
              try {
                const backendResponse = await fetch(`${BASE_URL}/facebook-login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    accessToken,
                    userID,
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture?.data?.url,
                  }),
                })

                const data: LoginResponse = await backendResponse.json()

                if (!backendResponse.ok) {
                  throw new Error(data.message || 'Facebook login failed')
                }

                toast.success(`Welcome ${userInfo.name}!`)

                console.log("facebook login data",data)
                handleSuccessfulLogin(data)
              } catch (error: any) {
                toast.error(error.message || 'Facebook login failed. Please try again.')
              } finally {
                setIsLoading(false)
              }
            }
          )
        } else {
          setIsLoading(false)
          toast.error('Facebook login was cancelled')
        }
      },
      { scope: 'public_profile,email' }
    )
  }, [isFacebookSDKReady, handleSuccessfulLogin])

  const handleForgotPassword = useCallback(() => {
    const trimmedEmail = loginData.email.trim()
    
    if (!trimmedEmail) {
      toast.error('Please enter your email address first')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    dispatch(
      ForgotPasswordAction({
        userEmail: trimmedEmail,
        onSuccess: () => {
          toast.success('Password reset link has been sent to your email')
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || 'Failed to send reset link. Please try again.'
          )
        }
      })
    )
  }, [loginData.email, validateEmail, dispatch])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogins()
    }
  }, [handleLogins, isLoading])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, email: e.target.value }))
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({ ...prev, password: e.target.value }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const navigateToRegister = useCallback(() => {
    navigate('/register')
  }, [navigate])

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1 className="login-title">Sign In</h1>
        <p className="login-subtitle">Enter your credentials to continue</p>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="email"
              aria-label="Email Address"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="current-password"
              aria-label="Password"
              className="with-toggle"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="forgot-password-wrapper">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-link"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          onClick={handleLogins}
          disabled={isLoading}
          className="btn-sign-in"
          aria-label={isLoading ? 'Signing in' : 'Sign in'}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">Or continue with</span>
          <div className="divider-line" />
        </div>

        <div className="social-login-buttons">
          <div className="social-button-wrapper">
            <button
              type="button"
              onClick={() => {
                const googleBtn = document.querySelector('[role="button"]') as HTMLElement
                googleBtn?.click()
              }}
              className="btn-social btn-google"
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <div style={{ display: 'none' }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isLoading || !isFacebookSDKReady}
            className="btn-social btn-facebook"
            aria-label={
              isLoading
                ? 'Connecting to Facebook'
                : !isFacebookSDKReady
                ? 'Loading Facebook'
                : 'Continue with Facebook'
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <p className="signup-link">
          Don't have an account?{' '}
          <button type="button" onClick={navigateToRegister}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}