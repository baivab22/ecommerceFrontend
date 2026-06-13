// import React, {useCallback, useEffect, useState} from 'react'
// import {Button, InputField, Label, VStack} from 'src/app/common'
// import {useParams} from 'src/hooks'
// import {useDispatch, useSelector} from 'src/store'
// import {
//   updateSubCategoryActionNested,
//   createSubCategoryActionNested,
//   getSubCategoryDetailByIdActionNested
// } from '../subCategory.slice'
// import toast from 'react-hot-toast'
// import {useNavigate} from 'react-router-dom'

// export const AddSubCategoryPageNested = () => {
//   const {
//     updateSubCategoryLoadingNested,
//     createSubCategoryLoadingNested,
//     subCategoryDetailLoading,
//     subCategoryDetailDataNested
//   }: any = useSelector((state: any) => state.subCategoryNested)
//   const navigate = useNavigate()
//   const id: any = useParams()
//   console.log(id, 'id value final')

//   // const subCategoryId = useParams('subCategoryIdNested')
//   const [data, setData] = useState<any>({
//     name: ''
//   })
//   const dispatch = useDispatch()

//   useEffect(() => {
//     console.log(id.subCategoryIdnested, 'subCategorydI')
//     dispatch(
//       getSubCategoryDetailByIdActionNested({
//         subCategoryId: id.subCategoryIdnested as string
//       })
//     )
//   }, [id.subCategoryIdnested])

//   useEffect(() => {
//     console.log(subCategoryDetailDataNested, 'subCategoryDetailData')
//     setData((prev: any) => ({...prev, name: subCategoryDetailDataNested?.name}))
//   }, [subCategoryDetailDataNested])

//   const addSubCategoryHandler = () => {
//     !id?.subCategoryIdnested
//       ? dispatch(
//           createSubCategoryActionNested({
//             subCategoryBody: {name: data.name},
//             onSuccess: (data: any) => {
//               navigate('/dash-subCategorynested')
//               toast.success('Sub Category Created')
//             }
//           })
//         )
//       : dispatch(
//           updateSubCategoryActionNested({
//             subCategoryBody: {name: data.name},
//             subCategoryId: id.subCategoryIdnested as string,
//             onSuccess: (data: any) => {
//               toast.success('subCategory Updated Successfully')
//               navigate('/dash-subCategorynested')
//             }
//           })
//         )
//   }

//   return (
//     <VStack gap="$3" style={{padding:'12px 20px'}}>
//       <VStack gap="$2">
//         <Label required labelName="Sub Category Name"></Label>

//         <InputField
//           type="text"
//           placeholder="Enter SubCategory Name"
//           onChange={(e: any) =>
//             setData((prev: any) => ({
//               ...prev,
//               name: e.target.value
//             }))
//           }
//           value={data.name}
//         ></InputField>
//       </VStack>

//       <Button
//         title={
//           id.subCategoryIdnested ? 'Update SubCategory' : 'Add SubCategory'
//         }
//         onClick={addSubCategoryHandler}
//         loading={
//           id.subCategoryIdnested
//             ? updateSubCategoryLoadingNested
//             : createSubCategoryLoadingNested
//         }
//       ></Button>
//     </VStack>
//   )
// }

import React, {useCallback, useEffect, useState} from 'react'
import {Button, InputField, Label, VStack} from 'src/app/common'
import {useParams} from 'src/hooks'
import {useDispatch, useSelector} from 'src/store'
import {
  updateSubCategoryActionNested,
  createSubCategoryActionNested,
  getSubCategoryDetailByIdActionNested
} from '../subCategory.slice'
import toast from 'react-hot-toast'
// import { useRouter } from 'next/router'
 import {useNavigate} from 'react-router-dom'

export const AddSubCategoryPageNested = () => {
  const {
    updateSubCategoryLoadingNested,
    createSubCategoryLoadingNested,
    subCategoryDetailLoading,
    subCategoryDetailDataNested
  }: any = useSelector((state: any) => state.subCategoryNested)
  const navigate=useNavigate();
  const id: any = useParams()
  console.log(id, 'id value final')

  // const subCategoryId = useParams('subCategoryIdNested')
  const [data, setData] = useState<any>({
    name: ''
  })
  const dispatch = useDispatch()

  useEffect(() => {
    console.log(id.subCategoryIdnested, 'subCategorydI')
    // Only fetch detail if we're in edit mode (has subCategoryIdnested)
    if (id.subCategoryIdnested) {
      dispatch(
        getSubCategoryDetailByIdActionNested({
          subCategoryId: id.subCategoryIdnested as string
        })
      )
    } else {
      // If in add mode, clear the data
      setData({name: ''})
    }
  }, [id.subCategoryIdnested])

  useEffect(() => {
    console.log(subCategoryDetailDataNested, 'subCategoryDetailData')
    // Only set data if we're actually editing and have detail data
    if (id.subCategoryIdnested && subCategoryDetailDataNested) {
      setData((prev: any) => ({...prev, name: subCategoryDetailDataNested?.name}))
    }
  }, [subCategoryDetailDataNested, id.subCategoryIdnested])

  const addSubCategoryHandler = () => {
    !id?.subCategoryIdnested
      ? dispatch(
          createSubCategoryActionNested({
            subCategoryBody: {name: data.name},
            onSuccess: (data: any) => {
              navigate('/dash-subCategorynested')
              toast.success('Sub Category Created')
            }
          })
        )
      : dispatch(
          updateSubCategoryActionNested({
            subCategoryBody: {name: data.name},
            subCategoryId: id.subCategoryIdnested as string,
            onSuccess: (data: any) => {
              toast.success('subCategory Updated Successfully')
              navigate('/dash-subCategorynested')
            }
          })
        )
  }
  return (
    <VStack gap="$3" style={{padding:'12px 20px'}}>
      <VStack gap="$2">
        <Label required labelName="Nested Sub Category Name"></Label>

        <InputField
          type="text"
          placeholder="Enter Nested SubCategory Name"
          onChange={(e: any) =>
            setData((prev: any) => ({
              ...prev,
              name: e.target.value
            }))
          }
          value={data.name}
        ></InputField>
      </VStack>

      <Button
        title={
          id.subCategoryIdnested ? 'Update Nested SubCategory' : 'Add Nested Subcategory'
        }
        onClick={addSubCategoryHandler}
        loading={
          id.subCategoryIdnested
            ? updateSubCategoryLoadingNested
            : createSubCategoryLoadingNested
        }
      ></Button>
    </VStack>
  )
}
