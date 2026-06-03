import React, {useEffect, useState} from 'react'

import './_resetPassword.scss'
import {useDispatch} from 'src/store'

import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import {setCookie} from 'src/helpers'
import {useAuth} from 'src/app/routing'
import {useParams} from 'src/hooks'

import {ResetPasswordAction} from './resetPassword.slice'
export const ResetPasswordPage = () => {
  const dispatch = useDispatch()

  // const resetToken = useParams('resetToken')
  const router = useRouter()
  const resetToken = Array.isArray(router.query.resetToken)
    ? router.query.resetToken[0]
    : router.query.resetToken

  console.log(resetToken, 'resetTokens')
  // const age = queryParams.get('age')

  const [loginData, setLoginData] = useState({
    password: '',
    confirmpassword: ''
  })
  const {handleLogin} = useAuth()
  const handleResetPassword = () => {
    // console.log(loginData, 'logindatat')

    if (loginData.password.length > 0 && loginData.confirmpassword.length > 0) {
      console.log(resetToken, 'resetToken from ')
      dispatch(
        ResetPasswordAction({
          loginBody: {
            newPassword: loginData.confirmpassword,
            resetToken: resetToken
          },
          onSuccess: (data: any) => {
            console.log(data?.user?._id, 'success login')
            toast.success('Password reset successfully')

            router.push('/login')
            console.log('loginnnnnnnn')
            setCookie('userId', data?.user?._id)
            // setCookie('userRoles', data?.userRoles)
          }
        })
      )
    }
  }

  return (
    <>
      <h2 className="login-title">Reset your password</h2>
      <div className="container">
        <div className="login-form">
          {/* <div>
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
          </div> */}

          <div>
            <label htmlFor="password">New Password </label>
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

          <div>
            <label htmlFor="password">Confirm Password </label>
            <input
              id="password"
              type="password"
              placeholder="password"
              name="password"
              required
              onChange={(e: any) =>
                setLoginData((prev: any) => ({
                  ...prev,
                  confirmpassword: e.target.value
                }))
              }
            />
          </div>

          <button
            className="btn btn--form"
            style={{background: 'rgb(197 49 213)'}}
            type="submit"
            value="Log in"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>

          {/* <p onClick={handleResetPassword}>Reset Password?</p> */}
        </div>
      </div>
    </>
  )
}
