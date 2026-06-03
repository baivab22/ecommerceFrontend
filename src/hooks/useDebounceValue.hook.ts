import React, {useRef} from 'react'

export const useDebounceValue = <T>(value: T, timeout?: number) => {
  const [searchValue, setSearchValue] = React.useState<T>(value)

  const handlerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    handlerRef.current = setTimeout(function () {
      setSearchValue(value)
    }, timeout ?? 500)
    return () => {
      if (handlerRef.current !== null) {
        clearTimeout(handlerRef.current)
      }
    }
  }, [value, timeout])
  return searchValue
}
