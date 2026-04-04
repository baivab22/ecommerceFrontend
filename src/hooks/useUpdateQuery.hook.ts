// import {update} from '@react-spring/web'
// import {useSearchParams} from 'react-router-dom'

// export const useUpdateQuery = () => {
//   let [searchParams, setSearchParams] = useSearchParams()
//   console.log(searchParams, 'search params ')
//   const updateQueryFunction = (queryList: {[key: string]: any}) => {
//     const filteredObject = {}

//     // Loop through the original object
//     for (const key in queryList) {
//       // Check if the value is not undefined or null
//       if (queryList[key] !== undefined && queryList[key] !== null) {
//         filteredObject[key] = queryList[key]
//       }
//     }

//     setSearchParams(filteredObject)
//   }

//   return {updateQuery: updateQueryFunction}
// }

import {useSearchParams} from 'react-router-dom'

type QueryObject = {[key: string]: string | number | undefined | null}

export const useUpdateQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const updateQuery = (query: QueryObject) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString())

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key]

        if (value === undefined || value === null) {
          updatedSearchParams.delete(key)
        } else {
          updatedSearchParams.set(key, value as string)
        }
      }
    }

    setSearchParams(updatedSearchParams)
  }
  return updateQuery
}
