import {ChangeEvent, ReactNode, useEffect, useState, useRef} from 'react'
import {MdSearch} from 'react-icons/md'

import {InputField} from 'src/app/common'
import {useDebounceValue} from 'src/hooks'

export const SearchInput = ({
  title,
  append,
  onChangeHandler,
  onFocusHandler
}: {
  title?: string
  append?: ReactNode
  onChangeHandler?: (arg?: any) => void
  onFocusHandler?: (arg?: any) => void
}) => {
  const [searchInput, setSearchInput] = useState('')
  const searchFlag = useRef(false)
  const searchValue = useDebounceValue(searchInput)

  useEffect(() => {
    searchFlag.current && onChangeHandler?.(searchValue)
    return () => {
      searchFlag.current = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])


  

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        gap: 10
      }}
    >
      <InputField
        name="Search"
        placeholder={`Search ${title ?? `item`}`}
        type="text"
        value={searchInput}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearchInput(e.target.value)
        }}

    
      />
      {append}
    </div>
  )
}
