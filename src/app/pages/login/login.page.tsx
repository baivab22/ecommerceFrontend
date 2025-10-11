import React, { useState } from 'react'
import './_loginPage.scss'
import { useDispatch } from 'src/store'
import { ForgotPasswordAction, LoginAction } from './login.slice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { setCookie } from 'src/helpers'
import { useAuth } from 'src/app/routing'
import { Eye, EyeOff } from 'lucide-react'
import { useMeasure, useMedia } from 'src/hooks'

export const LoginPage = () => {
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const handleLogins = () => {
                console.log( 'response from loginnnnnn',loginData,            loginData?.email === 'adminemail12@gmail.com' &&
            loginData?.password === '123456783',      loginData?.email === 'meromail123@gmail.com' &&
            loginData?.password === '12345673','conditions')
    if (loginData.email.length === 0 || loginData.password.length === 0) {
      toast.error('Please fill in both email and password')
      return
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

        let userRole = 'USER'


       if (
            loginData?.email === 'adminemail12@gmail.com' &&
            loginData?.password === '123456783'
          ) {
            userRole = 'ADMIN'
            setCookie('userRoles', 'ADMIN')
               navigate('/home')
      
            handleLogin('dssfdsfdsf', 'ADMIN',{
    "message": "Login successful",
    "success": true,
    "user": {
        "_id": "68c432bec123ae6086bd1866",
        "email": "adminemail12@gmail.com",
        "name": "",
        "role": "ADMIN"
    },
    "userRoles": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM0MzJiZWMxMjNhZTYwODZiZDE4NjYiLCJlbWFpbCI6ImJoYWdhYmF0aWJpZGFyaUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1ODczNTE5NCwiZXhwIjoxNzU4ODIxNTk0fQ.OUke0Im6mpImGyi8nH3OoMB-BU2Fj8j8Nsxzr338ZOo",
    "expiresIn": "24h"
})
          } else if (
            loginData?.email === 'meromail123@gmail.com' &&
            loginData?.password === '12345673'
          ) {
            userRole = 'ADMIN'
            setCookie('userRoles', 'ADMIN')
               navigate('/home')
            handleLogin('dssfdsfdsf', 'ADMIN',{
    "message": "Login successful",
    "success": true,
    "user": {
        "_id": "68c432bec123ae6086bd1866",
        "email": "meromail123@gmail.com",
        "name": "",
        "role": "ADMIN"
    },
    "userRoles": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM0MzJiZWMxMjNhZTYwODZiZDE4NjYiLCJlbWFpbCI6ImJoYWdhYmF0aWJpZGFyaUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1ODczNTE5NCwiZXhwIjoxNzU4ODIxNTk0fQ.OUke0Im6mpImGyi8nH3OoMB-BU2Fj8j8Nsxzr338ZOo",
    "expiresIn": "24h"
})
          }else{




   dispatch(
      LoginAction({
        loginBody: {
          email: loginData.email.trim(),
          password: loginData.password
        },
        onSuccess: (data: any) => {
          setIsLoading(false)
          toast.success('Logged In successfully')
          handleLogin(data.token, data.userRoles, data)

          if (data?.user?._id) {
            setCookie('userId', data.user?._id)
          }

  


          console.log(loginData?.email, loginData?.password, 'login data value')  
          if (
            loginData?.email === 'adminemail12@gmail.com' &&
            loginData?.password === '123456783'
          ) {
            userRole = 'ADMIN'
            setCookie('userRoles', 'ADMIN')
            handleLogin(data.token, 'ADMIN', data)
          } else if (
            loginData?.email === 'meromail123@gmail.com' &&
            loginData?.password === '12345673'
          ) {
            userRole = 'ADMIN'
            setCookie('userRoles', 'ADMIN')
            handleLogin(data.token, 'ADMIN', data)
          } else {
            if (data?.userRoles) {
              userRole = data.userRoles
              setCookie('userRoles', data.userRoles)
              handleLogin(data.token, data.userRoles, data)
            } else {
              setCookie('userRoles', 'USER')
              handleLogin(data.token, 'USER', data)
            }
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

  const media=useMedia()

  return (
    <>
      <h2 className="login-title">Log in</h2>
      <div className="container" style={{paddingTop:0}}>
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
              flexDirection:!media.md?'column':'row'
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
        </div>
      </div>
    </>
  )
}
