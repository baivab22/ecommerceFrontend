import React, {useEffect, useState} from 'react'

import './_register.scss'
import {useDispatch} from 'src/store'
import {RegisterAction} from './register.slice'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import {setCookie} from 'src/helpers'
import { HStack } from 'src/app/common'
export const RegisterPage = () => {
  const dispatch = useDispatch()

  const [loginData, setLoginData] = useState({email: '', password: ''})
  const navigate = useNavigate()
  const handleRegister = () => {
    // console.log(loginData, 'logindatat')

    if (loginData.email.length > 0 && loginData.password.length > 0) {
      dispatch(
        RegisterAction({
          registerBody: {email: loginData.email, password: loginData.password},
          onSuccess: (data: any) => {
            toast.success('User Created successfully')
            setCookie('userId', data?.user?._id)
            navigate('/login')
          }
        })
      )
    }
  }

  return (
    <>
      <h2 className="login-title">Create Your Account</h2>
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
              onChange={(e: any) =>
                setLoginData((prev: any) => ({...prev, email: e.target.value}))
              }
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
              onChange={(e: any) =>
                setLoginData((prev: any) => ({
                  ...prev,
                  password: e.target.value
                }))
              }
            />
          </div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:"center",width:'100%'}}>
          <button
            className="btn btn--form"
            style={{background: 'rgb(197 49 213)'}}
            type="submit"
            value="register"
            onClick={handleRegister}
          >
            Register
          </button>

         <div>Already Register?     <span
            onClick={() => navigate('/login')}
            style={{
              cursor: 'pointer',
              // color: 'black',
                   color: 'rgb(197 49 213)',
              textDecoration: 'underline'
            }}
          >
Login Now
          </span></div> 
         
          </div>
        </div>
      </div>
    </>
  )
}
