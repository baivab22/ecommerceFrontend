import React, { useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export function Link({ to, children, ...rest }: any) {
  return (
    <NextLink href={to} legacyBehavior>
      <a {...rest}>{children}</a>
    </NextLink>
  )
}

export function NavLink({ to, children, activeClassName = 'active', className = '', ...rest }: any) {
  const router = useRouter()
  const isActive = router.asPath === to || router.asPath.startsWith(to + '/')
  return (
    <NextLink href={to} legacyBehavior>
      <a className={[className, isActive ? activeClassName : ''].filter(Boolean).join(' ')} {...rest}>
        {children}
      </a>
    </NextLink>
  )
}

export function useNavigate() {
  const router = useRouter()
  return (to: any, options?: { replace?: boolean }) => {
    if (options && options.replace) return router.replace(to)
    return router.push(to)
  }
}

export function useLocation() {
  const router = useRouter()
  const asPath = router.asPath || ''
  const [pathPart, hashPart] = asPath.split('#')
  const [pathnamePart, searchPart] = pathPart.split('?')
  return {
    pathname: router.pathname || pathnamePart || '/',
    search: searchPart ? `?${searchPart}` : '',
    hash: hashPart ? `#${hashPart}` : ''
  }
}

export function useParams() {
  const router = useRouter()
  return router.query || {}
}

export function useSearchParams() {
  const router = useRouter()
  const asPath = router.asPath || ''
  const query = asPath.split('?')[1] || ''
  const params = new URLSearchParams(query)
  const setSearchParams = (next: URLSearchParams) => {
    const newQs = next.toString()
    const base = router.pathname
    router.push(newQs ? `${base}?${newQs}` : base)
  }
  return [params, setSearchParams]
}

export function Navigate({ to, replace = false }: any) {
  const router = useRouter()
  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [to, replace])
  return null
}

export const Outlet = ({ children }: any) => <>{children}</>

export function matchPath(pattern: string, pathname: string) {
  if (!pattern) return false
  const normalize = (path: string) => path.startsWith('/') ? path : '/' + path
  pattern = normalize(pattern)
  pathname = normalize(pathname)

  if (pattern === pathname) return true

  if (pattern.endsWith('/*')) {
    const basePattern = pattern.slice(0, -2)
    if (pathname === basePattern) return true
    if (!pathname.startsWith(basePattern + '/')) return false

    const pParts = basePattern.split('/').filter(Boolean)
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length < pParts.length) return false

    return pParts.every((p, i) => p.startsWith(':') || p === pathParts[i])
  }

  // very small, permissive matcher supporting :param
  const pParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  if (pParts.length !== pathParts.length) return false
  return pParts.every((p, i) => p.startsWith(':') || p === pathParts[i])
}

export default {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
  Outlet,
  matchPath
}

// Compatibility no-ops for code that imports higher-level router APIs
export const BrowserRouter = ({ children }: any) => <>{children}</>
export const HashRouter = BrowserRouter
export function createBrowserRouter(routes: any) {
  return routes
}
export function RouterProvider({ router, children }: any) {
  return <>{children}</>
}
export function useRoutes(routes: any) {
  // Best-effort: render nothing when used in non-Next (Vite) entrypoints.
  return null
}
