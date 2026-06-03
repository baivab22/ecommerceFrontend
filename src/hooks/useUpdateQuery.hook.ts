
import { useRouter } from 'next/router'

type QueryObject = {[key: string]: string | number | undefined | null}

export const useUpdateQuery = () => {
  const router = useRouter()

  const updateQuery = (query: QueryObject) => {
    const asPath = router.asPath || ''
    const base = asPath.split('?')[0] || router.pathname || ''
    const currentQs = asPath.split('?')[1] || ''
    const updatedSearchParams = new URLSearchParams(currentQs)

    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const value = query[key]

        if (value === undefined || value === null) {
          updatedSearchParams.delete(key)
        } else {
          updatedSearchParams.set(key, String(value))
        }
      }
    }
    const newQs = updatedSearchParams.toString()
    const target = newQs ? `${base}?${newQs}` : base
    router.replace(target, undefined, { shallow: true })
  }
  return updateQuery
}
