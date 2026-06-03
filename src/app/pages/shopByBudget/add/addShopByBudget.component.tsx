import React, {useCallback, useEffect, useState} from 'react'
import {Button, InputField, Label, VStack} from 'src/app/common'

import {
  createShopByBudgetAction,
  deleteShopByBudgetAction,
  getShopByBudgetListAction
} from '../shopByBudget.slice'

import {useDispatch, useSelector} from 'src/store'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
export const AddShopByBudget = () => {
  const [shopByBudget, setShopByBudget] = useState<any>('')
  const dispatch = useDispatch()
  const router = useRouter()

  const {createShopByBudgetLoading, shopByBudgetData}: any = useSelector(
    (state: any) => state.shopByBudget
  )

  useEffect(() => {
    // Clear form when component mounts to ensure fresh state for add mode
    setShopByBudget('')
  }, [])
  const handleImage = useCallback((event: any) => {
    setShopByBudget((prev: any) => [...prev, event.target.value])
  }, [])

  useEffect(() => {
    dispatch(
      getShopByBudgetListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  const addShopByBudgetHandler = () => {
    dispatch(
      createShopByBudgetAction({
        shopByBudgetData: {name: shopByBudget},
        onSuccess: () => {
          toast.success('ShopBy Budget added Successfully')
          router.push('/dash-shopByBudget')
        }
      })
    )
  }
  return (
    <VStack gap="$5">
      <Label required labelName="Shop By Budget"></Label>
      <InputField
        type="text"
        placeholder="Enter Shop By Budget Price"
        onChange={(e: any) => setShopByBudget(e.target.value)}
        // value={shopByBudget}
      ></InputField>

      <Button
        title="Add Shop By Budget"
        onClick={addShopByBudgetHandler}
        loading={createShopByBudgetLoading}
      ></Button>
    </VStack>
  )
}
