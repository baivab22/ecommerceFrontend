import { useRouter } from 'next/router'

export function usePage() {
  const router = useRouter()
  const asPath = router.asPath || ''
  const query = asPath.split('?')[1] || ''
  const obj = new URLSearchParams(query)
  const page = obj.get('page')

  return Number(page || 1)
}
