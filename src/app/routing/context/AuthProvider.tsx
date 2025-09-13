import {
  createContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
  memo
} from 'react'
// import {authenticateUser} from 'src/app/pages/login/login.slice'
import {useDispatch} from 'src/store'
import {removeCookie, setCookie} from '../../../helpers'
// import {useDispatch} from 'react-redux'
// import {userAuthAction} from '../../../redux'

type AuthProps = {
  isLoggedin: boolean
  role: string
}

interface ContextProps {
  auth: AuthProps
  setAuth: Function
  sidenavExpand: boolean
  setSidenavExpand: Dispatch<SetStateAction<boolean>>
  handleLogin: (a: string, b: string,c:any) => void
  handleLogout: () => void
  loginData: any  
  setLoginData?: Dispatch<SetStateAction<any>>
}

const defaultValue: ContextProps = {
  auth: {isLoggedin: false, role: ''},
  setAuth: () => {},
  sidenavExpand: true,
  setSidenavExpand: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
  loginData: null,
  setLoginData: () => {}
}

export const AuthContext = createContext<ContextProps>(defaultValue)

export const AuthProvider = memo(({children}: any) => {
  const dispatch = useDispatch()
  const [auth, setAuth] = useState<AuthProps>({
    isLoggedin: false,
    role: 'USER'
  })

  const [sidenavExpand, setSidenavExpand] = useState<boolean>(true)
  const [authLoading, setAuthLoading] = useState(true)

  const [loginData, setLoginData] = useState(null)
  // const dispatch = useDispatch()

  const loginSuccess = (role: string) => {
    console.log(role, 'role')
    setAuth({
      isLoggedin: true,
      role: role
    })
  }

  const loginFailure = () => {
    setAuth({
      isLoggedin: false,
      role: 'USER'
    })
  }

  useEffect(() => {
    setAuthLoading(true)
    // dispatch(
    //   authenticateUser({
    //     onSuccess: () => {
    //       loginSuccess('ADMIN')
    //       setAuthLoading(false)
    //     },
    //     onFailure: () => {
    //       setAuthLoading(false)
    //     }
    //   })
    // )
    loginSuccess('ADMIN')
    setAuthLoading(false)
  }, [])

  if (authLoading) {
    return <div>Redirecting...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        sidenavExpand,
        setSidenavExpand,
        loginData,
        setLoginData,
        handleLogin: (token?: string, role?: string,loginDatas?:any) => {
          token && setCookie('token', token)
          role && loginSuccess(role)
      setLoginData(loginDatas)




        },
        handleLogout: () => {
          loginFailure()
          removeCookie('token')
          removeCookie('@token')
          removeCookie('userId')
          removeCookie('userRoles')
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  )
})

export default AuthContext
