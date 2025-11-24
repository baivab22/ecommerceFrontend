// ============================================
// FRONTEND FILE 1: LoginPage.tsx (COMPLETE REWRITE)
// ============================================

import React, { useState, useEffect } from 'react'
import './_loginPage.scss'
import { useDispatch } from 'src/store'
import { ForgotPasswordAction, LoginAction } from './login.slice'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { setCookie } from 'src/helpers'
import { useAuth } from 'src/app/routing'
import { Eye, EyeOff } from 'lucide-react'
import { useMedia } from 'src/hooks'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

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

const API_BASE_URL = 'http://localhost:8000/api'
const FACEBOOK_APP_ID = '2593546121022183'
const TIKTOK_CLIENT_KEY = 'YOUR_TIKTOK_CLIENT_KEY' // Replace with your TikTok Client Key
const TIKTOK_REDIRECT_URI = 'http://localhost:3010/tiktok-callback' // Your callback URL

// Facebook SDK type declaration
declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

export const LoginPage = () => {
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFacebookSDKReady, setIsFacebookSDKReady] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { handleLogin } = useAuth()
  const media = useMedia()

  // Initialize Facebook SDK
  useEffect(() => {
    // Load Facebook SDK script
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) {
        return
      }

      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      
      const firstScript = document.getElementsByTagName('script')[0]
      firstScript.parentNode?.insertBefore(script, firstScript)
    }

    // Initialize Facebook SDK when loaded
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      })
      
      setIsFacebookSDKReady(true)
      console.log('Facebook SDK initialized successfully')
    }

    loadFacebookSDK()
  }, [])

  // Handle TikTok callback
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      toast.error('TikTok login was cancelled or failed')
      navigate('/login', { replace: true })
      return
    }

    if (code && state) {
      // Verify state to prevent CSRF attacks
      const savedState = sessionStorage.getItem('tiktok_state')
      
      if (state !== savedState) {
        toast.error('Invalid state parameter. Please try again.')
        navigate('/login', { replace: true })
        return
      }

      // Clear the state
      sessionStorage.removeItem('tiktok_state')

      // Handle TikTok login with the code
      handleTikTokCallback(code)
    }
  }, [location])

  const handleLogins = () => {
    if (loginData.email.length === 0 || loginData.password.length === 0) {
      toast.error('Please fill in both email and password')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    let userRole = 'USER'

    // Hardcoded admin credentials - direct login without API call
    if (
      loginData?.email === 'adminemail12@gmail.com' &&
      loginData?.password === '123456783'
    ) {
      userRole = 'ADMIN'
      setCookie('userRoles', 'ADMIN')
      const mockAdminData = {
        message: 'Login successful',
        success: true,
        user: {
          _id: '68c432bec123ae6086bd1866',
          email: 'adminemail12@gmail.com',
          name: 'Admin',
          role: 'ADMIN'
        },
        userRoles: 'ADMIN',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM0MzJiZWMxMjNhZTYwODZiZDE4NjYiLCJlbWFpbCI6ImFkbWluZW1haWwxMkBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTg3MzUxOTQsImV4cCI6MTc1ODgyMTU5NH0.OUke0Im6mpImGyi8nH3OoMB-BU2Fj8j8Nsxzr338ZOo',
        expiresIn: '24h'
      }
      handleLogin(mockAdminData.token, 'ADMIN', mockAdminData)
      setCookie('userId', mockAdminData.user._id)
      toast.success('Logged in as Admin')
      setIsLoading(false)
      navigate('/home')
      return
    } else if (
      loginData?.email === 'meromail123@gmail.com' &&
      loginData?.password === '12345673'
    ) {
      userRole = 'ADMIN'
      setCookie('userRoles', 'ADMIN')
      const mockAdminData = {
        message: 'Login successful',
        success: true,
        user: {
          _id: '68c432bec123ae6086bd1867',
          email: 'meromail123@gmail.com',
          name: 'Admin 2',
          role: 'ADMIN'
        },
        userRoles: 'ADMIN',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM0MzJiZWMxMjNhZTYwODZiZDE4NjciLCJlbWFpbCI6Im1lcm9tYWlsMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1ODczNTE5NCwiZXhwIjoxNzU4ODIxNTk0fQ.OUke0Im6mpImGyi8nH3OoMB-BU2Fj8j8Nsxzr338ZOo',
        expiresIn: '24h'
      }
      handleLogin(mockAdminData.token, 'ADMIN', mockAdminData)
      setCookie('userId', mockAdminData.user._id)
      toast.success('Logged in as Admin')
      setIsLoading(false)
      navigate('/home')
      return
    }

    // Regular login flow via API
    dispatch(
      LoginAction({
        loginBody: {
          email: loginData.email.trim(),
          password: loginData.password
        },
        onSuccess: (data: any) => {
          setIsLoading(false)
          toast.success('Logged in successfully')

          if (data?.user?._id) {
            setCookie('userId', data.user._id)
          }

          // Handle role assignment
          if (data?.userRoles) {
            setCookie('userRoles', data.userRoles)
            handleLogin(data.token, data.userRoles, data)
          } else {
            setCookie('userRoles', 'USER')
            handleLogin(data.token, 'USER', data)
          }

          navigate('/home')
        },
        onError: (error: any) => {
          setIsLoading(false)
          if (error?.response?.status === 401) {
            toast.error('Invalid email or password')
          } else if (error?.response?.status === 404) {
            toast.error('User not found')
          } else if (error?.response?.status >= 500) {
            toast.error('Server error. Please try again later.')
          } else {
            toast.error(
              error?.response?.data?.message || 'Login failed. Please try again.'
            )
          }
        }
      })
    )
  }

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true)
      
      // Decode the JWT credential from Google
      const decodedResponse: GoogleUserData = jwtDecode(
        credentialResponse.credential
      )

      console.log('Google User Data:', decodedResponse)

      // Call the separate Google login endpoint
      const response = await fetch(`${API_BASE_URL}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: credentialResponse.credential,
          name: decodedResponse.name,
          picture: decodedResponse.picture,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed')
      }

      setIsLoading(false)
      toast.success(`Welcome ${decodedResponse.name}!`)

      // Store user information
      if (data?.user?._id) {
        setCookie('userId', data.user._id)
      }

      if (data.user?.picture) {
        setCookie('userPicture', data.user.picture)
      }
      
      if (data.user?.name) {
        setCookie('userName', data.user.name)
      }

      // Handle role assignment
      if (data?.userRoles) {
        setCookie('userRoles', data.userRoles)
        handleLogin(data.token, data.userRoles, data)
      } else {
        setCookie('userRoles', 'USER')
        handleLogin(data.token, 'USER', data)
      }

      navigate('/home')
    } catch (error: any) {
      setIsLoading(false)
      console.error('Google Login Error:', error)
      toast.error(error.message || 'Google login failed. Please try again.')
    }
  }

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed')
    toast.error('Google login failed. Please try again.')
  }

  const handleFacebookLogin = () => {
    if (!isFacebookSDKReady) {
      toast.error('Facebook SDK is still loading. Please try again in a moment.')
      return
    }

    if (!window.FB) {
      toast.error('Facebook SDK not loaded. Please refresh the page.')
      return
    }

    setIsLoading(true)

    window.FB.login(
      (response: any) => {
        console.log('Facebook login response:', response)

        if (response.authResponse) {
          // User successfully logged in
          const { accessToken, userID } = response.authResponse

          // Get user profile information
          window.FB.api('/me', { fields: 'name,email,picture' }, async (userInfo: FacebookUserData) => {
            console.log('Facebook user info:', userInfo)

            try {
              // Send to backend
              const backendResponse = await fetch(`${API_BASE_URL}/facebook-login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  accessToken: accessToken,
                  userID: userID,
                  name: userInfo.name,
                  email: userInfo.email,
                  picture: userInfo.picture?.data?.url,
                }),
              })

              const data = await backendResponse.json()

              if (!backendResponse.ok) {
                throw new Error(data.message || 'Facebook login failed')
              }

              setIsLoading(false)
              toast.success(`Welcome ${userInfo.name}!`)

              // Store user information
              if (data?.user?._id) {
                setCookie('userId', data.user._id)
              }

              if (data.user?.picture) {
                setCookie('userPicture', data.user.picture)
              }
              
              if (data.user?.name) {
                setCookie('userName', data.user.name)
              }

              // Handle role assignment
              if (data?.userRoles) {
                setCookie('userRoles', data.userRoles)
                handleLogin(data.token, data.userRoles, data)
              } else {
                setCookie('userRoles', 'USER')
                handleLogin(data.token, 'USER', data)
              }

              navigate('/home')
            } catch (error: any) {
              setIsLoading(false)
              console.error('Facebook Login Backend Error:', error)
              toast.error(error.message || 'Facebook login failed. Please try again.')
            }
          })
        } else {
          // User cancelled login or did not fully authorize
          setIsLoading(false)
          toast.error('Facebook login was cancelled')
          console.log('Facebook login cancelled by user')
        }
      },
      { scope: 'public_profile,email' }
    )
  }

  const handleTikTokLogin = () => {
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Store state in sessionStorage for verification
    sessionStorage.setItem('tiktok_state', state)
    
    // TikTok OAuth authorization URL
    const scope = 'user.info.basic' // Request basic user info
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}&state=${state}`
    
    console.log('Redirecting to TikTok OAuth:', authUrl)
    
    // Redirect to TikTok authorization page
    window.location.href = authUrl
  }

  const handleTikTokCallback = async (code: string) => {
    try {
      setIsLoading(true)
      console.log('Processing TikTok callback with code:', code)

      // Send authorization code to backend
      const response = await fetch(`${API_BASE_URL}/tiktok-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirectUri: TIKTOK_REDIRECT_URI
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'TikTok login failed')
      }

      setIsLoading(false)
      toast.success(`Welcome ${data.user.name || 'TikTok User'}!`)

      // Store user information
      if (data?.user?._id) {
        setCookie('userId', data.user._id)
      }

      if (data.user?.picture) {
        setCookie('userPicture', data.user.picture)
      }
      
      if (data.user?.name) {
        setCookie('userName', data.user.name)
      }

      // Handle role assignment
      if (data?.userRoles) {
        setCookie('userRoles', data.userRoles)
        handleLogin(data.token, data.userRoles, data)
      } else {
        setCookie('userRoles', 'USER')
        handleLogin(data.token, 'USER', data)
      }

      navigate('/home')
    } catch (error: any) {
      setIsLoading(false)
      console.error('TikTok Login Error:', error)
      toast.error(error.message || 'TikTok login failed. Please try again.')
      navigate('/login', { replace: true })
    }
  }

  const handleForgotPassword = () => {
    if (!loginData.email) {
      toast.error('Please enter your email address first')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    dispatch(
      ForgotPasswordAction({
        userEmail: loginData.email.trim(),
        onSuccess: () => {
          toast.success('Password reset link has been sent to your email')
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              'Failed to send reset link. Please try again.'
          )
        }
      })
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogins()
    }
  }

  React.useEffect(() => {
    console.log('LoginPage mounted')
  }, [])

  return (
    <>
      <h2 className="login-title">Log in</h2>
      <div className="container" style={{ paddingTop: 0 }}>
        <div className="login-form">
          <div>
            <label htmlFor="email">Email </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              name="email"
              required
              value={loginData.email}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label htmlFor="password">Password </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="password"
                name="password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value
                  }))
                }
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '60%',
                  cursor: 'pointer',
                  transform: 'translateY(-50%)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <button
            className="btn btn--form"
            style={{
              background: isLoading ? '#ccc' : 'rgb(197 49 213)',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            type="submit"
            onClick={handleLogins}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              flexDirection: !media.md ? 'column' : 'row',
              gap: !media.md ? '10px' : '0'
            }}
          >
            <p
              onClick={handleForgotPassword}
              style={{
                cursor: 'pointer',
                color: 'rgb(197 49 213)',
                textDecoration: 'underline'
              }}
            >
              Forgot Password?
            </p>

            <div>
              Not Registered yet?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{
                  cursor: 'pointer',
                  color: 'rgb(197 49 213)',
                  textDecoration: 'underline'
                }}
              >
                Register Now
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0',
              gap: '10px'
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
            <span style={{ color: '#666', fontSize: '14px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          </div>

          {/* Social Login Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              alignItems: 'center'
            }}
          >
            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />

            {/* Facebook Login Button */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading || !isFacebookSDKReady}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 20px',
                border: '1px solid #1877f2',
                borderRadius: '4px',
                background: isLoading || !isFacebookSDKReady ? '#ccc' : '#1877f2',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || !isFacebookSDKReady ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && isFacebookSDKReady) {
                  e.currentTarget.style.background = '#166fe5'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && isFacebookSDKReady) {
                  e.currentTarget.style.background = '#1877f2'
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {isLoading ? 'Connecting...' : !isFacebookSDKReady ? 'Loading Facebook...' : 'Continue with Facebook'}
            </button>

            {/* TikTok Login Button */}
            <button
              onClick={handleTikTokLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 20px',
                border: '1px solid #000',
                borderRadius: '4px',
                background: isLoading ? '#ccc' : '#000',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#333'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#000'
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              {isLoading ? 'Connecting...' : 'Continue with TikTok'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
