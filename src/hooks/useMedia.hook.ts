import {useEffect, useState, useMemo} from 'react'

interface UseMediaReturn {
  xl: boolean
  lg: boolean
  md: boolean
  sm: boolean
  xs: boolean
}

export const useMedia = (): UseMediaReturn => {
  const xs = useGenericMedia(`(max-width: 640px)`)
  const sm = useGenericMedia(`(min-width: 640px)`)
  const md = useGenericMedia(`(min-width: 768px)`)
  const lg = useGenericMedia(`(min-width: 1024px)`)
  const xl = useGenericMedia(`(min-width: 1280px)`)

  const res = useMemo(() => ({xl, lg, md, sm, xs}), [xl, lg, md, sm, xs])

  return res
}

// MARK: - useGenericMedia
const useGenericMedia = (query: string) => {
  const [match, setMatch] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches
    }
    return false // Default for SSR
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    let mounted = true
    const mq = window.matchMedia(query)
    setMatch(mq.matches)

    const onChange = () => {
      if (!mounted) {
        return
      }

      setMatch(mq.matches)
    }

    mq.addEventListener('change', onChange)

    return () => {
      mounted = false
      mq.removeEventListener('change', onChange)
    }
  }, [query])

  return match
}
