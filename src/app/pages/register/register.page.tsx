import React, { useState } from 'react'
import './_register.scss'
import { useDispatch } from 'src/store'
import { RegisterAction } from './register.slice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { setCookie } from 'src/helpers'
import { Eye, EyeOff } from 'lucide-react'
import { useMedia } from 'src/hooks'

export const RegisterPage = () => {
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const media=useMedia()

  // ✅ Email validation helper
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleRegister = () => {
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill all fields')
      return
    }

    if (!isValidEmail(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    dispatch(
      RegisterAction({
        registerBody: { email: loginData.email, password: loginData.password },
        onSuccess: (data: any) => {
          toast.success('User Created successfully')
          setCookie('userId', data?.user?._id)
          navigate('/login')
        },

        onerror: (error: any) => {
          console.log("error page",error)
          toast.error(error?.data.message || 'Something went wrong')
        }
      })
    )
  }

  return (
    <>
      <h2 className="login-title">Create Your Account</h2>
      <div className="container"
      style={{paddingTop:0}}
      >
        <div className="login-form">
          <div>
            <label htmlFor="email">Email </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              name="email"
              required
              onChange={(e: any) =>
                setLoginData((prev: any) => ({ ...prev, email: e.target.value }))
              }
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
              onChange={(e: any) =>
                setLoginData((prev: any) => ({
                  ...prev,
                  password: e.target.value
                }))
              }
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '60%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
           </div>
       
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              flexDirection:!media.md?'column':'row'
            }}
          >
            <button
              className="btn btn--form"
              style={{ background: 'rgb(197 49 213)' }}
              type="submit"
              value="register"
              onClick={handleRegister}
            >
              Register
            </button>

            <div>
              Already Registered?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{
                  cursor: 'pointer',
                  color: 'rgb(197 49 213)',
                  textDecoration: 'underline'
                }}
              >
                Login Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
