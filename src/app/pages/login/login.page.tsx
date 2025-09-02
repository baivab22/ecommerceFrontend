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
  const navigate = useNavigate()
  const {handleLogin} = useAuth()
  const handleLogins = () => {
    // console.log(loginData, 'logindatat')

    if (loginData.email.length > 0 && loginData.password.length > 0) {
      if (
        loginData?.email === 'meromail123@gmail.com' &&
        loginData?.password === '12345673'
      ) {
    
        setCookie('userRoles', 'ADMIN')
              navigate('/home')
      }

      console.log(loginData, 'login data value hai')

      // dispatch(
      //   LoginAction({
      //     loginBody: {email: loginData.email, password: loginData.password},
      //     onSuccess: (data: any) => {
      //       console.log(data?.user?._id, 'success login')
      //       toast.success('Logged In successfully')
      //       console.log('loginnnnnnnn')
      //       setCookie('userId', data?.user?._id)
      //       // setCookie('userRoles', data?.userRoles)
      //       console.log(
      //         loginData?.email,
      //         loginData?.password,
      //         'email and passwordddddd',
      //           loginData?.email === 'adminemail12@gmail.com' ,
      //         loginData?.password === '123456783"'
      //       )
      //       if (
      //         loginData?.email === 'adminemail12@gmail.com' &&
      //         loginData?.password === '123456783"'
      //       ) {
      //         setCookie('userRoles', 'ADMIN')
      //         handleLogin(data.token, 'ADMIN')
      //       } else {
      //         setCookie('userRoles', 'USER')
      //         handleLogin(data.token, 'USER')
      //       }

      //       navigate('/home')
      //       // navigate('/home')
      //     }
      //   })
      // )
    }
  }

  const handleForgotPassword = () => {
    dispatch(
      ForgotPasswordAction({
        userEmail: loginData.email,
        onSuccess: () => {
          toast.success('Password reset link has been sent to your email')
        }
      })
    )
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
              onChange={(e: any) =>{
                console.log(e.target.value," value data hai")
                setLoginData((prev: any) => ({
                  ...prev,
                  password: e.target.value
                }))}
              }
            />
          </div>

          <button
            className="btn btn--form"
            style={{background: 'rgb(197 49 213)'}}
            type="submit"
            value="Log in"
            onClick={handleLogins}
          >
            Log in
          </button>

          <p onClick={handleForgotPassword}>Forgot Password?</p>
        </div>
      </div>
    </>
  )
}
