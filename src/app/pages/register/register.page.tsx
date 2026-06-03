// import React, { useState } from 'react'
// import './_register.scss'
// import { useDispatch } from 'src/store'
// import { RegisterAction } from './register.slice'
// import toast from 'react-hot-toast'
// import { useNavigate } from 'react-router-dom'
// import { setCookie } from 'src/helpers'
// import { Eye, EyeOff } from 'lucide-react'
// import { useMedia } from 'src/hooks'

// export const RegisterPage = () => {
//   const dispatch = useDispatch()
//   const [loginData, setLoginData] = useState({ email: '', password: '' })
//   const [showPassword, setShowPassword] = useState(false)
//   const navigate = useNavigate()
//   const media=useMedia()

//   // ✅ Email validation helper
//   const isValidEmail = (email: string) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return regex.test(email)
//   }

//   const handleRegister = () => {
//     if (!loginData.email || !loginData.password) {
//       toast.error('Please fill all fields')
//       return
//     }

//     if (!isValidEmail(loginData.email)) {
//       toast.error('Please enter a valid email address')
//       return
//     }

//     dispatch(
//       RegisterAction({
//         registerBody: { email: loginData.email, password: loginData.password },
//         onSuccess: (data: any) => {
//           toast.success('User Created successfully')
//           setCookie('userId', data?.user?._id)
//           navigate('/login')
//         },

//         onerror: (error: any) => {
//           console.log("error page",error)
//           toast.error(error?.data.message || 'Something went wrong')
//         }
//       })
//     )
//   }

//   return (
//     <>
//       <h2 className="login-title">Create Your Account</h2>
//       <div className="container"
//       style={{paddingTop:0}}
//       >
//         <div className="login-form">
//           <div>
//             <label htmlFor="email">Email </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="example@gmail.com"
//               name="email"
//               required
//               onChange={(e: any) =>
//                 setLoginData((prev: any) => ({ ...prev, email: e.target.value }))
//               }
//             />
//           </div>

//           <div style={{ position: 'relative' }}>
//             <label htmlFor="password">Password </label>
           
//            <div style={{ position: 'relative' }}>
//                  <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               placeholder="password"
//               name="password"
//               required
//               onChange={(e: any) =>
//                 setLoginData((prev: any) => ({
//                   ...prev,
//                   password: e.target.value
//                 }))
//               }
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               style={{
//                 position: 'absolute',
//                 right: '10px',
//                 top: '60%',
//                 transform: 'translateY(-50%)',
//                 cursor: 'pointer'
//               }}
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </span>
//            </div>
       
//           </div>

//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               width: '100%',
//               flexDirection:!media.md?'column':'row'
//             }}
//           >
//             <button
//               className="btn btn--form"
//               style={{ background: 'rgb(197 49 213)' }}
//               type="submit"
//               value="register"
//               onClick={handleRegister}
//             >
//               Register
//             </button>

//             <div>
//               Already Registered?{' '}
//               <span
//                 onClick={() => navigate('/login')}
//                 style={{
//                   cursor: 'pointer',
//                   color: 'rgb(197 49 213)',
//                   textDecoration: 'underline'
//                 }}
//               >
//                 Login Now
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }



import React, { useState, useEffect, useCallback } from 'react'
import './_register.scss'
import { useDispatch } from 'src/store'
import { RegisterAction } from './register.slice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { setCookie } from 'src/helpers'
import { useAuth } from 'src/app/routing'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
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

interface RegisterResponse {
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
const FACEBOOK_APP_ID = '2593546121022183'

declare global {
  interface Window {
    FB: any
    fbAsyncInit: () => void
  }
}

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { handleLogin } = useAuth()
  
  const [registerData, setRegisterData] = useState({ 
    // name: '',
    email: '', 
    password: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFacebookSDKReady, setIsFacebookSDKReady] = useState(false)

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }, [])

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= 6
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

  const handleSuccessfulRegistration = useCallback((data: RegisterResponse) => {
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
    
    if (data.token) {
      handleLogin(data.token, userRole, data)
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [handleLogin, router])

  const handleRegister = useCallback(() => {
    const trimmedEmail = registerData.email.trim()
    const trimmedPassword = registerData.password
    // const trimmedName = registerData.name.trim()

    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validatePassword(trimmedPassword)) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    dispatch(
      RegisterAction({
        registerBody: { 
          // name: trimmedName,
          email: trimmedEmail, 
          password: trimmedPassword 
        },
        onSuccess: (data: any) => {
          setIsLoading(false)
          toast.success('Account created successfully!')
          handleSuccessfulRegistration(data)
        },
        onerror: (error: any) => {
          setIsLoading(false)
          const errorMessage = error?.response?.data?.message || error?.data?.message || 'Registration failed. Please try again.'
          toast.error(errorMessage)
        }
      })
    )
  }, [registerData, validateEmail, validatePassword, handleSuccessfulRegistration, dispatch])

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

      const data: RegisterResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Google sign up failed')
      }

      toast.success(`Welcome ${decodedResponse.name}!`)
      handleSuccessfulRegistration(data)
    } catch (error: any) {
      toast.error(error.message || 'Google sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [handleSuccessfulRegistration])

  const handleGoogleLoginError = useCallback(() => {
    toast.error('Google sign up failed. Please try again.')
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

                const data: RegisterResponse = await backendResponse.json()

                if (!backendResponse.ok) {
                  throw new Error(data.message || 'Facebook sign up failed')
                }

                toast.success(`Welcome ${userInfo.name}!`)
                handleSuccessfulRegistration(data)
              } catch (error: any) {
                toast.error(error.message || 'Facebook sign up failed. Please try again.')
              } finally {
                setIsLoading(false)
              }
            }
          )
        } else {
          setIsLoading(false)
          toast.error('Facebook sign up was cancelled')
        }
      },
      { scope: 'public_profile,email' }
    )
  }, [isFacebookSDKReady, handleSuccessfulRegistration])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRegister()
    }
  }, [handleRegister, isLoading])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({ ...prev, name: e.target.value }))
  }, [])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({ ...prev, email: e.target.value }))
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({ ...prev, password: e.target.value }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const navigateToLogin = useCallback(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        {/* <h1 className="register-title">Create Account</h1> */}
        <p className="register-subtitle">Sign up </p>

        {/* <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={registerData.name}
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="name"
              aria-label="Full Name"
            />
          </div>
        </div> */}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={registerData.email}
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
              placeholder="At least 6 characters"
              value={registerData.password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              autoComplete="new-password"
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

        <button
          type="submit"
          onClick={handleRegister}
          disabled={isLoading}
          className="btn-register"
          aria-label={isLoading ? 'Creating account' : 'Create account'}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
                text="signup_with"
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
                : 'Sign up with Facebook'
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <p className="login-link">
          Already have an account?{' '}
          <button type="button" onClick={navigateToLogin}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
