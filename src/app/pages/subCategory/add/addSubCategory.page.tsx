import React, {useEffect, useMemo, useState} from 'react'
import {Button, InputField, Label, SelectField, VStack} from 'src/app/common'
import {useParams} from 'src/hooks'
import {useDispatch, useSelector} from 'src/store'
import {
  updateSubCategoryAction,
  createSubCategoryAction,
  getSubCategoryDetailByIdAction
} from '../subCategory.slice'
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import {
  getSubCategoryDetailByIdActionNested,
  getSubCategoryListActionNested
} from '../../subCategoryNested/subCategory.slice'

export const AddSubCategoryPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const subCategoryId = useParams('subCategoryId')

  const {
    updateSubCategoryLoading,
    createSubCategoryLoading,
    subCategoryDetailData
  }: any = useSelector((state: any) => state.subCategory)


  console.log(subCategoryDetailData, 'subCategoryDetailData')

  // const {subCategoryDataNested} = useSelector(
  //   (state: any) => state.subCategoryNested
  // )


  const [subCategoryDataNested, setSubCategoryNested] = useState<any[]>([])

  // console.log(subCategoryDataNested, 'subCategoryDataNested')

  const [data, setData] = useState<any>({name: ''})
  const [selectedSubCategories, setSelectedSubCategories] = useState<any[]>([])

  /** 🔹 Fetch initial data */


useEffect(() => {
  dispatch(
    getSubCategoryListActionNested({
      onSuccess: (data) => {
setSubCategoryNested(data)


        console.log('Sub categoryList fetch Successfully')
      },
    })
  )
}, [dispatch])


console.log(subCategoryDataNested,"subCategoryDataNested in main" )


  useEffect(() => {

    if (subCategoryId) {
      dispatch(getSubCategoryDetailByIdAction({subCategoryId}))
      dispatch(getSubCategoryDetailByIdActionNested({subCategoryId}))
    }
  }, [subCategoryId, dispatch])

  /** 🔹 Map list to options */
  const subCategoryOptions = useMemo(
    () =>{

      console.log(subCategoryDataNested,"mapping to options")
      return subCategoryDataNested?.map((item: any) => ({
        id: item.id,
        label: item.name,
        value: item.name
      })) || []},
    [subCategoryDataNested]
  )


  console.log(subCategoryOptions, 'subCategoryOptions value')

  /** 🔹 Hydrate form name */
  useEffect(() => {
    if (subCategoryDetailData) {
      setData((prev: any) => ({...prev, name: subCategoryDetailData.name}))
    }
  }, [subCategoryDetailData])

  /** 🔹 Preselect subcategories by ID from detail */
  useEffect(() => {

    console.log(      subCategoryDetailData?.subCategories ,
      subCategoryDetailData?.subCategories?.length > 0 ,
      subCategoryOptions?.length > 0, 'check here')
    if (
      subCategoryDetailData?.subCategories &&
      subCategoryDetailData.subCategories.length > 0 &&
      subCategoryOptions.length > 0
    ) {
 const preSelected = subCategoryOptions.filter(opt =>
  subCategoryDetailData.subCategories.includes(opt.id)
)


console.log(preSelected, 'preSelected')

      setSelectedSubCategories(preSelected)
    }
  }, [subCategoryDetailData, subCategoryOptions])

  /** 🔹 Submit */
  const handleSubmit = () => {
    const body = {
      name: data.name,
      subCategories: selectedSubCategories.map((s) => s.id)
    }

    if (subCategoryId) {
      dispatch(
        updateSubCategoryAction({
          subCategoryBody: body,
          subCategoryId,
          onSuccess: () => {
            toast.success('SubCategory updated successfully')
            navigate('/dash-subCategory')
          }
        })
      )
    } else 
      dispatch(
        createSubCategoryAction({
          subCategoryBody: body,
          onSuccess: () => {
            toast.success('SubCategory created successfully')
            navigate('/dash-subCategory')
          }
        })
      )
    }
  

  return (
    <VStack gap="$3">
      {/* SubCategory Name */}
      <VStack gap="$2">
        <Label required labelName="Sub Category Name" />
        <InputField
          type="text"
          placeholder="Enter SubCategory Name"
          value={data.name}
          onChange={(e: any) =>
            setData((prev: any) => ({...prev, name: e.target.value}))
          }
        />
      </VStack>

      {/* SubCategories Select */}
      <VStack gap="$2">
        <Label required labelName="SubCategories" />
        <SelectField
          options={subCategoryOptions}
          value={selectedSubCategories}
          isSearchable
          isMulti
          onChangeValue={setSelectedSubCategories}
          placeholder="Select SubCategory"
        />
      </VStack>

      {/* Submit Button */}
      <Button
        title={subCategoryId ? 'Update SubCategory' : 'Add SubCategory'}
        onClick={handleSubmit}
        loading={subCategoryId ? updateSubCategoryLoading : createSubCategoryLoading}
      />
    </VStack>
  )
}
