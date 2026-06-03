import { useRouter } from 'next/router'

export function useQuery(queryStr: string | null = null) {
  const router = useRouter()
  const asPath = router.asPath || ''
  const search = asPath.split('?')[1] || ''

  const queryParams = new URLSearchParams(queryStr ?? (search ? `?${search}` : ''))

  const resultObject = {} as any
  for (const [key, value] of queryParams.entries()) {
    resultObject[key] = value
  }

  return resultObject
}

export function useParams(param?: string): any {
  const router = useRouter()
  const params = router.query || {}

  return param ? params[param] : params
}
