import { useLocation, Navigate, Outlet, matchPath } from 'src/next-router-compat'
import {useMemo} from 'react'
import useAuth from '../hooks/useAuth'
import {USER_ROLES} from '../roles'
import {CompWrapper} from 'src/app/common'

type allowedRolesProps = {
  allowedRoles?: string[]
}

const ProtectedAuth = ({allowedRoles}: allowedRolesProps) => {
  const {auth} = useAuth()
  const location = useLocation()
  const canAccess = useCanAccessRoute()

  console.log('ProtectedAuth - canAccess:', canAccess, 'isLoggedin:', auth?.isLoggedin)

  // If not logged in, redirect to login
  if (!auth?.isLoggedin) {
    return <Navigate to="/login" state={{from: location}} replace />
  }

  // If logged in but no access to this route, redirect to home/dashboard
  if (canAccess?.length === 0) {
    return <Navigate to="/home" state={{from: location}} replace />
  }

  // If logged in and has access, render the protected content
  return <Outlet />
}

export const useCanAccessRoute = (url?: string) => {
  const {auth} = useAuth()
  const location = useLocation()

  const testRoutes = useMemo(() => {
    console.log('useCanAccessRoute - auth.role:', auth.role)
    return auth.role ? USER_ROLES[auth.role]?.access : []
  }, [auth.role])

  const canAccess = testRoutes.filter((path: any) => {
    return matchPath(path, url ?? location.pathname)
  })
  
  return canAccess
}

// PublicAuth - for pages that should only be accessible when NOT logged in
const PublicAuth = () => {
  const {auth} = useAuth()
  const location = useLocation()

  console.log('PublicAuth - isLoggedin:', auth?.isLoggedin, 'role:', auth.role)

  // If user is already logged in, redirect to appropriate dashboard/home
  if (auth?.isLoggedin) {
    const userRoutes = auth.role ? USER_ROLES[auth.role]?.access : []
    const redirectTo = userRoutes.length > 0 ? userRoutes[0] : '/home'
    
    console.log('PublicAuth - redirecting to:', redirectTo)
    return <Navigate to={redirectTo} state={{from: location}} replace />
  }

  // If not logged in, allow access to public pages (login, register, etc.)
  return <Outlet />

}

// UnrestrictedAuth - for pages accessible to everyone (logged in or not)
const UnrestrictedAuth = () => {
  // No auth check - everyone can access
  return <Outlet />
}

export {ProtectedAuth, PublicAuth, UnrestrictedAuth}