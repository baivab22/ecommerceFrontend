import React, {useEffect, useState} from 'react'
import './_loginPage.scss'
import {useDispatch} from 'src/store'
import {ForgotPasswordAction, LoginAction} from './login.slice'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import {setCookie} from 'src/helpers'
import {useAuth} from 'src/app/routing'

export const LoginPage = () => {
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({email: '', password: ''})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {handleLogin} = useAuth()

  const handleLogins = () => {
    // Validate input fields
    if (loginData.email.length === 0 || loginData.password.length === 0) {
      toast.error('Please fill in both email and password')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    console.log(loginData, 'login data value hai')

    dispatch(
      LoginAction({
        loginBody: {
          email: loginData.email.trim(),
          password: loginData.password
        },
        onSuccess: (data: any) => {
          setIsLoading(false)
          console.log(data?.user?._id, 'success login')
          toast.success('Logged In successfully')
          
          // Set user ID cookie
          if (data?.user?._id) {
            setCookie('userId', data.user?._id)
          }

          // Determine user role and set appropriate cookies
          let userRole = 'USER' // default role
          
          // Check if this is admin login (you can modify this logic based on your needs)
          if (
            loginData?.email === 'adminemail12@gmail.com' &&
            loginData?.password === '123456783'
          ) {
            userRole = 'ADMIN'
            setCookie('userRoles', 'ADMIN')
            handleLogin(data.token, 'ADMIN')
          } else if (
            loginData?.email === 'meromail123@gmail.com' &&
            loginData?.password === '12345673'
          ) {
            userRole = 'ADMIN'
            setCookie('userRoles', 'ADMIN')
            handleLogin(data.token, 'ADMIN')
          } else {
            // Check if user role is provided in API response
            if (data?.userRoles) {
              userRole = data.userRoles
              setCookie('userRoles', data.userRoles)
              handleLogin(data.token, data.userRoles)
            } else {
              setCookie('userRoles', 'USER')
              handleLogin(data.token, 'USER')
            }
          }

          console.log('User logged in with role:', userRole)
          
          // Navigate to home page
          navigate('/home')
        },
        onError: (error: any) => {
          setIsLoading(false)
          console.error('Login error:', error)
          
          // Handle different error scenarios
          if (error?.response?.status === 401) {
            toast.error('Invalid email or password')
          } else if (error?.response?.status === 404) {
            toast.error('User not found')
          } else if (error?.response?.status >= 500) {
            toast.error('Server error. Please try again later.')
          } else {
            toast.error(error?.response?.data?.message || 'Login failed. Please try again.')
          }
        }
      })
    )
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
          console.error('Forgot password error:', error)
          toast.error(error?.response?.data?.message || 'Failed to send reset link. Please try again.')
        }
      })
    )
  }

  // Handle Enter key press for form submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogins()
    }
  }

  return (
    <>
      <h2 className="login-title">Log in</h2>
      <div className="container">
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLoginData((prev) => ({...prev, email: e.target.value}))
              }
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password">Password </label>
            <input
              id="password"
              type="password"
              placeholder="password"
              name="password"
              required
              value={loginData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value, " value data hai")
                setLoginData((prev) => ({
                  ...prev,
                  password: e.target.value
                }))
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
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
        </div>
      </div>
    </>
  )
}